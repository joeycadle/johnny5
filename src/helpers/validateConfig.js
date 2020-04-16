import { NAMESPACES, MESSAGE_RESTRICTED_NAMESPACE, REQUIRED_PROPERTIES } from '../constants'
import { handleError as _handleError } from './handleError'

export function validateConfig(config) {
  const handleError = () => _handleError({ msg: MESSAGE_RESTRICTED_NAMESPACE, throw: true })

  NAMESPACES.forEach((ns) => !!config[ns] && handleError(MESSAGE_RESTRICTED_NAMESPACE))
  REQUIRED_PROPERTIES.forEach((prop) => !config[prop] && handleError(MESSAGE_MISSING_REQUIRED_PROP))
}
