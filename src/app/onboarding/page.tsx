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
import { toast } from "sonner";

function OnboardingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get("role") || "visitor";
  const eventId = searchParams.get("event") || "techsummit-26";
  const event = events.find(e => e.id === eventId);

  const [step, setStep] = useState(0); // 0: Start/Summary, 1: Google Auth, 2: Mobile, 3: OTP, 4: Finalize
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleGoogleSignIn = () => {
    setIsVerifying(true);
    // Simulate Google OAuth Delay
    setTimeout(() => {
      setIsVerifying(false);
      setStep(2);
      toast.success("Successfully authenticated with Google");
    }, 1800);
  };

  const handleSendOtp = () => {
    if (phone.length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(3);
      toast.info("Verification code sent to your mobile");
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 4) {
      toast.error("Invalid OTP code");
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(4);
      toast.success("Identity verified successfully!");
    }, 1200);
  };

  const finalizeOnboarding = () => {
     // Save onboarding flag (simplified)
     localStorage.setItem("eventflow_pro_user_onboarded", "true");
     
     // Redirect based on role
     if (role === "visitor") router.push(`/book/${eventId}`);
     else if (role === "delegate") router.push(`/book/${eventId}?tier=delegate`);
     else if (role === "exhibitor") router.push(`/exhibitor/book-stall/${eventId}?skipAuth=true`);
     else router.push("/");
  };

  const steps = [
    { title: "Participation Path", icon: Fingerprint },
    { title: "Secure Gateway", icon: Lock },
    { title: "Identity Sync", icon: Users },
    { title: "Verification", icon: ShieldCheck }
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
             {steps.map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                   <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all border-2 ${step >= i ? "bg-primary border-primary text-white shadow-glow-sm" : "border-border text-muted-foreground"}`}>
                      <s.icon className="h-4 w-4" />
                   </div>
                   <span className={`text-[9px] font-black uppercase tracking-widest ${step >= i ? "text-foreground" : "text-muted-foreground"}`}>{s.title}</span>
                </div>
             ))}
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
                  <div className="text-center">
                    <h2 className="text-2xl font-black tracking-tight text-foreground">Authorized Access</h2>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">Verify your identity via Google for automated profile sync.</p>
                    
                    <div className="mt-10">
                       <button 
                         disabled={isVerifying}
                         onClick={handleGoogleSignIn}
                         className="w-full h-14 rounded-2xl glass border border-border/60 hover:border-primary/40 flex items-center justify-center gap-4 transition-all group relative overflow-hidden"
                       >
                          {isVerifying && <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/20"><motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5 }} className="h-full bg-primary shadow-glow" /></div>}
                          <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" className="h-6 w-6" alt="Google" />
                          <span className="text-xs font-black uppercase tracking-widest">Sign in with Google</span>
                       </button>
                       <p className="mt-6 text-[10px] text-muted-foreground leading-relaxed">By continuing, you agree to our <span className="text-foreground font-bold underline cursor-pointer">Terms of Service</span> and <span className="text-foreground font-bold underline cursor-pointer">Privacy Policy</span>.</p>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-foreground">Identity Sync</h2>
                    <div className="mt-6 flex items-center gap-4 p-4 rounded-2xl bg-accent/30 border border-border/40">
                       <div className="h-12 w-12 rounded-xl overflow-hidden border border-white/20">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`} alt="Sync" />
                       </div>
                       <div>
                          <p className="text-xs font-black text-foreground uppercase">Shreyash Mane</p>
                          <p className="text-[10px] font-medium text-muted-foreground">shreyash.mane@example.com</p>
                       </div>
                       <div className="ml-auto h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <CheckCircle2 className="h-4 w-4" />
                       </div>
                    </div>

                    <div className="mt-8 space-y-4">
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Connect Mobile</label>
                          <div className="mt-2 relative">
                             <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                             <input 
                               type="tel"
                               value={phone}
                               onChange={(e) => setPhone(e.target.value)}
                               placeholder="+91 98765-43210" 
                               className="w-full h-14 rounded-2xl glass px-12 text-sm font-bold outline-none border border-border/40 focus:border-primary/40 transition-all"
                             />
                          </div>
                       </div>
                       
                       <button 
                         disabled={isVerifying}
                         onClick={handleSendOtp}
                         className="w-full h-14 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-[11px] shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all mt-4"
                       >
                          {isVerifying ? "Requesting..." : "Send Verification Code"} <ArrowRight className="h-4 w-4" />
                       </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="text-center">
                    <h2 className="text-2xl font-black tracking-tight text-foreground">Verify Identity</h2>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">Enter the 6-digit code sent to <span className="text-foreground font-black">{phone}</span></p>
                    
                    <div className="mt-10">
                       <div className="relative">
                          <input 
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="······" 
                            className="w-full h-20 rounded-3xl glass text-center text-4xl font-black tracking-[0.5em] outline-none border border-border/40 focus:border-primary/40 transition-all"
                          />
                       </div>
                       
                       <button 
                         disabled={isVerifying}
                         onClick={handleVerifyOtp}
                         className="w-full h-14 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest text-[11px] shadow-glow-sm flex items-center justify-center gap-3 active:scale-95 transition-all mt-8"
                       >
                          {isVerifying ? "Verifying..." : "Confirm & Proceed"} <CheckCircle2 className="h-4 w-4" />
                       </button>
                       <p className="mt-6 text-[10px] text-muted-foreground">Didn't receive code? <span className="text-primary font-bold cursor-pointer hover:underline">Resend Code</span></p>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="text-center">
                    <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto mb-8 relative">
                       <CheckCircle2 className="h-12 w-12" />
                       <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ duration: 1, repeat: Infinity }} className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground">Authentication Clear</h2>
                    <p className="text-sm text-muted-foreground mt-3 font-medium">Your identity has been secured. You can now proceed to finalize your <span className="text-primary font-black uppercase">{role}</span> slot for {event?.title}.</p>
                    
                    <div className="mt-10">
                       <button 
                         onClick={finalizeOnboarding}
                         className="w-full h-16 rounded-[2rem] gradient-bg text-white font-black uppercase tracking-[0.2em] text-xs shadow-glow flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                       >
                          Proceed to {role === "exhibitor" ? "Booth Selection" : "Checkout"} <ArrowRight className="h-5 w-5" />
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
