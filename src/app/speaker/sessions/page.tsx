"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic2, Calendar, Clock, FileUp, MessageSquare, 
  CheckCircle2, Layout, Video, Users, FileText, 
  UploadCloud, QrCode, Hotel, Plane, Download, 
  X, Check, AlertCircle, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events } from "@/data/mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SpeakerSessionsFullDetails() {
  // ── DETAILED SESSIONS INVENTORY STATE ──
  const [mySessions, setMySessions] = useState([
    { 
      id: "spk-ses-1",
      title: "Building Scalable AI Agents & Distributed Reasoning Systems", 
      eventId: "techsummit-26",
      eventTitle: "TechSummit 2026",
      time: "10:30 AM", 
      date: "June 12, 2026", 
      room: "Grand Ballroom A (Mainstage Keynote)", 
      status: "Confirmed Speaker",
      qrCode: "QR_SPEAKER_AUTH_ADA_LOVELACE_TS26_99182",
      speakerName: "Ada Lovelace",
      passTier: "Sovereign Speaker Tag",
      expectedAudience: "1,420 Registered Delegates",
      preAskedQuestionsCount: 24,
      venueProximity: "0.1 miles to Backstage Entry",
      abstract: "Parametric micro-architecture reviews covering token context compression boundaries across twin AI systems.",
      assets: { slides: "Uploaded v1.2", video: "Required" },
      questionsList: [
        { id: "q-1", user: "Marcus Vance", text: "How does the agent memory layer resolve cyclical state vectors?", votes: 19 },
        { id: "q-2", user: "Elena Rostova", text: "Are these context parameters fully compatible with local open weights?", votes: 14 }
      ]
    },
    { 
      id: "spk-ses-2",
      title: "Parametric Token Scaling in Ultra-Low Latency Cloud Networks", 
      eventId: "designweek-26",
      eventTitle: "Design Week Milano",
      time: "02:15 PM", 
      date: "April 10, 2026", 
      room: "Studio Paramount C", 
      status: "Confirmed Speaker",
      qrCode: "QR_SPEAKER_AUTH_ADA_LOVELACE_DW26_44019",
      speakerName: "Ada Lovelace",
      passTier: "Sovereign Speaker Tag",
      expectedAudience: "450 Premium Passholders",
      preAskedQuestionsCount: 8,
      venueProximity: "Direct Green Room Link",
      abstract: "Evaluating real-time multi-tenant data structures mapped onto responsive display frameworks.",
      assets: { slides: "Pending Submission", video: "Optional" },
      questionsList: [
        { id: "q-3", user: "David Kim", text: "What proxy metrics are monitored during synchronous shard transitions?", votes: 11 }
      ]
    }
  ]);

  // View wallet inspect modals
  const [inspectSessionObj, setInspectSessionObj] = useState<any | null>(null);
  const [previewSpeakerQr, setPreviewSpeakerQr]   = useState<any | null>(null);

  // Asset validation engine triggers
  const handleSimulateAssetUpload = (sessionId: string, assetType: "slides" | "video") => {
    setMySessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          assets: {
            ...s.assets,
            [assetType]: assetType === "slides" ? "Uploaded v1.3 (Master Final)" : "Uploaded MasterClip.mp4"
          }
        };
      }
      return s;
    }));
    toast.success(`Successfully uploaded secure binary asset stream for "${assetType.toUpperCase()}".`);
  };

  const handleTriggerInvoiceDownload = (tk: any) => {
    toast.success(`Secure E-Ticket file bundle for Speaker Tag "${tk.qrCode}" downloaded successfully.`);
  };

  return (
    <DashboardShell 
      title="My Sessions & Master Keynotes" 
      subtitle="Access uncompromised full-bleed management panels detailing pre-asked queries, slide uploads, video intros, and active corporate speaker hotel suites."
      backLink="/speaker"
    >
      {/* ── HEADER CROSS-NAVIGATION HOOK ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 p-4 rounded-xl bg-accent/20 border border-border/60">
        <div className="flex items-center gap-2.5">
          <Calendar className="h-4 w-4 text-purple-500 shrink-0" />
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Expanded Management Interface
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Showing full slot parameter arrays including audience interaction chat queues and proximity links.
            </p>
          </div>
        </div>

        <Link href="/speaker">
          <button className="px-3 py-1.5 rounded-lg bg-background border border-border text-xs font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 shrink-0">
            <ArrowLeft className="h-3 w-3" /> Back to Compact Hub Outer View
          </button>
        </Link>
      </div>

      {/* ── DETAILED EXPANDED CARDS ROSTER ── */}
      <div className="space-y-8">
         {mySessions.map((ses) => (
            <GlassCard 
              key={ses.id} 
              className="p-6 md:p-8 transition-all border border-border/60 flex flex-col justify-between gap-6 relative overflow-hidden group shadow-sm"
              hover={false}
            >
               <div>
                  {/* Status top envelope */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                     <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-500 text-white font-mono shadow-sm shrink-0">
                           {ses.status}
                        </span>
                        
                        <span className="text-sm font-black text-foreground uppercase tracking-tight truncate">
                           {ses.eventTitle}
                        </span>
                     </div>

                     {/* Show Specific E-Ticket badge string icon button */}
                     <button 
                       onClick={() => setPreviewSpeakerQr(ses)}
                       className="h-10 w-10 rounded-xl bg-accent/40 border border-border grid place-items-center text-foreground hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all shrink-0 self-end sm:self-auto"
                       title="Display Unique Speaker E-Ticket Code"
                     >
                        <QrCode className="h-4 w-4" />
                     </button>
                  </div>

                  {/* Timing & Layout Envelope */}
                  <div className="p-3.5 rounded-xl bg-accent/10 border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                     <div className="flex items-center gap-2.5 text-xs text-muted-foreground flex-wrap min-w-0">
                        <span className="flex items-center gap-1.5 font-bold text-foreground">
                           <Calendar className="h-4 w-4 text-purple-500 shrink-0" /> {ses.date}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1.5 font-mono text-primary font-bold">
                           <Clock className="h-4 w-4 shrink-0" /> Scheduled: {ses.time}
                        </span>
                     </div>
                     <span className="text-xs font-mono font-bold text-foreground truncate">
                        📍 Stage: {ses.room}
                     </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight leading-tight">
                     {ses.title}
                  </h3>

                  <div className="mt-3 p-3 rounded-xl bg-background border border-border text-xs text-muted-foreground/90 leading-relaxed font-sans">
                     <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-purple-500 block mb-1">
                        Approved Master Abstract
                     </span>
                     "{ses.abstract}"
                  </div>

                  <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
                     <span className="flex items-center gap-1.5 font-medium text-foreground">
                        <Users className="h-4 w-4 text-primary shrink-0" /> Expected Audience: {ses.expectedAudience}
                     </span>
                     <span>·</span>
                     <span className="font-mono text-[11px]">Proximity Check: {ses.venueProximity}</span>
                  </div>
               </div>

               {/* ── SUB-PANEL: AUDIENCE PRE-ASKED QUESTIONS QUEUE ── */}
               <div className="p-4 rounded-xl bg-accent/5 border border-border/40 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                     <span className="font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                        <MessageSquare className="h-3.5 w-3.5 text-primary shrink-0" /> Pre-Asked Audience Interaction Queue
                     </span>
                     <span className="text-[10px] text-muted-foreground font-mono">{ses.questionsList.length} Top Queries</span>
                  </div>

                  <div className="space-y-2">
                     {ses.questionsList.map(q => (
                        <div key={q.id} className="p-2.5 rounded-lg bg-background border border-border flex items-start justify-between gap-3 text-xs">
                           <div>
                              <span className="text-[10px] font-bold text-foreground block">{q.user}</span>
                              <p className="text-muted-foreground font-sans mt-0.5 leading-tight">{q.text}</p>
                           </div>
                           <span className="text-[9px] font-mono text-purple-500 font-bold bg-purple-500/10 px-1.5 py-0.2 rounded shrink-0">
                              ▲ {q.votes} Votes
                           </span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* ── INTEGRATED SPEAKER COMPANION SUITE: HOTEL & SHUTTLE BLOCKS ── */}
               <div className="space-y-2 pt-1 border-t border-border/40">
                  <div className="flex items-center justify-between">
                     <span className="text-[9px] font-bold uppercase tracking-wider text-purple-500 font-mono block">
                        Specialized Keynote Proximity Services
                     </span>
                     <span className="text-[9px] font-mono text-muted-foreground hidden sm:block">Backstage Corporate Allocations</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {/* Speaker Hotel Suite Block */}
                     <div className="p-3 rounded-xl bg-background border border-border flex flex-col justify-between">
                        <div>
                           <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-1">
                              <Hotel className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                              <span className="truncate">Need a Hotel Suite?</span>
                           </div>
                           <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight">
                              Speaker passes unlock executive corporate master-suite allocations near staging podiums.
                           </p>
                        </div>
                        <button 
                          onClick={() => toast.success(`Corporate Speaker Suite API block verified for ${ses.eventTitle}. Free complimentary setup applied.`)}
                          className="mt-3 w-full text-[10px] py-1.5 rounded-lg bg-accent text-foreground font-bold hover:bg-blue-500 hover:text-white transition-colors border border-border/40"
                        >
                           Book Master Speaker Suite
                        </button>
                     </div>

                     {/* Speaker Shuttle / Private Travel Link */}
                     <div className="p-3 rounded-xl bg-background border border-border flex flex-col justify-between">
                        <div>
                           <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-1">
                              <Plane className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                              <span className="truncate">Need Airport Transfer?</span>
                           </div>
                           <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight">
                              Direct VIP transit loops configured from flight terminal gates to private expo VIP entries.
                           </p>
                        </div>
                        <button 
                          onClick={() => toast.success("Private speaker air transport transfer details linked to digital identity.")}
                          className="mt-3 w-full text-[10px] py-1.5 rounded-lg bg-accent text-foreground font-bold hover:bg-purple-500 hover:text-white transition-colors border border-border/40"
                        >
                           Reserve VIP Transfer
                        </button>
                     </div>
                  </div>
               </div>

               {/* Sub-Asset Delivery Module Bar */}
               <div className="pt-2 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Slide Deck module status */}
                  <div className="p-3 rounded-xl bg-background border border-border flex items-center justify-between gap-2">
                     <div className="min-w-0">
                        <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground block">Presentation Deck</span>
                        <span className={cn(
                          "text-xs font-bold truncate block",
                          ses.assets.slides.includes("Uploaded") ? "text-emerald-500" : "text-amber-500"
                        )}>
                           {ses.assets.slides}
                        </span>
                     </div>
                     <button 
                       onClick={() => handleSimulateAssetUpload(ses.id, "slides")}
                       className="p-2 rounded-xl bg-accent/60 text-muted-foreground hover:text-primary transition-colors border border-border/40 shrink-0"
                       title="Simulate Slides Upload"
                     >
                        <UploadCloud className="h-4 w-4" />
                     </button>
                  </div>

                  {/* Video Asset module status */}
                  <div className="p-3 rounded-xl bg-background border border-border flex items-center justify-between gap-2">
                     <div className="min-w-0">
                        <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground block">Intro Media Clip</span>
                        <span className={cn(
                          "text-xs font-bold truncate block",
                          ses.assets.video.includes("Uploaded") ? "text-emerald-500" : "text-muted-foreground"
                        )}>
                           {ses.assets.video}
                        </span>
                     </div>
                     <button 
                       onClick={() => handleSimulateAssetUpload(ses.id, "video")}
                       className="p-2 rounded-xl bg-accent/60 text-muted-foreground hover:text-primary transition-colors border border-border/40 shrink-0"
                       title="Simulate Clip Upload"
                     >
                        <UploadCloud className="h-4 w-4" />
                     </button>
                  </div>
               </div>

               {/* Action block footer */}
               <div className="pt-3 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                     <CheckCircle2 className="h-3 w-3 text-purple-500 shrink-0" /> Full Telemetry Synchronized
                  </span>

                  <div className="flex items-center gap-2 justify-end">
                     <button 
                       onClick={() => handleTriggerInvoiceDownload(ses)}
                       className="text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 text-[11px] mr-2"
                     >
                        <Download className="h-3.5 w-3.5" /> Save Master Pass PDF
                     </button>

                     <button
                       onClick={() => setInspectSessionObj(ses)}
                       className="px-3 py-1.5 rounded-lg bg-background text-foreground text-xs font-bold border border-border hover:border-primary transition-colors"
                     >
                        Inspect Full Abstract
                     </button>
                  </div>
               </div>
            </GlassCard>
         ))}
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
                <div className="flex justify-between font-mono">
                  <span>Physical Stage:</span>
                  <span className="font-bold text-foreground truncate max-w-[160px]">{previewSpeakerQr.room ? previewSpeakerQr.room.split(" ")[0] : "Mainstage Hall"}</span>
                </div>
              </div>

              <div className="w-full pt-2 mt-2 border-t border-border/40 grid grid-cols-2 gap-2">
                 <button 
                   onClick={() => handleTriggerInvoiceDownload(previewSpeakerQr)}
                   className="py-1.5 rounded-lg bg-background text-foreground text-[10px] font-bold border border-border hover:bg-accent transition-colors flex items-center justify-center gap-1"
                 >
                    <Download className="h-3 w-3" /> Save PDF Pass
                 </button>

                 <button
                   onClick={() => setPreviewSpeakerQr(null)}
                   className="py-1.5 rounded-lg bg-accent text-foreground text-[10px] font-bold hover:bg-accent/80 transition-colors border border-border"
                 >
                   Dismiss QR Key
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── OVERLAY MODAL: INSPECT ABSTRACT SPECIFICATIONS ── */}
      <AnimatePresence>
        {inspectSessionObj && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setInspectSessionObj(null)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 20, stiffness: 320 }}
              className="relative w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl z-10 overflow-hidden p-6"
            >
               <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/60 mb-4">
                  <div className="min-w-0">
                     <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-purple-500/10 text-purple-500 border border-purple-500/20 block w-fit mb-1">
                        Abstract Metadata
                     </span>
                     <h3 className="text-sm font-bold text-foreground tracking-tight truncate">
                        {inspectSessionObj.title}
                     </h3>
                  </div>
                  <button onClick={() => setInspectSessionObj(null)} className="text-muted-foreground hover:text-foreground shrink-0">
                     <X className="h-4 w-4" />
                  </button>
               </div>

               <div className="space-y-4 text-xs font-sans">
                  <div>
                     <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Allocated Hall Bounds
                     </span>
                     <p className="font-bold text-foreground">{inspectSessionObj.room}</p>
                  </div>

                  <div>
                     <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Target Time Frame
                     </span>
                     <p className="font-mono text-primary font-bold">{inspectSessionObj.date} at {inspectSessionObj.time}</p>
                  </div>

                  <div>
                     <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Submitted Abstract Copy
                     </span>
                     <p className="p-3 rounded-xl bg-accent/20 border border-border text-muted-foreground leading-relaxed">
                        "{inspectSessionObj.abstract}"
                     </p>
                  </div>
               </div>

               <div className="mt-5 pt-3 border-t border-border/60 text-right">
                  <button
                    onClick={() => setInspectSessionObj(null)}
                    className="px-3 py-1.5 rounded-lg bg-accent text-foreground text-xs font-bold border border-border hover:bg-accent/80 transition-colors"
                  >
                     Dismiss Specifications
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}
