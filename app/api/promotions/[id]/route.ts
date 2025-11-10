/* app/api/promotions/[id]/route.ts (Corrected) */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseAdmin"; // Use the secure admin client

// PUT handler to update an existing promotion
function parseId(id: string): number | null {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    return null; // Not a valid number
  }
  return parsedId;
}
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // == FIX #2: Get 'id' from 'context.params' and parse it ==
    const id = parseId(context.params.id);
    const { title, text, image_link } = await req.json();

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required." },
        { status: 400 }
      );
    }

    // == THIS IS THE FIX ==
    // We remove .single() and check the returned data array.
    const { data, error } = await supabase
      .from("promotions")
      .update({
        title,
        text,
        image_link,
      })
      .eq("id", id)
      .select(); // <-- .single() is removed

    if (error) {
      // This will catch database-level errors
      throw error;
    }

    // Check if the update actually found a row
    if (!data || data.length === 0) {
      // If data is empty, it means no row had that 'id'
      return NextResponse.json(
        { success: false, error: "Promotion not found." },
        { status: 404 }
      );
    }

    // Success! Return the updated row (it's the first item in the array)
    return NextResponse.json({ success: true, data: data[0] });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    // Add a log on the server for easier debugging
    console.error("Error in PUT /api/promotions/[id]:", errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a promotion
// (This was likely fine, but is included for completeness)
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // == FIX #2: Apply the ID parse fix here too ==
    const id = parseId(context.params.id);

    // We also use .select() here to check if the row existed
    const { data, error } = await supabase
      .from("promotions")
      .delete()
      .eq("id", id)
      .select(); // Check what was deleted

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: "Promotion not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Promotion deleted." });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error in DELETE /api/promotions/[id]:", errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
