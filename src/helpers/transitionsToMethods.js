import { toCamelCase } from './toCamelCase'
import { handleError } from './handleError'
import { MESSAGE_NO_DUPLICATE_TRANSITION, MESSAGE_NO_DUPLICATE_CREATOR } from '../constants'

export function transitionsToMethods(
  transitions,
  globalMiddlewares,
  localMiddlewares,
  getState,
  setState,
  updateContext
) {
  // A dispatch method that updates a machine's state and context
  const dispatch = (arg) => {
    const handleObj = () => {
      const { next, context = {} } = arg
      setState(next)
      updateContext(context)
    }

    const handleString = () => setState(arg)

    typeof arg === 'string' && handleString()
    arg instanceof Object && typeof arg.constructor === 'function' && handleObj()
  }

  const dispatchViaFunction = (creatorFn, args) => creatorFn(dispatch)(...args)

  const validTransition = (transition) => {
    // Validate we're allowed to transition based on what transition is calling
    // the this creator. If the current state does not match the transition
    // then we shouldn't be updating the state as the transition is invalid!
    // If we didn't do this check we could get into a scenario in where say
    // the 'fetchActivity' creator can only run if the current state is 'idle'
    // as it runs an async fetch() and then sets the state to 'fetching' and i
    return getState() === transition
  }

  return Object.keys(transitions).reduce((methods, transition) => {
    const transitionCreators = transitions[transition]
    const matcherKey = toCamelCase(`is ${transition}`)
    // Since a matcher method is generated for each state and added to
    // the machine object we need to ensure there are no matching transition
    // states...
    !!methods[matcherKey] && handleError({ id: matcherKey, msg: MESSAGE_NO_DUPLICATE_TRANSITION })

    // Generate a matcher method
    methods[matcherKey] = () => getState() === transition

    Object.keys(transitionCreators).forEach((creator) => {
      let callback
      const curr = transitionCreators[creator]
      const creatorKey = toCamelCase(creator)
      const cbString = () => validTransition(transition) && dispatch(curr)
      const cbFn = (...args) => validTransition(transition) && dispatchViaFunction(curr, args)
      const setCb = (cb) => {
        callback = cb
      }

      // We accept functions, and strings as creators with each handled a little differently
      typeof curr === 'string' && setCb(cbString)
      typeof curr === 'function' && setCb(cbFn)

      // Since a dispatch method is generated for each creator and added to
      // the machine object we need to ensure there are no matching creator
      // states...
      !!methods[creatorKey] && handleError({ id: creatorKey, msg: MESSAGE_NO_DUPLICATE_CREATOR })

      // Generate a creator method
      methods[creatorKey] = callback
    })

    return methods
  }, {})
}
