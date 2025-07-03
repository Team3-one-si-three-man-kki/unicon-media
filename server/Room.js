// server/Room.js (모든 핸들러가 포함된 최종 완성 버전)
import { WebSocket } from "ws";
import { createWebRtcTransport } from "./media-server.js";

export class Room {
  constructor(roomId, router) {
    this.id = roomId;
    this.router = router;
    this.peers = new Map();
  }

  addPeer(peer) {
    this.peers.set(peer.peerId, peer);
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
        producerList.push({ producerId: producer.id, kind: producer.kind });
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
        peer.ws.send(JSON.stringify({ action: "transportConnected" }));
        break;
      }
      case "connectConsumerTransport": {
        // 이 부분도 추가해야 합니다.
        await peer.recvTransport.connect({
          dtlsParameters: data.dtlsParameters,
        });
        peer.ws.send(JSON.stringify({ action: "consumerTransportConnected" }));
        break;
      }

      case "produce": {
        const { kind, rtpParameters } = data;
        const producer = await peer.transport.produce({ kind, rtpParameters });
        peer.producers.set(producer.id, producer);

        this.broadcast(peer.peerId, {
          action: "newProducerAvailable",
          producerId: producer.id,
          kind: producer.kind,
        });

        peer.ws.send(
          JSON.stringify({ action: "produceResponse", id: producer.id })
        );

        producer.on("transportclose", () => {
          console.log(`Producer ${producer.id} transport closed`);
          peer.producers.delete(producer.id);
          this.broadcast(peer.peerId, {
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
        // 다른 사람에게 상태를 알릴 필요가 있다면 여기서 broadcast
        // this.broadcast(peer.peerId, { action: 'peerStatusUpdated', peerId: peer.peerId, status: data });
        console.log("누군가 졸거나 자리비움", peer.peerId, data);
        break;
      }
    }
  }

  close() {
    console.log(`Closing router for room ${this.id}`);
    this.router.close();
  }
}
