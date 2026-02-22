import { useState, useEffect } from 'react'

export default function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false)
  const [registration, setRegistration] = useState(null)

  useEffect(() => {
    const handleUpdate = (event) => {
      setRegistration(event.detail)
      setShowUpdate(true)
    }

    window.addEventListener('swUpdateAvailable', handleUpdate)
    return () => window.removeEventListener('swUpdateAvailable', handleUpdate)
  }, [])

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      // Send message to service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }

  const handleDismiss = () => {
    setShowUpdate(false)
  }

  if (!showUpdate) return null

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-4 lg:max-w-md z-50 animate-slide-up">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3">
        <div className="size-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary dark:text-blue-400">system_update</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Update Available</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            A new version of SubTracker is ready
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Later
          </button>
          <button
            onClick={handleUpdate}
            className="px-3 py-1.5 text-xs font-semibold bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors shadow-sm"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  )
}
