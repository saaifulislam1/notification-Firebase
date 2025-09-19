import { NextResponse } from "next/server";
import { firebaseAdmin } from "@/lib/firebaseAdmin";
import fs from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "fcmTokens.json");

export async function POST(req: Request) {
  try {
    const { email, title, body } = await req.json();

    // Read FCM tokens from JSON file
    let fcmTokens: Record<string, string[]> = {};
    if (fs.existsSync(FILE_PATH)) {
      const data = fs.readFileSync(FILE_PATH, "utf-8");
      fcmTokens = JSON.parse(data);
    }

    const tokens = fcmTokens[email];
    if (!tokens || !tokens.length) {
      return NextResponse.json({ success: false, error: "No FCM token found" });
    }

    // Deduplicate tokens
    const uniqueTokens = [...new Set(tokens)];

    // Send push notification with data payload only
    const response = await firebaseAdmin.messaging().sendEachForMulticast({
      tokens: uniqueTokens,
      data: { title, body }, // 👈 send as data only
    });

    return NextResponse.json({ success: true, response });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}
