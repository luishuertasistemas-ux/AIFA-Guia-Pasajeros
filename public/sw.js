/* global self, caches */
const CACHE_NAME = 'aifa-guide-v1';
const CORE_ASSETS = [
  '/',
  '/accessibility',
  '/manifest.json',
  '/offline.html',
  '/icons/aifa-192.svg',
  '/icons/aifa-512.svg',
  '/sounds/click.mp3',
  '/images/aifa-bienvenida.jpg',
  '/images/aifa-mapa.png',
  '/images/aifa-movil-interfaz.png',
  '/images/aifa-sitio-oficial.png',
  '/images/aifa-terminal.jpg',
  '/images/aviacion-militar.jpg',
  '/images/banos-tematicos.jpg',
  '/images/btn-experiencia.jpg',
  '/images/btn-mascotas.jpg',
  '/images/btn-objetos-olvidados.jpg',
  '/images/btn-transporte.jpg',
  '/images/card-qr-scanner.jpg',
  '/images/encuentro-bg.jpg',
  '/images/hero-aifa-semaphor.jpg',
  '/images/hero-manana.jpg',
  '/images/hero-noche.jpg',
  '/images/hero-tarde.jpg',
  '/images/llegadas-bg.jpg',
  '/images/marco-bienvenidos-aifa-premium.jpg',
  '/images/museo-mamut.jpg',
  '/images/plaza-mexica.jpg',
  '/images/qr-scanner.jpg',
  '/images/salidas-bg.jpg',
  '/images/tren-olivo.jpg',
  '/images/turismo-bg.jpg',
  '/images/entorno/sierra-hermosa.jpg',
  '/images/entorno/tecamac-andador.jpg',
  '/images/entorno/tecamac-centro.jpg',
  '/images/entorno/tecamac-parroquia.jpg',
  '/images/museos/museo-aviacion.jpg',
  '/images/museos/museo-mamut.jpg',
  '/images/museos/tren-historico.jpg',
  '/images/rutas/mexibus-doc/paso-01.jpg',
  '/images/rutas/mexibus-doc/paso-02.jpg',
  '/images/rutas/mexibus-doc/paso-03.jpg',
  '/images/rutas/mexibus-doc/paso-04.jpg',
  '/images/rutas/mexibus-doc/paso-05.jpg',
  '/images/rutas/mexibus-doc/paso-06.jpg'
];

async function cacheInitialBundles(cache) {
  const bundleUrls = new Set();
  const documentPaths = ['/', '/accessibility'];

  for (const path of documentPaths) {
    const documentResponse = await cache.match(path);
    if (!documentResponse) continue;

    const html = await documentResponse.text();
    const assetReferences = html.matchAll(/(?:src|href)=["']([^"']+)["']/g);
    for (const match of assetReferences) {
      const assetUrl = new URL(match[1], self.location.origin);
      if (assetUrl.origin === self.location.origin && assetUrl.pathname.startsWith('/_next/static/')) {
        bundleUrls.add(assetUrl.href);
      }
    }
  }

  await Promise.all(Array.from(bundleUrls, async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Unable to precache application bundle: ${url}`);
    await cache.put(url, response);
  }));
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
    await cacheInitialBundles(cache);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.filter((name) => name.startsWith('aifa-guide-') && name !== CACHE_NAME)
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

async function cacheSuccessfulResponse(cache, request, response) {
  if (response && response.ok && response.type === 'basic') {
    await cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => cacheSuccessfulResponse(cache, request, response))
    .catch((error) => {
      if (!cached) throw error;
      return cached;
    });

  if (cached) {
    void network;
    return cached;
  }

  try {
    return await network;
  } catch {
    const home = await cache.match('/');
    return home || cache.match('/offline.html');
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  return cacheSuccessfulResponse(cache, request, response);
}

async function cacheFirstImage(request) {
  try {
    return await cacheFirst(request);
  } catch {
    const imageUrl = new URL(request.url);
    const sourcePath = imageUrl.searchParams.get('url');
    if (imageUrl.pathname === '/_next/image' && sourcePath) {
      const source = await caches.match(new URL(sourcePath, self.location.origin).pathname);
      if (source) return source;
    }
    return new Response('', { status: 504, statusText: 'Image unavailable offline' });
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  if (url.pathname === '/_next/image') {
    event.respondWith(cacheFirstImage(request));
    return;
  }

  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/icons/') ||
    /\.(?:css|js|woff2?|ttf|otf|svg|png|jpe?g|webp|avif|ico|json|mp3|wav|ogg)$/.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request).catch(async () => (
      await caches.match(request) || new Response('', { status: 504, statusText: 'Resource unavailable offline' })
    )));
  }
});
