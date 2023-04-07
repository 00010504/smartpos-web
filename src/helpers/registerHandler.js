export const handlersChain = { head: null };

export function registerHandler(handler) {
  if (!handlersChain.head) {
    handlersChain.head = handler;
  } else {
    handlersChain.head.setNext(handler);
  }
}

export function unregisterHandler(handler) {
  if (handlersChain.head === handler) {
    handlersChain.head = handler.next;
  }
}
