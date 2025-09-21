'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FlowError, FlowErrorType, getUserFriendlyMessage } from '@/types/errors'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorType?: FlowErrorType
  retryCount: number
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void; retry: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  maxRetries?: number
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, retryCount: 0 }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorType = 'type' in error ? (error as FlowError).type : FlowErrorType.UNKNOWN_ERROR
    return { hasError: true, error, errorType, retryCount: 0 }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error reporting service (e.g., Sentry)
      console.error('Production error:', { error, errorInfo })
    }
  }

  private handleRetry = () => {
    const maxRetries = this.props.maxRetries || 3
    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorType: undefined,
        retryCount: prevState.retryCount + 1
      }))
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorType: undefined,
      retryCount: 0
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return (
          <FallbackComponent
            error={this.state.error!}
            reset={this.handleReset}
            retry={this.handleRetry}
          />
        )
      }

      const maxRetries = this.props.maxRetries || 3
      const canRetry = this.state.retryCount < maxRetries
      const isFlowError = this.state.error && 'type' in this.state.error
      const userMessage = isFlowError 
        ? getUserFriendlyMessage(this.state.error as FlowError)
        : 'An unexpected error occurred. Please try refreshing the page.'

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-red-600">
                {isFlowError ? 'Flow Error' : 'Something went wrong'}
              </CardTitle>
              <CardDescription>
                {userMessage}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start space-x-2">
                    <div className="text-red-500">⚠️</div>
                    <div className="flex-1">
                      <p className="text-sm text-red-600 font-medium">
                        {this.state.error.message}
                      </p>
                      {isFlowError && (
                        <p className="text-xs text-red-500 mt-1">
                          Error Type: {(this.state.error as FlowError).type}
                        </p>
                      )}
                      {this.state.retryCount > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Retry attempt: {this.state.retryCount}/{maxRetries}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                {canRetry && (
                  <Button
                    onClick={this.handleRetry}
                    variant="outline"
                    className="flex-1"
                  >
                    Try Again ({this.state.retryCount + 1}/{maxRetries})
                  </Button>
                )}
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Refresh Page
                </Button>
              </div>

              {!canRetry && (
                <div className="text-center text-sm text-gray-500">
                  Maximum retry attempts reached. Please refresh the page or contact support.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo)
    // You could also send this to an error reporting service
  }
}
