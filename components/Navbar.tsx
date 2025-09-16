"use client";
import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b bg-white shadow-sm">
      <div className="font-bold text-lg">📝 Minimal App</div>
      <div className="space-x-4">
        {user && (
          <>
            <Link href="/tasks" className="hover:underline">
              Tasks
            </Link>
            <Link href="/shop" className="hover:underline">
              Shop
            </Link>
            <button
              onClick={logout}
              className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
