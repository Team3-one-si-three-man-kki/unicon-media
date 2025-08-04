import mediasoup from "mediasoup";
import os from "os";
import { config } from "./config.js";

let workers = [];
let nextWorkerIdx = 0;

// 1. 서버 시작 시 여러 개의 Worker를 생성하여 풀(pool)을 생성
export async function startMediaServer() {
  const numWorkers = os.cpus().length;
  // 1. Worker 생성
  for (let i = 0; i < numWorkers; i++) {
    const worker = await mediasoup.createWorker({
      logLevel: config.worker.logLevel,
      logTags: config.worker.logTags,
      rtcMinPort: config.worker.rtcMinPort,
      rtcMaxPort: config.worker.rtcMaxPort,
    });

    // 2. Worker 모니터링
    worker.on("died", (error) => {
      console.error(`MediaSoup worker${worker.pid} died:`, error);
      // 프로덕션에서는 재시작 로직 구현
      setTimeout(() => process.exit(1), 2000);
      // worker가 죽었을 때 바로 프로세스를 종료하면
      // 다른 작업이 완료되지 않아 문제가 발생할 수 있기 때문 2초 뒤 실행
    });

    workers.push(worker);
  }
}

export async function getRouterForNewRoom() {
  const worker = getNextWorker();
  const router = await worker.createRouter({
    mediaCodecs: config.router.mediaCodecs,
  });
  return router;
}

export async function getWorkersDetails() {
  const stats = [];
  for (const worker of workers) {
    try {
      const usage = await worker.getResourceUsage();
      stats.push({
        pid: worker.pid,

        cpuTime: {
          user: usage.ru_utime,
          system: usage.ru_stime
        },
        memoryUsage: {
          maxRssKb: usage.ru_maxrss,
          maxRssMb: (usage.ru_maxrss / 1024).toFixed(2)
        }
      });
    } catch (error) {
      console.error(`Could not get resource usage for worker ${worker.pid}`, error);
      stats.push({ pid: worker.pid, error: 'Could not fetch stats' });
    }
  }
  return stats;
}

// 라운드 로빈 방식으로 다음 워커를 할당
function getNextWorker() {
  const worker = workers[nextWorkerIdx];
  nextWorkerIdx = (nextWorkerIdx + 1) % workers.length;
  return worker;
}

export async function createWebRtcTransport(router) {
  if (!router) {
    throw new Error("Router not initialized");
  }

  try {
    const transport = await router.createWebRtcTransport(
      config.webRtcTransport
    );

    // Transport 이벤트 모니터링
    transport.on("dtlsstatechange", (dtlsState) => {
      if (dtlsState === "failed" || dtlsState === "closed") {
        console.warn(`  Transport ${transport.id} DTLS state: ${dtlsState}`);
        // 클라이언트에게 DTLS 상태 변경 알림 로직 추가하기!!!!!!!!
      }
    });

    transport.on("icestatechange", (iceState) => {
      if (iceState === "failed" || iceState === "disconnected") {
        console.warn(
          `  Transport ${transport.id} ICE state: ${iceState} ICE connection failed/disconnected`
        );
        // 클라이언트에게 ICE 상태 변경 알림 로직 추가하기!!!!!!!!
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
    console.error("  Failed to create WebRTC transport:", error);
    throw error;
  }
}

// Graceful shutdown
export async function shutdownMediaServer() {

  try {
    // if (router) {
    //   router.close();
    //   console.log("  Router closed");
    // }

    // if (worker) {
    //   worker.close();
    //   console.log("  Worker closed");
    // }
    for (const worker of workers) {
      worker.close();
    }
  } catch (error) {
    console.error("  Error during shutdown:", error);
  }
}

// Process exit 처리
process.on("SIGINT", async () => {
  await shutdownMediaServer();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await shutdownMediaServer();
  process.exit(0);
});

// 예외 처리
process.on("uncaughtException", (error) => {
  console.error("  Uncaught Exception:", error);
  shutdownMediaServer().then(() => process.exit(1));
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("  Unhandled Rejection at:", promise, "reason:", reason);
  shutdownMediaServer().then(() => process.exit(1));
});
