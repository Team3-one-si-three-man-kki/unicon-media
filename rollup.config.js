import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import replace from "@rollup/plugin-replace";
import dotenv from "dotenv";
dotenv.config();

// 여러 개의 번들을 생성하기 위해 배열 형태로 설정
export default [
  // 1. 메인 애플리케이션 번들
  {
    input: "client/main.js", // 진입점
    output: {
      file: "client/dist/app.bundle.js", // 최종 결과물
      format: "iife", // 웹스퀘어 호환 포맷
      sourcemap: true,
    },
    plugins: [
      resolve({ browser: true }),
      commonjs(),
      replace({
        preventAssignment: true,
        "process.env.WEBSOCKET_URL": JSON.stringify(
          process.env.WEBSOCKET_URL || "localhost"
        ),
      }),
    ],
  },

  // 2. 동적으로 로드할 MediaPipe 모듈 번들
  {
    input: "client/modules/MediaPipeModule.js", // MediaPipeModule 소스 경로
    output: {
      file: "client/dist/modules/mediapipe.bundle.js", // 생성될 번들 파일
      format: "iife",
      name: "MediaPipeModule", // window.MediaPipeModule 로 노출
      sourcemap: true,
      exports: "auto",
    },
    plugins: [resolve({ browser: true }), commonjs()],
  },

  // 3. 동적으로 로드할 Canvas 모듈 번들
  {
    input: "client/modules/CanvasModule.js", // CanvasModule 소스 경로
    external: ["uuid"], // 'uuid'를 외부 모듈로 처리
    output: {
      file: "client/dist/modules/canvas.bundle.js", // 생성될 번들 파일
      format: "iife",
      name: "CanvasModule", // window.CanvasModule 로 노출
      sourcemap: true,
      globals: {
        uuid: "uuid", // 'uuid' 모듈이 전역 변수 'uuid'를 사용하도록 설정
      },
    },
    plugins: [resolve({ browser: true }), commonjs()],
  },

  // 4. MediaPipe 웹 워커용 번들 (워커 내부의 import를 해결하기 위함)
  {
    input: "client/mediapipe-worker.js", // 워커 스크립트 진입점
    output: {
      file: "client/dist/mediapipe.worker.bundle.js", // 워커용 번들 파일
      format: "iife", // 워커도 iife로 번들링
      sourcemap: true,
    },
    plugins: [
      resolve({ browser: true }),
      commonjs(),
      copy({
        targets: [
          {
            src: "node_modules/@mediapipe/tasks-vision/wasm/*",
            dest: "client/dist/mediapipe",
          },
          {
            src: "client/mediapipe/face_landmarker.task",
            dest: "client/dist/mediapipe",
          },
        ],
        hook: "writeBundle",
      }),
    ],
  },
];
