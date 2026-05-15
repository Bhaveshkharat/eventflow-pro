"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
   Users, DollarSign, BarChart3, Clock,
   MapPin, Calendar, Edit3, Share2,
   ArrowUpRight, Settings, Download, 
   AlertCircle, ChevronRight, Ticket, Check,
   Layers, Building2, Truck, Hotel, Plane,
   Search, Mic2, ShieldCheck, Mail, Copy, 
   TrendingUp, CheckCircle2, FileText,
   Sparkles, Zap, Activity, Phone, Eye, X,
   ClipboardList, UserPlus, Filter as FilterIcon
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { StatCard } from "@/components/ui-ext/StatCard";
import { events } from "@/data/mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getPersistedPartners } from "@/lib/partnersStore";
import { 
  getPersistedExhibitorRequests, 
  assignVendorToRequest, 
  MOCK_VENDORS, 
  ExhibitorRequest,
  Vendor
} from "@/lib/servicesStore";

type TabKey = "analytics" | "participants" | "partners" | "requests";
type ParticipantRole = "Exhibitor" | "Visitor" | "Delegate" | "Speaker";
type PartnerService = "Vendor" | "Hotel" | "Travel";

// Robust pre-seeded mock records specifically scoped to active event context with identity company details
const EVENT_PARTICIPANTS = [
  { id: "pt-1", name: "Nimbus Systems", company: "Premium Sponsor Corp", role: "Exhibitor" as ParticipantRole, meta: "Booth #A-101 (Island Premium)", email: "contact@nimbus.dev", phone: "+1 555-891-2300", status: "Rigged & Live", avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=60" },
  { id: "pt-2", name: "Orbit Core", company: "AI Compute Labs", role: "Exhibitor" as ParticipantRole, meta: "Booth #B-205 (Peninsula Prime)", email: "staging@orbitcore.ai", phone: "+1 555-430-1122", status: "Setup Pending", avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=60" },
  { id: "pt-3", name: "Lucas Vance", company: "Independent Developer", role: "Visitor" as ParticipantRole, meta: "General Turnstile Entry Pass", email: "lucas@vance.io", phone: "+1 555-221-4401", status: "Checked-in", avatar: "https://i.pravatar.cc/100?img=11" },
  { id: "pt-4", name: "Rachel Green", company: "Fashion Retailers Hub", role: "Visitor" as ParticipantRole, meta: "Expo Day Pass Bundle", email: "rgreen@fashion.net", phone: "+1 555-321-8899", status: "Checked-in", avatar: "https://i.pravatar.cc/100?img=44" },
  { id: "pt-5", name: "Dr. Aiden Park", company: "Orbit Core Research", role: "Delegate" as ParticipantRole, meta: "Pro Access Pass Holder", email: "apark@orbitcore.ai", phone: "+1 555-908-7744", status: "Checked-in", avatar: "https://i.pravatar.cc/100?img=15" },
  { id: "pt-6", name: "Sofia Romano", company: "Studio Architecture", role: "Delegate" as ParticipantRole, meta: "VIP Sovereign Key Handshake", email: "sofia@studio.co", phone: "+39 02 4410-88", status: "Checked-in", avatar: "https://i.pravatar.cc/100?img=32" },
  { id: "pt-7", name: "Elena Rostova", company: "Aura Ledger Coalition", role: "Delegate" as ParticipantRole, meta: "Standard General Pass", email: "elena@auraledger.org", phone: "+65 6211-0988", status: "Confirmed", avatar: "https://i.pravatar.cc/100?img=9" },
  { id: "pt-8", name: "Ada Lovelace", company: "Computable Foundation", role: "Speaker" as ParticipantRole, meta: "Keynote Track: The Next Decade", email: "ada@computable.org", phone: "+44 20 7946-0912", status: "Checked-in", avatar: "https://i.pravatar.cc/100?img=47" },
  { id: "pt-9", name: "Maria Garcia", company: "Nimbus Infrastructure", role: "Speaker" as ParticipantRole, meta: "Session Track: Cloud Scale Architecture", email: "maria@nimbus.dev", phone: "+1 555-881-2290", status: "Confirmed", avatar: "https://i.pravatar.cc/100?img=21" },
];

// User-specific partner listings complete with identity fields mirroring the primary Roles & Partners interface
const EVENT_PARTNERS = [
  { 
    id: "p-1", 
    name: "Marcus Vance", 
    company: "Grand Marquise Hotels",
    services: ["Hotel"] as PartnerService[], 
    providedService: "Premium Block Accommodation Suite",
    email: "marcus@grandmarquise.com", 
    phone: "+1 555-431-9900",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
    commission: "12%", split: "$12,400 Accrued", status: "Active Sync" 
  },
  { 
    id: "p-2", 
    name: "Sarah Jenkins", 
    company: "SkyTravel Logistics",
    services: ["Travel", "Vendor"] as PartnerService[], // Multi-service assigned user
    providedService: "Delegate Air Charter Logistics",
    email: "sarah@skytravel.io", 
    phone: "+1 555-019-2244",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=60",
    commission: "10%", split: "$8,200 Accrued", status: "Active Sync" 
  },
  { 
    id: "p-3", 
    name: "Hans Gruber", 
    company: "Peak Visual Rigging",
    services: ["Vendor"] as PartnerService[], 
    providedService: "Panoramic Stage Rigging & Intelligent Lighting Sets",
    email: "hans@peakvisuals.de", 
    phone: "+49 89 220199",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
    commission: "15%", split: "$4,500 Base Setup", status: "Service Crew" 
  },
  { 
    id: "p-4", 
    name: "Elena Rostova", 
    company: "Global Stay & Charter Hub",
    services: ["Hotel", "Travel", "Vendor"] as PartnerService[], // All-in-one assigned coordinator
    providedService: "Turnstile Synchronizer & Fleet Transport Hub",
    email: "elena@globalstay.sg", 
    phone: "+65 6889-1200",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60",
    commission: "14%", split: "$18,900 Total Yield", status: "Active Sync" 
  },
];

// Telemetry graph chart dataset
const CHART_METRICS_DATA = [
  { day: "Mon", registers: 320, yield: "$48,000", x: 50,  y: 165.9 },
  { day: "Tue", registers: 540, yield: "$81,000", x: 150, y: 142.4 },
  { day: "Wed", registers: 890, yield: "$133,500", x: 250, y: 105.1 },
  { day: "Thu", registers: 610, yield: "$91,500",  x: 350, y: 135.0 },
  { day: "Fri", registers: 1120, yield: "$168,000", x: 450, y: 80.6 },
  { day: "Sat", registers: 1420, yield: "$213,000", x: 550, y: 48.6 },
  { day: "Sun", registers: 1280, yield: "$192,000", x: 650, y: 63.5 },
];

export default function EventDetail() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading event details...</div>}>
      <EventDetailContent />
    </Suspense>
  );
}

const ServiceRequestsTab = ({ eventId }: { eventId: string }) => {
   const [requests, setRequests] = useState<ExhibitorRequest[]>([]);
   const [assigningReq, setAssigningReq] = useState<ExhibitorRequest | null>(null);
   const [selectedVendorId, setSelectedVendorId] = useState<string>("");

   useEffect(() => {
      setRequests(getPersistedExhibitorRequests().filter(r => r.eventId === eventId));
   }, [eventId]);

   const handleAssign = () => {
      if (!assigningReq || !selectedVendorId) return;
      assignVendorToRequest(assigningReq.id, selectedVendorId);
      setRequests(prev => prev.map(r => r.id === assigningReq.id ? { ...r, status: "Assigned", assignedVendorId: selectedVendorId } : r));
      setAssigningReq(null);
      setSelectedVendorId("");
      toast.success("Vendor assigned successfully!");
   };

   const unassignedCount = requests.filter(r => r.status === "Unassigned" || r.status === "Pending").length;

   return (
      <div className="space-y-6 animate-in fade-in duration-500">
         <div className="flex items-center justify-between p-4 rounded-xl glass border border-border/40">
            <div>
               <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Exhibitor Service Requests</h3>
               <p className="text-[10px] text-muted-foreground mt-1">Manage unassigned and custom service requests from exhibitors.</p>
            </div>
            <div className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
               {unassignedCount} Action Items
            </div>
         </div>

         <div className="grid gap-4">
            {requests.length === 0 ? (
               <div className="py-20 text-center glass rounded-3xl border border-dashed border-border opacity-40">
                  <ClipboardList className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-xs font-bold">No service requests for this event yet.</p>
               </div>
            ) : (
               requests.map(req => (
                  <GlassCard key={req.id} className="p-5 border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-4" hover={false}>
                     <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0", req.status === "Unassigned" || req.status === "Pending" ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary")}>
                           {req.category === "Custom" ? <Sparkles className="h-6 w-6" /> : <Settings className="h-6 w-6" />}
                        </div>
                        <div className="min-w-0">
                           <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] font-black uppercase text-primary tracking-widest">{req.category}</span>
                              <span className="text-[10px] text-muted-foreground font-mono">@{req.exhibitorName} · Booth {req.boothNumber}</span>
                           </div>
                           <h4 className="text-sm font-black text-foreground truncate">{req.title}</h4>
                        </div>
                     </div>

                     <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-border/40">
                        <div className="text-left md:text-right">
                           <p className="text-[9px] font-bold text-muted-foreground uppercase">Status</p>
                           <span className={cn("text-[10px] font-black uppercase", req.status === "Unassigned" || req.status === "Pending" ? "text-amber-500" : "text-emerald-500")}>
                              {req.status}
                           </span>
                        </div>
                        
                        {(req.status === "Unassigned" || req.status === "Pending") ? (
                           <button 
                             onClick={() => setAssigningReq(req)}
                             className="px-4 py-2 rounded-lg bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-glow-sm hover:scale-105 transition-all flex items-center gap-2"
                           >
                              <UserPlus className="h-3.5 w-3.5" /> Assign Vendor
                           </button>
                        ) : (
                           <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/40 border border-border">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                              <span className="text-[10px] font-bold text-muted-foreground">Managed by {MOCK_VENDORS.find(v => v.id === req.assignedVendorId)?.name || "Vendor"}</span>
                           </div>
                        )}
                     </div>
                  </GlassCard>
               ))
            )}
         </div>

         {/* Assignment Modal */}
         <AnimatePresence>
            {assigningReq && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAssigningReq(null)} className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm" />
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-background border border-border rounded-3xl shadow-2xl overflow-hidden">
                     <div className="p-6 border-b border-border bg-accent/5 flex items-center justify-between">
                        <h3 className="text-sm font-black uppercase tracking-widest">Assign Vendor</h3>
                        <button onClick={() => setAssigningReq(null)} className="h-8 w-8 rounded-lg hover:bg-accent flex items-center justify-center"><X className="h-4 w-4" /></button>
                     </div>
                     <div className="p-8 space-y-6">
                        <div>
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Request Details</p>
                           <p className="text-sm font-bold text-foreground">{assigningReq.title}</p>
                           <p className="text-xs text-muted-foreground mt-1">Exhibitor: {assigningReq.exhibitorName} · Category: {assigningReq.category}</p>
                        </div>

                        <div className="space-y-3">
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
                              <FilterIcon className="h-3 w-3 text-primary" /> Qualified Partners
                           </p>
                           {MOCK_VENDORS.map(vendor => {
                              const isQualified = vendor.specialties.includes(assigningReq.category) || assigningReq.category === "Custom";
                              return (
                                 <button 
                                   key={vendor.id} 
                                   onClick={() => setSelectedVendorId(vendor.id)}
                                   className={cn(
                                     "w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all text-left",
                                     selectedVendorId === vendor.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/20 bg-accent/5",
                                     !isQualified && "opacity-50"
                                   )}
                                 >
                                    <div>
                                       <p className="text-xs font-black text-foreground">{vendor.name}</p>
                                       <div className="flex gap-1 mt-1">
                                          {vendor.specialties.map(s => <span key={s} className="text-[8px] font-bold px-1 rounded bg-background border border-border">{s}</span>)}
                                       </div>
                                    </div>
                                    {selectedVendorId === vendor.id && <Check className="h-4 w-4 text-primary" />}
                                    {!isQualified && <span className="text-[8px] font-black text-rose-500 uppercase">Specialty Mismatch</span>}
                                 </button>
                              );
                           })}
                        </div>
                     </div>
                     <div className="p-6 border-t border-border bg-accent/5">
                        <GradientButton disabled={!selectedVendorId} onClick={handleAssign} className="w-full h-12 uppercase tracking-widest font-black text-xs shadow-glow">
                           Confirm Assignment
                        </GradientButton>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
};

function EventDetailContent() {
   const searchParams = useSearchParams();
   const eventId = searchParams.get("id");
   const event = events.find(e => e.id === eventId) || events[0];

   // Main interactive tabs router state
   const [activeTab, setActiveTab] = useState<TabKey>("analytics");
   const [selectedProfileEntity, setSelectedProfileEntity] = useState<any | null>(null);

   // Sub-filters for Participants Viewport
   const [participantFilter, setParticipantFilter] = useState<ParticipantRole | "All">("All");
   const [searchQuery, setSearchQuery] = useState("");

   // Multi-service filters requested for Partners Viewport: Vendor, Hotel, Travel
   const [partnerServiceFilter, setPartnerServiceFilter] = useState<PartnerService | "All">("All");

   // Analytics Active Selected Node State for Chart interactivity
   const [selectedChartIndex, setSelectedChartIndex] = useState(5); // Default to Saturday peak
   const [chartMetricMode, setChartMetricMode] = useState<"registers" | "yield">("registers");

   // Configured Upfront Tier Pricing Set by Organizer
   const configuredTiers = [
      { name: "General Attendee Pass", price: "$150", tier: "Standard Access", desc: "Basic expo mapping and standard lecture seating rows." },
      { name: "Pro Access Delegate", price: "$450", tier: "Popular Link", desc: "Fast-track access control lanes and networking mixer slots." },
      { name: "VIP Executive Track", price: "$899", tier: "Sovereign Cap", desc: "Green room roundtables and active auto hotel link APIs." }
   ];

   // Computed filtered list for Participants Tab
   const filteredParticipants = useMemo(() => {
     return EVENT_PARTICIPANTS.filter(p => {
       const matchesRole = participantFilter === "All" || p.role === participantFilter;
       const matchesSearch = !searchQuery || [p.name, p.meta, p.company, p.email].some(v => v.toLowerCase().includes(searchQuery.toLowerCase()));
       return matchesRole && matchesSearch;
     });
   }, [participantFilter, searchQuery]);

   // Dynamically synchronized partners registry filtered specifically for this host timeline
   const [eventPartnersList, setEventPartnersList] = useState(EVENT_PARTNERS);

   useEffect(() => {
     const allStored = getPersistedPartners();
     const boundToCurrentTimeline = allStored.filter(p => p.eventId === eventId);
     
     if (boundToCurrentTimeline.length > 0) {
       const mappedForView = boundToCurrentTimeline.map(p => ({
         id: p.id,
         name: p.name,
         company: p.company,
         services: p.services,
         providedService: p.providedService || "Custom Event Operations & Infrastructure",
         email: p.email,
         phone: p.phone,
         avatar: p.avatar,
         commission: typeof p.commission === "number" ? `${p.commission}%` : String(p.commission),
         split: p.split,
         status: p.status
       }));

       // Prioritize custom invited additions mapping straight to this event context above static defaults
       const dynamicInvites = mappedForView.filter(item => item.id.startsWith("gp-"));
       setEventPartnersList([...dynamicInvites, ...EVENT_PARTNERS]);
     }
   }, [eventId]);

   // Computed filtered list for Partners Tab supporting multi-service queries
   const filteredEventPartners = useMemo(() => {
     if (partnerServiceFilter === "All") return eventPartnersList;
     return eventPartnersList.filter(p => p.services.includes(partnerServiceFilter));
   }, [partnerServiceFilter, eventPartnersList]);

   // Telemetry notification logic
   const copyHandleToClipboard = (email: string) => {
     navigator.clipboard.writeText(email);
     toast.success(`Copied communication link: ${email}`);
   };

   // Line coordinates generator string for SVG
   const linePathD = useMemo(() => {
     return CHART_METRICS_DATA.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`).join(" ");
   }, []);

   const areaPathD = useMemo(() => {
     return `${linePathD} L 650 200 L 50 200 Z`;
   }, [linePathD]);

   const activeChartNode = CHART_METRICS_DATA[selectedChartIndex];

   return (
      <DashboardShell
         title={event.title}
         subtitle={`${event.city} · ${event.date}`}
         backLink="/organizer/events"
      >
         {/* Top KPI Roster Deck */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} label="Total Registers" value={event.attendees} delta="+142 Live Ingress" />
            <StatCard icon={Building2} label="Assigned Partners" value={EVENT_PARTNERS.length} delta="User Specific Roles" />
            <StatCard icon={BarChart3} label="Active Participants" value={EVENT_PARTICIPANTS.length} delta="Roster Scoped" />
            <StatCard icon={DollarSign} label="Ticket Revenue" value={142500} prefix="$" delta="+8% Yield Curve" />
         </div>

         {/* HERO METADATA CARD */}
         <GlassCard className="p-0 overflow-hidden border-border/40 mb-8" hover={false}>
            <div className="h-56 relative">
               <img src={event.image} className="absolute inset-0 h-full w-full object-cover" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
               
               <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4">
                  <div className="min-w-0">
                     <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-primary text-white font-mono">
                          LIVE RUNTIME
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono truncate">{event.venue}</span>
                     </div>
                     <h2 className="text-xl font-bold text-foreground tracking-tight truncate">{event.title}</h2>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                     <Link href={`/organizer/events/new`}>
                       <GradientButton size="sm" className="h-8 px-3 text-xs">
                          <Edit3 className="h-3 w-3 mr-1" /> Reconfigure Scope
                       </GradientButton>
                     </Link>
                     <button 
                       onClick={() => toast.success("Event direct sharing URL generated.")}
                       className="h-8 w-8 rounded-lg bg-background border border-border grid place-items-center text-muted-foreground hover:text-foreground transition-colors"
                     >
                        <Share2 className="h-3.5 w-3.5" />
                     </button>
                  </div>
               </div>
            </div>
         </GlassCard>

         {/* PREMIUM GLASS NAV CONTROLLER TABS */}
         <div className="flex items-center justify-between gap-4 p-2 rounded-2xl glass border border-border/60 mb-8 bg-background/20 backdrop-blur-md overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 min-w-0">
               {(["analytics", "participants", "partners", "requests"] as TabKey[]).map(tKey => {
                  const isActive = activeTab === tKey;
                  const labelMap = {
                    analytics: "📊 Live Analytics Overview",
                    participants: `👥 Registered Participants (${EVENT_PARTICIPANTS.length})`,
                    partners: `🤝 Assigned Event Partners (${EVENT_PARTNERS.length})`,
                    requests: `📋 Service Requests (${getPersistedExhibitorRequests().filter(r => r.eventId === eventId).length})`
                  };
                  return (
                    <button
                      key={tKey}
                      onClick={() => setActiveTab(tKey)}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 tracking-tight whitespace-nowrap relative",
                        isActive 
                          ? "text-white shadow-md bg-gradient-to-r from-primary/80 to-primary" 
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      )}
                    >
                      {labelMap[tKey]}
                      {isActive && (
                        <motion.div 
                          layoutId="activeTabPill" 
                          className="absolute inset-0 rounded-xl border border-white/20 pointer-events-none" 
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </button>
                  );
               })}
            </div>

            <span className="text-[10px] font-mono font-black uppercase text-primary shrink-0 hidden md:block pr-2">
              Live Overview
            </span>
         </div>

         {/* TAB CONTENTS VIEWPORT ENGINE */}
         <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
               {activeTab === "requests" && <ServiceRequestsTab eventId={eventId || ""} />}

               {/* ─── TAB 1: ANALYTICS VIEWPORT (Modern Sleek Light/Dark Optimized) ───── */}
               {activeTab === "analytics" && (
                  <div className="space-y-8">
                     {/* Breathtaking True SVG Area Graph Dashboard Block */}
                     <GlassCard className="p-6 border-border/60 shadow-sm overflow-hidden relative" hover={false}>
                        {/* Subtle decorative glow overlay */}
                        <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                        {/* Top Config Row */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10 border-b border-border/40 pb-4">
                           <div>
                              <div className="flex items-center gap-2 mb-1">
                                 <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                                   Live Updates
                                 </span>
                                 <span className="text-[10px] text-muted-foreground font-mono">Auto-Refreshing Data</span>
                              </div>
                              <h3 className="text-base font-black text-foreground tracking-tight flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary animate-pulse" /> Real-Time Attendance & Revenue Performance
                              </h3>
                           </div>

                           {/* Mode Selector Switcher */}
                           <div className="flex items-center gap-1.5 p-1 rounded-xl bg-accent/40 border border-border/60 self-start md:self-auto">
                              <button
                                onClick={() => setChartMetricMode("registers")}
                                className={cn("px-3 py-1 rounded-lg text-xs font-bold transition-all", chartMetricMode === "registers" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground")}
                              >
                                Ticket Check-Ins
                              </button>
                              <button
                                onClick={() => setChartMetricMode("yield")}
                                className={cn("px-3 py-1 rounded-lg text-xs font-bold transition-all", chartMetricMode === "yield" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground")}
                              >
                                Gross Ticket Sales
                              </button>
                           </div>
                        </div>

                        {/* Split Graph / Info Detail Canvas */}
                        <div className="grid lg:grid-cols-12 gap-6 items-start relative z-10">
                           {/* SVG Core Rendering Workspace (Adapts beautifully to light/dark themes) */}
                           <div className="lg:col-span-8 bg-background/50 rounded-2xl border border-border/60 p-4 relative overflow-hidden">
                              <span className="absolute top-3 left-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Daily Statistics Trend
                              </span>

                              {/* Live SVGs Canvas */}
                              <div className="w-full h-56 mt-6">
                                 <svg viewBox="0 0 700 220" className="w-full h-full overflow-visible">
                                    <defs>
                                       <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.0" />
                                       </linearGradient>
                                       
                                       <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                                          <stop offset="50%" stopColor="#10b981" />
                                          <stop offset="100%" stopColor="hsl(var(--primary))" />
                                       </linearGradient>
                                    </defs>

                                    {/* Subtle horizontal baseline markers */}
                                    <line x1="50" y1="40" x2="650" y2="40" stroke="currentColor" className="text-border/40 stroke-dasharray-[4,4]" strokeWidth="1" />
                                    <line x1="50" y1="120" x2="650" y2="120" stroke="currentColor" className="text-border/40 stroke-dasharray-[4,4]" strokeWidth="1" />
                                    <line x1="50" y1="200" x2="650" y2="200" stroke="currentColor" className="text-border" strokeWidth="1.5" />

                                    {/* Render Area Filled Gradient */}
                                    <path 
                                      d={areaPathD} 
                                      fill="url(#areaGrad)" 
                                    />

                                    {/* Render Vibrant Line Trace */}
                                    <path 
                                      d={linePathD} 
                                      fill="none" 
                                      stroke="url(#lineGrad)" 
                                      strokeWidth="3.5" 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                    />

                                    {/* Interactive Nodes Placements */}
                                    {CHART_METRICS_DATA.map((pt, idx) => {
                                       const isSelected = selectedChartIndex === idx;
                                       return (
                                          <g key={pt.day} className="cursor-pointer group" onClick={() => setSelectedChartIndex(idx)}>
                                             {/* Vertical helper trace line on hover/select */}
                                             <line 
                                               x1={pt.x} y1={pt.y} 
                                               x2={pt.x} y2="200" 
                                               stroke="currentColor" 
                                               className={cn("transition-opacity", isSelected ? "text-primary opacity-60" : "text-muted-foreground opacity-0 group-hover:opacity-30")} 
                                               strokeWidth="1.5" 
                                               strokeDasharray="2 2"
                                             />

                                             {/* Outer halo element */}
                                             <circle 
                                               cx={pt.x} cy={pt.y} 
                                               r={isSelected ? 8 : 6} 
                                               fill="currentColor"
                                               className={cn("transition-all duration-300 origin-center", isSelected ? "text-primary animate-pulse" : "text-background group-hover:scale-125")}
                                             />

                                             {/* Inner core dot */}
                                             <circle 
                                               cx={pt.x} cy={pt.y} 
                                               r={isSelected ? 4 : 3} 
                                               className={cn("transition-colors", isSelected ? "fill-background" : "fill-primary")}
                                               stroke={isSelected ? "none" : "currentColor"}
                                               strokeWidth="1.5"
                                             />

                                             {/* Bottom text axis label */}
                                             <text 
                                               x={pt.x} y="218" 
                                               textAnchor="middle" 
                                               className={cn("text-[10px] font-mono font-bold transition-colors select-none", isSelected ? "fill-primary" : "fill-muted-foreground group-hover:fill-foreground")}
                                             >
                                                {pt.day}
                                             </text>
                                          </g>
                                       );
                                    })}
                                 </svg>
                              </div>

                              <div className="mt-2 text-[9px] text-muted-foreground text-center font-mono">
                                 💡 Click data points on the graph above to view exact daily statistics.
                              </div>
                           </div>

                           {/* Dynamic Selected Node Dashboard Card view */}
                           <div className="lg:col-span-4 space-y-4">
                              <div className="p-4 rounded-2xl bg-accent/30 border border-border/80 space-y-3 relative overflow-hidden">
                                 <div className="absolute top-0 right-0 p-2 opacity-10 font-mono font-black text-4xl select-none">
                                   {activeChartNode.day}
                                 </div>

                                 <span className="text-[10px] font-bold uppercase tracking-widest text-primary block">
                                   Selected Day Summary
                                 </span>

                                 <div>
                                    <div className="flex items-center gap-2">
                                       <span className="text-2xl font-black text-foreground tracking-tight">
                                         {chartMetricMode === "registers" ? activeChartNode.registers : activeChartNode.yield}
                                       </span>
                                       <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded font-mono">
                                         Confirmed
                                       </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {chartMetricMode === "registers" ? "Total verified arrivals" : "Total processed ticket revenue"} on <span className="font-bold text-foreground">{activeChartNode.day}</span>.
                                    </p>
                                 </div>

                                 <div className="pt-2 border-t border-border/60 grid grid-cols-2 gap-2 text-[11px]">
                                    <div>
                                       <span className="text-[9px] text-muted-foreground uppercase block">Conversion Rate</span>
                                       <span className="font-bold text-foreground">94.2%</span>
                                    </div>
                                    <div>
                                       <span className="text-[9px] text-muted-foreground uppercase block">Partner Status</span>
                                       <span className="font-bold text-rose-500">Active</span>
                                    </div>
                                 </div>

                                 <button 
                                   onClick={() => toast.success(`Exported summary report for ${activeChartNode.day}.`)}
                                   className="w-full py-1.5 bg-background rounded-lg border border-border text-[10px] font-bold text-foreground hover:border-primary transition-colors block text-center mt-1"
                                 >
                                    Export Daily Data
                                 </button>
                              </div>

                              {/* Automated Routing status block */}
                              <div className="p-3.5 rounded-xl bg-background border border-border flex items-center gap-3">
                                 <Zap className="h-4 w-4 text-emerald-500 shrink-0" />
                                 <div className="min-w-0">
                                    <p className="text-xs font-bold text-foreground truncate">Dynamic Ticket Scaling</p>
                                    <p className="text-[10px] text-muted-foreground truncate">Pricing adjusts automatically based on demand.</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Highly Modern Styled Breakdown Segment Blocks */}
                        <div className="grid sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/40 relative z-10">
                           <MixSegment title="Visitors Pass" count="2,400" baseColor="bg-blue-500" textColor="text-blue-500" pct="75%" />
                           <MixSegment title="Exhibitors Booth" count="142" baseColor="bg-purple-500" textColor="text-purple-500" pct="15%" />
                           <MixSegment title="Delegates Access" count="89" baseColor="bg-amber-500" textColor="text-amber-500" pct="8%" />
                           <MixSegment title="Speakers Track" count="9" baseColor="bg-emerald-500" textColor="text-emerald-500" pct="2%" />
                        </div>
                     </GlassCard>

                     {/* TICKET PRICING TIERS BLOCK */}
                     <GlassCard className="p-5 border-border/40" hover={false}>
                        <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3">
                           <div className="flex items-center gap-2">
                              <Ticket className="h-4 w-4 text-primary" />
                              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                                 Ticket Pricing Tiers
                              </h3>
                           </div>
                           <span className="text-[10px] text-muted-foreground font-mono">Visitor Target Scope</span>
                        </div>

                        <p className="text-[11px] text-muted-foreground mb-3 leading-tight">
                           These set pricing options determine the ticket prices available to visitors during checkout.
                        </p>

                        <div className="grid sm:grid-cols-3 gap-3">
                           {configuredTiers.map(t => (
                              <div key={t.name} className="p-3 rounded-xl bg-background border border-border flex flex-col justify-between">
                                 <div>
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                       <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                                          {t.tier}
                                       </span>
                                       <span className="text-xs font-black text-primary font-mono">{t.price}</span>
                                    </div>
                                    <h4 className="text-xs font-bold text-foreground truncate">{t.name}</h4>
                                    <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                                       {t.desc}
                                    </p>
                                 </div>
                                 <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded w-fit mt-2 font-mono block">
                                    Active Sync
                                 </span>
                              </div>
                           ))}
                        </div>
                     </GlassCard>
                  </div>
               )}

               {/* ─── TAB 2: PARTICIPANTS VIEWPORT (Mirrored Horizontal UI mirroring Partners tab) ─── */}
               {activeTab === "participants" && (
                  <div className="space-y-6">
                     <GlassCard className="p-4 border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-4" hover={false}>
                        {/* Sub-Filters Pivot: All | Exhibitor | Visitor | Delegate | Speaker */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                           {(["All", "Exhibitor", "Visitor", "Delegate", "Speaker"] as const).map(roleOpt => {
                             const isActive = participantFilter === roleOpt;
                             const count = roleOpt === "All" 
                               ? EVENT_PARTICIPANTS.length 
                               : EVENT_PARTICIPANTS.filter(p => p.role === roleOpt).length;
                             
                             return (
                               <button
                                 key={roleOpt}
                                 onClick={() => setParticipantFilter(roleOpt)}
                                 className={cn(
                                   "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                                   isActive 
                                     ? "bg-primary/20 text-primary border border-primary/30 shadow-sm" 
                                     : "bg-background text-muted-foreground hover:text-foreground border border-border"
                                 )}
                               >
                                 <span>{roleOpt === "All" ? "All" : `${roleOpt}s`}</span>
                                 <span className="px-1.5 py-0.2 text-[9px] rounded font-mono bg-background font-black">
                                   {count}
                                 </span>
                               </button>
                             );
                           })}
                        </div>

                        {/* Instant Search Bar */}
                        <div className="relative w-full md:w-64 shrink-0">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                           <input 
                             type="text"
                             value={searchQuery}
                             onChange={(e) => setSearchQuery(e.target.value)}
                             placeholder="Query entity or credential..."
                             className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-medium"
                           />
                           {searchQuery && (
                             <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground hover:text-foreground">
                               Clear
                             </button>
                           )}
                        </div>
                     </GlassCard>

                     {/* Participants Roster Render Engine: Overhauled to stunning Premium Full-Width Card layout */}
                     <div className="grid gap-4">
                        <AnimatePresence mode="popLayout">
                           {filteredParticipants.length === 0 ? (
                             <motion.div 
                               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                               className="py-12 text-center glass rounded-xl border border-dashed border-border"
                             >
                               <p className="text-xs font-bold text-foreground">No matching participants scoped to this session.</p>
                               <p className="text-[10px] text-muted-foreground mt-0.5">Try shifting active sub-role category pills above.</p>
                             </motion.div>
                           ) : (
                             filteredParticipants.map(pt => {
                               const roleColorMap = {
                                 Exhibitor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
                                 Visitor: "bg-amber-500/10 text-amber-500 border-amber-500/30",
                                 Delegate: "bg-blue-500/10 text-blue-400 border-blue-500/30",
                                 Speaker: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                               };

                               return (
                                 <motion.div
                                   key={pt.id}
                                   layout
                                   initial={{ opacity: 0, scale: 0.98 }}
                                   animate={{ opacity: 1, scale: 1 }}
                                   exit={{ opacity: 0, scale: 0.98 }}
                                   transition={{ duration: 0.2 }}
                                   className="p-4 rounded-xl glass border border-border/60 hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                                 >
                                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                       <img src={pt.avatar} alt="" className="h-10 w-10 rounded-xl object-cover ring-1 ring-border shrink-0" />

                                       <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-2 flex-wrap">
                                             <h4 className="text-xs font-bold text-foreground truncate">{pt.name}</h4>
                                             <span className="text-[10px] text-muted-foreground font-mono truncate">({pt.company})</span>
                                             
                                             <span className={cn("px-1.5 py-0.2 rounded text-[8px] font-bold font-mono border uppercase tracking-wider shrink-0", roleColorMap[pt.role])}>
                                                {pt.role}
                                             </span>
                                          </div>

                                          <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground font-medium">
                                             <span className="flex items-center gap-1 truncate text-foreground/80">
                                                📧 {pt.email}
                                             </span>
                                             <span className="text-border">·</span>
                                             <span className="flex items-center gap-1 shrink-0 font-mono text-muted-foreground">
                                                📞 {pt.phone}
                                             </span>
                                          </div>
                                       </div>
                                    </div>

                                    {/* Right section: pass tracking info and copy action */}
                                    <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-border/40 shrink-0">
                                       <div className="text-left md:text-right min-w-0 max-w-[200px] sm:max-w-none">
                                          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block truncate">
                                            Assignment
                                          </span>
                                          <span className="text-xs font-bold text-foreground truncate block">
                                            📍 {pt.meta}
                                          </span>
                                       </div>

                                       <div className="flex items-center gap-1.5 shrink-0">
                                          <span className="px-2 py-1 rounded bg-background border border-border text-[9px] font-bold font-mono text-emerald-400 hidden sm:inline-block">
                                            {pt.status}
                                          </span>
                                          
                                          <button
                                            onClick={() => setSelectedProfileEntity({ ...pt, isPartner: false })}
                                            className="px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-colors text-xs font-bold flex items-center gap-1.5 shadow-sm"
                                            title="View Profile"
                                          >
                                            <Eye className="h-3.5 w-3.5" />
                                            <span className="hidden md:inline">View Profile</span>
                                          </button>

                                          <button
                                            onClick={() => copyHandleToClipboard(pt.email)}
                                            className="px-2.5 py-1.5 rounded-lg bg-accent text-foreground hover:bg-accent/80 transition-colors text-xs font-bold flex items-center gap-1.5 shadow-sm"
                                            title="Email"
                                          >
                                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="hidden md:inline">Email</span>
                                          </button>
                                       </div>
                                    </div>
                                 </motion.div>
                               );
                             })
                           )}
                        </AnimatePresence>
                     </div>
                  </div>
               )}

               {/* ─── TAB 3: USER-SPECIFIC PARTNERS VIEWPORT WITH DYNAMIC MULTI-SERVICE TABS ─── */}
               {activeTab === "partners" && (
                  <div className="space-y-6">
                     <GlassCard className="p-4 border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-4" hover={false}>
                        <div>
                           <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                              <Users className="h-4 w-4 text-primary" /> User Specific Assigned Operational Partners
                           </h3>
                           <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                              Displaying explicit individual partner accounts mapping logistics and multi-service capabilities directly to this host timeline.
                           </p>
                        </div>
                        
                        {/* Specifically requested multi-service filters: Vendors, Hotels, Travel */}
                        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                           {(["All", "Vendor", "Hotel", "Travel"] as const).map(srvOpt => {
                             const isActive = partnerServiceFilter === srvOpt;
                             const count = srvOpt === "All" 
                               ? EVENT_PARTNERS.length 
                               : EVENT_PARTNERS.filter(p => p.services.includes(srvOpt)).length;
                             
                             return (
                               <button
                                 key={srvOpt}
                                 onClick={() => setPartnerServiceFilter(srvOpt)}
                                 className={cn(
                                   "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                                   isActive 
                                     ? "bg-primary/20 text-primary border border-primary/30 shadow-sm" 
                                     : "bg-background text-muted-foreground hover:text-foreground border border-border"
                                 )}
                               >
                                 <span>{srvOpt === "All" ? "All Assigned" : `${srvOpt}s`}</span>
                                 <span className="px-1.5 py-0.2 text-[9px] rounded font-mono bg-background font-black">
                                   {count}
                                 </span>
                               </button>
                             );
                           })}
                        </div>
                     </GlassCard>

                     <div className="grid gap-4">
                        <AnimatePresence mode="popLayout">
                           {filteredEventPartners.length === 0 ? (
                              <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="py-10 text-center glass rounded-xl border border-dashed border-border"
                              >
                                <p className="text-xs font-bold text-foreground">No assigned user partner accounts match this capability filter.</p>
                              </motion.div>
                           ) : (
                              filteredEventPartners.map(partner => {
                                 return (
                                    <motion.div 
                                      key={partner.id}
                                      layout
                                      initial={{ opacity: 0, scale: 0.98 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.98 }}
                                      transition={{ duration: 0.2 }}
                                      className="p-4 rounded-xl glass border border-border/60 hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                                    >
                                       <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                          <img src={partner.avatar} alt="" className="h-10 w-10 rounded-xl object-cover ring-1 ring-border shrink-0" />

                                          <div className="min-w-0 flex-1">
                                             <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="text-xs font-bold text-foreground truncate">{partner.name}</h4>
                                                <span className="text-[10px] text-muted-foreground font-mono truncate">({partner.company})</span>
                                                
                                                {/* Rendering overlapping multi-service badges dynamically */}
                                                <div className="flex items-center gap-1 shrink-0">
                                                   {partner.services.map(srv => {
                                                      const colorMap = {
                                                         Hotel: "bg-blue-500/10 text-blue-500 border-blue-500/20",
                                                         Travel: "bg-purple-500/10 text-purple-500 border-purple-500/20",
                                                         Vendor: "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                      };
                                                      return (
                                                         <span key={srv} className={cn("px-1.5 py-0.2 rounded text-[8px] font-bold font-mono border uppercase tracking-wider", colorMap[srv])}>
                                                            {srv}
                                                         </span>
                                                      );
                                                   })}
                                                </div>
                                             </div>

                                             {/* Displaying which service vendor will provide for this specific event */}
                                             <div className="mt-1.5 mb-0.5 flex items-center gap-1.5">
                                                <span className="text-[9px] uppercase tracking-wider font-bold text-amber-500 font-mono bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 shrink-0">
                                                  Provided Service
                                                </span>
                                                <span className="text-xs font-bold text-foreground/90 truncate">
                                                  {(partner as any).providedService || "General Event Operations & Equipment"}
                                                </span>
                                             </div>

                                             <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground font-medium">
                                                <span className="flex items-center gap-1 truncate text-foreground/80">
                                                   📧 {partner.email}
                                                </span>
                                                <span className="text-border">·</span>
                                                <span className="flex items-center gap-1 shrink-0 font-mono text-muted-foreground">
                                                   📞 {partner.phone}
                                                </span>
                                             </div>
                                          </div>
                                       </div>

                                       {/* Commission Pool Split Metadata */}
                                       <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-border/40 shrink-0">
                                          <div className="text-left md:text-right">
                                             <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">
                                               Commission
                                             </span>
                                             <span className="text-xs font-mono font-bold text-foreground">
                                               {partner.commission} Split (<span className="text-primary">{partner.split}</span>)
                                             </span>
                                          </div>

                                          <div className="flex items-center gap-1.5 shrink-0">
                                             <span className="px-2 py-1 rounded bg-background border border-border text-[9px] font-bold font-mono text-emerald-400 hidden sm:inline-block">
                                               {partner.status}
                                             </span>
                                             
                                             <button
                                               onClick={() => setSelectedProfileEntity({ ...partner, isPartner: true })}
                                               className="px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-colors text-xs font-bold flex items-center gap-1.5 shadow-sm"
                                               title="View Profile"
                                             >
                                               <Eye className="h-3.5 w-3.5" />
                                               <span className="hidden md:inline">View Profile</span>
                                             </button>

                                             <button
                                               onClick={() => copyHandleToClipboard(partner.email)}
                                               className="px-2.5 py-1.5 rounded-lg bg-accent text-foreground hover:bg-accent/80 transition-colors text-xs font-bold flex items-center gap-1.5 shadow-sm"
                                               title="Email"
                                             >
                                               <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                               <span className="hidden md:inline">Email</span>
                                             </button>
                                          </div>
                                       </div>
                                    </motion.div>
                                 );
                              })
                           )}
                        </AnimatePresence>
                     </div>

                     {/* Automated Payments */}
                     <div className="p-4 bg-background rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0">
                           <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                             Automated Payouts
                           </span>
                           <p className="text-xs font-bold text-foreground truncate mt-0.5">
                             Partner commissions are automatically processed upon digital attendee check-ins.
                           </p>
                        </div>

                        <Link href="/organizer/settlements">
                           <GradientButton size="sm" className="h-8 px-4 text-xs shrink-0 shadow-sm">
                             View Payouts
                           </GradientButton>
                        </Link>
                     </div>
                  </div>
               )}
            </motion.div>
         </AnimatePresence>

         {/* ── OVERLAY: DETAILED PROFILE VIEW MODAL ── */}
         <AnimatePresence>
            {selectedProfileEntity && (
               <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setSelectedProfileEntity(null)}
                    className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ type: "spring", damping: 22, stiffness: 320 }}
                    className="relative w-full max-w-xl bg-background border border-border rounded-2xl shadow-2xl z-10 flex flex-col max-h-[85vh] overflow-hidden"
                  >
                     <div className="p-5 bg-accent/20 border-b border-border flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                           <img src={selectedProfileEntity.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60"} alt="" className="h-14 w-14 rounded-xl object-cover ring-2 ring-border" />
                           <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                 <span className="px-2 py-0.2 rounded text-[9px] font-bold uppercase tracking-widest bg-primary text-white font-mono">
                                   {selectedProfileEntity.isPartner ? "Partner" : selectedProfileEntity.role}
                                 </span>
                                 {selectedProfileEntity.isPartner && selectedProfileEntity.services && (
                                   <div className="flex items-center gap-1">
                                      {selectedProfileEntity.services.map((srv: string) => (
                                         <span key={srv} className="px-1.5 py-0.2 rounded bg-background border border-border text-[8px] font-bold font-mono text-muted-foreground uppercase">
                                            {srv}
                                         </span>
                                      ))}
                                   </div>
                                 )}
                              </div>
                              <h2 className="text-base font-bold text-foreground tracking-tight">{selectedProfileEntity.name}</h2>
                              <p className="text-xs text-muted-foreground font-medium">{selectedProfileEntity.company || "Affiliated Partner Organization"}</p>
                           </div>                        </div>
                        <button onClick={() => setSelectedProfileEntity(null)} className="text-muted-foreground hover:text-foreground">
                           <X className="h-4 w-4" />
                        </button>
                     </div>

                     <div className="p-5 overflow-y-auto space-y-4 flex-1 no-scrollbar text-xs">
                        <div className="p-4 rounded-xl bg-accent/10 border border-border/40 space-y-3">
                           <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                             {selectedProfileEntity.isPartner ? "Commission & Tracking Details" : "Event Assignment Details"}
                           </span>
                           <div className="grid grid-cols-2 gap-3 font-mono">
                              <div>
                                 <span className="text-[9px] text-muted-foreground block font-sans uppercase">
                                   {selectedProfileEntity.isPartner ? "Commission Rate" : "Assigned Space"}
                                 </span>
                                 <span className="font-bold text-foreground">
                                   {selectedProfileEntity.isPartner ? selectedProfileEntity.commission : selectedProfileEntity.meta}
                                 </span>                              </div>
                              <div>
                                 <span className="text-[9px] text-muted-foreground block font-sans uppercase">Status</span>
                                 <span className="font-bold text-primary">{selectedProfileEntity.status}</span>
                              </div>
                           </div>
                           {selectedProfileEntity.isPartner && selectedProfileEntity.split && (
                              <div className="pt-2 border-t border-border/40 text-[11px]">
                                 <span className="text-muted-foreground">Accrued Split: </span>
                                 <span className="font-bold text-foreground font-mono">{selectedProfileEntity.split}</span>
                              </div>
                           )}
                        </div>

                        <div className="space-y-2">
                           <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                             Biography / Bio
                           </span>
                           <p className="text-muted-foreground bg-accent/5 p-3 rounded-xl border border-border/40 leading-relaxed font-sans">
                              "{selectedProfileEntity.bio || (selectedProfileEntity.isPartner 
                                ? 'Official trusted event partner providing premium operational support and vendor logistics.'
                                : 'Experienced event participant and designated attendee.')}"
                           </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                           <div className="p-2.5 rounded-xl bg-background border border-border flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                              <div className="min-w-0">
                                 <span className="text-[9px] text-muted-foreground block font-bold">Email Address</span>
                                 <span className="text-[11px] font-medium text-foreground truncate block">{selectedProfileEntity.email}</span>
                              </div>
                           </div>
                           <div className="p-2.5 rounded-xl bg-background border border-border flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              <div className="min-w-0">
                                 <span className="text-[9px] text-muted-foreground block font-bold">Phone Number</span>
                                 <span className="text-[11px] font-medium text-foreground truncate block">{selectedProfileEntity.phone || "+1 (555) 019-8822"}</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="p-4 border-t border-border bg-accent/20 flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground flex items-center gap-1">
                           <ShieldCheck className="h-3 w-3 text-emerald-500" /> Verified Profile
                        </span>
                        <button
                          onClick={() => setSelectedProfileEntity(null)}
                          className="px-3 py-1 rounded-lg bg-background text-foreground font-bold hover:bg-accent border border-border"
                        >
                           Close
                        </button>
                     </div>
                  </motion.div>               </div>
            )}
         </AnimatePresence>
      </DashboardShell>
   );
}

// Gorgeous High-Fidelity Modern Mix Segment Stats Builder
function MixSegment({ title, count, baseColor, textColor, pct }: any) {
   return (
      <div className="p-3.5 rounded-xl bg-background border border-border/80 space-y-2 relative overflow-hidden group hover:border-primary/40 transition-colors">
         {/* Subtle top indicator pip */}
         <div className="absolute top-0 left-3 right-3 h-[2px] rounded-full bg-accent overflow-hidden">
            <div className={cn("h-full", baseColor)} style={{ width: pct }} />
         </div>

         <div className="flex items-center justify-between gap-1 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
               {title}
            </span>
            <span className={cn("text-xs font-black font-mono", textColor)}>{pct}</span>
         </div>

         <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-foreground tracking-tight font-mono">{count}</span>
            <span className="text-[9px] text-muted-foreground font-medium">Allocated</span>
         </div>
      </div>
   );
}
