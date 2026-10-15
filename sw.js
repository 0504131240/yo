const CACHE = 'yo-v12';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.add('./')));
  self.skipWaiting();
});

self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('fetch', e => {
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const rc = r.clone(); caches.open(CACHE).then(c => c.put(e.request, rc)); return r; })
      .catch(() => caches.match(e.request))
  );
});
