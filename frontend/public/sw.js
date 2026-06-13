const CACHE_NAME = 'ascendiq-cache-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/logo.svg',
  '/manifest.json'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip caching for API requests, Firebase auth, or chrome extensions
  if (
    requestUrl.pathname.startsWith('/api/') || 
    requestUrl.hostname.includes('firebase') || 
    requestUrl.hostname.includes('googleapis') ||
    event.request.method !== 'GET'
  ) {
    return; // Go straight to network
  }

  // Cache-first strategy for local static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return from cache, fetch in background to update
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {/* Ignore network update failures offline */});
        
        return cachedResponse;
      }

      // Not in cache, fetch and put in cache if it's a static file
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // If offline and request is for a page, return index.html fallback
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});
