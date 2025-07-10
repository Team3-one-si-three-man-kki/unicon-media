// client/main.js

// 1. 필요한 모든 클래스를 import 합니다.
import { RoomClient } from "./RoomClient.js";
import { MediaPipeModule } from "./modules/MediaPipeModule.js";
import { UIManager } from "./UIManager.js";

// 2. 웹스퀘어의 전역 스코프에서 이 클래스들을 사용할 수 있도록 window 객체에 할당합니다.
// 이것이 가장 중요한 부분입니다.
// 2. 웹스퀘어의 전역 스코프에서 이 클래스들을 사용할 수 있도록 window 객체에 할당합니다.
// 이것이 가장 중요한 부분입니다.
window.AppClasses = {
  UIManager: UIManager,
  RoomClient: RoomClient,
  MediaPipeModule: MediaPipeModule,
};
