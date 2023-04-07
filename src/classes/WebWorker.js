import settings from "@/config/settings";

const token = localStorage.getItem("token");

export default class WebWorker {
  #worker;

  constructor() {
    this.#worker = new Worker(new URL("../worker/worker.js", import.meta.url), {
      type: "module",
    });
  }

  postMessage(task, payload) {
    this.#worker.postMessage({
      task,
      payload: { ...payload, token },
    });
  }

  #onMessage(callback) {
    this.#worker.onmessage = callback;
  }

  #onError(callback) {
    this.#worker.onerror = callback;
  }

  terminate() {
    this.#worker.terminate();
  }

  getResultFromWorker() {
    return new Promise((resolve, reject) => {
      this.#onMessage(({ data }) => {
        if (data.result) {
          resolve(data.result);
        }
      });
      this.#onError((error) => {
        reject(error.message);
      });
      const timer = setTimeout(() => {
        clearTimeout(timer);
        reject(new Error("timeout"));
      }, settings.requestTimeout);
    });
  }
}
