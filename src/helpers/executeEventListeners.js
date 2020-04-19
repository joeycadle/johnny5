export function executeEventListeners(eventType, listeners, eventObj, state, context, meta) {
  listeners.forEach((listener) => {
    listener.get(eventType).forEach((eventListener) => eventListener.listener(eventObj, state, context, meta))
  })
}
