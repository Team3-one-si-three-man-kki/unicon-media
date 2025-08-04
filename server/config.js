import dotenv from "dotenv";
dotenv.config();
import os from "os";

// 로컬 IP 주소 자동 감지
export function getLocalIp() {
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

// 환경 변수 설정
export const config = {
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
    rtcMaxPort: parseInt(process.env.MEDIASOUP_MAX_PORT) || 40010,
  },

  // 네트워크 설정
  webRtcTransport: {
    listenIps: [
      {
        ip: process.env.MEDIASOUP_LISTEN_IP || "0.0.0.0",
        announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || getLocalIp(),
      },
    ],
    //STUN 서버 설정
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
      },
    ],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
    maxIncomingBitrate: 1500000,
    maxOutgoingBitrate: 1500000,
    initialAvailableOutgoingBitrate: 1000000,
  },

  router: {
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
  },
};
