// client/mediapipe-worker.js (Rollup 입력용 최종 버전)
console.log("Worker script successfully loaded and parsed.");

// ✅ 클래식 워커 방식에 맞춰 importScripts로 스크립트를 로드합니다.
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let faceLandmarker;

async function setupFaceLandmarker() {
  try {
    console.log("Worker: MediaPipe FaceLandmarker 설정 시작");

    const vision = await FilesetResolver.forVisionTasks("./mediapipe"); // dist 폴더 기준으로 상대 경로

    faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `./mediapipe/face_landmarker.task`,
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      outputFaceBlendshapes: true,
      outputFacialTransformationMatrixes: true,
      numFaces: 1,
    });

    console.log("Worker: ✅ MediaPipe Worker 설정 완료, 준비 메시지 전송");
    self.postMessage({ type: "ready" });
  } catch (error) {
    console.error(
      "Worker:  setupFaceLandmarker 함수에서 오류 발생:",
      error.message,
      error.stack
    );
    self.postMessage({
      type: "error",
      message: `Setup Error: ${error.message}`,
    });
  }
}

setupFaceLandmarker();

// 메인 스레드로부터 메시지 수신
self.onmessage = (event) => {
  const { imageBitmap } = event.data;

  if (!faceLandmarker) {
    console.warn(
      "Worker: faceLandmarker가 아직 준비되지 않았습니다. 메시지를 무시합니다."
    );
    return;
  }

  // ImageBitmap은 timestamp가 없으므로 performance.now() 사용
  const timestamp = performance.now();
  const results = faceLandmarker.detectForVideo(imageBitmap, timestamp);

  if (results.faceLandmarks.length > 0) {
    postMessage({
      type: "result",
      landmarks: results.faceLandmarks[0],
    });
  } else {
    postMessage({
      type: "result",
      landmarks: null,
    });
  }
  // 받은 ImageBitmap은 닫아서 메모리 관리
  imageBitmap.close();
};
