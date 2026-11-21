const CACHE = 'uaimc-v3';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (new URL(e.request.url).origin !== location.origin) return; // AI 요청은 캐시하지 않음
  e.respondWith(caches.open(CACHE).then(c => c.match(e.request).then(hit => {
    const net = fetch(e.request).then(r => { c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  })));
});
