const CACHE_NAME = 'shareme-docs-cache-v1';
const ASSETS_TO_CACHE = [
  '/shareme/',
  '/shareme/index.html',
  '/shareme/manifest-all.json',
  '/shareme/manifest-docs.json',
  '/shareme/web-app-manifest-192x192.png',
  '/shareme/web-app-manifest-512x512.png',
  '/shareme/favicon-96x96.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests and requests to our own origin
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Do not intercept or cache tools requests in this SW (let the tools SW handle it)
  if (event.request.url.includes('/shareme/tool/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch new version in background to update the cache (Stale-While-Revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        // Cache static assets dynamically
        const responseToCache = networkResponse.clone();
        const url = new URL(event.request.url);
        // Only cache document files, JS, CSS, and images
        const shouldCache = url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|json)$/) || 
                            url.search.includes('utm_source=pwa') || 
                            event.request.headers.get('accept').includes('text/html');

        if (shouldCache) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return networkResponse;
      }).catch(() => {
        // Offline fallback for HTML pages
        if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/shareme/');
        }
      });
    })
  );
});
