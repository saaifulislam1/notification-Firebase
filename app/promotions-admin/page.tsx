/* app/promotions-admin/page.tsx (REDESIGNED) */

"use client";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Edit3,
  Trash2,
  Megaphone,
  Type,
  FileText,
  Loader2,
  Camera,
  X,
} from "lucide-react";

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
  const { user, authLoading } = useAuth();
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
    if (authLoading) return;

    if (!user) {
      router.replace("/");
      return;
    }
    if (user && user.email !== "admin@example.com") {
      router.replace("/shop");
    }
    if (user && user.email === "admin@example.com") {
      fetchPromotions();
    }
  }, [user, router]);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/promotions", {
        method: "GET",
        cache: "no-store", // Ensure we don't get cached stale data
      });
      const data = await res.json();

      if (data.success && isMounted.current) {
        setPromotions(data.data);
      } else if (!data.success && isMounted.current) {
        toast.error("Failed to load promotions.");
      }
    } catch (err) {
      console.error(err);
      if (isMounted.current) toast.error("Network error fetching promotions.");
    } finally {
      if (isMounted.current) setLoading(false);
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
        fetchPromotions();
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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this promotion?"))
      return;

    try {
      const res = await fetch(`/api/promotions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Promotion deleted!");
        fetchPromotions();
      } else {
        toast.error(data.error || "Failed to delete.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                <Megaphone className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Promotions Manager
                </h1>
                <p className="text-gray-600 mt-1">
                  Create and manage your marketing promotions
                </p>
              </div>
            </div>

            <button
              onClick={() => handleOpenModal(null)}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Create New</span>
            </button>
          </div>
        </div>

        {/* Promotions Grid */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
              <FileText className="w-6 h-6 text-gray-700" />
              <span>All Promotions</span>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {promotions.length} promotions
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading promotions...</p>
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Megaphone className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Promotions Yet
              </h3>
              <p className="text-gray-600 max-w-sm mx-auto">
                Get started by creating your first promotion to engage with your
                audience.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex flex-col h-full">
                    {promo.image_link && (
                      <div className="mb-4 rounded-xl overflow-hidden bg-gray-100 aspect-video flex items-center justify-center">
                        <img
                          alt="Promotion image"
                          src={promo.image_link}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                        {promo.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {promo.text || "No description provided"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {new Date(promo.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenModal(promo)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blend-saturation bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                <Megaphone className="w-6 h-6 text-purple-600" />
                <span>
                  {currentPromo ? "Edit Promotion" : "Create New Promotion"}
                </span>
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6 overflow-y-auto"
            >
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2"
                >
                  <Type className="w-4 h-4 text-blue-600" />
                  <span>Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                  placeholder="Enter promotion title..."
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="text"
                  className="block text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4 text-green-600" />
                  <span>Description</span>
                </label>
                <textarea
                  name="text"
                  id="text"
                  rows={4}
                  value={formData.text}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm resize-none"
                  placeholder="Enter promotion description..."
                />
              </div>

              <div>
                <label
                  htmlFor="image_link"
                  className="block text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2"
                >
                  <Camera className="w-4 h-4 text-purple-600" />
                  <span>Image URL</span>
                </label>
                <input
                  type="text"
                  name="image_link"
                  id="image_link"
                  value={formData.image_link}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                  placeholder="https://example.com/image.png"
                />
              </div>
            </form>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 border border-transparent rounded-xl shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{currentPromo ? "Update" : "Create"} Promotion</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
