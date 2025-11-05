/* app/shop/page.tsx (Redesigned Professional Version) */
"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import toast from "react-hot-toast";
import { onMessageListener, requestForToken } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";

// Expanded product catalog
const products = [
  {
    id: "1",
    name: 'MacBook Pro 16"',
    price: 2499,
    category: "Laptops",
    image: "💻",
    description: "Powerful laptop for professionals",
    rating: 4.8,
  },
  {
    id: "2",
    name: "iPhone 15 Pro",
    price: 999,
    category: "Phones",
    image: "📱",
    description: "Latest flagship smartphone",
    rating: 4.7,
  },
  {
    id: "3",
    name: "Sony WH-1000XM5",
    price: 399,
    category: "Audio",
    image: "🎧",
    description: "Noise-cancelling headphones",
    rating: 4.6,
  },
  {
    id: "4",
    name: "iPad Air",
    price: 599,
    category: "Tablets",
    image: "📱",
    description: "Thin, light, and powerful",
    rating: 4.5,
  },
  {
    id: "5",
    name: "Apple Watch Series 9",
    price: 399,
    category: "Wearables",
    image: "⌚",
    description: "Advanced health monitoring",
    rating: 4.4,
  },
  {
    id: "6",
    name: "Samsung 4K Monitor",
    price: 499,
    category: "Monitors",
    image: "🖥️",
    description: 'Crystal-clear 32" display',
    rating: 4.3,
  },
  {
    id: "7",
    name: "Mechanical Keyboard",
    price: 129,
    category: "Accessories",
    image: "⌨️",
    description: "RGB mechanical switches",
    rating: 4.2,
  },
  {
    id: "8",
    name: "Wireless Mouse",
    price: 79,
    category: "Accessories",
    image: "🖱️",
    description: "Ergonomic design",
    rating: 4.1,
  },
  {
    id: "9",
    name: "External SSD 1TB",
    price: 149,
    category: "Storage",
    image: "💾",
    description: "High-speed portable storage",
    rating: 4.6,
  },
  {
    id: "10",
    name: "Gaming Headset",
    price: 199,
    category: "Audio",
    image: "🎮",
    description: "7.1 surround sound",
    rating: 4.3,
  },
  {
    id: "11",
    name: "USB-C Hub",
    price: 89,
    category: "Accessories",
    image: "🔌",
    description: "7-in-1 connectivity",
    rating: 4.0,
  },
  {
    id: "12",
    name: "Laptop Stand",
    price: 69,
    category: "Accessories",
    image: "💻",
    description: "Aluminum adjustable stand",
    rating: 4.4,
  },
];

const categories = [
  "All",
  "Laptops",
  "Phones",
  "Audio",
  "Tablets",
  "Wearables",
  "Monitors",
  "Accessories",
  "Storage",
];

const isAppleDevice = () =>
  typeof navigator !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

export default function ShopPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { user, fcmToken, logout } = useAuth();
  const [showIOSCard, setShowIOSCard] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsMounted(true);
    if (isAppleDevice()) {
      setShowIOSCard(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted && !user) {
      router.push("/");
    }
  }, [user, router, isMounted]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onMessageListener((payload) => {
      const { title, body } = payload.data || {};
      if (title && body) {
        toast.success(
          <div className="text-left">
            <b>{title}</b>
            <p>{body}</p>
          </div>
        );
      }
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const handleEnableNotifications = async () => {
    if (!user) return toast.error("Please log in first.");
    toast.loading("Requesting notification permission...");
    const token = await requestForToken();
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

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!isMounted || !user)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* iOS Notification Card */}
        {showIOSCard && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-sm">!</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Enable Notifications
                  </h3>
                </div>
                <p className="text-gray-600 mb-3">
                  To receive order notifications on your iPhone, please add this
                  app to your Home Screen and enable notifications.
                </p>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1 mb-4">
                  <li>Tap the Share icon in Safari</li>
                  <li>Scroll down and select Add to Home Screen</li>
                  <li>Open the app from your Home Screen</li>
                  <li>Enable notifications when prompted</li>
                </ol>
                <button
                  onClick={handleEnableNotifications}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Enable Notifications
                </button>
              </div>
              <button
                onClick={() => setShowIOSCard(false)}
                className="text-gray-400 hover:text-gray-600 ml-4"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {selectedCategory === "All" ? "All Products" : selectedCategory}
          </h2>
          <p className="text-gray-600 mb-6">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""} found
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center text-2xl">
                      {product.image}
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {product.rating} ★
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOrder(product)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
