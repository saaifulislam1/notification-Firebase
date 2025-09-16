import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata = {
  title: "Minimal Task App",
  description: "Simple multi-user task + shop app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <AuthProvider>
          <Navbar />
          <main className="max-w-3xl mx-auto p-6">{children}</main>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
