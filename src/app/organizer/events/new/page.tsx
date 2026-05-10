"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, ArrowRight, ArrowLeft, Calendar, 
  MapPin, Ticket, DollarSign, Image as ImageIcon, 
  Settings, Users, ShieldCheck, Zap, Mic2
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { toast } from "sonner";

const steps = ["Basics", "Ticketing", "Permissions", "Media"];

export default function NewEventWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "", date: "", venue: "", city: "",
    basePrice: "0", currency: "USD",
    dynamicPricing: true, commission: "10",
    roles: {
      visitor: true,
      exhibitor: true,
      delegate: true,
      speaker: true,
    }
  });

  const nextStep = () => setCurrentStep(s => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 0));

  const handleFinish = () => {
    toast.success("Event created successfully! Redirecting...");
    setTimeout(() => window.location.href = "/organizer/events", 2000);
  };

  return (
    <DashboardShell title="Create Event" subtitle="Follow the steps to launch your next successful event.">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 relative px-2">
           <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border -translate-y-1/2 z-0" />
           <div className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-500" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
           
           {steps.map((label, idx) => (
             <div key={label} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 bg-background ${idx <= currentStep ? "border-primary text-primary shadow-glow-sm" : "border-border text-muted-foreground"}`}>
                   {idx < currentStep ? <Check className="h-5 w-5" /> : <span className="text-sm font-bold">{idx + 1}</span>}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${idx <= currentStep ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
             </div>
           ))}
        </div>

        <GlassCard className="p-8 md:p-12" hover={false}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Field label="Event Title" placeholder="e.g. Future Tech Expo 2026" />
                    <Field label="Event Category" placeholder="Technology, Healthcare, etc." />
                    <Field label="Date & Time" type="datetime-local" />
                    <Field label="Venue Name" placeholder="e.g. Moscone Center" />
                    <Field label="City" placeholder="e.g. San Francisco" className="md:col-span-2" />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Field label="Base Ticket Price" type="number" placeholder="0.00" icon={DollarSign} />
                    <Field label="Sales Commission (%)" type="number" placeholder="10" icon={ShieldCheck} />
                  </div>
                  
                  <div className="p-6 rounded-2xl glass-strong border border-primary/20 bg-primary/5">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-primary" />
                          <h4 className="text-sm font-bold">Dynamic Pricing Engine</h4>
                       </div>
                       <div className="h-5 w-10 rounded-full glass relative border border-white/5 cursor-pointer">
                          <div className="absolute top-1 right-1 h-3 w-3 rounded-full bg-primary shadow-glow-sm" />
                       </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                       Automatically adjust ticket prices based on demand and remaining inventory. Recommended for high-attendance events.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Attendee Toggles</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <ToggleCard icon={Users} label="Visitor Registration" desc="Standard attendees and public" />
                    <ToggleCard icon={ShieldCheck} label="Exhibitor Registration" desc="Companies with booths" />
                    <ToggleCard icon={Ticket} label="Delegate Pass" desc="VIP and corporate members" />
                    <ToggleCard icon={Mic2} label="Speaker Submissions" desc="Submit talk proposals" />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="h-64 rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 bg-accent/5 hover:bg-accent/10 transition-colors cursor-pointer group">
                     <div className="h-16 w-16 rounded-full glass grid place-items-center text-muted-foreground group-hover:text-primary transition-colors">
                        <ImageIcon className="h-8 w-8" />
                     </div>
                     <div className="text-center">
                        <p className="text-sm font-bold">Upload Event Hero Image</p>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">Recommended: 1920x1080px (Max 5MB)</p>
                     </div>
                  </div>
                  
                  <div className="p-6 glass rounded-2xl border border-white/5">
                     <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Publishing Policy</h4>
                     <p className="text-[11px] text-muted-foreground leading-relaxed">
                        By publishing this event, you agree to Eventra's organizer terms. Payouts are settled every 15 days after event completion.
                     </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 pt-8 border-t border-border/50 flex items-center justify-between">
            <button 
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
               <ArrowLeft className="h-4 w-4" /> Back
            </button>
            
            {currentStep < steps.length - 1 ? (
              <GradientButton onClick={nextStep} className="px-8 h-12 shadow-glow">
                 Next Step <ArrowRight className="ml-2 h-4 w-4" />
              </GradientButton>
            ) : (
              <GradientButton onClick={handleFinish} className="px-10 h-12 shadow-glow">
                 Publish Event <Check className="ml-2 h-4 w-4" />
              </GradientButton>
            )}
          </div>
        </GlassCard>
      </div>
    </DashboardShell>
  );
}

function Field({ label, type = "text", placeholder, icon: Icon, className = "" }: any) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />}
        <input 
          type={type} 
          placeholder={placeholder}
          className={`w-full py-3 glass rounded-xl border border-white/5 outline-none focus:border-primary/30 transition-all text-sm ${Icon ? "pl-11 pr-4" : "px-4"}`}
        />
      </div>
    </div>
  );
}

function ToggleCard({ icon: Icon, label, desc }: any) {
  return (
    <div className="p-4 rounded-2xl glass border border-white/5 hover:border-primary/20 transition-all flex items-center gap-4 cursor-pointer group">
       <div className="h-10 w-10 rounded-xl bg-accent/40 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
          <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
       </div>
       <div className="flex-1 min-w-0">
          <p className="text-xs font-bold truncate">{label}</p>
          <p className="text-[10px] text-muted-foreground truncate">{desc}</p>
       </div>
       <div className="h-5 w-10 rounded-full glass relative border border-white/5 shrink-0">
          <div className="absolute top-1 right-1 h-3 w-3 rounded-full bg-primary shadow-glow-sm" />
       </div>
    </div>
  );
}
