// Chain of Responsibility
export default class BaseHandler {
  #nextHandler = null;

  setNext(handler) {
    this.#nextHandler = handler;
    return handler;
  }

  handle(request) {
    if (this.#nextHandler) {
      return this.#nextHandler.handle(request);
    }

    return null;
  }
}

// class ConcreteHandler extends BaseHandler {
//   handle(request) {
//     if (request === 'one') {
//       return `ConcreteHandler1 handles ${request}`;
//     }

//     return super.handle(request);
//   }
// }
