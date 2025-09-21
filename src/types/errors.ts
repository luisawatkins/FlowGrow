// Error types for Flow blockchain operations
export enum FlowErrorType {
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONNECTION_TIMEOUT = 'CONNECTION_TIMEOUT',
  RPC_ERROR = 'RPC_ERROR',
  
  // Authentication errors
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // Transaction errors
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  TRANSACTION_REJECTED = 'TRANSACTION_REJECTED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  GAS_LIMIT_EXCEEDED = 'GAS_LIMIT_EXCEEDED',
  TRANSACTION_TIMEOUT = 'TRANSACTION_TIMEOUT',
  
  // Contract errors
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  INVALID_PROPERTY_ID = 'INVALID_PROPERTY_ID',
  PROPERTY_NOT_FOUND = 'PROPERTY_NOT_FOUND',
  PROPERTY_ALREADY_LISTED = 'PROPERTY_ALREADY_LISTED',
  PROPERTY_NOT_OWNED = 'PROPERTY_NOT_OWNED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // System errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

export interface FlowError extends Error {
  type: FlowErrorType
  code?: string | number
  retryable: boolean
  retryAfter?: number // seconds
  context?: Record<string, any>
  originalError?: Error
}

export interface ErrorRecoveryOptions {
  maxRetries: number
  retryDelay: number // milliseconds
  exponentialBackoff: boolean
  retryableErrors: FlowErrorType[]
}

export const DEFAULT_RECOVERY_OPTIONS: ErrorRecoveryOptions = {
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true,
  retryableErrors: [
    FlowErrorType.NETWORK_ERROR,
    FlowErrorType.CONNECTION_TIMEOUT,
    FlowErrorType.RPC_ERROR,
    FlowErrorType.TRANSACTION_TIMEOUT,
    FlowErrorType.RATE_LIMITED,
    FlowErrorType.SERVICE_UNAVAILABLE,
  ],
}

// Error factory functions
export function createFlowError(
  type: FlowErrorType,
  message: string,
  options: Partial<FlowError> = {}
): FlowError {
  const error = new Error(message) as FlowError
  error.type = type
  error.retryable = options.retryable ?? DEFAULT_RECOVERY_OPTIONS.retryableErrors.includes(type)
  error.code = options.code
  error.context = options.context
  error.originalError = options.originalError
  error.retryAfter = options.retryAfter
  
  return error
}

// Error classification helpers
export function isRetryableError(error: Error): boolean {
  if ('retryable' in error) {
    return (error as FlowError).retryable
  }
  
  // Check for common retryable error patterns
  const retryablePatterns = [
    /network/i,
    /timeout/i,
    /connection/i,
    /rate.limit/i,
    /service.unavailable/i,
    /temporary/i,
  ]
  
  return retryablePatterns.some(pattern => pattern.test(error.message))
}

export function getErrorType(error: Error): FlowErrorType {
  if ('type' in error) {
    return (error as FlowError).type
  }
  
  const message = error.message.toLowerCase()
  
  if (message.includes('network') || message.includes('connection')) {
    return FlowErrorType.NETWORK_ERROR
  }
  if (message.includes('timeout')) {
    return FlowErrorType.CONNECTION_TIMEOUT
  }
  if (message.includes('authentication') || message.includes('wallet')) {
    return FlowErrorType.AUTHENTICATION_FAILED
  }
  if (message.includes('transaction')) {
    return FlowErrorType.TRANSACTION_FAILED
  }
  if (message.includes('insufficient funds')) {
    return FlowErrorType.INSUFFICIENT_FUNDS
  }
  if (message.includes('gas limit')) {
    return FlowErrorType.GAS_LIMIT_EXCEEDED
  }
  if (message.includes('property')) {
    return FlowErrorType.CONTRACT_ERROR
  }
  if (message.includes('validation')) {
    return FlowErrorType.VALIDATION_ERROR
  }
  
  return FlowErrorType.UNKNOWN_ERROR
}

// User-friendly error messages
export function getUserFriendlyMessage(error: FlowError): string {
  switch (error.type) {
    case FlowErrorType.NETWORK_ERROR:
    case FlowErrorType.CONNECTION_TIMEOUT:
      return 'Network connection failed. Please check your internet connection and try again.'
    
    case FlowErrorType.AUTHENTICATION_FAILED:
    case FlowErrorType.WALLET_NOT_CONNECTED:
      return 'Please connect your wallet to continue.'
    
    case FlowErrorType.INSUFFICIENT_FUNDS:
      return 'Insufficient funds. Please add more FLOW tokens to your wallet.'
    
    case FlowErrorType.TRANSACTION_FAILED:
      return 'Transaction failed. Please try again or contact support if the problem persists.'
    
    case FlowErrorType.TRANSACTION_REJECTED:
      return 'Transaction was rejected. Please try again.'
    
    case FlowErrorType.PROPERTY_NOT_FOUND:
      return 'Property not found. It may have been removed or the ID is incorrect.'
    
    case FlowErrorType.PROPERTY_ALREADY_LISTED:
      return 'This property is already listed for sale.'
    
    case FlowErrorType.PROPERTY_NOT_OWNED:
      return 'You do not own this property.'
    
    case FlowErrorType.RATE_LIMITED:
      return 'Too many requests. Please wait a moment before trying again.'
    
    case FlowErrorType.SERVICE_UNAVAILABLE:
      return 'Service temporarily unavailable. Please try again later.'
    
    default:
      return error.message || 'An unexpected error occurred. Please try again.'
  }
}
