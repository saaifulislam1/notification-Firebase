"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { users } from "./auth";
import { requestForToken } from "./firebaseClient";
import toast from "react-hot-toast";

type User = { email: string; name: string };
type AuthCtx = {
  user: User | null;
  fcmToken: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  // 1. ADD A "FLAG" STATE. This will track if we have already tried to save a token.
  const [tokenSaveAttempted, setTokenSaveAttempted] = useState(false);

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

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    // If there's no user OR if we have already attempted to save the token, do nothing.
    if (!user || tokenSaveAttempted) return;

    const getTokenAndSave = async () => {
      // 2. SET THE FLAG TO TRUE immediately. This prevents this logic from running again.
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
  }, [user, tokenSaveAttempted]); // Add the flag to the dependency array

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
    // 3. RESET THE FLAG ON LOGOUT. This is important for the next user who logs in.
    setTokenSaveAttempted(false);
    localStorage.removeItem("user");
    toast.success("Logged out");
  }

  return (
    <AuthContext.Provider value={{ user, fcmToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
