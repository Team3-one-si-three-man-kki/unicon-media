import dotenv from "dotenv";
import { createClient } from "redis";
import jwt from "jsonwebtoken";
import os from "os";
dotenv.config();

import fs from "fs";
import https from "https";
// import https from "http";
import { WebSocketServer } from "ws";
import crypto from "crypto";
import url from "url";

import { startMediaServer, getRouterForNewRoom, getWorkersDetails } from "./media-server.js";
import { Room } from "./Room.js";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error(" Redis Client Error", err));
await redisClient.connect();

// --- Constants ---
const JWT_SECRET = process.env.JWT_SECRET;
const ATTENDANCE_QUEUE_KEY = process.env.ATTENDANCE_QUEUE_KEY;
const LIVE_SESSIONS_KEY_PREFIX = process.env.LIVE_SESSIONS_KEY_PREFIX;

const PORT = process.env.PORT || 3000;

const options = {
  cert: fs.readFileSync("../cert.pem"),
  key: fs.readFileSync("../key.pem"),
};
const httpsServer = https.createServer(options);
// const httpsServer = https.createServer();
const wss = new WebSocketServer({ server: httpsServer });

const rooms = new Map(); //   roomId -> Room 객체 맵

await startMediaServer();

httpsServer.listen(PORT, () => {
  console.log(
    `  HTTPS + WSS signaling server running on https://localhost:${PORT}`
  );
  console.log(`${process.env.MEDIASOUP_ANNOUNCED_IP}`);
});

wss.on("connection", async (ws, req) => {
  const { query } = url.parse(req.url, true);
  const { roomId, userName, userEmail, tenantId, maxPeers } = query; // maxPeers 추가

  if (!roomId) {
    ws.close(1008, "Room ID is required");
    return;
  }

  let room = rooms.get(roomId);
  if (!room) {
    try {
      const router = await getRouterForNewRoom();
      // maxPeers 값을 Room 생성자에 전달, 기본값은 10으로 설정
      room = new Room(roomId, router, tenantId, parseInt(maxPeers) || 10);
      rooms.set(roomId, room);
    } catch (error) {
      console.error(`  Failed to create room ${roomId}:`, error);
      ws.close(1011, "Room creation failed");
      return;
    }
  }

  // 방이 가득 찼는지 확인
  if (room.isRoomFull()) {
    ws.close(1013, "Room is full"); // 1013: 정책 위반 (예: 방 인원 제한 초과)
    return;
  }

  const peerId = crypto.randomUUID();
  const peer = {
    peerId,
    ws,
    name: userName || "Anonymous", // 사용자 이름이 없으면 "Anonymous"로 설정
    email: userEmail || "anonymous@example.com", // 사용자 이메일이 없으면 "anonymous@example.com"으로 설정",
    producers: new Map(),
    consumers: new Map(),
    transport: null,
  };

  //사용자 입장 시, Redis에 임시 출석 정보를 저장합니다.
  try {
    const entryData = {
      sessionId: roomId,
      peerId: peerId,
      name: userName || "Anonymous",
      email: userEmail || "anonymous@example.com",
      ipAddress: req.socket.remoteAddress,
      joinTime: new Date().toISOString(),
    };
    // HSET: Hash 자료구조에 데이터를 저장합니다. 키는 "live:peerId"
    await redisClient.hSet(`${LIVE_SESSIONS_KEY_PREFIX}${peerId}`, entryData);
  } catch (error) {
    console.error(` Failed to store entry data for peer ${peerId}:`, error);
  }

  room.addPeer(peer);

  ws.on("message", (message) => {
    try {
      const msg = JSON.parse(message);
      // 메시지 처리를 해당 Room 객체에 위임
      room.handleMessage(peer, msg);
    } catch (error) {
      console.error(` Message handling error for peer ${peerId}:`, error);
    }
  });

  const cleanupCallback = () => cleanup(room, peer);
  ws.on("close", cleanupCallback);
  ws.on("error", cleanupCallback);
});
/**
 *   모든 Room과 Worker의 상태를 종합하여 반환하는 새로운 통계 함수
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
      roomProducersCount += peer.producers.size;
      roomConsumersCount += peer.consumers.size;
      if (peer.transport) roomTransportsCount++;
      if (peer.recvTransport) roomTransportsCount++;
    }
    roomDetails.push({
      id: room.id,
      routerId: room.router.id,
      peersCount: room.peers.size,
      producersCount: roomProducersCount,
      consumersCount: roomConsumersCount,
      transportsCount: roomTransportsCount,
      tenantId: room.tenantId || 'N/A',
    });

    totalPeers += room.peers.size;
    totalProducers += roomProducersCount;
    totalConsumers += roomConsumersCount;
    totalTransports += roomTransportsCount;
  }

  const memoryUsage = process.memoryUsage();
  const totalSystemMemory = os.totalmem();
  const rssPercent = (memoryUsage.rss / totalSystemMemory) * 100;

  const stats = {
    summary: {
      uptime: process.uptime(),
      memoryUsage: {
        ...memoryUsage,
        rssMB: (memoryUsage.rss / 1024 / 1024).toFixed(2),
        totalSystemMemoryMB: (totalSystemMemory / 1024 / 1024).toFixed(2),
        rssPercentOfSystem: rssPercent.toFixed(2) + "%",
      },
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
  // return callback({ userId: 'test-admin' });

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

  peer.transport?.close();

  for (const producer of peer.producers.values()) {
    producer.close();
    room.broadcast(peer.peerId, {
      action: "producerClosed",
      producerId: producer.id,
    });
  }

  //   데이터베이스에 직접 저장하는 대신, Redis 큐에 출석 정보를 추가합니다.
  try {
    const entryData = await redisClient.hGetAll(`${LIVE_SESSIONS_KEY_PREFIX}${peer.peerId}`);
    if (entryData && entryData.joinTime) {
      const finalAttendanceData = {
        ...entryData,
        leaveTime: new Date().toISOString(),
      };
      // 완성된 데이터를 DB 저장 대기열(Queue)에 추가
      await redisClient.rPush(ATTENDANCE_QUEUE_KEY, JSON.stringify(finalAttendanceData));
      // 처리한 임시 데이터는 Redis에서 삭제
      await redisClient.del(`${LIVE_SESSIONS_KEY_PREFIX}${peer.peerId}`);
    }
  } catch (error) {
    console.error(
      `  Failed to process leave record for peer ${peer.peerId}:`,
      error
    );
  }

  room.removePeer(peer.peerId);

  if (room.peers.size === 0) {
    room.close();
    rooms.delete(room.id);
  }
}

// httpsServer 요청 핸들러 부분을 수정하여 아래 로직을 추가합니다.
httpsServer.on("request", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, submissionid");

  if (req.method === "OPTIONS") {
    res.writeHead(204); // No Content
    return res.end();
  }

  const reqUrl = url.parse(req.url, true);
  const path = reqUrl.pathname;

  if (path === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("OK");
  }

  if (path === "/api/admin/server-stats" && req.method === "GET") {
    return authenticateAdmin(req, res, async (user) => {
      try {
        console.log(`[Admin] Server stats requested by ${user.sub}`);
        const stats = await getComprehensiveServerStats();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(stats));
      } catch (error) {
        console.error("Error fetching server stats:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Server Error" }));
      }
    });
  } else if (path === "/api/admin/tenant-stats" && req.method === "GET") {
    return authenticateAdmin(req, res, (user) => {
      const tenantId = reqUrl.query.tenantId; // 쿼리 파라미터에서 tenantId를 가져옵니다.
      if (!tenantId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Tenant ID is required." }));
      }

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

  else if (path === "/api/admin/session-info" && req.method === "GET") {
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
            // appData: c.appData,
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
