// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/authContext";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Shop Demo",
  // popupdone
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body>
        <AuthProvider>
          <Toaster position="top-right" />
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
