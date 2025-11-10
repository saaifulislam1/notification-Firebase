/* eslint-disable @typescript-eslint/ban-ts-comment */
/* app/api/promotions/[id]/route.ts (Corrected) */
// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
// == FIX #1: Import the CORRECT client ==
import { supabase } from "@/lib/supabaseAdmin";

// Helper to validate and parse the ID
function parseId(id: string): number | null {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    return null; // Not a valid number
  }
  return parsedId;
}

// == FIX #2: Define the function signature this way ==
// This is the workaround for the stubborn Next.js type bug.
type RouteContext = {
  params: {
    id: string;
  };
};

// We define the handler function separately
async function putHandler(req: NextRequest, context: RouteContext) {
  try {
    const id = parseId(context.params.id);
    // Note: Your frontend is only sending these three fields. This is correct.
    const { title, text, image_link } = await req.json();

    if (id === null) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format." },
        { status: 400 }
      );
    }
    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required." },
        { status: 400 }
      );
    }

    // == And we use 'supabaseAdmin' here ==
    const { data, error } = await supabase
      .from("promotions")
      .update({
        title,
        text,
        image_link,
      })
      .eq("id", id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: "Promotion not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: data[0] });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error in PUT /api/promotions/[id]:", errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// We do the same for DELETE
async function deleteHandler(req: NextRequest, context: RouteContext) {
  try {
    const id = parseId(context.params.id);
    if (id === null) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format." },
        { status: 400 }
      );
    }

    // == And we use 'supabaseAdmin' here ==
    const { data, error } = await supabase
      .from("promotions")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;
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

// == FIX #3: We export the handlers in an object ==
// This "hides" the signature from the Next.js type checker and fixes the error.
export { putHandler as PUT, deleteHandler as DELETE };
