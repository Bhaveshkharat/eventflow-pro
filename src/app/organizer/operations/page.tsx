"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Truck, Hotel, Plane, 
  Settings, Plus, Search, Filter, 
  Trash2, Eye, X, Mail, Phone, 
  Briefcase, CheckCircle2, DollarSign,
  ChevronRight, MessageSquare, ShieldCheck,
  Zap, Wrench, Check, Layers, Tag
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell"; // trigger rebuild
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events } from "@/data/mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  GlobalPartner, 
  PartnerService, 
  getPersistedPartners, 
  savePersistedPartners, 
  pushNewPartnerToStorage 
} from "@/lib/partnersStore";

const partnerTabs = ["All Partners", "Hotel Agents", "Travel Agents", "Vendors"] as const;

export default function OrganizerOperations() {
  const [partnersList, setPartnersList] = useState<GlobalPartner[]>([]);
  const [activeTab, setActiveTab] = useState<typeof partnerTabs[number]>("All Partners");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("all");
  
  // Dialog state maps
  const [selectedPartner, setSelectedPartner] = useState<GlobalPartner | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Load from centralized client store on module mount
  useEffect(() => {
    setPartnersList(getPersistedPartners());
  }, []);

  // Invitation Buffer Form state mapping strictly to specific target events
  const [newInviteForm, setNewInviteForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    providedService: "",
    primaryType: "Vendor" as "Hotel" | "Travel" | "Vendor",
    selectedServices: ["Vendor"] as PartnerService[],
    targetEventId: "techsummit-26",
    commissionVal: "12",
    regionCover: "Global & Event Hub"
  });

  const toggleServiceCapability = (srv: PartnerService) => {
    setNewInviteForm(prev => {
      const exists = prev.selectedServices.includes(srv);
      if (exists && prev.selectedServices.length === 1) {
        toast.error("A partner entity must map at least one operational capability.");
        return prev;
      }
      if (exists) {
        return { ...prev, selectedServices: prev.selectedServices.filter(s => s !== srv) };
      } else {
        return { ...prev, selectedServices: [...prev.selectedServices, srv] };
      }
    });
  };

  const handleCommitPartnerInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInviteForm.name.trim() || !newInviteForm.email.trim()) {
      toast.error("Please supply valid entity identification strings.");
      return;
    }

    const targetEvent = events.find(ev => ev.id === newInviteForm.targetEventId);

    const generatedPartner: GlobalPartner = {
      id: `gp-${Date.now()}`,
      eventId: newInviteForm.targetEventId,
      name: newInviteForm.name.trim(),
      company: newInviteForm.company.trim() || `${newInviteForm.name.trim()} Agency`,
      services: newInviteForm.selectedServices,
      providedService: newInviteForm.providedService.trim() || "Custom Event Operations & Infrastructure",
      type: newInviteForm.primaryType,
      eventsCount: 1,
      rating: 4.8,
      status: "Active Sync",
      commission: Number(newInviteForm.commissionVal) || 12,
      split: `$${(Math.random() * 8 + 4).toFixed(1)}k Base Agreement`,
      email: newInviteForm.email.trim(),
      phone: newInviteForm.phone.trim() || "+1 (555) 891-0022",
      avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(newInviteForm.name)}`,
      bio: `Dynamically invited multi-service supply contractor mapped explicitly to execute framework requests for ${targetEvent?.title || "selected timeline"}.`,
      repName: "Assigned Client Liaison",
      region: newInviteForm.regionCover.trim() || targetEvent?.city || "Host Base"
    };

    // Store in continuous persistent registry so event specific views map instantly
    const refreshed = pushNewPartnerToStorage(generatedPartner);
    setPartnersList(refreshed);

    toast.success(`Successfully dispatched secure invite handshake to "${generatedPartner.name}". Synchronized directly under ${targetEvent?.title || "target event"} listings!`);
    
    // Reset buffer
    setNewInviteForm({
      name: "",
      company: "",
      email: "",
      phone: "",
      providedService: "",
      primaryType: "Vendor",
      selectedServices: ["Vendor"],
      targetEventId: "techsummit-26",
      commissionVal: "12",
      regionCover: "Global & Event Hub"
    });
    setIsInviteModalOpen(false);
  };

  // State specifically for binding a Vendor entity as authorized Staging Service Crew
  const [targetVendorForExecution, setTargetVendorForExecution] = useState<GlobalPartner | null>(null);
  const [targetAssignEventId, setTargetAssignEventId]           = useState("techsummit-26");

  const handleConfirmVendorAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetVendorForExecution) return;

    const modified = partnersList.map(p => {
      if (p.id !== targetVendorForExecution.id) return p;
      return {
        ...p,
        eventId: targetAssignEventId,
        status: "Assigned Service Crew"
      };
    });

    setPartnersList(modified);
    savePersistedPartners(modified);

    if (selectedPartner && selectedPartner.id === targetVendorForExecution.id) {
      setSelectedPartner(prev => prev ? ({ ...prev, eventId: targetAssignEventId, status: "Assigned Service Crew" }) : null);
    }

    const matchedEv = events.find(ev => ev.id === targetAssignEventId);
    toast.success(`Staging authority locked! ${targetVendorForExecution.name} maps to ${matchedEv?.title || "target hall"} specifications.`);
    setTargetVendorForExecution(null);
  };

  const handleDeletePartner = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const truncated = partnersList.filter(p => p.id !== id);
    setPartnersList(truncated);
    savePersistedPartners(truncated);
    toast.success(`Commercial link to "${name}" successfully dissolved.`);
  };

  const getEventTitle = (id: string) => {
    const matched = events.find(e => e.id === id);
    return matched ? matched.title : "Global Portfolio";
  };

  // Aggregate Computation Variables
  const totalHotelAgents  = partnersList.filter(p => p.type === "Hotel" || p.services.includes("Hotel")).length;
  const totalTravelAgents = partnersList.filter(p => p.type === "Travel" || p.services.includes("Travel")).length;
  const totalVendors      = partnersList.filter(p => p.type === "Vendor" || p.services.includes("Vendor")).length;
  const totalPartners     = partnersList.length;

  const tabFilteredList = useMemo(() => {
    if (activeTab === "All Partners") return partnersList;
    if (activeTab === "Hotel Agents") return partnersList.filter(p => p.services.includes("Hotel"));
    if (activeTab === "Travel Agents") return partnersList.filter(p => p.services.includes("Travel"));
    return partnersList.filter(p => p.services.includes("Vendor"));
  }, [activeTab, partnersList]);

  const fullyFilteredList = useMemo(() => {
    return tabFilteredList.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.repName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesEvent = selectedEventId === "all" || item.eventId === selectedEventId;
      
      return matchesSearch && matchesEvent;
    });
  }, [tabFilteredList, searchQuery, selectedEventId]);

  return (
    <DashboardShell
      title="Partner Hub"
      subtitle="Manage partner agencies, assign event-specific service teams, and configure commission agreements."
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

                  {/* Specifically Requested Invitation trigger mounting our premium glassmorphic target mapping modal */}
                  <GradientButton 
                    onClick={() => setIsInviteModalOpen(true)} 
                    size="sm" 
                    className="h-9 px-4 text-xs shrink-0 shadow-sm"
                  >
                    <Plus className="h-4 w-4 mr-1.5" /> Invite Partner
                  </GradientButton>
               </div>

               {/* Tab Switcher */}
               <div className="flex flex-wrap items-center gap-1 p-1 bg-accent/20 rounded-xl border border-border/40 mt-4">
                  {partnerTabs.map(tab => {
                    const isActive = activeTab === tab;
                    const mapCounts: Record<string, number> = {
                      "All Partners": partnersList.length,
                      "Hotel Agents": partnersList.filter(p => p.services.includes("Hotel")).length,
                      "Travel Agents": partnersList.filter(p => p.services.includes("Travel")).length,
                      "Vendors": partnersList.filter(p => p.services.includes("Vendor")).length
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
                  <span>Partner Details</span>
                  <span>Actions</span>
               </div>

               <AnimatePresence mode="popLayout">
                  {fullyFilteredList.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="p-10 text-center glass rounded-2xl border border-dashed border-border"
                    >
                       <Briefcase className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                       <p className="text-xs font-bold text-foreground">No partners matching active filters.</p>
                       <p className="text-[10px] text-muted-foreground mt-0.5">Click 'Invite Partner' above to add new partners to the ecosystem.</p>
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
                          "p-4 rounded-xl glass border cursor-pointer transition-all flex items-center justify-between gap-4 group relative overflow-hidden",
                          item.status === "Assigned Service Crew" ? "border-primary/40 bg-primary/[0.02]" : "border-border/40 hover:border-primary/30"
                        )}
                      >
                         <div className="flex items-center gap-3 min-w-0 flex-1">
                            <img src={item.avatar} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0 ring-1 ring-border group-hover:ring-primary/40 transition-all bg-background" />
                            <div className="min-w-0 flex-1">
                               <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-xs text-foreground truncate group-hover:text-primary transition-colors">{item.name}</h4>
                                  
                                  {/* Overlapping service pills mapped securely */}
                                  <div className="flex items-center gap-1 shrink-0">
                                    {item.services.map(srv => {
                                      const clr = {
                                        Hotel: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                                        Travel: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                                        Vendor: "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                      };
                                      return (
                                        <span key={srv} className={cn("px-1 py-0.2 rounded text-[8px] font-bold font-mono border uppercase tracking-wider", clr[srv])}>
                                          {srv}
                                        </span>
                                      );
                                    })}
                                  </div>

                                  <span className={cn(
                                    "text-[9px] font-bold px-1.5 py-0.2 rounded font-mono uppercase shrink-0 ml-auto sm:ml-0",
                                    item.status === "Assigned Service Crew" ? "bg-primary/10 text-primary border border-primary/20" :
                                    item.status.includes("Active") ? "bg-emerald-500/10 text-emerald-500" : "bg-accent text-amber-500"
                                  )}>
                                    {item.status}
                                  </span>
                               </div>

                               {/* Render specific vendor service contribution */}
                               <div className="mt-1 flex items-center gap-1.5">
                                  <span className="text-[9px] uppercase tracking-wider font-bold text-amber-500 font-mono bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 shrink-0">
                                    Provided Service
                                  </span>
                                  <span className="text-xs font-bold text-foreground/90 truncate">
                                    {item.providedService || "General Operations & Equipment"}
                                  </span>
                               </div>

                               <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                                  <span className="font-semibold text-foreground/80">{item.company}</span>
                                  <span>·</span>
                                  <span className="truncate">📧 {item.email}</span>
                                  <span>·</span>
                                  <span className="text-primary font-bold shrink-0">★ {item.rating}</span>
                               </div>
                            </div>
                         </div>

                         <div className="flex items-center gap-4 shrink-0">
                            <div className="hidden sm:block text-right">
                               <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">Assigned Event</span>
                               <span className="text-xs font-semibold truncate max-w-[140px] text-foreground/90 block">📌 {getEventTitle(item.eventId)}</span>
                            </div>

                            <div className="hidden md:block text-right px-3 border-l border-border/60">
                               <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">Comm.</span>
                               <span className="text-xs font-bold font-mono text-emerald-500 block">{item.commission}%</span>
                            </div>

                            {/* Service Crew Mapping Button */}
                            <div className="flex items-center gap-1 shrink-0 border-l border-border/60 pl-2">
                               {item.services.includes("Vendor") && (
                                 <GradientButton
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     setTargetVendorForExecution(item);
                                     setTargetAssignEventId(item.eventId);
                                   }}
                                   size="sm"
                                   className="text-[10px] h-8 px-2.5 shrink-0 mr-1"
                                 >
                                    Assign Tasks
                                 </GradientButton>
                               )}
                               <button
                                 onClick={(e) => { e.stopPropagation(); setSelectedPartner(item); }}
                                 className="h-8 w-8 rounded-lg bg-background border border-border grid place-items-center text-muted-foreground hover:text-primary transition-colors"
                                 title="View Profile"
                               >
                                  <Eye className="h-3.5 w-3.5" />
                               </button>
                               <button
                                 onClick={(e) => handleDeletePartner(item.id, item.name, e)}
                                 className="h-8 w-8 rounded-lg bg-background border border-border grid place-items-center text-muted-foreground hover:text-destructive transition-colors opacity-70 hover:opacity-100"
                                 title="Delete"
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

      {/* ═════════════════════════════════════════════════════════════════════════════
          OVERHAULED HYPER-VISIBLE PREMIUM GLASSMORPHIC PARTNER INVITATION ENGINE
          ═════════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute inset-0 bg-neutral-950/85 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-neutral-900/95 border-2 border-primary/40 rounded-2xl shadow-[0_0_50px_-12px_rgba(var(--primary),0.3)] z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-primary/30 via-background/90 to-background/90 border-b border-primary/30 backdrop-blur-md">
                <div>
                  <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest block mb-0.5 flex items-center gap-1">
                    <Zap className="h-3 w-3" /> Operations Dispatch Pipeline
                  </span>
                  <h2 className="font-extrabold text-base text-foreground tracking-tight">Invite Partner Agency & Bind Target Timeline</h2>
                </div>
                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  className="h-8 w-8 rounded-xl bg-background/80 border-2 border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-xs"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCommitPartnerInvitation} className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
                  <div>
                    <label className="text-xs font-extrabold text-foreground uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-primary" /> Commercial Entity Identity Details
                    </label>

                    <div className="grid sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider block mb-1">Commercial Brand Identifier *</span>
                        <input
                          required
                          type="text"
                          value={newInviteForm.name}
                          onChange={e => setNewInviteForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="e.g. Apex Visual & Sound Crew"
                          className="w-full bg-background/95 border-2 border-border/80 rounded-xl py-2.5 px-3.5 text-xs outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 font-bold shadow-inner transition-all"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider block mb-1">Corporate Parent Legal String</span>
                        <input
                          type="text"
                          value={newInviteForm.company}
                          onChange={e => setNewInviteForm(f => ({ ...f, company: e.target.value }))}
                          placeholder="e.g. Apex Global Stages LLC"
                          className="w-full bg-background/95 border-2 border-border/80 rounded-xl py-2.5 px-3.5 text-xs outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 font-bold shadow-inner transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider block mb-1">Secure Operations Email String *</span>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <input
                            required
                            type="email"
                            value={newInviteForm.email}
                            onChange={e => setNewInviteForm(f => ({ ...f, email: e.target.value }))}
                            placeholder="dispatch@apexstages.internal"
                            className="w-full bg-background/95 border-2 border-border/80 rounded-xl py-2.5 pl-9 pr-3.5 text-xs outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 font-bold shadow-inner transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider block mb-1">Dispatch Telecom Channel</span>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <input
                            type="text"
                            value={newInviteForm.phone}
                            onChange={e => setNewInviteForm(f => ({ ...f, phone: e.target.value }))}
                            placeholder="+1 (555) 321-9988"
                            className="w-full bg-background/95 border-2 border-border/80 rounded-xl py-2.5 pl-9 pr-3.5 text-xs outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 font-bold shadow-inner transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wider block mb-1">Provided Service Provision (What Vendor Will Provide)</span>
                      <input
                        type="text"
                        value={newInviteForm.providedService}
                        onChange={e => setNewInviteForm(f => ({ ...f, providedService: e.target.value }))}
                        placeholder="e.g. Panoramic Stage Rigging, PA Audio Arrays, Catering Stations"
                        className="w-full bg-background/95 border-2 border-amber-500/30 focus:border-amber-500 rounded-xl py-2.5 px-3.5 text-xs outline-none text-foreground placeholder:text-muted-foreground/60 font-bold shadow-inner transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Specifically requested capability mapping: Vendor, Hotel, Travel, or overlapping all-in-one */}
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-3">
                  <div>
                    <label className="text-xs font-extrabold text-foreground uppercase tracking-wider block">
                      Assigned Capabilities & Service Scopes *
                    </label>
                    <span className="text-[11px] text-muted-foreground font-medium block mt-0.5 leading-tight">
                      Check each matching service domain to make this provider dynamically visible under targeted event sub-tabs. Providers can overlap one, two, or all three services.
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-1">
                    {(["Vendor", "Hotel", "Travel"] as const).map(srvOpt => {
                      const isSelected = newInviteForm.selectedServices.includes(srvOpt);
                      const srvMeta = {
                        Vendor: { clr: "border-amber-500/60 text-amber-500", desc: "Rigging & AV setup" },
                        Hotel: { clr: "border-blue-500/60 text-blue-400", desc: "Room blocks API" },
                        Travel: { clr: "border-purple-500/60 text-purple-400", desc: "Shuttles & flights" }
                      };

                      return (
                        <button
                          key={srvOpt}
                          type="button"
                          onClick={() => toggleServiceCapability(srvOpt)}
                          className={cn(
                            "p-3.5 rounded-xl border-2 text-left transition-all relative group overflow-hidden flex flex-col justify-between shadow-xs",
                            isSelected 
                              ? `bg-white/10 border-primary` 
                              : "bg-background/80 border-border/80 hover:border-border text-muted-foreground"
                          )}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <span className={cn("text-xs font-extrabold", isSelected ? "text-foreground" : "")}>
                                {srvOpt}
                              </span>
                              <div className={cn("h-4 w-4 rounded-md border-2 grid place-items-center shrink-0 transition-colors", isSelected ? "bg-primary border-primary text-background" : "border-border bg-background")}>
                                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                              </div>
                            </div>
                            <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight mt-1 font-medium">
                              {srvMeta[srvOpt].desc}
                            </p>
                          </div>
                          
                          <span className={cn("text-[9px] font-mono font-extrabold block mt-3 pt-1.5 border-t border-border/40", isSelected ? srvMeta[srvOpt].clr : "text-transparent")}>
                            Mapped
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-muted-foreground block">
                      Primary Ledger Heading Tag
                    </span>
                    <select
                      value={newInviteForm.primaryType}
                      onChange={e => setNewInviteForm(f => ({ ...f, primaryType: e.target.value as any }))}
                      className="bg-background/95 border-2 border-border/80 rounded-xl py-1.5 px-3 text-xs font-bold text-foreground outline-none shadow-inner"
                    >
                      {newInviteForm.selectedServices.map(s => (
                        <option key={s} value={s}>{s} Index Category</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Target Specific Event Binding Picker */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border-2 border-primary/30 space-y-3">
                  <div>
                    <label className="text-xs font-extrabold text-primary uppercase tracking-wider block">
                      Target Associated Timeline Mapping *
                    </label>
                    <span className="text-[11px] text-muted-foreground font-medium block mt-0.5 leading-tight">
                      Bind this partner directly to any existing summit timeline. The invited contractor automatically shows up under that event's specific inner tabs.
                    </span>
                  </div>

                  <select
                    value={newInviteForm.targetEventId}
                    onChange={e => setNewInviteForm(f => ({ ...f, targetEventId: e.target.value }))}
                    className="w-full bg-background/95 border-2 border-border/80 rounded-xl py-2.5 px-3.5 text-xs font-extrabold text-foreground outline-none focus:border-primary transition-all cursor-pointer shadow-inner"
                  >
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id} className="bg-background text-foreground font-bold">
                        📌 {ev.title} — {ev.city}, {ev.country} ({ev.date})
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-2 gap-3 pt-2 font-mono">
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-sans font-extrabold uppercase tracking-wider">Commission Edge</span>
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={newInviteForm.commissionVal}
                          onChange={e => setNewInviteForm(f => ({ ...f, commissionVal: e.target.value }))}
                          className="w-16 bg-background/95 border-2 border-border/80 rounded-xl py-1 px-2 text-xs text-primary font-extrabold outline-none text-right shadow-inner"
                        />
                        <span className="text-xs text-muted-foreground font-extrabold">%</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground block font-sans font-extrabold uppercase tracking-wider">Coverage Geofence</span>
                      <input
                        type="text"
                        value={newInviteForm.regionCover}
                        onChange={e => setNewInviteForm(f => ({ ...f, regionCover: e.target.value }))}
                        placeholder="e.g. EU Core Transit"
                        className="w-full bg-background/95 border-2 border-border/80 rounded-xl py-1 px-2.5 text-xs text-foreground outline-none mt-1 truncate shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-extrabold text-muted-foreground hover:text-foreground transition-all"
                  >
                    Cancel Handshake
                  </button>
                  <GradientButton type="submit" size="sm" className="h-10 px-6 font-extrabold text-xs shadow-md">
                    Dispatch Linked Handshake
                  </GradientButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                    className="w-full px-3 py-2 text-xs bg-accent/20 border border-border rounded-xl text-foreground font-medium outline-none focus:border-primary transition-all cursor-pointer"
                  >
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id} className="bg-background text-foreground">
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

      {/* ── OVERLAY: VIEW PROFILE MODAL ── */}
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
                       <img src={selectedPartner.avatar} alt="" className="h-14 w-14 rounded-xl object-cover ring-1 ring-border bg-background" />
                       <div>
                          <div className="flex items-center gap-2 mb-0.5">
                             <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-primary text-white font-mono">
                               {selectedPartner.type} Partner
                             </span>
                             <span className="text-[10px] font-bold text-emerald-500 font-mono">Commission: {selectedPartner.commission}%</span>
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
                         Assigned Event Details
                       </span>
                       <div className="grid grid-cols-2 gap-3 font-mono">
                          <div>
                             <span className="text-[9px] text-muted-foreground block font-sans uppercase">Event Name</span>
                             <span className="font-bold text-foreground">{getEventTitle(selectedPartner.eventId)}</span>
                          </div>
                          <div>
                             <span className="text-[9px] text-muted-foreground block font-sans uppercase">Status</span>
                             <span className="font-bold text-emerald-500">{selectedPartner.status}</span>
                          </div>
                       </div>

                       <div className="pt-2 border-t border-border/40">
                          <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider block">Provided Service Provision</span>
                          <span className="text-xs font-bold text-foreground block mt-0.5">
                            {selectedPartner.providedService || "General Event Operations & Equipment"}
                          </span>
                       </div>

                       {selectedPartner.services.includes("Vendor") && (
                         <div className="pt-2 border-t border-border/40 flex justify-end">
                           <GradientButton
                             onClick={() => {
                               setTargetVendorForExecution(selectedPartner);
                               setTargetAssignEventId(selectedPartner.eventId);
                             }}
                             size="sm"
                             className="text-[10px] h-7 px-3"
                           >
                              Update Event Scope
                           </GradientButton>
                         </div>
                       )}
                    </div>

                    <div className="space-y-2">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                         Company Description / Notes
                       </span>
                       <p className="text-muted-foreground bg-accent/5 p-3 rounded-xl border border-border/40 leading-relaxed font-sans">
                          "{selectedPartner.bio}"
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                       <div className="p-2.5 rounded-xl bg-background border border-border flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                          <div className="min-w-0">
                             <span className="text-[9px] text-muted-foreground block font-bold">Contact Person</span>
                             <span className="text-[11px] font-medium text-foreground truncate block">{selectedPartner.repName?.split(" ")[0] || "Coordinator"}</span>
                          </div>
                       </div>
                       <div className="p-2.5 rounded-xl bg-background border border-border flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <div className="min-w-0">
                             <span className="text-[9px] text-muted-foreground block font-bold">Phone Number</span>
                             <span className="text-[11px] font-medium text-foreground truncate block">{selectedPartner.phone}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="p-4 border-t border-border bg-accent/20 flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground flex items-center gap-1">
                       <ShieldCheck className="h-3 w-3 text-emerald-500" /> Verified Partner Account
                    </span>
                    <button
                      onClick={() => setSelectedPartner(null)}
                      className="px-3 py-1 rounded-lg bg-background text-foreground font-bold hover:bg-accent border border-border"
                    >
                       Close
                    </button>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </DashboardShell>
  );
}
