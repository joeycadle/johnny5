import { fromJS, toJS, mergeDeep } from 'immutable'

export function createMachine(id, config, globalMiddlewares) {
  const localMiddlewares = []

  // Before proceeding at all lets just validate that the config
  // contains all required properties and no restricted namespaces.
  // This method will throw an error if validation fails
  validateConfig(config)

  let state = config.state
  const { context = {}, transitions } = config

  // Lets keep our context and transition objects immutable...
  const immutableContext = fromJS(context)
  const immutableTransitions = fromJS(transitions)

  const getState = () => state
  const setState = (nextState) => (state = nextState)
  const updateContext = (nextContext) => mergeDeep(fromJS(nextContext), immutableContext)

  return {
    id,
    state: getState,
    context: () => toJS(immutableContext),
    transitions: () => toJS(immutableTransitions),
    ...transitionsToMethods(_transitions, globalMiddlewares, localMiddlewares, getState, setState, updateContext),
  }
}
