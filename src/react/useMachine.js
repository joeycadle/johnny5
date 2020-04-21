import { handleError } from '../helpers/handleError'
import { MESSAGE_MACHINE_CHANGED } from '../constants'
import React, { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'

export function useMachine(machine, contextMap = () => {}, metaMap = () => {}) {
  const id = uuid()

  !machine && handleError({ msg: 'NO MACHINE', throw: false })

  if (process.env.NODE_ENV !== 'production') {
    const [originalMachine] = useState(machine)

    machine !== originalMachine && handleError({ id: machine.id, msg: MESSAGE_MACHINE_CHANGED, throw: false })
  }

  // const [state, setState] = useState(machine.state())
  // const [context, setContext] = useState(machine.context())
  // const [meta, setMeta] = useState(machine.meta())

  // useEffect(() => {
  //   machine.addEventListener('TRANSITION', {
  //     id,
  //     listener: (event, _state, _context, _meta) => {
  //       const [_s, nextState] = _state
  //       const [_c, nextContext] = _context
  //       const [_m, nextMeta] = _meta
  //       const stateChanged = state !== nextState

  //       if (stateChanged) {
  //         const mappedContext = contextMap(nextContext) || {}
  //         const mappedMeta = metaMap() || {}
  //         const contextKeys = Object.keys(mappedContext)
  //         const metaKeys = Object.keys(mappedMeta)

  //         setState(machine.state())

  //         contextKeys && setContext(mappedContext)
  //         metaKeys && setMeta(metaKeys)

  //         // In case no mappings were provided but context / meta exists.
  //         !contextKeys && Object.keys(nextContext) && setContext(nextContext)
  //         !metaKeys && Object.keys(nextMeta) && setMeta(nextMeta)
  //       }
  //     },
  //   })

  //   return () => machine.removeEventListener('TRANSITION', id)
  // })

  // return {}
}
