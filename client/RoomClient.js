// client/RoomClient.js (최종 완성 버전)
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
    this.actionCallbackMap = new Map();
    this.pendingConsumeList = [];
  }

  join(roomId) {
    // ✅ roomId를 인자로 받습니다.
    if (!roomId) {
      throw new Error("roomId is required to join a room");
    }
    // ✅ WebSocket 접속 주소에 roomId를 쿼리 파라미터로 추가합니다.
    this.ws = new WebSocket(`wss://192.168.0.11:3000/?roomId=${roomId}`);

    this.ws.onopen = () => {
      console.log("✅ WebSocket connected");
      try {
        this.device = new window.mediasoupClient.Device();
        this.ws.send(JSON.stringify({ action: "getRtpCapabilities" }));
      } catch (err) {
        console.error("❌ Device creation failed:", err);
      }
    };

    this.ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      console.log("📩 Received:", msg);

      const cb = this.actionCallbackMap.get(msg.action);
      if (cb) {
        cb(msg);
        this.actionCallbackMap.delete(msg.action);
        return;
      }

      switch (msg.action) {
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

  async _handleRtpCapabilities(data) {
    try {
      await this.device.load({ routerRtpCapabilities: data });
      console.log("✅ Device loaded successfully");
      this.ws.send(JSON.stringify({ action: "createTransport" }));
    } catch (err) {
      console.error("❌ Failed to load device capabilities:", err);
    }
  }

  async _handleCreateTransportResponse(data) {
    this.sendTransport = this.device.createSendTransport(data);

    this.sendTransport.on(
      "connect",
      ({ dtlsParameters }, callback, errback) => {
        this.ws.send(
          JSON.stringify({
            action: "connectTransport",
            data: { dtlsParameters },
          })
        );
        this._waitForAction("transportConnected", callback);
      }
    );

    this.sendTransport.on(
      "produce",
      async ({ kind, rtpParameters, appData }, callback, errback) => {
        try {
          console.log(`🎬 Producing ${kind}...`);
          // _sendRequest를 사용하여 서버에 produce 요청을 보냅니다.
          const { id } = await this._sendRequest("produce", {
            kind,
            rtpParameters,
            appData,
          });
          console.log(`✅ ${kind} production started with server id: ${id}`);
          callback({ id });
          // this.producers.set(id, { kind });
        } catch (error) {
          errback(error);
        }
      }
    );

    await this._startProducing();
  }

  async _startProducing() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true,
      });
      const videoElement = document.getElementById("localVideo");
      videoElement.srcObject = this.localStream;

      videoElement.oncanplay = () => {
        videoElement.oncanplay = null;
        console.log("✅ Video element is ready to play.");
        this.emit("localStreamReady", videoElement); // AI 모듈이 videoElement를 참조할 수 있도록 전달

        (async () => {
          const videoTrack = this.localStream.getVideoTracks()[0];
          const audioTrack = this.localStream.getAudioTracks()[0];
          if (videoTrack)
            await this.sendTransport.produce({ track: videoTrack });
          if (audioTrack)
            await this.sendTransport.produce({ track: audioTrack });

          this.ws.send(JSON.stringify({ action: "deviceReady" }));
        })();
      };
    } catch (err) {
      console.error("❌ CRITICAL: Failed to get user media.", err);
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

    // ✅ recvTransport가 준비되었으므로, 대기 중인 모든 consumer를 처리합니다.
    const pendingConsumes = [...this.pendingConsumeList];
    this.pendingConsumeList = [];
    console.log(
      `✅ RecvTransport ready. Processing ${pendingConsumes.length} pending consumers.`
    );
    for (const consumeData of pendingConsumes) {
      await this._consume(consumeData);
    }
  }

  async _handleExistingProducers(producers) {
    console.log(`📋 Found ${producers.length} existing producers.`);
    for (const producer of producers) {
      this.pendingConsumeList.push(producer);
    }

    // ✅ recvTransport가 아직 없으면 생성을 요청하고,
    //    이미 있다면 바로 대기열을 처리하여 타이밍 문제를 해결합니다.
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

  async _handleNewProducerAvailable(producer) {
    console.log("🆕 A new producer is available.", producer);
    const consumeData = {
      producerId: producer.producerId,
      kind: producer.kind,
    };
    // ✅ recvTransport가 없으면 대기열에 추가하고, 있으면 바로 consume을 시도합니다.
    if (!this.recvTransport) {
      this.pendingConsumeList.push(consumeData);
    } else {
      await this._consume(consumeData);
    }
  }

  async _consume({ producerId, kind }) {
    console.log(`📡 Requesting to consume producer ${producerId}`);
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
      });
      this.consumers.set(consumer.id, consumer);

      // UI 매니저가 화면에 그릴 수 있도록 이벤트를 발생시킵니다.
      this.emit("new-consumer", consumer);

      // 4. 생성된 consumer를 즉시 resume하도록 서버에 요청합니다.
      console.log(`🚀 Resuming consumer ${consumer.id}`);
      this.ws.send(
        JSON.stringify({
          action: "resumeConsumer",
          data: { consumerId: consumer.id },
        })
      );
    } catch (error) {
      console.error(`❌ Failed to create consumer for ${producerId}:`, error);
    }
  }

  _handleProducerClosed({ producerId }) {
    console.log(`🚫 Producer ${producerId} closed.`);
    this.emit("producer-closed", producerId);
  }

  async _sendRequest(action, data) {
    return new Promise((resolve, reject) => {
      const callbackAction = `${action}Response`;
      this._waitForAction(callbackAction, (response) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(
            response.id ? { id: response.id, ...response.data } : response.data
          );
        }
      });
      this.ws.send(JSON.stringify({ action, data }));
    });
  }
}
