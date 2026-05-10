"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { SectionHeading } from "@/components/ui-ext/SectionHeading";
import { plans } from "@/data/mock";

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-12">
        <SectionHeading center eyebrow="Pricing" title="Simple plans, premium experience" description="No hidden fees. Cancel anytime." />
        <div className="mt-8 flex justify-center">
          <div className="glass rounded-full p-1 inline-flex text-sm">
            <button onClick={() => setYearly(false)} className={"px-4 py-1.5 rounded-full transition " + (!yearly ? "gradient-bg text-white" : "text-muted-foreground")}>Monthly</button>
            <button onClick={() => setYearly(true)} className={"px-4 py-1.5 rounded-full transition " + (yearly ? "gradient-bg text-white" : "text-muted-foreground")}>Yearly <span className="ml-1 text-[10px]">-20%</span></button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 grid md:grid-cols-3 gap-6">
        {plans.map(p => {
          const price = yearly ? Math.round(p.price * 0.8) : p.price;
          return (
            <GlassCard key={p.id} className={"p-7 relative " + (p.popular ? "ring-2 ring-primary/40" : "")}>
              {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider gradient-bg text-white">Most popular</span>}
              <p className="text-sm font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{p.tagline}</p>
              <p className="mt-5 text-5xl font-semibold tracking-tight">${price}<span className="text-sm font-normal text-muted-foreground">{p.period === "free" ? "" : p.period}</span></p>
              <GradientButton className="mt-5 w-full">{p.price === 0 ? "Start free" : "Choose plan"}</GradientButton>
              <ul className="mt-6 space-y-2.5">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="grid h-5 w-5 place-items-center rounded-full gradient-bg shrink-0"><Check className="h-3 w-3 text-white" /></span>
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          );
        })}
      </section>
      <Footer />
    </div>
  );
}
