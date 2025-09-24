"use client";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function UsersPage() {
  const { user } = useAuth(); // assume user object has { email, name }
  const router = useRouter();
  // Redirect non-admins
  useEffect(() => {
    if (!user || user.email !== "admin@example.com") {
      router.replace("/"); // redirect to login or home
    }
  }, [user, router]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch users with FCM tokens
  useEffect(() => {
    fetch("/api/users-with-fcm")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUsers(data.users);
      })
      .catch((err) => console.error(err));
  }, []);

  const sendPromo = async (email: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/send-promo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          title: "Special Promo!",
          body: `Hi ${email} owner, Check out our latest offers!`,
        }),
      });

      const data = await res.json();

      if (data.success) alert("Notification sent!");
      else console.error(data.error);
    } catch (err) {
      alert("Failed to send notification");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
        📩 Users with FCM
      </h1>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {users.length === 0 ? (
          <div className="p-6 text-gray-500 text-center">
            No users available
          </div>
        ) : (
          <ul>
            {users.map((u) => (
              <li
                key={u.email}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 gap-3 hover:bg-gray-50 transition"
              >
                {/* User Info */}
                <div className="flex-1">
                  <p className="font-medium text-gray-900 break-words">
                    {u.name}
                  </p>
                  <p className="text-sm text-gray-500 break-words">{u.email}</p>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => sendPromo(u.email)}
                  disabled={loading}
                  className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg shadow-sm transition text-center"
                >
                  Send Promo
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
