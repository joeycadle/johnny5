export const DEVTOOLS_KEY = '__johnny5__'
export const NAMESPACES = ['id', 'state', 'context', 'transitions', 'middlewares']
export const REQUIRED_PROPERTIES = ['state', 'transitions']

// Message constants
export const MESSAGE_PREFACE = `Johnny5 //`
export const MESSAGE_RESTRICTED_NAMESPACE = 'Your machine configuration contains a restriced namespace!'
export const MESSAGE_MISSING_REQUIRED_PROP = 'Your machine configuration is missing one or more required properties!'
export const MESSAGE_MACHINE_NOT_FOUND = 'The machine you specified was no found!'
export const MESSAGE_NO_STATE_TO_TRANSITION_TO = 'Transition failed! This transitions next state is required'
// Lifecycles
export const MACHINE_MIDDLEWARE_CREATED = 'MACHINE_MIDDLEWARE_CREATED'
