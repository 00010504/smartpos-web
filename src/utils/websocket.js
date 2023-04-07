function connectSocket(msgHandlers) {
  let ws = new WebSocket(
    `${import.meta.env.VITE_WEBSOCKET_URL}?Authorization=${localStorage.getItem(
      "token",
    )}`,
  );
  let interval, timer;

  ws.onopen = () => {
    console.log("connected to the websocket");
    ws.send("PING");

    interval = setInterval(() => {
      ws.send("PING");
    }, 30000);
  };

  ws.onmessage = (e) => {
    let data;

    try {
      data = JSON.parse(e.data);
    } catch (err) {
      data = e.data;
    }

    const { type, datas } = data ?? { type: "", datas: [] };

    if (msgHandlers.head) {
      msgHandlers.head.handle(type, datas);
    }
  };

  ws.onclose = (e) => {
    console.log("Socket is closed ", e);
    clearInterval(interval);
    ws = null;

    if (localStorage.getItem("token")) {
      timer = setTimeout(() => {
        ws = connectSocket(msgHandlers);
        clearTimeout(timer);
      }, 5000);
    }
  };

  ws.onerror = (err) => {
    console.error("Socket encountered error: ", err);
    // ws.close();
  };

  return ws;
}

export default connectSocket;
