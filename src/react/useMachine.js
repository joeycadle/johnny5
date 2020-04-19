import { handleError } from '../helpers/handleError'
import { MESSAGE_MACHINE_CHANGED } from '../constants'
import { useState, useEffect } from 'react'

export function useMachine(machine) {
  if (process.env.NODE_ENV !== 'production') {
    const [originalMachine] = useState(machine)

    if (machine !== originalMachine) {
      handleError({ id: machine.id, msg: MESSAGE_MACHINE_CHANGED })
    }
  }
}
