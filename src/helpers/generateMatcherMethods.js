import { toCamelCase } from './toCamelCase'

export function generateMatcherMethods(states, getState) {
  return Object.keys(states).reduce((methods, state) => {
    const matcherKey = toCamelCase(`is ${state}`)
    // Since a matcher method is generated for each state and added to
    // the machine object we need to ensure there are no matching transition
    // states...
    methods[matcherKey] = () => getState() === state

    return methods
  }, {})
}
