/* components/Navbar.tsx - REDESIGNED */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import {
  LogIn,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Bell,
  ShoppingBag,
  User,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAdmin = user?.email === "admin@example.com";

  const allLinks = [
    {
      href: "/shop",
      label: "Shop",
      icon: ShoppingBag,
      visible: !!user,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      visible: isAdmin,
    },
    {
      href: "/notification",
      label: "Notifications",
      icon: Bell,
      visible: !!user,
    },
  ];

  const visibleLinks = allLinks.filter((link) => link.visible);

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-2xl sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <Link
            href={user ? "/shop" : "/"}
            className="flex items-center gap-3 group"
          >
            <div className="p-2 bg-white rounded-2xl shadow-lg transform group-hover:scale-110 transition-all duration-300">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              MyApp
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {visibleLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:text-purple-600
                    ${
                      isActive
                        ? "bg-white text-purple-600 shadow-2xl"
                        : "text-white hover:bg-white hover:bg-opacity-20 hover:shadow-lg"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}

            {/* User Profile & Logout */}
            {user ? (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white border-opacity-30">
                <div className="flex items-center gap-3 text-white">
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex border-purple-700 outline-purple-700 items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-white hover:bg-opacity-20 hover:shadow-lg  transition-all duration-300 transform hover:scale-105 ml-2"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/"
                className={`
                  flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105
                  ${
                    pathname === "/"
                      ? "bg-white text-purple-600 shadow-2xl"
                      : "text-white  hover:bg-opacity-20 hover:shadow-lg"
                  }
                `}
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-3 rounded-2xl text-white hover:bg-white hover:bg-opacity-20 transition-all duration-300"
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          lg:hidden bg-gradient-to-b from-purple-600 to-indigo-700 shadow-2xl
          transition-all duration-500 ease-in-out overflow-hidden
          ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="flex flex-col px-4 pt-2 pb-6 space-y-2">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`
                  flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-semibold transition-all duration-300
                  ${
                    isActive
                      ? "bg-white text-purple-600 shadow-lg transform scale-105"
                      : "text-white hover:bg-white hover:bg-opacity-20 hover:shadow-lg"
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          {/* Mobile User Section */}
          {user ? (
            <div className="border-t border-white border-opacity-30 pt-4 mt-2">
              <div className="flex items-center gap-3 px-4 py-3 text-white mb-2">
                <div className="p-2 bg-white bg-opacity-20 rounded-full">
                  <User className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium truncate">
                  {user.email}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-base font-semibold text-white hover:bg-white hover:bg-opacity-20 hover:shadow-lg transition-all duration-300"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className={`
                flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-semibold transition-all duration-300
                ${
                  pathname === "/"
                    ? "bg-white text-purple-600 shadow-lg transform scale-105"
                    : "text-white hover:bg-white hover:bg-opacity-20 hover:shadow-lg"
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
