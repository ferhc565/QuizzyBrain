
const CACHE_NAME = 'quizzybrain-v4-dark';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './preguntas.json',
  './colores.json',
  './img/logo.png',
  './img/background.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => (k === CACHE_NAME ? null : caches.delete(k)))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
