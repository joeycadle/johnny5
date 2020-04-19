import { Map } from 'immutable'
import { MESSAGE_EVENT_LISTENER_MISSING_REQUIRED_PROP, MESSAGE_INVALID_EVENT } from '../constants'

export function addEventListener(event, config, eventListeners, updater) {
  const _eventMap = eventListeners.get(event)
  !_eventMap && handleError({ id: event, msg: MESSAGE_INVALID_EVENT('add') })

  !config.id && handleError({ id: 'id', msg: MESSAGE_EVENT_LISTENER_MISSING_REQUIRED_PROP })
  !config.listener && handleError({ id: 'listener', msg: MESSAGE_EVENT_LISTENER_MISSING_REQUIRED_PROP })
  !!config.listener &&
    typeof config.listener !== 'function' &&
    handleError({ id: config.id, msg: MESSAGE_EVENT_LISTENER_RECEIVED_NON_FUNCTION })

  const eventMap = _eventMap.set(config.id, config)
  const newEventListeners = eventListeners.merge(Map({ [event]: eventMap }))

  updater(newEventListeners)
}
