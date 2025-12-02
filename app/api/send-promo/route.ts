/* app/api/send-promo/route.ts  */

import { NextResponse } from "next/server";
import { firebaseAdmin } from "@/lib/firebaseAdmin";
import { getFcmTokens } from "@/lib/fcmTokens";
import { supabase } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const {
      email,
      title,
      body,
      selectedPromoId,
      url = "/notification",
    } = await req.json();

    const { error: logError } = await supabase.from("notifications").insert({
      user_email: email,
      title: title,
      body: body,
      url: url,
      promotion_id: selectedPromoId,
    });

    if (logError) {
      console.error("Error logging notification:", logError.message);
      // We'll just log the error but still try to send
    }

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
      // notification: {
      //   title: title,
      //   body: body,
      // },

      // 2. Keep the DATA payload
      // This will be used by your onMessageListener when the app is in the foreground.
      data: {
        title: title,
        body: body,
        url: url,
        icon: "/icons/icon-192.png", // Send the icon here
      },

      // 3. Add platform-specific overrides for a better experience
      webpush: {
        // notification: {
        //   // Add an icon for web (Android/Chrome)
        //   icon: "/icons/icon-192.png",
        // },
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
