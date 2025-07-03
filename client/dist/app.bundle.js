(function () {
  'use strict';

  // client/utils/EventEmitter.js

  class EventEmitter {
    constructor() {
      this.events = {};
    }

    // 이벤트 구독
    on(eventName, listener) {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      this.events[eventName].push(listener);
    }

    // 이벤트 방송
    emit(eventName, ...args) {
      if (this.events[eventName]) {
        this.events[eventName].forEach((listener) => listener(...args));
      }
    }
  }

  // client/RoomClient.js (최종 완성 버전)

  class RoomClient extends EventEmitter {
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

    join() {
      this.ws = new WebSocket("wss://192.168.5.133:3000");

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
          case "consumeResponse":
            await this._handleConsumeResponse(msg.data);
            break;
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
            const { id } = await this._sendRequest("produce", {
              kind,
              rtpParameters,
            });
            callback({ id });
            this.producers.set(id, { kind });
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
        const { id, rtpParameters } = await this._sendRequest("consume", {
          rtpCapabilities: this.device.rtpCapabilities,
          producerId,
          kind,
        });

        const consumer = await this.recvTransport.consume({
          id,
          producerId,
          kind,
          rtpParameters,
        });
        this.consumers.set(consumer.id, consumer);
        this.emit("new-consumer", consumer);
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

  // client/UIManager.js

  // 이 상수는 그림을 그리는 UIManager가 가지고 있는 것이 더 적합합니다.
  const FACE_LANDMARKS_CONNECTORS = [
    { start: 61, end: 146 },
    { start: 146, end: 91 },
    { start: 91, end: 181 },
    { start: 181, end: 84 },
    { start: 84, end: 17 },
    { start: 17, end: 314 },
    { start: 314, end: 405 },
    { start: 405, end: 321 },
    { start: 321, end: 375 },
    { start: 375, end: 291 },
    { start: 61, end: 185 },
    { start: 185, end: 40 },
    { start: 40, end: 39 },
    { start: 39, end: 37 },
    { start: 37, end: 0 },
    { start: 0, end: 267 },
    { start: 267, end: 269 },
    { start: 269, end: 270 },
    { start: 270, end: 409 },
    { start: 409, end: 291 },
    { start: 78, end: 95 },
    { start: 95, end: 88 },
    { start: 88, end: 178 },
    { start: 178, end: 87 },
    { start: 87, end: 14 },
    { start: 14, end: 317 },
    { start: 317, end: 402 },
    { start: 402, end: 318 },
    { start: 318, end: 324 },
    { start: 324, end: 308 },
    { start: 78, end: 191 },
    { start: 191, end: 80 },
    { start: 80, end: 81 },
    { start: 81, end: 82 },
    { start: 82, end: 13 },
    { start: 13, end: 312 },
    { start: 312, end: 311 },
    { start: 311, end: 310 },
    { start: 310, end: 415 },
    { start: 415, end: 308 },
    // Left eye
    { start: 362, end: 382 },
    { start: 382, end: 381 },
    { start: 381, end: 380 },
    { start: 380, end: 373 },
    { start: 373, end: 374 },
    { start: 374, end: 390 },
    { start: 390, end: 249 },
    { start: 249, end: 362 },
    // Left eyebrow
    { start: 336, end: 296 },
    { start: 296, end: 334 },
    { start: 334, end: 293 },
    { start: 293, end: 300 },
    { start: 300, end: 276 },
    // Right eye
    { start: 33, end: 7 },
    { start: 7, end: 163 },
    { start: 163, end: 144 },
    { start: 144, end: 145 },
    { start: 145, end: 153 },
    { start: 153, end: 154 },
    { start: 154, end: 155 },
    { start: 155, end: 33 },
    // Right eyebrow
    { start: 107, end: 66 },
    { start: 66, end: 105 },
    { start: 105, end: 63 },
    { start: 63, end: 70 },
    { start: 70, end: 46 },
    // Face oval
    { start: 10, end: 338 },
    { start: 338, end: 297 },
    { start: 297, end: 332 },
    { start: 332, end: 284 },
    { start: 284, end: 251 },
    { start: 251, end: 389 },
    { start: 389, end: 356 },
    { start: 356, end: 454 },
    { start: 454, end: 323 },
    { start: 323, end: 361 },
    { start: 361, end: 288 },
    { start: 288, end: 397 },
    { start: 397, end: 365 },
    { start: 365, end: 379 },
    { start: 379, end: 378 },
    { start: 378, end: 400 },
    { start: 400, end: 377 },
    { start: 377, end: 152 },
    { start: 152, end: 148 },
    { start: 148, end: 176 },
    { start: 176, end: 149 },
    { start: 149, end: 150 },
    { start: 150, end: 136 },
    { start: 136, end: 172 },
    { start: 172, end: 58 },
    { start: 58, end: 132 },
    { start: 132, end: 93 },
    { start: 93, end: 234 },
    { start: 234, end: 127 },
    { start: 127, end: 162 },
    { start: 162, end: 21 },
    { start: 21, end: 54 },
    { start: 54, end: 103 },
    { start: 103, end: 67 },
    { start: 67, end: 109 },
    { start: 109, end: 10 },
  ];

  class UIManager {
    constructor() {
      this.canvas = document.getElementById("localCanvas");
      this.canvasCtx = this.canvas.getContext("2d");
      this.video = document.getElementById("localVideo");
      this.remoteMediaContainer = document.getElementById("remoteMediaContainer");

      if (!this.remoteMediaContainer) {
        console.error(
          "❌ UIManager: #remoteMediaContainer 요소를 찾을 수 없습니다!"
        );
      } else {
        console.log("✅ UIManager: #remoteMediaContainer 요소 초기화 완료.");
      }
    }

    drawFaceMesh(landmarks) {
      // 캔버스 크기를 비디오 크기에 맞춥니다.
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
      this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if (!landmarks) return;

      // 선 스타일 설정
      this.canvasCtx.strokeStyle = "rgba(0, 255, 0, 0.7)";
      this.canvasCtx.lineWidth = 1.5;

      for (const connection of FACE_LANDMARKS_CONNECTORS) {
        const start = landmarks[connection.start];
        const end = landmarks[connection.end];
        if (start && end) {
          this.canvasCtx.beginPath();
          this.canvasCtx.moveTo(
            start.x * this.canvas.width,
            start.y * this.canvas.height
          );
          this.canvasCtx.lineTo(
            end.x * this.canvas.width,
            end.y * this.canvas.height
          );
          this.canvasCtx.stroke();
        }
      }
    }

    // 원격 비디오 엘리먼트 생성 등 다른 UI 관련 로직도 여기에 추가...
    addRemoteTrack(track, producerId) {
      if (!this.remoteMediaContainer) {
        console.error(
          "❌ UIManager.addRemoteTrack: remoteMediaContainer가 유효하지 않습니다. 원격 트랙을 추가할 수 없습니다."
        );
        return;
      }

      const element = document.createElement(track.kind);
      element.id = `remote-${producerId}`;
      element.autoplay = true;
      element.playsInline = true;
      if (track.kind === "video") {
        element.controls = true;
      }
      element.srcObject = new MediaStream([track]);

      this.remoteMediaContainer.appendChild(element);
      console.log(
        `📺 Added remote ${track.kind} element for producer ${producerId}`
      );
    }

    removeRemoteTrack(producerId) {
      const element = document.getElementById(`remote-${producerId}`);
      if (element) {
        element.remove();
        console.log(`🗑️ Removed element for producer ${producerId}`);
      }
    }
  }

  // client/main.js

  // --- 애플리케이션 시작 ---
  document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Application starting...");

    const uiManager = new UIManager();
    const roomClient = new RoomClient(uiManager);

    // ✅ RoomClient가 방송하는 이벤트를 구독하여 UIManager에 작업을 지시합니다.
    roomClient.on("new-consumer", (consumer) => {
      console.log("🎧 Event: new-consumer -> UI Manager adding remote track.");
      uiManager.addRemoteTrack(consumer.track, consumer.producerId);
    });

    roomClient.on("producer-closed", (producerId) => {
      console.log(
        "🎧 Event: producer-closed -> UI Manager removing remote track."
      );
      uiManager.removeRemoteTrack(producerId);
    });

    // 화상회의 클라이언트의 모든 준비를 시작합니다.
    roomClient.join();
  });

})();
//# sourceMappingURL=app.bundle.js.map
