import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    // Check if user has already dismissed the prompt
    const dismissed = localStorage.getItem('subtracker_install_dismissed')
    if (dismissed === 'true') {
      return
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return
    }

    const handleInstallPrompt = (event) => {
      setDeferredPrompt(event.detail)
      setShowPrompt(true)
    }

    window.addEventListener('appInstallPromptAvailable', handleInstallPrompt)
    return () => window.removeEventListener('appInstallPromptAvailable', handleInstallPrompt)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // Show the browser's install prompt
    deferredPrompt.prompt()

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice
    console.log('Install prompt outcome:', outcome)

    // Clear the deferred prompt
    setDeferredPrompt(null)
    setShowPrompt(false)

    // Store dismissal (whether accepted or declined)
    localStorage.setItem('subtracker_install_dismissed', 'true')
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Store dismissal permanently
    localStorage.setItem('subtracker_install_dismissed', 'true')
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-24 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-4 lg:max-w-md z-50 animate-slide-up">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-start gap-3">
        <div className="size-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary dark:text-blue-400">install_mobile</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Install SubTracker</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
            Add to your home screen for quick access and offline use
          </p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={handleInstall}
            className="px-4 py-2 text-xs font-semibold bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors shadow-sm"
          >
            Install App
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}
