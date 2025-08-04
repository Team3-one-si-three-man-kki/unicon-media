import { createClient } from "redis";
import mysql from 'mysql2/promise';

import dotenv from "dotenv";
dotenv.config();
// import axios from "axios"; -> API 소통하기 위한 Import -> 추후 API 서버와 통신시 사용

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
const ATTENDANCE_QUEUE_KEY = process.env.ATTENDANCE_QUEUE_KEY || "attendanceQueue"; // 환경 변수로 큐 키 설정
// const PROWORKS_API_URL = "http://localhost:8080/InsWebApp"; // ProWorks API 서버 주소
const BATCH_SIZE = 100; //  한 번에 100개씩 처리
const INTERVAL = 5000; // 5초마다 실행

// DB 커넥션 풀 생성
const dbPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

function toMariaDBDatetime(isoString) {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

async function processQueue() {
  let connection;
  // await redisClient.del(ATTENDANCE_QUEUE_KEY);
  // console.log("REIDS")

  try {
    // lrange와 ltrim을 사용해 큐에서 데이터를 안전하게 가져오고 처리된 항목을 제거
    const recordsToProcess = await redisClient.lRange(
      ATTENDANCE_QUEUE_KEY,
      0,
      BATCH_SIZE - 1
    );

    if (recordsToProcess.length === 0) {
      return;
    }

    // 커넥션 풀에서 커넥션 가져오기
    connection = await dbPool.getConnection();

    const sql = `
        INSERT INTO attendance_record 
        (session_id, name, email, ip_address, join_time, leave_time) 
        VALUES ?`;

    // Redis에서 받은 JSON 문자열 배열을, SQL에 맞는 2차원 배열로 변환
    const parsedRecords = recordsToProcess.map(str => {
      try {
        return JSON.parse(str);
      } catch {
        return null;
      }
    }).filter(r => r && Number.isInteger(Number(r.sessionId)));

    const values = parsedRecords.map(record => [
      Number(record.sessionId),  // 명시적으로 정수로 변환
      record.name,
      record.email,
      record.ipAddress,
      toMariaDBDatetime(record.joinTime),
      toMariaDBDatetime(record.leaveTime)
    ]);

    if (values.length === 0) {
      console.warn('[Worker] No valid attendance records to insert.');
      return;
    }

    // DB에 Batch Insert 실행
    await connection.query(sql, [values]);

    // ProWorks의 배치 저장 API 호출
    // await axios.post(`${PROWORKS_API_URL}/ATT0001BatchUpdate.pwkjson`, {
    //   attendanceList: recordsToProcess.map(JSON.parse), // JSON 문자열을 객체 배열로 변환
    // });


    // 처리된 항목들을 큐에서 제거
    await redisClient.lTrim(ATTENDANCE_QUEUE_KEY, recordsToProcess.length, -1);
  } catch (error) {
    console.error("[Worker] Error processing attendance queue:", error.message);
    // DB 저장 실패 시, 큐에서 데이터를 제거하지 않아 다음 시도에 재처리될 수 있도록 함
  } finally {
    if (connection) {
      //  커넥션을 풀에 반드시 반환
      connection.release();
    }
  }
}

async function startWorker() {
  await redisClient.connect();
  setInterval(processQueue, INTERVAL);
}

startWorker();
