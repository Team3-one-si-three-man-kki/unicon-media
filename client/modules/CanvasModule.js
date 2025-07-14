import { EventEmitter } from "../utils/EventEmitter.js";

// fabric.js, uuid, pako와 같은 외부 라이브러리는 동적으로 로드됩니다.

export class CanvasModule extends EventEmitter {
  constructor(container, websocketUrl, workerUrl) {
    super();
    if (!container || !websocketUrl || !workerUrl) {
      throw new Error("Container, WebSocket URL, and Worker URL are required.");
    }
    this.container = container;
    this.websocketUrl = websocketUrl;
    this.workerUrl = workerUrl;

    this.ws = null;
    this.senderId = null;
    this.canvas = null;
    this.mode = "select";
    this.shape = null;
    this.sx = 0;
    this.sy = 0;
    this.bgOn = false;
    this.pingInterval = null;

    this._init();
  }

  _init() {
    this._createUI();
    this._injectDependencies(); // 의존성 로드 후 나머지 초기화 진행
  }

  _injectDependencies() {
    const dependencies = [
      "https://cdn.jsdelivr.net/npm/fabric@5.4.0/dist/fabric.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuid.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js",
    ];

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };

    Promise.all(dependencies.map(loadScript))
      .then(() => {
        console.log("All canvas dependencies loaded.");
        this.senderId = uuid.v4();

        // 의존성 로드 완료 후 나머지 초기화 실행
        this._initFabricCanvas();
        this._initWebSocket();
        this._initWorker();
        this._attachEventListeners();

        this.emit("ready");
      })
      .catch((error) => {
        console.error(error);
        this.emit("error", error);
      });
  }

  _createUI() {
    const style = document.createElement("style");
    style.setAttribute("data-module", "canvas"); // 나중에 제거하기 쉽도록 속성 추가
    style.textContent = `
        .canvas-toolbar { display:flex; flex-wrap:wrap; gap:8px; padding:8px; background:#fff; box-shadow:0 2px 4px rgba(0,0,0,0.1); position:absolute; top:0; left:0; width:100%; z-index:1010; }
        .canvas-toolbar button.active { background:#007bff; color:#fff; }
        .canvas-container { position:relative; width:100%; height:100%; overflow:hidden; }
        .canvas-container canvas { pointer-events:auto; }
    `;
    document.head.appendChild(style);

    this.container.innerHTML = `
        <div class="canvas-toolbar">
            <button id="canvas-select" class="active"><i class="fa fa-mouse-pointer"></i></button>
            <button id="canvas-pen"><i class="fa fa-pencil"></i></button>
            <button id="canvas-eraser"><i class="fa fa-eraser"></i></button>
            <button id="canvas-rect"><i class="fa fa-square"></i></button>
            <button id="canvas-circle"><i class="fa fa-circle"></i></button>
            <button id="canvas-line"><i class="fa fa-slash"></i></button>
            <button id="canvas-text"><i class="fa fa-font"></i></button>
            <button id="canvas-remove"><i class="fa fa-trash"></i></button>
            <button id="canvas-clear"><i class="fa fa-ban"></i></button>
            <input type="color" id="canvas-colorPicker" value="#000000" />
            <input type="range" id="canvas-widthPicker" min="1" max="50" value="5" />
            <button id="canvas-bgToggle"><i class="fa fa-fill-drip"></i> Background</button>
            <input type="color" id="canvas-bgPicker" value="#ffffff" style="display:none;" />
        </div>
        <div id="canvas-inner-container" class="canvas-container" style="top: 48px; height: calc(100% - 48px);">
            <canvas id="fabric-canvas"></canvas>
        </div>
    `;

    this.toolbar = this.container.querySelector(".canvas-toolbar");
    this.canvasContainer = this.container.querySelector(
      "#canvas-inner-container"
    );
    this.canvasEl = this.container.querySelector("#fabric-canvas");
    this.colorPicker = this.container.querySelector("#canvas-colorPicker");
    this.widthPicker = this.container.querySelector("#canvas-widthPicker");
    this.bgPicker = this.container.querySelector("#canvas-bgPicker");
    this.bgToggle = this.container.querySelector("#canvas-bgToggle");
  }

  _initFabricCanvas() {
    this.canvas = new fabric.Canvas(this.canvasEl, {
      isDrawingMode: false,
      selection: true,
      preserveObjectStacking: true,
    });

    this.resizeObserver = new ResizeObserver(() => this._resizeCanvas());
    this.resizeObserver.observe(this.canvasContainer);
    this._resizeCanvas();

    fabric.Object.prototype.toObject = ((originalToObject) => {
      return function (propertiesToInclude) {
        return fabric.util.object.extend(
          originalToObject.call(this, propertiesToInclude),
          {
            id: this.id,
            isEraser: this.isEraser,
          }
        );
      };
    })(fabric.Object.prototype.toObject);
  }

  _resizeCanvas() {
    const w = this.canvasContainer.clientWidth;
    const h = this.canvasContainer.clientHeight;
    this.canvas.setWidth(w);
    this.canvas.setHeight(h);
    this.canvas.calcOffset();
    this.canvas.renderAll();
  }

  _initWebSocket() {
    this.ws = new WebSocket(this.websocketUrl);
    this.ws.onopen = () => console.log("Canvas WebSocket connected.");
    this.ws.onmessage = this._handleWebSocketMessage.bind(this);
    this.ws.onerror = (err) => console.error("Canvas WebSocket Error:", err);
    this.ws.onclose = () => console.log("Canvas WebSocket disconnected.");

    this.pingInterval = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);
  }

  _initWorker() {
    this.worker = new Worker(this.workerUrl);
    this.worker.onmessage = this._handleWorkerMessage.bind(this);
    this.worker.onerror = (error) => {
      console.error("Canvas Worker Error:", error);
      this.emit("error", { message: "Worker failed", details: error });
    };
  }

  _attachEventListeners() {
    // ... (이전과 동일한 이벤트 리스너 로직)
    const tools = ["select", "pen", "eraser", "rect", "circle", "line", "text"];
    tools.forEach((t) => {
      const button = this.container.querySelector(`#canvas-${t}`);
      if (button) {
        button.onclick = () => {
          this.mode = t;
          this.canvas.isDrawingMode = t === "pen" || t === "eraser";
          this.canvas.selection = !this.canvas.isDrawingMode;
          this.shape = null;

          if (t === "pen") {
            this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
            this.canvas.freeDrawingBrush.width = parseInt(
              this.widthPicker.value,
              10
            );
            this.canvas.freeDrawingBrush.color = this.colorPicker.value;
            this.canvas.freeDrawingBrush.globalCompositeOperation =
              "source-over";
          } else if (t === "eraser") {
            this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
            this.canvas.freeDrawingBrush.width = parseInt(
              this.widthPicker.value,
              10
            );
            if (this.bgOn) {
              this.canvas.freeDrawingBrush.globalCompositeOperation =
                "source-over";
              this.canvas.freeDrawingBrush.color =
                this.canvas.backgroundColor || "#ffffff";
            } else {
              this.canvas.freeDrawingBrush.globalCompositeOperation =
                "destination-out";
            }
          }

          tools.forEach((toolId) => {
            const el = this.container.querySelector(`#canvas-${toolId}`);
            if (el) el.classList.remove("active");
          });
          button.classList.add("active");
        };
      }
    });

    this.container.querySelector("#canvas-select").click();
    this.container.querySelector("#canvas-clear").onclick = () => {
      this.canvas.clear();
      if (this.bgOn) {
        this.canvas.setBackgroundColor(
          this.bgPicker.value,
          this.canvas.renderAll.bind(this.canvas)
        );
      }
      this.signal({ type: "clear" });
    };
    this.container.querySelector("#canvas-remove").onclick = () => {
      const activeObjects = this.canvas.getActiveObjects();
      if (!activeObjects || activeObjects.length === 0) return;
      const ids = activeObjects.map((obj) => obj.id);
      this.canvas.remove(...activeObjects);
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
      this.signal({ type: "object-removed", ids: ids });
    };
    this.colorPicker.oninput = () => {
      if (this.canvas.freeDrawingBrush && this.mode === "pen") {
        this.canvas.freeDrawingBrush.color = this.colorPicker.value;
      }
    };
    this.widthPicker.oninput = () => {
      if (this.canvas.freeDrawingBrush) {
        this.canvas.freeDrawingBrush.width = parseInt(
          this.widthPicker.value,
          10
        );
      }
    };
    this.bgToggle.onclick = this._handleBgToggle.bind(this);
    this.bgPicker.oninput = this._handleBgPickerInput.bind(this);
    this.canvas.on("path:created", this._handlePathCreated.bind(this));
    this.canvas.on("mouse:down", this._handleMouseDown.bind(this));
    this.canvas.on("mouse:move", this._handleMouseMove.bind(this));
    this.canvas.on("mouse:up", this._handleMouseUp.bind(this));
    this.canvas.on("object:modified", this._handleObjectModified.bind(this));
  }

  // ... (나머지 핸들러 및 메서드는 이전과 거의 동일)
  _handleBgToggle() {
    this.bgOn = !this.bgOn;
    this.bgToggle.classList.toggle("active", this.bgOn);
    const updates = [];
    if (this.bgOn) {
      this.bgPicker.style.display = "inline-block";
      const c = this.bgPicker.value;
      this.canvas.setBackgroundColor(
        c,
        this.canvas.renderAll.bind(this.canvas)
      );
      this.signal({ type: "bg-change", color: c });
      this.canvas.getObjects().forEach((obj) => {
        if (obj.globalCompositeOperation === "destination-out") {
          const newProps = {
            isEraser: true,
            stroke: c,
            globalCompositeOperation: "source-over",
          };
          obj.set(newProps);
          updates.push({ id: obj.id, props: newProps });
        }
      });
    } else {
      this.bgPicker.style.display = "none";
      this.canvas.setBackgroundColor(
        null,
        this.canvas.renderAll.bind(this.canvas)
      );
      this.signal({ type: "bg-change", color: null });
      this.canvas.getObjects().forEach((obj) => {
        if (obj.isEraser) {
          const newProps = { globalCompositeOperation: "destination-out" };
          obj.set(newProps);
          updates.push({ id: obj.id, props: newProps });
        }
      });
    }
    if (updates.length > 0) {
      this.signal({ type: "eraser-mode-change", updates: updates });
    }
    if (this.mode === "eraser") {
      if (this.bgOn) {
        this.canvas.freeDrawingBrush.globalCompositeOperation = "source-over";
        this.canvas.freeDrawingBrush.color = this.canvas.backgroundColor;
      } else {
        this.canvas.freeDrawingBrush.globalCompositeOperation =
          "destination-out";
      }
    }
    this.canvas.renderAll();
  }

  _handleBgPickerInput(e) {
    if (!this.bgOn) return;
    const c = e.target.value;
    this.canvas.setBackgroundColor(c, this.canvas.renderAll.bind(this.canvas));
    this.signal({ type: "bg-change", color: c });
    const updates = [];
    this.canvas.getObjects().forEach((obj) => {
      if (obj.isEraser) {
        const newProps = { stroke: c };
        obj.set(newProps);
        updates.push({ id: obj.id, props: newProps });
      }
    });
    if (updates.length > 0) {
      this.signal({ type: "eraser-mode-change", updates: updates });
    }
    if (this.mode === "eraser") {
      this.canvas.freeDrawingBrush.color = c;
    }
    this.canvas.renderAll();
  }

  _handlePathCreated(e) {
    e.path.id = uuid.v4();
    if (e.path.path) {
      const pathArray = e.path.path;
      for (let i = 0; i < pathArray.length; i++) {
        for (let j = 1; j < pathArray[i].length; j++) {
          pathArray[i][j] = parseFloat(pathArray[i][j].toFixed(2));
        }
      }
      e.path.set("path", pathArray);
    }
    if (this.mode === "eraser") {
      if (this.bgOn) {
        e.path.isEraser = true;
        e.path.stroke = this.canvas.backgroundColor || "#ffffff";
        e.path.globalCompositeOperation = "source-over";
      } else {
        e.path.globalCompositeOperation = "destination-out";
      }
    }
    const d = e.path.toObject([
      "id",
      "path",
      "stroke",
      "strokeWidth",
      "globalCompositeOperation",
      "isEraser",
    ]);
    this.signal({ type: "fabric-path", path: d });
  }

  _handleMouseDown(opt) {
    if (
      opt.target ||
      this.mode === "select" ||
      this.mode === "pen" ||
      this.mode === "eraser"
    )
      return;
    const p = this.canvas.getPointer(opt.e);
    this.sx = p.x;
    this.sy = p.y;
    const id = uuid.v4();
    const strokeColor = this.colorPicker.value;
    const strokeWidth = parseInt(this.widthPicker.value, 10);
    const styleOptions = {
      id: id,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      fill: "transparent",
    };
    if (this.mode === "rect") {
      this.shape = new fabric.Rect({
        ...styleOptions,
        left: this.sx,
        top: this.sy,
        width: 0,
        height: 0,
        originX: "left",
        originY: "top",
      });
    } else if (this.mode === "circle") {
      this.shape = new fabric.Circle({
        ...styleOptions,
        left: this.sx,
        top: this.sy,
        radius: 0,
        originX: "center",
        originY: "center",
      });
    } else if (this.mode === "line") {
      this.shape = new fabric.Line(
        [this.sx, this.sy, this.sx, this.sy],
        styleOptions
      );
    } else if (this.mode === "text") {
      this.shape = new fabric.IText("Text", {
        ...styleOptions,
        left: this.sx,
        top: this.sy,
        fill: strokeColor,
        fontSize: strokeWidth * 5,
        originX: "left",
        originY: "top",
      });
    }
    if (this.shape) {
      this.canvas.add(this.shape);
    }
  }

  _handleMouseMove(opt) {
    if (!this.shape) return;
    let p = this.canvas.getPointer(opt.e);
    const canvasWidth = this.canvas.getWidth();
    const canvasHeight = this.canvas.getHeight();
    p.x = Math.max(0, Math.min(p.x, canvasWidth));
    p.y = Math.max(0, Math.min(p.y, canvasHeight));
    if (this.shape.type === "rect") {
      const left = Math.min(p.x, this.sx);
      const top = Math.min(p.y, this.sy);
      const width = Math.abs(p.x - this.sx);
      const height = Math.abs(p.y - this.sy);
      this.shape.set({ left: left, top: top, width: width, height: height });
    } else if (this.shape.type === "circle") {
      const radius = Math.hypot(p.x - this.sx, p.y - this.sy);
      this.shape.set({ radius: radius });
    } else if (this.shape.type === "line") {
      this.shape.set({ x2: p.x, y2: p.y });
    }
    this.canvas.renderAll();
  }

  _handleMouseUp() {
    if (!this.shape) return;
    this.shape.setCoords();
    const canvasWidth = this.canvas.getWidth();
    const canvasHeight = this.canvas.getHeight();
    const shapeData = {
      id: this.shape.id,
      type: this.shape.type,
      stroke: this.shape.stroke,
      strokeWidth: this.shape.strokeWidth,
      fill: this.shape.fill,
      originX: this.shape.originX,
      originY: this.shape.originY,
    };
    if (this.shape.type === "line") {
      shapeData.x1 = this.shape.x1 / canvasWidth;
      shapeData.y1 = this.shape.y1 / canvasHeight;
      shapeData.x2 = this.shape.x2 / canvasWidth;
      shapeData.y2 = this.shape.y2 / canvasHeight;
    } else {
      shapeData.left = this.shape.left / canvasWidth;
      shapeData.top = this.shape.top / canvasHeight;
      if (this.shape.type === "rect") {
        shapeData.width = this.shape.width / canvasWidth;
        shapeData.height = this.shape.height / canvasHeight;
      } else if (this.shape.type === "circle") {
        shapeData.radius =
          this.shape.radius / Math.max(canvasWidth, canvasHeight);
      } else if (this.shape.type === "i-text") {
        shapeData.text = this.shape.text;
        shapeData.fontSize = this.shape.fontSize;
      }
    }
    this.signal({ type: "shape-create", shape: shapeData });
    this.shape = null;
  }

  _handleObjectModified(e) {
    if (!e.target) return;
    const obj = e.target.toObject();
    this.signal({ type: "object-modified", object: obj });
  }

  signal(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      data.sender = this.senderId;
      this.worker.postMessage({ type: "compress", data: data });
    }
  }

  _handleWebSocketMessage({ data }) {
    if (typeof data === "string" && data.includes("ping")) return;
    this.worker.postMessage({ type: "decompress", data: data });
  }

  _handleWorkerMessage(event) {
    const { type, result, message } = event.data;
    if (type === "error") {
      console.error("Web Worker Error:", message);
      this.emit("error", { message: "Worker failed", details: message });
      return;
    }
    if (type === "compressed") {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(result);
      }
    } else if (type === "decompressed") {
      this._handleCanvasMessage(result);
    }
  }

  _handleCanvasMessage(m) {
    if (m.sender === this.senderId) return;
    switch (m.type) {
      case "bg-change":
        this.bgOn = !!m.color;
        this.bgToggle.classList.toggle("active", this.bgOn);
        if (this.bgPicker) {
          this.bgPicker.style.display = this.bgOn ? "inline-block" : "none";
          if (m.color) this.bgPicker.value = m.color;
        }
        this.canvas.setBackgroundColor(
          m.color || null,
          this.canvas.renderAll.bind(this.canvas)
        );
        break;
      case "eraser-mode-change":
        m.updates.forEach((update) => {
          const objToUpdate = this.canvas
            .getObjects()
            .find((o) => o.id === update.id);
          if (objToUpdate) {
            objToUpdate.set(update.props);
          }
        });
        this.canvas.renderAll();
        break;
      case "fabric-path":
        fabric.Path.fromObject(m.path, (obj) => {
          this.canvas.add(obj);
        });
        break;
      case "shape-create": {
        const receivedShape = m.shape;
        const canvasWidth = this.canvas.getWidth();
        const canvasHeight = this.canvas.getHeight();
        if (receivedShape.type === "line") {
          receivedShape.x1 *= canvasWidth;
          receivedShape.y1 *= canvasHeight;
          receivedShape.x2 *= canvasWidth;
          receivedShape.y2 *= canvasHeight;
        } else {
          receivedShape.left *= canvasWidth;
          receivedShape.top *= canvasHeight;
          if (receivedShape.type === "rect") {
            receivedShape.width *= canvasWidth;
            receivedShape.height *= canvasHeight;
          } else if (receivedShape.type === "circle") {
            receivedShape.radius *= Math.max(canvasWidth, canvasHeight);
          }
        }
        fabric.util.enlivenObjects([receivedShape], ([obj]) => {
          if (obj) {
            this.canvas.add(obj);
            this.canvas.renderAll();
          }
        });
        break;
      }
      case "object-modified": {
        const objToModify = this.canvas
          .getObjects()
          .find((o) => o.id === m.object.id);
        if (objToModify) {
          objToModify.set(m.object);
          objToModify.setCoords();
          this.canvas.renderAll();
        }
        break;
      }
      case "object-removed": {
        const objectsToRemove = this.canvas
          .getObjects()
          .filter((o) => m.ids.includes(o.id));
        if (objectsToRemove.length > 0) {
          this.canvas.remove(...objectsToRemove);
          this.canvas.renderAll();
        }
        break;
      }
      case "clear":
        this.canvas.clear();
        if (this.bgOn) {
          this.canvas.setBackgroundColor(
            this.bgPicker.value,
            this.canvas.renderAll.bind(this.canvas)
          );
        }
        break;
    }
  }

  destroy() {
    console.log("Destroying CanvasModule");
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.worker) this.worker.terminate();
    if (this.ws) this.ws.close();

    if (this.canvas) {
      this.canvas.dispose();
    }

    this.container.innerHTML = "";
    const style = document.querySelector('style[data-module="canvas"]');
    if (style) style.remove();

    this.removeAllListeners();
  }
}
