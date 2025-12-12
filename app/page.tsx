// app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import {
  BellRing,
  ShieldCheck,
  Sparkles,
  Workflow,
  PhoneCall,
  Radio,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For loading state
  useEffect(() => {
    if (user && user.email !== "admin@example.com") {
      router.replace("/shop");
    }
    if (user && user.email === "admin@example.com") {
      router.replace("/dashboard");
    }
  }, [user, router]);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); // Clear previous errors
    setIsLoading(true); // Start loading

    try {
      // Wait for the login promise to resolve
      const ok = await login(email.trim(), password);

      if (ok) {
        // The redirect is handled by the useEffect, but pushing here is faster for UX
        if (user && user.email !== "admin@example.com") {
          router.replace("/shop");
        }
        if (user && user.email === "admin@example.com") {
          router.replace("/dashboard");
        }
      } else {
        setErr("Invalid credentials");
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      setErr("An unexpected error occurred.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(99,102,241,0.18),transparent_25%),radial-gradient(circle_at_90%_30%,rgba(59,130,246,0.15),transparent_25%),radial-gradient(circle_at_40%_80%,rgba(236,72,153,0.1),transparent_20%)]" />
      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Hero Copy */}
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-indigo-100">
              <Sparkles className="h-4 w-4 text-indigo-300" />
              Signal over noise
            </span>
            <h1 className="text-4xl font-semibold sm:text-5xl lg:text-6xl">
              Notifications that feel intentional, not intrusive.
            </h1>
            <p className="text-lg text-slate-200 sm:text-xl">
              Blend push, SMS, and in-app updates into a single calm experience.
              Ship critical alerts fast, measure the moments that matter, and
              keep every audience in the loop.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => router.push("/about-2")}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition-transform duration-200 hover:scale-[1.02]"
                type="button"
              >
                Meet the team
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => router.push("/contact-2")}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-white/30"
                type="button"
              >
                Talk with us
                <PhoneCall className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:max-w-lg">
              {[
                { label: "Message success", value: "99.97%" },
                { label: "Teams onboarded", value: "240+" },
                { label: "Avg. response lift", value: "34%" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg shadow-black/20"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Login Card */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-indigo-500/40 via-blue-500/30 to-purple-500/30 blur-2xl" />
            <form
              onSubmit={submit}
              className="relative w-full rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl shadow-black/30 backdrop-blur-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-indigo-200">
                    Access
                  </p>
                  <h2 className="text-2xl font-semibold text-white">
                    Sign in to Notify
                  </h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/30">
                  <Radio className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:bg-white/10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:bg-white/10"
                    required
                  />
                </div>
              </div>

              <button
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-transform duration-200 hover:scale-[1.01]"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Login & Continue"}
                <ArrowRight className="h-4 w-4" />
              </button>
              {err && <p className="mt-2 text-sm text-red-400">{err}</p>}

              <div className="mt-6 grid gap-3 rounded-2xl bg-white/5 p-4 text-sm text-slate-200 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                    <BellRing className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      Shopper view ready
                    </p>
                    <p className="text-xs text-slate-300">
                      Non-admin accounts jump straight to the shop experience.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Admin controls</p>
                    <p className="text-xs text-slate-300">
                      Use <span className="font-semibold">admin@example.com</span> to reach dashboards.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Feature grid */}
      <section className="relative border-t border-white/5 bg-slate-950/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.12),transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">
                Delivery engine
              </p>
              <h3 className="text-3xl font-semibold text-white">
                Everything you need to land the right signal.
              </h3>
            </div>
            <div className="flex gap-2">
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-indigo-100 border border-white/10">
                Push + SMS
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-indigo-100 border border-white/10">
                In-app moments
              </span>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Orchestrated journeys",
                description:
                  "Blend triggers, delays, and audience filters to guide customers without overwhelming them.",
                icon: Workflow,
              },
              {
                title: "Trust-first defaults",
                description:
                  "Privacy-safe routing, double opt-in patterns, and graceful failovers built in.",
                icon: ShieldCheck,
              },
              {
                title: "Live observability",
                description:
                  "Watch deliveries, engagement, and drop-offs in real time to tune every message.",
                icon: BellRing,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-slate-900/50 p-6 shadow-xl shadow-black/20 transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-indigo-200 group-hover:scale-105">
                  <item.icon className="h-5 w-5" />
                </div>
                <h4 className="mt-4 text-xl font-semibold text-white">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm text-slate-200">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Storyline */}
      <section className="relative border-t border-white/5 bg-slate-900/50">
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl shadow-black/30">
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">
                Launch flow
              </p>
              <h3 className="mt-2 text-3xl font-semibold text-white">
                Go from idea to signal in an afternoon.
              </h3>
              <p className="mt-3 text-sm text-slate-200">
                Start with one message or orchestrate an entire lifecycle. Our
                admin view keeps control simple while your shoppers enjoy a
                smooth, responsive storefront.
              </p>
              <div className="mt-6 grid gap-4">
                {[
                  {
                    step: "01",
                    title: "Connect your store",
                    detail: "Drop in your catalog and customer data—no heavy setup required.",
                  },
                  {
                    step: "02",
                    title: "Compose the journey",
                    detail:
                      "Pick triggers, channels, and timing to respect each customer’s context.",
                  },
                  {
                    step: "03",
                    title: "Ship with confidence",
                    detail:
                      "Preview the shopper experience in minutes and ship with guardrails baked in.",
                  },
                ].map((item, index) => (
                  <div key={item.step} className="relative pl-10">
                    {index !== 2 && (
                      <span className="absolute left-4 top-7 h-full w-px bg-gradient-to-b from-indigo-400/60 to-transparent" />
                    )}
                    <span className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-indigo-100">
                      {item.step}
                    </span>
                    <p className="text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="text-sm text-slate-200">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(96,165,250,0.25),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(139,92,246,0.2),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-8 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">
                    Multi-channel preview
                  </p>
                  <h4 className="text-xl font-semibold text-white">
                    What your customers see
                  </h4>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-indigo-100 border border-white/10">
                  Live
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/80 text-white">
                      <BellRing className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Push notification
                      </p>
                      <p className="text-xs text-slate-200">
                        Delivered 3m ago • 97% open
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-2xl bg-slate-950/50 p-3 text-sm text-slate-100 border border-white/5">
                    &ldquo;Your order just shipped. Track the journey or tweak
                    delivery preferences anytime.&rdquo;
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/80 text-white">
                      <PhoneCall className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        SMS follow-up
                      </p>
                      <p className="text-xs text-slate-200">
                        Delivered 5m ago • 89% click
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-2xl bg-slate-950/50 p-3 text-sm text-slate-100 border border-white/5">
                    &ldquo;Thanks for being with us. Reply PAUSE to snooze alerts for
                    7 days.&rdquo;
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
