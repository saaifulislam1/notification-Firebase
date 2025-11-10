/* app/api/promotions/route.ts (NEW FILE) */

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseAdmin"; // Use the secure admin client

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("promotions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    // == ADDED LOGGING ==
    console.error("GET /api/promotions Error:", errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// POST handler to create a new promotion
export async function POST(req: Request) {
  try {
    const { title, text, image_link } = await req.json();

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required." },
        { status: 400 }
      );
    }

    // == THIS IS THE FIX ==
    // We remove .single() and check the data array, just like we did for PUT.
    const { data, error } = await supabase
      .from("promotions")
      .insert({
        title,
        text,
        image_link,
      })
      .select(); // <-- .single() is removed

    if (error) {
      // This will catch DB-level errors (like RLS)
      throw "something wenttttt";
    }

    // Check if the insert actually returned the new row
    if (!data || data.length === 0) {
      throw new Error("Failed to create promotion, no data returned.");
    }

    // Success! Return the new object.
    return NextResponse.json({ success: true, data: data[0] });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    // == ADDED LOGGING ==
    // This will print the *real* error to your terminal.
    console.error("POST /api/promotions Error:", errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
