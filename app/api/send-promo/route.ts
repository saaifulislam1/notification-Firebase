import { NextResponse } from "next/server";
import { firebaseAdmin } from "@/lib/firebaseAdmin";
import { getFcmTokens } from "@/lib/fcmTokens";

export async function POST(req: Request) {
  try {
    const { email, title, body, url = "/notification" } = await req.json();

    // 👇 This now fetches from Supabase instead of a file!
    const fcmTokens = await getFcmTokens();

    const tokens = fcmTokens[email];
    if (!tokens || !tokens.length) {
      return NextResponse.json({ success: false, error: "No FCM token found" });
    }

    const uniqueTokens = [...new Set(tokens)];

    const response = await firebaseAdmin.messaging().sendEachForMulticast({
      tokens: uniqueTokens,
      data: { title, body, url },
    });

    return NextResponse.json({ success: true, response });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}
