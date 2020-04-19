import {
  NAMESPACES,
  MESSAGE_RESTRICTED_NAMESPACE,
  MESSAGE_MISSING_REQUIRED_PROP,
  REQUIRED_PROPERTIES,
} from '../constants'
import { handleError as _handleError } from './handleError'

export function validateConfig(config) {
  const handleError = (id, msg) => _handleError({ id, msg })
  // Ensure the required properties to create a machine exist in the config
  REQUIRED_PROPERTIES.forEach((prop) => !config[prop] && handleError(prop, MESSAGE_MISSING_REQUIRED_PROP))
}
