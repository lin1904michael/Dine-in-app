import { useEffect } from 'react'

function Toast({ message, isVisible, onHide }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onHide, 2500)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onHide])

  if (!isVisible) return null

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] animate-slide-down">
      <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg font-semibold text-sm flex items-center gap-2">
        <span>✅</span> {message}
      </div>
    </div>
  )
}

export default Toast
