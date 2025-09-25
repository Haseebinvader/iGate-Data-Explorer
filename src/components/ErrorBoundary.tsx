import React from 'react'
import type { ErrorBoundaryProps, ErrorBoundaryState } from '../lib/Interface'



export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<ErrorBoundaryProps>, // Component accepts children + custom props
  ErrorBoundaryState // Internal state type
> {
  // Initialize state: no error by default
  state: ErrorBoundaryState = { hasError: false, error: null }

  /**
   * Lifecycle method called when a child throws an error.
   * Updates state to trigger fallback UI.
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  /**
   * Lifecycle method invoked after an error has been caught.
   * Useful for logging errors to services like Sentry, Datadog, etc.
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught error:', error, errorInfo)

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  /**
   * Reset error state and optionally call onRetry handler.
   * This allows retrying the failed render.
   */
  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    this.props.onRetry?.()
  }

  render(): React.ReactNode {
    // If an error occurred, render fallback UI
    if (this.state.hasError) {
      // If custom fallback is provided, render it
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Otherwise render a default fallback UI
      return (
        <div className="p-6 text-center space-y-3">
          <h2 className="text-xl font-semibold">Something went wrong.</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {this.state.error?.message}
          </p>
          <button
            className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={this.handleRetry}
          >
            Retry
          </button>
        </div>
      )
    }

    // If no error, render children as normal
    return this.props.children
  }
}
