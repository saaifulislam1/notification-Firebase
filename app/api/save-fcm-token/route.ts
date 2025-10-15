// app/api/save-fcm-token/route.ts (The Corrected Version)
import { NextResponse } from "next/server";
// Make sure this import path is correct for your project structure
import { saveFcmToken } from "@/lib/fcmTokens";

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json(
        { success: false, error: "Email and token are required." },
        { status: 400 }
      );
    }

    // Now we WAIT for the function to finish
    await saveFcmToken(email, token);

    // Only if it succeeds without throwing an error, we return success
    return NextResponse.json({ success: true });
  } catch (error) {
    // If ANY part of the process fails, we catch the error
    console.error("API Error saving FCM token:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save token." },
      { status: 500 }
    );
  }
}
