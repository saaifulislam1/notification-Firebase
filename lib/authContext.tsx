"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { users } from "./auth";
import { requestForToken } from "./firebaseClient"; // Assuming this is your function to get a token
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

  // 1. ADD THIS HELPER FUNCTION to communicate with your backend
  async function saveTokenToServer(email: string, token: string) {
    try {
      console.log(`Sending token to server for ${email}`); // For debugging
      await fetch("/api/save-fcm-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token }),
      });
    } catch (error) {
      console.error("Failed to send FCM token to server:", error);
    }
  }

  // This useEffect restores the user session from local storage on page load
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      // It's okay to restore the token here for the UI, but we'll get a fresh one anyway
      if (u.fcmToken) setFcmToken(u.fcmToken);
    }
  }, []);

  // This useEffect runs whenever the user logs in
  useEffect(() => {
    // If there is no user, do nothing
    if (!user) return;

    const getTokenAndSave = async () => {
      // Get a fresh token from Firebase
      const token = await requestForToken();
      if (token) {
        console.log("Client received new token:", token); // For debugging
        // Update the state for the UI
        setFcmToken(token);
        // Persist the user and token in local storage
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, fcmToken: token })
        );

        // 2. CALL THE HELPER FUNCTION HERE
        // This is the missing piece. It sends the token to your server.
        await saveTokenToServer(user.email, token);
      }
    };

    getTokenAndSave();
  }, [user]); // The dependency array is correct

  async function login(email: string, password: string): Promise<boolean> {
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) return false;

    const u = { email: found.email, name: found.name };
    // Setting the user here will trigger the useEffect above
    setUser(u);
    // We only store the user here; the useEffect will add the token later
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
