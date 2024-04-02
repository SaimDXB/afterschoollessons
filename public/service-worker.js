self.addEventListener('beforeinstallprompt', (e) => {
    // Stash the event so it can be triggered later
    let deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    showInstallPromotion();
});

function showInstallPromotion() {
    // Emit a custom event to notify the UI
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'showInstallButton'
            });
        });
    });
}

const cacheName = 'AfterSchoolLessons-v1';
const cacheFiles = [
    'index.html',
    'server.js',
    'App.vue',
    'Lesson.vue',
    'Checkout.vue',
    'main.js',
    'CSS/stylesheet.css',
    '/robotics.png',
    '/gymnastics.png',
    '/athletics.png',
    '/chess.png',
    '/karate.png',
    '/swimming.png',
    '/volleyball.png',
    '/football.png',
    '/tennis.png',
    '/archery.png',
    'AfterSchoolActivities.webmanifest' // Add the webmanifest file
];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all the files');
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((r) => {
            // Download the file if it is not in the cache
            return r || fetch(e.request).then((response) => {
                // add the new file to cache
                return caches.open(cacheName).then((cache) => {
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});
