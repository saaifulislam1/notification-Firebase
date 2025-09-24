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

  useEffect(() => {
    if (user) {
      router.replace("/shop");
    }
  }, [user, router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(email.trim(), password);
    if (ok) {
      router.push("/shop");
    } else {
      setErr("Invalid credentials");
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
