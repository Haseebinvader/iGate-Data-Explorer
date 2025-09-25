import { StrictMode, Suspense, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Redux store provider
import { Provider } from 'react-redux'
import { store } from './store/index.ts'

// Apply dark/light theme to <html> element
import { applyDocumentTheme } from './store/slices/themeSlice.ts'

// React Query setup
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient.ts'

// Error handling + notifications
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { Toaster } from './components/Toaster.tsx'

// Routing
import { BrowserRouter } from 'react-router-dom'

function RootProviders() {
  useEffect(() => {
    // Ensure theme (light/dark) is applied to the <html> element
    // when the app first mounts, based on Redux state
    const mode = store.getState().theme.mode
    applyDocumentTheme(mode)
  }, [])

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {/* ErrorBoundary catches runtime errors and shows fallback UI */}
        <ErrorBoundary>
          {/* Suspense handles lazy-loaded components */}
          <Suspense fallback={<div className="p-6">Loading...</div>}>
            {/* React Router (v6) handles app routing */}
            <BrowserRouter>
              <App />
            </BrowserRouter>

            {/* Toast notification system */}
            <Toaster />
          </Suspense>
        </ErrorBoundary>
      </QueryClientProvider>
    </Provider>
  )
}

// Create root and render React app into #root (in index.html)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootProviders />
  </StrictMode>,
)
// StrictMode helps identify potential problems in an application