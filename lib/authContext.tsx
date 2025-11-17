/* lib/authContext.tsx (Updated) */

"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { users } from "./auth";
import { requestForToken } from "./firebaseClient";
import toast from "react-hot-toast";

// Helper function
const isAppleDevice = () =>
  typeof navigator !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

type User = { email: string; name: string };
type AuthCtx = {
  user: User | null;
  fcmToken: string | null;
  authLoading: boolean; // <-- 1. ADD THIS
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [tokenSaveAttempted, setTokenSaveAttempted] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // <-- 2. ADD THIS (default true)

  async function saveTokenToServer(email: string, token: string) {
    try {
      await fetch("/api/save-fcm-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });
    } catch (error) {
      console.error("Failed to send FCM token to server:", error);
    }
  }

  // This useEffect restores the user session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    } finally {
      setAuthLoading(false); // <-- 3. SET LOADING TO FALSE WHEN DONE
    }
  }, []); // Runs only once on app load

  // This useEffect gets the token
  useEffect(() => {
    // Wait for auth to finish loading
    if (!user || tokenSaveAttempted || authLoading || isAppleDevice()) {
      return;
    }

    const getTokenAndSave = async () => {
      setTokenSaveAttempted(true);
      const token = await requestForToken();
      if (token) {
        setFcmToken(token);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, fcmToken: token })
        );
        await saveTokenToServer(user.email, token);
      }
    };
    getTokenAndSave();
  }, [user, tokenSaveAttempted, authLoading]); // Add authLoading

  async function login(email: string, password: string): Promise<boolean> {
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) return false;

    const u = { email: found.email, name: found.name };
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    toast.success(`Logged in as ${u.name}`);
    return true;
  }

  function logout() {
    setUser(null);
    setFcmToken(null);
    setTokenSaveAttempted(false);
    localStorage.removeItem("user");
    toast.success("Logged out");
  }

  return (
    // 4. PROVIDE THE NEW STATE
    <AuthContext.Provider
      value={{ user, fcmToken, authLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
