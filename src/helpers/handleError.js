import { MESSAGE_PREFACE } from '../constants'

function throwError(id, msg) {
  throw new Error(generateMsg(id, msg))
}

function generateMsg(id, msg) {
  const _msg = `${MESSAGE_PREFACE} ${msg}`

  return !id ? `${_msg} (${id})` : _msg
}

export function handleError({ msg: _msg, id = null, throw: _throw = false }) {
  const msg = generateMsg(id, _msg)
  return _throw ? throwError(msg) : console.warn(msg)
}
