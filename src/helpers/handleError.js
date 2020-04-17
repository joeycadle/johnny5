import { MESSAGE_PREFACE } from '../constants'

function throwError(msg) {
  throw new Error(msg)
}

function generateMsg(id, msg) {
  const _msg = `${MESSAGE_PREFACE} ${msg}`

  return id !== null ? `${_msg} (${id})` : _msg
}

export function handleError({ msg: _msg, id = null, throw: _throw = true }) {
  const msg = generateMsg(id, _msg)
  return _throw ? throwError(msg) : console.warn(msg)
}
