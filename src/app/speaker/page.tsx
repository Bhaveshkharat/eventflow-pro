"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic2, Calendar, Clock, MessageSquare, 
  Layout, PlusCircle, QrCode, ArrowRight, 
  ChevronRight, ExternalLink, X, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events } from "@/data/mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SpeakerDashboard() {
  // ── COMPACT SESSIONS STRIP INVENTORY (OUTER VIEW) ──
  const [myCompactSessions, setMyCompactSessions] = useState([
    { 
      id: "spk-ses-1",
      title: "Building Scalable AI Agents & Distributed Reasoning Systems", 
      eventTitle: "TechSummit 2026",
      time: "10:30 AM", 
      date: "June 12, 2026", 
      room: "Grand Ballroom A", 
      status: "Confirmed Speaker",
      passTier: "Sovereign Speaker Tag",
      qrCode: "QR_SPEAKER_AUTH_ADA_LOVELACE_TS26_99182",
      speakerName: "Ada Lovelace"
    },
    { 
      id: "spk-ses-2",
      title: "Parametric Token Scaling in Ultra-Low Latency Cloud Networks", 
      eventTitle: "Design Week Milano",
      time: "02:15 PM", 
      date: "April 10, 2026", 
      room: "Studio Paramount C", 
      status: "Confirmed Speaker",
      passTier: "Sovereign Speaker Tag",
      qrCode: "QR_SPEAKER_AUTH_ADA_LOVELACE_DW26_44019",
      speakerName: "Ada Lovelace"
    }
  ]);

  // Preview QR Modal
  const [previewSpeakerQr, setPreviewSpeakerQr] = useState<any | null>(null);

  // ── FUNNEL B: DIRECT SPEAKER CALL-FOR-PROPOSAL (CFP) ENGINE ──
  const [cfpOpen, setCfpOpen] = useState(false);
  const [cfpTargetEvent, setCfpTargetEvent] = useState(events[0].id);
  const [cfpTitle, setCfpTitle] = useState("");
  const [cfpAbstract, setCfpAbstract] = useState("");
  const [cfpRoomSizeNeeded, setCfpRoomSizeNeeded] = useState("Mainstage Keynote Setup");

  const handleDispatchCfpProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cfpTitle.trim() || !cfpAbstract.trim()) return;

    const chosenEvent = events.find(ev => ev.id === cfpTargetEvent) || events[0];
    const generatedToken = `QR_SPEAKER_AUTH_ADA_LOVELACE_GEN_${Math.floor(Math.random() * 80000) + 10000}`;
    const newCompactProposal = {
      id: `spk-prop-${Date.now()}`,
      title: cfpTitle,
      eventTitle: chosenEvent.title,
      time: "Unassigned TBD",
      date: chosenEvent.date,
      room: cfpRoomSizeNeeded,
      status: "Proposal Under Review",
      passTier: "Sovereign Speaker Tag",
      qrCode: generatedToken,
      speakerName: "Ada Lovelace"
    };

    setMyCompactSessions(prev => [newCompactProposal, ...prev]);
    setCfpTitle("");
    setCfpAbstract("");
    setCfpOpen(false);
    toast.success(`Session proposal "${cfpTitle}" submitted! Sent directly to ${chosenEvent.title} Organizers operations review queue.`);
  };

  // Simulated green-room comms
  const [commsInput, setCommsInput] = useState("");
  const [commsMessages, setCommsMessages] = useState([
    { sender: "Organizer Coordination", text: "Green room check-in begins 45 minutes prior to live stage cue. Specialized VIP turnstile lanes activated.", time: "09:00 AM" },
    { sender: "Stage Crew A", text: "Microphone lavalier and screen HDMI outputs are mapped on secondary podium.", time: "09:12 AM" }
  ]);

  const handlePostComms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commsInput.trim()) return;
    setCommsMessages(prev => [...prev, { sender: "You (Speaker)", text: commsInput, time: "Just Now" }]);
    setCommsInput("");
    toast.info("Message logged to operational floor technicians stream.");
  };

  return (
    <DashboardShell 
      title="Speaker Operations Hub" 
      subtitle="Audit lightweight allocations lists, extract secure backstage credentials, log green-room status updates, and instantiate full-fidelity multi-stage asset workflows."
    >
      {/* ── TOP HERO BIO BADGE & QR ACCESS ── */}
      <GlassCard className="p-6 md:p-8 bg-purple-500/5 border-purple-500/30 overflow-hidden relative mb-8" hover={false}>
         <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
           <Mic2 className="h-40 w-40 text-purple-500" />
         </div>
         
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
               <div className="relative shrink-0 mt-0.5">
                  <img src="https://i.pravatar.cc/120?img=47" className="h-16 w-16 md:h-20 md:w-20 rounded-2xl object-cover ring-2 ring-purple-500/40" alt="" />
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                     ★
                  </div>
               </div>

               <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                     <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-500 text-white font-mono shadow-sm">
                       SOVEREIGN SPEAKER ID
                     </span>
                     <span className="text-[11px] font-bold text-muted-foreground uppercase font-mono tracking-wider">
                       ROLE: KEYNOTE AUTHORITY
                     </span>
                     <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20 hidden sm:block">
                       Backstage Verification Approved
                     </span>
                  </div>
                  
                  <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight truncate">
                    Ada Lovelace
                  </h2>
                  <p className="text-xs text-purple-500 font-mono font-semibold">
                    Chief Scientist at Lumen AI
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1 max-w-xl leading-relaxed">
                    Assigned speaker credentials explicitly grant non-visitor clearance levels for staging podiums, media download proxies, and exclusive executive networking clusters.
                  </p>
               </div>
            </div>

            {/* Quick action controls side panel */}
            <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-4 border-t sm:border-t-0 sm:border-l border-border/40 sm:pl-6">
               <div className="text-left sm:text-right min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Global Allocation
                  </span>
                  <span className="text-xs font-black text-foreground truncate block">
                    {myCompactSessions.length} Scheduled Expos
                  </span>
               </div>

               <GradientButton 
                 onClick={() => setPreviewSpeakerQr(myCompactSessions[0] || { qrCode: "QR_SPEAKER_AUTH_ADA_LOVELACE_GEN", passTier: "Sovereign Speaker Tag", speakerName: "Ada Lovelace" })}
                 size="sm"
                 className="h-9 px-4 text-xs shrink-0"
               >
                  <QrCode className="h-3.5 w-3.5 mr-1.5" /> View Unique Speaker Tag
               </GradientButton>
            </div>
         </div>
      </GlassCard>

      {/* ── HYBRID ASSIGNMENT ARCHITECTURE EXPLANATION ACCORDION ── */}
      <GlassCard className="p-4 bg-background border-border/60 mb-8" hover={false}>
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
               <div className="flex items-center gap-2">
                  <span className="px-2 py-0.2 rounded text-[9px] font-bold font-mono uppercase bg-accent text-primary">
                     Twin Funnel Guide
                  </span>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                     Session Assignment Mechanics
                  </h3>
               </div>
               <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                  Organizers directly map keynotes onto these timelines. Alternatively, you can propose spontaneous masterclasses via open CFP pipelines below.
               </p>
            </div>

            <button 
              onClick={() => setCfpOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20 text-xs font-bold hover:bg-purple-500 hover:text-white transition-colors shrink-0 flex items-center gap-1.5 justify-center"
            >
               <PlusCircle className="h-3.5 w-3.5" /> Submit Ad-Hoc CFP Paper
            </button>
         </div>
      </GlassCard>

      <div className="grid lg:grid-cols-12 gap-8">
         
         {/* LEFT MAIN COL: LIGHTWEIGHT SESSIONS LIST (OUTER VIEW) */}
         <div className="lg:col-span-8 space-y-4">
            
            <div className="flex items-center justify-between px-1">
               <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                     Assigned Sessions Overview (Outer View Strip)
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                     Streamlined overview lists optimized for instant schedule status filtering.
                  </p>
               </div>
               
               <Link href="/speaker/sessions">
                  <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                     Open Full Details Hub <ArrowRight className="h-3 w-3" />
                  </button>
               </Link>
            </div>

            {/* List Array */}
            <div className="space-y-3">
               {myCompactSessions.map((ses) => (
                  <div 
                    key={ses.id}
                    className="p-4 rounded-xl bg-background border border-border hover:border-purple-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                     <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-2 mb-1">
                           <span className={cn(
                             "text-[9px] font-bold px-1.5 py-0.2 rounded uppercase font-mono tracking-wider",
                             ses.status.includes("Confirmed") ? "bg-purple-500 text-white font-black" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                           )}>
                              {ses.status}
                           </span>
                           <span className="text-[10px] text-muted-foreground font-mono truncate">
                              {ses.eventTitle}
                           </span>
                        </div>
                        <h4 className="text-sm font-bold text-foreground truncate group-hover:text-purple-500 transition-colors">
                           {ses.title}
                        </h4>
                        <div className="flex items-center gap-2.5 mt-1 text-[11px] text-muted-foreground">
                           <span className="flex items-center gap-1 font-medium text-foreground/80">
                              <Calendar className="h-3 w-3 text-purple-500" /> {ses.date}
                           </span>
                           <span>·</span>
                           <span className="truncate">Stage: {ses.room.split(" ")[0]}</span>
                        </div>
                     </div>

                     <div className="shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 flex items-center justify-between sm:justify-end gap-2">
                        <span className="text-[10px] font-mono text-muted-foreground block sm:hidden">
                           {ses.time}
                        </span>

                        <Link href="/speaker/sessions">
                           <button className="px-3 py-1.5 rounded-lg bg-accent/60 text-foreground hover:bg-purple-500 hover:text-white transition-all text-xs font-bold border border-border/40 flex items-center gap-1 shrink-0">
                              Full Details <ChevronRight className="h-3.5 w-3.5" />
                           </button>
                        </Link>
                     </div>
                  </div>
               ))}
            </div>

            <div className="p-4 rounded-xl glass border border-border text-center mt-2">
               <p className="text-xs text-muted-foreground">
                  Need to review pre-asked questions telemetry, deliver master slide files, or claim complimentary corporate accommodations?
               </p>
               <Link href="/speaker/sessions" className="text-xs font-bold text-purple-500 hover:underline block mt-1">
                  Navigate to My Sessions Detailed Management view →
               </Link>
            </div>
         </div>

         {/* RIGHT MAIN COL: GREEN ROOM INBOX & STATS SUMMARY */}
         <div className="lg:col-span-4 space-y-6">
            
            {/* LIVE OPERATIONAL INBOX */}
            <GlassCard className="p-5 bg-accent/10 border-border/40" hover={false}>
               <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
                  <h3 className="font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                     <MessageSquare className="h-3.5 w-3.5 text-primary" /> Logistics Intercom
                  </h3>
                  <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded font-mono block">
                     Green Room
                  </span>
               </div>

               <p className="text-[11px] text-muted-foreground leading-tight mb-3">
                  Direct radio communications linked to live event managers and technical stage operators.
               </p>

               {/* Messages Stream */}
               <div className="space-y-2 max-h-40 overflow-y-auto pr-1 no-scrollbar text-xs">
                  {commsMessages.map((msg, i) => (
                     <div key={i} className="p-2 rounded-lg bg-background border border-border/60">
                        <div className="flex items-center justify-between mb-0.5">
                           <span className={cn("text-[10px] font-bold truncate", msg.sender.includes("You") ? "text-primary" : "text-foreground")}>
                              {msg.sender}
                           </span>
                           <span className="text-[9px] text-muted-foreground font-mono">{msg.time}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground/90 font-sans leading-tight">
                           {msg.text}
                        </p>
                     </div>
                  ))}
               </div>

               {/* Form input */}
               <form onSubmit={handlePostComms} className="flex gap-2 mt-3 pt-2 border-t border-border/40">
                  <input 
                    type="text" 
                    value={commsInput}
                    onChange={(e) => setCommsInput(e.target.value)}
                    placeholder="Log status to production desk..." 
                    className="flex-1 px-2.5 py-1 text-xs bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-medium"
                  />
                  <GradientButton type="submit" size="sm" className="h-7 px-3 text-[10px]">
                     Send
                  </GradientButton>
               </form>
            </GlassCard>

            {/* Profile attachment strip */}
            <GlassCard className="p-4 bg-background border-border text-center space-y-2" hover={false}>
               <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                  Active Profile Hash
               </span>
               <p className="text-xs font-bold text-foreground truncate">Ada Lovelace · Principal Authority</p>
               <span className="text-[10px] text-purple-500 font-mono block">Lumen AI Enterprise Frameworks</span>
            </GlassCard>
         </div>
      </div>

      {/* ── OVERLAY MODAL: PREVIEW UNIQUE SPEAKER E-TICKET QR WALLET VIEW ── */}
      <AnimatePresence>
        {previewSpeakerQr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPreviewSpeakerQr(null)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 20, stiffness: 320 }}
              className="relative w-full max-w-sm bg-background border border-border rounded-3xl shadow-2xl z-10 overflow-hidden text-center p-6 flex flex-col items-center"
            >
              <div className="w-full pb-3 border-b border-border/40 flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase">Secure E-Ticket Signature</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black bg-purple-500 text-white shadow-sm">
                  {previewSpeakerQr.passTier || "Sovereign Speaker Tag"}
                </span>
              </div>

              {/* QR Rendering block */}
              <div className="my-5 p-4 rounded-2xl bg-white border border-border w-48 h-48 flex flex-col items-center justify-center relative shadow-inner">
                <QrCode className="h-40 w-40 text-neutral-950 stroke-1" />
              </div>

              <h3 className="font-black text-base text-foreground tracking-tight">
                {previewSpeakerQr.speakerName || "Ada Lovelace"}
              </h3>
              <p className="text-[11px] font-mono font-bold text-purple-500 mt-0.5 truncate max-w-full px-2">
                {previewSpeakerQr.qrCode}
              </p>
              
              <div className="w-full mt-4 pt-3 border-t border-border/40 text-left space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between font-mono">
                  <span>Assigned Expo:</span>
                  <span className="font-bold text-foreground truncate max-w-[160px]">{previewSpeakerQr.eventTitle || "Global Expo Scope"}</span>
                </div>
              </div>

              <button
                onClick={() => setPreviewSpeakerQr(null)}
                className="w-full mt-4 py-1.5 rounded-lg bg-accent text-foreground text-xs font-bold hover:bg-accent/80 transition-colors border border-border"
              >
                Dismiss QR Key
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── OVERLAY MODAL: SUBMIT CALL FOR PROPOSAL (CFP) ENGINE ── */}
      <AnimatePresence>
        {cfpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCfpOpen(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 20, stiffness: 320 }}
              className="relative w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl z-10 overflow-hidden p-6 max-h-[90vh] flex flex-col"
            >
               <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4 shrink-0">
                  <div>
                     <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-500/10 text-purple-500 border border-purple-500/20 block w-fit mb-1">
                        Funnel B Routing Engine
                     </span>
                     <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Mic2 className="h-4 w-4 text-primary" /> Session Call-For-Proposal Application
                     </h3>
                  </div>
                  <button onClick={() => setCfpOpen(false)} className="text-muted-foreground hover:text-foreground">
                     <X className="h-4 w-4" />
                  </button>
               </div>

               <form onSubmit={handleDispatchCfpProposal} className="space-y-4 overflow-y-auto flex-1 pr-1 no-scrollbar text-xs">
                  <div>
                     <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Target Global Destination Expo *
                     </label>
                     <select
                       value={cfpTargetEvent}
                       onChange={(e) => setCfpTargetEvent(e.target.value)}
                       className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl text-foreground font-medium outline-none focus:border-primary transition-all cursor-pointer"
                     >
                        {events.map(ev => (
                           <option key={ev.id} value={ev.id}>
                              🗺️ {ev.title} ({ev.city})
                           </option>
                        ))}
                     </select>
                  </div>

                  <div>
                     <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Session Title / Tagline *
                     </label>
                     <input 
                       type="text"
                       required
                       value={cfpTitle}
                       onChange={(e) => setCfpTitle(e.target.value)}
                       placeholder="e.g. Serverless Orchestration & Stateless Event Loops"
                       className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl text-foreground font-medium outline-none focus:border-primary transition-all"
                     />
                  </div>

                  <div>
                     <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Preferred Staging Dimensions *
                     </label>
                     <select
                       value={cfpRoomSizeNeeded}
                       onChange={(e) => setCfpRoomSizeNeeded(e.target.value)}
                       className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl text-foreground font-medium outline-none focus:border-primary transition-all cursor-pointer"
                     >
                        <option value="Mainstage Keynote Setup">Mainstage Keynote Setup (1000+ Audience Capacity)</option>
                        <option value="Pro Technical Track Arena">Pro Technical Track Arena (400 Delegate Seats)</option>
                        <option value="VIP Parametric Workshop Boardroom">VIP Parametric Workshop Boardroom (50 Executive Seats)</option>
                     </select>
                  </div>

                  <div>
                     <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Comprehensive Abstract Scope *
                     </label>
                     <textarea 
                       required
                       rows={4}
                       value={cfpAbstract}
                       onChange={(e) => setCfpAbstract(e.target.value)}
                       placeholder="Provide abstract summary, technical framework prerequisites, and primary learning takeaways for attendee filtering algorithms..."
                       className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl text-foreground font-sans outline-none focus:border-primary transition-all resize-none"
                     />
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-3">
                     <button
                       type="button"
                       onClick={() => setCfpOpen(false)}
                       className="px-3 py-1.5 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                     >
                        Cancel Proposal
                     </button>
                     <GradientButton type="submit" size="sm" className="h-9 px-6 text-xs">
                        Dispatch Abstract Payload
                     </GradientButton>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}
