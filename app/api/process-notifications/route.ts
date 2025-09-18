// app/api/process-notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { pendingNotifications } from "@/lib/pendingNotifications";

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
  //   trigger1
}

export async function GET(req: NextRequest) {
  const now = Date.now();
  const toSend = pendingNotifications.filter((n) => n.sendAt <= now);

  for (const notif of toSend) {
    try {
      await admin.messaging().send({
        token: notif.token,
        data: { title: notif.title, body: notif.body },
      });
    } catch (err) {
      console.error("FCM send error:", err);
    }
  }

  // Remove sent notifications
  toSend.forEach((n) => {
    const index = pendingNotifications.indexOf(n);
    if (index > -1) pendingNotifications.splice(index, 1);
  });

  return NextResponse.json({ sent: toSend.length });
}
