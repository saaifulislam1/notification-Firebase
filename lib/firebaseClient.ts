// lib/firebaseClient.ts
import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

console.log("🔥 Firebase config loaded:", firebaseConfig);

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;

export async function requestForToken() {
  if (!messaging) {
    console.error("❌ Messaging not available (window undefined or no app)");
    return null;
  }

  try {
    console.log(
      "🔔 Current Notification.permission =",
      Notification.permission
    );

    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      console.log("🔔 User responded with permission:", permission);
      if (permission !== "granted") {
        return null;
      }
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    console.log("🛠 Service Worker registered:", registration);

    const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY!;
    console.log("🔑 Using VAPID key:", vapidKey);

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.warn("⚠️ getToken returned null (no FCM token)");
      return null;
    }

    console.log("✅ FCM Token retrieved:", token);
    return token;
  } catch (err) {
    console.error("❌ Error retrieving FCM token:", err);
    return null;
  }
}

export function onMessageListener() {
  return new Promise((resolve) => {
    if (!messaging) {
      console.warn("⚠️ Messaging not initialized for onMessageListener");
      return;
    }
    onMessage(messaging, (payload) => {
      console.log("📩 Foreground FCM message received:", payload);
      resolve(payload);
    });
  });
}
