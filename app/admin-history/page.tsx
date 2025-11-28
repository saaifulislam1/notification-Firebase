/* app/admin-history/page.tsx */

"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/superbasePublic";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ExternalLink, ImageIcon, FileText } from "lucide-react";

type Promotion = {
  id: number;
  title: string;
  image_link: string | null;
};

type Notification = {
  id: number;
  created_at: string;
  user_email: string;
  title: string;
  body: string;
  url: string;
  // We add the joined promotion data here
  promotions: Promotion | null;
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function AdminHistoryPage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/");
      return;
    }
    if (user && user.email !== "admin@example.com") {
      router.replace("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (user && user.email === "admin@example.com") {
      setLoading(true);
      const fetchAdminHistory = async () => {
        // MODIFIED QUERY: We join the promotions table
        const { data, error } = await supabase
          .from("notifications")
          .select(
            `
            *,
            promotions (
              id,
              title,
              image_link
            )
          `
          )
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching admin history:", error.message);
          toast.error("Failed to load history.");
        } else if (data) {
          // Force type cast because Supabase types are sometimes loose
          setNotifications(data as unknown as Notification[]);
        }
        setLoading(false);
      };
      fetchAdminHistory();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-gray-500">
        Authenticating...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          📤 Notification History
        </h1>
        <p className="text-gray-500 mt-1">
          Archive of all push notifications sent to users.
        </p>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading history...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-gray-500 text-center">
            No notifications have been sent yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className="p-6 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  {/* Left Side: Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        Push Notification
                      </span>
                      <span className="text-xs text-gray-400">
                        ID: #{notif.id}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 mt-1">
                      {notif.title}
                    </h2>

                    <p className="text-gray-600 mt-1 leading-relaxed text-sm">
                      {notif.body}
                    </p>

                    <div className="mt-3 flex items-center text-sm text-gray-500 bg-gray-100 inline-flex px-3 py-1 rounded-md">
                      <span className="mr-2">Sent to:</span>
                      <span className="font-semibold text-gray-800">
                        {notif.user_email}
                      </span>
                    </div>

                    {/* --- PROMOTION ATTACHMENT CARD --- */}
                    {notif.promotions && (
                      <div className="mt-4 flex items-start gap-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg max-w-md">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden border border-indigo-200">
                          {notif.promotions.image_link ? (
                            <img
                              src={notif.promotions.image_link}
                              alt="Promo"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}
                        </div>

                        {/* Promo Details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-0.5">
                            Linked Promotion
                          </p>
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {notif.promotions.title}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <FileText className="w-3 h-3 mr-1" />
                            <span>Promo ID: {notif.promotions.id}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Meta */}
                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    <p className="text-xs font-medium text-gray-400 whitespace-nowrap">
                      {formatTime(notif.created_at)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
