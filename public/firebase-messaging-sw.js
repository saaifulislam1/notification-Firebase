// Import the Firebase scripts for the compat libraries
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker with your config
firebase.initializeApp({
  apiKey: "AIzaSyDMEzuwcww_pVJNhPKixC2crDKRr-NXdSQ",
  authDomain: "notification-app-78acb.firebaseapp.com",
  projectId: "notification-app-78acb",
  storageBucket: "notification-app-78acb.firebasestorage.app",
  messagingSenderId: "481890140409",
  appId: "1:481890140409:web:77f8f39f5f5a68ce4de228",
});

// Get an instance of Firebase Messaging
const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received:", payload);

  // Prioritize the data payload for creating the notification
  const notificationTitle = payload.data?.title || payload.notification?.title;
  const notificationOptions = {
    body: payload.data?.body || payload.notification?.body,
    icon: "/icons/icon-192.png", // Path to your notification icon
  };

  // Ensure there's a title before trying to show the notification
  if (notificationTitle) {
    self.registration.showNotification(notificationTitle, notificationOptions);
  } else {
    console.log("[SW] No title found in payload, not showing notification.");
  }
});
