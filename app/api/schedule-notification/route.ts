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

    // EasyCron free plan only accepts minutes, so convert seconds to minutes
    const delayMinutes = Math.max(1, Math.ceil(delaySeconds / 60));

    const easyCronUrl = `https://www.easycron.com/rest/schedule?token=${
      process.env.EASYCRON_API_TOKEN
    }&url=${encodeURIComponent(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/send-scheduled`
    )}&run_every=${delayMinutes}&method=POST&body=${encodeURIComponent(
      JSON.stringify({ token, title, body })
    )}`;

    console.log("EasyCron URL:", easyCronUrl);

    // Call EasyCron
    const res = await fetch(easyCronUrl);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("EasyCron response not JSON:", text);
      return NextResponse.json(
        {
          success: false,
          error: "EasyCron scheduling failed: invalid response",
        },
        { status: 500 }
      );
    }

    if (!data.success) {
      console.error("EasyCron scheduling error:", data);
      return NextResponse.json(
        { success: false, error: "EasyCron scheduling failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Notification scheduled in ~${delayMinutes} minute(s) via EasyCron`,
      easyCronData: data,
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
