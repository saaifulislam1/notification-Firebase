/* app/dashboard/page.tsx */

"use client";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

// A simple, reusable SVG spinner component
const LoadingSpinner = () => (
  <svg
    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

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

  // Create a ref to track if the component is mounted
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false; // Set to false when component unmounts
    };
  }, []); // Empty array means this runs once on mount and once on unmount

  // Redirect non-admins
  useEffect(() => {
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
          title: messageTitle, // Use state title
          body: body, // Use state body
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
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          📩 Users with FCM
        </h1>

        <button
          onClick={sendPromoToAll}
          disabled={allLoading || users.length === 0 || !!singleLoading}
          className="w-full sm:w-auto flex justify-center items-center bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          {allLoading && <LoadingSpinner />}
          {allLoading ? "Sending to All..." : "Send Promo to All"}
        </button>
      </div>

      {/* --- NEW: Notification Content Form --- */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Notification Content
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-extrabold text-black"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={allLoading || !!singleLoading}
            />
          </div>
          <div>
            <label
              htmlFor="body"
              className="block text-sm font-extrabold text-black"
            >
              Body
            </label>
            <textarea
              id="body"
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={allLoading || !!singleLoading}
            />
            <p className="mt-2 text-sm text-gray-500">
              Use{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-red-500 font-mono text-xs">
                {`{name}`}
              </code>{" "}
              as a placeholder for the users name.
            </p>
          </div>
        </div>
      </div>

      {/* --- Existing User List --- */}
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="px-4 py-3 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">User List</h2>
        </div>
        {users.length === 0 ? (
          <div className="p-6 text-gray-500 text-center">
            No users with active notifications found.
          </div>
        ) : (
          <ul>
            {users.map((u) => (
              <li
                key={u.email}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 gap-3 hover:bg-gray-50 transition"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 break-words truncate">
                    {u.name}
                  </p>
                  <p className="text-sm text-gray-500 break-words truncate">
                    {u.email}
                  </p>
                </div>
                <button
                  onClick={() => sendPromo(u.email, u.name)}
                  disabled={allLoading || !!singleLoading}
                  className="w-full sm:w-auto flex justify-center items-center bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg shadow-sm transition"
                  style={{ minWidth: "130px" }}
                >
                  {singleLoading === u.email && <LoadingSpinner />}
                  {singleLoading === u.email ? "Sending..." : "Send Promo"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
