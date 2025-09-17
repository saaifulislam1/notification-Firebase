// app/api/notify/route.ts
import { NextResponse } from "next/server";
import { adminMessaging } from "@/lib/firebaseAdmin"; // change export if you used different name

export async function POST(req: Request) {
  try {
    const { token, title, body, delaySeconds } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const delay = (typeof delaySeconds === "number" ? delaySeconds : 10) * 1000;

    // schedule send after delay (server-side setTimeout)
    setTimeout(async () => {
      try {
        const message = {
          notification: { title: title || "Notification", body: body || "" },
          token,
        };
        const resp = await adminMessaging.send(message);
        console.log("FCM send response:", resp);
      } catch (err) {
        console.error("FCM send error:", err);
      }
    }, delay);

    return NextResponse.json({ success: true, scheduledInMs: delay });
  } catch (err) {
    console.error("Notify API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
