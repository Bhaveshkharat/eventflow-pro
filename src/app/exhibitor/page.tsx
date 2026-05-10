"use client";
import React from "react";
import { Building2, Plus, Box, Info, CheckCircle2, Layout, Image as ImageIcon, Video, FileText } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { booths, events } from "@/data/mock";

export default function ExhibitorDashboard() {
  const myBooth = booths[0];
  const myEvent = events.find(e => e.id === myBooth.eventId);

  return (
    <DashboardShell title="Exhibitor Hub" subtitle="Manage your booth, media and lead settings.">
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Booth Info & Media */}
        <div className="lg:col-span-8 space-y-8">
          <GlassCard className="p-8 overflow-hidden relative" hover={false}>
            <div className="absolute top-0 right-0 p-8 opacity-5"><Building2 className="h-32 w-32" /></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
               <div>
                 <div className="flex items-center gap-2 mb-2">
                   <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                     {myBooth.status}
                   </span>
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Booth #{myBooth.number}</span>
                 </div>
                 <h2 className="text-2xl font-bold tracking-tight">{myEvent?.title}</h2>
                 <p className="text-sm text-muted-foreground mt-1">{myEvent?.venue} · Hall A</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Dimensions</p>
                    <p className="text-lg font-bold">{myBooth.size}</p>
                  </div>
                  <div className="h-12 w-[1px] bg-border mx-2" />
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Type</p>
                    <p className="text-lg font-bold">Island</p>
                  </div>
               </div>
            </div>
          </GlassCard>

          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Booth Branding & Media</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <MediaCard icon={ImageIcon} label="Main Logo" status="Uploaded" />
              <MediaCard icon={FileText} label="Digital Brochure" status="Uploaded" />
              <MediaCard icon={Video} label="Promo Video" status="Missing" />
            </div>
            
            <GlassCard className="p-8" hover={false}>
               <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                 <Layout className="h-5 w-5 text-primary" /> Booth Requirements
               </h3>
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Furniture</label>
                    <div className="space-y-2">
                       {["Reception Counter (1)", "High Stools (2)", "Meeting Table (1)"].map(i => (
                         <div key={i} className="flex items-center gap-3 text-xs glass px-4 py-3 rounded-xl border border-white/5">
                           <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {i}
                         </div>
                       ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Technical</label>
                    <div className="space-y-2">
                       {["50\" LED Display", "High Speed Wi-Fi", "13A Power Outlet (2)"].map(i => (
                         <div key={i} className="flex items-center gap-3 text-xs glass px-4 py-3 rounded-xl border border-white/5">
                           <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {i}
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
               <GradientButton className="mt-8" variant="glow" size="sm">Modify Requirements</GradientButton>
            </GlassCard>
          </div>
        </div>

        {/* Right Column: Stats & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="p-6 bg-primary/5 border-primary/20" hover={false}>
             <h3 className="font-bold flex items-center gap-2">
                <Box className="h-4 w-4 text-primary" /> Lead Capture
             </h3>
             <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Start scanning visitor QR codes to build your lead database. 
             </p>
             <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between p-3 glass rounded-xl">
                   <span className="text-xs">Leads today</span>
                   <span className="text-sm font-bold">142</span>
                </div>
                <div className="flex items-center justify-between p-3 glass rounded-xl">
                   <span className="text-xs">Conversion</span>
                   <span className="text-sm font-bold text-emerald-500">12.4%</span>
                </div>
             </div>
             <GradientButton className="w-full mt-4 h-10" variant="glow">Open Scanner</GradientButton>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
             <div className="flex items-center gap-2 text-primary mb-4">
               <Info className="h-4 w-4" />
               <span className="text-xs font-bold uppercase tracking-widest">Reminders</span>
             </div>
             <ul className="space-y-4">
                <li className="flex gap-3">
                   <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                   <p className="text-xs text-muted-foreground">Booth branding artwork due by April 15th.</p>
                </li>
                <li className="flex gap-3">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                   <p className="text-xs text-muted-foreground">Insurance certificate uploaded and verified.</p>
                </li>
             </ul>
          </GlassCard>

          <button className="w-full group p-6 rounded-3xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center gap-3">
             <div className="h-10 w-10 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform">
               <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
             </div>
             <span className="text-xs font-bold text-muted-foreground group-hover:text-primary uppercase tracking-widest">Apply for another Event</span>
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}

function MediaCard({ icon: Icon, label, status }: any) {
  return (
    <div className="p-4 rounded-2xl glass border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
       <div className="h-10 w-10 rounded-xl bg-accent/40 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
       </div>
       <p className="text-xs font-bold">{label}</p>
       <p className={"text-[10px] mt-1 " + (status === "Uploaded" ? "text-emerald-500" : "text-rose-500")}>{status}</p>
    </div>
  );
}
