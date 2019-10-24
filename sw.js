const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    'index.html',
    './', // Alias for index.html
    'css/freelancer.min.css',
    'js/PortfolioItems.js',
    'img/avataaars.svg',
    'img/portfolio/FAQ-landing.png',
    'img/portfolio/First.png',
    'img/portfolio/Form1.png',
    'img/portfolio/Form2.png',
    'img/portfolio/Form3.png',
    'img/portfolio/Question-Answer.png',
    'img/portfolio/Quote-FAQ.jpg',
    'img/portfolio/Skeleton-Step1.jpg',
    'img/portfolio/Skeleton-Step2.jpg',
    'img/portfolio/Skeleton-web-Step1.jpg',
    'img/portfolio/Skeleton-web-Step2.jpg',
    'img/portfolio/Step1.png',
    'img/portfolio/Step2.png',
    'img/portfolio/Step3.png',
    'img/portfolio/large_1.png',
    'img/portfolio/large_2.svg',
    'img/portfolio/large_3.jpg',
    'img/portfolio/large_4.jpg',
    'https://fonts.googleapis.com/css?family=Montserrat:400,700'

];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(PRECACHE)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(self.skipWaiting())
    );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
    // Skip cross-origin requests, like those for Google Analytics.
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return caches.open(RUNTIME).then(cache => {
                    return fetch(event.request).then(response => {
                        // Put a copy of the response in the runtime cache.
                        return cache.put(event.request, response.clone()).then(() => {
                            return response;
                        });
                    });
                });
            })
        );
    }
});