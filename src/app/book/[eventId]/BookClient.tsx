"use client";
import React, { useState, use } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ArrowRight, Check, CreditCard, Lock, 
  QrCode, Download, Building2, ShieldCheck, MapPin 
} from "lucide-react";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events, tickets } from "@/data/mock";
import { toast } from "sonner";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BookClient({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    notFound();
  }

  const [step, setStep] = useState(0);
  const [tier, setTier] = useState(tickets[1].id);
  const [qty, setQty] = useState(1);
  const [payMethod, setPayMethod] = useState<"card" | "upi" | "net" | "emi">("card");
  
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
                  <h2 className="font-medium text-sm">Choose your ticket tier</h2>
                  <div className="grid gap-3">
                    {tickets.map(t => (
                      <button key={t.id} onClick={() => setTier(t.id)}
                        className={"w-full text-left rounded-2xl border p-5 transition-all relative overflow-hidden " + (tier === t.id ? "border-primary bg-primary/[0.03] shadow-glow-sm" : "border-border hover:border-foreground/20")}>
                        <div className="flex items-start justify-between relative z-10">
                          <div>
                            <p className="font-black text-sm uppercase tracking-tight">{t.name}</p>
                            <ul className="mt-2 text-[10px] font-bold text-muted-foreground space-y-1">{t.perks.map(p => <li key={p} className="flex items-center gap-2"><Check className="h-3 w-3 text-primary" /> {p}</li>)}</ul>
                          </div>
                          <div className="text-right">
                             <p className="text-xl font-black text-foreground">₹{t.price}</p>
                             <p className="text-[9px] font-bold text-muted-foreground uppercase">per pass</p>
                          </div>
                        </div>
                        {tier === t.id && <div className="absolute top-0 right-0 p-1"><div className="h-4 w-4 bg-primary rounded-bl-lg flex items-center justify-center text-white"><Check className="h-2.5 w-2.5" /></div></div>}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-6 px-1">
                    <div>
                       <p className="text-xs font-black uppercase text-muted-foreground">Quantity</p>
                       <p className="text-[10px] text-muted-foreground mt-0.5">Maximum 10 passes per booking</p>
                    </div>
                    <div className="flex items-center gap-3 bg-accent/20 p-1.5 rounded-2xl border border-border">
                      <button onClick={() => setQty(q => Math.max(1, q - 1))} className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center hover:bg-primary/10 transition-all font-black">−</button>
                      <span className="w-8 text-center font-black">{qty}</span>
                      <button onClick={() => setQty(q => Math.min(10, q + 1))} className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center hover:bg-primary/10 transition-all font-black">+</button>
                    </div>
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-black text-sm uppercase tracking-widest flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Payment Method</h2>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                     {[
                        { id: "card", label: "Card", icon: CreditCard },
                        { id: "upi", label: "UPI", icon: QrCode },
                        { id: "net", label: "Bank", icon: Building2 },
                        { id: "emi", label: "EMI", icon: Lock }
                     ].map(m => (
                        <button 
                          key={m.id} 
                          onClick={() => setPayMethod(m.id as any)}
                          className={cn(
                            "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                            payMethod === m.id ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-foreground/20"
                          )}
                        >
                           <m.icon className="h-6 w-6" />
                           <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                        </button>
                     ))}
                  </div>

                  <div className="p-6 rounded-3xl bg-accent/10 border border-border space-y-4">
                     {payMethod === "card" && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                           <div className="space-y-1.5">
                              <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Cardholder Name</label>
                              <input placeholder="Full Name as on card" className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-xs font-bold outline-none focus:border-primary transition-all" />
                           </div>
                           <div className="space-y-1.5">
                              <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Card Number</label>
                              <input placeholder="0000 0000 0000 0000" className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-xs font-bold outline-none focus:border-primary transition-all" />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                 <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Expiry Date</label>
                                 <input placeholder="MM / YY" className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-xs font-bold outline-none focus:border-primary transition-all" />
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">CVC / CVV</label>
                                 <input placeholder="123" className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-xs font-bold outline-none focus:border-primary transition-all" />
                              </div>
                           </div>
                        </motion.div>
                     )}

                     {payMethod === "upi" && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4 space-y-6">
                           <div className="h-32 w-32 bg-white p-2 rounded-2xl mx-auto border-2 border-primary/20 shadow-glow-sm">
                              <QrCode className="h-full w-full text-foreground" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase text-muted-foreground">Scan QR to Pay</p>
                              <p className="text-xs font-bold mt-1">Or enter VPA: user@okaxis</p>
                           </div>
                           <div className="flex justify-center gap-4">
                              <div className="h-10 w-10 rounded-xl bg-accent/30 grid place-items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Pay_Logo.svg" className="h-4" alt="GPay" /></div>
                              <div className="h-10 w-10 rounded-xl bg-accent/30 grid place-items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" className="h-4" alt="PhonePe" /></div>
                           </div>
                        </motion.div>
                     )}

                     {payMethod === "net" && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                           <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">Select Your Bank</p>
                           <div className="grid grid-cols-2 gap-3">
                              {["HDFC", "ICICI", "SBI", "AXIS"].map(bank => (
                                 <button key={bank} className="p-4 rounded-2xl border border-border bg-background hover:border-primary/40 transition-all font-black text-[10px] uppercase">{bank} Bank</button>
                              ))}
                           </div>
                        </motion.div>
                     )}

                     {payMethod === "emi" && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                           <Lock className="h-10 w-10 text-primary mx-auto mb-4" />
                           <p className="text-xs font-bold">EMI options available for transactions above ₹5,000.</p>
                           <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest">Powered by Razorpay / Simpl</p>
                        </motion.div>
                     )}
                  </div>
                  <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1.5 font-bold uppercase tracking-widest">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" /> Secured by 256-bit AES Encryption
                  </p>
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
                    <Link href="/visitor"><GradientButton>Open dashboard <ArrowRight className="h-4 w-4" /></GradientButton></Link>
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
                  <GradientButton onClick={() => { 
                    if (step === 1) {
                       // ── PERSISTENCE TRIGGER ──
                       const raw = localStorage.getItem("eventflow_pro_user_bookings_v1");
                       const current = raw ? JSON.parse(raw) : [];
                       
                       const newTicket = {
                          id: `tk-${Date.now()}`,
                          eventId: event.id,
                          passTier: selected.name,
                          attendeeName: "Shreyash Mane", // Mocked from onboarding
                          paymentStatus: "Payment Approved",
                          pricePaid: `₹${total.toLocaleString()}`,
                          qrCode: `EF-${event.id.slice(0,3).toUpperCase()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
                          venueDistance: "1.2 km",
                          inclusions: selected.perks,
                          timestamp: new Date().toISOString()
                       };

                       localStorage.setItem("eventflow_pro_user_bookings_v1", JSON.stringify([newTicket, ...current]));
                       toast.success("Payment processed successfully!");
                    }
                    setStep(s => s + 1); 
                  }}>
                    {step === 1 ? "Pay ₹" + total.toLocaleString() : "Continue"} <ArrowRight className="h-4 w-4" />
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
            <div className="flex justify-between"><span className="text-muted-foreground">{selected.name} × {qty}</span><span>₹{(selected.price * qty).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Service fee</span><span>₹0</span></div>
            <div className="flex justify-between pt-3 border-t border-border font-semibold"><span>Total</span><span className="gradient-text">₹{total.toLocaleString()}</span></div>
          </div>
        </GlassCard>
      </section>
      <Footer />
    </div>
  );
}
