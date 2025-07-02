const { Device } = window.mediasoupClient;

const ws = new WebSocket("wss://192.168.5.133:3000");

let device;
let sendTransport;
let recvTransport;
let localStream;
const pendingConsumeList = [];
const actionCallbackMap = new Map();

function waitForAction(actionName, callback) {
  actionCallbackMap.set(actionName, callback);
}

ws.onopen = () => {
  console.log("✅ WebSocket connected");
  try {
    device = new Device();
  } catch (err) {
    console.error("❌ Device creation failed:", err);
    return;
  }
  ws.send(JSON.stringify({ action: "getRtpCapabilities" }));
};

ws.onmessage = async (event) => {
  const msg = JSON.parse(event.data);
  console.log("📩 Received:", msg);

  const cb = actionCallbackMap.get(msg.action);
  if (cb) {
    cb(msg);
    actionCallbackMap.delete(msg.action);
    return;
  }

  switch (msg.action) {
    case "rtpCapabilities":
      await handleRtpCapabilities(msg.data);
      break;
    case "createTransportResponse":
      await handleCreateTransportResponse(msg.data);
      break;
    case "createConsumerTransportResponse":
      await handleCreateConsumerTransportResponse(msg.data);
      break;
    case "existingProducers":
      await handleExistingProducers(msg.data);
      break;
    case "newProducerAvailable":
      await handleNewProducerAvailable(msg);
      break;
    case "consumeResponse":
      await handleConsumeResponse(msg.data);
      break;
    case "producerClosed":
      handleProducerClosed(msg);
      break;
  }
};

async function handleRtpCapabilities(data) {
  try {
    await device.load({ routerRtpCapabilities: data });
    console.log("✅ Device loaded successfully");
    ws.send(JSON.stringify({ action: "createTransport" }));
  } catch (err) {
    console.error("❌ Failed to load device capabilities:", err);
  }
}

async function handleCreateTransportResponse(data) {
  console.log("🚛 Creating send transport");
  sendTransport = device.createSendTransport(data);

  sendTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
    console.log("🔗 Send transport connecting...");
    ws.send(
      JSON.stringify({ action: "connectTransport", data: { dtlsParameters } })
    );
    waitForAction("transportConnected", () => {
      console.log("✅ Send transport connected");
      callback();
    });
  });

  sendTransport.on("produce", ({ kind, rtpParameters }, callback, errback) => {
    console.log(`🎬 Producing ${kind}...`);
    ws.send(
      JSON.stringify({ action: "produce", data: { kind, rtpParameters } })
    );
    waitForAction("produceResponse", (res) => {
      console.log(`✅ ${kind} production started:`, res.id);
      callback({ id: res.id });
    });
  });

  await startProducing();
}

async function handleCreateConsumerTransportResponse(data) {
  console.log("📡 Creating receive transport");
  recvTransport = device.createRecvTransport(data);

  recvTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
    console.log("🔗 Receive transport connecting...");
    ws.send(
      JSON.stringify({
        action: "connectConsumerTransport",
        data: { dtlsParameters },
      })
    );
    waitForAction("consumerTransportConnected", () => {
      console.log("✅ Receive transport connected");
      callback();
    });
  });

  await processPendingConsumes();
}

async function handleExistingProducers(data) {
  console.log("📋 Received existing producers:", data);
  if (!data || data.length === 0) {
    console.log("📭 No existing producers");
    // If we are the first, we should announce we are ready
    ws.send(JSON.stringify({ action: "deviceReady" }));
    return;
  }
  pendingConsumeList.push(...data);
  if (!recvTransport) {
    console.log("📡 Creating consumer transport for existing producers");
    ws.send(JSON.stringify({ action: "createConsumerTransport" }));
  } else {
    await processPendingConsumes();
  }
}

async function handleNewProducerAvailable(msg) {
  console.log("🆕 New producer available:", msg.producerId, msg.kind);
  if (!device || !device.loaded) {
    console.warn("⚠️ Device not ready, ignoring new producer");
    return;
  }
  pendingConsumeList.push({ producerId: msg.producerId, kind: msg.kind });
  if (!recvTransport) {
    console.log("📡 Creating consumer transport for new producer");
    ws.send(JSON.stringify({ action: "createConsumerTransport" }));
  } else {
    await processPendingConsumes();
  }
}

async function handleConsumeResponse(data) {
  const { id, producerId, kind, rtpParameters } = data;
  console.log(`🎯 Creating consumer for ${kind} producer ${producerId}`);

  if (document.getElementById(`remote-${producerId}`)) {
    console.warn(`⚠️ Remote element for ${producerId} already exists`);
    return;
  }

  try {
    const consumer = await recvTransport.consume({
      id,
      producerId,
      kind,
      rtpParameters,
    });
    console.log(`✅ Consumer created for ${kind}:`, consumer.id);
    await createRemoteElement(consumer, producerId, kind);
  } catch (err) {
    console.error(`❌ Failed to create consumer for ${producerId}:`, err);
  }
}

function handleProducerClosed(msg) {
  console.log(`🚫 Producer closed: ${msg.producerId}`);
  const el = document.getElementById(`remote-${msg.producerId}`);
  if (el) {
    el.remove();
    console.log(`🗑️ Removed element for producer ${msg.producerId}`);
  }
}

async function startProducing() {
  try {
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
    }
    localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    document.getElementById("localVideo").srcObject = localStream;
    console.log("📹 Got local media stream");

    for (const track of localStream.getTracks()) {
      console.log(`🎯 Starting production for ${track.kind} track`);
      await sendTransport.produce({ track });
    }
    // After producing, let the server know we are ready
    ws.send(JSON.stringify({ action: "deviceReady" }));
  } catch (err) {
    console.error("❌ Failed to get user media:", err);
  }
}

async function createRemoteElement(consumer, producerId, kind) {
  const element = document.createElement(kind === "video" ? "video" : "audio");
  element.id = `remote-${producerId}`;
  element.autoplay = true;
  element.playsInline = true;
  if (kind === "video") {
    element.controls = true;
  }
  const stream = new MediaStream([consumer.track]);
  element.srcObject = stream;
  document.getElementById("remoteMediaContainer").appendChild(element);
  console.log(`📺 Added ${kind} element for producer ${producerId}`);
}

async function processPendingConsumes() {
  if (pendingConsumeList.length === 0) {
    return;
  }
  console.log(`📥 Processing ${pendingConsumeList.length} pending consumes`);
  const toProcess = [...pendingConsumeList];
  pendingConsumeList.length = 0; // Clear the array

  for (const { producerId, kind } of toProcess) {
    await requestConsume(producerId, kind);
  }
}

async function requestConsume(producerId, kind) {
  if (!device?.loaded || !recvTransport || recvTransport.closed) {
    console.log("❌ Conditions not met, re-queuing consume request");
    pendingConsumeList.push({ producerId, kind });
    return;
  }
  if (document.getElementById(`remote-${producerId}`)) {
    console.log(`⚠️ Consumer for ${producerId} already exists`);
    return;
  }
  console.log(`📡 Requesting consume for ${kind} producer ${producerId}`);
  ws.send(
    JSON.stringify({
      action: "consume",
      data: { rtpCapabilities: device.rtpCapabilities, producerId, kind },
    })
  );
}

ws.onerror = (error) => console.error("❌ WebSocket error:", error);
ws.onclose = (event) =>
  console.log("🔌 WebSocket closed:", event.code, event.reason);

window.addEventListener("beforeunload", () => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
});
