import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";

export default {
  // ✅ 1. 진입점(Input)을 main.js로 변경합니다.
  // 이 파일을 시작으로 모든 import된 모듈들을 찾아냅니다.
  input: "client/main.js",

  output: {
    // ✅ 2. 최종 결과물 파일을 지정합니다.
    // 모든 코드가 이 파일 하나로 합쳐집니다.
    file: "client/dist/app.bundle.js",

    // ✅ 3. format을 'iife'로 설정합니다.
    // 이렇게 하면 import/export 구문이 없는, 브라우저 호환성이 높은
    // '즉시 실행 함수' 형태의 코드가 생성됩니다.
    format: "iife",
    sourcemap: true, // 디버깅을 위해 소스맵을 생성합니다.
  },
  plugins: [
    resolve({
      browser: true, // 브라우저 환경에 맞는 코드를 우선적으로 사용합니다.
    }),
    commonjs(), // CommonJS 방식으로 작성된 모듈도 변환하여 포함합니다.

    // ✅ 4. MediaPipe가 실행 시 필요로 하는 부가 파일들을 dist 폴더로 복사합니다.
    copy({
      targets: [
        {
          // node_modules에 설치된 MediaPipe의 WASM 파일들을 복사
          src: "node_modules/@mediapipe/tasks-vision/wasm/*",
          dest: "client/dist/mediapipe",
        },
        {
          // 우리가 직접 다운로드한 AI 모델 파일을 복사
          src: "client/mediapipe/face_landmarker.task",
          dest: "client/dist/mediapipe",
        },
      ],
      // 번들링이 완료된 후 복사 작업을 수행합니다.
      hook: "writeBundle",
    }),
  ],
};
