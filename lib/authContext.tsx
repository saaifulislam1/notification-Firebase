"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { requestForToken } from "./firebaseClient";

type AuthContextType = {
  user: { id: string; name: string } | null;
  fcmToken: string | null;
  login: (name: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      requestForToken().then((token) => token && setFcmToken(token));
    }
  }, [user]);

  const login = (name: string) => setUser({ id: "123", name });
  const logout = () => {
    setUser(null);
    setFcmToken(null);
  };

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
