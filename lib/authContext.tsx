// lib/authContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { users } from "./auth";
import { requestForToken } from "./firebaseClient";
import toast from "react-hot-toast";

type User = { email: string; name: string };
type AuthCtx = {
  user: User | null;
  fcmToken: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  // load from localStorage
  useEffect(() => {
    const s = localStorage.getItem("user");
    if (s) {
      const u = JSON.parse(s) as User;
      setUser(u);
    }
  }, []);

  // request token when user logs in (or page loads with user)
  useEffect(() => {
    if (!user) return;
    (async () => {
      const token = await requestForToken();
      if (token) {
        setFcmToken(token);
        // store token with user in localStorage (for simple per-user token storage)
        const stored = { ...user, fcmToken: token };
        localStorage.setItem("user", JSON.stringify(stored));
      } else {
        toast.error("FCM token not available (check browser/support)");
      }
    })();
  }, [user]);

  function login(email: string, password: string) {
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) {
      return false;
    }
    const userObj = { email: found.email, name: found.name };
    setUser(userObj);
    // store (fcmToken will be added once retrieved)
    localStorage.setItem("user", JSON.stringify(userObj));
    toast.success(`Logged in as ${userObj.name}`);
    return true;
  }

  function logout() {
    setUser(null);
    setFcmToken(null);
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
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
