// client/main.js
import { RoomClient } from "./RoomClient.js";
import { MediaPipeModule } from "./modules/MediaPipeModule.js";
import { UIManager } from "./UIManager.js";

// --- 애플리케이션 시작 ---
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Application starting...");

  const uiManager = new UIManager();
  const roomClient = new RoomClient(uiManager);

  // ✅ RoomClient가 방송하는 이벤트를 구독하여 UIManager에 작업을 지시합니다.
  roomClient.on("new-consumer", (consumer) => {
    console.log("🎧 Event: new-consumer -> UI Manager adding remote track.");
    uiManager.addRemoteTrack(consumer.track, consumer.producerId);
  });

  roomClient.on("producer-closed", (producerId) => {
    console.log(
      "🎧 Event: producer-closed -> UI Manager removing remote track."
    );
    uiManager.removeRemoteTrack(producerId);
  });

  // ❗️핵심: 사용자가 '졸음 감지 모듈'을 구매했는지 여부 (나중에는 서버에서 받아올 값)
  const userHasAiModule = true;

  if (userHasAiModule) {
    const videoElement = document.getElementById("localVideo");
    const aiModule = new MediaPipeModule(videoElement);

    console.log("🤖 AI Module will be initialized.");

    // --- 지휘자(main.js)가 각 모듈의 이벤트를 연결(구독)해줍니다. ---

    // 1. RoomClient가 '로컬 스트림 준비 완료'를 방송하면, AI 모듈이 분석을 시작합니다.
    roomClient.on("localStreamReady", () => {
      console.log("🎧 Event: localStreamReady -> AI Module starting analysis.");
      aiModule.start();
    });

    // 2. AI 모듈이 '랜드마크 업데이트'를 방송하면, UI 매니저가 화면에 그림을 그립니다.
    aiModule.on("landmarksUpdate", (landmarks) => {
      uiManager.drawFaceMesh(landmarks);
    });

    // 3. AI 모듈이 '상태 변경'을 방송하면, RoomClient가 서버로 데이터를 전송합니다.
    aiModule.on("drowsinessUpdate", (data) => {
      console.log("🎧 Event: drowsinessUpdate -> Sending status to server.");
      roomClient.sendPeerStatus(data);
    });
    aiModule.on("absenceUpdate", (data) => {
      console.log("🎧 Event: absenceUpdate -> Sending status to server.");
      roomClient.sendPeerStatus(data);
    });

    // 4. AI 모듈에서 에러가 발생하면 콘솔에 출력합니다.
    aiModule.on("error", (error) => {
      console.error("🔥 AI Module Error:", error);
    });
  }

  // 화상회의 클라이언트의 모든 준비를 시작합니다.
  // 나중에 이 roomId는 URL이나 다른 방법으로 받아와야한다!!
  const roomId = "my-first-room";
  roomClient.join(roomId);
});
