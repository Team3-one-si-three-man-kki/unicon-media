import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";

export default {
  input: "client/mediapipe-worker.js",
  output: {
    file: "client/dist/mediapipe-worker.bundle.js",
    format: "iife", // ✅ 'esm'이 아닌 'iife'로 변경하여 클래식 스크립트 생성
    sourcemap: true,
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    copy({
      targets: [
        {
          src: "node_modules/@mediapipe/tasks-vision/wasm/*", // WASM 파일들
          dest: "client/dist/mediapipe",
        },
        {
          src: "client/mediapipe/face_landmarker.task", // 우리가 직접 다운로드한 모델 파일
          dest: "client/dist/mediapipe",
        },
      ],
      hook: "writeBundle",
    }),
  ],
};
