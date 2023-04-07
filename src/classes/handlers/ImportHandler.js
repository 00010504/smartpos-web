import BaseHandler from "./BaseHandler";
import requests from "./socketRequests";

export default class ImportHandler extends BaseHandler {
  dispatch = null;

  constructor(cb) {
    super();

    if (typeof cb === "function") {
      this.dispatch = cb;
    }
  }

  handle(request, data) {
    if (request === requests.import) {
      this.dispatch(data);
      return { success: true, message: `ImportHandler handles ${request}` };
    }

    return super.handle(request);
  }
}
