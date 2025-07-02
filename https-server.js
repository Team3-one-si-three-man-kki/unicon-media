// https-server.js
import express from "express";
import https from "https";
import fs from "fs";
import path from "path";

const app = express();

// 인증서 로드
const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

// 정적 파일 서빙 (index.html, client.js 등)
app.use(express.static(path.resolve("./client"))); // public 폴더에 넣어둬

https.createServer(options, app).listen(5500, () => {
  console.log("🔒 HTTPS server running at https://localhost:5500");
});
