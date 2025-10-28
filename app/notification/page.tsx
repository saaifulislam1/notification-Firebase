/* app/notification/page.tsx (NEW FILE) */

"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/superbasePublic"; // Import our new CLIENT-SIDE supabase
import { useRouter } from "next/navigation";

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

export default function NotificationHistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If user is not logged in, redirect to home
    // if (!user) {
    //   router.replace("/");
    //   return;
    // }

    // Fetch notifications for the logged-in user
    const fetchNotifications = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_email", user!.email) // Only get notifications for this user
        .order("created_at", { ascending: false }); // Show newest first

      if (error) {
        console.error("Error fetching notifications:", error.message);
      } else if (data) {
        setNotifications(data);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, [user, router]);

  if (!user) {
    return <div className="p-6 text-center text-gray-500">Redirecting...</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
        🔔 Your Notifications
      </h1>

      <div className="bg-white shadow rounded-lg">
        {loading ? (
          <div className="p-6 text-gray-500 text-center">
            Loading history...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-gray-500 text-center">
            You have no notifications yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notif) => (
              <li key={notif.id} className="p-4 sm:p-6 hover:bg-gray-50">
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    {notif.title}
                  </h2>
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
