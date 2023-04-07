import WebWorker from "./WebWorker";

export default class SingleWorker {
  static #instance = null;

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new WebWorker();
    }

    return this.#instance;
  }

  static terminate() {
    this.#instance.terminate();
    this.#instance = null;
  }

  constructor() {
    throw new Error("This class cannot be instantiated");
  }
}
