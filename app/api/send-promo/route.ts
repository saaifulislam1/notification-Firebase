/* app/api/send-promo/route.ts (Corrected) */

import { NextResponse } from "next/server";
import { firebaseAdmin } from "@/lib/firebaseAdmin";
import { getFcmTokens } from "@/lib/fcmTokens"; // Ensure this path is correct

export async function POST(req: Request) {
  try {
    const { email, title, body, url = "/notification" } = await req.json();

    const fcmTokens = await getFcmTokens();

    const tokens = fcmTokens[email];
    if (!tokens || !tokens.length) {
      return NextResponse.json({ success: false, error: "No FCM token found" });
    }

    const uniqueTokens = [...new Set(tokens)];

    // == THIS IS THE CORRECTED PAYLOAD ==
    const response = await firebaseAdmin.messaging().sendEachForMulticast({
      tokens: uniqueTokens,

      // 1. Add a NOTIFICATION payload
      // This will be handled automatically by Android/iOS when the app is in the background.
      notification: {
        title: title,
        body: body,
      },

      // 2. Keep the DATA payload
      // This will be used by your onMessageListener when the app is in the foreground.
      data: {
        title: title,
        body: body,
        url: url,
      },

      // 3. Add platform-specific overrides for a better experience
      webpush: {
        notification: {
          // Add an icon for web (Android/Chrome)
          icon: "/icons/icon-192.png",
        },
        fcmOptions: {
          // This makes the notification clickable and opens the URL
          link: url,
        },
      },
      apns: {
        payload: {
          aps: {
            "content-available": 1, // Wakes up your PWA on iOS
          },
        },
      },
    });

    // Add this log to see the actual response from Firebase
    console.log("Firebase send response:", JSON.stringify(response, null, 2));

    return NextResponse.json({ success: true, response });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}
