import Link from "next/link";
import { Metadata } from "next";
import {
  Compass,
  Gauge,
  Globe2,
  HeartHandshake,
  Sparkles,
  Waves,
  ShieldCheck,
  Zap,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us 2.0 | Notify MyApp",
  description:
    "Meet the crew building calm, confident notification experiences for modern commerce.",
};

const pillars = [
  {
    title: "Tasteful by default",
    description:
      "We obsess over timing, pacing, and copy so every alert feels like a helpful nudge instead of noise.",
    icon: Sparkles,
  },
  {
    title: "Measured craft",
    description:
      "Shipping is paired with live telemetry, experiment flags, and post-launch rituals to keep quality high.",
    icon: Gauge,
  },
  {
    title: "Safety woven in",
    description:
      "Privacy, consent, and predictable controls are built into every customer touchpoint.",
    icon: ShieldCheck,
  },
];

const rituals = [
  {
    title: "Friday field notes",
    detail: "We interview shoppers weekly to refine tone, cadence, and accessibility.",
  },
  {
    title: "Shadow shipping",
    detail: "New flows run quietly on internal accounts until they feel effortless.",
  },
  {
    title: "North star metrics",
    detail: "We optimize for clarity and opt-in loyalty over raw send volume.",
  },
];

export default function AboutPageV2() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.18),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.96))]" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-indigo-100">
              <Compass className="h-4 w-4" />
              People-first signals
            </span>
            <h1 className="text-4xl font-semibold sm:text-5xl lg:text-6xl">
              We design calm, confident notifications for every journey.
            </h1>
            <p className="text-lg text-slate-200 sm:text-xl">
              Notify MyApp blends product sense with resilient delivery. We pair narrative-driven
              copy with trusted rails so teams can inform, reassure, and celebrate customers without
              hijacking their attention.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact-2"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-transform duration-200 hover:scale-[1.02]"
              >
                Partner with us
              </Link>
              <Link
                href="/privacy"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-white/30"
              >
                Read our guardrails
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 sm:max-w-xl">
              {[
                { label: "Founded", value: "2019" },
                { label: "Languages", value: "14 locales" },
                { label: "Team", value: "Distributed/Remote" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-300">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-slate-900/60 to-slate-950/80 p-8 shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">
                  Operating system
                </p>
                <h3 className="text-2xl font-semibold text-white">How we work</h3>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/30">
                <Waves className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {rituals.map((item, idx) => (
                <div key={item.title} className="relative rounded-2xl border border-white/5 bg-white/5 p-4">
                  <span className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/80 text-xs font-semibold text-white shadow-md shadow-indigo-500/30">
                    0{idx + 1}
                  </span>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-slate-200">{item.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 font-semibold">
                <HeartHandshake className="h-4 w-4 text-pink-200" />
                Customer counsel on every release
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 font-semibold">
                <Globe2 className="h-4 w-4 text-emerald-200" />
                Climate-aware delivery routing
              </span>
            </div>
          </div>
        </header>

        <section className="mt-16 rounded-3xl border border-white/10 bg-slate-900/50 p-8 shadow-xl shadow-black/30">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Principles</p>
              <h3 className="text-3xl font-semibold text-white">The pillars we refuse to skip.</h3>
            </div>
            <Link
              href="/notification"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-xs font-semibold text-indigo-100 transition hover:border-white/30"
            >
              See the experience
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-slate-950/40 p-6 shadow-lg shadow-black/20 transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-indigo-200 group-hover:scale-105">
                  <pillar.icon className="h-5 w-5" />
                </div>
                <h4 className="mt-4 text-xl font-semibold text-white">{pillar.title}</h4>
                <p className="mt-2 text-sm text-slate-200">{pillar.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 via-blue-500/10 to-slate-900/90 p-8 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-3 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-indigo-100 border border-white/10">
              <Zap className="h-4 w-4" />
              Impact in weeks, not quarters
            </div>
            <h3 className="mt-4 text-3xl font-semibold text-white">Why teams join us</h3>
            <p className="mt-3 text-sm text-slate-200">
              Product leaders, service designers, and reliability engineers work side by side here.
              We hire curious generalists who care about nuance and outcomes more than vanity metrics.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-slate-200">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
                <span className="font-semibold text-white">Design+Eng pairs</span> co-own every
                launch from concept to telemetry.
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
                <span className="font-semibold text-white">No surprise handoffs:</span> the team that
                scopes the experience ships it, monitors it, and iterates.
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
                <span className="font-semibold text-white">Quiet hours:</span> we protect deep work
                windows so we can ship with intention.
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Timeline</p>
                <h4 className="text-xl font-semibold text-white">Moments that shaped us</h4>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-indigo-100">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {[
                {
                  year: "2020",
                  title: "The respectful nudge",
                  detail: "We built the first opt-in cadence system for recovering abandoned carts without pressure.",
                },
                {
                  year: "2022",
                  title: "Global rails",
                  detail: "Rolled out carbon-aware routing with localized content for 12 new regions.",
                },
                {
                  year: "2024",
                  title: "Moments, not messages",
                  detail: "Shifted to intent-led experiences that blend in-app state with service notifications.",
                },
              ].map((item, idx, arr) => (
                <div key={item.year} className="relative pl-9">
                  {idx !== arr.length - 1 && (
                    <span className="absolute left-3 top-7 h-full w-px bg-gradient-to-b from-indigo-300/60 to-transparent" />
                  )}
                  <span className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/80 text-[11px] font-semibold text-white">
                    {item.year.slice(-2)}
                  </span>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-slate-200">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-6 py-10 text-white shadow-2xl shadow-blue-500/25 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/80">Join us</p>
            <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Ready to make notifications feel human?
            </h3>
            <p className="mt-2 text-sm text-white/85">
              Let&apos;s co-design the next set of signals your customers actually welcome.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact-2"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-md shadow-blue-500/20 transition-transform duration-200 hover:scale-[1.02]"
            >
              Start a project
            </Link>
            <Link
              href="/notification"
              className="inline-flex items-center justify-center rounded-full border border-white/70 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Preview notifications
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
