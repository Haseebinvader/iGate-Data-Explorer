import { StrictMode, Suspense, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// ---------------------------------------------
// Redux Store Provider
// ---------------------------------------------
import { Provider } from 'react-redux'
import { store } from './store/index.ts'

// ---------------------------------------------
// Theme (light/dark) utilities
// ---------------------------------------------
import { applyDocumentTheme } from './store/slices/themeSlice.ts'

// ---------------------------------------------
// React Query (server state management)
// ---------------------------------------------
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient.ts'

// ---------------------------------------------
// Error handling + Toast notifications
// ---------------------------------------------
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { Toaster } from './components/Toaster.tsx'

// ---------------------------------------------
// Routing (React Router v6)
// ---------------------------------------------
import { BrowserRouter } from 'react-router-dom'
import Loader from './components/Loader.tsx'

// ---------------------------------------------
// RootProviders Component
// ---------------------------------------------
// Wraps App in all global providers (Redux, QueryClient, Router, etc.)
// and handles theme initialization.
function RootProviders() {
  useEffect(() => {
    // Ensure correct theme (light/dark) is applied to <html>
    // when app mounts — prevents flash of wrong theme (FOUC).
    const mode = store.getState().theme.mode
    applyDocumentTheme(mode)
  }, [])

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {/* ErrorBoundary catches runtime errors and shows fallback UI */}
        <ErrorBoundary
          fallback={
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold">Something went wrong!</h2>
              <p>Please try again later.</p>
            </div>
          }
          onError={(error, errorInfo) => {
            // You can add logging or additional actions here, such as reporting errors to a logging service
            console.error('Caught error:', error, errorInfo)
          }}
          onRetry={() => {
            // Optionally, trigger a retry function or action if needed
            console.log('Retrying...')
          }}
        >
          {/* Suspense handles lazy-loaded components */}
          <Suspense fallback={<Loader/>}>
            {/* BrowserRouter provides routing context */}
            <BrowserRouter>
              <App />
            </BrowserRouter>

            {/* Toast notification system (global) */}
            <Toaster />
          </Suspense>
        </ErrorBoundary>
      </QueryClientProvider>
    </Provider>
  )
}

// ---------------------------------------------
// Create root and render React app into #root (index.html).
// StrictMode helps detect potential problems in development.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootProviders />
  </StrictMode>,
)
