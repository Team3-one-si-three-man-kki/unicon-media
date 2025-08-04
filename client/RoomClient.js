import { EventEmitter } from "./utils/EventEmitter.js";

export class RoomClient extends EventEmitter {
  constructor(uiManager) {
    super();
    this.uiManager = uiManager;

    this.ws = null;
    this.device = null;
    this.sendTransport = null;
    this.recvTransport = null;
    this.localStream = null;
    this.producers = new Map();
    this.consumers = new Map();
    this.producerIdToConsumer = new Map(); //   producerId -> consumer 맵
    this.producerToPeerIdMap = new Map(); // producerId -> peerId 맵 추가
    this.actionCallbackMap = new Map();
    this.pendingConsumeList = [];
    this.isAdmin = false;
    this.screenProducer = null; // 화면 공유 프로듀서
    this.myPeerId = null; // 자신의 peerId를 저장할 속성 추가
  }

  join(roomId, userName, userEmail, tenantId) {
    if (!roomId) {
      throw new Error("roomId is required to join a room");
    }
    const wsUrl = `wss://${process.env.WEBSOCKET_URL}/?roomId=${roomId}&userName=${encodeURIComponent(userName)}&userEmail=${encodeURIComponent(userEmail)}&tenantId=${encodeURIComponent(tenantId)}`;
    this.ws = new WebSocket(wsUrl);
    this.ws.onopen = () => {
      this.emit("connected", this.ws); // main.js에 연결 성공을 알림
      try {
        this.device = new window.mediasoupClient.Device();
        this.ws.send(JSON.stringify({ action: "getRtpCapabilities" }));
      } catch (err) {
        console.error("    Device creation failed:", err);
      }
    };

    this.ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);

      const cb = this.actionCallbackMap.get(msg.action);
      if (cb) {
        cb(msg);
        this.actionCallbackMap.delete(msg.action);
        return;
      }

      switch (msg.action) {
        case "adminInfo":
          this.isAdmin = msg.data.isAdmin;
          this.myPeerId = msg.data.peerId; // 이 시점에서 myPeerId가 설정됨
          this.emit("adminStatus", msg.data); // UI 매니저에게 알림
          break;
        case "canvas":
          this.emit("canvas", msg.data);
          break;
        case "rtpCapabilities":
          await this._handleRtpCapabilities(msg.data);
          break;
        case "createTransportResponse":
          await this._handleCreateTransportResponse(msg.data);
          break;
        case "createConsumerTransportResponse":
          await this._handleCreateConsumerTransportResponse(msg.data);
          break;
        case "existingProducers":
          await this._handleExistingProducers(msg.data);
          break;
        case "newProducerAvailable":
          await this._handleNewProducerAvailable(msg);
          break;
        // case "consumeResponse":
        //   await this._handleConsumeResponse(msg.data);
        //   break;
        case "producerClosed":
          this._handleProducerClosed(msg);
          break;
        case "producerStateChanged": {
          const { producerId, kind, state } = msg.data;
          if (state === "pause") {
            if (kind === "video")
              this.emit("remote-producer-pause", { producerId });
            if (kind === "audio")
              this.emit("remote-audio-pause", { producerId });
          } else if (state === "resume") {
            if (kind === "video")
              this.emit("remote-producer-resume", { producerId });
            if (kind === "audio")
              this.emit("remote-audio-resume", { producerId });
          }
          break;
        }
        // dominantSpeaker 이벤트 처리
        case "dominantSpeaker": {
          const { producerId, peerId } = msg.data;
          this.emit("dominantSpeaker", { producerId, peerId });
          break;
        }
        case "peerClosed": {
          this._handlePeerClosed(msg.data);
          break;
        }
      }
    };
  }

  sendPeerStatus(statusData) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          action: "updatePeerStatus",
          data: statusData,
        })
      );
    }
  }

  _waitForAction(actionName, callback) {
    this.actionCallbackMap.set(actionName, callback);
  }

  _handlePeerClosed({ peerId }) {
    // 이 peer가 남긴 모든 consumer를 찾아서 정리
    for (const consumer of this.consumers.values()) {
      if (consumer.appData.peerId === peerId) { // consumer 생성 시 peerId를 저장
        consumer.close();
        this.consumers.delete(consumer.id);
        this.emit('consumer-closed', { consumerId: consumer.id, peerId: peerId });
      }
    }
  }

  async _handleRtpCapabilities(data) {
    try {
      await this.device.load({ routerRtpCapabilities: data });
      this.ws.send(JSON.stringify({ action: "createTransport" }));
    } catch (err) {
      console.error("    Failed to load device capabilities:", err);
    }
  }

  async _handleCreateTransportResponse(data) {
    this.sendTransport = this.device.createSendTransport(data);

    this.sendTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
      this.ws.send(JSON.stringify({ action: "connectTransport", data: { dtlsParameters } }));
      this._waitForAction("transportConnected", callback);
    });

    this.sendTransport.on("produce", async ({ kind, rtpParameters, appData }, callback, errback) => {
      try {
        const { id } = await this._sendRequest("produce", { kind, rtpParameters, appData });
        this.emit('producer-created', { kind, producerId: id });
        callback({ id });
      } catch (error) {
        errback(error);
      }
    });

    if (!this.myPeerId) {
      await new Promise(resolve => this.once("adminStatus", resolve));
    }
    await this._startProducing();
  }

  async _startProducing() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true,
      });

      const videoElement = document.createElement("video");
      videoElement.id = "localVideo";
      videoElement.muted = true;
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.style.cssText = "height: 100%; width: 100%; object-fit: cover;";
      videoElement.srcObject = this.localStream;

      // 2. 생성된 video 요소와 peerId를 UI 로직으로 전달
      this.emit("localStreamReady", videoElement, this.myPeerId);

      const videoTrack = this.localStream.getVideoTracks()[0];
      const audioTrack = this.localStream.getAudioTracks()[0];

      // 3. produce를 호출하고, 반환된 실제 Producer 객체를 맵에 저장
      if (videoTrack) {
        const videoProducer = await this.sendTransport.produce({ track: videoTrack });
        this.producers.set(videoProducer.id, videoProducer);
      }
      if (audioTrack) {
        const audioProducer = await this.sendTransport.produce({ track: audioTrack });
        this.producers.set(audioProducer.id, audioProducer);
      }

      this.ws.send(JSON.stringify({ action: "deviceReady" }));
      this.emit("controlsReady");

    } catch (err) {
      console.error("CRITICAL: Failed to get user media.", err);
      alert(`카메라/마이크를 가져올 수 없습니다: ${err.name}`);
    }
  }

  async _handleCreateConsumerTransportResponse(data) {
    this.recvTransport = this.device.createRecvTransport(data);
    this.recvTransport.on("connect", ({ dtlsParameters }, callback) => {
      this.ws.send(
        JSON.stringify({
          action: "connectConsumerTransport",
          data: { dtlsParameters },
        })
      );
      this._waitForAction("consumerTransportConnected", callback);
    });

    //    recvTransport가 준비되었으므로, 대기 중인 모든 consumer를 처리
    const pendingConsumes = [...this.pendingConsumeList];
    this.pendingConsumeList = [];
    for (const consumeData of pendingConsumes) {
      await this._consume(consumeData);
    }
  }

  async _handleExistingProducers(producers) {
    for (const producer of producers) {
      this.pendingConsumeList.push(producer);
    }

    //    recvTransport가 아직 없으면 생성을 요청하고,
    //    이미 있다면 바로 대기열을 처리하여 타이밍 문제를 해결.
    if (!this.recvTransport) {
      this.ws.send(JSON.stringify({ action: "createConsumerTransport" }));
    } else {
      const pendingConsumes = [...this.pendingConsumeList];
      this.pendingConsumeList = [];
      for (const consumeData of pendingConsumes) {
        await this._consume(consumeData);
      }
    }
  }

  async _handleNewProducerAvailable(producerInfo) {
    const { producerId, kind, appData } = producerInfo;
    const consumeData = { producerId, kind, appData }; // appData도 전달

    //    recvTransport가 없으면 대기열에 추가
    if (!this.recvTransport) {
      this.pendingConsumeList.push(consumeData);
    } else {
      await this._consume(consumeData);
    }
  }

  async _consume({ producerId, kind, appData }) {
    //    중복 consumer 생성을 방지하는 가드
    if (this.producerIdToConsumer.has(producerId)) {
      console.warn(
        `Consumer for producer ${producerId} already exists. Skipping.`
      );
      return;
    }
    if (!this.recvTransport) {
      console.warn("recvTransport is not ready, queuing consume request");
      this.pendingConsumeList.push({ producerId, kind });
      return;
    }
    try {
      const data = await this._sendRequest("consume", {
        rtpCapabilities: this.device.rtpCapabilities,
        producerId,
        kind,
      });

      const consumer = await this.recvTransport.consume({
        id: data.id,
        producerId: data.producerId,
        kind: data.kind,
        rtpParameters: data.rtpParameters,
        appData: { ...appData }, // 서버에서 받은 appData를 consumer에 저장
      });
      this.consumers.set(consumer.id, consumer);
      this.producerIdToConsumer.set(producerId, consumer); //    새 맵에 추가
      // peerId를 consumer의 appData에서 가져와 producerIdToPeerIdMap에 저장
      if (appData && appData.peerId) {
        this.producerToPeerIdMap.set(producerId, appData.peerId);
      }

      // UI 매니저가 화면에 그릴 수 있도록 이벤트를 발생
      this.emit("new-consumer", consumer);

      // 4. 생성된 consumer를 즉시 resume하도록 서버에 요청
      this.ws.send(
        JSON.stringify({
          action: "resumeConsumer",
          data: { consumerId: consumer.id },
        })
      );
    } catch (error) {
      console.error(`    Failed to create consumer for ${producerId}:`, error);
    }
  }

  _handleProducerClosed({ producerId }) {
    const consumer = this.producerIdToConsumer.get(producerId);
    if (consumer) {
      consumer.close();
      this.consumers.delete(consumer.id);
      this.producerIdToConsumer.delete(producerId);
    }

    // producerIdToPeerIdMap에서 peerId를 찾아 제거
    const peerId = this.producerToPeerIdMap.get(producerId);
    if (peerId) {
      this.producerToPeerIdMap.delete(producerId);
    }

    // 화면 공유 프로듀서가 닫혔는지 확인하고, 그렇다면 UI에 알림
    const isScreenShareProducer =
      this.screenProducer && this.screenProducer.id === producerId;
    // 로컬 비디오 프로듀서가 닫혔는지 확인
    const producer = this.producers.get(producerId);
    const isLocalVideoProducer = producer && producer.kind === 'video' && (producer.appData && !producer.appData.source);

    this.emit("producer-closed", { producerId, isScreenShareProducer, isLocalVideoProducer, peerId });
  }
  async _sendRequest(action, data) {
    return new Promise((resolve, reject) => {
      const callbackAction = `${action}Response`;
      this._waitForAction(callbackAction, (response) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response.data);
        }
      });
      this.ws.send(JSON.stringify({ action, data }));
    });
  }
  //    오디오 트랙을 끄거나 켬
  async setAudioEnabled(enabled) {
    const audioProducer = this._findProducerByKind("audio");
    if (!audioProducer) return;

    if (enabled) {
      await audioProducer.resume();
    } else {
      await audioProducer.pause();
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          action: "changeProducerState",
          data: {
            producerId: audioProducer.id,
            kind: "audio",
            action: enabled ? "resume" : "pause",
          },
        })
      );
    }
  }

  //    비디오 트랙을 끄거나 켬
  async setVideoEnabled(enabled) {
    const videoProducer = this._findProducerByKind("video", "webcam");
    if (!videoProducer) return;

    if (enabled) {
      await videoProducer.resume();
    } else {
      await videoProducer.pause();
    }

    this.emit("localVideoStateChanged", enabled);

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          action: "changeProducerState",
          data: {
            producerId: videoProducer.id,
            kind: "video",
            action: enabled ? "resume" : "pause",
          },
        })
      );
    }
  }
  _findProducerByKind(kind, source) {
    for (const producer of this.producers.values()) {
      if (producer.kind !== kind) {
        continue;
      }

      if (!source) {
        return producer;
      }
      const producerSource = producer.appData?.source || "webcam";
      if (producerSource === source) {
        return producer;
      }
    }
    return null;
  }

  //    화면 공유 시작
  async startScreenShare() {
    if (this.screenProducer) {
      console.warn("Screen sharing is already active.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const track = stream.getVideoTracks()[0];

      this.screenProducer = await this.sendTransport.produce({
        track,
        appData: { source: "screen" },
      });

      // 브라우저의 '공유 중지' 버튼 클릭 감지
      track.onended = () => {
        this.stopScreenShare();
      };

      this.producers.set(this.screenProducer.id, this.screenProducer);
      this.emit("screenShareState", { isSharing: true });
      this.emit("local-screen-share-started", this.screenProducer.track); //    로컬 UI를 위한 이벤트
    } catch (err) {
      console.error("    Failed to start screen sharing:", err);
    }
  }

  //    화면 공유 중지
  async stopScreenShare() {
    if (!this.screenProducer) {
      console.warn("No active screen share to stop.");
      return;
    }
    // 서버에 화면 공유 중지를 명시적으로 요청
    this.ws.send(
      JSON.stringify({
        action: "stopScreenShare",
        data: { producerId: this.screenProducer.id },
      })
    );

    // 로컬 프로듀서 정리
    const producerId = this.screenProducer.id;
    this.screenProducer.close(); // 스트림을 닫고 'close' 이벤트를 발생시킴
    this.producers.delete(producerId);
    this.screenProducer = null;
    this.emit("screenShareState", { isSharing: false });
    this.emit("local-screen-share-stopped"); //    로컬 UI 정리를 위한 이벤트
  }
}
