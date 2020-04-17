import { DEVTOOLS_KEY, MACHINE_MIDDLEWARE_CREATED, MESSAGE_MACHINE_NOT_FOUND } from './constants'
import { handleError } from './helpers/handleError'
import { createMachine } from './createMachine'
import { Map, List } from 'immutable'

let machines = Map({})
let middlewares = List([])

export function getMachines() {
  return machines.toJS()
}

export function addMiddleware() {}

function destroyMachine(machine) {
  const getMachineByString = () => {
    !machines[machine] && handleError({ id: machine, msg: MESSAGE_MACHINE_NOT_FOUND })

    return machines[machine]
  }

  const _machine = typeof machine === 'string' ? getMachineByString(machine) : machine

  delete machines[_machine.id]
  // Future cleanup methods go here.
}

export default function Johnny5(id) {
  const create = (config) => {
    const machine = createMachine(id, config, middlewares)
    machine.destroy = () => destroyMachine(machine)
    machines = machines.set(machine.id, machine)
    // executeMiddleware(MACHINE_MIDDLEWARE_CREATED, machine, middlewares)

    return machine
  }

  return machines.get(id) || { create }
}

if (typeof window !== 'undefined') {
  window[DEVTOOLS_KEY] = Johnny5
}
