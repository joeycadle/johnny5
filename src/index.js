import { DEVTOOLS_KEY, MESSAGE_MACHINE_NOT_FOUND, INITIAL_EVENT_LISTENERS } from './constants'
import { handleError } from './helpers/handleError'
import { createMachine } from './createMachine'
import { Map, fromJS } from 'immutable'
import { addEventListener as _addEventListener } from './helpers/addEventListener'
import { removeEventListener as _removeEventListener } from './helpers/removeEventListener'
import { executeEventListeners } from './helpers/executeEventListeners'

// Machine and event listener maps
let machines = Map({})
let eventListeners = fromJS(INITIAL_EVENT_LISTENERS)

/**
 * getMachines
 *
 * Description:
 * retrives a list of all machines
 */
export function getMachines() {
  return machines.toJS()
}

/**
 * addEventListener
 *
 * Description:
 * adds a new event listener for the given event
 *
 * @param {string} event - event
 * @param {object} config - listener configuration object
 */
export function addEventListener(event, config) {
  const updateEventListener = (newEventListeners) => (eventListeners = newEventListeners)
  _addEventListener(event, config, eventListeners, updateEventListener)
}

export function removeEventListener(event, id) {
  const updateEventListener = (newEventListeners) => (eventListeners = newEventListeners)
  _removeEventListener(event, id, eventListeners, updateEventListener)
}

/**
 * Johnny5
 *
 * Description:
 * Retrieves a state machine or returns a create method
 *
 * @param {string} id - name of the machine to get or create
 */
export default function Johnny5(id) {
  // Create a new machine
  const create = (config) => {
    const machine = createMachine(id, config, () => eventListeners)
    machine.destroy = () => destroy(machine)
    machines = machines.set(machine.id, machine)

    return machine
  }

  // Destroy a machine
  const destroy = (machine) => {
    const getMachineByString = () => {
      const _m = machines.get(machine.id)
      !_m && handleError({ id: machine, msg: MESSAGE_MACHINE_NOT_FOUND })

      return _m
    }

    const _machine = typeof machine === 'string' ? getMachineByString(machine) : machine

    machines = machines.delete(_machine.id)
    executeEventListeners('MACHINE_DESTROYED', [eventListeners], { machine: _machine.id })
  }

  // Return an existing machine or a create method
  return machines.get(id) || { create }
}
