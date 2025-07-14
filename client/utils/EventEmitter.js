// client/utils/EventEmitter.js

export class EventEmitter {
  constructor() {
    this.events = {};
  }

  // 이벤트 구독
  on(eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  // 이벤트 방송
  emit(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((listener) => listener(...args));
    }
  }

  // 모든 리스너 제거
  removeAllListeners() {
    this.events = {};
  }
}
