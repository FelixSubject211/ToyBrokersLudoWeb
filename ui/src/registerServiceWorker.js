// registerServiceWorker.js

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('my-cache').then(cache => {
      return cache.addAll([
        '/',
        '../index.html',
        '/assets/main.css',
        'main.js'
        // Füge hier alle Dateien hinzu, die gecacht werden sollen
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
