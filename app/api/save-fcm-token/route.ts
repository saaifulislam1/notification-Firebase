import { NextResponse } from "next/server";
import { saveFcmToken } from "@/lib/fcmTokens";

export async function POST(req: Request) {
  const { email, token } = await req.json();
  saveFcmToken(email, token);
  return NextResponse.json({ success: true });
}
