import { createClient } from "@supabase/supabase-js";

// These lines read the keys from your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

// This creates the connection client we'll use everywhere else
export const supabase = createClient(supabaseUrl, supabaseKey);
