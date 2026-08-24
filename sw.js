const CACHE_NAME = "shareme-docs-cache-1787582123805";
const ASSETS_TO_CACHE = [
  "/shareme/",
  "/shareme/index.html",
  "/shareme/manifest-all.json",
  "/shareme/manifest-docs.json",
  "/shareme/web-app-manifest-192x192.png",
  "/shareme/web-app-manifest-512x512.png",
  "/shareme/favicon-96x96.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log("[Docs SW] Deleting old cache:", cache);
              return caches.delete(cache);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  // Only cache GET requests and requests to our own origin
  if (
    event.request.method !== "GET" ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  // Do not intercept or cache tools requests in this SW (let the tools SW handle it)
  if (event.request.url.includes("/shareme/tools/")) {
    return;
  }

  const isHtmlRequest =
    event.request.mode === "navigate" ||
    (event.request.headers.get("accept") &&
      event.request.headers.get("accept").includes("text/html"));

  // 1. Network-First Strategy for HTML Navigation pages (Docs, Blog, Homepage)
  // Ensures online users ALWAYS receive fresh HTML & new posts immediately without manual reload.
  if (isHtmlRequest) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return caches.match("/shareme/");
          });
        }),
    );
    return;
  }

  // 2. Stale-While-Revalidate Strategy for Static Assets (JS, CSS, Images, Fonts)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {});

      return cachedResponse || fetchPromise;
    }),
  );
});
