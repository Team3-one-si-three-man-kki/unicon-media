// client/main.js

// 1. 필요한 클래스들을 import 합니다.
import { RoomClient } from "./RoomClient.js";
import { UIManager } from "./UIManager.js";

// ✨ 동적 모듈 로더 함수 (import() 대체)
function loadModule(url, moduleName) {
  return new Promise((resolve, reject) => {
    // 이미 로드된 모듈인지 확인
    if (window[moduleName]) {
      console.log(`${moduleName} is already loaded.`);
      let Module = window[moduleName];
      if (Module && !Module.prototype) {
        Module = Module[moduleName] || Module.default;
      }
      return resolve(Module);
    }

    console.log(`Loading module: ${moduleName} from ${url}`);
    const script = document.createElement("script");
    script.src = `${url}`; // 서버 절대 경로 사용

    script.onload = () => {
      if (window[moduleName]) {
        console.log(`Successfully loaded module: ${moduleName}`);
        let Module = window[moduleName];
        if (Module && !Module.prototype) {
          Module = Module[moduleName] || Module.default;
        }
        resolve(Module);
      } else {
        reject(new Error(`Module ${moduleName} not found after script load.`));
      }
    };

    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
    document.head.appendChild(script);
  });
}

// 이렇게 하면 app.bundle.js가 로드되는 즉시 window.App이 생성됩니다.
window.App = {
  RoomClient: RoomClient,
  UIManager: UIManager,
  loadModule: loadModule,
};
