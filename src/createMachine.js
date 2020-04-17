import { fromJS, mergeDeep } from 'immutable'
import { validateConfig } from './helpers/validateConfig'
import { transitionsToMethods } from './helpers/transitionsToMethods'

export function createMachine(id, config, globalMiddlewares) {
  const localMiddlewares = []

  // Before proceeding at all lets just validate that the config
  // contains all required properties and no restricted namespaces.
  // This method will throw an error if validation fails
  validateConfig(config)

  let state = config.state
  const { context = {}, transitions } = config

  // Lets keep our context and transition objects immutable...
  let immutableContext = fromJS(context)
  const immutableTransitions = fromJS(transitions)

  const getState = () => state
  const setState = (nextState) => {
    const updateState = () => (state = nextState)
    nextState && nextState.length > 0 && updateState()
  }

  const updateContext = (nextContext) => {
    immutableContext = immutableContext.mergeDeep(fromJS(nextContext))
  }

  return {
    id,
    state: getState,
    context: () => immutableContext.toJS(),
    transitions: () => immutableTransitions.toJS(),
    ...transitionsToMethods(transitions, globalMiddlewares, localMiddlewares, getState, setState, updateContext),
  }
}
