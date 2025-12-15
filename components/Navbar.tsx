/* components/Navbar.tsx - REDESIGNED */

"use client";

import React, { useEffect, useState } from "react";
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
  History,
  BookText,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { user, logout, authLoading } = useAuth();
  const isAdmin = user?.email === "admin@example.com";

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const allLinks = [
    {
      href: "/shop",
      label: "Shop",
      icon: ShoppingBag,
      visible: !!user && !isAdmin,
    },

    {
      href: "/notification",
      label: "Notifications",
      icon: Bell,
      visible: !!user && !isAdmin,
    },
    {
      href: "/admin-history",
      label: "Sent",
      icon: History,
      visible: isAdmin,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      visible: isAdmin,
    },
    {
      href: "/promotions-admin",
      label: " Promo",
      icon: BookText,
      visible: isAdmin,
    },
  ];

  const visibleLinks = allLinks.filter((link) => link.visible);

  if (!hasMounted) {
    return (
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm supports-[backdrop-filter]:bg-white/65">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-6">
            <div className="group flex items-center gap-3 rounded-full px-2 py-1">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 text-white shadow-lg shadow-purple-500/25">
                <Sparkles className="h-5 w-5" />
                <span className="absolute inset-0 rounded-full border border-white/60 opacity-70" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.4em] text-slate-500">
                  Notify
                </span>
                <span className="text-xl font-semibold text-slate-900">
                  MyApp
                </span>
              </div>
            </div>
            <div className="hidden flex-1 items-center justify-end gap-6 lg:flex">
              <div className="h-10 w-64 rounded-full bg-slate-100/80 animate-pulse" />
              <div className="h-12 w-48 rounded-full bg-slate-100/80 animate-pulse" />
            </div>
            <div className="lg:hidden h-12 w-12 rounded-full bg-slate-100/80 animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm supports-[backdrop-filter]:bg-white/65">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link
            href={user ? "/shop" : "/"}
            className="group flex items-center gap-3 rounded-full px-2 py-1 transition-transform duration-300 hover:scale-105"
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 text-white shadow-lg shadow-purple-500/25">
              <Sparkles className="h-5 w-5" />
              <span className="absolute inset-0 rounded-full border border-white/60 opacity-70" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.4em] text-slate-500">
                Notify
              </span>
              <span className="text-xl font-semibold text-slate-900">
                MyApp
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden flex-1 items-center justify-end gap-6 lg:flex">
            <div className="flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-2 py-2 shadow-inner shadow-white/40">
              {authLoading ? (
                <span className="px-5 py-2 text-sm font-semibold text-slate-400">
                  Loading menu…
                </span>
              ) : (
                visibleLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`
                      group relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300
                      ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                          : "text-slate-600 hover:bg-white hover:text-purple-600"
                      }
                    `}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{link.label}</span>
                      {!isActive && (
                        <span className="absolute inset-0 rounded-full border border-transparent transition group-hover:border-purple-200/80"></span>
                      )}
                    </Link>
                  );
                })
              )}
            </div>

            {/* User Profile & Logout */}
            {authLoading ? (
              <div className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-3 py-2 text-slate-400">
                <div className="h-9 w-9 rounded-full bg-slate-100/80 animate-pulse" />
                <div className="flex flex-col gap-1">
                  <span className="h-2 w-20 rounded-full bg-slate-100/80 animate-pulse" />
                  <span className="h-2 w-28 rounded-full bg-slate-100/80 animate-pulse" />
                </div>
              </div>
            ) : user ? (
              <div className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-3 py-2 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-purple-200 to-indigo-200 text-purple-700">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase text-slate-400">
                      Signed in
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      {user.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-transform duration-300 hover:scale-[1.02]"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/"
                className={`
                  flex items-center gap-2 rounded-full border border-transparent bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-transform duration-300 hover:scale-[1.02]
                  ${
                    pathname === "/"
                      ? ""
                      : "hover:from-purple-400 hover:to-indigo-400"
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
            className="lg:hidden rounded-full border border-slate-200/60 bg-white/70 p-3 text-slate-700 shadow-sm transition-all duration-300 hover:border-purple-200 hover:text-purple-600"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          lg:hidden overflow-hidden border-t border-slate-200/70 bg-white/85 backdrop-blur-xl shadow-lg shadow-slate-500/5 transition-all duration-500 ease-in-out
          ${
            menuOpen
              ? "max-h-96 opacity-100 pointer-events-auto"
              : "max-h-0 opacity-0 pointer-events-none"
          }
        `}
      >
        <div className="flex flex-col px-4 pt-3 pb-6">
          <div className="flex flex-col gap-2">
            {authLoading ? (
              <div className="rounded-2xl bg-white/80 px-4 py-3 text-slate-400">
                Loading menu…
              </div>
            ) : (
              visibleLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      flex items-center gap-4 rounded-2xl px-4 py-3 text-base font-semibold transition-all duration-300
                      ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
                          : "text-slate-600 hover:bg-white hover:text-purple-600"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })
            )}
          </div>

          {/* Mobile User Section */}
          <div className="mt-4 border-t border-slate-200/70 pt-4">
            {authLoading ? (
              <div className="rounded-2xl bg-white/80 px-4 py-3 text-slate-400">
                Loading profile…
              </div>
            ) : user ? (
              <>
                <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 text-slate-700 shadow-inner shadow-white/50">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-purple-200 to-indigo-200 text-purple-700">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wide text-slate-400">
                      Signed in
                    </span>
                    <span className="text-sm font-semibold">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-purple-500/30 transition-transform duration-300 hover:scale-[1.02]"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-purple-500/30 transition-transform duration-300 hover:scale-[1.02]"
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
