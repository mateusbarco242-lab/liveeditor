// Serviço simples para cachear os recursos essenciais e permitir uso offline básico.
const CACHE_NAME = 'live-editor-cache-v1';
const URLsToCache = [
  '.',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (event.request.method === 'GET' && response && response.status === 200 && response.type === 'basic') {
          const respClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, respClone));
        }
        return response;
      }).catch(()=> cached);
    })
  );
});
