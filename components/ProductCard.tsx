"use client";
import toast from "react-hot-toast";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow flex flex-col">
      <h2 className="font-medium">{product.name}</h2>
      <p className="text-gray-600">{product.price}</p>
      <button
        onClick={() =>
          toast.success(`We have received your order for ${product.name}`)
        }
        className="mt-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Order Now
      </button>
    </div>
  );
}
