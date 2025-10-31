/* components/Navbar.tsx */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/authContext"; // 1. Import your auth context
import { LogIn, LogOut, Store, LayoutDashboard, Menu, X } from "lucide-react"; // 2. Import icons

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // 3. Get user state and logout function from your context
  const { user, logout } = useAuth();
  const isAdmin = user?.email === "admin@example.com";

  // 4. Define all possible links and their visibility rules
  const allLinks = [
    {
      href: "/shop",
      label: "Shop",
      icon: Store,
      visible: !!user, // Only show "Shop" if a user is logged in
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      visible: isAdmin, // Only show "Dashboard" if the user is an admin
    },
    {
      href: "/notification",
      label: "Notifications",
      icon: LayoutDashboard, // You can change this icon (e.g., Bell)
      visible: !!user, // Only show if logged in
    },
  ];

  // Filter links based on visibility rules
  const visibleLinks = allLinks.filter((link) => link.visible);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link href={user ? "/shop" : "/"} className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">MyApp</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {visibleLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Conditional Login/Logout Button for Desktop */}
            {user ? (
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                href="/"
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    pathname === "/"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Slide-down effect) */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${menuOpen ? "max-h-96" : "max-h-0"}
        `}
      >
        <div className="flex flex-col px-2 pt-2 pb-3 space-y-1">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          {/* Conditional Login/Logout for Mobile */}
          {user ? (
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium
                ${
                  pathname === "/"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
