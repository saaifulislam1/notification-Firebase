/* app/promotion/page.tsx (NEW FILE) */

"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/superbasePublic"; // Import our NEW CLIENT-SIDE supabase
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Define a type for our promotion object
type Promotion = {
  id: number;
  created_at: string;
  title: string;
  text: string;
  image_link: string;
};

export default function PromotionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  // This effect runs when the user object is available
  useEffect(() => {
    // If user is not logged in, do nothing
    if (!user) {
      router.replace("/");
      return;
    }

    const fetchPromotions = async () => {
      setLoading(true);

      // Step 1: Find all fcm_tokens for the current user
      const { data: tokenData, error: tokenError } = await supabase
        .from("fcm_tokens")
        .select("promotion_id")
        .eq("user_email", user.email);

      if (tokenError) {
        console.error("Error fetching tokens:", tokenError.message);
        toast.error("Could not load your promotions.");
        setLoading(false);
        return;
      }

      // Step 2: Get a unique list of promotion IDs from those tokens
      const promoIds = [
        ...new Set(
          tokenData
            .map((token) => token.promotion_id)
            .filter((id) => id !== null) // Filter out any null (empty) IDs
        ),
      ];

      // If no promotion IDs are linked, we're done.
      if (promoIds.length === 0) {
        setPromotions([]);
        setLoading(false);
        return;
      }

      // Step 3: Fetch the actual promotions from the 'promotions' table
      const { data: promoData, error: promoError } = await supabase
        .from("promotions")
        .select("*")
        .in("id", promoIds) // Get all promotions whose ID is in our list
        .order("created_at", { ascending: false });

      if (promoError) {
        console.error("Error fetching promotions:", promoError.message);
        toast.error("Could not load your promotions.");
      } else if (promoData) {
        setPromotions(promoData);
      }

      setLoading(false);
    };

    fetchPromotions();
  }, [user, router]); // Run when 'user' is loaded

  if (!user) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-gray-500">
        Authenticating...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
        Your Promotions
      </h1>

      <div className="bg-white shadow rounded-lg">
        {loading ? (
          <div className="p-6 text-gray-500 text-center">
            Loading your promotions...
          </div>
        ) : promotions.length === 0 ? (
          <div className="p-6 text-gray-500 text-center">
            You have no promotions assigned to your account.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {promotions.map((promo) => (
              <li key={promo.id} className="p-4 sm:p-6">
                {/* Optional Image */}
                {promo.image_link && (
                  <img
                    src={promo.image_link}
                    alt={promo.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  {promo.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{promo.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
