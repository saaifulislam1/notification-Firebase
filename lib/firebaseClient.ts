// lib/firebaseclient.ts
import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDMEzuwcww_pVJNhPKixC2crDKRr-NXdSQ",
  authDomain: "notification-app-78acb.firebaseapp.com",
  projectId: "notification-app-78acb",
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
    .catch((err) => console.error("❌ SW registration failed:", err));
}

// request token
export const requestForToken = async () => {
  if (!messaging) return null;
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;
  if (!vapidKey) return null;
  return getToken(messaging, { vapidKey });
};

// foreground listener
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onMessageListener = (callback: (payload: any) => void) => {
  if (!messaging) return;
  onMessage(messaging, (payload) => {
    const { title, body } = payload.data || payload.notification || {};
    if (!title || title === "Next.js HMR") return;
    if (body?.includes("site has been updated")) return;
    callback(payload);
  });
};
