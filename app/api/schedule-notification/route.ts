// app/api/schedule-notification/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pendingNotifications } from "@/lib/pendingNotifications";

export async function POST(req: NextRequest) {
  try {
    const { token, title, body, delaySeconds } = await req.json();
    const sendAt = Date.now() + delaySeconds * 1000;

    // add to in-memory "pending notifications"
    pendingNotifications.push({ token, title, body, sendAt });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
