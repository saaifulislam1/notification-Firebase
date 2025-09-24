import { NextResponse } from "next/server";
import { users } from "@/lib/auth";
import fs from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "fcmTokens.json");

export async function GET() {
  try {
    // Read saved FCM tokens from JSON file
    let fcmTokens: Record<string, string[]> = {};
    if (fs.existsSync(FILE_PATH)) {
      const data = fs.readFileSync(FILE_PATH, "utf-8");
      fcmTokens = JSON.parse(data);
    }

    // Filter users who have at least one token
    const usersWithToken = users.filter((u) => fcmTokens[u.email]?.length);

    return NextResponse.json({ success: true, users: usersWithToken });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}
