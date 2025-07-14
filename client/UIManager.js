// client/UIManager.js

// UIManager는 더 이상 특정 모듈(CanvasModule)을 알지 못합니다.
// import { CanvasModule } from "./modules/CanvasModule.js";

const FACE_LANDMARKS_CONNECTORS = [
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
  { start: 362, end: 382 },
  { start: 382, end: 381 },
  { start: 381, end: 380 },
  { start: 380, end: 373 },
  { start: 373, end: 374 },
  { start: 374, end: 390 },
  { start: 390, end: 249 },
  { start: 249, end: 362 },
  { start: 336, end: 296 },
  { start: 296, end: 334 },
  { start: 334, end: 293 },
  { start: 293, end: 300 },
  { start: 300, end: 276 },
  { start: 33, end: 7 },
  { start: 7, end: 163 },
  { start: 163, end: 144 },
  { start: 144, end: 145 },
  { start: 145, end: 153 },
  { start: 153, end: 154 },
  { start: 154, end: 155 },
  { start: 155, end: 33 },
  { start: 107, end: 66 },
  { start: 66, end: 105 },
  { start: 105, end: 63 },
  { start: 63, end: 70 },
  { start: 70, end: 46 },
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

export class UIManager {
  constructor() {
    this.appRootContainer = document.createElement("div");
    this.appRootContainer.className = "sub_contents";
    this.appRootContainer.style.cssText =
      "width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center;";
    document.body.appendChild(this.appRootContainer);

    this.localMediaContainer = document.createElement("div");
    this.localMediaContainer.id = "localMediaContainer";
    this.localMediaContainer.style.cssText =
      "position: relative; width: 300px; height: 225px; border: 1px solid #ccc; border-radius: 4px; background-color: #000; margin-bottom: 10px;";
    this.appRootContainer.appendChild(this.localMediaContainer);

    this.video = document.createElement("video");
    this.video.id = "localVideo";
    this.video.controls = true;
    this.video.muted = true;
    this.video.autoplay = true;
    this.video.playsInline = true;
    this.video.style.cssText = "height: 100%; object-fit: cover;";
    this.localMediaContainer.appendChild(this.video);

    this.canvas = document.createElement("canvas");
    this.canvas.id = "localCanvas";
    this.canvas.style.cssText =
      "position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"; // AI용 캔버스는 이벤트 방해 안함
    this.localMediaContainer.appendChild(this.canvas);
    this.canvasCtx = this.canvas.getContext("2d");

    this.controlsGroup = document.createElement("div");
    this.controlsGroup.className = "controls";
    this.appRootContainer.appendChild(this.controlsGroup);

    this.muteButton = document.createElement("button");
    this.muteButton.id = "muteButton";
    this.muteButton.textContent = "음소거";
    this.muteButton.disabled = true;
    this.controlsGroup.appendChild(this.muteButton);

    this.cameraOffButton = document.createElement("button");
    this.cameraOffButton.id = "cameraOffButton";
    this.cameraOffButton.textContent = "카메라 끄기";
    this.cameraOffButton.disabled = true;
    this.controlsGroup.appendChild(this.cameraOffButton);

    this.screenShareButton = document.createElement("button");
    this.screenShareButton.id = "screenShareButton";
    this.screenShareButton.textContent = "화면공유";
    this.screenShareButton.disabled = true;
    this.controlsGroup.appendChild(this.screenShareButton);

    this.whiteboardButton = document.createElement("button");
    this.whiteboardButton.id = "whiteboardButton";
    this.whiteboardButton.textContent = "칠판";
    this.whiteboardButton.style.display = "none";
    this.controlsGroup.appendChild(this.whiteboardButton);

    // --- ✅ [핵심 수정] 새로운 원격 미디어 섹션 ---
    this.remoteSection = document.createElement("div");
    this.remoteSection.id = "remoteSection";
    this.appRootContainer.appendChild(this.remoteSection);

    this.mainStageContainer = document.createElement("div");
    this.mainStageContainer.id = "mainStageContainer";
    this.remoteSection.appendChild(this.mainStageContainer);

    this.sidebarContainer = document.createElement("div");
    this.sidebarContainer.id = "sidebarContainer";
    this.remoteSection.appendChild(this.sidebarContainer);

    console.log("UIManager: Stage and Sidebar UI created.");
  }

  getMainStageContainer() {
    return this.mainStageContainer;
  }
  getSidebarContainer() {
    return this.sidebarContainer;
  }

  // main.js가 공용 컨테이너에 접근할 수 있도록 getter 제공
  getRemoteMediaContainer() {
    return this.remoteMediaContainer;
  }

  // 칠판 버튼을 표시하는 메서드
  showWhiteboardButton() {
    this.whiteboardButton.style.display = "inline-block";
  }

  enableControls() {
    console.log("🛠️ Enabling media controls...");
    this.muteButton.disabled = false;
    this.cameraOffButton.disabled = false;
  }

  enableScreenSharing(onClickCallback) {
    console.log("💻 Enabling screen sharing feature...");
    this.screenShareButton.disabled = false;
    this.screenShareButton.onclick = onClickCallback;
  }

  updateLayoutForScreenShare(isSharing) {
    if (isSharing) {
      this.localMediaContainer.classList.add("small");
      this.remoteMediaContainer.classList.add("screen-sharing-active");
    } else {
      this.localMediaContainer.classList.remove("small");
      this.remoteMediaContainer.classList.remove("screen-sharing-active");
    }
  }

  drawFaceMesh(landmarks) {
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!landmarks) return;

    this.canvasCtx.strokeStyle = "rgba(0, 255, 0, 0.7)";
    this.canvasCtx.lineWidth = 1.5;

    for (const connection of FACE_LANDMARKS_CONNECTORS) {
      const start = landmarks[connection.start];
      const end = landmarks[connection.end];
      if (start && end) {
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(
          start.x * this.canvas.width,
          start.y * this.canvas.height
        );
        this.canvasCtx.lineTo(
          end.x * this.canvas.width,
          end.y * this.canvas.height
        );
        this.canvasCtx.stroke();
      }
    }
  }

  // 아래의 트랙 추가/제거 로직은 이제 main.js에서 직접 DOM을 조작하므로 UIManager에서는 제거하거나,
  // 혹은 main.js에서 호출할 수 있는 더 일반적인 DOM 조작 헬퍼 함수로 남겨둘 수 있습니다.
  // 여기서는 main.js가 직접 처리하도록 역할을 완전히 분리하기 위해 제거하는 방향으로 진행합니다.
  // 아래 함수 사용안함 -> 나중에 제거

  addRemoteTrack(track, producerId, appData) {
    if (!this.remoteMediaContainer) {
      console.error(
        "    UIManager.addRemoteTrack: remoteMediaContainer가 유효하지 않습니다. 원격 트랙을 추가할 수 없습니다."
      );
      return;
    }

    // 화면 공유 스트림인 경우 특별 처리
    if (appData && appData.source === "screen") {
      this.updateLayoutForScreenShare(true);
      const screenShareWrapper = document.createElement("div");
      screenShareWrapper.id = `remote-screen-${producerId}`;
      screenShareWrapper.classList.add("screen-share-wrapper");

      const element = document.createElement(track.kind);
      element.autoplay = true;
      element.playsInline = true;
      element.srcObject = new MediaStream([track]);

      screenShareWrapper.appendChild(element);
      // 화면 공유는 보통 컨테이너의 맨 앞에 오도록 prepend 사용
      this.remoteMediaContainer.prepend(screenShareWrapper);
      console.log(`     Added screen share for producer ${producerId}`);
    } else {
      const element = document.createElement(track.kind);
      element.id = `remote-${producerId}`;
      element.autoplay = true;
      element.playsInline = true;
      if (track.kind === "video") {
        element.controls = true;
      }
      element.srcObject = new MediaStream([track]);

      this.remoteMediaContainer.appendChild(element);
      console.log(
        `     Added remote ${track.kind} element for producer ${producerId}`
      );
    }
  }

  removeRemoteTrack(producerId) {
    // 일반 비디오와 화면 공유 엘리먼트를 모두 찾아 제거
    const remoteVideo = document.getElementById(`remote-${producerId}`);
    const screenShare = document.getElementById(`remote-screen-${producerId}`);

    if (remoteVideo) {
      remoteVideo.remove();
      console.log(`     Removed video element for producer ${producerId}`);
    }
    if (screenShare) {
      screenShare.remove();
      console.log(`     Removed screen share for producer ${producerId}`);
      // 화면 공유가 종료되었으므로 레이아웃 복원
      this.updateLayoutForScreenShare(false);
    }
  }

  addLocalScreenShare(track) {
    this.updateLayoutForScreenShare(true);
    const screenShareWrapper = document.createElement("div");
    screenShareWrapper.id = "local-screen-share-wrapper"; // 로컬 공유는 ID가 고정됨
    screenShareWrapper.classList.add("screen-share-wrapper");

    const element = document.createElement(track.kind);
    element.autoplay = true;
    element.playsInline = true;
    element.muted = true; // 자기 자신의 소리는 음소거
    element.srcObject = new MediaStream([track]);

    screenShareWrapper.appendChild(element);
    this.remoteMediaContainer.prepend(screenShareWrapper);
    console.log("     Added local screen share to UI.");
  }

  removeLocalScreenShare() {
    const element = document.getElementById("local-screen-share-wrapper");
    if (element) {
      element.remove();
      console.log("     Removed local screen share from UI.");
      this.updateLayoutForScreenShare(false); // 레이아웃 복원
    }
  }
}
