const CACHE_NAME = "asther-cache-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Simple pass-through strategy (required for PWA baseline)
  event.respondWith(fetch(event.request));
});
