"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Calendar, Clock, MapPin, 
  MessageSquare, Download, PlayCircle, Users, 
  FileText, HelpCircle, CheckCircle2, ChevronRight,
  QrCode, UserPlus, Sparkles, X, Check, Award,
  Send, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events } from "@/data/mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/useRole";

export default function DelegateDashboard() {
  const router = useRouter();
  const { role, setRole } = useRole();
  const currentEvent = events[0]; // Active bound target event: TechSummit 2026

  useEffect(() => {
    if (role !== "delegate") {
      setRole("delegate");
    }
  }, [role, setRole]);

  // ── SESSIONS TRACK STATE ──
  const [sessions, setSessions] = useState([
    { 
      id: "ses-1", 
      title: "Quantum Computing Ethics & Architecture", 
      speaker: "Dr. Sarah Jenkins (Enterprise Principal)", 
      track: "Mainstage Keynote",
      time: "10:30 AM", 
      status: "Live Now",
      watchers: 1420,
      description: "Deep dive evaluation covering parametric state vector handling algorithms deployed across cloud nodes.",
      resources: ["Slide Deck v1.2 (PDF)", "Source Code Matrix zip"]
    },
    { 
      id: "ses-2", 
      title: "Parametric Scalability for Distributed Data", 
      speaker: "Alex Rivera (Lead Scalability Architect)", 
      track: "Pro Room B",
      time: "11:45 AM", 
      status: "Upcoming",
      watchers: 890,
      description: "Evaluating real-time multi-tenant data segmentation limits and automated proxy cache strategies.",
      resources: ["Proxy Config Blueprints"]
    },
    { 
      id: "ses-3", 
      title: "Sovereign Web3 Identity Verification Protocols", 
      speaker: "Marcus Vance (VP Cryptography)", 
      track: "VIP Boardroom 4",
      time: "02:15 PM", 
      status: "Upcoming",
      watchers: 410,
      description: "Private executive roundtable unpacking zero-knowledge turnstile authentications and QR wallet array bindings.",
      resources: ["ZK Payload Signature Spec"]
    }
  ]);

  // View state controllers
  const [activeSessionTab, setActiveSessionTab] = useState<string>("All Tracks");
  const [selectedSessionInspect, setSelectedSessionInspect] = useState<any | null>(null);

  // ── SIMULATED LIVE STREAM VIEW & Q&A DECK STATE ──
  const [watchingLiveId, setWatchingLiveId] = useState<string | null>(null);
  const [qaInputString, setQaInputString]   = useState("");
  const [qaQuestions, setQaQuestions]       = useState([
    { id: "q-1", user: "Michael Chen", text: "How does the node partition schema handle sudden state restarts?", time: "10:32 AM", votes: 14 },
    { id: "q-2", user: "Elena Rostova", text: "Are the proxy metrics fully observable via open telemetry hooks?", time: "10:35 AM", votes: 9 }
  ]);

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaInputString.trim()) return;
    setQaQuestions(prev => [
      ...prev,
      { id: `q-gen-${Date.now()}`, user: "You (Delegate)", text: qaInputString, time: "Just Now", votes: 1 }
    ]);
    setQaInputString("");
    toast.success("Delegate priority question added to speaker view stream!");
  };

  const handleVoteQuestion = (id: string) => {
    setQaQuestions(prev => prev.map(q => q.id === id ? { ...q, votes: q.votes + 1 } : q));
    toast.info("Upvoted question metric.");
  };

  // ── DELEGATE PEER NETWORKING ENGINE STATE ──
  const [peersList, setPeersList] = useState([
    { id: "pr-1", name: "David Kim", role: "Principal Systems Designer", company: "Aethel Systems", avatar: "https://i.pravatar.cc/100?img=12", track: "Pro Delegate", status: "Available for Chat" },
    { id: "pr-2", name: "Claire Dupont", role: "VP Infrastructure", company: "CloudScale Europe", avatar: "https://i.pravatar.cc/100?img=47", track: "VIP Premium", status: "In Session" },
    { id: "pr-3", name: "Vikram Malhotra", role: "Chief Security Officer", company: "CyberDefense Labs", avatar: "https://i.pravatar.cc/100?img=60", track: "Pro Delegate", status: "Available for Chat" }
  ]);

  const handleSendPeerInvite = (peerName: string) => {
    toast.success(`Encrypted VIP networking invite dispatched to ${peerName}. Companion notification active.`);
  };

  // Helper trigger for downloading materials
  const handleTriggerResourceDownload = (resName: string) => {
    toast.success(`Successfully retrieved resource block: "${resName}". Stream saved.`);
  };

  // Sovereign badge wallet inspection modal toggle
  const [showBadgeWallet, setShowBadgeWallet] = useState(false);

  // ── DELEGATE BOOKING & LOGISTICS STATE ──
  const [hasPremiumPass, setHasPremiumPass] = useState(false);
  const [showLogisticsPromo, setShowLogisticsPromo] = useState(false);
  const [promoEvent, setPromoEvent] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("eventflow_pro_user_bookings_v1");
    if (raw) {
       const tickets = JSON.parse(raw);
       const delegateTicket = tickets.find((t: any) => t.role === "delegate" && t.eventId === currentEvent.id);
       
       if (delegateTicket) {
          setHasPremiumPass(true);
          
          // Show promo for the most recent booking if not skipped
          const skip = localStorage.getItem(`eventflow_pro_delegate_skip_promo_${currentEvent.id}`);
          if (skip !== "true") {
             setPromoEvent(currentEvent);
             setShowLogisticsPromo(true);
          }
       }
    }
  }, [currentEvent.id]);

  return (
    <DashboardShell 
      title="Delegate Access Command" 
      subtitle="Interact with premium track streams, trigger real-time Q&A priority sub-layers, audit research resource vaults, and coordinate secure peer-to-peer enterprise handshakes."
    >
      {/* ── TOP BANNER: HERO BADGE IDENTITY CARD ── */}
      <GlassCard className="p-6 md:p-8 bg-primary/5 border-primary/30 overflow-hidden relative mb-8" hover={false}>
         <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
           <ShieldCheck className="h-40 w-40 text-primary" />
         </div>
         
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="min-w-0 flex-1">
               <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary text-white font-mono shadow-sm">
                    PRO ACCESS DELEGATE
                  </span>
                  {hasPremiumPass && (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white font-mono shadow-glow-sm flex items-center gap-1.5">
                      <Award className="h-3 w-3" /> PREMIUM PASS
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-muted-foreground uppercase font-mono tracking-wider">
                    ID: #{currentEvent.id.toUpperCase()}-D-1029
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20 hidden sm:block">
                    Turnstile Cleared
                  </span>
               </div>
               
               <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight truncate max-w-full">
                 {currentEvent.title}
               </h2>
               <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
                 {currentEvent.tagline}
               </p>

               <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-foreground/80">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary shrink-0" /> {currentEvent.date}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary shrink-0" /> {currentEvent.venue} ({currentEvent.city})
                  </span>
               </div>
            </div>

            {/* Quick action controls side panel */}
            <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-4 border-t sm:border-t-0 sm:border-l border-border/40 sm:pl-6">
               <div className="text-left sm:text-right min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Verified Identity
                  </span>
                  <span className="text-xs font-black text-foreground truncate block">
                    Olivia Bennett
                  </span>
               </div>

               <GradientButton 
                 onClick={() => setShowBadgeWallet(true)}
                 size="sm"
                 className="h-9 px-4 text-xs shrink-0"
               >
                  <QrCode className="h-3.5 w-3.5 mr-1.5" /> Inspect Secure Badge
               </GradientButton>
            </div>
         </div>
      </GlassCard>

      <div className="grid lg:grid-cols-12 gap-8">
         
         {/* LEFT MAIN COL: LIVE STREAMS ENGINE & AGENDA TRACKING */}
         <div className="lg:col-span-8 space-y-6">
            
            {/* Live Interactive Watch Window (Simulated if watchingLiveId is activated) */}
            <AnimatePresence mode="wait">
              {watchingLiveId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-2xl glass border border-primary/40 overflow-hidden bg-background shadow-lg"
                >
                  {/* Top video feed simulation envelope */}
                  <div className="h-64 sm:h-80 bg-neutral-950 relative flex flex-col items-center justify-center border-b border-border">
                     {/* Stream active watermark */}
                     <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-500 text-white animate-pulse font-mono flex items-center gap-1">
                           <span className="h-1.5 w-1.5 rounded-full bg-white shrink-0" /> Live Feed
                        </span>
                        <span className="px-2 py-0.5 rounded bg-neutral-900/80 text-white text-[9px] font-mono">
                           1080p60 Egress
                        </span>
                     </div>

                     <div className="absolute top-3 right-3 z-20">
                        <button 
                          onClick={() => setWatchingLiveId(null)}
                          className="h-8 w-8 rounded-lg bg-neutral-900/80 text-white/80 hover:text-white grid place-items-center transition-colors text-xs font-bold"
                          title="Exit stream window"
                        >
                           <X className="h-4 w-4" />
                        </button>
                     </div>

                     {/* Video background graphics representation */}
                     <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-950 to-neutral-900 opacity-60 pointer-events-none" />
                     <ShieldCheck className="h-28 w-28 text-primary/10 absolute stroke-[0.5]" />
                     
                     <div className="relative z-10 text-center max-w-md px-4 space-y-2">
                        <PlayCircle className="h-12 w-12 text-primary mx-auto animate-bounce opacity-80" />
                        <h4 className="text-sm font-bold text-white tracking-tight">
                           Streaming Target: {sessions.find(s => s.id === watchingLiveId)?.title}
                        </h4>
                        <p className="text-[10px] text-neutral-400 font-mono">
                           Speaker feed initialized. Secure token routing verification approved.
                        </p>
                     </div>

                     {/* Overlay bottom telemetry */}
                     <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-neutral-400 font-mono z-20">
                        <span>Speaker: {sessions.find(s => s.id === watchingLiveId)?.speaker.split(" ")[0]}</span>
                        <span className="text-emerald-500">● Optimal Latency 42ms</span>
                     </div>
                  </div>

                  {/* Bottom interactive deck: Live Speaker Q&A Priority Input */}
                  <div className="p-4 bg-accent/10 space-y-3">
                     <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                           <MessageSquare className="h-3.5 w-3.5 text-primary" /> Live Keynote Priority Questions Channel
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">{qaQuestions.length} Submitted</span>
                     </div>

                     {/* Questions queue stream */}
                     <div className="space-y-2 max-h-40 overflow-y-auto pr-1 no-scrollbar text-xs">
                        {qaQuestions.map(q => (
                           <div key={q.id} className="p-2.5 rounded-lg bg-background border border-border/60 flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                 <div className="flex items-center gap-2 mb-0.5">
                                    <span className={cn("text-[10px] font-bold truncate", q.user.includes("You") ? "text-primary" : "text-foreground")}>
                                       {q.user}
                                    </span>
                                    <span className="text-[9px] text-muted-foreground font-mono">{q.time}</span>
                                 </div>
                                 <p className="text-xs text-muted-foreground/90 font-sans leading-tight">
                                    {q.text}
                                 </p>
                              </div>

                              <button 
                                onClick={() => handleVoteQuestion(q.id)}
                                className="px-2 py-1 rounded bg-accent/40 text-[10px] font-mono font-bold text-muted-foreground hover:text-primary border border-border/40 shrink-0 flex items-center gap-1"
                                title="Upvote question priority"
                              >
                                 ▲ {q.votes}
                              </button>
                           </div>
                        ))}
                     </div>

                     {/* Post Question Form Input */}
                     <form onSubmit={handlePostQuestion} className="flex gap-2 pt-1 border-t border-border/40">
                        <input 
                          type="text"
                          value={qaInputString}
                          onChange={(e) => setQaInputString(e.target.value)}
                          placeholder="Ask speaker a question (Delegate passes hold priority indexing)..." 
                          className="flex-1 px-3 py-1.5 text-xs bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-medium"
                        />
                        <GradientButton type="submit" size="sm" className="h-8 px-3 text-xs shrink-0">
                           <Send className="h-3 w-3" />
                        </GradientButton>
                     </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Schedule Deck Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
               <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                     Assigned Target Summit Agenda & Track Access
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                     Delegate passes authorize live encrypted streaming links and automated keynote calendar synching.
                  </p>
               </div>

               {/* Track filters pillbar */}
               <div className="flex items-center gap-1 shrink-0">
                  {["All Tracks", "Live Now", "Pro Room B"].map(tab => (
                     <button
                       key={tab}
                       onClick={() => setActiveSessionTab(tab)}
                       className={cn(
                         "px-2.5 py-1 rounded-lg text-xs font-bold transition-all",
                         activeSessionTab === tab ? "bg-primary text-white shadow-sm" : "bg-background text-muted-foreground hover:text-foreground border border-border/60"
                       )}
                     >
                        {tab}
                     </button>
                  ))}
               </div>
            </div>

            {/* List of Sessions Nodes */}
            <div className="space-y-4">
               {sessions.map(ses => {
                  const isWatching = watchingLiveId === ses.id;
                  return (
                     <GlassCard 
                       key={ses.id} 
                       className={cn(
                         "p-5 transition-all flex flex-col justify-between gap-4 border",
                         ses.status === "Live Now" ? "border-rose-500/30 bg-rose-500/[0.02]" : "border-border/40 hover:border-primary/30"
                       )}
                       hover={false}
                     >
                        <div>
                           <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2 flex-wrap min-w-0">
                                 <span className={cn(
                                   "text-[9px] font-bold px-2 py-0.2 rounded uppercase font-mono tracking-wider shrink-0",
                                   ses.status === "Live Now" ? "bg-rose-500 text-white animate-pulse" : "bg-accent text-muted-foreground"
                                 )}>
                                    {ses.status}
                                 </span>
                                 <span className="text-xs font-bold text-primary font-mono truncate">
                                    {ses.track}
                                 </span>
                              </div>

                              <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-mono shrink-0">
                                 <Clock className="h-3 w-3 shrink-0" /> {ses.time}
                              </div>
                           </div>

                           <h4 className="text-base font-bold text-foreground tracking-tight leading-tight">
                              {ses.title}
                           </h4>
                           <p className="text-xs text-muted-foreground font-medium mt-1">
                              Speaker: {ses.speaker}
                           </p>
                           <p className="text-[11px] text-muted-foreground/80 line-clamp-2 mt-2 leading-relaxed">
                              "{ses.description}"
                           </p>
                        </div>

                        {/* Node Footer Controls */}
                        <div className="pt-3 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                           {/* Companion Documents List inside Node */}
                           <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar min-w-0">
                              <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground shrink-0">Handouts:</span>
                              {ses.resources.map((res, i) => (
                                 <button
                                   key={i}
                                   onClick={() => handleTriggerResourceDownload(res)}
                                   className="px-2 py-0.5 rounded bg-accent/40 border border-border text-[10px] font-mono text-muted-foreground hover:text-foreground shrink-0 transition-colors flex items-center gap-1"
                                 >
                                    <FileText className="h-2.5 w-2.5 text-primary" /> {res.split(" ")[0]}
                                 </button>
                              ))}
                           </div>

                           <div className="flex items-center gap-2 shrink-0 justify-end">
                              <button
                                onClick={() => setSelectedSessionInspect(ses)}
                                className="px-3 py-1 rounded-lg bg-background text-foreground text-xs font-bold border border-border hover:border-primary transition-colors"
                              >
                                 Inspect Specs
                              </button>

                              {ses.status === "Live Now" ? (
                                 <GradientButton
                                   onClick={() => {
                                     setWatchingLiveId(isWatching ? null : ses.id);
                                     window.scrollTo({ top: 250, behavior: "smooth" });
                                   }}
                                   size="sm"
                                   className="h-8 px-3 text-xs"
                                 >
                                    {isWatching ? "Close Stream" : "Watch Live Stream"} <PlayCircle className="ml-1 h-3.5 w-3.5" />
                                 </GradientButton>
                              ) : (
                                 <button
                                   onClick={() => toast.success(`Reminder alert mapped for ${ses.time}. Calendar block synchronized.`)}
                                   className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs border border-primary/20 hover:bg-primary hover:text-white transition-colors"
                                 >
                                    Remind Schedule
                                 </button>
                              )}
                           </div>
                        </div>
                     </GlassCard>
                  );
               })}
            </div>
         </div>

         {/* RIGHT MAIN COL: RESOURCE VAULT & VIP PEER MATCHMAKING */}
         <div className="lg:col-span-4 space-y-6">
            
            {/* Delegate Resource Files Vault */}
            <GlassCard className="p-5 border-border/40" hover={false}>
               <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                     <Download className="h-4 w-4 text-primary" /> Delegate Vault
                  </h3>
                  <span className="text-[10px] font-mono text-muted-foreground font-bold">3 Master Packs</span>
               </div>
               
               <p className="text-[11px] text-muted-foreground mb-3 leading-tight">
                  Authenticated passholders extract compiled executive packets and raw slide binaries directly.
               </p>

               <div className="space-y-2">
                  {[
                    { label: "Master Speaker Slides Bundles (v1.2)", bytes: "42.1 MB" },
                    { label: "Technical Research Abstracts Compendium", bytes: "18.4 MB" },
                    { label: "VIP Track Mixer Access Rules & Roster", bytes: "2.1 MB" }
                  ].map((res, idx) => (
                     <button
                       key={idx}
                       onClick={() => handleTriggerResourceDownload(res.label)}
                       className="w-full p-2.5 rounded-xl bg-background border border-border/60 hover:border-primary/40 transition-all flex items-center justify-between gap-3 text-left group"
                     >
                        <div className="min-w-0 flex items-center gap-2.5">
                           <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                           <div className="min-w-0">
                              <span className="text-xs font-bold text-foreground truncate block group-hover:text-primary transition-colors">
                                 {res.label}
                              </span>
                              <span className="text-[9px] text-muted-foreground font-mono block">
                                 Archive Payload · {res.bytes}
                              </span>
                           </div>
                        </div>
                        
                        <Download className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-1" />
                     </button>
                  ))}
               </div>
            </GlassCard>

            {/* EXCLUSIVE PEER MATCHMAKING ENGINE */}
            <GlassCard className="p-5 bg-primary/[0.02] border-primary/20" hover={false}>
               <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-2">
                     <Users className="h-4 w-4 shrink-0" /> Enterprise Network Hub
                  </h3>
                  <span className="text-[9px] font-bold px-2 py-0.2 rounded font-mono uppercase bg-primary/10 text-primary border border-primary/20">
                     VIP Match
                  </span>
               </div>

               <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                  Sovereign registration tags authorize mutual direct handshake exchanges. Audit high-profile delegates below sharing target track priorities.
               </p>

               {/* Render peers roster */}
               <div className="space-y-3">
                  {peersList.map(peer => (
                     <div 
                       key={peer.id} 
                       className="p-3 rounded-xl bg-background border border-border flex flex-col justify-between gap-2.5 group hover:border-primary/30 transition-all"
                     >
                        <div className="flex items-start gap-3">
                           <img src={peer.avatar} alt="" className="h-9 w-9 rounded-lg object-cover ring-1 ring-border shrink-0 mt-0.5" />
                           <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                 <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                    {peer.name}
                                 </h4>
                                 <span className="text-[9px] text-muted-foreground font-mono shrink-0">
                                    {peer.track}
                                 </span>
                              </div>
                              <p className="text-[10px] text-muted-foreground font-medium truncate">
                                 {peer.role}
                              </p>
                              <p className="text-[10px] text-primary/80 font-mono font-semibold truncate">
                                 🏢 {peer.company}
                              </p>
                           </div>
                        </div>

                        <div className="pt-1.5 border-t border-border/40 flex items-center justify-between text-[10px]">
                           <span className={cn(
                             "font-bold font-mono",
                             peer.status.includes("Available") ? "text-emerald-500" : "text-amber-500"
                           )}>
                              ● {peer.status}
                           </span>

                           <button
                             onClick={() => handleSendPeerInvite(peer.name)}
                             className="text-muted-foreground hover:text-primary font-bold flex items-center gap-1 transition-colors"
                           >
                              <UserPlus className="h-3 w-3" /> Connect Peer
                           </button>
                        </div>
                     </div>
                  ))}
               </div>

               <GradientButton 
                 onClick={() => toast.info("Opening full enterprise matching index catalog...")}
                 size="sm"
                 className="w-full mt-4 h-8 text-xs"
               >
                  Load 42 More Industry Peers
               </GradientButton>
            </GlassCard>

            {/* Static Companion Telemetry */}
            <div className="p-4 rounded-xl glass border border-border/40 text-xs space-y-2">
               <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Delegate Proximity Rules
               </span>
               <div className="flex justify-between items-center text-muted-foreground">
                  <span>Lounge Entry:</span>
                  <span className="font-bold text-foreground font-mono">Cleared Hall C</span>
               </div>
               <div className="flex justify-between items-center text-muted-foreground">
                  <span>Banquet Allocation:</span>
                  <span className="font-bold text-foreground font-mono">Table Tier 2</span>
               </div>
            </div>
         </div>
      </div>

      {/* ── OVERLAY MODAL: INSPECT SESSION SPECS DECK ── */}
      <AnimatePresence>
        {selectedSessionInspect && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedSessionInspect(null)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 20, stiffness: 320 }}
              className="relative w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl z-10 overflow-hidden p-6"
            >
               <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/60 mb-4">
                  <div className="min-w-0">
                     <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 font-mono block w-fit mb-1">
                        Track Specification
                     </span>
                     <h3 className="text-base font-bold text-foreground tracking-tight truncate">
                        {selectedSessionInspect.title}
                     </h3>
                     <p className="text-xs text-muted-foreground mt-0.5">Speaker Node: {selectedSessionInspect.speaker}</p>
                  </div>
                  <button onClick={() => setSelectedSessionInspect(null)} className="text-muted-foreground hover:text-foreground shrink-0">
                     <X className="h-4 w-4" />
                  </button>
               </div>

               <div className="space-y-4 text-xs">
                  <div>
                     <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Abstract Audit Description
                     </span>
                     <p className="p-3 rounded-xl bg-accent/20 border border-border text-muted-foreground leading-relaxed font-sans">
                        "{selectedSessionInspect.description}"
                     </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono">
                     <div className="p-2.5 rounded-xl bg-background border border-border">
                        <span className="text-[9px] text-muted-foreground block font-sans uppercase">Broadcast Node</span>
                        <span className="font-bold text-foreground truncate block">{selectedSessionInspect.track}</span>
                     </div>
                     <div className="p-2.5 rounded-xl bg-background border border-border">
                        <span className="text-[9px] text-muted-foreground block font-sans uppercase">Timeline Trigger</span>
                        <span className="font-bold text-primary block">{selectedSessionInspect.time}</span>
                     </div>
                  </div>

                  <div className="p-3 rounded-xl bg-accent/10 border border-border text-[10px] text-muted-foreground leading-tight flex items-center gap-2">
                     <Sparkles className="h-4 w-4 text-primary shrink-0" />
                     <span>Delegate badges automatically inherit priority bandwidth routing guarantees for live Q&A submission logs.</span>
                  </div>
               </div>

               <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground font-mono">Watchers Count: {selectedSessionInspect.watchers}</span>
                  <GradientButton
                    onClick={() => {
                      const tgtId = selectedSessionInspect.id;
                      setSelectedSessionInspect(null);
                      if (selectedSessionInspect.status === "Live Now") {
                        setWatchingLiveId(tgtId);
                        window.scrollTo({ top: 250, behavior: "smooth" });
                      } else {
                        toast.success("Schedule reminders stored.");
                      }
                    }}
                    size="sm"
                    className="h-8 px-4 text-xs"
                  >
                     {selectedSessionInspect.status === "Live Now" ? "Load Live Feed Stream" : "Acknowledge Specs"}
                  </GradientButton>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── OVERLAY MODAL: SOVEREIGN DELEGATE ID WALLET PREVIEW ── */}
      <AnimatePresence>
        {showBadgeWallet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowBadgeWallet(false)}
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
                <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase">Delegate Access Credential</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                  Pro Access Delegate
                </span>
              </div>

              {/* QR Rendering block */}
              <div className="my-5 p-4 rounded-2xl bg-white border border-border w-48 h-48 flex flex-col items-center justify-center relative shadow-inner">
                <QrCode className="h-40 w-40 text-neutral-950 stroke-1" />
              </div>

              <h3 className="font-black text-base text-foreground tracking-tight">Olivia Bennett</h3>
              <p className="text-[11px] font-mono font-bold text-primary mt-0.5 truncate max-w-full px-2">
                #{currentEvent.id.toUpperCase()}-D-1029
              </p>
              
              <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                <CheckCircle2 className="h-3 w-3 stroke-[3]" /> Turnstiles Verification Active
              </div>

              <div className="w-full mt-4 pt-3 border-t border-border/40 text-left space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between font-mono">
                   <span>Host Bounds:</span>
                   <span className="font-bold text-foreground">{currentEvent.title}</span>
                </div>
                <div className="flex justify-between font-mono">
                   <span>Track Authorization:</span>
                   <span className="font-bold text-foreground">VIP Pro Access Control</span>
                </div>
              </div>

              <button
                onClick={() => setShowBadgeWallet(false)}
                className="w-full mt-5 py-2 rounded-xl bg-accent text-foreground text-xs font-bold hover:bg-accent/80 transition-colors border border-border"
              >
                Dismiss Key Wallet
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PREMIUM LOGISTICS PROMOTION MODAL */}
      <AnimatePresence>
        {showLogisticsPromo && promoEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowLogisticsPromo(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg relative z-10"
            >
              <GlassCard className="p-10 border-primary/30 shadow-2xl relative overflow-hidden" hover={false}>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />
                
                <div className="text-center relative z-10">
                  <div className="h-20 w-20 bg-gradient-to-br from-amber-500 to-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow rotate-3 ring-4 ring-amber-500/20">
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-foreground">Premium Logistics</h2>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed font-medium">
                    As a <span className="text-primary font-black uppercase">Corporate Delegate</span> for <span className="text-foreground font-black">{promoEvent.title}</span>, 
                    you have priority access to executive hotel blocks and luxury shuttle services.
                  </p>

                  <div className="mt-12 space-y-4">
                    <Link 
                      href={`/hotels-travel-catalog?event=${promoEvent.id}&tier=premium`}
                      onClick={() => setShowLogisticsPromo(false)}
                      className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-glow flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Explore Premium Facilities <ChevronRight className="h-5 w-5" />
                    </Link>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowLogisticsPromo(false)}
                        className="flex-1 h-12 rounded-xl bg-accent/30 text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-accent/50 transition-all"
                      >
                        Maybe Later
                      </button>
                      <button 
                        onClick={() => {
                          localStorage.setItem(`eventflow_pro_delegate_skip_promo_${promoEvent.id}`, "true");
                          setShowLogisticsPromo(false);
                        }}
                        className="flex-1 h-12 rounded-xl border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
                      >
                        Don't show again
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}
