"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Plus, Box, Info, CheckCircle2, 
  Layout, Image as ImageIcon, Video, FileText, 
  Scan, UserCheck, Flame, Sparkles, Trash2, 
  ChevronDown, Sliders, Camera, Check, Layers,
  User, Mail, Phone, Calendar, ArrowRight, ShieldCheck,
  CircleDot, X, Hotel, Plane, DollarSign, Search
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events } from "@/data/mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ExhibitorDashboard() {
  // ─── 1. State: Allocated Live Events Matrix ──────────────────────────────────
  const [participatedEvents, setParticipatedEvents] = useState([
    {
      eventId: "techsummit-26",
      boothNumber: "A-101",
      size: "30x30 ft",
      type: "Island Premium",
      hall: "Hall A - West Wing",
      status: "Confirmed & Rigged",
      brandingStatus: "Verified Live",
      passesClaimed: 4,
      passesLimit: 6,
      leadTarget: 200,
      initialRequirements: [
        { id: "req-1", label: "Reception Display Counter (Custom Branding)", category: "Furniture", fulfilled: true, cost: "Included" },
        { id: "req-2", label: "High-Back Executive Stools (Set of 4)", category: "Furniture", fulfilled: true, cost: "Included" },
        { id: "req-3", label: "Dedicated 15A High-Voltage Electrical Drop", category: "Technical", fulfilled: true, cost: "$350 Base" },
        { id: "req-4", label: "Ultra-Low Latency Wired Internet Link (1 Gbps)", category: "Technical", fulfilled: false, cost: "$450 Premium" },
        { id: "req-5", label: "Seamless 65-Inch 4K Commercial LED Monitor", category: "Technical", fulfilled: true, cost: "$600 Rental" }
      ]
    },
    {
      eventId: "designweek-26",
      boothNumber: "D-404",
      size: "20x20 ft",
      type: "Peninsula Prime",
      hall: "Pavilion 3 - Central",
      status: "Pending Final Staging",
      brandingStatus: "In Review",
      passesClaimed: 2,
      passesLimit: 4,
      leadTarget: 120,
      initialRequirements: [
        { id: "req-201", label: "Minimalist Modular Pedestals (3 units)", category: "Furniture", fulfilled: true, cost: "Included" },
        { id: "req-202", label: "Parametric Backlit Overhead Banner Mount", category: "Technical", fulfilled: false, cost: "$800 Custom" },
        { id: "req-203", label: "Standard Dual Power Outlets (10A)", category: "Technical", fulfilled: true, cost: "Included" },
        { id: "req-204", label: "High-Output Spotlighting Array (Warm White)", category: "Technical", fulfilled: false, cost: "$250 Base" }
      ]
    }
  ]);

  // Selected event scope context
  const [selectedEventId, setSelectedEventId] = useState("techsummit-26");

  const currentBoothConfig = useMemo(() => {
    return participatedEvents.find(p => p.eventId === selectedEventId) || participatedEvents[0];
  }, [participatedEvents, selectedEventId]);

  const currentEventMeta = useMemo(() => {
    return events.find(e => e.id === currentBoothConfig.eventId) || {
      title: "Enterprise Convention Suite",
      venue: "Global Operations Center",
      city: "Metropolis",
      date: "Upcoming Timeline"
    };
  }, [currentBoothConfig]);

  // ─── 2. State: Line-Item Utility Requests ────────────────────────────────────
  const handleToggleRequirement = (reqId: string) => {
    setParticipatedEvents(prev => prev.map(evt => {
      if (evt.eventId !== selectedEventId) return evt;
      return {
        ...evt,
        initialRequirements: evt.initialRequirements.map(req => {
          if (req.id !== reqId) return req;
          const nextState = !req.fulfilled;
          toast.success(`Requirement synced: ${req.label} is now ${nextState ? "Approved" : "Pending Vendor Setup"}`);
          return { ...req, fulfilled: nextState };
        })
      };
    }));
  };

  const [customReqLabel, setCustomReqLabel] = useState("");
  const handleAddNewRequirement = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customReqLabel.trim()) return;
    const newReq = {
      id: `req-custom-${Date.now()}`,
      label: customReqLabel,
      category: "Technical" as const,
      fulfilled: true,
      cost: "$150 Custom Order"
    };
    setParticipatedEvents(prev => prev.map(evt => {
      if (evt.eventId !== selectedEventId) return evt;
      return {
        ...evt,
        initialRequirements: [...evt.initialRequirements, newReq]
      };
    }));
    setCustomReqLabel("");
    toast.success("Extra booth addon provisioned successfully!");
  };

  // ─── 3. State: Captured Prospects Engine (CRM Suite) ─────────────────────────
  const [capturedLeads, setCapturedLeads] = useState([
    { id: "ld-1", eventId: "techsummit-26", name: "Marcus Chen", title: "VP of Cloud Scale", entity: "Nimbus Systems", email: "marcus@nimbus.dev", timestamp: "10:14 AM", temp: "Hot", photo: "https://i.pravatar.cc/80?img=11" },
    { id: "ld-2", eventId: "techsummit-26", name: "Sofia Romano", title: "Principal UX Architect", entity: "Studio Co", email: "sofia@studio.co", timestamp: "11:05 AM", temp: "Warm", photo: "https://i.pravatar.cc/80?img=32" },
    { id: "ld-3", eventId: "designweek-26", name: "Liam O'Connor", title: "Director of Delivery", entity: "Ember Labs", email: "liam@ember.io", timestamp: "Yesterday", temp: "Hot", photo: "https://i.pravatar.cc/80?img=8" },
    { id: "ld-4", eventId: "techsummit-26", name: "Elena Rostova", title: "Lead Cryptographer", entity: "Aura Ledger", email: "elena@auraledger.org", timestamp: "2 days ago", temp: "Cold", photo: "https://i.pravatar.cc/80?img=9" }
  ]);

  const eventCapturedLeads = useMemo(() => {
    return capturedLeads.filter(l => l.eventId === selectedEventId);
  }, [capturedLeads, selectedEventId]);

  // Quick manual input fields for CRM collection
  const [customLeadName, setCustomLeadName]     = useState("");
  const [customLeadTitle, setCustomLeadTitle]   = useState("");
  const [customLeadEntity, setCustomLeadEntity] = useState("");

  const handleSimulateQuickScan = (presetIndex: number) => {
    const presets = [
      { name: "Dr. Aiden Park", title: "Chief Distributed Systems Engineer", entity: "Orbit Core", email: "apark@orbitcore.ai", temp: "Hot", photo: "https://i.pravatar.cc/80?img=15" },
      { name: "Yuki Sato", title: "Head of Infrastructure Alliances", entity: "Kanji Digital", email: "yuki@kanjidev.jp", temp: "Warm", photo: "https://i.pravatar.cc/80?img=23" },
      { name: "Rachel Vance", title: "Managing Partner", entity: "Vance Ventures", email: "rvance@vancecap.com", temp: "Hot", photo: "https://i.pravatar.cc/80?img=44" }
    ];
    const target = presets[presetIndex % presets.length];
    const newObj = {
      id: `ld-scan-${Date.now()}`,
      eventId: selectedEventId,
      name: target.name,
      title: target.title,
      entity: target.entity,
      email: target.email,
      timestamp: "Just Now",
      temp: target.temp,
      photo: target.photo
    };
    setCapturedLeads(prev => [newObj, ...prev]);
    toast.success(`Scanned smart pass! Captured profile metadata for ${target.name}.`);
  };

  const handleManualLeadAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLeadName.trim()) return;
    const newObj = {
      id: `ld-manual-${Date.now()}`,
      eventId: selectedEventId,
      name: customLeadName,
      title: customLeadTitle || "Technical Liaison",
      entity: customLeadEntity || "Enterprise Vendor",
      email: `${customLeadName.toLowerCase().replace(/\s+/g, "")}@domain.io`,
      timestamp: "Just Now",
      temp: "Warm",
      photo: `https://i.pravatar.cc/80?img=${Math.floor(Math.random() * 45) + 1}`
    };
    setCapturedLeads(prev => [newObj, ...prev]);
    setCustomLeadName("");
    setCustomLeadTitle("");
    setCustomLeadEntity("");
    toast.success("Visitor details ingested successfully into real-time CRM ledger.");
  };

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

  // ─── 4. Application Modality Overlay ─────────────────────────────────────────
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Computed Progress KPIs
  const fulfilledCount = currentBoothConfig.initialRequirements.filter(r => r.fulfilled).length;
  const totalReqs      = currentBoothConfig.initialRequirements.length;
  const setupPercentage= totalReqs > 0 ? Math.round((fulfilledCount / totalReqs) * 100) : 100;
  const leadsCount     = eventCapturedLeads.length;
  const quotaPercentage= Math.min(100, Math.round((leadsCount / currentBoothConfig.leadTarget) * 100));

  // Compute total pricing dynamically for extra line items
  const dynamicExtrasSum = useMemo(() => {
    return currentBoothConfig.initialRequirements
      .filter(r => r.cost.startsWith("$"))
      .reduce((sum, item) => {
        const val = parseInt(item.cost.replace(/[^0-9]/g, ""), 10);
        return sum + (isNaN(val) ? 0 : val);
      }, 0);
  }, [currentBoothConfig.initialRequirements]);

  return (
    <DashboardShell 
      title="Exhibitor Operations Portal" 
      subtitle="Manage your allocated booth presence, branding uploads, dynamic staging extra costs, and trigger instant local QR lead capture arrays."
    >
      {/* ── HIGH FIDELITY TOP SCOPE SWITCHER BAR ── */}
      <GlassCard className="p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-border/40" hover={false}>
        <div className="flex items-center gap-3.5 pl-1">
          <div className="h-11 w-11 rounded-xl gradient-bg text-white grid place-items-center shadow-glow-sm shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Assigned Footprint Context</span>
              <span className="px-2 py-0.2 rounded text-[9px] font-bold font-mono bg-primary/10 text-primary border border-primary/20">
                {currentBoothConfig.size}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-base font-bold text-foreground tracking-tight">{currentEventMeta.title}</h2>
              <span className="text-xs text-muted-foreground font-medium truncate">· {currentBoothConfig.hall}</span>
            </div>
          </div>
        </div>

        {/* Dropdown Pivot */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground font-semibold hidden sm:inline-block">Switch Live Booth:</span>
          <div className="relative">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="pl-3.5 pr-8 py-2 bg-background border border-border rounded-xl text-xs font-bold text-foreground outline-none focus:border-primary transition-all appearance-none cursor-pointer shadow-sm font-mono"
            >
              {participatedEvents.map(p => {
                const matched = events.find(e => e.id === p.eventId);
                return (
                  <option key={p.eventId} value={p.eventId} className="bg-background text-foreground font-sans font-semibold">
                    📍 {matched ? matched.title : p.eventId} — Booth #{p.boothNumber}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </GlassCard>

      {/* ── GORGEOUS SETUP DIALS & KPI METRICS ROW ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Dial 1: Booth Setup Hardware Readiness */}
        <GlassCard className="p-5 flex flex-col justify-between relative overflow-hidden" hover={false}>
          <div className="absolute top-0 right-0 p-4 opacity-5"><Sliders className="h-20 w-20 text-primary" /></div>
          <div>
            <div className="flex items-center justify-between text-xs mb-2.5 font-bold uppercase tracking-wider text-muted-foreground">
              <span>Hardware Construction</span>
              <span className="text-primary font-mono font-black text-sm">{setupPercentage}% Ready</span>
            </div>
            <div className="h-2.5 w-full bg-accent/20 rounded-full overflow-hidden p-0.5 border border-border/40">
              <motion.div 
                className="h-full gradient-bg rounded-full shadow-glow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${setupPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Staging Status:</span>
            <span className="font-bold text-foreground">{currentBoothConfig.status}</span>
          </div>
        </GlassCard>

        {/* Dial 2: Assigned Staff Credentials */}
        <GlassCard className="p-5 flex flex-col justify-between relative overflow-hidden" hover={false}>
          <div className="absolute top-0 right-0 p-4 opacity-5"><UserCheck className="h-20 w-20 text-emerald-500" /></div>
          <div>
            <div className="flex items-center justify-between text-xs mb-2.5 font-bold uppercase tracking-wider text-muted-foreground">
              <span>Staff Passes Dispatched</span>
              <span className="text-emerald-500 font-mono font-black text-sm">{currentBoothConfig.passesClaimed} / {currentBoothConfig.passesLimit}</span>
            </div>
            <div className="h-2.5 w-full bg-accent/20 rounded-full overflow-hidden p-0.5 border border-border/40">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${(currentBoothConfig.passesClaimed / currentBoothConfig.passesLimit) * 100}%` }}
              />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Pass Limit Cap:</span>
            <span className="font-bold text-emerald-500">{currentBoothConfig.passesLimit - currentBoothConfig.passesClaimed} Allocations Left</span>
          </div>
        </GlassCard>

        {/* Dial 3: Dynamic Extras Payout & Cost Tracking */}
        <GlassCard className="p-5 flex flex-col justify-between relative overflow-hidden bg-primary/[0.02] border-primary/20" hover={false}>
          <div className="absolute top-0 right-0 p-4 opacity-5"><DollarSign className="h-20 w-20 text-primary" /></div>
          <div>
            <div className="flex items-center justify-between text-xs mb-2.5 font-bold uppercase tracking-wider text-muted-foreground">
              <span>Dynamic Extra Setup Pricing</span>
              <span className="text-primary font-mono font-black text-sm">${dynamicExtrasSum} Extra</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Aggregated supplemental items ordered dynamically outside basic tier inclusions.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Payment Handshake:</span>
            <span className="font-bold text-foreground flex items-center gap-1">
              <CircleDot className="h-2 w-2 fill-emerald-500 text-emerald-500" /> Pre-Approved Auto-Pay
            </span>
          </div>
        </GlassCard>
      </div>

      {/* ── CORE GRID LAYOUT: STALL BLUEPRINT, LEAD SCANNER & CHECKLISTS ── */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: IMMERSIVE LEAD SCANNER ENGINE & VISITOR CRM (Stories 11, 12, 13) */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard className="p-6 border-border/40" hover={false}>
            <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-4">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary animate-pulse" />
                <h3 className="font-bold text-sm text-foreground tracking-tight">Real-Time Smart QR Lead Capture</h3>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
                <CircleDot className="h-2 w-2 fill-emerald-500 text-emerald-500 animate-ping" /> Lens Active
              </span>
            </div>

            {/* Simulated Live Viewport Area */}
            <div className="relative h-56 rounded-2xl bg-neutral-950 border border-border/40 overflow-hidden flex flex-col items-center justify-center p-4 shadow-inner">
              {/* Corner Targets */}
              <div className="absolute top-4 left-4 h-6 w-6 border-t-2 border-l-2 border-primary rounded-tl-md" />
              <div className="absolute top-4 right-4 h-6 w-6 border-t-2 border-r-2 border-primary rounded-tr-md" />
              <div className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-primary rounded-bl-md" />
              <div className="absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-primary rounded-br-md" />

              {/* Glowing Laser Sweep */}
              <motion.div 
                className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_20px_4px_hsl(var(--primary))]"
                animate={{ top: ["10%", "90%", "10%"] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              />

              <Scan className="h-12 w-12 text-white/20 stroke-1 mb-2.5" />
              <p className="text-xs font-medium text-neutral-400 text-center max-w-xs leading-relaxed">
                Aim scanner array at attendee badges to decrypt sovereign identities automatically into the CRM queue.
              </p>

              {/* Fast Simulated Badge Drop */}
              <div className="absolute bottom-2.5 inset-x-2.5 p-2 rounded-xl bg-background/95 backdrop-blur-md border border-border flex items-center justify-between text-xs">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Simulate Turnstile Scans:</span>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => handleSimulateQuickScan(0)}
                    className="px-2.5 py-1 rounded-lg bg-primary text-white font-bold text-[10px] hover:opacity-90 transition-opacity shadow-sm"
                  >
                    Scan Prospect A
                  </button>
                  <button 
                    onClick={() => handleSimulateQuickScan(1)}
                    className="px-2.5 py-1 rounded-lg bg-accent text-foreground font-bold text-[10px] hover:bg-accent/80 transition-colors"
                  >
                    Scan Prospect B
                  </button>
                </div>
              </div>
            </div>

            {/* Supplementary Manual Entry Header */}
            <form onSubmit={handleManualLeadAdd} className="mt-4 pt-4 border-t border-border/40 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Manual Lead Telemetry Override
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input 
                  type="text" 
                  value={customLeadName} 
                  onChange={(e) => setCustomLeadName(e.target.value)}
                  placeholder="Visitor Name *" 
                  className="px-3 py-2 text-xs bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-medium"
                />
                <input 
                  type="text" 
                  value={customLeadTitle} 
                  onChange={(e) => setCustomLeadTitle(e.target.value)}
                  placeholder="Designation..." 
                  className="px-3 py-2 text-xs bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-medium"
                />
                <div className="flex gap-1.5">
                  <input 
                    type="text" 
                    value={customLeadEntity} 
                    onChange={(e) => setCustomLeadEntity(e.target.value)}
                    placeholder="Company..." 
                    className="px-3 py-2 text-xs bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-medium min-w-0 flex-1"
                  />
                  <GradientButton type="submit" size="sm" className="h-8 w-8 rounded-xl shrink-0 p-0 shadow-sm">
                    <Plus className="h-4 w-4" />
                  </GradientButton>
                </div>
              </div>
            </form>
          </GlassCard>

          {/* Captured Leads Table Data Roster */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <span>Captured Prospect Telemetry ({leadsCount})</span>
              <span>CRM Status Score / Drop</span>
            </div>

            <AnimatePresence mode="popLayout">
              {eventCapturedLeads.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="p-10 text-center glass rounded-2xl border border-dashed border-border"
                >
                  <p className="text-xs font-bold text-foreground">No visitor QR leads collected yet.</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Use the simulated triggers above to automatically harvest sovereign attendee keys.</p>
                </motion.div>
              ) : (
                eventCapturedLeads.map(lead => (
                  <motion.div
                    key={lead.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-3.5 rounded-xl glass border border-border/40 hover:border-primary/30 flex items-center justify-between gap-3 group transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={lead.photo} alt="" className="h-9 w-9 rounded-xl object-cover shrink-0 ring-1 ring-border" />
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-foreground truncate">{lead.name}</h5>
                        <p className="text-[10px] text-muted-foreground truncate">{lead.title} · <span className="font-medium text-foreground/80">{lead.entity}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[9px] text-muted-foreground hidden sm:inline-block font-mono">{lead.timestamp}</span>
                      
                      {/* Interactive Temperature Tag */}
                      <button
                        onClick={() => handleToggleLeadTemp(lead.id)}
                        className={cn(
                          "px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border",
                          lead.temp === "Hot" ? "bg-rose-500/10 text-rose-500 border-rose-500/30 shadow-glow-xs" : 
                          lead.temp === "Warm" ? "bg-amber-500/10 text-amber-500 border-amber-500/30" : 
                          "bg-blue-500/10 text-blue-500 border-blue-500/30"
                        )}
                        title="Pivot temperature metric"
                      >
                        {lead.temp}
                      </button>

                      <button
                        onClick={() => handleDeleteLead(lead.id, lead.name)}
                        className="h-7 w-7 rounded-lg glass grid place-items-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-80 group-hover:opacity-100"
                        title="Purge CRM item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: BOOTH BLUEPRINT, REQUIREMENTS & BRAND UPLOADS (Stories 3, 4, 5, 6, 7, 10, 14, 15) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Spatial Metadata Deck */}
          <GlassCard className="p-5 border-border/40" hover={false}>
            <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3">
              <span className="text-xs font-bold text-foreground flex items-center gap-2">
                <Layout className="h-3.5 w-3.5 text-primary" /> Booth Infrastructure Coordinates
              </span>
              <span className="text-[10px] font-mono text-primary font-bold">Assigned Plan</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-accent/30 border border-border/40">
                <span className="text-[9px] text-muted-foreground block font-bold uppercase tracking-wider">Spatial Tier</span>
                <span className="font-bold text-foreground">{currentBoothConfig.type}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-accent/30 border border-border/40">
                <span className="text-[9px] text-muted-foreground block font-bold uppercase tracking-wider">Booth Number ID</span>
                <span className="font-bold text-foreground font-mono">{currentBoothConfig.boothNumber}</span>
              </div>
            </div>
          </GlassCard>

          {/* Interactive Dynamic Line-Item Extra Costs & Furniture checklist */}
          <GlassCard className="p-5 border-border/40" hover={false}>
            <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3">
              <h3 className="font-bold text-xs text-foreground uppercase tracking-wider">
                Staging Services & Technical Requirements
              </h3>
              <span className="text-[10px] text-muted-foreground font-mono">Dynamic Costing</span>
            </div>

            <p className="text-[11px] text-muted-foreground mb-3 leading-tight">
              Toggle items below to request custom lighting rigs, network drops, or extra furnishings. Dynamic costs settle automatically before final ingress approvals.
            </p>

            <div className="space-y-2">
              {currentBoothConfig.initialRequirements.map(req => (
                <div 
                  key={req.id} 
                  onClick={() => handleToggleRequirement(req.id)}
                  className={cn(
                    "p-3 rounded-xl glass border text-xs flex items-center justify-between cursor-pointer transition-all group",
                    req.fulfilled ? "border-primary/40 bg-primary/[0.03]" : "border-border/40 hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className={cn("h-4 w-4 rounded-md border flex items-center justify-center shrink-0 transition-colors", req.fulfilled ? "bg-primary border-primary text-white shadow-glow-xs" : "border-border/60 bg-background")}>
                      {req.fulfilled && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                    </div>
                    <span className={cn("truncate font-medium text-xs", req.fulfilled ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                      {req.label}
                    </span>
                  </div>
                  <span className={cn("text-[10px] font-bold shrink-0 ml-2 font-mono", req.fulfilled ? "text-primary" : "text-muted-foreground")}>
                    {req.cost}
                  </span>
                </div>
              ))}
            </div>

            {/* Interactive Add Node Bar */}
            <form onSubmit={handleAddNewRequirement} className="mt-3 pt-3 border-t border-border/40 flex gap-2">
              <input 
                type="text" 
                value={customReqLabel}
                onChange={(e) => setCustomReqLabel(e.target.value)}
                placeholder="Request custom wiring, tables, extra lights..." 
                className="px-3 py-2 text-xs bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-medium flex-1"
              />
              <GradientButton type="submit" size="sm" className="h-8 px-3 shrink-0 text-xs">
                Add Node
              </GradientButton>
            </form>
          </GlassCard>

          {/* BRANDING UPLOAD SUITE (Story 5) */}
          <GlassCard className="p-5 border-border/40" hover={false}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Branding Assets & Design Validation
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-accent/20 border border-border/40 flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-500 grid place-items-center shrink-0 border border-emerald-500/20">
                  <ImageIcon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-foreground truncate block">Vector Logos</span>
                  <span className="text-[9px] text-emerald-500 block font-semibold">{currentBoothConfig.brandingStatus}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-accent/20 border border-border/40 flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0 border border-primary/20">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-foreground truncate block">Display Banners</span>
                  <span className="text-[9px] text-primary block font-semibold">Synced Cache</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* COMPANION SERVICES DRAWER LINKS (Stories 14, 15) */}
          <div className="p-4 rounded-xl glass border border-border/40 flex items-center justify-between gap-3 bg-gradient-to-r from-blue-500/[0.05] to-purple-500/[0.05]">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Local Event Support Gateway
              </span>
              <p className="text-xs font-bold text-foreground truncate mt-0.5">
                Nearby Travel Shuttles & Partner Hotels
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
              <Hotel className="h-4 w-4 text-blue-500" />
              <Plane className="h-4 w-4 text-purple-500" />
            </div>
          </div>

          {/* GLOBAL EXPO APPLICATION TRIGGER */}
          <button 
            onClick={() => setIsApplyModalOpen(true)}
            className="w-full group p-4 rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-accent/20 transition-all flex items-center justify-between gap-3 text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8 w-8 rounded-lg glass grid place-items-center group-hover:scale-105 transition-transform shrink-0 text-foreground">
                <Plus className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-foreground block">Reserve Supplemental Footprints</span>
                <span className="text-[10px] text-muted-foreground truncate block">Book spatial stalls inside additional parallel venues.</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </button>
        </div>
      </div>

      {/* ── FOOTPRINT APPLICATION OVERLAY ── */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 320 }}
              className="relative w-full max-w-xl bg-background border border-border rounded-2xl shadow-2xl z-10 flex flex-col max-h-[85vh] overflow-hidden"
            >
              <div className="p-6 pb-4 bg-accent/20 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground tracking-tight">Available Global Expositions</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Instantly instantiate spatial mappings inside available host venues.</p>
                </div>
                <button 
                  onClick={() => setIsApplyModalOpen(false)}
                  className="h-8 w-8 rounded-lg glass grid place-items-center text-muted-foreground hover:text-foreground transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-3 flex-1 no-scrollbar">
                {[
                  { id: "fintech-asia", title: "FinTech Asia", city: "Singapore", dates: "Sep 22 - Sep 24, 2026", cost: "$4,500 Base Stall", slots: 14 },
                  { id: "greenexpo-26", title: "Green Future Expo", city: "Amsterdam", dates: "Jul 03 - Jul 05, 2026", cost: "$3,200 Base Stall", slots: 6 },
                  { id: "gameconf-26", title: "GameConf Tokyo", city: "Tokyo", dates: "Nov 10 - Nov 12, 2026", cost: "$6,000 Island Floor", slots: 2 }
                ].map(ev => {
                  const assigned = participatedEvents.some(p => p.eventId === ev.id);
                  return (
                    <div key={ev.id} className="p-4 rounded-xl bg-accent/10 border border-border/40 flex items-center justify-between gap-4 hover:border-border transition-all">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-foreground truncate">{ev.title}</h4>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-accent text-foreground">{ev.city}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{ev.dates} · <span className="text-primary font-semibold">{ev.cost}</span></p>
                      </div>

                      <div className="shrink-0 text-right">
                        {assigned ? (
                          <span className="text-[10px] font-bold text-emerald-500 block">Active Footprint</span>
                        ) : (
                          <GradientButton
                            onClick={() => {
                              setParticipatedEvents(prev => [
                                ...prev,
                                {
                                  eventId: ev.id,
                                  boothNumber: `C-${Math.floor(Math.random() * 800) + 100}`,
                                  size: "20x20 ft",
                                  type: "Standard Floor",
                                  hall: "Pavilion Prime",
                                  status: "Space Reserved",
                                  brandingStatus: "Pending Validation",
                                  passesClaimed: 1,
                                  passesLimit: 4,
                                  leadTarget: 150,
                                  initialRequirements: [
                                    { id: `req-new-${Date.now()}-1`, label: "Modular Space Divider Walls", category: "Furniture", fulfilled: true, cost: "Included" },
                                    { id: `req-new-${Date.now()}-2`, label: "Standard Electrical Grid Drops", category: "Technical", fulfilled: true, cost: "Included" }
                                  ]
                                }
                              ]);
                              setSelectedEventId(ev.id);
                              setIsApplyModalOpen(false);
                              toast.success(`Exhibitor layout successfully reserved for ${ev.title}! Switching live dashboard context.`);
                            }}
                            size="sm"
                            className="text-xs h-8 px-4.5 shadow-glow"
                          >
                            Book Footprint
                          </GradientButton>
                        )}
                        <span className="text-[9px] text-muted-foreground block mt-1">{ev.slots} available slots</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-border bg-accent/20 flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Distributed Multi-Tenant Gateway
                </span>
                <span>Pre-Authorized Direct Connect</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}
