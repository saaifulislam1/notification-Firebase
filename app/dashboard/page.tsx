/* app/dashboard/page.tsx */

"use client";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import {
  Send,
  Users,
  Bell,
  Edit3,
  AlertCircle,
  List,
  Megaphone,
} from "lucide-react";
import toast from "react-hot-toast";
type Promotion = {
  id: number;
  title: string;
};
export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();

  // States
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  const [singleLoading, setSingleLoading] = useState<string | null>(null);
  const [allLoading, setAllLoading] = useState(false);

  // --- NEW: State for notification content ---
  const [title, setTitle] = useState("A Special Promo!");
  const [body, setBody] = useState(
    "Hi {name}, tap here to check out our latest offers!"
  );
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromoId, setSelectedPromoId] = useState<string>("");
  console.log(selectedPromoId, "selectedPromoId");
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false; // Set to false when component unmounts
    };
  }, []); // Empty array means this runs once on mount and once on unmount

  // Redirect non-admins
  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
    if (user && user.email !== "admin@example.com") {
      router.replace("/");
    }
  }, [user, router]);

  // Fetch users with FCM tokens
  useEffect(() => {
    if (user) {
      fetch("/api/users-with-fcm")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && isMounted.current) {
            setUsers(data.users);
          }
        })
        .catch((err) => console.error(err));

      const fetchPromotions = async () => {
        try {
          const res = await fetch("/api/promotions"); // Call the new API
          const data = await res.json();

          if (data.success && isMounted.current) {
            setPromotions(data.data);
          } else {
            toast.error(data.error || "Failed to fetch promotions.");
          }
        } catch (err) {
          toast.error("An error occurred fetching promotions.");
        }
      };
      fetchPromotions();
    }
  }, [user]);

  // --- UPDATED: Send promo to a single user ---
  const sendPromo = async (email: string, name: string) => {
    setSingleLoading(email);

    // Use title and body from state, replacing placeholder
    const messageTitle = title;
    const messageBody = body.replace("{name}", name);

    try {
      const res = await fetch("/api/send-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          title: messageTitle, // Use state title
          body: messageBody, // Use state body with name replaced
          selectedPromoId,
        }),
      });

      const data = await res.json();
      if (isMounted.current) {
        if (data.success) toast.success(`Notification sent to ${name}!`);
        else toast.error(`Failed to send to ${name}.`);
      }
    } catch (err) {
      if (isMounted.current) {
        toast.error("Failed to send notification");
      }
    }
    if (isMounted.current) {
      setSingleLoading(null);
    }
  };

  // --- UPDATED: Send promo to all users ---
  const sendPromoToAll = async () => {
    setAllLoading(true);

    // Use a generic fallback for {name} in case it's in the template
    const messageTitle = title;
    // const messageBody = body.replace("{name}", "there");

    try {
      const res = await fetch("/api/send-promo-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: messageTitle,
          body: body,
          selectedPromoId,
        }),
      });

      const data = await res.json();
      if (isMounted.current) {
        if (data.success) {
          toast.success(
            `Sent notifications to ${data.response.successCount} devices!`
          );
        } else {
          toast.error("Failed to send to all users.");
        }
      }
    } catch (err) {
      if (isMounted.current) {
        toast.error("Failed to send notification to all.");
      }
    }
    if (isMounted.current) {
      setAllLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-gray-500">
        Authenticating...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  FCM Users Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and send notifications to your users
                </p>
              </div>
            </div>

            <button
              onClick={sendPromoToAll}
              disabled={allLoading || users.length === 0 || !!singleLoading}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed font-semibold"
            >
              {allLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending to All...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Promo to All</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Notification Form Section */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                  <Edit3 className="w-6 h-6 text-blue-600" />
                  <span>Notification Content</span>
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter notification title..."
                    disabled={allLoading || !!singleLoading}
                  />
                </div>
                <div>
                  <label
                    htmlFor="body"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Message Body
                  </label>
                  <textarea
                    id="body"
                    rows={4}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your notification message..."
                    disabled={allLoading || !!singleLoading}
                  />
                  <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200 mb-3">
                    <p className="text-sm text-blue-800 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>
                        Pro tip: Use{" "}
                        <code className="bg-white px-2 py-1 rounded-md border border-blue-200 text-blue-600 font-mono text-sm">
                          {"{name}"}
                        </code>{" "}
                        as a placeholder for the users name
                      </span>
                    </p>
                  </div>
                  <div className="pt- space-y-0">
                    <label
                      htmlFor="promo-select"
                      className="block text-sm font-semibold text-gray-900 mb-2 flex items-center space-x-2"
                    >
                      <Megaphone className="w-5 h-5 text-green-600" />
                      <span>Select a Promotion (Optional)</span>
                    </label>
                    <select
                      id="promo-select"
                      value={selectedPromoId}
                      onChange={(e) => setSelectedPromoId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                      disabled={allLoading || !!singleLoading}
                    >
                      <option value="">
                        -- Send a custom text message below --
                      </option>
                      {promotions.map((promo) => (
                        <option key={promo.id} value={promo.id}>
                          {promo.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User List Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
              <List className="w-6 h-6 text-gray-700" />
              <span>User List</span>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {users.length} users
              </span>
            </h2>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Users Found
              </h3>
              <p className="text-gray-600 max-w-sm mx-auto">
                No users with active notifications are currently registered in
                the system.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {users.map((u) => (
                <div
                  key={u.email}
                  className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-6 hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="flex-1 min-w-0 mb-4 lg:mb-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {u.name
                            ? u.name.charAt(0).toUpperCase()
                            : u.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 truncate">
                          {u.name || "No Name"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {u.email}
                        </p>
                      </div>
                    </div>
                    {u.fcm_token && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active FCM
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => sendPromo(u.email, u.name)}
                    disabled={allLoading || !!singleLoading}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl shadow-sm transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed font-medium min-w-[140px]"
                  >
                    {singleLoading === u.email ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Promo</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
