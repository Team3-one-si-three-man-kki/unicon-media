// server/signaling-server.js

import fs from "fs";
import https from "https";
import { WebSocketServer } from "ws";
import crypto from "crypto";
import url from "url";

import { startMediaServer, getRouterForNewRoom } from "./media-server.js";
import { Room } from "./Room.js";

const PORT = process.env.PORT || 3000;

const options = {
  cert: fs.readFileSync("../cert.pem"),
  key: fs.readFileSync("../key.pem"),
};
const httpsServer = https.createServer(options);
const wss = new WebSocketServer({ server: httpsServer });

const rooms = new Map(); // ✅ roomId -> Room 객체 맵

await startMediaServer();

httpsServer.listen(PORT, () => {
  console.log(
    `✅ HTTPS + WSS signaling server running on https://localhost:${PORT}`
  );
});

wss.on("connection", async (ws, req) => {
  console.log("🔌 Client connecting...");

  const { query } = url.parse(req.url, true);
  const roomId = query.roomId;

  if (!roomId) {
    ws.close(1008, "Room ID is required");
    return;
  }

  let room = rooms.get(roomId);
  if (!room) {
    try {
      const router = await getRouterForNewRoom();
      room = new Room(roomId, router);
      rooms.set(roomId, room);
      console.log(`✅ New room created: ${roomId}`);
    } catch (error) {
      console.error(`❌ Failed to create room ${roomId}:`, error);
      ws.close(1011, "Room creation failed");
      return;
    }
  }

  const peerId = crypto.randomUUID();
  const peer = {
    peerId,
    ws,
    producers: new Map(),
    consumers: new Map(),
    transport: null,
  };

  room.addPeer(peer);

  ws.on("message", (message) => {
    try {
      const msg = JSON.parse(message);
      // ✅ 메시지 처리를 해당 Room 객체에 위임
      room.handleMessage(peer, msg);
    } catch (error) {
      console.error(`❌ Message handling error for peer ${peerId}:`, error);
    }
  });

  const cleanupCallback = () => cleanup(room, peer);
  ws.on("close", cleanupCallback);
  ws.on("error", cleanupCallback);
});
/**
 * ✅ 모든 Room과 Worker의 상태를 종합하여 반환하는 새로운 통계 함수
 */
async function getServerStats() {
  const roomStats = [];
  for (const room of rooms.values()) {
    roomStats.push({
      id: room.id,
      routerId: room.router.id,
      peers: room.peers.size,
    });
  }

  // media-server에서 worker 정보를 가져오는 함수가 필요하다면 추가할 수 있습니다.
  // 예: const workerStats = getWorkerStats();

  return {
    rooms: roomStats,
    roomCount: rooms.size,
    // workerStats: workerStats
  };
}

function cleanup(room, peer) {
  console.log(`🧹 Cleaning up peer: ${peer.peerId} from room: ${room.id}`);

  peer.transport?.close();

  // ✅ [수정] peer가 가지고 있던 각 producer에 대해 'producerClosed' 이벤트를 방송합니다.
  for (const producer of peer.producers.values()) {
    producer.close(); // producer 자체도 닫아줍니다.
    room.broadcast(peer.peerId, {
      action: "producerClosed",
      producerId: producer.id,
    });
  }

  room.removePeer(peer.peerId);

  if (room.peers.size === 0) {
    console.log(`🗑️ Room ${room.id} is empty, closing and removing it.`);
    room.close();
    rooms.delete(room.id);
  }
}

// httpsServer 요청 핸들러 부분을 수정하여 아래 로직을 추가합니다.
httpsServer.on("request", async (req, res) => {
  if (req.url === "/stats" && req.method === "GET") {
    try {
      const stats = await getServerStats();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(stats));
    } catch (error) {
      res.writeHead(500);
      res.end("Server Error");
    }
  }
  // 여기에 다른 HTTP 요청 처리 로직이 있다면 추가...
});
