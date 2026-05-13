"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, ArrowRight, ArrowLeft, Calendar, 
  MapPin, Ticket, DollarSign, Image as ImageIcon, 
  Settings, Users, ShieldCheck, Zap, Mic2, Layers
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const steps = ["Basics", "Ticketing Tiers", "Permissions", "Media"];

export default function NewEventWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "", date: "", venue: "", city: "",
    currency: "USD", commission: "10",
    dynamicPricing: true,
    // Explicit Tier Pricing Metrics mapping to Visitor Checkout Options
    pricingTiers: {
      general: "150",
      pro: "450",
      vip: "899"
    },
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
    toast.success("Event created successfully! Configured tiered pricing synced into system cache.");
    setTimeout(() => window.location.href = "/organizer/events/techsummit-26", 1500);
  };

  const updateTierPrice = (key: "general" | "pro" | "vip", val: string) => {
    setFormData(prev => ({
      ...prev,
      pricingTiers: { ...prev.pricingTiers, [key]: val }
    }));
  };

  return (
    <DashboardShell 
      title="Launch New Event & Scope Pricing" 
      subtitle="Define basic parameters, configure individual ticket prices for general/pro/vip visitor tiers, and establish multi-tenant constraints."
    >
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 relative px-2">
           <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border/60 -translate-y-1/2 z-0" />
           <div 
             className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
             style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} 
           />
           
           {steps.map((label, idx) => (
             <div key={label} className="relative z-10 flex flex-col items-center gap-2">
                <div className={cn(
                  "h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 bg-background font-mono",
                  idx <= currentStep ? "border-primary text-primary shadow-glow-sm font-bold" : "border-border text-muted-foreground"
                )}>
                   {idx < currentStep ? <Check className="h-4 w-4 stroke-[3]" /> : <span className="text-xs">{idx + 1}</span>}
                </div>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider font-mono",
                  idx <= currentStep ? "text-primary" : "text-muted-foreground"
                )}>
                  {label}
                </span>
             </div>
           ))}
        </div>

        <GlassCard className="p-6 md:p-10 border-border/40" hover={false}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* STEP 0: BASICS */}
              {currentStep === 0 && (
                <div className="space-y-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block border-b border-border/40 pb-2">
                    Spatial Identity Parameters
                  </span>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field 
                      label="Event Title *" 
                      value={formData.title} 
                      onChange={(e: any) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Future Tech Expo 2026" 
                    />
                    <Field 
                      label="Target Sector Category" 
                      placeholder="Technology, Design, Healthcare..." 
                    />
                    <Field 
                      label="Date & Time Framework" 
                      type="datetime-local" 
                      value={formData.date}
                      onChange={(e: any) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                    <Field 
                      label="Venue Name" 
                      value={formData.venue}
                      onChange={(e: any) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                      placeholder="e.g. Moscone Center" 
                    />
                    <Field 
                      label="City Zone" 
                      value={formData.city}
                      onChange={(e: any) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="e.g. San Francisco" 
                      className="md:col-span-2" 
                    />
                  </div>
                </div>
              )}

              {/* STEP 1: EXPLICIT TIER PRICING CONFIGURATION */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-border/40 pb-3">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider block flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-primary" /> Pass Authorization Pricing Matrix
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Define upfront ticket rates for custom access structures. These prices map immediately onto public Visitor Checkout gateways.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Tier A: General Attendee */}
                    <div className="p-4 rounded-xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent text-foreground font-mono uppercase tracking-wider block w-fit mb-1">
                          Standard Access
                        </span>
                        <h4 className="text-xs font-bold text-foreground">General Attendee Pass Price</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Basic expo floor exploration and standard presentation row viewing.</p>
                      </div>

                      <div className="relative w-full sm:w-36 shrink-0">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <input 
                          type="number" 
                          value={formData.pricingTiers.general}
                          onChange={(e) => updateTierPrice("general", e.target.value)}
                          placeholder="150"
                          className="w-full pl-8 pr-3 py-2 text-xs bg-accent/10 border border-border rounded-xl text-foreground font-mono font-bold outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    {/* Tier B: Pro Access Delegate */}
                    <div className="p-4 rounded-xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-mono uppercase tracking-wider block w-fit mb-1">
                          Popular Upgrade
                        </span>
                        <h4 className="text-xs font-bold text-foreground">Pro Access Delegate Price</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Fast-track turnstile priorities and delegate mixer session entries.</p>
                      </div>

                      <div className="relative w-full sm:w-36 shrink-0">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <input 
                          type="number" 
                          value={formData.pricingTiers.pro}
                          onChange={(e) => updateTierPrice("pro", e.target.value)}
                          placeholder="450"
                          className="w-full pl-8 pr-3 py-2 text-xs bg-accent/10 border border-border rounded-xl text-foreground font-mono font-bold outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    {/* Tier C: VIP Executive Track */}
                    <div className="p-4 rounded-xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 border border-purple-500/20 font-mono uppercase tracking-wider block w-fit mb-1">
                          All-Inclusive Pass
                        </span>
                        <h4 className="text-xs font-bold text-foreground">VIP Executive Track Price</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Sovereign 1-on-1 speaker handshakes, green-room entry, and auto hotel block linking.</p>
                      </div>

                      <div className="relative w-full sm:w-36 shrink-0">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <input 
                          type="number" 
                          value={formData.pricingTiers.vip}
                          onChange={(e) => updateTierPrice("vip", e.target.value)}
                          placeholder="899"
                          className="w-full pl-8 pr-3 py-2 text-xs bg-accent/10 border border-border rounded-xl text-foreground font-mono font-bold outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Supplementary settings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <Field 
                      label="Partner Commission Pool (%)" 
                      type="number" 
                      value={formData.commission}
                      onChange={(e: any) => setFormData(prev => ({ ...prev, commission: e.target.value }))}
                      placeholder="10" 
                      icon={ShieldCheck} 
                    />
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Currency Code</label>
                      <select 
                        value={formData.currency} 
                        onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                        className="w-full py-2.5 px-3 bg-background border border-border rounded-xl text-xs font-bold font-mono outline-none focus:border-primary"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-accent/10 border border-border/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Zap className="h-4 w-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-foreground">Dynamic Multi-Tenant Scoping</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Prices dynamically scale based on active remaining tier inventory caps.</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded shrink-0 font-mono">
                      Active
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 2: PERMISSIONS */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block border-b border-border/40 pb-2">
                    Attendee Role Authorizations
                  </span>
                  <div className="grid gap-3 md:grid-cols-2">
                    <ToggleCard icon={Users} label="Visitor Turnstile Access" desc="General ticket purchasers" />
                    <ToggleCard icon={Layers} label="Exhibitor Portal Mapping" desc="Allows assigning hall footprint booths" />
                    <ToggleCard icon={Ticket} label="Delegate Fast-Track" desc="VIP access control matrix" />
                    <ToggleCard icon={Mic2} label="Speaker Track Submission" desc="Call for papers entry pipeline" />
                  </div>
                </div>
              )}

              {/* STEP 3: MEDIA */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="h-56 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center gap-3 bg-accent/5 hover:bg-accent/10 transition-colors cursor-pointer group">
                     <div className="h-12 w-12 rounded-xl glass grid place-items-center text-muted-foreground group-hover:text-primary transition-colors">
                        <ImageIcon className="h-5 w-5" />
                     </div>
                     <div className="text-center">
                        <p className="text-xs font-bold text-foreground">Upload Exposition Artwork Vector</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">Recommended: 1920x1080px (Max 5MB)</p>
                     </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-background border border-border text-xs">
                     <span className="font-bold text-foreground block mb-1">Global Authorization Handshake</span>
                     <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Configured ticket prices propagate securely to client dashboards. Commission splits trigger localized payment settlements upon event validation.
                     </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Form Actions Footer */}
          <div className="mt-8 pt-5 border-t border-border/60 flex items-center justify-between">
            <button 
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
               Back
            </button>
            
            {currentStep < steps.length - 1 ? (
              <GradientButton onClick={nextStep} size="sm" className="h-9 px-5 text-xs">
                 Next Stage
              </GradientButton>
            ) : (
              <GradientButton onClick={handleFinish} size="sm" className="h-9 px-6 text-xs">
                 Publish Configured Summit
              </GradientButton>
            )}
          </div>
        </GlassCard>
      </div>
    </DashboardShell>
  );
}

function Field({ label, type = "text", value, onChange, placeholder, icon: Icon, className = "" }: any) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-[10px] font-bold text-muted-foreground block">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />}
        <input 
          type={type} 
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "w-full py-2 bg-background rounded-xl border border-border outline-none focus:border-primary transition-all text-xs font-medium text-foreground placeholder:text-muted-foreground",
            Icon ? "pl-9 pr-3" : "px-3"
          )}
        />
      </div>
    </div>
  );
}

function ToggleCard({ icon: Icon, label, desc }: any) {
  return (
    <div className="p-3 rounded-xl bg-background border border-border flex items-center justify-between gap-3 cursor-pointer hover:border-primary/40 transition-all">
       <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
             <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
             <p className="text-xs font-bold text-foreground truncate">{label}</p>
             <p className="text-[10px] text-muted-foreground truncate">{desc}</p>
          </div>
       </div>
       <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0 font-mono">
         Active
       </span>
    </div>
  );
}
