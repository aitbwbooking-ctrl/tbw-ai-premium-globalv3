self.addEventListener('install', event => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})

// Simple passthrough – we do NOT cache aggressively to avoid stale deploy issues.
self.addEventListener('fetch', () => {})
