// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

// Replace with your firebase config values (same as client)
firebase.initializeApp({
  apiKey: "AIzaSyDMEzuwcww_pVJNhPKixC2crDKRr-NXdSQ",
  authDomain: "notification-app-78acb.firebaseapp.com",
  projectId: "notification-app-78acb",
  // storageBucket: "notification-app-78acb.firebasestorage.app",
  messagingSenderId: "481890140409",
  appId: "1:481890140409:web:77f8f39f5f5a68ce4de228",
});

const messaging = firebase.messaging();

// Background handler
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received", payload);
  if (payload.notification) {
    self.registration.showNotification(payload.notification.title, {
      body: payload.notification.body,
      icon: "/icons/icon-192.png", // optional
    });
  }
});
