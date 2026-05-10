"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Globe, Sparkles, ShieldCheck, Zap, BarChart3, Star } from "lucide-react";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { SectionHeading } from "@/components/ui-ext/SectionHeading";
import { EventCard } from "@/components/events/EventCard";
import { events, stats, testimonials, plans } from "@/data/mock";

export default function Landing() {
  const featured = events.filter(e => e.featured);
  return (
    <div className="min-h-screen">
      <MarketingNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-70 pointer-events-none" />
        <div className="absolute inset-x-0 -top-32 h-96 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-32 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            New · AI-powered scheduling is here
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
            Run unforgettable events.<br />
            <span className="gradient-text">All in one place.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Eventra is the premium platform for organizers, exhibitors, and visitors —
            from ticketing and check-in to hotels, travel and live analytics.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/register"><GradientButton size="lg">Start free <ArrowRight className="h-4 w-4" /></GradientButton></Link>
            <Link href="/events" className="px-6 py-3.5 rounded-full glass text-sm font-medium hover:scale-[1.03] transition-transform">Browse events</Link>
          </motion.div>

          {/* Hero glass preview */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-20 relative">
            <div className="glass-strong rounded-3xl shadow-elegant p-3 max-w-5xl mx-auto">
              <div className="rounded-2xl overflow-hidden border border-border">
                <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=2000&q=70"
                  alt="Eventra dashboard preview" className="w-full aspect-[16/9] object-cover" />
              </div>
            </div>
            <div className="absolute -left-6 top-12 hidden md:block animate-float">
              <GlassCard className="p-4 w-56" hover={false}>
                <p className="text-xs text-muted-foreground">Tickets sold today</p>
                <p className="text-2xl font-semibold mt-1">2,481</p>
                <p className="text-xs text-emerald-500 mt-1">+12.4%</p>
              </GlassCard>
            </div>
            <div className="absolute -right-6 bottom-10 hidden md:block animate-float" style={{ animationDelay: "1.5s" }}>
              <GlassCard className="p-4 w-60" hover={false}>
                <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><p className="text-sm font-medium">4.9 average</p></div>
                <p className="text-xs text-muted-foreground mt-1">Across 320 events this quarter</p>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <GlassCard key={s.label} className="p-6 text-center">
              <p className="text-3xl md:text-4xl font-semibold tracking-tight gradient-text">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* FEATURED EVENTS */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex items-end justify-between gap-6 mb-10">
          <SectionHeading eyebrow="Featured" title="Events worth flying for" description="Curated experiences from our most loved organizers worldwide." />
          <Link href="/events" className="hidden md:inline-flex text-sm font-medium gradient-text">View all →</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading center eyebrow="Platform" title="Everything you need. Nothing you don't." description="A modular suite designed around the way modern events actually run." />
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {[
            { icon: Calendar, title: "Smart scheduling", desc: "Multi-track agendas, conflict detection, and instant publish." },
            { icon: ShieldCheck, title: "Secure check-in", desc: "QR + ID verification with anti-fraud signals built in." },
            { icon: Globe, title: "Hotel & travel", desc: "Negotiated rates, room blocks and guest management." },
            { icon: BarChart3, title: "Live analytics", desc: "Revenue, attendance and engagement in real time." },
            { icon: Zap, title: "Lightning fast", desc: "Built on edge infra. Loads in under a second worldwide." },
            { icon: Sparkles, title: "Crafted UI", desc: "An interface your team and attendees will actually enjoy." },
          ].map((f, i) => (
            <GlassCard key={i} className="p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl gradient-bg shadow-glow"><f.icon className="h-5 w-5 text-white" /></div>
              <h3 className="mt-4 font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading center eyebrow="Loved by teams" title="Trusted by event leaders worldwide" />
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <GlassCard key={i} className="p-6">
              <div className="flex gap-1 mb-3">{Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
              <p className="text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <img src={t.avatar} alt="" className="h-10 w-10 rounded-full ring-2 ring-border" />
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading center eyebrow="Pricing" title="Start free. Scale as you grow." />
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {plans.map(p => (
            <GlassCard key={p.id} className={"p-6 relative " + (p.popular ? "ring-2 ring-primary/40" : "")}>
              {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider gradient-bg text-white">Most popular</span>}
              <p className="text-sm font-medium">{p.name}</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight">${p.price}<span className="text-sm font-normal text-muted-foreground">{p.period === "free" ? "" : p.period}</span></p>
              <p className="text-sm text-muted-foreground mt-1">{p.tagline}</p>
              <Link href="/pricing" className="mt-5 block text-sm font-medium gradient-text">See full plan →</Link>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-10 md:p-16 text-center shadow-elegant">
          <div className="absolute inset-0 mesh-bg opacity-60 pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Ready to host something <span className="gradient-text">unforgettable</span>?</h2>
            <p className="mt-4 max-w-xl mx-auto text-muted-foreground">Set up your first event in minutes. No credit card required.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/register"><GradientButton size="lg">Get started free <ArrowRight className="h-4 w-4" /></GradientButton></Link>
              <Link href="/pricing" className="px-6 py-3.5 rounded-full glass text-sm font-medium">View pricing</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
