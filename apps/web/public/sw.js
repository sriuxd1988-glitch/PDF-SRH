/**
 * SimplifyPDF Progressive Web App (PWA) Service Worker
 * Version: 1.0.0
 * Features: Offline Shell Caching, Network-First Pages, Web Share Target Interception
 */

const CACHE_NAME = 'simplifypdf-cache-v1';
const OFFLINE_URL = '/offline.html';

const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/icons/icon-maskable.svg',
];

// Install Event: Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache strategies & Web Share Target handler
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Web Share Target API Interceptor (POST to /share-target)
  if (event.request.method === 'POST' && url.pathname === '/share-target') {
    event.respondWith(
      (async () => {
        try {
          const formData = await event.request.formData();
          const file = formData.get('file');

          // Store shared file into Cache / IndexedDB for client retrieval
          if (file) {
            const cache = await caches.open('simplifypdf-shared-files');
            await cache.put('/shared-pdf-buffer', new Response(file, {
              headers: {
                'Content-Type': file.type || 'application/pdf',
                'X-Filename': encodeURIComponent(file.name || 'shared-document.pdf'),
              },
            }));
          }

          // Redirect user into Compress tool with shared query parameter
          return Response.redirect('/tools/compress?shared=1', 303);
        } catch (err) {
          return Response.redirect('/tools/compress', 303);
        }
      })()
    );
    return;
  }

  // Only handle GET requests below
  if (event.request.method !== 'GET') return;

  // 2. Cache-first strategy for static assets (images, icons, fonts)
  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Network-first strategy for navigation & HTML pages
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL).then((offlineRes) => {
          return offlineRes || new Response('Offline', { status: 503 });
        });
      })
    );
    return;
  }

  // Default network fetch
  event.respondWith(fetch(event.request));
});
