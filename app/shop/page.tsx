"use client";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const products = [
  { id: 1, name: "Notebook", price: "$5" },
  { id: 2, name: "Pen Set", price: "$3" },
  { id: 3, name: "Desk Lamp", price: "$15" },
  { id: 4, name: "Backpack", price: "$25" },
];

export default function ShopPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);
  console.log(user, "user");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Shop</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
