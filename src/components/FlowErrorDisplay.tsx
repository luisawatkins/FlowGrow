'use client'

import { FlowError, FlowErrorType, getUserFriendlyMessage } from '@/types/errors'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface FlowErrorDisplayProps {
  error: FlowError
  onRetry?: () => void
  onDismiss?: () => void
  showDetails?: boolean
  className?: string
}

export function FlowErrorDisplay({ 
  error, 
  onRetry, 
  onDismiss, 
  showDetails = false,
  className = '' 
}: FlowErrorDisplayProps) {
  const userMessage = getUserFriendlyMessage(error)
  const canRetry = error.retryable && onRetry

  const getErrorIcon = (type: FlowErrorType) => {
    switch (type) {
      case FlowErrorType.NETWORK_ERROR:
      case FlowErrorType.CONNECTION_TIMEOUT:
        return '🌐'
      case FlowErrorType.AUTHENTICATION_FAILED:
      case FlowErrorType.WALLET_NOT_CONNECTED:
        return '🔐'
      case FlowErrorType.INSUFFICIENT_FUNDS:
        return '💰'
      case FlowErrorType.TRANSACTION_FAILED:
      case FlowErrorType.TRANSACTION_REJECTED:
        return '❌'
      case FlowErrorType.PROPERTY_NOT_FOUND:
        return '🏠'
      case FlowErrorType.RATE_LIMITED:
        return '⏱️'
      case FlowErrorType.SERVICE_UNAVAILABLE:
        return '🔧'
      default:
        return '⚠️'
    }
  }

  const getErrorColor = (type: FlowErrorType) => {
    switch (type) {
      case FlowErrorType.NETWORK_ERROR:
      case FlowErrorType.CONNECTION_TIMEOUT:
        return 'border-yellow-200 bg-yellow-50 text-yellow-800'
      case FlowErrorType.AUTHENTICATION_FAILED:
      case FlowErrorType.WALLET_NOT_CONNECTED:
        return 'border-blue-200 bg-blue-50 text-blue-800'
      case FlowErrorType.INSUFFICIENT_FUNDS:
        return 'border-orange-200 bg-orange-50 text-orange-800'
      case FlowErrorType.TRANSACTION_FAILED:
      case FlowErrorType.TRANSACTION_REJECTED:
        return 'border-red-200 bg-red-50 text-red-800'
      case FlowErrorType.PROPERTY_NOT_FOUND:
        return 'border-purple-200 bg-purple-50 text-purple-800'
      case FlowErrorType.RATE_LIMITED:
        return 'border-yellow-200 bg-yellow-50 text-yellow-800'
      case FlowErrorType.SERVICE_UNAVAILABLE:
        return 'border-gray-200 bg-gray-50 text-gray-800'
      default:
        return 'border-red-200 bg-red-50 text-red-800'
    }
  }

  const getSuggestedActions = (type: FlowErrorType) => {
    switch (type) {
      case FlowErrorType.NETWORK_ERROR:
      case FlowErrorType.CONNECTION_TIMEOUT:
        return ['Check your internet connection', 'Try again in a moment']
      case FlowErrorType.AUTHENTICATION_FAILED:
      case FlowErrorType.WALLET_NOT_CONNECTED:
        return ['Connect your wallet', 'Refresh the page']
      case FlowErrorType.INSUFFICIENT_FUNDS:
        return ['Add FLOW tokens to your wallet', 'Check your balance']
      case FlowErrorType.TRANSACTION_FAILED:
      case FlowErrorType.TRANSACTION_REJECTED:
        return ['Try again', 'Check transaction details']
      case FlowErrorType.PROPERTY_NOT_FOUND:
        return ['Verify the property ID', 'Refresh the marketplace']
      case FlowErrorType.RATE_LIMITED:
        return ['Wait a moment before trying again', 'Reduce request frequency']
      case FlowErrorType.SERVICE_UNAVAILABLE:
        return ['Try again later', 'Check service status']
      default:
        return ['Try again', 'Contact support if the problem persists']
    }
  }

  return (
    <Card className={`${getErrorColor(error.type)} ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getErrorIcon(error.type)}</span>
          <div>
            <CardTitle className="text-lg">Flow Error</CardTitle>
            <CardDescription className="text-sm">
              {userMessage}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showDetails && (
          <div className="space-y-2">
            <div className="text-xs font-mono bg-black/5 p-2 rounded">
              <div><strong>Type:</strong> {error.type}</div>
              <div><strong>Message:</strong> {error.message}</div>
              {error.code && <div><strong>Code:</strong> {error.code}</div>}
              {error.context && (
                <div><strong>Context:</strong> {JSON.stringify(error.context, null, 2)}</div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Suggested actions:</h4>
          <ul className="text-xs space-y-1">
            {getSuggestedActions(error.type).map((action, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span className="text-gray-400">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex space-x-2">
          {canRetry && (
            <Button
              onClick={onRetry}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              Try Again
            </Button>
          )}
          {onDismiss && (
            <Button
              onClick={onDismiss}
              size="sm"
              variant="ghost"
              className="flex-1"
            >
              Dismiss
            </Button>
          )}
        </div>

        {error.retryAfter && (
          <div className="text-xs text-center text-gray-500">
            Retry available in {error.retryAfter} seconds
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Inline error display for smaller spaces
export function FlowErrorInline({ 
  error, 
  onRetry, 
  onDismiss 
}: Pick<FlowErrorDisplayProps, 'error' | 'onRetry' | 'onDismiss'>) {
  const userMessage = getUserFriendlyMessage(error)
  const canRetry = error.retryable && onRetry

  return (
    <div className="flex items-center space-x-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
      <span className="text-red-500">⚠️</span>
      <span className="flex-1 text-red-700">{userMessage}</span>
      {canRetry && (
        <Button
          onClick={onRetry}
          size="sm"
          variant="outline"
          className="h-6 px-2 text-xs"
        >
          Retry
        </Button>
      )}
      {onDismiss && (
        <Button
          onClick={onDismiss}
          size="sm"
          variant="ghost"
          className="h-6 px-2 text-xs"
        >
          ✕
        </Button>
      )}
    </div>
  )
}
