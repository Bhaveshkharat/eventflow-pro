"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Building2, ShieldCheck, Star, ArrowRight, 
  Mail, Phone, Lock, CheckCircle2, Search,
  Fingerprint, Sparkles, LogIn, ChevronLeft
} from "lucide-react";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events } from "@/data/mock";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/useRole";
import { toast } from "sonner";

function OnboardingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setRole } = useRole();
  const role = searchParams.get("role") || "visitor";
  const eventId = searchParams.get("event") || "techsummit-26";
  const event = events.find(e => e.id === eventId);

  const [step, setStep] = useState(0); // 0: Start, 1: Identity (Google + Phone/OTP), 2: Company (Delegate), 3: Finalize
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGoogleLinked, setIsGoogleLinked] = useState(false);

  // Delegate specific state
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    designation: "",
    companyContact: ""
  });

  const handleGoogleSignIn = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsGoogleLinked(true);
      toast.success("Google identity linked");
    }, 1200);
  };

  const handleSendOtp = () => {
    if (phone.length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setOtpSent(true);
      toast.info("Verification code sent");
    }, 1200);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 4) {
      toast.error("Invalid OTP code");
      return;
    }
    if (!isGoogleLinked) {
      toast.error("Please link your Google account first");
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (role === "delegate") {
        setStep(2);
      } else {
        setStep(3);
      }
      toast.success("Identity synchronized!");
    }, 1000);
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyInfo.companyName || !companyInfo.designation) {
      toast.error("Please fill all required company fields");
      return;
    }
    setStep(3);
    toast.success("Profile completed!");
  };

  const finalizeOnboarding = () => {
     localStorage.setItem("eventflow_pro_user_onboarded", "true");
     setRole(role as any);
     
     if (role === "delegate") {
       localStorage.setItem("eventflow_pro_delegate_info", JSON.stringify(companyInfo));
     }
     
     if (role === "visitor") router.push(`/book/${eventId}`);
     else if (role === "delegate") router.push(`/book/${eventId}?tier=delegate`);
     else if (role === "exhibitor") router.push(`/exhibitor/book-stall/${eventId}?skipAuth=true`);
     else router.push("/");
  };

  const steps = [
    { title: "Path", icon: Fingerprint },
    { title: "Gateway", icon: Lock },
    { title: "Sync", icon: Users },
    { title: "Verify", icon: ShieldCheck },
    ...(role === "delegate" ? [{ title: "Company", icon: Building2 }] : [])
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketingNav />
      
      <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="w-full max-w-xl relative z-10">
          {/* Progress Bar */}
          <div className="flex justify-between mb-12 px-6">
             {steps.map((s, i) => {
                const isActive = step === i || (step === 5 && i === 4 && role !== "delegate") || (step === 5 && i === 4 && role === "delegate");
                const isCompleted = step > i || (step === 5);
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                     <div className={cn(
                       "h-8 w-8 rounded-full flex items-center justify-center transition-all border-2",
                       isCompleted ? "bg-primary border-primary text-white shadow-glow-sm" : 
                       step === i ? "border-primary text-primary" : "border-border text-muted-foreground"
                     )}>
                        <s.icon className="h-4 w-4" />
                     </div>
                     <span className={cn(
                       "text-[9px] font-black uppercase tracking-widest",
                       (step >= i || step === 5) ? "text-foreground" : "text-muted-foreground"
                     )}>{s.title}</span>
                  </div>
                );
             })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-8 md:p-12 border-primary/20 bg-background/60 backdrop-blur-3xl shadow-2xl" hover={false}>
                
                {step === 0 && (
                  <div className="text-center">
                    <div className="h-16 w-16 rounded-[2rem] gradient-bg shadow-glow mx-auto flex items-center justify-center mb-6">
                       {role === "visitor" ? <Users className="h-8 w-8 text-white" /> :
                        role === "exhibitor" ? <Building2 className="h-8 w-8 text-white" /> :
                        role === "delegate" ? <ShieldCheck className="h-8 w-8 text-white" /> :
                        <Star className="h-8 w-8 text-white" />}
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground">Welcome to {event?.title}</h2>
                    <p className="text-sm text-muted-foreground mt-3 max-w-sm mx-auto font-medium leading-relaxed">
                       You've chosen to participate as <span className="text-primary font-black uppercase">{role}</span>. Let's get your profile ready for a seamless experience.
                    </p>
                    
                    <div className="mt-10 space-y-3">
                       <button onClick={() => setStep(1)} className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[11px] shadow-glow flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all">
                          Begin Secure Onboarding <ArrowRight className="h-4 w-4" />
                       </button>
                       <button onClick={() => router.back()} className="w-full h-10 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center justify-center gap-2">
                          <ChevronLeft className="h-3 w-3" /> Change Path
                       </button>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="text-2xl font-black tracking-tight text-foreground">Identity Sync</h2>
                      <p className="text-xs text-muted-foreground mt-2 font-medium">Link your credentials to secure your profile.</p>
                    </div>
                    
                    <div className="space-y-6">
                       {/* GOOGLE SECTION */}
                       <div className={cn("p-6 rounded-2xl border transition-all", isGoogleLinked ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/40 glass")}>
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" className="h-6 w-6" alt="Google" />
                                <div>
                                   <p className="text-[10px] font-black uppercase text-muted-foreground">Account Link</p>
                                   <p className="text-xs font-bold text-foreground">{isGoogleLinked ? "shreyash.mane@example.com" : "Google Authentication"}</p>
                                </div>
                             </div>
                             {isGoogleLinked ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                             ) : (
                                <button onClick={handleGoogleSignIn} disabled={isVerifying} className="px-4 py-2 rounded-xl bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">Link Now</button>
                             )}
                          </div>
                       </div>

                       {/* PHONE SECTION */}
                       <div className={cn("p-6 rounded-2xl border transition-all", otpSent ? "border-primary/30 bg-primary/5" : "border-border/40 glass")}>
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 rounded-xl bg-accent/40 flex items-center justify-center">
                                <Phone className={cn("h-5 w-5", otpSent ? "text-primary" : "text-muted-foreground")} />
                             </div>
                             <div className="flex-1">
                                <p className="text-[10px] font-black uppercase text-muted-foreground">Mobile Verification</p>
                                <input 
                                  type="tel" 
                                  disabled={otpSent}
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  placeholder="Enter mobile number"
                                  className="w-full bg-transparent border-none outline-none text-xs font-bold text-foreground mt-0.5 placeholder:text-muted-foreground/40"
                                />
                             </div>
                             {!otpSent && (
                                <button onClick={handleSendOtp} disabled={isVerifying || !phone} className="px-4 py-2 rounded-xl border border-border/60 text-[10px] font-black uppercase tracking-widest hover:bg-accent/40 transition-all">Verify</button>
                             )}
                          </div>

                          {otpSent && (
                             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 pt-6 border-t border-border/40">
                                <div className="flex items-center justify-between gap-4">
                                   <div className="flex-1">
                                      <p className="text-[10px] font-black uppercase text-muted-foreground mb-2">Enter 6-Digit OTP</p>
                                      <div className="flex gap-2">
                                         <input 
                                           type="text" 
                                           maxLength={6}
                                           value={otp}
                                           onChange={(e) => setOtp(e.target.value)}
                                           className="w-full h-12 rounded-xl glass border border-primary/20 text-center text-lg font-black tracking-[0.5em] outline-none focus:border-primary transition-all"
                                         />
                                      </div>
                                   </div>
                                </div>
                                <button 
                                  onClick={handleVerifyOtp}
                                  className="w-full h-12 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-glow mt-4"
                                >
                                   Confirm Identity
                                </button>
                             </motion.div>
                          )}
                       </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <form onSubmit={handleCompanySubmit}>
                    <div className="text-center mb-10">
                      <h2 className="text-2xl font-black tracking-tight text-foreground">Corporate Profile</h2>
                      <p className="text-xs text-muted-foreground mt-2 font-medium">Verify your organizational credentials for premium access.</p>
                    </div>

                    <div className="space-y-5">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Company Name</label>
                          <div className="relative">
                             <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                             <input 
                               required
                               value={companyInfo.companyName}
                               onChange={(e) => setCompanyInfo({...companyInfo, companyName: e.target.value})}
                               className="w-full h-14 rounded-2xl glass px-12 text-sm font-bold outline-none border border-border/40 focus:border-primary/40 transition-all"
                               placeholder="e.g. Global Tech Solutions"
                             />
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Designation</label>
                             <input 
                               required
                               value={companyInfo.designation}
                               onChange={(e) => setCompanyInfo({...companyInfo, designation: e.target.value})}
                               className="w-full h-14 rounded-2xl glass px-5 text-sm font-bold outline-none border border-border/40 focus:border-primary/40 transition-all"
                               placeholder="VP Engineering"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Company Contact</label>
                             <input 
                               value={companyInfo.companyContact}
                               onChange={(e) => setCompanyInfo({...companyInfo, companyContact: e.target.value})}
                               className="w-full h-14 rounded-2xl glass px-5 text-sm font-bold outline-none border border-border/40 focus:border-primary/40 transition-all"
                               placeholder="+1 234-567-890"
                             />
                          </div>
                       </div>
                    </div>

                    <div className="mt-10">
                       <button 
                         type="submit"
                         className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[11px] shadow-glow flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                       >
                          Finalize Profile <ArrowRight className="h-4 w-4" />
                       </button>
                    </div>
                  </form>
                )}

                {step === 3 && (
                  <div className="text-center py-6">
                    <div className="h-24 w-24 bg-emerald-500/10 rounded-[3rem] flex items-center justify-center mx-auto mb-8">
                       <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground">All Set!</h2>
                    <p className="text-sm text-muted-foreground mt-3 font-medium max-w-[280px] mx-auto">Your identity has been verified and your profile is ready for {event?.title}.</p>
                    
                    <div className="mt-12">
                       <button 
                         onClick={finalizeOnboarding}
                         className="w-full h-16 rounded-2xl gradient-bg text-white font-black uppercase tracking-[0.2em] text-xs shadow-glow flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                       >
                          Enter Platform <Sparkles className="h-4 w-4" />
                       </button>
                    </div>
                  </div>
                )}

              </GlassCard>
            </motion.div>
          </AnimatePresence>

          <p className="mt-12 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
             EventFlow Pro · Secure Cloud Gateway v2.4
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
