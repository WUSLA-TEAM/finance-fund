
const CACHE_NAME = "finance-fund-v1";

self.addEventListener("install", (event) => {
    // Skip waiting to activate strictly
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    // Basic pass-through fetch
    event.respondWith(fetch(event.request));
});
