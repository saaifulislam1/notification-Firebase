import Link from "next/link";
import { Metadata } from "next";
import { Award, Globe2, Heart, Layers, ShieldCheck, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Notify MyApp",
  description:
    "Learn how Notify MyApp blends thoughtful design with responsible notifications to keep customers informed.",
};

const values = [
  {
    title: "Human-first",
    description:
      "We build around people, not devices—every feature is designed to feel helpful, not demanding.",
    icon: Heart,
  },
  {
    title: "Reliable Delivery",
    description:
      "Our notification rails are resilient and redundant, so critical updates land every time.",
    icon: ShieldCheck,
  },
  {
    title: "Crafted Details",
    description:
      "From copy tone to pixel polish, we obsess over the small moments that make experiences feel premium.",
    icon: Layers,
  },
];

const milestones = [
  { year: "2019", title: "Founded", detail: "Started as a lightweight alerting tool for small shops." },
  {
    year: "2021",
    title: "Cross-platform",
    detail: "Expanded to web, iOS, and Android with unified delivery analytics.",
  },
  {
    year: "2023",
    title: "Trust & Safety",
    detail: "Shipped privacy-safe defaults, data minimization, and transparent controls.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-indigo-50/40 to-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(79,70,229,0.08),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                <Award className="h-4 w-4" />
                Purpose-built for modern teams
              </span>
              <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl lg:text-6xl">
                We craft considerate notification experiences that respect attention.
              </h1>
              <p className="text-lg text-slate-600 sm:text-xl">
                Notify MyApp exists to bridge the gap between urgent updates and user peace of mind.
                We deliver the right message, on the right channel, at the right moment—never noisy,
                always intentional.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/privacy"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-transform duration-200 hover:scale-[1.02]"
                >
                  Read how we protect data
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-full border border-indigo-200 bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition-colors hover:border-indigo-300 hover:text-indigo-800"
                >
                  Explore the experience
                </Link>
              </div>
            </div>
            <div className="relative rounded-3xl border border-indigo-100 bg-white/80 p-6 shadow-xl shadow-indigo-100 backdrop-blur">
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="rounded-2xl bg-gradient-to-b from-indigo-600 to-purple-600 px-4 py-5 text-white shadow-lg">
                  <p className="text-sm text-indigo-50">Delivery rate</p>
                  <p className="text-3xl font-semibold">99.97%</p>
                  <p className="mt-2 text-xs text-indigo-100">Across platforms</p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-5 shadow-inner shadow-indigo-50">
                  <p className="text-sm text-slate-500">Countries served</p>
                  <p className="text-3xl font-semibold text-slate-900">42</p>
                  <p className="mt-2 text-xs text-slate-500">Global-first uptime</p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-5 shadow-inner shadow-indigo-50">
                  <p className="text-sm text-slate-500">Team members</p>
                  <p className="text-3xl font-semibold text-slate-900">38</p>
                  <p className="mt-2 text-xs text-slate-500">Product, infra, trust</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl bg-indigo-50 px-4 py-3">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <p className="text-sm font-semibold text-slate-800">
                    Customer-first rituals every Friday.
                  </p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                  <Globe2 className="h-5 w-5 text-indigo-600" />
                  <p className="text-sm font-semibold text-slate-800">
                    Carbon-aware routing for efficient delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <h2 className="text-3xl font-semibold text-slate-900">Our values</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <value.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{value.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">How we work</h3>
            <p className="mt-3 text-sm text-slate-600">
              We operate as a distributed product team with a bias for thoughtful experimentation.
              Every launch includes a privacy checklist, rollout guardrails, and a clear success
              metric so we can learn without compromising trust.
            </p>
            <div className="mt-6 space-y-4">
              {milestones.map((item, index) => (
                <div key={item.year} className="relative pl-7">
                  {index !== milestones.length - 1 && (
                    <span className="absolute left-2.5 top-7 h-full w-px bg-gradient-to-b from-indigo-200 to-transparent" />
                  )}
                  <span className="absolute left-0 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-semibold text-white">
                    {item.year.slice(-2)}
                  </span>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-6 py-10 text-white shadow-lg sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/80">Built with care</p>
            <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Ready to deliver respectful notifications to your customers?
            </h3>
            <p className="mt-2 text-sm text-white/85">
              We can help you set up a considerate notification strategy in days, not weeks.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/notification"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-md shadow-indigo-500/20 transition-transform duration-200 hover:scale-[1.02]"
            >
              Preview notifications
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center justify-center rounded-full border border-white/60 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-white"
            >
              Privacy commitments
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
