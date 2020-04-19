import { fromJS } from 'immutable'
import { validateConfig } from './helpers/validateConfig'
import { generateMatcherMethods } from './helpers/generateMatcherMethods'
import { INITIAL_EVENT_LISTENERS, MESSAGE_TRANSITION_DOES_NOT_EXIST, MESSAGE_BAD_TRANSITION_OBJECT } from './constants'
import { handleError } from './helpers/handleError'
import { addEventListener as _addEventListener } from './helpers/addEventListener'
import { removeEventListener as _removeEventListener } from './helpers/removeEventListener'
import { executeEventListeners } from './helpers/executeEventListeners'

// TODO: Move all scoped functions into helpers.
export function createMachine(id, config, getGlobalEventListeners) {
  let localEventListeners = fromJS(INITIAL_EVENT_LISTENERS)

  // Before proceeding at all lets just validate that the config
  // contains all required properties and no restricted namespaces.
  // This method will throw an error if validation fails
  validateConfig(config)

  let state = config.state
  const { context = {}, meta = {}, transitions } = config

  // Lets keep our context and transition objects immutable...
  let immutableContext = fromJS(context)
  let immutableMeta = fromJS(meta)
  const immutableTransitions = fromJS(transitions)

  // State Setter and Getter
  const getState = () => state
  const setState = (nextState) => {
    state = nextState
  }

  // Context Setter and Getter
  const getContext = () => immutableContext.toJS()
  const setContext = (nextContext = {}) => {
    immutableContext = immutableContext.mergeDeep(fromJS(nextContext))
  }

  // Meta Setter and Getter
  const getMeta = () => immutableMeta.toJS()
  const setMeta = (nextMeta = {}) => {
    immutableMeta = immutableMeta.mergeDeep(fromJS(nextMeta))
  }

  const isInvalidNext = (next, transition, isString = true) => {
    const isInvalid = !next || next.length === 0

    const msg = isString ? MESSAGE_TRANSITION_DOES_NOT_EXIST : MESSAGE_BAD_TRANSITION_OBJECT

    isInvalid &&
      process.env.NODE_ENV === 'development' &&
      handleError({
        id: `${state} -> ${transition}`,
        msg,
        throw: false,
      })

    return isInvalid
  }

  // Dispatcher
  const isStr = (arg) => typeof arg === 'string'
  const isObj = (arg) => arg instanceof Object && typeof arg.constructor === 'function'

  const dispatch = async (transition, event) => {
    // Get transition based on the current state
    const nextFromMap = immutableTransitions.getIn([state, transition]) || ''
    const nextState = isStr(nextFromMap) ? nextFromMap : nextFromMap.toJS()
    if (isInvalidNext(nextState, transition)) return

    // Handlers
    const handleOn = (next) => {
      const prevState = getState()
      const prevContext = getContext()
      const prevMeta = getContext()

      const $on = immutableTransitions.getIn([next, '$on'])
      const objectHandler = (onObj) => {
        const { dispatch: _dispatch = {}, context: _context = {}, meta: _meta = {} } = onObj
        const { transition: _transition, args = {} } = _dispatch
        setContext(_context), setMeta(_meta)
        dispatch(_transition, args)
      }

      const callbackHandler = async () => {
        try {
          const result = await $on(context, event)
          result && isStr(result) && handleStr(result)
          result && isObj(result) && objectHandler(result)

          executeEventListeners(
            'ON_EXECUTED',
            [getGlobalEventListeners(), localEventListeners],
            { transition: next, args: event, status: 'SUCCESS' },
            () => [prevState, getState()],
            () => [prevContext, getContext()],
            () => [prevMeta, getMeta()]
          )
        } catch (e) {
          executeEventListeners(
            'ON_EXECUTED',
            [getGlobalEventListeners(), localEventListeners],
            { transition: next, args: event, status: 'ERROR' },
            () => [prevState, getState()],
            () => [prevContext, getContext()],
            () => [prevMeta, getMeta()]
          )
          throw new Error(e)
        }
      }

      !!$on && callbackHandler()
    }

    const handleStr = (str) => {
      if (isInvalidNext(str, transition)) return

      const prevState = getState()
      const prevContext = getContext()
      const prevMeta = getContext()

      setState(str)
      executeEventListeners(
        'TRANSITION',
        [getGlobalEventListeners(), localEventListeners],
        { transition, args: event },
        () => [prevState, getState()],
        () => [prevContext, prevContext], // this method doesn't update context
        () => [prevMeta, prevMeta] // this method doesn't update meta
      )

      handleOn(str)
    }

    const handleObj = (obj) => {
      const { next, context: _context = {}, meta: _meta = {} } = obj
      if (isInvalidNext(next, transition, false)) return

      const prevState = getState()
      const prevContext = getContext()
      const prevMeta = getContext()

      setState(next)
      setContext(_context)
      setMeta(_meta)

      executeEventListeners(
        'TRANSITION',
        [getGlobalEventListeners(), localEventListeners],
        { transition, args: event },
        () => [prevState, getState()],
        () => [prevContext, prevContext], // this method doesn't update context
        () => [prevMeta, prevMeta] // this method doesn't update meta
      )
      handleOn(next)
    }

    // Handle state, meta and context updates
    isStr(nextState) && handleStr(nextState)
    isObj(nextState) && handleObj(nextState)
  }

  const addEventListener = (event, config) => {
    const updateEventListeners = (newEventListeners) => (localEventListeners = newEventListeners)
    _addEventListener(event, config, localEventListeners, updateEventListeners)
  }

  const removeEventListener = (event, config) => {
    const updateEventListeners = (newEventListeners) => (localEventListeners = newEventListeners)
    _removeEventListener(event, config, localEventListeners, updateEventListeners)
  }

  const matcherMethods = generateMatcherMethods(transitions, getState)

  executeEventListeners('MACHINE_CREATED', [getGlobalEventListeners()], { machine: id })

  return {
    id,
    state: getState,
    context: getContext,
    meta: getMeta,
    dispatch,
    addEventListener,
    removeEventListener,
    transitions: () => immutableTransitions.toJS(),
    ...matcherMethods,
  }
}
