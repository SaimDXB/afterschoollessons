// Add event listener for beforeinstallprompt event
self.addEventListener('beforeinstallprompt', (e) => {
    // Stash the event so it can be triggered later
    let deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    showInstallPromotion();
});

// Function to show install promotion
function showInstallPromotion() {
    // Emit a custom event to notify the UI
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            // Post message to client to show install button
            client.postMessage({
                type: 'showInstallButton'
            });
        });
    });
}

// Cache name for the service worker
const cacheName = 'AfterSchoolLessons-v1';
// Array of files to be cached
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

// Event listener for install event
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    // Wait until caching is complete
    e.waitUntil(
        // Open the cache and cache all files
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all the files');
            return cache.addAll(cacheFiles);
        })
    );
});

// Event listener for fetch event
self.addEventListener('fetch', (e) => {
    // Respond with cached file if available, else fetch from network
    e.respondWith(
        caches.match(e.request).then((r) => {
            // Check if file is in cache
            return r || fetch(e.request).then((response) => {
                // Add the new file to cache
                return caches.open(cacheName).then((cache) => {
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});
