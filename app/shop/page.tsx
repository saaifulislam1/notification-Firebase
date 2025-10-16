/* app/shop/page.tsx (Corrected Version) */

"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import toast from "react-hot-toast";
import { onMessageListener, requestForToken } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";

const products = [
  { id: "1", name: "Laptop", price: 1200 },
  { id: "2", name: "Phone", price: 800 },
  { id: "3", name: "Headphones", price: 200 },
];

// == NEW HELPER FUNCTION ==
// This helps us detect if we need to show the special instructions for Apple users.
const isAppleDevice = () =>
  typeof navigator !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

export default function ShopPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { user, fcmToken, logout } = useAuth();
  const [showIOSCard, setShowIOSCard] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if we should show the iOS instructions card
    if (isAppleDevice()) {
      setShowIOSCard(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted && !user) {
      router.push("/");
    }
  }, [user, router, isMounted]);

  // CORRECTED: Foreground notification listener with cleanup
  useEffect(() => {
    if (!user) return;

    // onMessageListener returns an "unsubscribe" function
    const unsubscribe = onMessageListener((payload) => {
      const { title, body } = payload.data || {};
      if (title && body) {
        // Using a toast is a great way to show in-app notifications
        toast.success(
          <div className="text-left">
            <b>{title}</b>
            <p>{body}</p>
          </div>
        );
      }
    });

    // This cleanup function is called when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  // == NEW FUNCTION ==
  // This is called by the new button to handle the permission request on iOS
  const handleEnableNotifications = async () => {
    if (!user) return toast.error("Please log in first.");

    toast.loading("Requesting notification permission...");
    const token = await requestForToken(); // Your existing Firebase client function
    toast.dismiss();

    if (token) {
      try {
        await fetch("/api/save-fcm-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, token }),
        });
        toast.success("Notifications have been enabled!");
      } catch (error) {
        toast.error("Could not save your notification settings.");
      }
    } else {
      toast.error(
        "Permission was not granted. You may need to enable it in your device settings."
      );
    }
  };

  // Your handleOrder logic is correct and remains the same
  const handleOrder = (product: {
    id: string;
    name: string;
    price?: number;
  }) => {
    if (!user) return toast.error("Login first");
    if (!fcmToken)
      return toast.error(
        "FCM token not ready, please wait or enable notifications."
      );

    toast.success(`⏳ Placing order for ${product.name}...`, {
      id: product.id,
    });

    setTimeout(async () => {
      try {
        await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            title: "Order Confirmed",
            body: `Dear ${user.name}, your order for ${product.name} has been confirmed.`,
          }),
        });
      } catch (err) {
        console.error("Notification scheduling failed:", err);
        toast.error("Notification scheduling failed", { id: product.id });
      }
    }, 2000);
  };

  if (!isMounted || !user) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Shop</h1>
        <div className="flex items-center gap-4">
          <span>👋 {user.name}</span>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* == NEW UI FOR IOS USERS == */}
      {showIOSCard && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md shadow-md">
          <p className="font-bold">Enable Notifications on your iPhone</p>
          <p className="text-sm">
            To receive notifications, please add this app to your Home Screen:
          </p>
          <ol className="list-decimal list-inside text-sm mt-2">
            <li>Tap the Share icon in Safari.</li>
            <li>Scroll down and select Add to Home Screen.</li>
            <li>Open the app from your Home Screen.</li>
          </ol>
          <button
            onClick={handleEnableNotifications}
            className="mt-3 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
          >
            Enable Notifications
          </button>
        </div>
      )}
      {/* ========================== */}

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
