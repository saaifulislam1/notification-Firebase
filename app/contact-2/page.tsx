import { Metadata } from "next";
import { Mail, MapPin, MessageSquare, Phone, Send, Sparkles, Timer } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us 2.0 | Notify MyApp",
  description: "Reach the Notify crew for partnerships, support, or a quick walkthrough.",
};

const channels = [
  {
    title: "Product walkthrough",
    detail: "Book a 25-minute session to see the shopper view and admin flow.",
    action: "Schedule a call",
    href: "mailto:team@notifymyapp.com?subject=Book%20a%20walkthrough",
    icon: Phone,
  },
  {
    title: "Integration help",
    detail: "Need a custom hook or webhook? Our engineers reply fast.",
    action: "Email engineering",
    href: "mailto:team@notifymyapp.com?subject=Integration%20support",
    icon: Send,
  },
  {
    title: "Partnerships",
    detail: "Let’s pair your platform with calm notifications that convert.",
    action: "Partner with us",
    href: "mailto:team@notifymyapp.com?subject=Partnership%20inquiry",
    icon: MessageSquare,
  },
];

export default function ContactPageV2() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(99,102,241,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.16),transparent_25%),linear-gradient(180deg,rgba(15,23,42,0.94),rgba(15,23,42,0.98))]" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-indigo-100">
              <Sparkles className="h-4 w-4" />
              Concierge response
            </span>
            <h1 className="text-4xl font-semibold sm:text-5xl lg:text-6xl">
              Let&apos;s craft notifications your customers love to receive.
            </h1>
            <p className="text-lg text-slate-200 sm:text-xl">
              Whether you need a quick audit or a full rollout, we answer fast with clear next
              steps. Tell us the experience you want—shipping updates, service nudges, loyalty
              moments—and we&apos;ll make it feel effortless.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 font-semibold">
                <Timer className="h-4 w-4 text-emerald-200" />
                Responses in under 24 hours
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 font-semibold">
                <Mail className="h-4 w-4 text-indigo-200" />
                team@notifymyapp.com
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-indigo-500/40 via-blue-500/30 to-purple-500/30 blur-2xl" />
            <div className="relative rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl shadow-black/30 backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Reach out</p>
                  <h3 className="text-2xl font-semibold text-white">Send us a note</h3>
                  <p className="text-sm text-slate-200">
                    Tell us what you&apos;re building and we&apos;ll route you to the right humans.
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/30">
                  <Mail className="h-5 w-5" />
                </div>
              </div>

              <form className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200">Name</label>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:bg-white/10"
                    placeholder="Jordan Taylor"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200">Work email</label>
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:bg-white/10"
                    placeholder="you@company.com"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200">What do you need?</label>
                  <textarea
                    className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:bg-white/10"
                    placeholder="Share what you want to ship, timelines, and the customer journey you have in mind."
                  />
                </div>
                <a
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-transform duration-200 hover:scale-[1.01]"
                  href="mailto:team@notifymyapp.com"
                >
                  Send via email
                  <Send className="h-4 w-4" />
                </a>
              </form>
              <p className="mt-3 text-xs text-slate-400">
                Prefer async? Drop a note above—we reply with a crisp plan, not a sales pitch.
              </p>
            </div>
          </div>
        </header>

        <section className="mt-14 grid gap-6 md:grid-cols-3">
          {channels.map((channel) => (
            <a
              key={channel.title}
              href={channel.href}
              className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-slate-950/40 p-6 shadow-xl shadow-black/20 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-indigo-200 group-hover:scale-105">
                <channel.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{channel.title}</h3>
              <p className="mt-2 text-sm text-slate-200">{channel.detail}</p>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-indigo-100">
                {channel.action}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </a>
          ))}
        </section>

        <section className="mt-14 rounded-3xl border border-white/10 bg-slate-900/50 p-8 shadow-xl shadow-black/30">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Visit</p>
              <h3 className="text-3xl font-semibold text-white">Where to find us</h3>
              <p className="text-sm text-slate-200">
                We&apos;re a remote-first crew with creative hubs where teams gather to whiteboard
                journeys and test live experiences.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">Brooklyn Studio</p>
                  <p className="text-sm text-slate-200">
                    68 Jay Street, Suite 502 <br />
                    Brooklyn, NY 11201
                  </p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">Amsterdam Hub</p>
                  <p className="text-sm text-slate-200">
                    Keizersgracht 335 <br />
                    1016 EG Amsterdam
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-blue-500/10 to-slate-950/80 p-6 shadow-2xl shadow-black/30">
              <div className="flex items-center gap-3 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-indigo-100 border border-white/10">
                <MapPin className="h-4 w-4" />
                By appointment only
              </div>
              <p className="mt-3 text-sm text-slate-200">
                Prefer in-person? Drop a note with the studio you want to visit and we&apos;ll host
                you with a live walkthrough and coffee.
              </p>
              <a
                href="mailto:team@notifymyapp.com?subject=Studio%20visit"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-indigo-700 shadow-md shadow-blue-500/20 transition-transform duration-200 hover:scale-[1.02]"
              >
                Book a studio visit
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
