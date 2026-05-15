"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, ChevronLeft, ChevronRight, Check, 
  Map as MapIcon, DollarSign, ShieldCheck, 
  ArrowRight, X, Info, Sparkles, Layout,
  Smartphone, CreditCard, Banknote
} from "lucide-react";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events } from "@/data/mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface Stall {
  id: string;
  category: "Premium" | "Regular" | "Corner" | "Island";
  price: number;
  status: "Available" | "Booked" | "Reserved";
}

export default function BookStallClient({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = React.use(params);
  const searchParams = useSearchParams();
  const skipAuth = searchParams.get("skipAuth") === "true";
  const event = events.find(e => e.id === eventId);
  
  const [step, setStep] = useState(skipAuth ? 2 : 1); // 1: Auth, 2: Selection, 3: Payment
  const [selectedStalls, setSelectedStalls] = useState<Stall[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  // Generate mock floor plan based on Organizer config
  const stalls = useMemo(() => {
    const config = event?.stallConfig || { rows: 6, cols: 10, premiumPrice: 45000, regularPrice: 25000, cornerPrice: 32000, islandPrice: 120000 };
    const arr: Stall[] = [];
    const total = config.rows * config.cols;
    
    // Default prices if missing
    const pPrice = config.premiumPrice || 45000;
    const rPrice = config.regularPrice || 25000;
    const cPrice = config.cornerPrice || 32000;
    const iPrice = config.islandPrice || 120000;

    for (let i = 1; i <= total; i++) {
       const row = Math.floor((i-1)/config.cols);
       const col = (i-1)%config.cols;
       
       const isCorner = col === 0 || col === config.cols - 1;
       const isPremium = row === 0;
       const isIsland = (row >= 2 && row <= 3) && (col >= 4 && col <= 5); // Center block

       arr.push({
          id: `${String.fromCharCode(65 + row)}-${col + 101}`,
          category: isIsland ? "Island" : isPremium ? "Premium" : isCorner ? "Corner" : "Regular",
          price: isIsland ? iPrice : isPremium ? pPrice : isCorner ? cPrice : rPrice,
          status: Math.random() > 0.85 ? "Booked" : "Available"
       });
    }
    return arr;
  }, [event]);

  const totalPrice = selectedStalls.reduce((sum, s) => sum + s.price, 0);

  const toggleStall = (stall: Stall) => {
    if (stall.status !== "Available") return;
    setSelectedStalls(prev => {
       const exists = prev.find(s => s.id === stall.id);
       if (exists) return prev.filter(s => s.id !== stall.id);
       return [...prev, stall];
    });
  };

  const handleComplete = () => {
     // Save to the shared exhibitor requests store
     const raw = localStorage.getItem("eventflow_pro_exhibitor_requests_v1");
     const current = raw ? JSON.parse(raw) : [];
     
     const newBookings = selectedStalls.map(s => ({
        id: `req-${Date.now()}-${s.id}`,
        exhibitorName: "Global Tech Solutions", // Mocked identity
        boothNumber: s.id,
        eventName: event?.title || "Exhibition",
        eventId: eventId,
        title: `${s.category} Booth Allocation`,
        category: s.category,
        status: "Completed",
        cost: `₹${s.price.toLocaleString()}`,
        deadline: "Finalized",
        timestamp: new Date().toISOString()
     }));

     localStorage.setItem("eventflow_pro_exhibitor_requests_v1", JSON.stringify([...newBookings, ...current]));

     toast.success("Stall(s) successfully reserved! Redirecting to your dashboard...");
     setTimeout(() => window.location.href = "/exhibitor", 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketingNav />
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black tracking-tight">Exhibitor Selection</h1>
          <p className="text-muted-foreground mt-2">Secure your footprint at {event?.title || "the event"}.</p>
        </div>
        
        {/* STEP PROGRESS */}
        <div className="flex items-center justify-center gap-4 mb-12">
           {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-4">
                 <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center font-black text-xs transition-all",
                    step === s ? "bg-primary text-white shadow-glow-sm" : step > s ? "bg-emerald-500 text-white" : "bg-accent/40 text-muted-foreground"
                 )}>
                    {step > s ? <Check className="h-5 w-5" /> : s}
                 </div>
                 {s < 3 && <div className={cn("h-1 w-12 rounded-full", step > s ? "bg-emerald-500" : "bg-accent/40")} />}
              </div>
           ))}
        </div>

        <AnimatePresence mode="wait">
           
           {/* STEP 1: PREMIUM GOOGLE AUTH UI */}
           {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto text-center"
              >
                 <GlassCard className="p-10 border-primary/20 shadow-2xl" hover={false}>
                    <div className="h-16 w-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                       <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-black text-foreground tracking-tight">Exhibitor Identity</h2>
                    <p className="text-xs text-muted-foreground mt-2 mb-10 font-medium">Verify your professional credentials via secure Google authentication to access the stall ledger.</p>
                    
                    <button 
                      onClick={() => {
                         toast.success("Authenticated as Exhibitor!");
                         setStep(2);
                      }}
                      className="w-full h-14 rounded-2xl bg-white border-2 border-neutral-100 flex items-center justify-center gap-4 hover:bg-neutral-50 transition-all shadow-sm group"
                    >
                       <svg className="h-6 w-6" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                       </svg>
                       <span className="font-bold text-neutral-700 group-hover:text-neutral-900">Sign in with Google</span>
                    </button>

                    <div className="mt-8 pt-8 border-t border-border/40 flex items-center justify-center gap-6 opacity-40">
                       <ShieldCheck className="h-5 w-5" />
                       <p className="text-[10px] font-black uppercase tracking-widest">ISO 27001 SECURED</p>
                    </div>
                 </GlassCard>
              </motion.div>
           )}

           {/* STEP 2: INTERACTIVE STALL MAP */}
           {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="grid lg:grid-cols-12 gap-10 items-start"
              >
                 {/* Visual Grid */}
                 <div className="lg:col-span-8 space-y-6">
                    <GlassCard className="p-8 border-border/40" hover={false}>
                       <div className="flex items-center justify-between mb-8">
                          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                             <MapIcon className="h-4 w-4 text-primary" /> {event?.venue || 'Venue'} Floor Plan ({event?.stallConfig?.stallSize || 'Standard Size'})
                          </h3>
                          <div className="flex flex-wrap items-center gap-6">
                             {[
                                { l: "Island", c: "bg-violet-500" },
                                { l: "Premium", c: "bg-amber-500" },
                                { l: "Regular", c: "bg-primary" },
                                { l: "Corner", c: "bg-blue-400" },
                                { l: "Booked", c: "bg-neutral-300" }
                             ].map(item => (
                                <div key={item.l} className="flex items-center gap-2">
                                   <div className={cn("h-3.5 w-3.5 rounded-full shadow-sm", item.c)} />
                                   <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.l}</span>
                                </div>
                             ))}
                          </div>
                       </div>
 
                       <div 
                        className="grid gap-4" 
                        style={{ gridTemplateColumns: `repeat(${event?.stallConfig?.cols || 10}, minmax(0, 1fr))` }}
                       >
                          {stalls.map(stall => {
                             const isSelected = selectedStalls.some(s => s.id === stall.id);
                             return (
                                <button 
                                  key={stall.id}
                                  onClick={() => toggleStall(stall)}
                                  className={cn(
                                    "h-14 rounded-xl border-2 transition-all flex flex-col items-center justify-center group relative overflow-hidden",
                                    stall.status === "Booked" ? "bg-neutral-100 border-neutral-200 cursor-not-allowed opacity-50" :
                                    isSelected ? "bg-primary border-primary text-white shadow-glow-sm" :
                                    stall.category === "Island" ? "border-violet-500/30 bg-violet-500/10 hover:border-violet-500" :
                                    stall.category === "Premium" ? "border-amber-500/30 bg-amber-500/10 hover:border-amber-500" :
                                    stall.category === "Corner" ? "border-blue-400/30 bg-blue-400/10 hover:border-blue-400" :
                                    "border-border bg-background hover:border-primary/50"
                                  )}
                                >
                                   <span className="text-[8px] font-black font-mono">{stall.id}</span>
                                   {stall.status === "Booked" && <div className="absolute inset-0 bg-neutral-200/50 flex items-center justify-center"><X className="h-4 w-4 text-neutral-400" /></div>}
                                </button>
                             );
                          })}
                       </div>
                    </GlassCard>

                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex items-center gap-4">
                       <Info className="h-5 w-5 text-primary shrink-0" />
                       <p className="text-xs text-muted-foreground leading-relaxed">
                          <span className="font-bold text-foreground">Pro-Tip:</span> Corner stalls (ending in 1 or 0) offer 20% higher visitor engagement on average.
                       </p>
                    </div>
                 </div>

                 {/* Selection Summary */}
                 <div className="lg:col-span-4 sticky top-10 space-y-6">
                    <GlassCard className="p-6 border-border/40" hover={false}>
                       <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Booking Summary</h4>
                       <div className="space-y-4">
                          {selectedStalls.length === 0 ? (
                             <p className="text-xs text-muted-foreground italic text-center py-10">No stalls selected yet.</p>
                          ) : (
                             selectedStalls.map(s => (
                                <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-accent/20 border border-border group">
                                   <div className="flex items-center gap-3">
                                      <div className={cn(
                                         "h-2 w-2 rounded-full",
                                         s.category === "Island" ? "bg-violet-500" :
                                         s.category === "Premium" ? "bg-amber-500" :
                                         s.category === "Corner" ? "bg-blue-400" : "bg-primary"
                                      )} />
                                      <div>
                                         <p className="text-xs font-black">Stall {s.id}</p>
                                         <p className="text-[9px] font-bold text-muted-foreground uppercase">{s.category} · {event?.stallConfig?.stallSize || '3x3m'}</p>
                                      </div>
                                   </div>
                                   <p className="text-xs font-black text-primary">₹{s.price.toLocaleString()}</p>
                                </div>
                             ))
                          )}
                          
                          <div className="pt-6 border-t border-border">
                             <div className="flex justify-between items-baseline mb-4">
                                <span className="text-[10px] font-black uppercase text-muted-foreground">Total Payable</span>
                                <span className="text-2xl font-black text-foreground">₹{totalPrice.toLocaleString()}</span>
                             </div>

                             {selectedStalls.length > 0 && (
                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                                   <p className="text-[9px] font-black uppercase text-primary tracking-widest flex items-center gap-1.5">
                                      <Sparkles className="h-3 w-3" /> Booking Inclusions
                                   </p>
                                   <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                      {(event?.stallConfig?.inclusions || ["Standard Furniture", "Power"]).map(inc => (
                                         <div key={inc} className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                                            <div className="h-1 w-1 rounded-full bg-primary" /> {inc}
                                         </div>
                                      ))}
                                   </div>
                                </div>
                             )}
                          </div>

                          <GradientButton 
                            disabled={selectedStalls.length === 0}
                            onClick={() => setStep(3)} 
                            className="w-full h-14 text-xs font-black uppercase tracking-widest shadow-glow mt-4"
                          >
                             Proceed to Payment <ArrowRight className="ml-2 h-4 w-4" />
                          </GradientButton>
                       </div>
                    </GlassCard>
                 </div>
              </motion.div>
           )}

           {/* STEP 3: PAYMENT & CHECKOUT */}
           {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto space-y-8"
              >
                 <div className="p-8 rounded-[40px] bg-emerald-500/5 border border-emerald-500/20 text-center">
                    <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount to Settle</p>
                    <h4 className="text-3xl font-black text-foreground">₹{totalPrice.toLocaleString()}</h4>
                 </div>

                 <div className="grid grid-cols-1 gap-3">
                    {[
                       { id: "upi", label: "Instant UPI (GPay / PhonePe)", icon: Smartphone },
                       { id: "card", label: "Credit / Debit Card", icon: CreditCard },
                       { id: "net", label: "Corporate Net Banking", icon: Banknote }
                    ].map(m => (
                       <button 
                         key={m.id} 
                         onClick={() => setPaymentMethod(m.id)}
                         className={cn(
                           "flex items-center justify-between p-6 rounded-2xl border-2 transition-all group",
                           paymentMethod === m.id ? "border-primary bg-primary/5" : "border-border hover:border-border-strong bg-background"
                         )}
                       >
                          <div className="flex items-center gap-4">
                             <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-colors", paymentMethod === m.id ? "bg-primary text-white" : "bg-accent/40 text-muted-foreground group-hover:text-primary")}>
                                <m.icon className="h-5 w-5" />
                             </div>
                             <span className="font-black text-sm">{m.label}</span>
                          </div>
                          <div className={cn("h-6 w-6 rounded-full border-2 transition-all", paymentMethod === m.id ? "bg-primary border-primary" : "border-border")} />
                       </button>
                    ))}
                 </div>

                 <GradientButton 
                   onClick={() => {
                     // Prepare the persistence object for the dashboard
                     const newBooking = {
                       id: `req-${Date.now()}`,
                       exhibitorName: "Global Tech Solutions", // Mocked identity
                       boothNumber: selectedStalls.map(s => s.id).join(", "),
                       eventName: event?.title || "Exhibition",
                       eventId: eventId,
                       title: "Booth Space Allocation",
                       category: selectedStalls[0]?.category || "Standard",
                       status: "Completed",
                       cost: `₹${totalPrice.toLocaleString()}`,
                       deadline: "Finalized",
                       timestamp: new Date().toISOString()
                     };

                     // Save to the shared exhibitor requests store
                     const raw = localStorage.getItem("eventflow_pro_exhibitor_requests_v1");
                     const current = raw ? JSON.parse(raw) : [];
                     localStorage.setItem("eventflow_pro_exhibitor_requests_v1", JSON.stringify([newBooking, ...current]));

                     setStep(4);
                     toast.success("Payment successful!");
                   }}
                   disabled={!paymentMethod}
                   className="w-full h-14 text-sm font-black uppercase tracking-widest shadow-glow"
                 >
                    Complete Secure Payment
                 </GradientButton>
              </motion.div>
           )}

           {/* STEP 4: SUCCESS & ADD SERVICES */}
           {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto text-center"
              >
                 <GlassCard className="p-10 border-emerald-500/20 shadow-2xl" hover={false}>
                    <div className="h-20 w-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                       <Check className="h-10 w-10 text-emerald-500 stroke-[3]" />
                    </div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Booking Confirmed!</h2>
                    <p className="text-sm text-muted-foreground mt-2 mb-10 font-medium">
                      Your stall(s) have been successfully reserved for {event?.title}. You can now start adding services to your booth.
                    </p>
                    
                    <GradientButton 
                      onClick={() => window.location.href = "/exhibitor/booth"}
                      className="w-full h-14 text-sm font-black uppercase tracking-widest shadow-glow"
                    >
                       Add Services <ArrowRight className="ml-2 h-4 w-4" />
                    </GradientButton>
                 </GlassCard>
              </motion.div>
           )}

        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}
