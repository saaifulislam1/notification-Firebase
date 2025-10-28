/* app/api/send-promo-all/route.ts */

import { NextResponse } from "next/server";
import { firebaseAdmin } from "@/lib/firebaseAdmin";
import { getFcmTokens } from "@/lib/fcmTokens";
import { users } from "@/lib/auth"; // Needs the user list for names
import { supabase } from "@/lib/supabaseClient";
export async function POST(req: Request) {
  try {
    // Only uses the title from the frontend
    const { title, body, url = "/notification" } = await req.json();
    const allTokenRecords = await getFcmTokens();

    if (Object.keys(allTokenRecords).length === 0) {
      return NextResponse.json({
        success: false,
        error: "No users with tokens found.",
      });
    }

    const messages = [];
    const notificationsToLog = [];
    for (const user of users) {
      // if (user.email === "admin@example.com") continue;
      const userTokens = allTokenRecords[user.email];

      if (userTokens && userTokens.length > 0) {
        // Creates a new personalized body
        // const personalizedBody = `Hi ${user.name}, tap to check out our new deals!`;
        const personalizedBody = body.replace("{name}", user.name);

        notificationsToLog.push({
          user_email: user.email,
          title: title,
          body: personalizedBody,
          url: url,
        });

        for (const token of userTokens) {
          messages.push({
            token: token,
            data: {
              title: title,
              body: personalizedBody,
              url: url,
            },
          });
        }
      }
    }

    if (messages.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No tokens found for any known users.",
      });
    }
    const { error: logError } = await supabase
      .from("notifications")
      .insert(notificationsToLog);
    if (logError) {
      console.error("Error batch logging notifications:", logError.message);
    }
    const response = await firebaseAdmin.messaging().sendEach(messages);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({
      success: false,
      error: errorMessage,
    });
  }
}
