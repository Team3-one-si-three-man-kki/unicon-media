// client/UIManager.js - Modern Zoom-style UI

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
    this.isFullScreen = false;
    this.initializeUI();
    this.applyStyles();
  }

  initializeUI() {
    // Main app container
    this.appRootContainer = document.createElement("div");
    this.appRootContainer.className = "video-conference-app";
    this.appRootContainer.style.cssText = `
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      overflow: hidden;
      position: relative;
    `;
    document.body.appendChild(this.appRootContainer);

    // Header section
    this.createHeader();

    // Main content area
    this.createMainContent();

    // Controls section
    this.createControls();
  }

  createHeader() {
    this.headerSection = document.createElement("div");
    this.headerSection.className = "header-section";
    this.headerSection.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 24px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    `;

    // Room info
    const roomInfo = document.createElement("div");
    roomInfo.className = "room-info";
    roomInfo.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      color: #333;
    `;

    const roomTitle = document.createElement("h2");
    roomTitle.textContent = "화상회의";
    roomTitle.style.cssText = `
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #2c3e50;
    `;

    const participantCount = document.createElement("span");
    participantCount.className = "participant-count";
    participantCount.textContent = "참가자 1명";
    participantCount.style.cssText = `
      background: #e8f4f8;
      color: #2980b9;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
    `;

    roomInfo.appendChild(roomTitle);
    roomInfo.appendChild(participantCount);

    // Header controls
    const headerControls = document.createElement("div");
    headerControls.className = "header-controls";
    headerControls.style.cssText = `
      display: flex;
      gap: 8px;
      align-items: center;
    `;

    // Fullscreen button
    this.fullscreenButton = this.createHeaderButton("⛶", "전체화면", () => {
      this.toggleFullscreen();
    });

    // Settings button
    this.settingsButton = this.createHeaderButton("⚙", "설정", () => {
    });

    headerControls.appendChild(this.fullscreenButton);
    headerControls.appendChild(this.settingsButton);

    this.headerSection.appendChild(roomInfo);
    this.headerSection.appendChild(headerControls);
    this.appRootContainer.appendChild(this.headerSection);
  }

  createHeaderButton(icon, tooltip, onClick) {
    const button = document.createElement("button");
    button.innerHTML = icon;
    button.title = tooltip;
    button.onclick = onClick;
    button.style.cssText = `
      width: 36px;
      height: 36px;
      border: none;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      color: #555;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    `;

    button.addEventListener('mouseenter', () => {
      button.style.background = 'rgba(255, 255, 255, 1)';
      button.style.transform = 'translateY(-1px)';
      button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.background = 'rgba(255, 255, 255, 0.8)';
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    });

    return button;
  }

  createMainContent() {
    this.mainContentArea = document.createElement("div");
    this.mainContentArea.className = "main-content";
    this.mainContentArea.style.cssText = `
      flex: 1;
      display: flex;
      gap: 16px;
      padding: 16px;
      overflow: hidden;
    `;

    // Main video stage
    this.mainStageContainer = document.createElement("div");
    this.mainStageContainer.id = "mainStageContainer";
    this.mainStageContainer.style.cssText = `
      flex: 1;
      position: relative;
      background: #1a1a1a;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      border: 2px solid rgba(255, 255, 255, 0.1);
    `;

    // Video sidebar
    this.sidebarContainer = document.createElement("div");
    this.sidebarContainer.id = "sidebarContainer";
    this.sidebarContainer.style.cssText = `
      width: 280px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow-y: auto;
      padding: 4px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
    `;

    // Custom scrollbar for webkit browsers
    const scrollbarStyles = `
      .video-conference-app #sidebarContainer::-webkit-scrollbar {
        width: 6px;
      }
      .video-conference-app #sidebarContainer::-webkit-scrollbar-track {
        background: transparent;
      }
      .video-conference-app #sidebarContainer::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
      }
      .video-conference-app #sidebarContainer::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.5);
      }
    `;

    if (!document.getElementById('custom-scrollbar-styles')) {
      const style = document.createElement('style');
      style.id = 'custom-scrollbar-styles';
      style.textContent = scrollbarStyles;
      document.head.appendChild(style);
    }

    this.mainContentArea.appendChild(this.mainStageContainer);
    this.mainContentArea.appendChild(this.sidebarContainer);
    this.appRootContainer.appendChild(this.mainContentArea);
  }

  createControls() {
    this.controlsSection = document.createElement("div");
    this.controlsSection.className = "controls-section";
    this.controlsSection.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.1);
    `;

    this.controlsGroup = document.createElement("div");
    this.controlsGroup.className = "controls-group";
    this.controlsGroup.style.cssText = `
      display: flex;
      gap: 16px;
      align-items: center;
      background: rgba(255, 255, 255, 0.8);
      padding: 12px 24px;
      border-radius: 48px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(10px);
    `;

    // Create control buttons
    this.muteButton = this.createControlButton(`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 352 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M176 352c53 0 96-43 96-96V96c0-53-43-96-96-96S80 43 80 96v160c0 53 43 96 96 96zm160-160h-16c-8.8 0-16 7.2-16 16v48c0 74.8-64.5 134.8-140.8 127.4C96.7 376.9 48 317.1 48 250.3V208c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16v40.2c0 89.6 64 169.6 152 181.7V464H96c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16h160c8.8 0 16-7.2 16-16v-16c0-8.8-7.2-16-16-16h-56v-33.8C285.7 418.5 352 344.9 352 256v-48c0-8.8-7.2-16-16-16z"/></svg>`, "음소거", "audio", true);
    this.cameraOffButton = this.createControlButton(`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M633.8 458.1l-55-42.5c15.4-1.4 29.2-13.7 29.2-31.1v-257c0-25.5-29.1-40.4-50.4-25.8L448 177.3v137.2l-32-24.7v-178c0-26.4-21.4-47.8-47.8-47.8H123.9L45.5 3.4C38.5-2 28.5-.8 23 6.2L3.4 31.4c-5.4 7-4.2 17 2.8 22.4L42.7 82 416 370.6l178.5 138c7 5.4 17 4.2 22.5-2.8l19.6-25.3c5.5-6.9 4.2-17-2.8-22.4zM32 400.2c0 26.4 21.4 47.8 47.8 47.8h288.4c11.2 0 21.4-4 29.6-10.5L32 154.7v245.5z"/></svg>`, "카메라 끄기", "video", true);
    this.screenShareButton = this.createControlButton(`< svg xmlns = "http://www.w3.org/2000/svg" width="28" height="28" viewBox = "0 0 576 512" >< !--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M528 0H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h192l-16 48h-72c-13.3 0-24 10.7-24 24s10.7 24 24 24h272c13.3 0 24-10.7 24-24s-10.7-24-24-24h-72l-16-48h192c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zm-16 352H64V64h448v288z"/></svg>`, "화면공유", "screen", true);
    this.whiteboardButton = this.createControlButton(`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M109.5 244l134.6-134.6-44.1-44.1-61.7 61.7a7.9 7.9 0 0 1 -11.2 0l-11.2-11.2c-3.1-3.1-3.1-8.1 0-11.2l61.7-61.7-33.6-33.7C131.5-3.1 111.4-3.1 99 9.3L9.3 99c-12.4 12.4-12.4 32.5 0 44.9l100.2 100.2zm388.5-116.8c18.8-18.8 18.8-49.2 0-67.9l-45.3-45.3c-18.8-18.8-49.2-18.8-68 0l-46 46 113.2 113.2 46-46zM316.1 82.7l-297 297L.3 487.1c-2.5 14.5 10.1 27.1 24.6 24.6l107.5-18.8L429.3 195.9 316.1 82.7zm186.6 285.4l-33.6-33.6-61.7 61.7c-3.1 3.1-8.1 3.1-11.2 0l-11.2-11.2c-3.1-3.1-3.1-8.1 0-11.2l61.7-61.7-44.1-44.1L267.9 402.5l100.2 100.2c12.4 12.4 32.5 12.4 44.9 0l89.7-89.7c12.4-12.4 12.4-32.5 0-44.9z"/></svg>`, "칠판", "whiteboard", false);

    // End call button
    this.endCallButton = this.createControlButton("📞", "통화 종료", "end-call", false);
    this.endCallButton.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    this.endCallButton.addEventListener('mouseenter', () => {
      this.endCallButton.style.background = 'linear-gradient(135deg, #c0392b, #a93226)';
    });
    this.endCallButton.addEventListener('mouseleave', () => {
      this.endCallButton.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    });

    this.controlsGroup.appendChild(this.muteButton);
    this.controlsGroup.appendChild(this.cameraOffButton);
    this.controlsGroup.appendChild(this.screenShareButton);
    this.controlsGroup.appendChild(this.whiteboardButton);
    this.controlsGroup.appendChild(this.endCallButton);

    this.controlsSection.appendChild(this.controlsGroup);
    this.appRootContainer.appendChild(this.controlsSection);
  }

  createControlButton(icon, tooltip, type, disabled = false) {
    const button = document.createElement("button");
    button.innerHTML = icon;
    button.title = tooltip;
    button.disabled = disabled;
    button.className = `control-button ${type}`;

    const baseStyles = `
      width: 56px;
      height: 56px;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 20px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    `;

    if (disabled) {
      button.style.cssText = baseStyles + `
        background: linear-gradient(135deg, #bdc3c7, #95a5a6);
        color: #7f8c8d;
        cursor: not-allowed;
        opacity: 0.6;
      `;
    } else {
      button.style.cssText = baseStyles + `
        background: linear-gradient(135deg, #3498db, #2980b9);
        color: white;
      `;

      button.addEventListener('mouseenter', () => {
        if (!button.disabled) {
          button.style.transform = 'translateY(-2px) scale(1.05)';
          button.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
        }
      });

      button.addEventListener('mouseleave', () => {
        if (!button.disabled) {
          button.style.transform = 'translateY(0) scale(1)';
          button.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
        }
      });

      button.addEventListener('mousedown', () => {
        if (!button.disabled) {
          button.style.transform = 'translateY(0) scale(0.95)';
        }
      });

      button.addEventListener('mouseup', () => {
        if (!button.disabled) {
          button.style.transform = 'translateY(-2px) scale(1.05)';
        }
      });
    }

    return button;
  }

  applyStyles() {
    const globalStyles = `
      .video-conference-app * {
        box-sizing: border-box;
      }

      .video-conference-app .main-stage-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 16px;
        overflow: hidden;
      }

      .video-conference-app .pinned-video-layer { 
        z-index: 1; 
      }
      
      .video-conference-app .screen-share-layer { 
        z-index: 2; 
      }

      .video-conference-app .canvas-layer {
        z-index: 3;
        background-color: transparent;
        pointer-events: none;
      }

      .video-conference-app .canvas-layer.standalone {
        background-color: #FFFFFF;
      }

      .video-conference-app .canvas-layer .canvas-container,
      .video-conference-app .canvas-layer .canvas-toolbar {
        pointer-events: auto;
      }

      .video-conference-app #mainStageContainer > div,
      .video-conference-app #sidebarContainer > div {
        width: 100%;
        height: 100%;
        background: #000;
        border-radius: 12px;
        overflow: hidden;
        position: relative;
        transition: all 0.3s ease;
        border: 2px solid rgba(255, 255, 255, 0.1);
      }

      .video-conference-app #mainStageContainer > div.canvas-layer {
        background-color: transparent;
      }

      .video-conference-app #mainStageContainer > div.canvas-layer.standalone {
        background-color: #FFFFFF !important;
      }

      .video-conference-app #mainStageContainer > div > video,
      .video-conference-app #sidebarContainer > div > video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .video-conference-app #sidebarContainer > div {
        aspect-ratio: 16 / 9;
        height: auto;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .video-conference-app #sidebarContainer > div:hover {
        border-color: #3498db;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(52, 152, 219, 0.3);
      }

      .video-conference-app .status-indicator-container {
        position: absolute;
        bottom: 8px;
        right: 8px;
        display: flex;
        gap: 6px;
        z-index: 20;
      }

      .video-conference-app .audio-muted-indicator,
      .video-conference-app .video-paused-indicator {
        width: 28px;
        height: 28px;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: center;
        backdrop-filter: blur(5px);
        border: 2px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
      }

      .video-conference-app .audio-muted-indicator {
        background-image: url('/InsWebApp/images/icons/mic_off.svg');
        background-size: 16px;
      }

      .video-conference-app .video-paused-indicator {
        background-image: url('/InsWebApp/images/icons/camera_off.svg');
        background-size: 18px;
      }

      .video-conference-app div.video-paused::after {
        content: '사용자';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #2c3e50, #34495e);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        font-weight: 300;
        color: #ecf0f1;
        pointer-events: none;
        z-index: 10;
        backdrop-filter: blur(10px);
      }

      .video-conference-app .user-info {
        position: absolute;
        bottom: 8px;
        left: 8px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        z-index: 15;
        backdrop-filter: blur(5px);
      }

      @media (max-width: 768px) {
        .video-conference-app #sidebarContainer {
          width: 200px;
        }
        
        .video-conference-app .controls-group {
          gap: 12px;
          padding: 8px 16px;
        }
        
        .video-conference-app .control-button {
          width: 48px;
          height: 48px;
          font-size: 18px;
        }
      }
    `;

    if (!document.getElementById('zoom-ui-styles')) {
      const style = document.createElement('style');
      style.id = 'zoom-ui-styles';
      style.textContent = globalStyles;
      document.head.appendChild(style);
    }
  }

  // Getters
  getMainStageContainer() {
    return this.mainStageContainer;
  }

  getSidebarContainer() {
    return this.sidebarContainer;
  }

  getRemoteMediaContainer() {
    return this.mainStageContainer;
  }

  // Button management
  showWhiteboardButton() {
    this.whiteboardButton.style.display = "flex";
    this.whiteboardButton.disabled = false;
    this.whiteboardButton.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
    this.whiteboardButton.style.color = 'white';
    this.whiteboardButton.style.cursor = 'pointer';
    this.whiteboardButton.style.opacity = '1';
  }

  enableControls() {
    this.muteButton.disabled = false;
    this.cameraOffButton.disabled = false;

    // Update button styles
    [this.muteButton, this.cameraOffButton].forEach(button => {
      button.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
      button.style.color = 'white';
      button.style.cursor = 'pointer';
      button.style.opacity = '1';
    });
  }

  enableScreenSharing(onClickCallback) {
    this.screenShareButton.disabled = false;
    this.screenShareButton.onclick = onClickCallback;
    this.screenShareButton.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
    this.screenShareButton.style.color = 'white';
    this.screenShareButton.style.cursor = 'pointer';
    this.screenShareButton.style.opacity = '1';
  }

  // Layout management
  updateVideoLayout(mainStageElements, sidebarElements) {
    const mainStage = this.mainStageContainer;
    const sidebar = this.sidebarContainer;

    // Clear existing content
    mainStage.innerHTML = '';
    sidebar.innerHTML = '';

    // Add elements to main stage
    mainStageElements.forEach(element => {
      mainStage.appendChild(element);
      element.classList.remove('thumbnail');
      element.classList.add('main-stage-video');
    });

    // Add elements to sidebar
    sidebarElements.forEach(element => {
      sidebar.appendChild(element);
      element.classList.add('thumbnail');
      element.classList.remove('main-stage-video');

      // Add user info overlay
      this.addUserInfoOverlay(element);
    });

    // Update participant count
    this.updateParticipantCount(sidebarElements.length + mainStageElements.length);
  }

  addUserInfoOverlay(element) {
    // Remove existing overlay
    const existing = element.querySelector('.user-info');
    if (existing) existing.remove();

    // Add new overlay
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    userInfo.textContent = '사용자';
    element.appendChild(userInfo);
  }

  updateParticipantCount(count) {
    const counter = document.querySelector('.participant-count');
    if (counter) {
      counter.textContent = `참가자 ${count}명`;
    }
  }

  // Media status updates
  updateRemoteAudioStatus(elementWrapper, isMuted) {
    const container = this.ensureStatusContainer(elementWrapper);
    let indicator = container.querySelector('.audio-muted-indicator');

    if (isMuted) {
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'audio-muted-indicator';
        container.appendChild(indicator);
      }
    } else {
      indicator?.remove();
    }
  }

  updateRemoteVideoStatus(elementWrapper, isPaused) {
    elementWrapper.classList.toggle('video-paused', isPaused);

    const container = this.ensureStatusContainer(elementWrapper);
    let indicator = container.querySelector('.video-paused-indicator');

    if (isPaused) {
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'video-paused-indicator';
        container.appendChild(indicator);
      }
    } else {
      indicator?.remove();
    }
  }

  ensureStatusContainer(elementWrapper) {
    let container = elementWrapper.querySelector('.status-indicator-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'status-indicator-container';
      elementWrapper.appendChild(container);
    }
    return container;
  }

  updateLocalVideoState(isEnabled) {
    const myContainer = document.querySelector('[id*="peer-container"]');
    if (myContainer) {
      myContainer.classList.toggle('video-paused', !isEnabled);
    }
  }

  // Screen sharing
  updateLayoutForScreenShare(isSharing) {
    const mainStage = this.mainStageContainer;
    if (isSharing) {
      mainStage.style.background = '#000';
    } else {
      mainStage.style.background = '#1a1a1a';
    }
  }

  addLocalScreenShare(track) {
    this.updateLayoutForScreenShare(true);
    const screenShareWrapper = document.createElement("div");
    screenShareWrapper.id = "local-screen-share-wrapper";
    screenShareWrapper.style.cssText = `
      width: 100%;
      height: 100%;
      position: relative;
      border-radius: 16px;
      overflow: hidden;
    `;

    const element = document.createElement(track.kind);
    element.autoplay = true;
    element.playsInline = true;
    element.muted = true;
    element.srcObject = new MediaStream([track]);
    element.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
    `;

    screenShareWrapper.appendChild(element);
    this.mainStageContainer.appendChild(screenShareWrapper);
  }

  removeLocalScreenShare() {
    const element = document.getElementById("local-screen-share-wrapper");
    if (element) {
      element.remove();
      this.updateLayoutForScreenShare(false); // 레이아웃 복원
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

  //   [추가] drawFaceMesh가 참조할 로컬 비디오와 캔버스를 설정하는 함수
  setLocalMediaElements(videoEl, canvasEl) {
    this.video = videoEl;
    this.canvas = canvasEl;
    this.canvasCtx = canvasEl.getContext("2d");
  }

  updateMuteButton(isMuted) {
    if (isMuted) {
      this.muteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M633.8 458.1l-157.8-122C488.6 312.1 496 285 496 256v-48c0-8.8-7.2-16-16-16h-16c-8.8 0-16 7.2-16 16v48c0 17.9-4 34.8-10.7 50.2l-26.6-20.5c3.1-9.4 5.3-19.2 5.3-29.7V96c0-53-43-96-96-96s-96 43-96 96v45.4L45.5 3.4C38.5-2.1 28.4-.8 23 6.2L3.4 31.5C-2.1 38.4-.8 48.5 6.2 53.9l588.4 454.7c7 5.4 17 4.2 22.5-2.8l19.6-25.3c5.4-7 4.2-17-2.8-22.5zM400 464h-56v-33.8c11.7-1.6 22.9-4.5 33.7-8.3l-50.1-38.7c-6.7 .4-13.4 .9-20.4 .2-55.9-5.5-98.7-48.6-111.2-101.9L144 241.3v6.9c0 89.6 64 169.6 152 181.7V464h-56c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16h160c8.8 0 16-7.2 16-16v-16c0-8.8-7.2-16-16-16z"/></svg>`;
      this.muteButton.classList.add('muted');
    } else {
      this.muteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 352 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M176 352c53 0 96-43 96-96V96c0-53-43-96-96-96S80 43 80 96v160c0 53 43 96 96 96zm160-160h-16c-8.8 0-16 7.2-16 16v48c0 74.8-64.5 134.8-140.8 127.4C96.7 376.9 48 317.1 48 250.3V208c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16v40.2c0 89.6 64 169.6 152 181.7V464H96c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16h160c8.8 0 16-7.2 16-16v-16c0-8.8-7.2-16-16-16h-56v-33.8C285.7 418.5 352 344.9 352 256v-48c0-8.8-7.2-16-16-16z"/></svg>`;
      this.muteButton.classList.remove('muted');
    }
  }

  updateCameraButton(isOff) {
    if (isOff) {
      this.cameraOffButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M336.2 64H47.8C21.4 64 0 85.4 0 111.8v288.4C0 426.6 21.4 448 47.8 448h288.4c26.4 0 47.8-21.4 47.8-47.8V111.8c0-26.4-21.4-47.8-47.8-47.8zm189.4 37.7L416 177.3v157.4l109.6 75.5c21.2 14.6 50.4-.3 50.4-25.8V127.5c0-25.4-29.1-40.4-50.4-25.8z"/></svg>`
      this.cameraOffButton.classList.add('muted');
    } else {
      this.cameraOffButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M633.8 458.1l-55-42.5c15.4-1.4 29.2-13.7 29.2-31.1v-257c0-25.5-29.1-40.4-50.4-25.8L448 177.3v137.2l-32-24.7v-178c0-26.4-21.4-47.8-47.8-47.8H123.9L45.5 3.4C38.5-2 28.5-.8 23 6.2L3.4 31.4c-5.4 7-4.2 17 2.8 22.4L42.7 82 416 370.6l178.5 138c7 5.4 17 4.2 22.5-2.8l19.6-25.3c5.5-6.9 4.2-17-2.8-22.4zM32 400.2c0 26.4 21.4 47.8 47.8 47.8h288.4c11.2 0 21.4-4 29.6-10.5L32 154.7v245.5z"/></svg>`
      this.cameraOffButton.classList.remove('muted');
    }
  }
}