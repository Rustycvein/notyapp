importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBHRahazkAM2Ie6QZboEA27AK8ktEp0VmY",
    projectId: "notyapp-c6df7",
    messagingSenderId: "814479822487",
    appId: "1:814479822487:web:4218cd1e5c6c11fa3ea3d2"
});

const messaging = firebase.messaging();

self.addEventListener('push', function(event) {
    let payload = {};
    if (event.data) {
        payload = event.data.json();
    }

    const title = payload.notification?.title || "NotyApp";
    const userName = payload.data?.name || "Usuario";
    const bodyText = payload.notification?.body || "Nuevo mensaje recibido";

    const options = {
        body: `${bodyText}`,
        icon: 'https://cdn-icons-png.flaticon.com/512/3119/3119338.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/3119/3119338.png',
        data: payload.data
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || "Nueva Notificación";
    const userName = payload.data?.name || "Usuario";
    
    const options = {
        body: `Hola ${userName}, ${payload.notification?.body || "Tienes un nuevo mensaje."}`,
        icon: 'https://cdn-icons-png.flaticon.com/512/3119/3119338.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/3119/3119338.png'
    };

    self.registration.showNotification(title, options);
});