// app/shop/page.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/authContext";
import toast from "react-hot-toast";
import { messaging, onMessageListener } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation"; // Use useRouter from next/navigation

const products = [
  { id: "1", name: "Laptop", price: 1200 },
  { id: "2", name: "Phone", price: 800 },
  { id: "3", name: "Headphones", price: 200 },
];

export default function ShopPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter(); // Using the correct useRouter from next/navigation
  const { user, fcmToken, logout } = useAuth();

  // Only set mounted state to true once the component is mounted in the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect to home page if no user
  useEffect(() => {
    if (isMounted && !user) {
      router.push("/"); // Redirect to home page if user is not found
    }
  }, [user, router, isMounted]);

  // Save FCM token when user is available

  // useEffect(() => {
  //   if (user && fcmToken) {
  //     fetch("/api/save-fcm-token", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email: user.email, token: fcmToken }),
  //     });
  //   }
  // }, [user, fcmToken]);

  const notifiedPayloads = useRef<Set<string>>(new Set());

  // Foreground notification listener (FCM)
  useEffect(() => {
    if (!messaging || !user) return;

    onMessageListener((payload) => {
      const { title, body } = payload.data || payload.notification || {};

      if (!title || !body) return;

      // Forward to SW to ensure system notification on mobile
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ title, body });
      } else {
        // fallback: show in-page notification
        new Notification(title, { body, icon: "/icons/icon-192.png" });
      }
    });
  }, [user]);

  // Order handling logic
  const handleOrder = (product: { id: string; name: string }) => {
    if (!user) return toast.error("Login first");
    if (!fcmToken) return toast.error("FCM token not ready");

    toast.success(
      `⏳ Order placed for ${product.name}, we will get back to you soon.`,
      { id: product.id }
    );

    setTimeout(async () => {
      try {
        await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: fcmToken,
            title: "Order Confirmed",
            body: `Dear ${user.name}, your order for ${product.name} has been confirmed.`,
            delaySeconds: 2,
          }),
        });
      } catch (err) {
        console.error("Notification scheduling failed:", err);
        toast.error("Notification scheduling failed", { id: product.id });
      }
    }, 5000); // 5 second delay for ordering confirmation
  };

  if (!isMounted) return null; // Wait until mounted before rendering
  if (!user) return <div>Loading...</div>; // Optionally show a loading state

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Shop</h1>
        <div className="flex items-center gap-4">
          <span>👋 {user.name}</span>
          <button
            onClick={() => {
              logout(); // Log out and redirect to home page
              router.push("/"); // Ensure redirect after logout
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold">{p.name}</h2>
            <p className="text-gray-600">${p.price}</p>
            <button
              onClick={() => handleOrder(p)}
              className="mt-3 w-full bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
