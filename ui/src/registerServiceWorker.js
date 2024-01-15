// registerServiceWorker.js

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('my-cache').then(cache => {
      return cache.addAll([
        '/',
        '../index.html',
        'assets/main.css',
        'assets/background.jpg',
        'main.js',
        'App.vue',
        'components/Dice.vue',
        'components/GameBoard.vue',
        'components/Navbar.vue',
        'components/Snackbar.vue'
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
