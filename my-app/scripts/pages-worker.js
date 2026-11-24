/* global CACHE, FILES */
const scope = self.registration.scope;
const shell = new URL('index.html', scope).href;
const precache = new Set(FILES.map((file) => new URL(file, scope).href));

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll([...precache])));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('exoplanets-pages-') && key !== CACHE)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(scope) || request.headers.has('range')) return;
  const isNavigation = request.mode === 'navigate';
  if (!isNavigation && !precache.has(request.url)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    return (await cache.match(isNavigation ? shell : request)) ?? fetch(request);
  })());
});
