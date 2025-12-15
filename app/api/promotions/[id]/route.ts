/* app/api/promotions/[id]/route.ts (Fixed) */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseAdmin";

function parseId(id: string): number | null {
  const parsedId = parseInt(id, 10);
  return Number.isNaN(parsedId) ? null : parsedId;
}

// Accept both plain params and promised params (to satisfy Next's route typing)
type MaybePromise<T> = T | Promise<T>;
type RouteContext = { params: MaybePromise<{ id: string }> };

async function getIdFromContext(context: RouteContext): Promise<number | null> {
  const params = await context.params; // works for T and Promise<T>
  return parseId(params?.id ?? "");
}

// --- Handlers ---
async function putHandler(req: NextRequest, context: RouteContext) {
  try {
    const id = await getIdFromContext(context);
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

    const { data, error } = await supabase
      .from("promotions")
      .update({ title, text, image_link })
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

async function deleteHandler(req: NextRequest, context: RouteContext) {
  try {
    const id = await getIdFromContext(context);

    if (id === null) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format." },
        { status: 400 }
      );
    }

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

// Export handlers (keeps signatures hidden from the route module type)
export { putHandler as PUT, deleteHandler as DELETE };
