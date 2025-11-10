/* app/promotions-admin/page.tsx (NEW FILE) */

"use client";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/superbasePublic"; // 1. Import the PUBLIC client

// Define the Promotion type
type Promotion = {
  id: number;
  created_at: string;
  title: string;
  text: string | null;
  image_link: string | null;
};

type PromotionFormData = {
  title: string;
  text: string;
  image_link: string;
};

const newPromotionForm: PromotionFormData = {
  title: "",
  text: "",
  image_link: "",
};

export default function PromotionsAdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPromo, setCurrentPromo] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState<PromotionFormData>(newPromotionForm);

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Auth & Data Fetching
  useEffect(() => {
    if (user && user.email !== "admin@example.com") {
      router.replace("/");
    }
    if (user && user.email === "admin@example.com") {
      fetchPromotions();
    }
  }, [user, router]);

  // == UPDATED: This function now reads DIRECTLY from Supabase ==
  const fetchPromotions = async () => {
    setLoading(true);
    // This is safe because it's a READ operation with your public key
    const { data, error } = await supabase
      .from("promotions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message || "Failed to fetch promotions.");
    } else if (data && isMounted.current) {
      setPromotions(data);
    }
    if (isMounted.current) {
      setLoading(false);
    }
  };

  // Form & Modal Handlers
  const handleOpenModal = (promo: Promotion | null) => {
    if (promo) {
      setCurrentPromo(promo);
      setFormData({
        title: promo.title,
        text: promo.text || "",
        image_link: promo.image_link || "",
      });
    } else {
      setCurrentPromo(null);
      setFormData(newPromotionForm);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // == UNCHANGED: This function securely calls your API for WRITING ==
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = currentPromo
      ? `/api/promotions/${currentPromo.id}`
      : "/api/promotions";
    const method = currentPromo ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          currentPromo ? "Promotion updated!" : "Promotion created!"
        );
        fetchPromotions(); // Refresh the list
        handleCloseModal();
      } else {
        toast.error(data.error || "An error occurred.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    }

    if (isMounted.current) {
      setIsSubmitting(false);
    }
  };

  // == UNCHANGED: This function securely calls your API for DELETING ==
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this promotion?"))
      return;

    try {
      const res = await fetch(`/api/promotions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Promotion deleted!");
        fetchPromotions(); // Refresh list
      } else {
        toast.error(data.error || "Failed to delete.");
      }
    } catch (err) {
      toast.error("An error occurred.");
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
    <>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            📣 Manage Promotions
          </h1>
          <button
            onClick={() => handleOpenModal(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
          >
            + Create New
          </button>
        </div>

        <div className="bg-white shadow rounded-lg">
          {loading ? (
            <div className="p-6 text-gray-500 text-center">Loading...</div>
          ) : promotions.length === 0 ? (
            <div className="p-6 text-gray-500 text-center">
              No promotions created yet.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {promotions.map((promo) => (
                <li
                  key={promo.id}
                  className="p-4 sm:p-6 flex justify-between items-start"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {promo.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      {promo.text || "No description"}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex gap-2 ml-4">
                    <button
                      onClick={() => handleOpenModal(promo)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">
                  {currentPromo ? "Edit Promotion" : "Create New Promotion"}
                </h3>
                {/* ... (Your form fields: title, text, image_link, url_link) ... */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="text"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Text (Body)
                  </label>
                  <textarea
                    name="text"
                    id="text"
                    rows={3}
                    value={formData.text}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="image_link"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    name="image_link"
                    id="image_link"
                    value={formData.image_link}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    placeholder="https://example.com/image.png"
                  />
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
