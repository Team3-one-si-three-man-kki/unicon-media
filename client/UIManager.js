// client/UIManager.js

// 이 상수는 그림을 그리는 UIManager가 가지고 있는 것이 더 적합합니다.
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

export class UIManager {
  constructor() {
    // 1. 메인 컨테이너 생성 및 body에 추가
    this.appRootContainer = document.createElement("div");
    this.appRootContainer.className = "sub_contents"; // 기존 class 유지
    this.appRootContainer.style.cssText =
      "width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center;";
    document.body.appendChild(this.appRootContainer);

    // 2. localMediaContainer 생성 및 appRootContainer에 추가
    this.localMediaContainer = document.createElement("div");
    this.localMediaContainer.id = "localMediaContainer";
    this.localMediaContainer.style.cssText =
      "position: relative; width: 300px; height: 225px; border: 1px solid #ccc; border-radius: 4px; background-color: #000; margin-bottom: 10px;";
    this.appRootContainer.appendChild(this.localMediaContainer);

    // 3. video 요소 생성 및 localMediaContainer에 추가
    this.video = document.createElement("video");
    this.video.id = "localVideo";
    this.video.controls = true;
    this.video.muted = true; // 로컬 비디오는 음소거
    this.video.autoplay = true; // 자동 재생 추가
    this.video.playsInline = true; // iOS에서 인라인 재생
    this.video.style.cssText = "height: 100%; object-fit: cover;";
    this.localMediaContainer.appendChild(this.video);

    // 4. canvas 요소 생성 및 localMediaContainer에 추가
    this.canvas = document.createElement("canvas");
    this.canvas.id = "localCanvas";
    this.canvas.style.cssText =
      "position: absolute; top: 0; left: 0; width: 100%; height: 100%;";
    this.localMediaContainer.appendChild(this.canvas);
    this.canvasCtx = this.canvas.getContext("2d");

    // 5. controls 그룹 생성 및 appRootContainer에 추가
    this.controlsGroup = document.createElement("div");
    this.controlsGroup.className = "controls"; // 기존 class 유지
    this.appRootContainer.appendChild(this.controlsGroup);

    // 6. muteButton 생성 및 controlsGroup에 추가
    this.muteButton = document.createElement("button"); // xf:trigger 대신 button 사용
    this.muteButton.id = "muteButton";
    this.muteButton.textContent = "음소거";
    this.muteButton.disabled = true;
    this.controlsGroup.appendChild(this.muteButton);

    // 7. cameraOffButton 생성 및 controlsGroup에 추가
    this.cameraOffButton = document.createElement("button"); // xf:trigger 대신 button 사용
    this.cameraOffButton.id = "cameraOffButton";
    this.cameraOffButton.textContent = "카메라 끄기";
    this.cameraOffButton.disabled = true;
    this.controlsGroup.appendChild(this.cameraOffButton);

    // 8. screenShareButton 생성 및 controlsGroup에 추가
    this.screenShareButton = document.createElement("button"); // xf:trigger 대신 button 사용
    this.screenShareButton.id = "screenShareButton";
    this.screenShareButton.textContent = "화면공유";
    this.screenShareButton.disabled = true; // 초기에는 비활성화
    this.controlsGroup.appendChild(this.screenShareButton);

    // 9. remoteMediaContainer 생성 및 appRootContainer에 추가
    this.remoteMediaContainer = document.createElement("div");
    this.remoteMediaContainer.id = "remoteMediaContainer";
    this.appRootContainer.appendChild(this.remoteMediaContainer);

    console.log("UIManager: All UI elements created and appended to DOM.");
  }

  //      [핵심 추가] 모든 컨트롤 버튼을 활성화하는 메소드
  enableControls() {
    console.log("🛠️ Enabling media controls...");
    this.muteButton.disabled = false;
    this.cameraOffButton.disabled = false;
    // screenShareButton은 관리자만 활성화되므로 여기서는 처리하지 않음
  }

  //      관리자 여부에 따라 화면 공유 버튼 활성화
  setAdminControls(isAdmin) {
    console.log(`👑 Admin status: ${isAdmin}. Setting controls.`);
    this.screenShareButton.disabled = !isAdmin;
  }

  //      화면 공유 상태에 따라 레이아웃을 변경하는 메소드
  updateLayoutForScreenShare(isSharing) {
    // localMediaContainer는 이미 this.localMediaContainer로 참조됨
    if (isSharing) {
      // 화면 공유 시, 로컬 비디오는 작게 만들고, 원격 컨테이너는 화면 공유에 집중
      this.localMediaContainer.classList.add("small");
      this.remoteMediaContainer.classList.add("screen-sharing-active");
    } else {
      // 화면 공유 종료 시, 원래대로 복원
      this.localMediaContainer.classList.remove("small");
      this.remoteMediaContainer.classList.remove("screen-sharing-active");
    }
  }

  drawFaceMesh(landmarks) {
    // 캔버스 크기를 비디오 크기에 맞춥니다.
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!landmarks) return;

    // 선 스타일 설정
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

  // 원격 비디오 엘리먼트 생성 등 다른 UI 관련 로직도 여기에 추가...
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

  //      관리자 자신의 화면 공유를 UI에 추가하는 메소드
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

  //      로컬 화면 공유를 UI에서 제거하는 메소드
  removeLocalScreenShare() {
    const element = document.getElementById("local-screen-share-wrapper");
    if (element) {
      element.remove();
      console.log("     Removed local screen share from UI.");
      this.updateLayoutForScreenShare(false); // 레이아웃 복원
    }
  }
}
