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

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    console.log("🔔 Requesting notification permission...");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.error("❌ Notification permission denied");
      return null;
    }

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error("❌ No VAPID key provided in env.");
      return null;
    }

    console.log("✅ Permission granted, fetching FCM token...");
    const currentToken = await getToken(messaging, { vapidKey });
    if (currentToken) {
      console.log("✅ FCM token retrieved:", currentToken);
      return currentToken;
    } else {
      console.error("❌ No token available");
      return null;
    }
  } catch (err) {
    console.error("❌ Error retrieving FCM token:", err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("🔔 Foreground message received:", payload);

      // Show desktop notification for foreground messages
      // if (Notification.permission === "granted") {
      //   const title = payload.notification?.title || "Notification";
      //   const body = payload.notification?.body || "";
      //   new Notification(title, { body });
      // }

      resolve(payload);
    });
  });
