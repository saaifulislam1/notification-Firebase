// components/AuthGuard.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const s = localStorage.getItem("user");
    if (!s) {
      // if current path is not root, redirect to login root
      if (pathname !== "/") {
        toast.error("Please log in first");
        router.push("/");
      }
    }
    setChecking(false);
  }, [pathname, router]);

  if (checking) return <div className="p-6">Loading...</div>;
  return <>{children}</>;
}
