import { Toaster as HotToaster } from 'react-hot-toast'

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        style: { background: '#111827', color: '#fff' },
        className: 'dark:bg-gray-900 dark:text-white',
      }}
    />
  )
}

