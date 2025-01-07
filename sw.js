// Service Worker 文件
const CACHE_NAME = 'math-practice-v1';
const CACHE_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/favicon.png',
    '/icon-192.png',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap'
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
            .then(response => {
                // 如果有缓存，直接返回缓存的响应
                if (response) {
                    return response;
                }
                
                // 如果没有缓存，发起网络请求
                return fetch(event.request).then(networkResponse => {
                    // 检查响应是否有效
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }
                    
                    // 克隆响应，因为响应流只能使用一次
                    const responseToCache = networkResponse.clone();
                    
                    // 将新响应添加到缓存中
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                    
                    return networkResponse;
                });
            })
            .catch(() => {
                // 如果发生错误，尝试返回离线页面或者错误提示
                return new Response('离线模式暂时无法访问此内容');
            })
    );
}); 