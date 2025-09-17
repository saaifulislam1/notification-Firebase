import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { token, title, body, delaySeconds } = await req.json();

    if (!token) throw new Error("No FCM token provided");

    console.log(`⏳ Scheduling notification in ${delaySeconds || 0}s`);

    try {
      await admin.messaging().send({
        token,
        notification: { title, body },
        // android: { notification: { tag: "order-notification" } },
        // apns: { payload: { aps: { "thread-id": "order-notification" } } },
      });
      console.log("Notification sent:", title, body);
    } catch (err) {
      console.error("FCM send error:", err);
    }

    return NextResponse.json({ success: true, scheduled: true });
  } catch (err) {
    console.error("❌ /api/notify error:", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
