// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "signaling-server",
      script: "signaling-server.js",
      exec_mode: "fork", // 단일 프로세스로 실행
    },
    {
      name: "attendance-worker",
      script: "attendance-worker.js",
      exec_mode: "fork",
    },
  ],
};