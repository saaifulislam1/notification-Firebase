/* app/notification/page.tsx (SIMPLIFIED & COLORFUL) */

"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/superbasePublic";
import { useRouter } from "next/navigation";
import { Bell, Calendar } from "lucide-react";

type Notification = {
  id: number;
  created_at: string;
  user_email: string;
  title: string;
  body: string;
  url: string;
};

// Color schemes for different notification cards
const colorSchemes = [
  {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100",
    border: "border-blue-200",
    accent: "text-blue-600",
  },
];

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return `${Math.floor(diffInHours * 60)}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
};

export default function NotificationHistoryPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_email", user!.email)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error.message);
      } else if (data) {
        setNotifications(data);
      }
      setLoading(false);
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl shadow-lg">
              <Bell className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Your Notifications
          </h1>
        </div>

        {/* Notifications Grid */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white rounded-3xl shadow-lg border p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">
                Loading your notifications...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg border p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No notifications yet
              </h3>
            </div>
          ) : (
            <div className="grid gap-6">
              {notifications.map((notif, index) => {
                const colors = colorSchemes[index % colorSchemes.length];
                return (
                  <NotificationCard
                    key={notif.id}
                    notification={notif}
                    colors={colors}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationCard({
  notification,
  colors,
}: {
  notification: Notification;
  colors: { bg: string; border: string; accent: string };
}) {
  const handleClick = () => {
    if (notification.url) {
      window.open(notification.url, "_blank");
    }
  };

  return (
    <div
      className={`${colors.bg} border-2 ${colors.border} rounded-3xl shadow-lg p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`text-2xl font-bold ${colors.accent} mb-3`}>
            {notification.title}
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            {notification.body}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className={`h-5 w-5 ${colors.accent}`} />
            <span className="text-gray-600 font-medium">
              {new Date(notification.created_at).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
        <span className={`text-lg font-semibold ${colors.accent}`}>
          {formatTime(notification.created_at)}
        </span>
      </div>
    </div>
  );
}
