import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Register service worker for PWA with update detection
if ('serviceWorker' in navigator) {
  let refreshing = false

  // Reload page when new service worker takes control
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    refreshing = true
    window.location.reload()
  })

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/subtracker/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration)

        // Check for updates only once on app launch (no interval)
        registration.update()

        // Check for waiting service worker
        if (registration.waiting) {
          // New service worker is waiting, dispatch event to show update prompt
          window.dispatchEvent(new CustomEvent('swUpdateAvailable', { 
            detail: registration 
          }))
        }

        // Listen for new service worker installing
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing

          newWorker.addEventListener('statechange', () => {
            // When the new service worker is installed and waiting
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is waiting to activate
              console.log('New service worker available')
              window.dispatchEvent(new CustomEvent('swUpdateAvailable', { 
                detail: registration 
              }))
            }
          })
        })
      })
      .catch((error) => {
        console.log('SW registration failed:', error)
      })
  })
}

// Capture beforeinstallprompt event for PWA install prompt
let deferredInstallPrompt = null

window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the default browser install prompt
  event.preventDefault()
  // Store the event for later use
  deferredInstallPrompt = event
  console.log('Install prompt available')
  
  // Dispatch custom event to show our custom install UI
  window.dispatchEvent(new CustomEvent('appInstallPromptAvailable', { 
    detail: event 
  }))
})

// Listen for successful app installation
window.addEventListener('appinstalled', () => {
  console.log('PWA installed successfully')
  deferredInstallPrompt = null
})

