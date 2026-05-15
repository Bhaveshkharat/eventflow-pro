"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Scan, Search, Trash2, Camera, CircleDot, 
  Plus, ArrowRight, User
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function LeadsPage() {
  const [capturedLeads, setCapturedLeads] = useState([
    { id: "ld-1", name: "Marcus Chen", title: "VP of Cloud Scale", entity: "Nimbus Systems", email: "marcus@nimbus.dev", timestamp: "10:14 AM", temp: "Hot", photo: "https://i.pravatar.cc/80?img=11" },
    { id: "ld-2", name: "Sofia Romano", title: "Principal UX Architect", entity: "Studio Co", email: "sofia@studio.co", timestamp: "11:05 AM", temp: "Warm", photo: "https://i.pravatar.cc/80?img=32" },
  ]);

  const handleDeleteLead = (id: string, name: string) => {
    setCapturedLeads(prev => prev.filter(l => l.id !== id));
    toast.info(`Purged lead reference for "${name}".`);
  };

  const handleToggleLeadTemp = (id: string) => {
    setCapturedLeads(prev => prev.map(l => {
      if (l.id !== id) return l;
      const sequence: Record<string, string> = { Hot: "Warm", Warm: "Cold", Cold: "Hot" };
      return { ...l, temp: sequence[l.temp] || "Warm" };
    }));
  };

  return (
    <DashboardShell 
      title="Smart Lead Capture" 
      subtitle="Utilize the Lens array to harvest sovereign attendee keys and manage your CRM pipeline."
    >
      <div className="grid lg:grid-cols-12 gap-8">
         {/* LENS VIEWER */}
         <div className="lg:col-span-7 space-y-6">
            <GlassCard className="p-6 border-border/40" hover={false}>
               <div className="flex items-center gap-2 mb-6">
                  <Camera className="h-4 w-4 text-primary animate-pulse" />
                  <h3 className="font-bold text-sm text-foreground tracking-tight">Lens Active</h3>
               </div>
               
               <div className="relative h-64 rounded-2xl bg-neutral-950 flex flex-col items-center justify-center p-4">
                  <motion.div 
                     className="absolute left-0 right-0 h-0.5 bg-primary shadow-glow"
                     animate={{ top: ["10%", "90%", "10%"] }}
                     transition={{ duration: 3.5, repeat: Infinity }}
                  />
                  <Scan className="h-12 w-12 text-white/20 mb-4" />
                  <p className="text-xs text-neutral-400 text-center max-w-xs">
                     Ready to scan. Move any attendee badge into the focal zone.
                  </p>
               </div>
            </GlassCard>

            <div className="space-y-3">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">Recent Captures ({capturedLeads.length})</h4>
               <AnimatePresence mode="popLayout">
                  {capturedLeads.map(lead => (
                     <motion.div
                        key={lead.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl glass border border-border flex items-center justify-between"
                     >
                        <div className="flex items-center gap-4">
                           <img src={lead.photo} alt="" className="h-10 w-10 rounded-xl" />
                           <div>
                              <p className="text-sm font-bold">{lead.name}</p>
                              <p className="text-xs text-muted-foreground">{lead.entity}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <button 
                              onClick={() => handleToggleLeadTemp(lead.id)}
                              className={cn(
                                 "px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase",
                                 lead.temp === "Hot" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                              )}
                           >
                              {lead.temp}
                           </button>
                           <button onClick={() => handleDeleteLead(lead.id, lead.name)} className="text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="h-4 w-4" />
                           </button>
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         </div>

         {/* CRM ANALYTICS */}
         <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-6 border-border/40" hover={false}>
               <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Pipeline Stats</h4>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-xs text-muted-foreground font-medium">Total Captured</span>
                     <span className="text-xl font-black">{capturedLeads.length}</span>
                  </div>
                  <div className="h-2 w-full bg-accent/20 rounded-full overflow-hidden">
                     <div className="h-full w-1/3 bg-primary" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">You are 32% towards your goal of 150 leads for this event.</p>
               </div>
            </GlassCard>
         </div>
      </div>
    </DashboardShell>
  );
}
