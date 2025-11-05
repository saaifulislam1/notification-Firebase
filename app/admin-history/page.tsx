/* app/admin-history/page.tsx (NEW FILE) */

"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/superbasePublic"; // Using your public client
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Define a type for our notification object
type Notification = {
  id: number;
  created_at: string;
  user_email: string;
  title: string;
  body: string;
  url: string;
};

// Helper function to format the time
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function AdminHistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Client-side route protection for admins
  useEffect(() => {
    if (user && user.email !== "admin@example.com") {
      router.replace("/");
    }
  }, [user, router]);

  // 2. Fetch all notifications from the database
  useEffect(() => {
    // Only fetch if we've confirmed the user is an admin
    if (user && user.email === "admin@example.com") {
      setLoading(true);

      const fetchAdminHistory = async () => {
        const { data, error } = await supabase
          .from("notifications")
          .select("*") // Get all notifications
          .order("created_at", { ascending: false }); // Show newest first

        if (error) {
          console.error("Error fetching admin history:", error.message);
          toast.error("Failed to load history.");
        } else if (data) {
          setNotifications(data);
        }
        setLoading(false);
      };

      fetchAdminHistory();
    }
  }, [user]); // Run this effect when the user object is available

  // Show a loading/auth state while we wait
  if (!user) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-gray-500">
        Authenticating...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
        📤 Sent Notification History
      </h1>

      <div className="bg-white shadow rounded-lg">
        {loading ? (
          <div className="p-6 text-gray-500 text-center">
            Loading history...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-gray-500 text-center">
            No notifications have been sent yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notif) => (
              <li key={notif.id} className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                      {notif.title}
                    </h2>
                    {/* Show which user this was sent to */}
                    <p className="text-sm text-gray-500">
                      Sent to:{" "}
                      <span className="font-medium text-gray-700">
                        {notif.user_email}
                      </span>
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 whitespace-nowrap pl-4">
                    {formatTime(notif.created_at)}
                  </p>
                </div>
                <p className="text-sm text-gray-600">{notif.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
