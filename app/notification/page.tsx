/* app/notification/page.tsx (Full, Corrected Code) */

"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/superbasePublic"; // Your public client
import { useRouter } from "next/navigation";

import { Loader2, Bell } from "lucide-react"; // Icons for loading/empty
import toast from "react-hot-toast"; // For error notifications

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

export default function NotificationPage() {
  // 1. Get the authLoading state (from authContext) to fix redirect bug
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

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
        // == THIS IS THE FIX ==
        // We use a double-cast (as unknown) to force TypeScript
        // to accept our 'NotificationItem' type.
        setItems(data as unknown as NotificationItem[]);
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
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
        🔔 Your Inbox
      </h1>

      <div className="bg-white shadow rounded-lg">
        {loading ? (
          <div className="p-6 text-gray-500 text-center">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-6 text-gray-500 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p>You have no notifications yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {items.map((item) => {
              // == THIS IS THE SMART LOGIC ==
              // Check if this item is a "Rich Promotion" or just text
              const isRichPromo = item.promotion_id && item.promotions;

              // If it's a rich promo, use its content.
              // If not, fall back to the plain text from the push.
              const displayTitle = isRichPromo
                ? item.promotions?.title
                : item.title;
              const displayBody = isRichPromo
                ? item.promotions?.text
                : item.body;
              const displayImage = isRichPromo
                ? item.promotions?.image_link
                : null;
              const displayUrl = isRichPromo
                ? item.promotions?.url_link
                : item.url;

              return (
                <li key={item.id} className="p-4 sm:p-6 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    {/* Render Image if it's a rich promotion */}
                    {displayImage && (
                      <div className="flex-shrink-0">
                        <img
                          src={displayImage}
                          alt={displayTitle}
                          className="rounded-lg object-cover w-20 h-20 border"
                        />
                      </div>
                    )}

                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                          {displayTitle}
                        </h2>
                        <p className="text-xs text-gray-500 whitespace-nowrap pl-4 pt-1">
                          {formatTime(item.created_at)}
                        </p>
                      </div>
                      {/* Use whitespace-pre-wrap to respect newlines in the text */}
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
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
  );
}
