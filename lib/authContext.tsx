"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
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

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      if (u.fcmToken) setFcmToken(u.fcmToken);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const token = await requestForToken();
      if (token) {
        setFcmToken(token);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, fcmToken: token })
        );
      }
    })();
  }, [user]);

  function login(email: string, password: string) {
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
