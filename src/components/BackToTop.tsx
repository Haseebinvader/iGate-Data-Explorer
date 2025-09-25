import { useEffect, useState } from 'react'

export function BackToTop() {
  // Whether the button should be visible
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Handler: show the button only if scrolled down more than 400px
    const onScroll = () => setVisible(window.scrollY > 400)

    // Attach listener (passive improves scroll performance)
    window.addEventListener('scroll', onScroll, { passive: true })

    // Run once on mount so it’s correct initially
    onScroll()

    // Cleanup listener on unmount
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Don’t render anything if not visible
  if (!visible) return null

  // Debug: logs when button is visible (can be removed in production)
  console.log('BackToTop visible:', visible)

  return (
    <button
      aria-label="Back to Top"
      className="fixed bottom-6 right-6 px-3 py-2 rounded-full shadow bg-blue-600 text-white hover:bg-blue-700"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      ↑
    </button>
  )
}
