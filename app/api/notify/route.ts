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
    const { token, title, body } = await req.json();

    if (!token) throw new Error("No FCM token provided");

    await admin.messaging().send({
      token,
      notification: { title, body }, // ensures system notification
      data: { title, body }, // allows foreground SW forwarding
      android: { notification: { tag: "fcm-notification" } },
      apns: { payload: { aps: { "thread-id": "fcm-notification" } } },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
