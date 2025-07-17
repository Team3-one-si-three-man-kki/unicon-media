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

    // --- 핵심 수정: 새로운 원격 미디어 섹션 ---
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
    // 이 메서드는 더 이상 사용되지 않거나, mainStageContainer를 반환하도록 변경될 수 있습니다.
    // 현재는 remoteMediaContainer가 존재하지 않으므로 mainStageContainer를 반환합니다.
    return this.mainStageContainer;
  }

  // 칠판 버튼을 표시하는 메서드
  showWhiteboardButton() {
    this.whiteboardButton.style.display = "inline-block";
  }

  enableControls() {
    console.log("Enabling media controls...");
    this.muteButton.disabled = false;
    this.cameraOffButton.disabled = false;
  }

  enableScreenSharing(onClickCallback) {
    console.log("Enabling screen sharing feature...");
    this.screenShareButton.disabled = false;
    this.screenShareButton.onclick = onClickCallback;
  }

  updateLayoutForScreenShare(isSharing) {
    if (isSharing) {
      this.localMediaContainer.classList.add("small");
      this.mainStageContainer.classList.add("screen-sharing-active"); // Apply to main stage for layout adjustment
    } else {
      this.localMediaContainer.classList.remove("small");
      this.mainStageContainer.classList.remove("screen-sharing-active"); // Remove from main stage
      this.resetLayoutAfterScreenShare(); // Call new method to reset layout
    }
  }

  resetLayoutAfterScreenShare() {
    console.log("Resetting layout after screen share.");
    // 모든 비디오 요소를 mainStageContainer로 이동
    const allVideoElements = Array.from(document.querySelectorAll("video"));
    allVideoElements.forEach((videoElement) => {
      // localVideo는 localMediaContainer에 유지
      if (videoElement.id === "localVideo") {
        this.localMediaContainer.appendChild(videoElement);
      } else {
        // 다른 모든 비디오는 mainStageContainer로 이동
        this.mainStageContainer.appendChild(videoElement);
      }
    });

    // 로컬 화면 공유 요소가 남아있다면 제거
    const localScreenShareElement = document.getElementById(
      "local-screen-share-wrapper"
    );
    if (localScreenShareElement) {
      localScreenShareElement.remove();
      console.log("Removed local screen share wrapper from UI.");
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

  // 로컬 비디오 상태 업데이트 (카메라 on/off에 따른 아바타 표시)
  updateLocalVideoState(isEnabled) {
    this.localMediaContainer.classList.toggle('video-paused', !isEnabled);
  }

  /**
   * ✅ [최종 수정] 원격 사용자의 오디오 상태를 UI에 업데이트합니다.
   * @param {HTMLElement} elementWrapper - 상태를 표시할 비디오 컨테이너.
   * @param {boolean} isMuted - 음소거 여부.
   */
  updateRemoteAudioStatus(elementWrapper, isMuted) {
    const container = this.ensureStatusContainer(elementWrapper);
    let indicator = container.querySelector('.audio-muted-indicator');

    if (isMuted) {
      // 음소거 상태일 때, 아이콘이 없으면 새로 생성합니다.
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'audio-muted-indicator';
        container.appendChild(indicator);
      }
    } else {
      // 음소거가 아닐 때, 아이콘이 존재하면 제거합니다.
      indicator?.remove();
    }
  }

  /**
   * ✅ [최종 수정] 원격 사용자의 비디오 상태를 UI에 업데이트합니다.
   * 'video-paused' 클래스 토글과 아이콘 표시를 함께 관리합니다.
   * @param {HTMLElement} elementWrapper - 상태를 표시할 비디오 컨테이너.
   * @param {boolean} isPaused - 비디오 중지 여부.
   */
  updateRemoteVideoStatus(elementWrapper, isPaused) {
    // 아바타 표시를 위한 클래스 토글
    elementWrapper.classList.toggle('video-paused', isPaused);

    const container = this.ensureStatusContainer(elementWrapper);
    let indicator = container.querySelector('.video-paused-indicator');

    if (isPaused) {
      // 비디오가 꺼졌을 때, 아이콘이 없으면 새로 생성합니다.
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'video-paused-indicator';
        container.appendChild(indicator);
      }
    } else {
      // 비디오가 켜졌을 때, 아이콘이 존재하면 제거합니다.
      indicator?.remove();
    }
  }

  /**
   * ✅ [최종 수정] elementWrapper 내부에 상태 아이콘 컨테이너가 있는지 확인하고 없으면 생성합니다.
   * @param {HTMLElement} elementWrapper
   * @returns {HTMLElement} 상태 아이콘 컨테이너
   */
  ensureStatusContainer(elementWrapper) {
    let container = elementWrapper.querySelector('.status-indicator-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'status-indicator-container';
      elementWrapper.appendChild(container);
    }
    return container;
  }

  // 비디오 레이아웃 업데이트 (DOM 조작 최소화)
  updateVideoLayout(mainStageElements, sidebarElements) {
    const mainStage = this.mainStageContainer;
    const sidebar = this.sidebarContainer;

    // 현재 DOM 상태를 파악
    const currentMainChildren = Array.from(mainStage.children);
    const currentSidebarChildren = Array.from(sidebar.children);

    // 1. 메인 스테이지에 있어야 할 요소들을 처리
    mainStageElements.forEach(element => {
      if (element.parentNode !== mainStage) {
        mainStage.appendChild(element);
      }
      element.classList.remove('thumbnail');
      element.classList.add('main-stage-video');
    });

    // 2. 사이드바에 있어야 할 요소들을 처리
    sidebarElements.forEach(element => {
      if (element.parentNode !== sidebar) {
        sidebar.appendChild(element);
      }
      element.classList.add('thumbnail');
      element.classList.remove('main-stage-video');
    });

    // 3. 더 이상 메인 스테이지나 사이드바에 속하지 않는 요소들을 제거 (필요시)
    // 이 로직은 main.js에서 직접 요소를 관리하므로 여기서는 필요 없을 수 있습니다.
    // 하지만 혹시 모를 잔여 요소 정리를 위해 남겨둡니다.
    currentMainChildren.forEach(child => {
      if (!mainStageElements.includes(child) && !sidebarElements.includes(child));
    });

    currentSidebarChildren.forEach(child => {
      if (!mainStageElements.includes(child) && !sidebarElements.includes(child));
    });
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
    this.mainStageContainer.prepend(screenShareWrapper); // remoteMediaContainer 대신 mainStageContainer 사용
    console.log("Added local screen share to UI.");
  }

  removeLocalScreenShare() {
    const element = document.getElementById("local-screen-share-wrapper");
    if (element) {
      element.remove();
      console.log("Removed local screen share from UI.");
      this.updateLayoutForScreenShare(false); // 레이아웃 복원
    }
  }

  // ✅ [추가] drawFaceMesh가 참조할 로컬 비디오와 캔버스를 설정하는 함수
  setLocalMediaElements(videoEl, canvasEl) {
    this.video = videoEl;
    this.canvas = canvasEl;
    this.canvasCtx = canvasEl.getContext("2d");
  }
}
