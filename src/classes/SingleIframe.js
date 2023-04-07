export default class SingleIframe {
  static #instance = null;

  static getInstance() {
    if (!this.#instance) {
      const iframe = document.createElement("iframe");
      document.body.appendChild(iframe);
      iframe.style.display = "none";
      this.#instance = iframe;
    }

    return this.#instance;
  }

  static remove() {
    this.#instance.remove();
    this.#instance = null;
  }

  constructor() {
    throw new Error("This class cannot be instantiated");
  }
}
