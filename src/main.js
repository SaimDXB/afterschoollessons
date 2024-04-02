import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

let deferredPrompt; // Define deferredPrompt outside the app instance

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });

    window.addEventListener('beforeinstallprompt', (event) => {
        // Prevent the default behavior
        event.preventDefault();
        
        // Store the event for later use
        deferredPrompt = event;
        console.log('beforeinstallprompt event triggered');
    });
}

// Expose deferredPrompt as a global property of the app instance
app.config.globalProperties.$deferredPrompt = deferredPrompt;

app.mount('#app');

app.config.globalProperties.$installApp = () => {
    if (deferredPrompt) {
        // Show the installation prompt
        deferredPrompt.prompt();

        // Wait for the user to make a choice
        deferredPrompt.userChoice.then(choiceResult => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            // Reset the deferredPrompt variable
            deferredPrompt = null;
        });
    }
};
