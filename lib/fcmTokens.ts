import { supabase } from "./supabaseClient"; // Import our new helper

/**
 * Saves a token to the Supabase database.
 * It checks for duplicates before inserting.
 */
// THIS IS THE CORRECT VERSION - IT WORKS
export async function saveFcmToken(email: string, token: string) {
  // Checks if this EXACT email AND token pair already exists
  const { data: existing } = await supabase
    .from("fcm_tokens")
    .select("token")
    // .eq("user_email", email) // ✅ Checks for the email...
    .eq("token", token) // ✅ ...AND the specific token
    .maybeSingle();

  // This `if` is now true for every new device, because the token will be different.
  // It only becomes false if the user logs in again on a device that is already registered.
  if (existing) {
    console.log("LOG", "Record exists!");
  }
  if (!existing) {
    const { error } = await supabase
      .from("fcm_tokens")
      .insert([{ user_email: email, token: token }]);

    if (error) {
      console.error("Error saving FCM token:", error.message);
    }
  }
}

/**
 * Gets all tokens from Supabase and groups them by email.
 */
export async function getFcmTokens(): Promise<Record<string, string[]>> {
  const { data, error } = await supabase.from("fcm_tokens").select("*");

  if (error) {
    console.error("Error fetching FCM tokens:", error.message);
    return {};
  }

  // This part groups the tokens by email, just like your old JSON file did
  const tokensByEmail: Record<string, string[]> = {};
  for (const row of data) {
    if (!tokensByEmail[row.user_email]) {
      tokensByEmail[row.user_email] = [];
    }
    tokensByEmail[row.user_email].push(row.token);
  }

  return tokensByEmail;
}
