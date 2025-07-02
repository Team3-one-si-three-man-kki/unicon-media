import mediasoup from "mediasoup";
import os from "os";

let worker;
let router;

// 환경 변수 설정
const config = {
  // MediaSoup Worker 설정
  worker: {
    logLevel: process.env.NODE_ENV === "production" ? "warn" : "debug",
    logTags: [
      "info",
      "ice",
      "dtls",
      "rtp",
      "srtp",
      "rtcp",
      "rtx",
      "bwe",
      "score",
      "simulcast",
      "svc",
    ],
    rtcMinPort: parseInt(process.env.MEDIASOUP_MIN_PORT) || 40000,
    rtcMaxPort: parseInt(process.env.MEDIASOUP_MAX_PORT) || 49999,
  },

  // 네트워크 설정
  webRtcTransport: {
    listenIps: [
      {
        ip: process.env.MEDIASOUP_LISTEN_IP || "0.0.0.0",
        announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || getLocalIp(),
      },
    ],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
    maxIncomingBitrate: 1500000,
    maxOutgoingBitrate: 1500000,
    initialAvailableOutgoingBitrate: 1000000,
  },

  // 미디어 코덱 설정
  mediaCodecs: [
    {
      kind: "audio",
      mimeType: "audio/opus",
      clockRate: 48000,
      channels: 2,
    },
    {
      kind: "video",
      mimeType: "video/VP8",
      clockRate: 90000,
      parameters: {
        "x-google-start-bitrate": 1000,
      },
    },
    {
      kind: "video",
      mimeType: "video/VP9",
      clockRate: 90000,
      parameters: {
        "profile-id": 2,
        "x-google-start-bitrate": 1000,
      },
    },
    {
      kind: "video",
      mimeType: "video/h264",
      clockRate: 90000,
      parameters: {
        "packetization-mode": 1,
        "profile-level-id": "4d0032",
        "level-asymmetry-allowed": 1,
        "x-google-start-bitrate": 1000,
      },
    },
  ],
};

export async function startMediaServer() {
  try {
    console.log("🚀 Starting MediaSoup server...");

    // 1. Worker 생성
    worker = await mediasoup.createWorker({
      logLevel: config.worker.logLevel,
      logTags: config.worker.logTags,
      rtcMinPort: config.worker.rtcMinPort,
      rtcMaxPort: config.worker.rtcMaxPort,
    });

    console.log("✅ MediaSoup Worker created");
    console.log(`📊 Worker PID: ${worker.pid}`);
    console.log(
      `🎯 RTP Port Range: ${config.worker.rtcMinPort}-${config.worker.rtcMaxPort}`
    );

    // 2. Worker 모니터링
    worker.on("died", (error) => {
      console.error("❌ MediaSoup worker died:", error);
      // 프로덕션에서는 재시작 로직 구현
      process.exit(1);
    });

    // 3. 라우터 생성
    router = await worker.createRouter({
      mediaCodecs: config.mediaCodecs,
    });

    console.log("✅ MediaSoup Router created");
    console.log(
      `🎬 Supported codecs: ${config.mediaCodecs
        .map((c) => c.mimeType)
        .join(", ")}`
    );

    // 4. 주기적 상태 체크 (프로덕션 환경)
    if (process.env.NODE_ENV === "production") {
      setInterval(() => {
        console.log(
          `📈 Resource usage - RSS: ${Math.round(
            process.memoryUsage().rss / 1024 / 1024
          )}MB`
        );
      }, 60000); // 1분마다
    }

    return { worker, router };
  } catch (error) {
    console.error("❌ Failed to start MediaSoup server:", error);
    throw error;
  }
}

export function getMediasoupRouter() {
  if (!router) {
    throw new Error("MediaSoup router not initialized");
  }
  return router;
}

export function getMediasoupWorker() {
  if (!worker) {
    throw new Error("MediaSoup worker not initialized");
  }
  return worker;
}

export async function createWebRtcTransport() {
  if (!router) {
    throw new Error("Router not initialized");
  }

  try {
    const transport = await router.createWebRtcTransport(
      config.webRtcTransport
    );

    console.log("✅ WebRTC Transport created");
    console.log(`🔗 Transport ID: ${transport.id}`);
    console.log(
      `🌐 Listen IPs: ${JSON.stringify(config.webRtcTransport.listenIps)}`
    );

    // Transport 이벤트 모니터링
    transport.on("dtlsstatechange", (dtlsState) => {
      console.log(`🔐 DTLS state changed: ${dtlsState}`);
      if (dtlsState === "failed" || dtlsState === "closed") {
        console.warn(`⚠️ Transport ${transport.id} DTLS state: ${dtlsState}`);
      }
    });

    transport.on("icestatechange", (iceState) => {
      console.log(`🧊 ICE state changed: ${iceState}`);
      if (iceState === "failed" || iceState === "disconnected") {
        console.warn(`⚠️ Transport ${transport.id} ICE state: ${iceState}`);
      }
    });

    // 통계 정보 수집 (프로덕션 환경)
    if (process.env.NODE_ENV === "production") {
      transport.on("routerrtpobserver", () => {
        // RTP 통계 수집 로직
      });
    }

    return transport;
  } catch (error) {
    console.error("❌ Failed to create WebRTC transport:", error);
    throw error;
  }
}

// 서버 통계 정보 조회
export function getServerStats() {
  if (!router || !worker) {
    return null;
  }

  return {
    workerId: worker.pid,
    routerId: router.id,
    transports: router.transports.size,
    producers: router.producers.size,
    consumers: router.consumers.size,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
  };
}

// 로컬 IP 주소 자동 감지
function getLocalIp() {
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === "IPv4" && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch (error) {
    console.warn("⚠️ Could not detect local IP, using 127.0.0.1");
  }
  return "127.0.0.1";
}

// Graceful shutdown
export async function shutdownMediaServer() {
  console.log("🔄 Shutting down MediaSoup server...");

  try {
    if (router) {
      router.close();
      console.log("✅ Router closed");
    }

    if (worker) {
      worker.close();
      console.log("✅ Worker closed");
    }
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
  }
}

// Process exit 처리
process.on("SIGINT", async () => {
  console.log("\n🛑 Received SIGINT, shutting down gracefully...");
  await shutdownMediaServer();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Received SIGTERM, shutting down gracefully...");
  await shutdownMediaServer();
  process.exit(0);
});

// 예외 처리
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  shutdownMediaServer().then(() => process.exit(1));
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  shutdownMediaServer().then(() => process.exit(1));
});
