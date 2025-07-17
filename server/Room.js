// server/Room.js (모든 핸들러가 포함된 최종 완성 버전)
import { WebSocket } from "ws";
import { createWebRtcTransport } from "./media-server.js";

export class Room {
  constructor(roomId, router) {
    this.id = roomId;
    this.router = router;
    this.peers = new Map();
    this.adminPeerId = null; // ✅ 관리자 peerId 저장

    //1. 오디오 레벨 감지를 위한 observer와 상태 변수
    this.audioLevelObserver = null;
    this.dominantSpeaker = null;
    this._startAudioLevelObserver(); // 생성자에서 바로 옵저버 시작
  }

  // ✅ 2. AudioLevelObserver를 생성하고 이벤트를 구독하는 메소드
  async _startAudioLevelObserver() {
    this.audioLevelObserver = await this.router.createAudioLevelObserver({
      maxEntries: 1,
      threshold: -80,
      interval: 800, // 800ms 마다 가장 큰 소리를 내는 사람을 감지
    });

    this.audioLevelObserver.on("volumes", (volumes) => {
      const { producer, volume } = volumes[0];

      // 현재 발언자가 바뀌었을 때만 클라이언트에게 알림
      if (this.dominantSpeaker?.producerId !== producer.id) {
        this.dominantSpeaker = {
          producerId: producer.id,
          peerId: producer.appData.peerId,
        };
        console.log(
          `[Room ${this.id}] 🎤 New dominant speaker: peer ${this.dominantSpeaker.peerId}`
        );

        this.broadcast(null, {
          // 모든 사람에게 방송
          action: "dominantSpeaker",
          data: {
            producerId: producer.id,
            peerId: this.dominantSpeaker.peerId,
          },
        });
      }
    });

    this.audioLevelObserver.on("silence", () => {
      // 방이 조용해지면 발언자 정보를 초기화
      if (this.dominantSpeaker) {
        this.dominantSpeaker = null;
        console.log(`[Room ${this.id}] 🎤 Silence detected`);
        this.broadcast(null, {
          action: "dominantSpeaker",
          data: { producerId: null },
        });
      }
    });
  }

  addPeer(peer) {
    this.peers.set(peer.peerId, peer);
    // ✅ 첫 번째로 입장한 사용자를 관리자로 지정
    if (!this.adminPeerId) {
      this.adminPeerId = peer.peerId;
      console.log(`[Room ${this.id}] 👑 Admin is ${peer.peerId}`);
    }

    // ✅ 현재 접속한 peer에게 관리자 여부와 ID를 알려줌
    peer.ws.send(
      JSON.stringify({
        action: "adminInfo",
        data: {
          isAdmin: peer.peerId === this.adminPeerId,
          adminPeerId: this.adminPeerId,
          peerId: peer.peerId, // Add the peer's own ID
        },
      })
    );
  }

  removePeer(peerId) {
    this.peers.delete(peerId);
  }

  getProducerListForPeer(peerId) {
    const producerList = [];
    for (const otherPeer of this.peers.values()) {
      // ✅ 자기 자신의 producer는 목록에 포함하지 않습니다.
      if (otherPeer.peerId === peerId) continue;
      for (const producer of otherPeer.producers.values()) {
        producerList.push({
          producerId: producer.id,
          kind: producer.kind,
          appData: producer.appData, // ✅ appData 추가
        });
      }
    }
    return producerList;
  }

  broadcast(senderId, message) {
    for (const peer of this.peers.values()) {
      if (peer.peerId !== senderId && peer.ws.readyState === WebSocket.OPEN) {
        peer.ws.send(JSON.stringify(message));
      }
    }
  }

  broadcastToAll(message) {
    for (const peer of this.peers.values()) {
      if (peer.ws.readyState === WebSocket.OPEN) {
        peer.ws.send(JSON.stringify(message));
      }
    }
  }

  // ✅ 모든 시그널링 액션을 처리하도록 완성된 메소드
  async handleMessage(peer, msg) {
    const { action, data } = msg;

    switch (action) {
      case "getRtpCapabilities": {
        peer.ws.send(
          JSON.stringify({
            action: "rtpCapabilities",
            data: this.router.rtpCapabilities,
          })
        );
        break;
      }

      case "deviceReady": {
        peer.deviceReady = true;
        const producerList = this.getProducerListForPeer(peer.peerId);
        peer.ws.send(
          JSON.stringify({
            action: "existingProducers",
            data: producerList,
          })
        );
        break;
      }

      case "createTransport": {
        // ✅ 이제 send/recv를 하나의 transport로 관리합니다.
        const transport = await createWebRtcTransport(this.router);
        peer.transport = transport;

        peer.ws.send(
          JSON.stringify({
            action: "createTransportResponse",
            data: {
              id: transport.id,
              iceParameters: transport.iceParameters,
              iceCandidates: transport.iceCandidates,
              dtlsParameters: transport.dtlsParameters,
            },
          })
        );
        break;
      }
      // ✅ 새로 추가할 부분: createConsumerTransport 액션 처리
      case "createConsumerTransport": {
        const transport = await createWebRtcTransport(this.router);
        peer.recvTransport = transport; // peer 객체에 recvTransport 저장

        peer.ws.send(
          JSON.stringify({
            action: "createConsumerTransportResponse",
            data: {
              id: transport.id,
              iceParameters: transport.iceParameters,
              iceCandidates: transport.iceCandidates,
              dtlsParameters: transport.dtlsParameters,
            },
          })
        );

        transport.on("dtlsstatechange", (dtlsState) => {
          if (dtlsState === "closed") {
            console.log("Consumer transport DTLS closed");
            peer.recvTransport = null;
          }
        });
        transport.on("close", () => {
          console.log("Consumer transport closed");
          peer.recvTransport = null;
        });
        break;
      }
      case "connectTransport": {
        await peer.transport.connect({ dtlsParameters: data.dtlsParameters });
        peer.ws.send(JSON.stringify({ action: "transportConnected", data: {} }));
        break;
      }
      case "connectConsumerTransport": {
        // 이 부분도 추가해야 합니다.
        await peer.recvTransport.connect({
          dtlsParameters: data.dtlsParameters,
        });
        peer.ws.send(JSON.stringify({ action: "consumerTransportConnected", data: {} }));
        break;
      }

      case "produce": {
        const { kind, rtpParameters, appData } = data; // ✅ appData를 클라이언트에서 직접 받음
        const producer = await peer.transport.produce({
          kind,
          rtpParameters,
          appData: {
            ...appData, // 화면 공유 정보 등
            peerId: peer.peerId, // peerId는 서버에서 확실하게 추가
            perrName: peer.name
          },
        });
        peer.producers.set(producer.id, producer);

        if (producer.kind === "audio") {
          this.audioLevelObserver.addProducer({ producerId: producer.id });
        }

        this.broadcast(peer.peerId, {
          action: "newProducerAvailable",
          producerId: producer.id,
          kind: producer.kind,
          appData: producer.appData, // ✅ appData도 함께 브로드캐스트
        });

        peer.ws.send(
          JSON.stringify({ action: "produceResponse", data: { id: producer.id } })
        );

        producer.on("close", () => {
          console.log(`Producer ${producer.id} transport closed`);
          peer.producers.delete(producer.id);

          if (producer.kind === "audio") {
            this.audioLevelObserver.removeProducer({ producerId: producer.id });
          }

          this.broadcast(null, {
            action: "producerClosed",
            producerId: producer.id,
          });
        });
        break;
      }

      case "consume": {
        const { producerId, rtpCapabilities } = data;
        if (!this.router.canConsume({ producerId, rtpCapabilities })) {
          const errorMsg = `cannot consume producer: ${producerId}`;
          console.error(errorMsg);
          peer.ws.send(
            JSON.stringify({ action: "consumeResponse", error: errorMsg })
          );
          return;
        }

        const consumer = await peer.recvTransport.consume({
          producerId,
          rtpCapabilities,
          paused: true,
        });
        peer.consumers.set(consumer.id, consumer);

        consumer.on("transportclose", () => {
          peer.consumers.delete(consumer.id);
        });
        consumer.on("producerclose", () => {
          peer.consumers.delete(consumer.id);
          peer.ws.send(
            JSON.stringify({
              action: "producerClosed",
              producerId: consumer.producerId,
            })
          );
        });

        peer.ws.send(
          JSON.stringify({
            action: "consumeResponse",
            data: {
              id: consumer.id,
              producerId: consumer.producerId,
              kind: consumer.kind,
              rtpParameters: consumer.rtpParameters,
            },
          })
        );
        break;
      }

      case "resumeConsumer": {
        const { consumerId } = data;
        const consumer = peer.consumers.get(consumerId);
        if (consumer) {
          await consumer.resume();
          peer.ws.send(
            JSON.stringify({
              action: "resumeConsumerResponse",
              data: { consumerId },
            })
          );
        }
        break;
      }

      case "updatePeerStatus": {
        peer.status = data; // isPresent, isDrowsy 상태 저장

        // 관리자(admin)에게만 상태 변경 알림
        const adminPeer = this.peers.get(this.adminPeerId);
        if (adminPeer && adminPeer.ws.readyState === WebSocket.OPEN) {
          adminPeer.ws.send(
            JSON.stringify({
              action: "peerStatusUpdated",
              data: {
                peerId: peer.peerId,
                status: data,
              },
            })
          );
        }

        console.log(
          `[Room ${this.id}] Peer ${peer.peerId} status updated:`,
          data
        );
        break;
      }

      case "stopScreenShare": {
        const { producerId } = data;
        const producer = peer.producers.get(producerId);
        if (producer) {
          console.log(
            `🎬 Closing screen share producer ${producerId} by request.`
          );

          // 'close' 이벤트에만 의존하지 않고, 여기서 직접 브로드캐스트를 실행합니다.
          this.broadcast(null, {
            action: "producerClosed",
            producerId: producer.id,
          });

          producer.close(); // 리소스 정리를 위해 close는 여전히 호출합니다.
        }
        break;
      }

      case "changeProducerState": {
        const { producerId, kind, action: producerAction } = msg.data;
        console.log(
          `[Room ${this.id}] Peer ${peer.peerId} changed producer ${producerId} state to ${producerAction}`
        );

        // 요청을 보낸 클라이언트를 제외한 다른 모든 피어에게 상태 변경을 알립니다.
        // this.peers.values()를 사용하고, 현재 peer와 비교합니다.
        for (const otherPeer of this.peers.values()) {
          if (otherPeer.peerId === peer.peerId) continue;

          otherPeer.ws.send(
            JSON.stringify({
              action: "producerStateChanged", // 클라이언트가 받을 액션 이름
              data: {
                producerId,
                kind,
                state: producerAction, // 'pause' 또는 'resume'
              },
            })
          );
        }
        break;
      }

      case "canvas": {
        // 👇 sender 포함 전체에게 canvas 메시지를 보냄
        this.broadcastToAll({
          action: "canvas",
          data: data,
        });
        break;
      }
    }
  }

  close() {
    console.log(`Closing router for room ${this.id}`);
    this.router.close();
  }
}
