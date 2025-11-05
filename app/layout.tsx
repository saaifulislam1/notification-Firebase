// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/authContext";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Shop Demo",
  description: "Notification Demo Shop",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        {/* Also keep the Apple-specific tags for best results on iOS */}
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="My Shop App" />
      </head>
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <Toaster position="top-right" />
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
