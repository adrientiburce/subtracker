const CACHE_NAME = 'subtracker-v2'
const RUNTIME_CACHE = 'subtracker-runtime'

// Assets to precache
const urlsToCache = [
  '/subtracker/',
  '/subtracker/index.html',
]

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
  // Force the waiting service worker to become the active service worker
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete any cache that doesn't match current version
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  // Take control of all clients immediately
  return self.clients.claim()
})

// Fetch event - Network-first strategy with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  event.respondWith(
    // Try network first
    fetch(request)
      .then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // Clone the response
        const responseToCache = response.clone()

        // Cache the fetched response for future offline use
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseToCache)
        })

        return response
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          
          // If it's a navigation request and we don't have it cached, return the app shell
          if (request.mode === 'navigate') {
            return caches.match('/subtracker/index.html')
          }
          
          return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable'
          })
        })
      })
  )
})

// Message event - allow clients to skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
