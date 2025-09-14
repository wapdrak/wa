const CACHE_NAME = 'wapdrak-nastroje-v18'; // Zvýšená verze pro zajištění aktualizace
const urlsToCache = [
    '/',
    'index.html',
    'send.html',
    'hesla.html',
    'decoder.html',
    'notes.html',
    'txt.html',
    'calc.html',
    'qr.html',
    'citaty.html',
    'radio.html',
    'stamp.html',
    'stamp-round.html',
    'o-nas.html',
    'kontakt.html',
    'js/nav.js'
    // Přidejte sem cesty k dalším důležitým zdrojům, pokud existují (např. CSS, obrázky)
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

