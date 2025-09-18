// app/api/schedule-notification/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, title, body, delaySeconds } = await req.json();

    if (!token || !title || !body || !delaySeconds) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Construct EasyCron URL
    const easyCronUrl = `https://www.easycron.com/rest/schedule?token=${
      process.env.EASYCRON_API_TOKEN
    }&url=${encodeURIComponent(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/send-scheduled`
    )}&run_every=${delaySeconds}&method=POST&body=${encodeURIComponent(
      JSON.stringify({ token, title, body })
    )}`;

    // Call EasyCron to schedule the notification
    const res = await fetch(easyCronUrl);
    const data = await res.json();

    if (!data.success) {
      console.error("EasyCron error:", data);
      return NextResponse.json(
        { success: false, error: "EasyCron scheduling failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Notification scheduled in ~${delaySeconds} seconds via EasyCron`,
    });
  } catch (err: unknown) {
    console.error("Schedule Notification Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : JSON.stringify(err),
      },
      { status: 500 }
    );
  }
}
