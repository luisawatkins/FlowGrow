import { FlowError, FlowErrorType, ErrorRecoveryOptions, DEFAULT_RECOVERY_OPTIONS } from '@/types/errors'

export interface RetryResult<T> {
  success: boolean
  data?: T
  error?: FlowError
  attempts: number
  totalTime: number
}

export class RetryManager {
  private options: ErrorRecoveryOptions

  constructor(options: Partial<ErrorRecoveryOptions> = {}) {
    this.options = { ...DEFAULT_RECOVERY_OPTIONS, ...options }
  }

  async execute<T>(
    operation: () => Promise<T>,
    customOptions?: Partial<ErrorRecoveryOptions>
  ): Promise<RetryResult<T>> {
    const finalOptions = { ...this.options, ...customOptions }
    const startTime = Date.now()
    let lastError: FlowError | undefined

    for (let attempt = 1; attempt <= finalOptions.maxRetries; attempt++) {
      try {
        const data = await operation()
        return {
          success: true,
          data,
          attempts: attempt,
          totalTime: Date.now() - startTime,
        }
      } catch (error) {
        lastError = this.normalizeError(error)
        
        // Check if error is retryable
        if (!this.shouldRetry(lastError, attempt, finalOptions)) {
          break
        }

        // Wait before retry
        if (attempt < finalOptions.maxRetries) {
          const delay = this.calculateDelay(attempt, finalOptions, lastError)
          await this.sleep(delay)
        }
      }
    }

    return {
      success: false,
      error: lastError,
      attempts: finalOptions.maxRetries,
      totalTime: Date.now() - startTime,
    }
  }

  private normalizeError(error: unknown): FlowError {
    if (error instanceof Error && 'type' in error) {
      return error as FlowError
    }

    const message = error instanceof Error ? error.message : String(error)
    const type = this.classifyError(error)
    
    return {
      name: 'FlowError',
      message,
      type,
      retryable: this.isRetryableType(type),
      originalError: error instanceof Error ? error : undefined,
    } as FlowError
  }

  private classifyError(error: unknown): FlowErrorType {
    if (error instanceof Error) {
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
      if (message.includes('rate limit')) {
        return FlowErrorType.RATE_LIMITED
      }
      if (message.includes('service unavailable')) {
        return FlowErrorType.SERVICE_UNAVAILABLE
      }
    }

    return FlowErrorType.UNKNOWN_ERROR
  }

  private shouldRetry(
    error: FlowError,
    attempt: number,
    options: ErrorRecoveryOptions
  ): boolean {
    // Don't retry if we've exceeded max attempts
    if (attempt >= options.maxRetries) {
      return false
    }

    // Don't retry if error is not retryable
    if (!error.retryable) {
      return false
    }

    // Don't retry if error type is not in retryable list
    if (!options.retryableErrors.includes(error.type)) {
      return false
    }

    // Check if error has specific retry delay
    if (error.retryAfter && error.retryAfter > 0) {
      return true
    }

    return true
  }

  private calculateDelay(
    attempt: number,
    options: ErrorRecoveryOptions,
    error: FlowError
  ): number {
    // Use specific retry delay if provided by error
    if (error.retryAfter) {
      return error.retryAfter * 1000 // Convert to milliseconds
    }

    let delay = options.retryDelay

    // Apply exponential backoff if enabled
    if (options.exponentialBackoff) {
      delay = delay * Math.pow(2, attempt - 1)
    }

    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * delay
    return delay + jitter
  }

  private isRetryableType(type: FlowErrorType): boolean {
    return DEFAULT_RECOVERY_OPTIONS.retryableErrors.includes(type)
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Convenience function for one-off retries
export async function withRetry<T>(
  operation: () => Promise<T>,
  options?: Partial<ErrorRecoveryOptions>
): Promise<T> {
  const retryManager = new RetryManager(options)
  const result = await retryManager.execute(operation)
  
  if (result.success) {
    return result.data!
  }
  
  throw result.error
}

// Specialized retry functions for common operations
export const retryFlowTransaction = (options?: Partial<ErrorRecoveryOptions>) => 
  new RetryManager({ 
    ...options, 
    maxRetries: 5, 
    retryDelay: 2000,
    retryableErrors: [
      FlowErrorType.NETWORK_ERROR,
      FlowErrorType.CONNECTION_TIMEOUT,
      FlowErrorType.TRANSACTION_TIMEOUT,
      FlowErrorType.RATE_LIMITED,
    ]
  })

export const retryFlowQuery = (options?: Partial<ErrorRecoveryOptions>) =>
  new RetryManager({
    ...options,
    maxRetries: 3,
    retryDelay: 1000,
    retryableErrors: [
      FlowErrorType.NETWORK_ERROR,
      FlowErrorType.CONNECTION_TIMEOUT,
      FlowErrorType.RPC_ERROR,
      FlowErrorType.SERVICE_UNAVAILABLE,
    ]
  })
