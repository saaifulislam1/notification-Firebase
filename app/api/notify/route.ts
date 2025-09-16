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

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing FCM token" },
        { status: 400 }
      );
    }

    const message = {
      notification: { title: title || "Default Title", body: body || "Hello!" },
      token,
    };

    const response = await admin.messaging().send(message);

    return NextResponse.json({ success: true, response });
  } catch (err) {
    console.error("🔥 FCM send error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
