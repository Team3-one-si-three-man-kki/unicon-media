// server/signaling-server.js
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config(); // 이 코드를 최상단에 추가합니다.

import fs from "fs";
import https from "https";
import { WebSocketServer } from "ws";
import crypto from "crypto";
import url from "url";

import { startMediaServer, getRouterForNewRoom, getWorkersDetails } from "./media-server.js";
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
  console.log(`${process.env.MEDIASOUP_ANNOUNCED_IP}`);
});

wss.on("connection", async (ws, req) => {
  console.log("🔌 Client connecting...");

  const { query } = url.parse(req.url, true);
  // const roomId = query.roomId;
  const { roomId, userName, userEmail } = query;

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
    name: userName,
    email: userEmail,
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
async function getComprehensiveServerStats() {
  const workerInfo = await getWorkersDetails();
  const roomDetails = [];

  let totalPeers = 0;
  let totalProducers = 0;
  let totalConsumers = 0;
  let totalTransports = 0;

  for (const room of rooms.values()) {
    let roomProducersCount = 0;
    let roomConsumersCount = 0;
    let roomTransportsCount = 0;
    for (const peer of room.peers.values()) {
      roomProducersCount += peer.producers.size; //
      roomConsumersCount += peer.consumers.size; //
      if (peer.transport) roomTransportsCount++; //
      if (peer.recvTransport) roomTransportsCount++; //
    }
    roomDetails.push({
      id: room.id,
      routerId: room.router.id,
      peersCount: room.peers.size, //
      producersCount: roomProducersCount,
      consumersCount: roomConsumersCount,
      transportsCount: roomTransportsCount,
      tenantId: room.tenantId || 'N/A', //
    });

    totalPeers += room.peers.size;
    totalProducers += roomProducersCount;
    totalConsumers += roomConsumersCount;
    totalTransports += roomTransportsCount;
  }

  const stats = {
    summary: {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      activeRoomCount: rooms.size, //
      totalConnectedPeers: totalPeers,
      totalTransports: totalTransports,
      totalProducers: totalProducers,
      totalConsumers: totalConsumers,
      //attendanceQueueLength: await redisClient.lLen(process.env.ATTENDANCE_QUEUE_KEY), //
    },
    workers: workerInfo,
    rooms: roomDetails,
  };
  return stats;
}

function authenticateAdmin(req, res, callback) {
  // (테스트 시 이 부분을 주석 해제하고 사용)
  return callback({ userId: 'test-admin' });

  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Access denied. No token provided." }));
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      res.writeHead(403, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Access denied. Admin role required." }));
    }
    callback(decoded);
  } catch (error) {
    res.writeHead(401, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Invalid or expired token." }));
  }
}


async function cleanup(room, peer) {
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
  const reqUrl = url.parse(req.url, true);
  const path = reqUrl.pathname;

  if (path === "/api/admin/server-stats" && req.method === "GET") {
    return authenticateAdmin(req, res, async (user) => {
      try {
        console.log(`[Admin] Server stats requested by ${user.userId}`);
        const stats = await getComprehensiveServerStats();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(stats));
      } catch (error) {
        console.error("Error fetching server stats:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Server Error" }));
      }
    });
  } else if (path.startsWith("/api/admin/tenant-stats/") && req.method === "GET") {
    return authenticateAdmin(req, res, (user) => {
      const tenantId = path.split('/')[4];
      if (!tenantId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Tenant ID is required." }));
      }
      console.log(`[Admin] Tenant stats for '${tenantId}' requested by ${user.userId}`);


      const tenantRooms = Array.from(rooms.values()).filter(room => room.tenantId === tenantId);
      const tenantPeers = tenantRooms.reduce((sum, room) => sum + room.peers.size, 0);

      const stats = {
        tenantId: tenantId,
        activeRooms: tenantRooms.length,
        connectedPeers: tenantPeers,
        roomIds: tenantRooms.map(room => room.id),
      };

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(stats));
    });
  }

  // 예: /room-info?roomId=some-room-id
  else if (path.startsWith("/api/admin/session-info/") && req.method === "GET") {
    return authenticateAdmin(req, res, (user) => {
      const roomId = reqUrl.query.roomId;
      if (!roomId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "roomId is required" }));
        return;
      }

      const room = rooms.get(roomId);
      if (!room) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Room not found" }));
        return;
      }

      // 방 정보를 가공하여 반환
      const roomInfo = {
        id: room.id,
        routerId: room.router.id, // 라우터 ID
        adminPeerId: room.adminPeerId, // 방 관리자 ID
        domaidominantSpeaker: room.dominantSpeaker, // 현재 도메인 참여자
        peers: Array.from(room.peers.values()).map(peer => ({ // 참여자 목록
          peerId: peer.peerId,
          name: peer.name,
          email: peer.email,
          deviceReady: peer.deviceReady,
          consumers: Array.from(peer.consumers.values()).map(c => ({ // 각 참여자가 생성한 소비자
            consumerId: c.id,
            kind: c.kind,
            appData: c.appData,
          })),
          producers: Array.from(peer.producers.values()).map(p => ({ // 각 참여자가 생성한 미디어 소스
            producerId: p.id,
            kind: p.kind,
            appData: p.appData,
          })),
        })),
      };
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(roomInfo));
    });
  }
});
