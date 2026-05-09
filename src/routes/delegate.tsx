import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Calendar, Clock, MapPin, MessageSquare, Download, PlayCircle, Users } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events } from "@/data/mock";

export const Route = createFileRoute("/delegate")({ component: DelegateDashboard, head: () => ({ meta: [{ title: "Delegate Portal — Eventra" }] }) });

function DelegateDashboard() {
  const currentEvent = events[0];

  return (
    <DashboardShell title="Delegate Portal" subtitle="Access sessions, downloads and exclusive networking.">
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
           <GlassCard className="p-8 bg-primary/5 border-primary/20 overflow-hidden relative" hover={false}>
              <div className="absolute top-0 right-0 p-8 opacity-5"><ShieldCheck className="h-32 w-32" /></div>
              <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-primary text-white shadow-glow">DELEGATE PASS</div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">#{currentEvent.id.toUpperCase()}-D-1029</span>
                 </div>
                 <h2 className="text-3xl font-bold tracking-tight">{currentEvent.title}</h2>
                 <p className="text-muted-foreground mt-2">{currentEvent.tagline}</p>
                 <div className="mt-8 flex flex-wrap gap-6">
                    <div className="flex items-center gap-2 text-xs font-medium"><Calendar className="h-4 w-4 text-primary" /> {currentEvent.date}</div>
                    <div className="flex items-center gap-2 text-xs font-medium"><MapPin className="h-4 w-4 text-primary" /> {currentEvent.venue}</div>
                 </div>
              </div>
           </GlassCard>

           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Live & Upcoming Sessions</h3>
                 <button className="text-[10px] font-bold text-primary">View Full Agenda</button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                 {[
                   { title: "Quantum Computing Ethics", speaker: "Dr. Sarah Jenkins", time: "10:30 AM", status: "Live" },
                   { title: "Web 4.0 Infrastructure", speaker: "Alex Rivera", time: "11:45 AM", status: "Upcoming" },
                 ].map(s => (
                   <GlassCard key={s.title} className="p-5 flex flex-col justify-between h-40">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                           <span className={"text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter " + (s.status === "Live" ? "bg-rose-500 text-white animate-pulse" : "glass")}>{s.status}</span>
                           <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <h4 className="text-sm font-bold leading-tight">{s.title}</h4>
                        <p className="text-[10px] text-muted-foreground mt-1">{s.speaker}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                         <span className="text-[10px] font-mono font-bold text-primary">{s.time}</span>
                         {s.status === "Live" ? (
                           <button className="h-8 w-8 rounded-full glass-strong grid place-items-center text-primary hover:bg-primary hover:text-white transition-all"><PlayCircle className="h-4 w-4" /></button>
                         ) : (
                           <button className="text-[10px] font-bold text-muted-foreground hover:text-foreground">Remind me</button>
                         )}
                      </div>
                   </GlassCard>
                 ))}
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <GlassCard className="p-6" hover={false}>
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Delegate Resources</h3>
              <div className="space-y-3">
                 <ResourceButton icon={Download} label="Speaker Slide Deck (v1.2)" />
                 <ResourceButton icon={Download} label="Research Paper Archive" />
                 <ResourceButton icon={MessageSquare} label="Networking Guide" />
              </div>
           </GlassCard>

           <GlassCard className="p-6 bg-accent/20" hover={false}>
              <h3 className="font-bold flex items-center gap-2 mb-4">
                 <Users className="h-4 w-4 text-primary" /> Networking
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                 There are 42 other delegates in your industry attending this event. 
              </p>
              <div className="flex -space-x-2 mt-4 mb-6">
                 {[1,2,3,4,5].map(i => <img key={i} src={`https://i.pravatar.cc/40?img=${i+40}`} className="h-8 w-8 rounded-full ring-2 ring-background" alt="" />)}
              </div>
              <GradientButton className="w-full h-10" variant="glow">Start Networking</GradientButton>
           </GlassCard>
        </div>
      </div>
    </DashboardShell>
  );
}

function ResourceButton({ icon: Icon, label }: any) {
  return (
    <button className="w-full flex items-center gap-3 p-3 rounded-xl glass hover:bg-accent/50 transition-all text-xs text-left group">
       <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
       {label}
    </button>
  );
}
