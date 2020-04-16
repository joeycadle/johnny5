import { toCamelCase } from './toCamelCase'
import { updateIn, mergeDeep } from 'immutable'
import { handleError } from './handleError'

export function transitionsToMethods(
  transitions,
  globalMiddlewares,
  localMiddlewares,
  getState,
  setState,
  updateContext
) {
  const dispatch = (creatorKey, { next = '', context = {} }) => {
    if (next.length === 0) {
      handleError({ id: creatorKey, msg: MESSAGES_NO_STATE_TO_TRANSITION_TO })
      return
    }

    updateContext(context)
    setState(next)
  }

  return Object.keys(transitions).reduce((methods, key) => {
    const transitionCreators = transitions[key]

    methods[toCamelCase(`is ${key}`)] = () => getState() === key

    Object.keys(transitionCreators).forEach((creator) => {
      const curr = transitionCreators[creator]
      // A transition can be a function or a string. In the case of a function
      // We not only need to execute the function but need to update the state,
      // and possible the context based on the return of that callback...
      // In the case of a string we know there will be no context updates
      // so we'll call the dispatch method with a proper object
      const cb =
        typeof curr === 'string' ? dispatch(creator, { next: curr }) : (...args) => dispatch(creator, curr(...args))

      methods[toCamelCase(transition)] = cb
    })

    return methods
  }, {})
}
