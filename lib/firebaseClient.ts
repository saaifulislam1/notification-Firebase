// lib/firebaseClient.ts
import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDMEzuwcww_pVJNhPKixC2crDKRr-NXdSQ",
  authDomain: "notification-app-78acb.firebaseapp.com",
  projectId: "notification-app-78acb",
  storageBucket: "notification-app-78acb.firebasestorage.app",
  messagingSenderId: "481890140409",
  appId: "1:481890140409:web:77f8f39f5f5a68ce4de228",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export let messaging: ReturnType<typeof getMessaging> | null = null;

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("✅ Service Worker registered:", registration);
      messaging = getMessaging(app);
    })
    .catch((err) => {
      console.error("❌ Service Worker registration failed:", err);
    });
}

// Request FCM token
export const requestForToken = async () => {
  if (!messaging) return null;

  try {
    console.log("🔔 Requesting notification permission...");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.error("❌ Notification permission denied");
      return null;
    }

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;
    if (!vapidKey) {
      console.error("❌ No VAPID key provided in env.");
      return null;
    }

    const token = await getToken(messaging, { vapidKey });
    if (token) {
      console.log("✅ FCM token retrieved:", token);
      return token;
    } else {
      console.error("❌ No token available");
      return null;
    }
  } catch (err) {
    console.error("❌ Error retrieving FCM token:", err);
    return null;
  }
};
// trigger
// Foreground message listener
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      console.log("🔔 Foreground message received:", payload);

      // manually show notification if page is active
      if (payload?.notification) {
        new Notification(payload.notification.title!, {
          body: payload.notification.body,
        });
      }

      resolve(payload);
    });
  });
