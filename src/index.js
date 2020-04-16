import { DEVTOOLS_KEY, MACHINE_MIDDLEWARE_CREATED, MESSAGES_MACHINE_NOT_FOUND } from './constants'
import { handleError } from './helpers/handleError'

const machines = {}
const middlewares = []

export function addMiddleware() {}

function destroyMachine(machine) {
  const getMachineByString = () => {
    !machines[machine] && handleError({ msg: MESSAGES_MACHINE_NOT_FOUND, id: machine, throw: true })

    return machines[machine]
  }

  const _machine = typeof machine === 'string' ? getMachineByString(machine) : machine

  delete machines[_machine.id]
}

export default function Johnny5(id) {
  const create = (config) => {
    const machine = createMachine(id, config, middlewares)

    machines[machine.name] = machine
    handleMiddleware(MACHINE_MIDDLEWARE_CREATED, machine, machine)
    machine.destroy = () => destroyMachine(machine)

    return machine
  }

  return machines[id] || { create }
}

if (typeof window !== 'undefined') {
  window[DEVTOOLS_KEY] = factory
}
