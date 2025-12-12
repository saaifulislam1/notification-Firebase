/* app/notification/page.tsx  */

"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/superbasePublic";
import { useRouter } from "next/navigation";

import { Loader2, Bell } from "lucide-react";
import toast from "react-hot-toast";

// This type describes the data we get from our JOIN query
type NotificationItem = {
  id: number;
  created_at: string;
  title: string; // The plain text PUSH title
  body: string; // The plain text PUSH body
  url: string; // The URL from the push
  promotion_id: number | null; // The "link"

  // This 'promotions' object will be null if it was a plain text message
  promotions: {
    image_link: string | null;
    title: string; // The "real" promo title
    text: string | null; // The "real" promo body (can be null)
    url_link: string | null; // The "real" promo URL
  } | null;
};

// Helper function to format the time
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const FALLBACK_IMAGE = "/placeholder.png";

export default function NotificationPage() {
  // 1. Get the authLoading state (from authContext) to fix redirect bug
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = FALLBACK_IMAGE;
  };

  // Auth check and data fetching
  useEffect(() => {
    // 2. Wait until auth is no longer loading
    if (authLoading) return;

    // 3. Auth is done. If no user, redirect them.
    if (!user) {
      router.replace("/");
      return;
    }

    // 4. User is logged in AND auth is ready, so fetch their inbox
    const fetchInbox = async () => {
      setLoading(true);

      // This is the "smart" query that joins the tables.
      // This query will now work because you ran the ALTER TABLE command.
      const { data, error } = await supabase
        .from("notifications")
        .select(
          `
          id,
          created_at,
          title,
          body,
          url,
          promotion_id,
          promotions (
            title,
            text,
            image_link,
            url_link
          )
        `
        )
        .eq("user_email", user.email)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching inbox:", error.message);
        toast.error("Failed to load notifications.");
      } else if (data) {
        // == DATA FILTERING LOGIC START ==
        const typedData = data as unknown as NotificationItem[];

        const uniqueItems: NotificationItem[] = [];
        const seenPromoIds = new Set<number>();

        // Loop through data. Since it is ordered by newest first,
        // we keep the first occurrence of a promotion_id and skip the rest.
        for (const item of typedData) {
          if (item.promotion_id) {
            // If we haven't seen this promo ID yet, add it to the list
            if (!seenPromoIds.has(item.promotion_id)) {
              seenPromoIds.add(item.promotion_id);
              uniqueItems.push(item);
            }
            // If we HAVE seen it, we do nothing (skipping the duplicate)
          } else {
            // Always include notifications that are NOT promotions (plain text)
            uniqueItems.push(item);
          }
        }

        setItems(uniqueItems);
        // == DATA FILTERING LOGIC END ==
      }
      setLoading(false);
    };

    fetchInbox();
  }, [user, authLoading, router]); // Run when user or authLoading changes

  // 5. Show a single loading state while auth is checking
  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // 6. Auth is done, user is loaded. Now we can render the page.
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-12 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl shadow-slate-200/70 backdrop-blur">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
            Inbox
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            See marketing pushes, product announcements, and alerts tailored for{" "}
            <span className="font-medium text-slate-800">{user.email}</span>.
          </p>
        </div>

        <div className="rounded-[32px] border border-white/80 bg-white/95 shadow-[0_30px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          {loading ? (
            <div className="flex flex-col items-center gap-4 p-12 text-slate-500">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              <p>Fetching your latest messages…</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 p-12 text-center text-slate-500">
              <div className="rounded-full bg-blue-50 p-4">
                <Bell className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-lg font-semibold text-slate-800">
                Nothing new yet
              </p>
              <p className="text-sm">
                We&apos;ll let you know the moment a new notification arrives.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {items.map((item) => {
                // == THIS IS THE SMART LOGIC ==
                // Check if this item is a "Rich Promotion" or just text
                const isRichPromo = Boolean(
                  item.promotion_id && item.promotions
                );

                // If it's a rich promo, use its content.
                // If not, fall back to the plain text from the push.
                const displayTitle = isRichPromo
                  ? item.promotions?.title ?? item.title
                  : item.title;
                const displayBody = isRichPromo
                  ? item.promotions?.text ?? item.body
                  : item.body;
                const shouldRenderImage = Boolean(isRichPromo);
                const displayImage = shouldRenderImage
                  ? item.promotions?.image_link ?? FALLBACK_IMAGE
                  : null;

                return (
                  <li
                    key={item.id}
                    className="group relative p-6 transition hover:bg-slate-50/70 sm:p-8"
                  >
                    <div className="flex flex-col gap-6 sm:flex-row">
                      {shouldRenderImage && (
                        <div className="flex-shrink-0">
                          <div className="h-24 w-24 overflow-hidden rounded-3xl border border-slate-100 bg-slate-100 shadow-inner sm:h-28 sm:w-28">
                            <img
                              src={displayImage || "/placeholder.png"}
                              alt={displayTitle || "Promotion artwork"}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                              onError={handleImageError}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <h2 className="text-xl font-semibold text-slate-900">
                            {displayTitle}
                          </h2>
                          <p className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {formatTime(item.created_at)}
                          </p>
                        </div>
                        {/* Use whitespace-pre-wrap to respect newlines in the text */}
                        <p className="text-base leading-relaxed text-slate-600 whitespace-pre-wrap">
                          {displayBody}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
