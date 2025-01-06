// Service Worker 文件
const CACHE_NAME = 'math-practice-v1';
const CACHE_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/icon-192.png',
    '/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CACHE_FILES))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
}); 