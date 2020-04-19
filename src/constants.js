export const DEVTOOLS_KEY = '__johnny5__'
export const REQUIRED_PROPERTIES = ['state', 'transitions']

export const INITIAL_EVENT_LISTENERS = {
  TRANSITION: {},
  MACHINE_CREATED: {},
  MACHINE_DESTROYED: {},
  ON_EXECUTED: {},
}

// Message constants
export const MESSAGE_PREFACE = `Johnny5 //`
export const MESSAGE_MISSING_REQUIRED_PROP = 'Your machine configuration is missing one or more required properties!'
export const MESSAGE_MACHINE_NOT_FOUND = 'The machine you specified was no found!'
export const MESSAGE_MACHINE_CHANGED = `The machine given to 'useMachine' has changed between renders. This may lead to unexpected results`
export const MESSAGE_INVALID_EVENT = (action) => `Unable to ${action} event listener as an invalid event was specified.`
export const MESSAGE_EVENT_LISTENER_MISSING_REQUIRED_PROP =
  'Unable to add event listener as the given configuration is missing a required property'
export const MESSAGE_EVENT_LISTENER_RECEIVED_NON_FUNCTION = `Unable to add event listener as the 'listener' property provided is not a function.`
export const MESSAGE_TRANSITION_DOES_NOT_EXIST =
  'Unable to dispatch! The given transition does not exist for the current state'
export const MESSAGE_BAD_TRANSITION_OBJECT = 'Unable to dispatch! The given transition object is missing a next state'
export const MESSAGE_INVALID_EVENT_ID = 'Unable to remove event listener. The given listener id does not exist.'
