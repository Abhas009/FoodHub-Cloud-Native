self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.open('foodhub-v1').then(async cache => {
    const res = await fetch(event.request).catch(() => cache.match(event.request));
    if (res && res.status === 200) cache.put(event.request, res.clone());
    return res || cache.match(event.request);
  }));
});
