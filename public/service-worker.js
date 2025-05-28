self.addEventListener('install', (event) => {
  console.log('Service Worker installato');
  event.waitUntil(
    caches.open('calendario-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json'
        // aggiungi qui eventuali altri file statici
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
