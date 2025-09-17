// lib/firebaseClient.ts
import { initializeApp, getApps } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDMEzuwcww_pVJNhPKixC2crDKRr-NXdSQ",
  authDomain: "notification-app-78acb.firebaseapp.com",
  projectId: "notification-app-78acb",
  storageBucket: "notification-app-78acb.firebasestorage.app",
  messagingSenderId: "481890140409",
  appId: "1:481890140409:web:77f8f39f5f5a68ce4de228",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
let messaging: Messaging | null = null;

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  try {
    messaging = getMessaging(app);

    // 🔹 Register the service worker
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("🛠 Service Worker registered:", registration);

        // ✅ Request token after registration
        requestForToken(registration);
      })
      .catch((err) => {
        console.error("❌ Service Worker registration failed:", err);
      });
  } catch (err) {
    console.error("🔥 Error initializing Firebase Messaging:", err);
  }
}

// 🔹 Request Notification Permission + Get Token
export const requestForToken = async (
  registration?: ServiceWorkerRegistration
) => {
  if (!messaging) {
    console.warn("⚠️ Messaging not initialized yet.");
    return null;
  }

  try {
    console.log("🔔 Requesting notification permission...");
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("🚫 Permission not granted for notifications");
      return null;
    }

    console.log("✅ Permission granted, fetching token...");

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error("❌ No VAPID key provided in env.");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("🎯 FCM Token retrieved:", token);
      return token;
    } else {
      console.warn(
        "⚠️ No registration token available. Request permission to generate one."
      );
      return null;
    }
  } catch (err) {
    console.error("❌ Error retrieving FCM token:", err);
    return null;
  }
};

// 🔹 Foreground message listener
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) {
      console.warn("⚠️ Messaging not initialized for foreground messages.");
      return;
    }

    onMessage(messaging, (payload) => {
      console.log("📩 Foreground message received:", payload);
      resolve(payload);
    });
  });
