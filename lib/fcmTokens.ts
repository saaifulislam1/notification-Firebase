//lib/fcmToken.ts
import fs from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "fcmTokens.json");

// Read current tokens
export function getFcmTokens(): Record<string, string[]> {
  if (!fs.existsSync(FILE_PATH)) return {};
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(data);
}

// Add/update a token
export function saveFcmToken(email: string, token: string) {
  const tokens = getFcmTokens();
  if (!tokens[email]) tokens[email] = [];
  if (!tokens[email].includes(token)) tokens[email].push(token);

  fs.writeFileSync(FILE_PATH, JSON.stringify(tokens, null, 2));
}
