import React from 'react'
import type { ErrorBoundaryProps, ErrorBoundaryState } from '../lib/Interface'

/**
 * -------------------------------------------------
 * ErrorBoundary Component
 * -------------------------------------------------
 * A React class component that catches errors
 * in its child component tree and displays a fallback UI
 * instead of crashing the whole app.
 *
 * - Uses React lifecycle methods (`getDerivedStateFromError`, `componentDidCatch`)
 * - Allows optional custom fallback UI
 * - Exposes `onError` and `onRetry` callbacks
 *
 * Typical usage:
 * <ErrorBoundary fallback={<CustomErrorUI />} onError={logError}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<ErrorBoundaryProps>, // Accepts children + custom props
  ErrorBoundaryState // Manages internal error state
> {
  /**
   * ------------------------------
   * State Initialization
   * ------------------------------
   * - hasError: tracks if an error occurred
   * - error: stores the actual error object
   */
  state: ErrorBoundaryState = { hasError: false, error: null }

  /**
   * ------------------------------
   * getDerivedStateFromError
   * ------------------------------
   * React lifecycle method triggered when a child throws an error.
   *
   * - Updates state so `render` knows to show fallback UI
   * - This is static: cannot access instance (`this`)
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  /**
   * ------------------------------
   * componentDidCatch
   * ------------------------------
   * Lifecycle method called after an error is thrown.
   *
   * Parameters:
   * - error: the error object
   * - errorInfo: extra React info (component stack trace, etc.)
   *
   * Responsibilities:
   * - Log error details (e.g., console, monitoring tools like Sentry)
   * - Call optional `onError` callback passed in props
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught error:', error, errorInfo)

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  /**
   * ------------------------------
   * handleRetry
   * ------------------------------
   * Resets the error state to allow re-rendering of children.
   * Useful when retrying after fixing transient errors.
   *
   * - Resets `hasError` to false
   * - Clears stored error
   * - Calls optional `onRetry` callback
   */
  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    this.props.onRetry?.()
  }

  /**
   * ------------------------------
   * render
   * ------------------------------
   * Determines what to render depending on error state:
   *
   * 1. If error occurred:
   *    - Use custom `fallback` if provided
   *    - Otherwise, show default fallback with Retry button
   *
   * 2. If no error:
   *    - Render children normally
   */
  render(): React.ReactNode {
    if (this.state.hasError) {
      // Case 1: error occurred

      // Render custom fallback UI if provided by parent
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Otherwise render default fallback UI
      return (
        <div className="p-6 text-center space-y-3">
          <h2 className="text-xl font-semibold">Something went wrong.</h2>

          {/* Show error message if available */}
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {this.state.error?.message}
          </p>

          {/* Retry button resets state and attempts re-render */}
          <button
            className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={this.handleRetry}
          >
            Retry
          </button>
        </div>
      )
    }

    // Case 2: no error → render children normally
    return this.props.children
  }
}
