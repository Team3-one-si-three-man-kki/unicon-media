const { Device } = window.mediasoupClient;

const ws = new WebSocket("wss://192.168.5.133:3000");

let device;
let sendTransport;
let recvTransport;
let localStream;
const pendingConsumeList = [];
const actionCallbackMap = new Map();

// MEDIA PIPE 관련 변수
let mediaPipeWorker;
let canvas;
let canvasCtx;
const AI_ANALYSIS_INTERVAL = 200; // 200ms (초당 5회) 간격으로 분석
// ✅ 이 부분을 통째로 복사해서 붙여넣으세요.
const FACE_LANDMARKS_CONNECTORS = [
  // Lips
  { start: 61, end: 146 },
  { start: 146, end: 91 },
  { start: 91, end: 181 },
  { start: 181, end: 84 },
  { start: 84, end: 17 },
  { start: 17, end: 314 },
  { start: 314, end: 405 },
  { start: 405, end: 321 },
  { start: 321, end: 375 },
  { start: 375, end: 291 },
  { start: 61, end: 185 },
  { start: 185, end: 40 },
  { start: 40, end: 39 },
  { start: 39, end: 37 },
  { start: 37, end: 0 },
  { start: 0, end: 267 },
  { start: 267, end: 269 },
  { start: 269, end: 270 },
  { start: 270, end: 409 },
  { start: 409, end: 291 },
  { start: 78, end: 95 },
  { start: 95, end: 88 },
  { start: 88, end: 178 },
  { start: 178, end: 87 },
  { start: 87, end: 14 },
  { start: 14, end: 317 },
  { start: 317, end: 402 },
  { start: 402, end: 318 },
  { start: 318, end: 324 },
  { start: 324, end: 308 },
  { start: 78, end: 191 },
  { start: 191, end: 80 },
  { start: 80, end: 81 },
  { start: 81, end: 82 },
  { start: 82, end: 13 },
  { start: 13, end: 312 },
  { start: 312, end: 311 },
  { start: 311, end: 310 },
  { start: 310, end: 415 },
  { start: 415, end: 308 },
  // Left eye
  { start: 362, end: 382 },
  { start: 382, end: 381 },
  { start: 381, end: 380 },
  { start: 380, end: 373 },
  { start: 373, end: 374 },
  { start: 374, end: 390 },
  { start: 390, end: 249 },
  { start: 249, end: 362 },
  // Left eyebrow
  { start: 336, end: 296 },
  { start: 296, end: 334 },
  { start: 334, end: 293 },
  { start: 293, end: 300 },
  { start: 300, end: 276 },
  // Right eye
  { start: 33, end: 7 },
  { start: 7, end: 163 },
  { start: 163, end: 144 },
  { start: 144, end: 145 },
  { start: 145, end: 153 },
  { start: 153, end: 154 },
  { start: 154, end: 155 },
  { start: 155, end: 33 },
  // Right eyebrow
  { start: 107, end: 66 },
  { start: 66, end: 105 },
  { start: 105, end: 63 },
  { start: 63, end: 70 },
  { start: 70, end: 46 },
  // Face oval
  { start: 10, end: 338 },
  { start: 338, end: 297 },
  { start: 297, end: 332 },
  { start: 332, end: 284 },
  { start: 284, end: 251 },
  { start: 251, end: 389 },
  { start: 389, end: 356 },
  { start: 356, end: 454 },
  { start: 454, end: 323 },
  { start: 323, end: 361 },
  { start: 361, end: 288 },
  { start: 288, end: 397 },
  { start: 397, end: 365 },
  { start: 365, end: 379 },
  { start: 379, end: 378 },
  { start: 378, end: 400 },
  { start: 400, end: 377 },
  { start: 377, end: 152 },
  { start: 152, end: 148 },
  { start: 148, end: 176 },
  { start: 176, end: 149 },
  { start: 149, end: 150 },
  { start: 150, end: 136 },
  { start: 136, end: 172 },
  { start: 172, end: 58 },
  { start: 58, end: 132 },
  { start: 132, end: 93 },
  { start: 93, end: 234 },
  { start: 234, end: 127 },
  { start: 127, end: 162 },
  { start: 162, end: 21 },
  { start: 21, end: 54 },
  { start: 54, end: 103 },
  { start: 103, end: 67 },
  { start: 67, end: 109 },
  { start: 109, end: 10 },
];
// MEDIA PIPE 관련 변수

function waitForAction(actionName, callback) {
  actionCallbackMap.set(actionName, callback);
}

ws.onopen = () => {
  console.log("✅ WebSocket connected");
  try {
    device = new Device();
  } catch (err) {
    console.error("❌ Device creation failed:", err);
    return;
  }
  ws.send(JSON.stringify({ action: "getRtpCapabilities" }));
};

ws.onmessage = async (event) => {
  const msg = JSON.parse(event.data);
  console.log("📩 Received:", msg);

  const cb = actionCallbackMap.get(msg.action);
  if (cb) {
    cb(msg);
    actionCallbackMap.delete(msg.action);
    return;
  }

  switch (msg.action) {
    case "rtpCapabilities":
      await handleRtpCapabilities(msg.data);
      break;
    case "createTransportResponse":
      await handleCreateTransportResponse(msg.data);
      break;
    case "createConsumerTransportResponse":
      await handleCreateConsumerTransportResponse(msg.data);
      break;
    case "existingProducers":
      await handleExistingProducers(msg.data);
      break;
    case "newProducerAvailable":
      await handleNewProducerAvailable(msg);
      break;
    case "consumeResponse":
      await handleConsumeResponse(msg.data);
      break;
    case "producerClosed":
      handleProducerClosed(msg);
      break;
  }
};

async function handleRtpCapabilities(data) {
  try {
    await device.load({ routerRtpCapabilities: data });
    console.log("✅ Device loaded successfully");
    ws.send(JSON.stringify({ action: "createTransport" }));
  } catch (err) {
    console.error("❌ Failed to load device capabilities:", err);
  }
}

async function handleCreateTransportResponse(data) {
  console.log("✅ handleCreateTransportResponse called");
  console.log("🚛 Creating send transport");
  sendTransport = device.createSendTransport(data);

  sendTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
    console.log("🔗 Send transport connecting...");
    ws.send(
      JSON.stringify({ action: "connectTransport", data: { dtlsParameters } })
    );
    waitForAction("transportConnected", () => {
      console.log("✅ Send transport connected");
      callback();
    });
  });

  sendTransport.on("produce", ({ kind, rtpParameters }, callback, errback) => {
    console.log(`🎬 Producing ${kind}...`);
    ws.send(
      JSON.stringify({ action: "produce", data: { kind, rtpParameters } })
    );
    waitForAction("produceResponse", (res) => {
      console.log(`✅ ${kind} production started:`, res.id);
      callback({ id: res.id });
    });
  });

  await startProducing();
}

async function handleCreateConsumerTransportResponse(data) {
  console.log("📡 Creating receive transport");
  recvTransport = device.createRecvTransport(data);

  recvTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
    console.log("🔗 Receive transport connecting...");
    ws.send(
      JSON.stringify({
        action: "connectConsumerTransport",
        data: { dtlsParameters },
      })
    );
    waitForAction("consumerTransportConnected", () => {
      console.log("✅ Receive transport connected");
      callback();
    });
  });

  await processPendingConsumes();
}

async function handleExistingProducers(data) {
  console.log("📋 Received existing producers:", data);
  if (!data || data.length === 0) {
    console.log("📭 No existing producers");
    // If we are the first, we should announce we are ready
    ws.send(JSON.stringify({ action: "deviceReady" }));
    return;
  }
  pendingConsumeList.push(...data);
  if (!recvTransport) {
    console.log("📡 Creating consumer transport for existing producers");
    ws.send(JSON.stringify({ action: "createConsumerTransport" }));
  } else {
    await processPendingConsumes();
  }
}

async function handleNewProducerAvailable(msg) {
  console.log("🆕 New producer available:", msg.producerId, msg.kind);
  if (!device || !device.loaded) {
    console.warn("⚠️ Device not ready, ignoring new producer");
    return;
  }
  pendingConsumeList.push({ producerId: msg.producerId, kind: msg.kind });
  if (!recvTransport) {
    console.log("📡 Creating consumer transport for new producer");
    ws.send(JSON.stringify({ action: "createConsumerTransport" }));
  } else {
    await processPendingConsumes();
  }
}

async function handleConsumeResponse(data) {
  const { id, producerId, kind, rtpParameters } = data;
  console.log(`🎯 Creating consumer for ${kind} producer ${producerId}`);

  if (document.getElementById(`remote-${producerId}`)) {
    console.warn(`⚠️ Remote element for ${producerId} already exists`);
    return;
  }

  try {
    const consumer = await recvTransport.consume({
      id,
      producerId,
      kind,
      rtpParameters,
    });
    console.log(`✅ Consumer created for ${kind}:`, consumer.id);
    await createRemoteElement(consumer, producerId, kind);
  } catch (err) {
    console.error(`❌ Failed to create consumer for ${producerId}:`, err);
  }
}

function handleProducerClosed(msg) {
  console.log(`🚫 Producer closed: ${msg.producerId}`);
  const el = document.getElementById(`remote-${msg.producerId}`);
  if (el) {
    el.remove();
    console.log(`🗑️ Removed element for producer ${msg.producerId}`);
  }
}

async function startProducing() {
  console.log("✅ startProducing called");
  try {
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
    }
    localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    document.getElementById("localVideo").srcObject = localStream;
    console.log("📹 Got local media stream");

    // 🔥 전송용 스트림의 트랙들을 produce
    for (const track of localStream.getTracks()) {
      console.log(`🎯 Starting production for ${track.kind} track`);
      await sendTransport.produce({ track });
    }

    // 🔥 MediaPipe Worker 초기화 (비디오 트랙 직접 전달)
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      // 비디오 트랙이 있을 때만 워커 설정
      setupMediaPipeWorker(videoTrack);
    }

    // After producing, let the server know we are ready
    ws.send(JSON.stringify({ action: "deviceReady" }));
  } catch (err) {
    console.error("❌ Failed to get user media:", err);
    // 사용자 미디어 접근 거부 시 처리
    alert("카메라와 마이크 접근 권한이 필요합니다.");
  }
}

async function createRemoteElement(consumer, producerId, kind) {
  const element = document.createElement(kind === "video" ? "video" : "audio");
  element.id = `remote-${producerId}`;
  element.autoplay = true;
  element.playsInline = true;
  if (kind === "video") {
    element.controls = true;
  }
  const stream = new MediaStream([consumer.track]);
  element.srcObject = stream;
  document.getElementById("remoteMediaContainer").appendChild(element);
  console.log(`📺 Added ${kind} element for producer ${producerId}`);
}

async function processPendingConsumes() {
  if (pendingConsumeList.length === 0) {
    return;
  }
  console.log(`📥 Processing ${pendingConsumeList.length} pending consumes`);
  const toProcess = [...pendingConsumeList];
  pendingConsumeList.length = 0; // Clear the array

  for (const { producerId, kind } of toProcess) {
    await requestConsume(producerId, kind);
  }
}

async function requestConsume(producerId, kind) {
  if (!device?.loaded || !recvTransport || recvTransport.closed) {
    console.log("❌ Conditions not met, re-queuing consume request");
    pendingConsumeList.push({ producerId, kind });
    return;
  }
  if (document.getElementById(`remote-${producerId}`)) {
    console.log(`⚠️ Consumer for ${producerId} already exists`);
    return;
  }
  console.log(`📡 Requesting consume for ${kind} producer ${producerId}`);
  ws.send(
    JSON.stringify({
      action: "consume",
      data: { rtpCapabilities: device.rtpCapabilities, producerId, kind },
    })
  );
}

ws.onerror = (error) => console.error("❌ WebSocket error:", error);
ws.onclose = (event) =>
  console.log("🔌 WebSocket closed:", event.code, event.reason);

window.addEventListener("beforeunload", () => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
});

// 🔥 MediaPipe Worker 설정 및 실행 함수!!!!!!!!!!!!!!!!!
function setupMediaPipeWorker(videoTrack) {
  console.log("MediaPipe 설정 시작 ");
  const videoElement = document.getElementById("localVideo");
  mediaPipeWorker = new Worker("./dist/mediapipe-worker.bundle.js");

  console.log("MediaPipe webWorker생성 완료 ");

  // 워커 오류 핸들러 추가
  mediaPipeWorker.onerror = (error) => {
    console.error("❌ MediaPipe Worker 오류:", error);
  };

  console.log("워커로부터 메세지 오기전");
  // 워커로부터 분석 결과 수신
  mediaPipeWorker.onmessage = (event) => {
    const { type, landmarks, message } = event.data;

    if (type === "ready") {
      console.log("MediaPipe Worker가 준비되었습니다.(한번만 호출)");
      // Worker가 준비되면 프레임 분석 루프 시작
      // requestAnimationFrame(analyzeFrame);
      setTimeout(analyzeFrame, AI_ANALYSIS_INTERVAL);
      return;
    }

    if (type === "result") {
      handleAnalysisResult(landmarks);
      return;
    }
    if (type === "error_log") {
      console.error("Worker Console Error:", message);
      return;
    }
  };

  // ✅ [최적화] Throttling(주기 조절)과 ImageBitmap을 사용하는 새로운 분석 함수
  async function analyzeFrame() {
    if (mediaPipeWorker && videoElement.readyState >= 2) {
      // 비디오 프레임으로부터 ImageBitmap을 비동기적으로 생성
      const imageBitmap = await createImageBitmap(videoElement);

      // 워커로 ImageBitmap 전송 (데이터 복사 없음)
      mediaPipeWorker.postMessage({ imageBitmap }, [imageBitmap]);
    }

    // 다음 분석을 예약합니다.
    setTimeout(analyzeFrame, AI_ANALYSIS_INTERVAL);
  }
}

// 졸음 및 자리비움 상태 변수
let isDrowsy = false;
let isPresent = true;

// ✅ 수정 후: 새로운 코드의 상수들로 교체합니다.
const LEFT_EYE = [33, 160, 158, 133, 153, 144];
const RIGHT_EYE = [362, 385, 387, 263, 373, 380];
const BLINK_FRAMES = 3; // 눈 깜빡임 판단 기준 프레임 수
const EAR_THRESH = 0.2; // 눈 감김 판단 기준 EAR
const DROWSY_FRAMES = 10; // '졸음'으로 판단할 프레임 수

let closureFrames = 0; // 눈 감은 프레임을 세는 카운터

let absenceCounter = 0;
const ABSENCE_CONSECUTIVE_FRAMES = 5; // ⬅️🚀 이 숫자를 조절하여 속도를 튜닝합니다!

function drawFaceLandmarks(landmarks) {
  // 캔버스와 컨텍스트를 처음 사용할 때 한 번만 가져옵니다.
  if (!canvas) {
    canvas = document.getElementById("localCanvas");
    canvasCtx = canvas.getContext("2d");
  }

  const video = document.getElementById("localVideo");

  // 캔버스 크기를 비디오 크기에 맞춥니다.
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // 이전 프레임의 그림을 지웁니다.
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

  // 랜드마크가 없으면(얼굴 감지 실패) 아무것도 그리지 않습니다.
  if (!landmarks) {
    return;
  }

  // 선 스타일 설정
  canvasCtx.strokeStyle = "rgba(0, 255, 0, 0.7)";
  canvasCtx.lineWidth = 1.5;

  // MediaPipe가 제공하는 연결점 정보를 이용해 선을 그립니다.
  // 이 부분은 FaceLandmarker의 표준 연결점 정보입니다.
  const connections = FACE_LANDMARKS_CONNECTORS;

  for (const connection of connections) {
    const start = landmarks[connection.start];
    const end = landmarks[connection.end];

    if (start && end) {
      canvasCtx.beginPath();
      canvasCtx.moveTo(start.x * canvas.width, start.y * canvas.height);
      canvasCtx.lineTo(end.x * canvas.width, end.y * canvas.height);
      canvasCtx.stroke();
    }
  }
}

// 🔥 분석 결과 처리 및 서버 전송 함수

function handleAnalysisResult(landmarks) {
  drawFaceLandmarks(landmarks);

  // --- 얼굴이 감지되지 않았을 경우 ---
  if (!landmarks) {
    absenceCounter++;
    if (absenceCounter > ABSENCE_CONSECUTIVE_FRAMES && isPresent) {
      isPresent = false;
      console.warn("자리 비움 감지됨!");
      sendPeerStatusUpdate();
    }
    // 얼굴이 없으면 졸음 판단 로직을 실행할 필요가 없음
    return;
  }

  // --- 얼굴이 감지되었을 경우 ---
  absenceCounter = 0;
  if (!isPresent) {
    isPresent = true;
    console.log("사용자 복귀함.");
    sendPeerStatusUpdate();
  }

  // ✅ 새로운 코드의 정교한 졸음 판단 로직을 여기에 적용합니다.
  const getEAR = (eyeIndices) => {
    const pts = eyeIndices.map((i) => landmarks[i]);
    const d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    return (d(pts[1], pts[5]) + d(pts[2], pts[4])) / (2 * d(pts[0], pts[3]));
  };

  const ear = (getEAR(LEFT_EYE) + getEAR(RIGHT_EYE)) / 2;

  // ✅ [디버깅] 이 로그를 추가하여 실시간 값을 확인합니다!
  console.log(`EAR: ${ear.toFixed(3)}, 감은 프레임: ${closureFrames}`);

  if (ear < EAR_THRESH) {
    closureFrames++;
    if (closureFrames >= DROWSY_FRAMES) {
      if (!isDrowsy) {
        isDrowsy = true;
        console.warn("😴 졸음 감지됨!");
        sendPeerStatusUpdate();
      }
    }
  } else {
    if (closureFrames > BLINK_FRAMES && isDrowsy) {
      isDrowsy = false;
      console.log("😀 졸음 상태 해제.");
      sendPeerStatusUpdate();
    }
    closureFrames = 0;
  }
}

// 🔥 서버로 상태 업데이트를 전송하는 함수
function sendPeerStatusUpdate() {
  ws.send(
    JSON.stringify({
      action: "updatePeerStatus",
      data: {
        isPresent,
        isDrowsy,
      },
    })
  );
}

// 🔥 MediaPipe Worker 설정 및 실행 함수!!!!!!!!!!!!!!!!!
