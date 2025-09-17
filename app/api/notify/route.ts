import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK if it hasn't been already
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Ensure private key newlines are correctly parsed from environment variables
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { token, title, body } = await req.json();

    if (!token) {
      throw new Error("No FCM token provided in the request body.");
    }

    console.log(`Sending notification to token: ${token}`);

    // Send the message via FCM
    await admin.messaging().send({
      token,
      // The notification payload is great for when the app is in the foreground
      notification: {
        title,
        body,
      },
      // The data payload is crucial for waking up the service worker in the background
      data: {
        title,
        body,
      },
      // Android-specific configuration for high priority
      android: {
        priority: "high",
        notification: {
          tag: "order-notification", // Groups notifications
        },
      },
      // APNS (Apple) specific configuration for grouping
      apns: {
        payload: {
          aps: {
            "thread-id": "order-notification",
          },
        },
      },
    });

    console.log("✅ Notification sent successfully:", { title, body });

    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("❌ /api/notify error:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
