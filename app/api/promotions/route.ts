/* app/api/promotions/route.ts */

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("promotions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase GET Error:", error); // FULL error
      return NextResponse.json(
        { success: false, error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/promotions Error:", error); // FULL error
    return NextResponse.json(
      { success: false, error: String(error) },
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

    const { data, error } = await supabase
      .from("promotions")
      .insert({ title, text, image_link })
      .select();

    if (error) {
      // PRINT the entire supabase error
      console.error("Supabase INSERT Error:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error, // Shows full supabase error in browser
        },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      throw new Error("Insert succeeded but no data returned.");
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (error) {
    console.error("POST /api/promotions Error:", error); // FULL error
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        details: error, // Send full error to browser
      },
      { status: 500 }
    );
  }
}
