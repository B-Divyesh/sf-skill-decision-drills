const VERSION = 'sdd-shell-v6';
const ASSETS = 'sdd-assets-v6';
const SHELL = [
  '/', '/index.html', '/offline.html', '/manifest.webmanifest',
  '/icons/icon.svg', '/icons/icon-192.png', '/icons/icon-512.png',
  '/assets/decision-board-640.webp', '/assets/decision-board-1200.webp',
  '/privacy/', '/terms/', '/legal.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(SHELL);
    const response = await fetch('/index.html');
    const html = await response.text();
    const builtAssets = [...html.matchAll(/["'](\/assets\/[^"']+\.(?:js|css))["']/g)].map((match) => match[1]);
    if (builtAssets.length) await cache.addAll([...new Set(builtAssets)]);
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => ![VERSION, ASSETS].includes(key)).map((key) => caches.delete(key)))),
    self.clients.claim()
  ]));
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.hostname.endsWith('sociobot.in') && url.pathname.includes('/api/')) {
    event.respondWith(fetch(request).catch(() => new Response(JSON.stringify({ valid: false, reason: 'offline' }), { status: 503, headers: { 'Content-Type': 'application/json' } })));
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(VERSION).then((cache) => cache.put(request, copy));
      return response;
    }).catch(async () => (await caches.match(request, { ignoreVary: true })) || (await caches.match('/index.html', { ignoreVary: true })) || caches.match('/offline.html', { ignoreVary: true })));
    return;
  }
  if (url.origin === self.location.origin) {
    event.respondWith(caches.match(request, { ignoreVary: true }).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) caches.open(ASSETS).then((cache) => cache.put(request, response.clone()));
      return response;
    })));
  }
});
