const CACHE_NAME = 'gad&gets-v1';
const urlsToCache = ['/', '/index.html'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip API calls - don't cache them
  if (event.request.url.includes('/api/') || event.request.url.includes('localhost:5000') || event.request.url.includes('onrender.com')) {
    event.respondWith(fetch(event.request).catch(() => {
      return new Response('Network error', { status: 0 });
    }));
    return;
  }

  // Cache static assets
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request).catch(() => {
        // Offline fallback for pages
        return caches.match('/index.html');
      });
    })
  );
});