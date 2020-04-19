import { Map } from 'immutable'
import { MESSAGE_INVALID_EVENT_ID, MESSAGE_INVALID_EVENT } from '../constants'

export function removeEventListener(event, id, eventListeners, updater) {
  const _eventMap = eventListeners.get(event)
  !_eventMap && handleError({ id: event, msg: MESSAGE_INVALID_EVENT('remove') })

  const _eventListener = _eventMap.get(id)
  !_eventListener && handleError({ id: `${event} -> ${id}`, msg: MESSAGE_INVALID_EVENT_ID })

  const eventMap = _eventMap.delete(id)
  const newEventListeners = eventListeners.merge(Map({ [event]: eventMap }))

  updater(newEventListeners)
}
