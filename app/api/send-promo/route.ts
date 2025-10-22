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

    // == THIS IS THE FIX ==
    // We are ONLY sending a 'data' payload.
    // This will be handled by your foreground listener (onMessageListener)
    // OR your service worker (onBackgroundMessage), but never both.
    const response = await firebaseAdmin.messaging().sendEachForMulticast({
      tokens: uniqueTokens,

      // We remove the 'notification' block completely.

      data: {
        title: title,
        body: body,
        url: url,
        icon: "/icons/icon-192.png", // Send the icon in the data payload
      },

      // Platform-specific overrides
      webpush: {
        fcmOptions: {
          // This will be used by the service worker's "notificationclick"
          link: url,
        },
      },
      apns: {
        payload: {
          aps: {
            // This helps wake up the PWA on iOS
            "content-available": 1,
          },
        },
      },
    });

    console.log("Firebase send response:", JSON.stringify(response, null, 2));
    return NextResponse.json({ success: true, response });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}
