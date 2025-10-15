import { NextResponse } from "next/server";
import { users } from "@/lib/auth";
import { getFcmTokens } from "@/lib/fcmTokens"; // 👈 Use the new Supabase function

export async function GET() {
  try {
    // 👇 This now fetches from Supabase instead of a file!
    const fcmTokens = await getFcmTokens();

    // Filter users who have a token saved in Supabase
    const usersWithToken = users.filter((u) => fcmTokens[u.email]?.length > 0);

    return NextResponse.json({ success: true, users: usersWithToken });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}
