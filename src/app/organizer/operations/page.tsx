"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Truck, Hotel, Plane, 
  Settings, Plus, Search, Filter, 
  Trash2, Eye, X, Mail, Phone, 
  Briefcase, CheckCircle2, DollarSign,
  ChevronRight, MessageSquare, ShieldCheck,
  Zap, Wrench, Check
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events } from "@/data/mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const partnerTabs = ["All Partners", "Hotel Agents", "Travel Agents", "Vendors"] as const;

export default function OrganizerOperations() {
  const [activeTab, setActiveTab] = useState<typeof partnerTabs[number]>("All Partners");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("all");
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);

  // Contracted partner pipelines across events
  const [partnersList, setPartnersList] = useState([
    { 
      id: "pt-1", eventId: "techsummit-26", name: "SkyTravel Logistics", type: "Travel", 
      eventsCount: 8, rating: 4.8, status: "Active", commission: 12, 
      email: "corporate@skytravel.io", phone: "+1 (555) 019-2244",
      avatar: "https://images.unsplash.com/photo-1436491865332-7a61e109cc05?w=120&auto=format&fit=crop&q=80",
      bio: "Global charter flight specialist providing discounted multi-leg routing bundles for incoming conference delegates.",
      repName: "Sarah Jenkins (Enterprise Lead)", region: "North America & Europe"
    },
    { 
      id: "pt-2", eventId: "techsummit-26", name: "Grand Marquise Suites", type: "Hotel", 
      eventsCount: 12, rating: 4.9, status: "Active", commission: 10,
      email: "reservations@grandmarquise.com", phone: "+1 (555) 431-9900",
      avatar: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&auto=format&fit=crop&q=80",
      bio: "Five-star luxury complex located adjacent to the convention corridor offering automated programmatic API blocks.",
      repName: "Marcus Vance (VP Partnerships)", region: "Downtown Hub"
    },
    { 
      id: "pt-3", eventId: "designweek-26", name: "Peak Visual Vendors", type: "Vendor", 
      eventsCount: 4, rating: 4.5, status: "Assigned Service Crew", commission: 15,
      email: "rigging@peakvisuals.de", phone: "+49 89 220199",
      avatar: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=120&auto=format&fit=crop&q=80",
      bio: "High-fidelity lighting, display rigging, and immersive panoramic video screen rental deployments serving assigned client stalls.",
      repName: "Hans Gruber (Staging Architect)", region: "EU Central Zone"
    },
    { 
      id: "pt-4", eventId: "fintech-asia", name: "Global Stay Connect", type: "Hotel", 
      eventsCount: 24, rating: 4.7, status: "Active", commission: 8,
      email: "partners@globalstay.sg", phone: "+65 6889 1200",
      avatar: "https://images.unsplash.com/photo-1551882532-8dbf0a0c7c72?w=120&auto=format&fit=crop&q=80",
      bio: "Distributed block booking engine syncing with active attendee check-in portals to optimize vacancy yield.",
      repName: "Chloe Tan (Yield Director)", region: "Asia Pacific"
    },
    { 
      id: "pt-5", eventId: "techsummit-26", name: "Transit Shuttle Pro", type: "Travel", 
      eventsCount: 6, rating: 4.6, status: "Active", commission: 10,
      email: "dispatch@transitshuttle.it", phone: "+39 02 1199 4432",
      avatar: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=120&auto=format&fit=crop&q=80",
      bio: "Dedicated private electric shuttle networks looping continuously between destination transport hubs and staging halls.",
      repName: "Mateo Rossi (Fleet Manager)", region: "Milan Metro Loop"
    }
  ]);

  // Aggregate Computation Variables
  const totalHotelAgents  = partnersList.filter(p => p.type === "Hotel").length;
  const totalTravelAgents = partnersList.filter(p => p.type === "Travel").length;
  const totalVendors      = partnersList.filter(p => p.type === "Vendor").length;
  const totalPartners     = partnersList.length;

  const tabFilteredList = useMemo(() => {
    if (activeTab === "All Partners") return partnersList;
    if (activeTab === "Hotel Agents") return partnersList.filter(p => p.type === "Hotel");
    if (activeTab === "Travel Agents") return partnersList.filter(p => p.type === "Travel");
    return partnersList.filter(p => p.type === "Vendor");
  }, [activeTab, partnersList]);

  const fullyFilteredList = useMemo(() => {
    return tabFilteredList.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.repName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesEvent = selectedEventId === "all" || item.eventId === selectedEventId;
      
      return matchesSearch && matchesEvent;
    });
  }, [tabFilteredList, searchQuery, selectedEventId]);

  const handleDeletePartner = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPartnersList(prev => prev.filter(p => p.id !== id));
    toast.success(`Commercial link to "${name}" successfully dissolved.`);
  };

  const getEventTitle = (id: string) => {
    const matched = events.find(e => e.id === id);
    return matched ? matched.title : "Global Portfolio";
  };

  // State specifically for binding a Vendor entity as authorized Staging Service Crew
  const [targetVendorForExecution, setTargetVendorForExecution] = useState<any | null>(null);
  const [targetAssignEventId, setTargetAssignEventId]           = useState("techsummit-26");

  const handleConfirmVendorAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetVendorForExecution) return;

    setPartnersList(prev => prev.map(p => {
      if (p.id !== targetVendorForExecution.id) return p;
      return {
        ...p,
        eventId: targetAssignEventId,
        status: "Assigned Service Crew"
      };
    }));

    if (selectedPartner && selectedPartner.id === targetVendorForExecution.id) {
      setSelectedPartner((prev: any) => ({ ...prev, eventId: targetAssignEventId, status: "Assigned Service Crew" }));
    }

    toast.success(`Staging authority locked! ${targetVendorForExecution.name} maps to target hall specifications.`);
    setTargetVendorForExecution(null);
  };

  return (
    <DashboardShell 
      title="Partner Hub & Subcontractor Frameworks" 
      subtitle="Govern commercial supply partners, external routing hubs, and instantiate direct Service Crew bindings answering Exhibitor physical setup parameters."
    >
      {/* ── CENTRAL WORKFLOW NOTICE ── */}
      <div className="p-4 rounded-xl glass border border-border/40 bg-accent/10 mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Wrench className="h-5 w-5 text-primary shrink-0" />
          <p className="text-xs text-foreground font-medium">
            <span className="font-bold text-primary">Vendor Binding Flow</span>: Assign staging teams as the target <span className="font-bold text-primary">Service Crew</span> for an event to directly ingest client infrastructure requests.
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background border border-border font-bold text-muted-foreground shrink-0 hidden sm:block">
          Operations Loop
        </span>
      </div>

      {/* ── COUNTERS ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="p-4 rounded-xl glass border border-border/40 bg-primary/5 flex flex-col justify-between col-span-2 md:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> Total Partners
          </span>
          <div className="mt-2">
            <span className="text-2xl font-black text-foreground">{totalPartners}</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">Contracted Nodes</span>
          </div>
        </div>

        <div className="p-4 rounded-xl glass border border-border/40 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Hotel className="h-3.5 w-3.5 text-blue-500" /> Hotel Agents
          </span>
          <div className="mt-2">
            <span className="text-xl font-bold text-foreground">{totalHotelAgents}</span>
            <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">Yield API Active</span>
          </div>
        </div>

        <div className="p-4 rounded-xl glass border border-border/40 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Plane className="h-3.5 w-3.5 text-purple-500" /> Travel Agents
          </span>
          <div className="mt-2">
            <span className="text-xl font-bold text-foreground">{totalTravelAgents}</span>
            <span className="text-[9px] text-muted-foreground block mt-0.5">Shuttle & Flight Bundles</span>
          </div>
        </div>

        <div className="p-4 rounded-xl glass border border-border/40 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-amber-500" /> Vendors
          </span>
          <div className="mt-2">
            <span className="text-xl font-bold text-foreground">{totalVendors}</span>
            <span className="text-[9px] text-amber-500 font-bold block mt-0.5">Staging Logistics</span>
          </div>
        </div>

        <div className="p-4 rounded-xl glass border border-border/40 flex flex-col justify-between bg-emerald-500/5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5" /> Comm. Ledger
          </span>
          <div className="mt-2">
            <span className="text-xl font-bold text-emerald-500">8% - 15%</span>
            <span className="text-[9px] text-muted-foreground block mt-0.5">Tiered Commission Rates</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
         {/* LEFT MAIN COL: DYNAMIC LIST CONTROLS & CARDS */}
         <div className="lg:col-span-8 space-y-6">
            {/* Top Controls */}
            <GlassCard className="p-5 border-border/40" hover={false}>
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
                     {/* Search Bar */}
                     <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <input 
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search partners by corporate brand, reps..."
                          className="w-full pl-9 pr-4 py-2 text-xs bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-medium"
                        />
                        {searchQuery && (
                          <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-[10px]">
                            Reset
                          </button>
                        )}
                     </div>

                     {/* Event Filter Dropdown */}
                     <div className="relative shrink-0">
                        <select
                          value={selectedEventId}
                          onChange={(e) => setSelectedEventId(e.target.value)}
                          className="w-full sm:w-auto pl-3.5 pr-8 py-2 text-xs bg-background border border-border rounded-xl text-foreground font-medium outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                        >
                           <option value="all" className="bg-background text-foreground">🌍 Filter Scope: All Timelines</option>
                           {events.map(ev => (
                             <option key={ev.id} value={ev.id} className="bg-background text-foreground">
                               📌 {ev.title}
                             </option>
                           ))}
                        </select>
                        <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                     </div>
                  </div>

                  <GradientButton onClick={() => toast.success("Partner invitation setup instantiated.")} size="sm" className="h-8 px-3 text-xs shrink-0">
                    <Plus className="h-3.5 w-3.5 mr-1" /> Invite Partner
                  </GradientButton>
               </div>

               {/* Tab Switcher */}
               <div className="flex flex-wrap items-center gap-1 p-1 bg-accent/20 rounded-xl border border-border/40 mt-4">
                  {partnerTabs.map(tab => {
                    const isActive = activeTab === tab;
                    const mapCounts: Record<string, number> = {
                      "All Partners": partnersList.length,
                      "Hotel Agents": partnersList.filter(p => p.type === "Hotel").length,
                      "Travel Agents": partnersList.filter(p => p.type === "Travel").length,
                      "Vendors": partnersList.filter(p => p.type === "Vendor").length
                    };
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          "relative px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                          isActive ? "text-foreground bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                         <span className="relative z-10">{tab}</span>
                         <span className={cn(
                           "relative z-10 px-1.5 py-0.2 rounded text-[9px] font-bold font-mono",
                           isActive ? "bg-primary text-white" : "bg-accent text-muted-foreground"
                         )}>
                           {mapCounts[tab]}
                         </span>
                      </button>
                    );
                  })}
               </div>
            </GlassCard>

            {/* List Rows */}
            <div className="space-y-3">
               <div className="flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Contracted Commercial Agent Entity</span>
                  <span>Ledger Parameters & Assignment Actions</span>
               </div>

               <AnimatePresence mode="popLayout">
                  {fullyFilteredList.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="p-10 text-center glass rounded-2xl border border-dashed border-border"
                    >
                       <Briefcase className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                       <p className="text-xs font-bold text-foreground">No partners matching active query logic.</p>
                    </motion.div>
                  ) : (
                    fullyFilteredList.map(item => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => setSelectedPartner(item)}
                        className={cn(
                          "p-4 rounded-xl glass border cursor-pointer transition-all flex items-center justify-between gap-4 group",
                          item.status === "Assigned Service Crew" ? "border-primary/40 bg-primary/[0.02]" : "border-border/40 hover:border-primary/30"
                        )}
                      >
                         <div className="flex items-center gap-3 min-w-0 flex-1">
                            <img src={item.avatar} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0 ring-1 ring-border group-hover:ring-primary/40 transition-all" />
                            <div className="min-w-0 flex-1">
                               <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-xs text-foreground truncate group-hover:text-primary transition-colors">{item.name}</h4>
                                  <span className={cn(
                                    "text-[9px] font-bold px-1.5 py-0.2 rounded font-mono uppercase shrink-0",
                                    item.status === "Assigned Service Crew" ? "bg-primary/10 text-primary border border-primary/20" :
                                    item.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-accent text-amber-500"
                                  )}>
                                    {item.status}
                                  </span>
                               </div>
                               <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                                  <span className="font-semibold text-foreground/80">{item.type} Hub</span>
                                  <span>·</span>
                                  <span className="truncate">Rep: {item.repName.split(" ")[0]}</span>
                                  <span>·</span>
                                  <span className="text-primary font-bold">★ {item.rating}</span>
                               </div>
                            </div>
                         </div>

                         <div className="flex items-center gap-4 shrink-0">
                            <div className="hidden sm:block text-right">
                               <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">Mapped Hall Base</span>
                               <span className="text-xs font-semibold truncate max-w-[140px] text-foreground/90">📌 {getEventTitle(item.eventId)}</span>
                            </div>

                            <div className="hidden md:block text-right px-3 border-l border-border/60">
                               <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">Comm.</span>
                               <span className="text-xs font-bold font-mono text-emerald-500">{item.commission}%</span>
                            </div>

                            {/* Service Crew Mapping Button */}
                            <div className="flex items-center gap-1 shrink-0 border-l border-border/60 pl-2">
                               {item.type === "Vendor" && (
                                 <GradientButton
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     setTargetVendorForExecution(item);
                                     setTargetAssignEventId(item.eventId);
                                   }}
                                   size="sm"
                                   className="text-[10px] h-8 px-2.5 shrink-0 mr-1"
                                 >
                                    Assign Service Crew
                                 </GradientButton>
                               )}
                               <button
                                 onClick={(e) => { e.stopPropagation(); setSelectedPartner(item); }}
                                 className="h-8 w-8 rounded-lg bg-background border border-border grid place-items-center text-muted-foreground hover:text-primary transition-colors"
                                 title="Inspect Complete Contract Logs"
                               >
                                  <Eye className="h-3.5 w-3.5" />
                               </button>
                               <button
                                 onClick={(e) => handleDeletePartner(item.id, item.name, e)}
                                 className="h-8 w-8 rounded-lg bg-background border border-border grid place-items-center text-muted-foreground hover:text-destructive transition-colors opacity-70 hover:opacity-100"
                                 title="Dissolve link"
                               >
                                  <Trash2 className="h-3.5 w-3.5" />
                               </button>
                            </div>
                         </div>
                      </motion.div>
                    ))
                  )}
               </AnimatePresence>
            </div>
         </div>

         {/* RIGHT MAIN COL: GLOBAL INSIGHTS & CONTROLS */}
         <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-5 border-border/40" hover={false}>
               <h3 className="font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
                  <Settings className="h-4 w-4 text-primary" /> Global Commission Structures
               </h3>
               <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2.5 border-b border-border/40">
                     <span className="text-muted-foreground">Hotel Reservation Settlement</span>
                     <span className="font-bold font-mono text-primary">10% Default</span>
                  </div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-border/40">
                     <span className="text-muted-foreground">Travel Package Premium</span>
                     <span className="font-bold font-mono text-primary">12% Default</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-muted-foreground">Vendor Rigging Hardware</span>
                     <span className="font-bold font-mono text-primary">15% Default</span>
                  </div>
                  <GradientButton className="w-full h-9 mt-2 text-xs" size="sm">Update Commission Caps</GradientButton>
               </div>
            </GlassCard>

            <div className="p-5 bg-background rounded-xl border border-border space-y-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pending Supply Audits</h3>
               <div className="space-y-3">
                  {[1].map(i => (
                     <div key={i} className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center shrink-0 text-amber-500 mt-0.5">
                           <MessageSquare className="h-3.5 w-3.5" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-foreground">Luxe Fleet Shuttles App</p>
                           <p className="text-[10px] text-muted-foreground mt-0.5">Target hall: TechSummit 2026</p>
                           <div className="flex gap-2 mt-2">
                              <button onClick={() => toast.success("Partner access authorized.")} className="text-[10px] font-bold text-primary hover:underline">Authorize</button>
                              <button onClick={() => toast.info("Audit dismissed.")} className="text-[10px] font-bold text-muted-foreground hover:underline">Dismiss</button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <GlassCard className="p-5 bg-primary/[0.02] border-primary/20" hover={false}>
               <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Accrued Settlement Yield</h3>
                  <DollarSign className="h-4 w-4 text-primary" />
               </div>
               <p className="text-xl font-bold font-mono text-foreground">$42,901</p>
               <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">Net commissions earned directly from fully finalized bookings.</p>
            </GlassCard>
         </div>
      </div>

      {/* ── OVERLAY: ASSIGN VENDOR AS STAGING CREW MODAL ── */}
      <AnimatePresence>
        {targetVendorForExecution && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setTargetVendorForExecution(null)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 22, stiffness: 320 }}
              className="relative w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl z-10 overflow-hidden p-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-primary" /> Map Staging Execution Crew
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Authorizing <span className="font-bold text-foreground">{targetVendorForExecution.name}</span></p>
                </div>
                <button onClick={() => setTargetVendorForExecution(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmVendorAssignment} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Target Bound Exhibition Scope *
                  </label>
                  <select
                    value={targetAssignEventId}
                    onChange={(e) => setTargetAssignEventId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-accent/20 border border-border rounded-xl text-foreground font-medium outline-none focus:border-primary transition-all"
                  >
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>
                        📌 {ev.title} ({ev.city})
                      </option>
                    ))}
                  </select>
                  <span className="text-[9px] text-muted-foreground block mt-1">
                    Any physical line items added by Exhibitors in this summit instantly trigger vendor hardware tasks.
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-accent/10 border border-border/40 text-[10px] text-muted-foreground leading-tight">
                  ⚡ <span className="font-bold text-foreground">Downstream Pipeline Hook</span>: This account stream automatically inherits full hardware readiness management permissions for client stalls.
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-border/60">
                  <button 
                    type="button" 
                    onClick={() => setTargetVendorForExecution(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <GradientButton type="submit" size="sm" className="h-8 text-xs px-4">
                    Confirm Crew Mapping
                  </GradientButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── OVERLAY: PREMIUM DETAILS MODAL ── */}
      <AnimatePresence>
         {selectedPartner && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedPartner(null)}
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
                       <img src={selectedPartner.avatar} alt="" className="h-14 w-14 rounded-xl object-cover ring-1 ring-border" />
                       <div>
                          <div className="flex items-center gap-2 mb-0.5">
                             <span className="px-2 py-0.2 rounded text-[9px] font-bold uppercase tracking-widest bg-primary text-white font-mono">
                               {selectedPartner.type} Hub
                             </span>
                             <span className="text-[10px] font-bold text-emerald-500 font-mono">Comm. Index: {selectedPartner.commission}%</span>
                          </div>
                          <h2 className="text-base font-bold text-foreground tracking-tight">{selectedPartner.name}</h2>
                          <p className="text-xs text-muted-foreground font-medium">Coverage Area: {selectedPartner.region}</p>
                       </div>
                    </div>
                    <button onClick={() => setSelectedPartner(null)} className="text-muted-foreground hover:text-foreground">
                       <X className="h-4 w-4" />
                    </button>
                 </div>

                 <div className="p-5 overflow-y-auto space-y-4 flex-1 no-scrollbar text-xs">
                    <div className="p-4 rounded-xl bg-accent/10 border border-border/40 space-y-3">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                         Mapped Hall Timeline
                       </span>
                       <div className="grid grid-cols-2 gap-3 font-mono">
                          <div>
                             <span className="text-[9px] text-muted-foreground block font-sans uppercase">Target Base</span>
                             <span className="font-bold text-foreground">{getEventTitle(selectedPartner.eventId)}</span>
                          </div>
                          <div>
                             <span className="text-[9px] text-muted-foreground block font-sans uppercase">Operational Handshake</span>
                             <span className="font-bold text-emerald-500">{selectedPartner.status}</span>
                          </div>
                       </div>

                       {selectedPartner.type === "Vendor" && (
                         <div className="pt-2 border-t border-border/40 flex justify-end">
                           <GradientButton
                             onClick={() => {
                               setTargetVendorForExecution(selectedPartner);
                               setTargetAssignEventId(selectedPartner.eventId);
                             }}
                             size="sm"
                             className="text-[10px] h-7 px-3"
                           >
                              Update Linked Scope
                           </GradientButton>
                         </div>
                       )}
                    </div>

                    <div className="space-y-2">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                         Corporate Verification Log
                       </span>
                       <p className="text-muted-foreground bg-accent/5 p-3 rounded-xl border border-border/40 leading-relaxed font-sans">
                          "{selectedPartner.bio}"
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                       <div className="p-2.5 rounded-xl bg-background border border-border flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                          <div className="min-w-0">
                             <span className="text-[9px] text-muted-foreground block font-bold">Liaison Agent</span>
                             <span className="text-[11px] font-medium text-foreground truncate block">{selectedPartner.repName.split(" ")[0]}</span>
                          </div>
                       </div>
                       <div className="p-2.5 rounded-xl bg-background border border-border flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <div className="min-w-0">
                             <span className="text-[9px] text-muted-foreground block font-bold">Telecom Contact</span>
                             <span className="text-[11px] font-medium text-foreground truncate block">{selectedPartner.phone}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="p-4 border-t border-border bg-accent/20 flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground flex items-center gap-1">
                       <ShieldCheck className="h-3 w-3 text-emerald-500" /> Gateway Agreement Synchronized
                    </span>
                    <button
                      onClick={() => setSelectedPartner(null)}
                      className="px-3 py-1 rounded-lg bg-background text-foreground font-bold hover:bg-accent border border-border"
                    >
                       Dismiss
                    </button>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </DashboardShell>
  );
}
