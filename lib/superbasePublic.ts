/* lib/supabaseClient.ts (NEW FILE) */

import { createClient } from "@supabase/supabase-js";

// These keys are safe to be exposed in the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This is your PUBLIC, client-side client with limited rights.
// It only needs the URL and the ANON key.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
