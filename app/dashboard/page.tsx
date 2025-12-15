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
  Plus,
  Image as ImageIcon,
  Type,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

type Promotion = {
  id: number;
  title: string;
  text?: string;
  image_link?: string;
};

export default function UsersPage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  const [singleLoading, setSingleLoading] = useState<string | null>(null);
  const [allLoading, setAllLoading] = useState(false);

  // --- Notification content state ---
  const [title, setTitle] = useState("A Special Promo!");
  const [body, setBody] = useState(
    "Hi {name}, tap here to check out our latest offers!"
  );

  // --- Promotions State ---
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromoId, setSelectedPromoId] = useState<string>("");

  // --- NEW: Create Promotion State ---
  const [promoMode, setPromoMode] = useState<"select" | "create">("select");
  const [isCreatingPromo, setIsCreatingPromo] = useState(false);
  const [newPromoData, setNewPromoData] = useState({
    title: "",
    text: "",
    image_link: "",
  });

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Redirect non-admins
  useEffect(() => {
    // If auth is still loading, DO NOT do anything yet.
    if (authLoading) return;

    if (!user) {
      router.replace("/");
      return;
    }
    if (user && user.email !== "admin@example.com") {
      router.replace("/");
    }
  }, [user, router]);

  // Fetch users and promotions

  useEffect(() => {
    if (user) {
      // Fetch Users
      fetch("/api/users-with-fcm")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && isMounted.current) {
            setUsers(data.users);
          }
        })
        .catch((err) => console.error(err));

      // Fetch Promotions (FIXED LOGIC)
      const fetchPromotions = async () => {
        try {
          const res = await fetch("/api/promotions");
          const data = await res.json();

          // 1. Check if API failed logically
          if (!data.success) {
            if (isMounted.current) {
              toast.error(data.error || "Failed to fetch promotions.");
            }
            return;
          }

          // 2. If success, only update state if mounted
          if (isMounted.current) {
            setPromotions(data.data);
          }
        } catch (err) {
          if (isMounted.current) {
            toast.error("An error occurred fetching promotions.");
          }
        }
      };
      fetchPromotions();
    }
  }, [user]);

  // --- NEW: Handle Create Promotion ---
  const handleCreatePromotion = async () => {
    if (!newPromoData.title) {
      toast.error("Promotion title is required");
      return;
    }

    setIsCreatingPromo(true);
    try {
      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPromoData),
      });
      const data = await res.json();

      if (data.success && isMounted.current) {
        const newPromo = data.data;

        // 1. Add new promo to list
        setPromotions([newPromo, ...promotions]);
        // 2. Select the new promo
        setSelectedPromoId(newPromo.id.toString());
        // 3. Reset form
        setNewPromoData({ title: "", text: "", image_link: "" });
        // 4. Switch back to select mode
        setPromoMode("select");

        toast.success("Promotion created and selected!");
      } else {
        toast.error(data.error || "Failed to create promotion");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating promotion");
    } finally {
      if (isMounted.current) setIsCreatingPromo(false);
    }
  };

  // Send promo to a single user
  const sendPromo = async (email: string, name: string) => {
    setSingleLoading(email);

    const messageTitle = title;
    const messageBody = body.replace("{name}", name);

    try {
      const res = await fetch("/api/send-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          title: messageTitle,
          body: messageBody,
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

  // Send promo to all users
  const sendPromoToAll = async () => {
    setAllLoading(true);

    try {
      const res = await fetch("/api/send-promo-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg flex-shrink-0">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  FCM Dashboard
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Manage and send notifications
                </p>
              </div>
            </div>

            {/* Send All Button - Full width on mobile */}
            <button
              onClick={sendPromoToAll}
              disabled={allLoading || users.length === 0 || !!singleLoading}
              className="w-full lg:w-auto flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed font-semibold"
            >
              {allLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Notification Form Section */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center space-x-3">
                  <Edit3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <span>Notification Content</span>
                </h2>
              </div>
              <div className="p-4 sm:p-6 space-y-6">
                {/* Notification Title & Body */}
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Notification Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                      placeholder="Enter notification title..."
                      disabled={allLoading || !!singleLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="body"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Notification Body
                    </label>
                    <textarea
                      id="body"
                      rows={3}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm resize-none"
                      placeholder="Enter your notification message..."
                      disabled={allLoading || !!singleLoading}
                    />
                    <div className="mt-2 flex items-start sm:items-center space-x-2 text-xs text-blue-600">
                      <AlertCircle className="w-3 h-3 mt-0.5 sm:mt-0 flex-shrink-0" />
                      <span>
                        Use <code>{"{name}"}</code> for the users name
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* --- PROMOTION SECTION --- */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                    <label className="block text-sm font-semibold text-gray-900 flex items-center space-x-2">
                      <Megaphone className="w-5 h-5 text-green-600" />
                      <span>Promotion Data</span>
                    </label>

                    {/* Toggle Switch - Full width on mobile */}
                    <div className="flex bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
                      <button
                        onClick={() => setPromoMode("select")}
                        className={`flex-1 sm:flex-none px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                          promoMode === "select"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Select Existing
                      </button>
                      <button
                        onClick={() => setPromoMode("create")}
                        className={`flex-1 sm:flex-none px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                          promoMode === "create"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Create New
                      </button>
                    </div>
                  </div>

                  {promoMode === "select" ? (
                    // SELECT MODE
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                      <select
                        id="promo-select"
                        value={selectedPromoId}
                        onChange={(e) => setSelectedPromoId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                        disabled={allLoading || !!singleLoading}
                      >
                        <option value="">-- No Promotion Linked --</option>
                        {promotions.map((promo) => (
                          <option key={promo.id} value={promo.id}>
                            {promo.title}
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-xs text-gray-500">
                        This links a database record to your notification so the
                        app can show full details when opened.
                      </p>
                    </div>
                  ) : (
                    // CREATE MODE
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Type className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              placeholder="Promo Title (Required)"
                              value={newPromoData.title}
                              onChange={(e) =>
                                setNewPromoData({
                                  ...newPromoData,
                                  title: e.target.value,
                                })
                              }
                              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none">
                              <FileText className="h-4 w-4 text-gray-400" />
                            </div>
                            <textarea
                              placeholder="Promo Full Text (Optional)"
                              rows={2}
                              value={newPromoData.text}
                              onChange={(e) =>
                                setNewPromoData({
                                  ...newPromoData,
                                  text: e.target.value,
                                })
                              }
                              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                            />
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <ImageIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              placeholder="Image Link URL (Optional)"
                              value={newPromoData.image_link}
                              onChange={(e) =>
                                setNewPromoData({
                                  ...newPromoData,
                                  image_link: e.target.value,
                                })
                              }
                              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleCreatePromotion}
                        disabled={isCreatingPromo || !newPromoData.title}
                        className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        {isCreatingPromo ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Create & Select Promotion</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User List Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center space-x-3">
              <List className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              <span>User List</span>
            </h2>
            <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-3 py-1 rounded-full">
              {users.length} users
            </span>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Users Found
              </h3>
              <p className="text-gray-600 max-w-sm mx-auto text-sm sm:text-base">
                No users with active notifications are currently registered in
                the system.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {users.map((u) => (
                <div
                  key={u.email}
                  // Mobile: Column layout, Desktop: Row layout
                  className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 sm:p-6 hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="flex-1 min-w-0 mb-4 lg:mb-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {u.name
                            ? u.name.charAt(0).toUpperCase()
                            : u.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {u.name || "No Name"}
                        </p>
                        <p className="text-sm text-gray-500 truncate block">
                          {u.email}
                        </p>
                      </div>
                    </div>
                    {u.fcm_token && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-12 sm:ml-12 lg:ml-0">
                        Active FCM
                      </span>
                    )}
                  </div>

                  {/* Full width button on mobile */}
                  <button
                    onClick={() => sendPromo(u.email, u.name)}
                    disabled={allLoading || !!singleLoading}
                    className="w-full lg:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl shadow-sm transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed font-medium min-w-[140px]"
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
