import { isPlainObject } from "lodash";

export default class Stepper {
  #firstStep = 1;

  #lastStep = 5;

  #currStep = 1;

  constructor(config) {
    if (!isPlainObject(config)) {
      throw new Error("Stepper: missing required config");
    }

    const { firstStep, lastStep, initialStep } = config;

    if (initialStep <= lastStep || initialStep >= this.#currStep) {
      this.#currStep = initialStep;
    }

    this.#firstStep = firstStep;
    this.#lastStep = lastStep;
  }

  get firstStep() {
    return this.#firstStep;
  }

  get lastStep() {
    return this.#lastStep;
  }

  get currStep() {
    return this.#currStep;
  }

  prevStep() {
    if (this.#currStep > this.#firstStep) {
      this.#currStep -= 1;
    }
    return this.#currStep;
  }

  nextStep() {
    if (this.#currStep < this.#lastStep) {
      this.#currStep += 1;
    }
    return this.#currStep;
  }

  reinitialize() {
    this.#currStep = this.#firstStep;
  }
}
