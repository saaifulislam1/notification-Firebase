/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/lib/authContext";
import toast from "react-hot-toast";
import { onMessageListener } from "@/lib/firebaseClient";

const products = [
  { id: "1", name: "Laptop", price: 1200 },
  { id: "2", name: "Phone", price: 800 },
  { id: "3", name: "Headphones", price: 200 },
];

function ShopPageInner() {
  const { user, fcmToken, logout } = useAuth();

  useEffect(() => {
    onMessageListener()
      .then((payload: any) => {
        if (document.visibilityState === "visible" && payload?.notification) {
          toast.success(
            `🔔 ${payload.notification.title}: ${payload.notification.body}`
          );
        }
      })
      .catch((e) => {
        console.warn("onMessageListener setup failed:", e);
      });
  }, []);

  async function handleOrder(product: { id: string; name: string }) {
    if (!user) return toast.error("Please log in");
    if (!fcmToken)
      return toast.error("FCM token not available (check browser)");

    toast.success(`✅ Order placed for ${product.name}`);

    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: fcmToken,
          title: "Order Confirmed",
          body: `Dear ${user.name}, you have ordered ${product.name}`,
          delaySeconds: 3, // change delay here
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Server notify error:", data);
        toast.error("Failed to schedule notification");
      } else {
        console.log("Notification scheduled:", data);
      }
    } catch (err) {
      console.error("Notify request error:", err);
      toast.error("Failed to schedule notification");
    }
  }

  if (!user) return null;

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Shop</h1>
        <div className="flex items-center gap-4">
          <span>👋 {user.name}</span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{p.name}</h2>
            <p className="text-gray-600">${p.price}</p>
            <button
              onClick={() => handleOrder(p)}
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
            >
              Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ Single default export with AuthGuard wrapper
export default function ShopPage() {
  return (
    <AuthGuard>
      <ShopPageInner />
    </AuthGuard>
  );
}
