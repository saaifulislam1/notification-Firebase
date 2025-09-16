importScripts(
  "https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js"
);
firebase.initializeApp({
  apiKey: "AIzaSyDMEzuwcww_pVJNhPKixC2crDKRr-NXdSQ",
  authDomain: "notification-app-78acb.firebaseapp.com",
  projectId: "notification-app-78acb",
  storageBucket: "notification-app-78acb.firebasestorage.app",
  messagingSenderId: "481890140409",
  appId: "1:481890140409:web:77f8f39f5f5a68ce4de228",
});

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle =
    payload.notification.title || "Background Notification";
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/favicon.ico",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
