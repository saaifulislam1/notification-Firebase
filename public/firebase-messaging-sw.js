// /public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDMEzuwcww_pVJNhPKixC2crDKRr-NXdSQ",
  authDomain: "notification-app-78acb.firebaseapp.com",
  projectId: "notification-app-78acb",
  messagingSenderId: "481890140409",
  appId: "1:481890140409:web:77f8f39f5f5a68ce4de228",
});

const messaging = firebase.messaging();

// background messages
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.data || payload.notification || {};
  if (title && body) {
    self.registration.showNotification(title, {
      body,
      icon: "/icons/icon-192.png",
      tag: "fcm-notification",
      vibrate: [200, 100, 200],
    });
  }
});

// messages forwarded from foreground
self.addEventListener("message", (event) => {
  const { title, body } = event.data || {};
  if (title && body) {
    self.registration.showNotification(title, {
      body,
      icon: "/icons/icon-192.png",
      tag: "fcm-notification",
    });
  }
});

// click behavior
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      if (clientList.length > 0) return clientList[0].focus();
      return clients.openWindow("/");
    })
  );
});
