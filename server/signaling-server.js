import fs from "fs";
import https from "https";
import { WebSocketServer, WebSocket } from "ws";
import crypto from "crypto";

import {
  startMediaServer,
  createWebRtcTransport,
  getMediasoupRouter,
} from "./media-server.js";

const PORT = process.env.PORT || 3000;

const options = {
  cert: fs.readFileSync("../cert.pem"),
  key: fs.readFileSync("../key.pem"),
};

const httpsServer = https.createServer(options);
const wss = new WebSocketServer({ server: httpsServer });

// 개선된 peer 구조
const peers = new Map();
// 🔥 전역 producer 추가 - 어떤 peer가 어떤 producer를 소유하는지 추적
const globalProducers = new Map(); // producerId -> { peer, producer, kind }

await startMediaServer();
const router = getMediasoupRouter();

httpsServer.listen(PORT, () => {
  console.log(`✅ HTTPS + WSS signaling server on https://localhost:${PORT}`);
});

console.log(`🚀 WebSocket signaling server running on port ${PORT}`);

wss.on("connection", (ws) => {
  console.log("🔌 Client connected");

  const peer = {
    peerId: crypto.randomUUID(),
    transport: null,
    producers: new Map(), // kind -> producer
    consumerTransport: null,
    consumers: new Map(), // kind -> consumer
    ws: ws,
    deviceReady: false, // 🔥 Device 준비 상태 추가
  };
  peers.set(ws, peer);

  ws.on("message", async (message) => {
    const msg = JSON.parse(message);
    try {
      await handleMessage(ws, peer, msg);
    } catch (error) {
      console.error("❌ Message handling error:", error);
    }
  });

  ws.on("close", () => {
    cleanup(ws, peer);
  });

  // 🔥 연결 끊어짐 감지 개선
  ws.on("error", (error) => {
    console.error("❌ WebSocket error:", error);
    cleanup(ws, peer);
  });
});

async function handleMessage(ws, peer, msg) {
  const { action, data } = msg;

  switch (action) {
    case "getRtpCapabilities": {
      ws.send(
        JSON.stringify({
          action: "rtpCapabilities",
          data: router.rtpCapabilities,
        })
      );

      // 🔥 existingProducers는 클라이언트가 준비되었을 때만 전송
      break;
    }

    // 🔥 새로운 액션: 클라이언트가 준비되었음을 알림
    case "deviceReady": {
      peer.deviceReady = true;
      console.log(`✅ Device ready for peer ${peer.peerId}`);

      // 이제 기존 producers 전송
      broadcastExistingProducers(ws, peer);
      break;
    }

    case "createTransport": {
      const transport = await createWebRtcTransport();
      peer.transport = transport;

      transport.on("dtlsstatechange", (state) => {
        console.log(`🔗 DTLS state changed: ${state}`);
        if (state === "closed") {
          console.log(`⚠️ Transport ${transport.id} DTLS state: closed`);
          // 🔥 transport가 닫히면 해당 peer의 모든 producer 정리
          cleanupPeerProducers(peer);
        }
      });

      ws.send(
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

    case "connectTransport": {
      const { dtlsParameters } = data || {};
      if (!dtlsParameters || !peer.transport) {
        throw new Error("Invalid transport connect request");
      }

      await peer.transport.connect({ dtlsParameters });
      ws.send(JSON.stringify({ action: "transportConnected" }));
      break;
    }

    case "produce": {
      const { kind, rtpParameters } = data || {};
      if (!kind || !rtpParameters || !peer.transport) {
        throw new Error("Invalid produce request");
      }

      const producer = await peer.transport.produce({ kind, rtpParameters });
      console.log(`🎥 ${kind} Producer created:`, producer.id);

      peer.producers.set(kind, producer);
      // 🔥 전역 producer 맵에 추가
      globalProducers.set(producer.id, { peer, producer, kind });

      // 🔥 producer 종료 이벤트 처리
      producer.on("transportclose", () => {
        console.log(`🚫 Producer ${producer.id} transport closed`);
        globalProducers.delete(producer.id);
        broadcastProducerClosed(ws, kind, producer.id);
      });

      ws.send(
        JSON.stringify({
          action: "produceResponse",
          id: producer.id,
          kind: kind,
        })
      );

      // 🔥 다른 클라이언트들에게 새 producer 알림 (준비된 클라이언트만)
      broadcastNewProducer(ws, kind, producer.id);

      break;
    }

    case "createConsumerTransport": {
      // 🔥 이미 존재하면 기존 것을 재사용
      if (peer.consumerTransport && !peer.consumerTransport.closed) {
        console.log("🔄 Reusing existing consumer transport");
        ws.send(
          JSON.stringify({
            action: "createConsumerTransportResponse",
            data: {
              id: peer.consumerTransport.id,
              iceParameters: peer.consumerTransport.iceParameters,
              iceCandidates: peer.consumerTransport.iceCandidates,
              dtlsParameters: peer.consumerTransport.dtlsParameters,
            },
          })
        );
        return;
      }

      const consumerTransport = await createWebRtcTransport();

      consumerTransport.on("dtlsstatechange", (state) => {
        console.log(`🔗 Consumer DTLS state changed: ${state}`);
        if (state === "closed") {
          // 🔥 transport가 닫히면 모든 consumer 정리
          for (const [consumerId, consumer] of peer.consumers.entries()) {
            if (consumer.transport === consumerTransport) {
              try {
                consumer.close();
              } catch {}
              peer.consumers.delete(consumerId);
            }
          }
          if (peer.consumerTransport === consumerTransport) {
            peer.consumerTransport = null;
          }
        }
      });

      peer.consumerTransport = consumerTransport;

      ws.send(
        JSON.stringify({
          action: "createConsumerTransportResponse",
          data: {
            id: consumerTransport.id,
            iceParameters: consumerTransport.iceParameters,
            iceCandidates: consumerTransport.iceCandidates,
            dtlsParameters: consumerTransport.dtlsParameters,
          },
        })
      );
      break;
    }

    case "connectConsumerTransport": {
      const { dtlsParameters } = msg.data || {};
      if (!dtlsParameters || !peer.consumerTransport) {
        throw new Error("Invalid consumer transport connect request");
      }

      await peer.consumerTransport.connect({ dtlsParameters });
      ws.send(JSON.stringify({ action: "consumerTransportConnected" }));
      break;
    }

    case "consume": {
      const { producerId, rtpCapabilities, kind } = data;

      if (!producerId || !rtpCapabilities || !kind) {
        console.error("❌ Invalid consume request - missing parameters:", data);
        throw new Error(
          "Invalid consume request - need rtpCapabilities, producerId, kind"
        );
      }

      // 🔥 producer 존재 여부 먼저 확인
      const producerInfo = globalProducers.get(producerId);
      if (!producerInfo) {
        console.error(`❌ Producer ${producerId} not found or already closed`);
        ws.send(
          JSON.stringify({
            action: "producerClosed",
            producerId: producerId,
            kind: kind,
          })
        );
        return;
      }

      // 🔥 producer가 실제로 활성 상태인지 확인
      if (producerInfo.producer.closed) {
        console.error(`❌ Producer ${producerId} is already closed`);
        globalProducers.delete(producerId);
        ws.send(
          JSON.stringify({
            action: "producerClosed",
            producerId: producerId,
            kind: kind,
          })
        );
        return;
      }

      if (!router.canConsume({ producerId, rtpCapabilities })) {
        console.error("❌ Cannot consume this producer:");
        console.error("➡️ Producer ID:", producerId);
        ws.send(
          JSON.stringify({
            action: "producerClosed",
            producerId: producerId,
            kind: kind,
          })
        );
        return;
      }

      if (!peer.consumerTransport) {
        throw new Error("❌ Consumer transport not ready");
      }

      // 🔥 기존 consumer 중복 제거 (같은 producerId에 대해)
      for (const [consumerId, consumer] of peer.consumers.entries()) {
        if (consumer.producerId === producerId) {
          try {
            consumer.close();
          } catch {}
          peer.consumers.delete(consumerId);
          console.log(
            `🗑️ Removed duplicate consumer for producer ${producerId}`
          );
        }
      }

      const consumer = await peer.consumerTransport.consume({
        producerId,
        rtpCapabilities,
        paused: false,
      });

      console.log(`✅ ${kind} Consumer created:`, consumer.id);

      peer.consumers.set(consumer.id, consumer);

      // 🔥 consumer 종료 이벤트 처리
      consumer.on("transportclose", () => {
        peer.consumers.delete(consumer.id);
      });

      ws.send(
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

    default:
      console.warn("⚠️ Unknown action:", msg.action);
  }
}

function broadcastExistingProducers(ws, peer) {
  const existingProducers = [];

  // 🔥 전역 producer 맵에서 활성 producer만 조회
  for (const [
    producerId,
    { peer: producerPeer, producer, kind },
  ] of globalProducers.entries()) {
    if (producerPeer !== peer && !producer.closed) {
      existingProducers.push({ kind, producerId });
    }
  }

  if (existingProducers.length > 0) {
    console.log(
      `📋 Broadcasting ${existingProducers.length} existing producers to new client`
    );
    ws.send(
      JSON.stringify({
        action: "existingProducers",
        data: existingProducers,
      })
    );
  }
}

function broadcastNewProducer(senderWs, kind, producerId) {
  console.log(
    `📢 Broadcasting new producer ${producerId} (${kind}) to all clients`
  );
  for (const [ws, peer] of peers.entries()) {
    // 🔥 WebSocket 상태 체크 수정 & 준비된 클라이언트만 대상
    if (
      ws !== senderWs &&
      ws.readyState === WebSocket.OPEN &&
      peer.deviceReady
    ) {
      ws.send(
        JSON.stringify({
          action: "newProducerAvailable",
          kind: kind,
          producerId: producerId,
        })
      );
    }
  }
}

function cleanupPeerProducers(peer) {
  // 🔥 해당 peer의 모든 producer 정리
  for (const [kind, producer] of peer.producers.entries()) {
    if (!producer.closed) {
      try {
        producer.close();
        console.log(`🚫 Closed producer ${producer.id} (${kind})`);
      } catch (err) {
        console.error("❌ Failed to close producer:", err);
      }
    }
    globalProducers.delete(producer.id);
    broadcastProducerClosed(peer.ws, kind, producer.id);
  }
  peer.producers.clear();
}

function cleanup(ws, peer) {
  console.log("🧹 Cleaning up peer:", peer.peerId);

  // 🔥 Producer 정리 먼저
  cleanupPeerProducers(peer);

  // Transport 정리
  try {
    peer.transport?.close();
    peer.consumerTransport?.close();
  } catch {}

  // Consumer 정리
  for (const consumer of peer.consumers.values()) {
    try {
      consumer.close();
    } catch (err) {
      console.error("❌ Failed to close consumer:", err);
    }
  }

  peer.consumers.clear();
  peers.delete(ws);
  console.log("✅ Peer cleaned up successfully");
}

function broadcastProducerClosed(senderWs, kind, producerId) {
  console.log(`📢 Broadcasting producer closed: ${producerId} (${kind})`);
  for (const [ws, peer] of peers.entries()) {
    if (ws !== senderWs && ws.readyState === ws.OPEN) {
      ws.send(
        JSON.stringify({
          action: "producerClosed",
          kind: kind,
          producerId,
        })
      );
    }
  }
}
