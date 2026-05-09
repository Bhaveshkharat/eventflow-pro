import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CreditCard, Lock, QrCode, Download } from "lucide-react";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events, tickets } from "@/data/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/book/$eventId")({
  component: Book,
  loader: ({ params }) => {
    const event = events.find(e => e.id === params.eventId);
    if (!event) throw notFound();
    return { event };
  },
  errorComponent: () => <div className="p-12 text-center">Could not load.</div>,
  notFoundComponent: () => <div className="p-12 text-center">Event not found.</div>,
});

function Book() {
  const { event } = Route.useLoaderData();
  const [step, setStep] = useState(0);
  const [tier, setTier] = useState(tickets[1].id);
  const [qty, setQty] = useState(1);
  const selected = tickets.find(t => t.id === tier)!;
  const total = selected.price * qty;

  return (
    <div className="min-h-screen">
      <MarketingNav />
      <section className="mx-auto max-w-5xl px-4 py-12 grid lg:grid-cols-[1fr_360px] gap-8">
        <GlassCard className="p-8" hover={false}>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{event.title}</p>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">Complete your booking</h1>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }} className="mt-8">
              {step === 0 && (
                <div className="space-y-3">
                  <h2 className="font-medium">Choose your ticket</h2>
                  {tickets.map(t => (
                    <button key={t.id} onClick={() => setTier(t.id)}
                      className={"w-full text-left rounded-xl border p-4 transition-all " + (tier === t.id ? "border-primary bg-primary/5 shadow-elegant" : "border-border hover:border-foreground/20")}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{t.name}</p>
                          <ul className="mt-1.5 text-xs text-muted-foreground space-y-0.5">{t.perks.map(p => <li key={p}>· {p}</li>)}</ul>
                        </div>
                        <p className="font-semibold">${t.price}</p>
                      </div>
                    </button>
                  ))}
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setQty(q => Math.max(1, q - 1))} className="h-8 w-8 rounded-full glass">−</button>
                      <span className="w-8 text-center font-medium">{qty}</span>
                      <button onClick={() => setQty(q => Math.min(10, q + 1))} className="h-8 w-8 rounded-full glass">+</button>
                    </div>
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="space-y-3">
                  <h2 className="font-medium flex items-center gap-2"><CreditCard className="h-4 w-4" /> Payment</h2>
                  <input placeholder="Cardholder name" className="w-full rounded-xl glass px-4 py-3 text-sm bg-transparent outline-none" />
                  <input placeholder="Card number" className="w-full rounded-xl glass px-4 py-3 text-sm bg-transparent outline-none" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="MM / YY" className="rounded-xl glass px-4 py-3 text-sm bg-transparent outline-none" />
                    <input placeholder="CVC" className="rounded-xl glass px-4 py-3 text-sm bg-transparent outline-none" />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Lock className="h-3 w-3" /> Secured by 256-bit encryption (demo)</p>
                </div>
              )}
              {step === 2 && (
                <div className="text-center py-6">
                  <div className="mx-auto h-16 w-16 rounded-full gradient-bg grid place-items-center shadow-glow"><Check className="h-8 w-8 text-white" /></div>
                  <h2 className="mt-5 text-2xl font-semibold tracking-tight">Booking confirmed</h2>
                  <p className="mt-1 text-sm text-muted-foreground">A receipt has been sent to your email.</p>
                  <div className="mt-8 mx-auto w-fit p-6 rounded-3xl glass-strong shadow-elegant">
                    <div className="grid h-44 w-44 place-items-center rounded-2xl bg-foreground text-background">
                      <QrCode className="h-32 w-32" />
                    </div>
                    <p className="mt-3 text-xs font-mono text-muted-foreground">{event.id.toUpperCase()}-{tier.toUpperCase()}-{Date.now().toString().slice(-6)}</p>
                  </div>
                  <div className="mt-6 flex justify-center gap-3">
                    <button onClick={() => toast.success("Ticket downloaded")} className="px-4 py-2 rounded-full glass text-sm flex items-center gap-1.5"><Download className="h-4 w-4" />Download</button>
                    <Link to="/visitor"><GradientButton>Open dashboard <ArrowRight className="h-4 w-4" /></GradientButton></Link>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step < 2 && (
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="text-sm flex items-center gap-1.5 text-muted-foreground disabled:opacity-40">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <GradientButton onClick={() => { if (step === 1) toast.success("Payment processed"); setStep(s => s + 1); }}>
                {step === 1 ? "Pay $" + total : "Continue"} <ArrowRight className="h-4 w-4" />
              </GradientButton>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6 h-max lg:sticky lg:top-24" hover={false}>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Order summary</p>
          <img src={event.image} alt="" className="mt-3 w-full aspect-[16/9] object-cover rounded-xl" />
          <p className="mt-3 font-medium">{event.title}</p>
          <p className="text-xs text-muted-foreground">{event.venue}, {event.city}</p>
          <div className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">{selected.name} × {qty}</span><span>${selected.price * qty}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Service fee</span><span>$0</span></div>
            <div className="flex justify-between pt-3 border-t border-border font-semibold"><span>Total</span><span className="gradient-text">${total}</span></div>
          </div>
        </GlassCard>
      </section>
      <Footer />
    </div>
  );
}
