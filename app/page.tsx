// app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For loading state
  useEffect(() => {
    if (user) {
      router.replace("/shop");
    }
  }, [user, router]);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); // Clear previous errors
    setIsLoading(true); // Start loading

    try {
      // Wait for the login promise to resolve
      const ok = await login(email.trim(), password);

      if (ok) {
        // The redirect is handled by the useEffect, but pushing here is faster for UX
        router.push("/shop");
      } else {
        setErr("Invalid credentials");
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      setErr("An unexpected error occurred.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm border p-6 rounded shadow"
      >
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
        {err && <p className="text-red-500 mt-2">{err}</p>}
      </form>
    </div>
  );
}
