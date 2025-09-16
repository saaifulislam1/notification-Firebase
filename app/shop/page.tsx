"use client";

import { useAuth } from "@/lib/authContext";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { onMessageListener } from "@/lib/firebaseClient";

const products = [
  { id: "1", name: "Laptop", price: 1200 },
  { id: "2", name: "Phone", price: 800 },
  { id: "3", name: "Headphones", price: 200 },
];

export default function ShopPage() {
  const { user, login, logout, fcmToken } = useAuth();

  useEffect(() => {
    onMessageListener().then((payload: any) => {
      if (payload?.notification) {
        toast.success(
          `🔔 ${payload.notification.title}: ${payload.notification.body}`
        );
      }
    });
  }, []);

  async function handleOrder(product: { id: string; name: string }) {
    if (!user) return toast.error("Please log in first");
    if (!fcmToken) return toast.error("No FCM token");

    toast.success(`✅ Order placed for ${product.name}`);

    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        body: JSON.stringify({
          token: fcmToken,
          title: "Order Placed",
          body: `Your order for ${product.name} was successful!`,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Notification failed");
      }

      console.log("🔔 Notification sent:", data);
    } catch (err) {
      console.error("❌ Error sending notification:", err);
      toast.error("Failed to send notification");
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Shop</h1>

      {!user ? (
        <button
          onClick={() => login("Demo User")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Login as Demo User
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <span>👋 Welcome, {user.name}</span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      )}

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
