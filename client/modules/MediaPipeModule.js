// client/modules/MediaPipeModule.js

import { EventEmitter } from "../utils/EventEmitter.js";

// ✅ EventEmitter를 상속받습니다.
export class MediaPipeModule extends EventEmitter {
  constructor(videoElement) {
    super();

    this.videoElement = videoElement;
    this.worker = new Worker("./dist/mediapipe-worker.bundle.js");

    // ✅ 1. 모든 상태와 상수를 클래스의 속성(this)으로 변경합니다.
    this.isDrowsy = false;
    this.isPresent = true;

    this.LEFT_EYE = [33, 160, 158, 133, 153, 144];
    this.RIGHT_EYE = [362, 385, 387, 263, 373, 380];
    this.EAR_THRESH = 0.2;
    this.DROWSY_FRAMES = 10;

    this.closureFrames = 0;
    this.absenceCounter = 0;
    this.ABSENCE_CONSECUTIVE_FRAMES = 15; // 필요에 따라 조정

    this.worker.onerror = (error) => {
      console.error("❌ MediaPipe Worker 오류:", error);
      this.emit("error", error); // 에러도 이벤트로 외부에 알립니다.
    };
  }

  start() {
    this.worker.onmessage = (event) => {
      const { type, landmarks } = event.data;
      if (type === "ready") {
        this._startAnalysisLoop();
      } else if (type === "result") {
        this._handleAnalysisResult(landmarks);
      }
    };
  }

  _startAnalysisLoop() {
    const AI_ANALYSIS_INTERVAL = 200;
    const analyzeFrame = async () => {
      if (this.worker && this.videoElement.readyState >= 2) {
        const imageBitmap = await createImageBitmap(this.videoElement);
        this.worker.postMessage({ imageBitmap }, [imageBitmap]);
      }
      setTimeout(analyzeFrame, AI_ANALYSIS_INTERVAL);
    };
    setTimeout(analyzeFrame, AI_ANALYSIS_INTERVAL);
  }

  _handleAnalysisResult(landmarks) {
    // ✅ 2. 랜드마크 그리기 요청은 이벤트로만 방송합니다.
    this.emit("landmarksUpdate", landmarks);

    const previousIsPresent = this.isPresent;
    const previousIsDrowsy = this.isDrowsy;

    // --- 자리 비움 / 복귀 판단 ---
    if (!landmarks) {
      this.absenceCounter++;
      if (this.absenceCounter > this.ABSENCE_CONSECUTIVE_FRAMES) {
        this.isPresent = false;
      }
    } else {
      this.absenceCounter = 0;
      this.isPresent = true;
    }

    // --- 졸음 판단 (얼굴이 감지된 경우에만) ---
    if (landmarks) {
      const getEAR = (eyeIndices) => {
        const pts = eyeIndices.map((i) => landmarks[i]);
        const d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
        return (
          (d(pts[1], pts[5]) + d(pts[2], pts[4])) / (2 * d(pts[0], pts[3]))
        );
      };
      const ear = (getEAR(this.LEFT_EYE) + getEAR(this.RIGHT_EYE)) / 2;

      if (ear < this.EAR_THRESH) {
        this.closureFrames++;
        if (this.closureFrames >= this.DROWSY_FRAMES) {
          this.isDrowsy = true;
        }
      } else {
        this.isDrowsy = false;
        this.closureFrames = 0;
      }
    } else {
      // 얼굴이 없으면 졸음 상태는 아니므로 리셋
      this.isDrowsy = false;
      this.closureFrames = 0;
    }

    // ✅ 3. 상태가 '변경'되었을 때만 이벤트를 방송합니다.
    if (previousIsPresent !== this.isPresent) {
      this.emit("absenceUpdate", { isPresent: this.isPresent });
    }
    if (previousIsDrowsy !== this.isDrowsy) {
      this.emit("drowsinessUpdate", { isDrowsy: this.isDrowsy });
    }
  }
}
