"use client";
import React, { useEffect, useState } from "react";

export default function UsersPage() {
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
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Users with FCM</h1>
      <ul>
        {users.map((u) => (
          <li key={u.email} className="mb-2 flex justify-between items-center">
            <span>
              {u.name} ({u.email})
            </span>
            <button
              onClick={() => sendPromo(u.email)}
              disabled={loading}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Send Promo
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
