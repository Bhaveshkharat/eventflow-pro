"use client";
import React from "react";
import { Mic2, Calendar, Clock, FileUp, MessageSquare, CheckCircle2, Layout, Video, Users } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { StatCard } from "@/components/ui-ext/StatCard";

export default function SpeakerDashboard() {
  return (
    <DashboardShell title="Speaker Hub" subtitle="Manage your sessions, media uploads and organizer communication.">
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: My Sessions */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">My Sessions</h2>
              <button className="text-[10px] font-bold text-primary">View Full Schedule</button>
           </div>
           
           <div className="space-y-4">
              {[
                { title: "Building Scalable AI Agents", event: "TechSummit 2026", time: "10:30 AM", date: "June 12", room: "Grand Ballroom A", status: "Confimed" },
                { title: "The Future of Distributed Work", event: "WebConf Berlin", time: "02:15 PM", date: "Aug 04", room: "Studio 2", status: "Draft" },
              ].map(s => (
                <GlassCard key={s.title} className="p-6" hover={true}>
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                         <div className="flex items-center gap-2 mb-2">
                            <span className={"text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter " + (s.status === "Confimed" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500")}>{s.status}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{s.event}</span>
                         </div>
                         <h3 className="text-xl font-bold tracking-tight">{s.title}</h3>
                         <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> {s.date}</div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {s.time}</div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium"><Layout className="h-3.5 w-3.5" /> {s.room}</div>
                         </div>
                      </div>
                      <GradientButton size="sm" variant="outline" className="h-10 px-6">Manage Session</GradientButton>
                   </div>
                </GlassCard>
              ))}
           </div>

           <div className="space-y-6 pt-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Asset Management</h3>
              <div className="grid md:grid-cols-2 gap-4">
                 <UploadCard icon={FileUp} label="Presentation Deck" desc="PDF, PPTX up to 50MB" status="Uploaded" />
                 <UploadCard icon={Video} label="Session Intro Video" desc="MP4, MOV up to 200MB" status="Required" />
              </div>
           </div>
        </div>

        {/* Right Column: Profile & Comms */}
        <div className="lg:col-span-4 space-y-6">
           <GlassCard className="p-6" hover={false}>
              <div className="flex flex-col items-center text-center">
                 <div className="relative">
                    <img src="https://i.pravatar.cc/120?img=47" className="h-24 w-24 rounded-full ring-4 ring-primary/20" alt="" />
                    <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full gradient-bg border-4 border-background grid place-items-center"><CheckCircle2 className="h-3.5 w-3.5 text-white" /></div>
                 </div>
                 <h3 className="text-lg font-bold mt-4">Ada Lovelace</h3>
                 <p className="text-xs text-muted-foreground">Chief Scientist at Lumen AI</p>
                 <GradientButton className="w-full mt-6 h-10 text-[10px] font-bold uppercase tracking-wider" variant="outline">Edit Public Bio</GradientButton>
              </div>
           </GlassCard>

           <GlassCard className="p-6 bg-primary/5 border-primary/20" hover={false}>
              <h3 className="font-bold flex items-center gap-2 mb-4">
                 <MessageSquare className="h-4 w-4 text-primary" /> Organizer Comms
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                 You have 3 new messages regarding your TechSummit session logistics.
              </p>
              <GradientButton className="w-full mt-6 h-10" variant="glow">Open Inbox</GradientButton>
           </GlassCard>

           <div className="p-6 glass rounded-3xl border border-white/5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Engagement Stats</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground flex items-center gap-2"><Users className="h-3.5 w-3.5" /> Expected Audience</span>
                    <span className="text-sm font-bold">1,200+</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5" /> Questions Pre-asked</span>
                    <span className="text-sm font-bold text-primary">24</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function UploadCard({ icon: Icon, label, desc, status }: any) {
  return (
    <div className="p-5 rounded-2xl glass border border-white/5 hover:border-primary/30 transition-all cursor-pointer group flex items-start gap-4">
       <div className="h-10 w-10 rounded-xl bg-accent/40 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
       </div>
       <div className="flex-1">
          <p className="text-xs font-bold">{label}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
          <p className={"text-[9px] font-bold mt-2 uppercase tracking-tighter " + (status === "Uploaded" ? "text-emerald-500" : "text-amber-500")}>{status}</p>
       </div>
    </div>
  );
}
