"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Ticket, MapPin, Download, ChevronRight, 
  Hotel, Plane, QrCode, ShieldCheck, 
  CheckCircle2, Loader2, Award, FileText, 
  Smartphone, X, Check, ArrowUpRight, Calendar, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events } from "@/data/mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function VisitorDashboard() {
  const router = useRouter();

  // ── BOOKED TICKETS EXCLUSIVE STATE ──
  // Contains passes successfully authorized post-payment settlement
   // Contains passes successfully authorized post-payment settlement
  const [bookedTickets, setBookedTickets] = useState<any[]>([]);
  const [showLogisticsPromo, setShowLogisticsPromo] = useState(false);
  const [promoEvent, setPromoEvent] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("eventflow_pro_user_bookings_v1");
    if (raw) {
       const tickets = JSON.parse(raw);
       setBookedTickets(tickets);
       
       // Show promo for the most recent booking if not skipped
       if (tickets.length > 0) {
          const latest = tickets[0];
          const skip = localStorage.getItem(`eventflow_pro_visitor_skip_promo_${latest.eventId}`);
          if (skip !== "true") {
             const ev = events.find(e => e.id === latest.eventId);
             if (ev) {
               setPromoEvent(ev);
               setShowLogisticsPromo(true);
             }
          }
       }
    }
  }, []);

  // View wallet state controller
  const [previewTicketObj, setPreviewTicketObj] = useState<any | null>(null);

  // ── VOLUNTEER TURNSTILE SCANNER DEMO STATE ──
  const [scannerOpen, setScannerOpen]               = useState(false);
  const [selectedScanToken, setSelectedScanToken]   = useState("");
  const [scanResultState, setScanResultState]       = useState<"idle" | "scanning" | "granted" | "denied">("idle");
  const [scannedTicketData, setScannedTicketData]   = useState<any | null>(null);

  const executeSimulatedGateScan = () => {
    if (!selectedScanToken) return;
    setScanResultState("scanning");

    setTimeout(() => {
      const matched = bookedTickets.find(t => t.qrCode === selectedScanToken);
      if (matched && matched.paymentStatus === "Payment Approved") {
        setScannedTicketData(matched);
        setScanResultState("granted");
        toast.success("Turnstile gate opened! Identity footprint fully verified.");
      } else {
        setScannedTicketData(null);
        setScanResultState("denied");
        toast.error("Decryption failed: Signature missing payment settlement state.");
      }
    }, 1200);
  };

  const handleDownloadInvoice = (tk: any, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(`E-Ticket invoice setup for "${tk.passTier}" exported. Check active download logs.`);
  };

  return (
    <DashboardShell 
      title="My Booked Passes & Companion Facilities" 
      subtitle="Access guaranteed attendance keycards, real-time dynamic turnstile QR strings, and utilize personalized corporate hotel and shuttle blocks."
    >
      {/* ── TOP LEVEL BANNER: VOLUNTEER SCAN GATE TRIGGER ── */}
      <div className="p-4 rounded-2xl glass border border-primary/30 bg-primary/5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
           <Smartphone className="h-20 w-20 rotate-12" />
        </div>
        <div className="flex items-start sm:items-center gap-3 relative z-10">
          <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-glow-sm">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">Simulate On-Site Gate Scanner</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded font-mono uppercase bg-accent text-primary">Volunteer App Tool</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Test automated physical entry workflow. Volunteers scan generated QR badges to fetch real-time matching payment authorization logic.
            </p>
          </div>
        </div>

        <GradientButton 
          onClick={() => {
            if (bookedTickets.length > 0) {
              setSelectedScanToken(bookedTickets[0].qrCode);
            }
            setScannerOpen(true);
            setScanResultState("idle");
          }} 
          size="sm" 
          className="shrink-0 text-xs h-9 px-4 relative z-10"
        >
          Launch Turnstile Scanner
        </GradientButton>
      </div>

      {/* ── HEADER NAVIGATION EXTENSION LINK ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 p-4 rounded-xl bg-accent/20 border border-border/60">
        <div className="flex items-center gap-2.5">
          <Ticket className="h-4 w-4 text-primary shrink-0" />
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Exclusive Roster View
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Showing strictly authorized credential wallets linked to active pass payments.
            </p>
          </div>
        </div>

        <Link href="/events">
          <button className="px-3 py-1.5 rounded-lg bg-background border border-border text-xs font-bold text-primary hover:border-primary transition-colors flex items-center gap-1.5 shrink-0">
            <Calendar className="h-3.5 w-3.5" /> Explore & Book New Events <ArrowUpRight className="h-3 w-3" />
          </button>
        </Link>
      </div>

      {/* ── EXCLUSIVE INVENTORY MATRIX ── */}
      <div className="space-y-6">
        {bookedTickets.length === 0 ? (
          <div className="p-12 text-center glass rounded-2xl border border-dashed border-border max-w-xl mx-auto space-y-3">
            <Award className="h-10 w-10 text-muted-foreground/30 mx-auto" />
            <h3 className="text-sm font-bold text-foreground">Your badge ledger is currently vacant.</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Slots map automatically onto this interface immediately after validating checkout settlement queues.
            </p>
            <div className="pt-2">
              <Link href="/events">
                <GradientButton size="sm" className="h-9 px-6 text-xs">
                  Browse Worldwide Expos Catalog
                </GradientButton>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {bookedTickets.map((tk) => {
              const matchedEvent = events.find(e => e.id === tk.eventId);
              return (
                <motion.div 
                  key={tk.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-[32px] glass border border-border hover:border-primary/40 transition-all flex flex-col relative overflow-hidden group shadow-lg"
                >
                  {/* Decorative background image for the card */}
                  <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                     <img src={matchedEvent?.image} className="w-full h-full object-cover grayscale" alt="" />
                  </div>

                  <div className="p-8 relative z-10">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-primary text-white shadow-glow-sm">
                            {tk.passTier}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 stroke-[3]" /> {tk.paymentStatus}
                          </span>
                        </div>

                        <h4 className="text-2xl font-black text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors">
                          {matchedEvent ? matchedEvent.title : "Global Summit Scope"}
                        </h4>
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground font-bold uppercase tracking-widest">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-primary shrink-0" /> {matchedEvent?.city || "San Francisco"}
                          </span>
                          <span className="text-primary/40">/</span>
                          <span>{matchedEvent?.date || "TBD"}</span>
                        </div>
                      </div>

                      {/* View full QR badge shortcut button */}
                      <button 
                        onClick={() => setPreviewTicketObj(tk)}
                        className="h-14 w-14 rounded-2xl bg-accent/40 border border-border grid place-items-center text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all shrink-0 shadow-sm"
                        title="Display Secure Gateway Key"
                      >
                        <QrCode className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                       <div className="p-4 rounded-2xl bg-accent/10 border border-border/40">
                          <p className="text-[9px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Attendee</p>
                          <p className="text-sm font-black text-foreground truncate">{tk.attendeeName}</p>
                       </div>
                       <div className="p-4 rounded-2xl bg-accent/10 border border-border/40">
                          <p className="text-[9px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Gateway Token</p>
                          <p className="text-sm font-mono font-black text-primary truncate">{tk.qrCode}</p>
                       </div>
                    </div>

                    {/* ── INTEGRATED COMPANION SUITE: HOTEL & TRAVEL TRIGGERS ── */}
                    <div className="space-y-3 pt-6 border-t border-border/40">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                           Logistics Partners
                         </span>
                         <span className="text-[9px] font-bold text-primary flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" /> EventFlow Verified
                         </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Hotel Recommendation Block */}
                        <div className="p-4 rounded-2xl bg-background/50 border border-border flex flex-col justify-between hover:bg-background transition-all">
                          <div>
                            <div className="flex items-center gap-2 text-xs font-black text-foreground mb-2 uppercase tracking-tight">
                              <Hotel className="h-4 w-4 text-blue-500 shrink-0" />
                              <span>Accommodation</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-medium leading-relaxed mb-4">
                              Exclusive blocks near {matchedEvent?.venue || "venue"}. Save up to 40% with delegate rates.
                            </p>
                          </div>
                          <button 
                            onClick={() => router.push(`/hotels-travel-catalog?filter=hotel&event=${tk.eventId}`)}
                            className="w-full text-[10px] py-2.5 rounded-xl bg-primary/5 text-primary font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-primary/20"
                          >
                            Book Hotel
                          </button>
                        </div>

                        {/* Travel Shuttle Recommendation Block */}
                        <div className="p-4 rounded-2xl bg-background/50 border border-border flex flex-col justify-between hover:bg-background transition-all">
                          <div>
                            <div className="flex items-center gap-2 text-xs font-black text-foreground mb-2 uppercase tracking-tight">
                              <Plane className="h-4 w-4 text-purple-500 shrink-0" />
                              <span>Transit Hub</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-medium leading-relaxed mb-4">
                              Priority shuttle loops from {matchedEvent?.city || "Airport"} directly to the event hall.
                            </p>
                          </div>
                          <button 
                            onClick={() => router.push(`/hotels-travel-catalog?filter=travel&event=${tk.eventId}`)}
                            className="w-full text-[10px] py-2.5 rounded-xl bg-purple-500/5 text-purple-600 font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all border border-purple-500/20"
                          >
                            Reserve Seat
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirmed Roster Action Footer */}
                  <div className="px-8 py-5 bg-accent/5 border-t border-border/60 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                       <span className="text-[10px] font-black uppercase text-muted-foreground">Paid:</span>
                       <span className="text-sm font-black text-foreground">{tk.pricePaid}</span>
                    </div>
                    <button 
                      onClick={(e) => handleDownloadInvoice(tk, e)}
                      className="text-primary hover:text-primary-dark font-black uppercase tracking-widest text-[10px] flex items-center gap-2 group/btn"
                    >
                      <Download className="h-4 w-4 group-hover/btn:translate-y-0.5 transition-transform" /> E-Badge & Invoice
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* LOGISTICS PROMOTION MODAL */}
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
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
                
                <div className="text-center relative z-10">
                  <div className="h-20 w-20 bg-gradient-to-br from-primary to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow rotate-3">
                    <Hotel className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-foreground">Complete Your Trip</h2>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed font-medium">
                    You've successfully booked your pass for <span className="text-foreground font-black">{promoEvent.title}</span>! 
                    Would you like to explore exclusive partner hotels and travel facilities near the venue?
                  </p>

                  <div className="mt-12 space-y-4">
                    <button 
                      onClick={() => {
                        setShowLogisticsPromo(false);
                        router.push(`/hotels-travel-catalog?event=${promoEvent.id}`);
                      }}
                      className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-glow flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Explore Logistics <ArrowRight className="h-5 w-5" />
                    </button>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          setShowLogisticsPromo(false);
                        }}
                        className="flex-1 h-12 rounded-xl bg-accent/30 text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-accent/50 transition-all"
                      >
                        Maybe Later
                      </button>
                      <button 
                        onClick={() => {
                          localStorage.setItem(`eventflow_pro_visitor_skip_promo_${promoEvent.id}`, "true");
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

      {/* ── OVERLAY MODAL: EVENT VOLUNTEER TURNSTILE SCANNER TOOL DEMO ── */}
      <AnimatePresence>
        {scannerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => scanResultState !== "scanning" && setScannerOpen(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 20, stiffness: 320 }}
              className="relative w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl z-10 overflow-hidden p-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-primary" /> Event Volunteer Verification Handshake
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Physical Gate System App Interface</p>
                </div>
                <button onClick={() => setScannerOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Target Booked QR String Token to Scan
                  </label>
                  <select
                    value={selectedScanToken}
                    onChange={(e) => {
                      setSelectedScanToken(e.target.value);
                      setScanResultState("idle");
                    }}
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl text-foreground font-mono font-bold outline-none focus:border-primary transition-all"
                  >
                    <option value="" disabled>Select a token string...</option>
                    {bookedTickets.map(tk => (
                      <option key={tk.id} value={tk.qrCode}>
                        🔑 {tk.attendeeName} ({tk.passTier})
                      </option>
                    ))}
                    <option value="QR_DUMMY_EXPIRED_SIGNATURE_888991">
                      ⚠️ DUMMY_EXPIRED_UNPAID_SIGNATURE (Simulate Failure)
                    </option>
                  </select>
                </div>

                {/* Animated Simulation button */}
                <GradientButton
                  onClick={executeSimulatedGateScan}
                  disabled={scanResultState === "scanning" || !selectedScanToken}
                  size="sm"
                  className="w-full h-10 text-xs"
                >
                  {scanResultState === "scanning" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Decrypting Payment Footprint...
                    </>
                  ) : (
                    "Trigger Volunteer QR Scan"
                  )}
                </GradientButton>

                {/* Telemetry Output Display */}
                <AnimatePresence mode="wait">
                  {scanResultState === "granted" && scannedTicketData && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500 text-center space-y-2 mt-4"
                    >
                      <div className="h-8 w-8 rounded-full bg-emerald-500 text-white grid place-items-center mx-auto shadow-sm">
                        <Check className="h-4 w-4 stroke-[3]" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-500 block">
                        ACCESS GRANTED
                      </span>
                      <p className="text-[11px] text-foreground font-medium">
                        QR matches verified payment state. Welcome to the hall!
                      </p>
                      <div className="bg-background/80 p-2 rounded-lg border border-border/40 text-[10px] text-left mt-2 space-y-0.5 font-mono">
                        <div><span className="text-muted-foreground">Attendee:</span> {scannedTicketData.attendeeName}</div>
                        <div><span className="text-muted-foreground">Cleared Level:</span> {scannedTicketData.passTier}</div>
                        <div><span className="text-muted-foreground">Settlement Check:</span> {scannedTicketData.paymentStatus}</div>
                      </div>
                    </motion.div>
                  )}

                  {scanResultState === "denied" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 rounded-xl bg-rose-500/10 border border-rose-500 text-center space-y-1.5 mt-4"
                    >
                      <span className="text-xs font-black uppercase tracking-wider text-rose-500 block">
                        ACCESS DENIED
                      </span>
                      <p className="text-[11px] text-foreground font-medium">
                        Signature verification checks aborted. Token string lacks matching approved settlement logs.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-6 pt-3 border-t border-border/60 text-center">
                <button
                  onClick={() => setScannerOpen(false)}
                  className="text-[10px] text-muted-foreground hover:text-foreground font-bold"
                >
                  Dismiss Volunteer Screen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── OVERLAY MODAL: PREVIEW E-TICKET QR WALLET VIEW MODAL ── */}
      <AnimatePresence>
        {previewTicketObj && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPreviewTicketObj(null)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 20, stiffness: 320 }}
              className="relative w-full max-w-sm bg-background border border-border rounded-3xl shadow-2xl z-10 overflow-hidden text-center p-6 flex flex-col items-center"
            >
              {/* Top credential badge band */}
              <div className="w-full pb-3 border-b border-border/40 flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase">Secure E-Ticket Signature</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                  {previewTicketObj.passTier}
                </span>
              </div>

              {/* QR Rendering block */}
              <div className="my-5 p-4 rounded-2xl bg-white border border-border w-48 h-48 flex flex-col items-center justify-center relative shadow-inner">
                <QrCode className="h-40 w-40 text-neutral-950 stroke-1" />
              </div>

              <h3 className="font-black text-base text-foreground tracking-tight">{previewTicketObj.attendeeName}</h3>
              <p className="text-[11px] font-mono font-bold text-primary mt-0.5 truncate max-w-full px-2">{previewTicketObj.qrCode}</p>
              
              <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                <CheckCircle2 className="h-3 w-3 stroke-[3]" /> {previewTicketObj.paymentStatus} Verified
              </div>

              <div className="w-full mt-4 pt-3 border-t border-border/40 text-left space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Pass Architecture Access:</span>
                {previewTicketObj.inclusions?.map((inc: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] text-foreground font-medium">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" /> <span>{inc}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setPreviewTicketObj(null)}
                className="w-full mt-5 py-2 rounded-xl bg-accent text-foreground text-xs font-bold hover:bg-accent/80 transition-colors border border-border"
              >
                Close Digital Key Ring
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}
