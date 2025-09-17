import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMEzuwcww_pVJNhPKixC2crDKRr-NXdSQ",
  authDomain: "notification-app-78acb.firebaseapp.com",
  projectId: "notification-app-78acb",
  storageBucket: "notification-app-78acb.firebasestorage.app",
  messagingSenderId: "481890140409",
  appId: "1:481890140409:web:77f8f3f5f5a68ce4de228",
};

// --- Initialize Firebase (Singleton Pattern) ---
// This prevents re-initializing the app on every hot reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// --- Initialize Messaging ---
// We export `messaging` so it can be used in other parts of the app
export let messaging: ReturnType<typeof getMessaging> | null = null;

// This check ensures the code only runs in the browser, not on the server
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  messaging = getMessaging(app);
}

// --- Function to Request FCM Token ---
export const requestForToken = async () => {
  if (!messaging) {
    console.log("No messaging instance available. Are you on the server?");
    return null;
  }

  try {
    // 1. Request permission from the user
    console.log("🔔 Requesting notification permission...");
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.error("❌ Notification permission was not granted.");
      return null;
    }

    // 2. Get the VAPID key from your environment variables
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error("❌ No VAPID key found in .env.local file.");
      return null;
    }

    // 3. Get the actual FCM token
    const token = await getToken(messaging, { vapidKey });

    if (token) {
      console.log("✅ FCM token retrieved successfully:", token);
      console.log(vapidKey, "vapid key");
      return token;
    } else {
      console.error(
        "❌ Failed to get FCM token. User might have unsubscribed or permissions are blocked."
      );
      return null;
    }
  } catch (err) {
    console.error("❌ An error occurred while retrieving token:", err);
    return null;
  }
};

// --- Function to Listen for Foreground Messages ---
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      console.log("🔔 Foreground message received:", payload);
      resolve(payload);
    });
  });
