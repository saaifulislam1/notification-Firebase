// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/authContext";

export const metadata = {
  title: "Shop Demo",
};
<link rel="manifest" href="/manifest.webmanifest" />;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster position="top-right" />

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
