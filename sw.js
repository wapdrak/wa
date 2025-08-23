// Název cache - Změněno pro novou verzi
const CACHE_NAME = 'wapdrak-nastroje-cache-v1';
// Soubory, které se mají uložit do mezipaměti (s relativními cestami)
const urlsToCache = [
  './',
  'index.html',
  'send.html',
  'calc.html',
  'qr.html',
  'radio.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'
];

// Instalace Service Workeru a uložení souborů do cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache otevřena');
        // Používáme fetch s no-cache, abychom zajistili, že se načtou nejnovější verze z CDN
        const requests = urlsToCache.map(url => new Request(url, {cache: 'no-cache'}));
        return cache.addAll(requests);
      })
  );
});

// Zachytávání požadavků a servírování z cache (pokud jsou dostupné)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Pokud je soubor v cache, vrátíme ho
        if (response) {
          return response;
        }
        // Jinak ho stáhneme ze sítě
        return fetch(event.request);
      }
    )
  );
});

// Aktivace nového Service Workeru a smazání staré cache
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Mazání staré cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
