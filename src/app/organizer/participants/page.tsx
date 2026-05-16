"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Building2, Ticket, ShieldCheck, Mic2, 
  Search, Filter, Trash2, Eye, X, Mail, Phone, 
  Briefcase, Calendar, CheckCircle2, AlertCircle, ChevronRight,
  Plus, Layout, MapPin, Check
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events } from "@/data/mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const participantTabs = ["Exhibitors", "Visitors", "Delegates", "Speakers"] as const;

export default function ParticipantsManagement() {
  const [activeTab, setActiveTab] = useState<typeof participantTabs[number]>("Exhibitors");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("all");
  const [selectedParticipant, setSelectedParticipant] = useState<any | null>(null);

  // Stateful list of approved client accounts mapped across venues
  const [exhibitorsList, setExhibitorsList] = useState([
    { id: "ex-1", eventId: "techsummit-26", name: "Orbit Systems", email: "contact@orbitsystems.io", role: "Exhibitor", meta: "Booth #A-101 (Island Premium)", status: "Confirmed", date: "2026-05-10", avatar: "https://i.pravatar.cc/80?img=12", bio: "Leading cloud infrastructure provider showcasing next-gen automated deployment workflows.", org: "Orbit Systems Inc.", phone: "+1 (555) 019-2834" },
    { id: "ex-2", eventId: "techsummit-26", name: "Nimbus Bio", email: "partners@nimbusbio.com", role: "Exhibitor", meta: "Booth #C-304 (Standard Floor)", status: "Confirmed", date: "2026-05-11", avatar: "https://i.pravatar.cc/80?img=20", bio: "Healthcare analytics framework integration suite for enterprise ecosystems.", org: "Nimbus BioCare Ltd.", phone: "+1 (555) 832-1102" },
    { id: "ex-3", eventId: "designweek-26", name: "Studio Core Architecture", email: "hello@studiocore.it", role: "Exhibitor", meta: "Pavilion 4 (Premium Corner)", status: "Confirmed", date: "2026-03-12", avatar: "https://i.pravatar.cc/80?img=5", bio: "Parametric design studio debuting sustainable modular assembly systems.", org: "Studio Core Milano", phone: "+39 02 4419 9201" },
    { id: "ex-4", eventId: "fintech-asia", name: "Aura Pay Integration", email: "vendor@aurapay.sg", role: "Exhibitor", meta: "Pending Space Allocation", status: "Pending Allocation", date: "2026-06-01", avatar: "https://i.pravatar.cc/80?img=18", bio: "Low-latency blockchain verification layer optimizing cross-border enterprise settlements.", org: "Aura Global", phone: "+65 6788 0192" }
  ]);

  const [visitorsList, setVisitorsList] = useState([
    { id: "vis-1", eventId: "techsummit-26", name: "Olivia Bennett", email: "olivia@aurora.io", role: "Visitor", meta: "General Tier", status: "Checked-in", date: "2026-05-01", avatar: "https://i.pravatar.cc/80?img=47", bio: "Product Designer interested in AI tooling and dynamic responsive interfaces.", org: "Aurora Studios", phone: "+1 (555) 203-9182" },
    { id: "vis-2", eventId: "techsummit-26", name: "Sofia Romano", email: "sofia@studio.co", role: "Visitor", meta: "General Tier", status: "Pending", date: "2026-05-08", avatar: "https://i.pravatar.cc/80?img=32", bio: "Senior UX Architect specializing in cross-platform accessible design tokens.", org: "Studio Co", phone: "+39 02 123456" },
    { id: "vis-3", eventId: "designweek-26", name: "Liam O'Connor", email: "liam@ember.io", role: "Visitor", meta: "General Tier", status: "Confirmed", date: "2026-05-09", avatar: "https://i.pravatar.cc/80?img=8", bio: "Frontend Tech Lead researching low-latency state propagation.", org: "Ember Tech", phone: "+353 1 496 0123" },
    { id: "vis-4", eventId: "fintech-asia", name: "Elena Rostova", email: "elena@crypto.de", role: "Visitor", meta: "General Tier", status: "Checked-in", date: "2026-06-15", avatar: "https://i.pravatar.cc/80?img=9", bio: "Risk Consultant investigating decentralized ledger compliance frameworks.", org: "Rostova Advisory", phone: "+49 89 201934" }
  ]);

  const [delegatesList, setDelegatesList] = useState([
    { id: "del-1", eventId: "techsummit-26", name: "Marcus Chen", email: "marcus@nimbus.dev", role: "Delegate", meta: "VIP Pass", status: "Confirmed", date: "2026-04-15", avatar: "https://i.pravatar.cc/80?img=11", bio: "VP of Engineering focused on resilient multi-tenant database clusters and scale.", org: "Nimbus Global", phone: "+1 (555) 992-0012" },
    { id: "del-2", eventId: "techsummit-26", name: "Aiden Park", email: "aiden@orbit.ai", role: "Delegate", meta: "Pro Pass", status: "Checked-in", date: "2026-04-20", avatar: "https://i.pravatar.cc/80?img=15", bio: "Principal Distributed Systems Engineer building highly concurrent networking layers.", org: "Orbit AI Core", phone: "+1 (555) 341-8890" },
    { id: "del-3", eventId: "designweek-26", name: "Yuki Sato", email: "yuki@kanji.jp", role: "Delegate", meta: "VIP Pass", status: "Confirmed", date: "2026-04-22", avatar: "https://i.pravatar.cc/80?img=23", bio: "Head of Digital Operations driving multi-cloud serverless adoption.", org: "Kanji Enterprises", phone: "+81 3 5555 0192" },
    { id: "del-4", eventId: "fintech-asia", name: "Rachel Vance", email: "rachel@vancecap.com", role: "Delegate", meta: "VIP Pass", status: "Confirmed", date: "2026-05-18", avatar: "https://i.pravatar.cc/80?img=44", bio: "Managing Partner mapping infrastructure deployment pipelines and risk metrics.", org: "Vance Capital", phone: "+1 (555) 881-0033" }
  ]);

  const [speakersList, setSpeakersList] = useState([
    { id: "spk-1", eventId: "techsummit-26", name: "Ada Lovelace", email: "ada@lumen.ai", role: "Speaker", meta: "Track: Future of AI", status: "Confirmed", date: "2026-03-10", avatar: "https://i.pravatar.cc/80?img=40", bio: "Chief Scientist at Lumen AI. Author of foundational automated scheduling papers.", org: "Lumen Research", phone: "+44 20 7946 0912" },
    { id: "spk-2", eventId: "techsummit-26", name: "Maria Garcia", email: "maria@cloudscale.org", role: "Speaker", meta: "Track: Cloud Scale", status: "Confirmed", date: "2026-03-14", avatar: "https://i.pravatar.cc/80?img=41", bio: "Director of Scalability architectures. Frequent speaker on serverless edge computing.", org: "CloudScale Infra", phone: "+34 91 123 4567" },
    { id: "spk-3", eventId: "designweek-26", name: "Dr. Sarah Jenkins", email: "sjenkins@quantum.edu", role: "Speaker", meta: "Track: Parametric Assembly", status: "Confirmed", date: "2026-04-02", avatar: "https://i.pravatar.cc/80?img=42", bio: "Materials Science expert embedded in real-time structural manufacturing arrays.", org: "Quantum Polytech", phone: "+1 (555) 672-0041" },
    { id: "spk-4", eventId: "fintech-asia", name: "Kenji Takahashi", email: "kenji@fintech.jp", role: "Speaker", meta: "Track: Sovereign Ledgers", status: "Confirmed", date: "2026-04-30", avatar: "https://i.pravatar.cc/80?img=13", bio: "Central Bank digital currency advisor researching ultra-fast localized payment chains.", org: "Bank of Tokyo Lab", phone: "+81 3 3311 9901" }
  ]);

  // ── PERSISTENCE INTEGRATION ──
  React.useEffect(() => {
    const raw = localStorage.getItem("eventflow_pro_user_bookings_v1");
    if (raw) {
       const bookings = JSON.parse(raw);
       const localDelegates = bookings
         .filter((b: any) => b.role === "delegate")
         .map((b: any) => ({
           id: b.id,
           eventId: b.eventId,
           name: b.attendeeName,
           email: "delegate@corporate.com",
           role: "Delegate",
           meta: b.passTier,
           status: "Confirmed",
           date: b.timestamp.split('T')[0],
           avatar: `https://i.pravatar.cc/80?img=${Math.floor(Math.random() * 50) + 1}`,
           bio: b.companyInfo?.designation ? `Professional Designation: ${b.companyInfo.designation}` : "Corporate Delegate",
           org: b.companyInfo?.companyName || "Global Entity",
           phone: b.companyInfo?.companyContact || "+1 (555) 000-0000",
           companyInfo: b.companyInfo
         }));
       
       if (localDelegates.length > 0) {
         setDelegatesList(prev => {
            const existingIds = new Set(prev.map(d => d.id));
            const uniqueNew = localDelegates.filter((d: any) => !existingIds.has(d.id));
            return [...uniqueNew, ...prev];
         });
       }
    }
  }, []);

  // Aggregate Counters
  const totalExhibitors = exhibitorsList.length;
  const totalVisitors   = visitorsList.length;
  const totalDelegates  = delegatesList.length;
  const totalSpeakers   = speakersList.length;
  const aggregateTotal  = totalExhibitors + totalVisitors + totalDelegates + totalSpeakers;

  // Derive Current List Selection based on Active Tab
  const sourceList = useMemo(() => {
    if (activeTab === "Exhibitors") return exhibitorsList;
    if (activeTab === "Visitors") return visitorsList;
    if (activeTab === "Delegates") return delegatesList;
    return speakersList;
  }, [activeTab, exhibitorsList, visitorsList, delegatesList, speakersList]);

  // Apply Search String and Event Filters
  const filteredList = useMemo(() => {
    return sourceList.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meta.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesEvent = selectedEventId === "all" || item.eventId === selectedEventId;
      
      return matchesSearch && matchesEvent;
    });
  }, [sourceList, searchQuery, selectedEventId]);

  // Handle Stateful Item Deletions
  const handleDelete = (id: string, category: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (category === "Exhibitors") {
      setExhibitorsList(prev => prev.filter(p => p.id !== id));
    } else if (category === "Visitors") {
      setVisitorsList(prev => prev.filter(p => p.id !== id));
    } else if (category === "Delegates") {
      setDelegatesList(prev => prev.filter(p => p.id !== id));
    } else if (category === "Speakers") {
      setSpeakersList(prev => prev.filter(p => p.id !== id));
    }
    toast.success(`Participant successfully removed from the list.`);
  };

  const getEventTitle = (id: string) => {
    const matched = events.find(e => e.id === id);
    return matched ? matched.title : "Corporate Event";
  };

  // State specifically for Booth Allocation Modality overlay
  const [targetExhibitorForBooth, setTargetExhibitorForBooth] = useState<any | null>(null);
  const [customBoothNumber, setCustomBoothNumber] = useState("A-101");
  const [customBoothTier, setCustomBoothTier]     = useState("Island Premium");

  const handleExecuteBoothAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetExhibitorForBooth) return;

    const constructedMeta = `Booth #${customBoothNumber} (${customBoothTier})`;
    setExhibitorsList(prev => prev.map(item => {
      if (item.id !== targetExhibitorForBooth.id) return item;
      return { 
        ...item, 
        meta: constructedMeta, 
        status: "Confirmed" 
      };
    }));

    // If active inspected participant is the same, keep state synced
    if (selectedParticipant && selectedParticipant.id === targetExhibitorForBooth.id) {
      setSelectedParticipant((prev: any) => ({ ...prev, meta: constructedMeta, status: "Confirmed" }));
    }

    toast.success(`Assigned booth successfully for ${targetExhibitorForBooth.name}!`);
    setTargetExhibitorForBooth(null);
  };

  // ── Manual Onboarding Drawer State ──
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [onboardForm, setOnboardForm] = useState({
    name: "",
    email: "",
    org: "",
    role: "Exhibitor" as "Exhibitor" | "Visitor" | "Delegate" | "Speaker",
    eventId: "techsummit-26",
    meta: "Pending Space Allocation",
    bio: "Corporate applicant exploring infrastructure loops.",
    phone: "+1 (555) 019-3311"
  });

  const handleExecuteManualOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardForm.name || !onboardForm.email) {
      toast.error("Please supply a valid name and email address.");
      return;
    }

    const newObj = {
      id: `${onboardForm.role.toLowerCase().slice(0, 3)}-${Date.now()}`,
      eventId: onboardForm.eventId,
      name: onboardForm.name,
      email: onboardForm.email,
      role: onboardForm.role,
      meta: onboardForm.role === "Exhibitor" ? "Pending Space Allocation" : onboardForm.role === "Speaker" ? "Track: Keynote Stage" : "VIP Pass Tier",
      status: "Confirmed",
      date: new Date().toISOString().split('T')[0],
      avatar: `https://i.pravatar.cc/80?img=${Math.floor(Math.random() * 50) + 1}`,
      bio: onboardForm.bio,
      org: onboardForm.org || "Independent Entity",
      phone: onboardForm.phone
    };

    if (onboardForm.role === "Exhibitor") {
      setExhibitorsList(prev => [newObj, ...prev]);
      setActiveTab("Exhibitors");
    } else if (onboardForm.role === "Visitor") {
      setVisitorsList(prev => [newObj, ...prev]);
      setActiveTab("Visitors");
    } else if (onboardForm.role === "Delegate") {
      setDelegatesList(prev => [newObj, ...prev]);
      setActiveTab("Delegates");
    } else {
      setSpeakersList(prev => [newObj, ...prev]);
      setActiveTab("Speakers");
    }

    toast.success(`Successfully added ${onboardForm.role} "${onboardForm.name}"!`);
    setShowOnboardModal(false);
    setOnboardForm({
      name: "",
      email: "",
      org: "",
      role: "Exhibitor",
      eventId: "techsummit-26",
      meta: "Pending Space Allocation",
      bio: "Corporate applicant exploring infrastructure loops.",
      phone: "+1 (555) 019-3311"
    });
  };

  return (
    <DashboardShell 
      title="Event Participants" 
      subtitle="Manage registered attendees, view professional profiles, and allocate exhibition booths."
    >
      {/* ── CENTRAL WORKFLOW NOTICE ── */}
      <div className="p-4 rounded-xl glass border border-border/40 bg-primary/5 mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-primary shrink-0" />
          <p className="text-xs text-foreground font-medium">
            <span className="font-bold text-primary">Booth Allocation</span>: Click <span className="font-bold text-primary">'Assign Booth'</span> on any Exhibitor below to configure their booth number and size.
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background border border-border font-bold text-muted-foreground shrink-0 hidden sm:block">
          Admin Hub
        </span>
      </div>

      {/* ── STATS COUNTERS ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="p-4 rounded-xl glass border border-border/40 bg-accent/20 flex flex-col justify-between col-span-2 md:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> Total Roster
          </span>
          <div className="mt-2">
            <span className="text-2xl font-black text-foreground">{aggregateTotal}</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">Assigned Records</span>
          </div>
        </div>

        <div className="p-4 rounded-xl glass border border-border/40 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-purple-500" /> Exhibitors
          </span>
          <div className="mt-2">
            <span className="text-xl font-bold text-foreground">{totalExhibitors}</span>
            <span className="text-[9px] text-primary font-bold block mt-0.5">Client Booths</span>
          </div>
        </div>

        <div className="p-4 rounded-xl glass border border-border/40 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Ticket className="h-3.5 w-3.5 text-blue-500" /> Visitors
          </span>
          <div className="mt-2">
            <span className="text-xl font-bold text-foreground">{totalVisitors}</span>
            <span className="text-[9px] text-muted-foreground block mt-0.5">General Tier</span>
          </div>
        </div>

        <div className="p-4 rounded-xl glass border border-border/40 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-500" /> Delegates
          </span>
          <div className="mt-2">
            <span className="text-xl font-bold text-foreground">{totalDelegates}</span>
            <span className="text-[9px] text-amber-500 font-bold block mt-0.5">VIP / Pro Passes</span>
          </div>
        </div>

        <div className="p-4 rounded-xl glass border border-border/40 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Mic2 className="h-3.5 w-3.5 text-rose-500" /> Speakers
          </span>
          <div className="mt-2">
            <span className="text-xl font-bold text-foreground">{totalSpeakers}</span>
            <span className="text-[9px] text-rose-500 font-bold block mt-0.5">Confirmed Tracks</span>
          </div>
        </div>
      </div>

      {/* ── TOP FILTER & SEARCH ── */}
      <GlassCard className="p-5 mb-8 border-border/40" hover={false}>
         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
               {/* Search Box */}
               <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, company, or pass details..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-medium"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs">
                      Clear
                    </button>
                  )}
               </div>

               {/* Event Filter */}
               <div className="relative shrink-0">
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full sm:w-auto pl-3.5 pr-8 py-2.5 text-xs bg-background border border-border rounded-xl text-foreground font-medium outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                     <option value="all" className="bg-background text-foreground">🌍 All Events</option>
                     {events.map(ev => (
                       <option key={ev.id} value={ev.id} className="bg-background text-foreground">
                         📌 {ev.title} ({ev.city})
                       </option>
                     ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
               </div>

               {/* Manual Onboarding Action Trigger */}
               <GradientButton 
                 onClick={() => setShowOnboardModal(true)}
                 size="sm"
                 className="h-9 px-4 text-xs shrink-0"
               >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Participant
               </GradientButton>
            </div>

            {/* Tab Capsules */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-accent/20 rounded-xl border border-border/40 self-start lg:self-auto">
               {participantTabs.map(tab => {
                 const isActive = activeTab === tab;
                 const mapCounts: Record<string, number> = {
                   Exhibitors: exhibitorsList.length,
                   Visitors: visitorsList.length,
                   Delegates: delegatesList.length,
                   Speakers: speakersList.length
                 };
                 return (
                   <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={cn(
                       "relative px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                       isActive ? "text-foreground shadow-sm bg-background" : "text-muted-foreground hover:text-foreground"
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
         </div>
      </GlassCard>

      {/* ── LIST ROWS ── */}
      <div className="space-y-3">
         <div className="flex items-center justify-between px-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <span>Participant Details</span>
            <span>Actions</span>
         </div>

         <AnimatePresence mode="popLayout">
            {filteredList.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-12 text-center glass rounded-2xl border border-dashed border-border"
              >
                 <Users className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                 <p className="text-xs font-bold text-foreground">No participants found matching your filters.</p>
              </motion.div>
            ) : (
              filteredList.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setSelectedParticipant(item)}
                  className="p-4 rounded-xl glass border border-border/40 hover:border-primary/40 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                   <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                      <img src={item.avatar} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0 ring-1 ring-border group-hover:ring-primary/40 transition-all mt-0.5 sm:mt-0" />
                      <div className="min-w-0 flex-1">
                         <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-xs text-foreground truncate group-hover:text-primary transition-colors">{item.name}</h4>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-accent text-muted-foreground truncate max-w-[140px] hidden sm:inline-block">
                              {item.org}
                            </span>
                            <span className={cn(
                              "text-[9px] font-bold px-2 py-0.2 rounded uppercase tracking-widest shrink-0 font-mono",
                              item.status === "Checked-in" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : 
                              item.status === "Confirmed" ? "bg-primary/10 text-primary border border-primary/20" : 
                              "bg-accent text-amber-500 border border-amber-500/20"
                            )}>
                              {item.status}
                            </span>
                         </div>
                         <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                            <span className="truncate">{item.email}</span>
                            <span className="hidden md:inline-block">·</span>
                            <span className="font-medium text-foreground/80 truncate">📌 {getEventTitle(item.eventId)}</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
                      <div className="text-left sm:text-right">
                         <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">
                           Assignment
                         </span>
                         <span className={cn("text-xs font-bold font-mono", activeTab === "Exhibitors" && item.status !== "Confirmed" ? "text-amber-500" : "text-foreground")}>
                           {item.meta}
                         </span>
                      </div>

                      {/* Direct Organizer Action Triggers */}
                      <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-border/60">
                         {activeTab === "Exhibitors" && (
                           <GradientButton
                             onClick={(e) => {
                               e.stopPropagation();
                               setTargetExhibitorForBooth(item);
                               // pre-parse numbers if present
                               const match = item.meta.match(/#([A-Z0-9\-]+)/);
                               if (match) setCustomBoothNumber(match[1]);
                             }}
                             size="sm"
                             className="text-[10px] h-8 px-2.5 shrink-0"
                           >
                              Assign Booth
                           </GradientButton>
                         )}
                         <button
                           onClick={(e) => { e.stopPropagation(); setSelectedParticipant(item); }}
                           className="h-8 w-8 rounded-lg bg-background border border-border grid place-items-center text-muted-foreground hover:text-primary transition-colors"
                           title="View Profile"
                         >
                            <Eye className="h-3.5 w-3.5" />
                         </button>
                         <button
                           onClick={(e) => handleDelete(item.id, activeTab, e)}
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

      {/* ── OVERLAY: ASSIGN BOOTH DIMENSIONS MODAL ── */}
      <AnimatePresence>
        {targetExhibitorForBooth && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setTargetExhibitorForBooth(null)}
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
                    <Layout className="h-4 w-4 text-primary" /> Assign Exhibition Booth
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Configure booth assignment for <span className="font-bold text-foreground">{targetExhibitorForBooth.name}</span></p>
                </div>
                <button onClick={() => setTargetExhibitorForBooth(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleExecuteBoothAssignment} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Booth Number *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={customBoothNumber}
                    onChange={(e) => setCustomBoothNumber(e.target.value)}
                    placeholder="e.g. A-101, C-404" 
                    className="w-full px-3 py-2 text-xs bg-accent/20 border border-border rounded-xl text-foreground font-mono font-bold outline-none focus:border-primary transition-all"
                  />
                  <span className="text-[9px] text-muted-foreground block mt-1">Physical booth identifier on the exhibition floor.</span>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Booth Size & Type
                  </label>
                  <select
                    value={customBoothTier}
                    onChange={(e) => setCustomBoothTier(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-accent/20 border border-border rounded-xl text-foreground font-medium outline-none focus:border-primary transition-all"
                  >
                    <option value="Island Premium">Island Premium (30x30 ft)</option>
                    <option value="Peninsula Prime">Peninsula Prime (20x20 ft)</option>
                    <option value="Standard Floor">Standard Floor (10x10 ft)</option>
                    <option value="Corner Exposure">Corner Exposure (15x15 ft)</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-border/60">
                  <button 
                    type="button" 
                    onClick={() => setTargetExhibitorForBooth(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <GradientButton type="submit" size="sm" className="h-8 text-xs px-4">
                    Confirm Assignment
                  </GradientButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── OVERLAY: INSPECTION DETAILS MODAL ── */}
      <AnimatePresence>
         {selectedParticipant && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedParticipant(null)}
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
                       <img src={selectedParticipant.avatar} alt="" className="h-14 w-14 rounded-xl object-cover ring-2 ring-border" />
                       <div>
                          <div className="flex items-center gap-2 mb-0.5">
                             <span className="px-2 py-0.2 rounded text-[9px] font-bold uppercase tracking-widest bg-primary text-white font-mono">
                               {selectedParticipant.role}
                             </span>
                             <span className="text-[10px] font-mono text-muted-foreground">ID: {selectedParticipant.id.toUpperCase()}</span>
                          </div>
                          <h2 className="text-base font-bold text-foreground tracking-tight">{selectedParticipant.name}</h2>
                          <p className="text-xs text-muted-foreground font-medium">{selectedParticipant.org || "Global Affiliate Entity"}</p>
                       </div>
                    </div>
                    <button onClick={() => setSelectedParticipant(null)} className="text-muted-foreground hover:text-foreground">
                       <X className="h-4 w-4" />
                    </button>
                 </div>

                 <div className="p-5 overflow-y-auto space-y-4 flex-1 no-scrollbar text-xs">
                    <div className="p-4 rounded-xl bg-accent/10 border border-border/40 space-y-3">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                         Event Assignment Details
                       </span>
                       <div className="grid grid-cols-2 gap-3 font-mono">
                          <div>
                             <span className="text-[9px] text-muted-foreground block font-sans uppercase">Assigned Location</span>
                             <span className="font-bold text-foreground">{selectedParticipant.meta}</span>
                          </div>
                          <div>
                             <span className="text-[9px] text-muted-foreground block font-sans uppercase">Status</span>
                             <span className="font-bold text-primary">{selectedParticipant.status}</span>
                          </div>
                       </div>
                       
                       {selectedParticipant.role === "Exhibitor" && (
                         <div className="pt-2 border-t border-border/40 flex justify-end">
                            <GradientButton
                              onClick={() => {
                                setTargetExhibitorForBooth(selectedParticipant);
                                const match = selectedParticipant.meta.match(/#([A-Z0-9\-]+)/);
                                if (match) setCustomBoothNumber(match[1]);
                              }}
                              size="sm"
                              className="text-[10px] h-7 px-3"
                            >
                               Update Booth Assignment
                            </GradientButton>
                         </div>
                       )}
                    </div>

                     {selectedParticipant.companyInfo && (
                        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-3 mt-4">
                           <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
                             Corporate Credentials
                           </span>
                           <div className="grid grid-cols-2 gap-3 font-mono">
                              <div>
                                 <span className="text-[9px] text-muted-foreground block font-sans uppercase">Designation</span>
                                 <span className="font-bold text-foreground truncate block">{selectedParticipant.companyInfo.designation}</span>
                              </div>
                              <div>
                                 <span className="text-[9px] text-muted-foreground block font-sans uppercase">Company Contact</span>
                                 <span className="font-bold text-foreground truncate block">{selectedParticipant.companyInfo.companyContact}</span>
                              </div>
                           </div>
                        </div>
                     )}

                     <div className="space-y-2">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                         Biography / Bio
                       </span>
                       <p className="text-muted-foreground bg-accent/5 p-3 rounded-xl border border-border/40 leading-relaxed font-sans">
                          "{selectedParticipant.bio || 'Experienced event participant and designated delegate.'}"
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                       <div className="p-2.5 rounded-xl bg-background border border-border flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                          <div className="min-w-0">
                             <span className="text-[9px] text-muted-foreground block font-bold">Email Address</span>
                             <span className="text-[11px] font-medium text-foreground truncate block">{selectedParticipant.email}</span>
                          </div>
                       </div>
                       <div className="p-2.5 rounded-xl bg-background border border-border flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <div className="min-w-0">
                             <span className="text-[9px] text-muted-foreground block font-bold">Phone Number</span>
                             <span className="text-[11px] font-medium text-foreground truncate block">{selectedParticipant.phone || "+1 (555) 019-8822"}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="p-4 border-t border-border bg-accent/20 flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground flex items-center gap-1">
                       <ShieldCheck className="h-3 w-3 text-emerald-500" /> Verified Participant Profile
                    </span>
                    <button
                      onClick={() => setSelectedParticipant(null)}
                      className="px-3 py-1 rounded-lg bg-background text-foreground font-bold hover:bg-accent border border-border"
                    >
                       Close
                    </button>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>

      {/* ── HIGH-FIDELITY OVERLAY: MANUAL PROFILE ONBOARDING DRAWER ── */}
      <AnimatePresence>
        {showOnboardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowOnboardModal(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 22, stiffness: 320 }}
              className="relative w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[88vh]"
            >
               <div className="flex items-center justify-between px-6 py-4 bg-accent/20 border-b border-border">
                  <div>
                     <span className="text-[9px] font-bold font-mono text-primary uppercase tracking-widest block">
                        Add Participant
                     </span>
                     <h2 className="text-sm font-bold text-foreground">
                        Add New Participant
                     </h2>
                  </div>
                  <button onClick={() => setShowOnboardModal(false)} className="text-muted-foreground hover:text-foreground">
                     <X className="h-4 w-4" />
                  </button>
               </div>

               <form onSubmit={handleExecuteManualOnboard} className="p-6 space-y-4 overflow-y-auto no-scrollbar flex-1 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                     <div>
                        <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                           Role *
                        </label>
                        <select
                          value={onboardForm.role}
                          onChange={(e: any) => setOnboardForm(f => ({ ...f, role: e.target.value }))}
                          className="w-full p-2 bg-accent/20 border border-border rounded-xl font-bold text-foreground outline-none focus:border-primary transition-all"
                        >
                           <option value="Exhibitor">Exhibitor Brand</option>
                           <option value="Visitor">Visitor (General)</option>
                           <option value="Delegate">Delegate (VIP/Pro)</option>
                           <option value="Speaker">Speaker Track</option>
                        </select>
                     </div>

                     <div>
                        <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                           Event *
                        </label>
                        <select
                          value={onboardForm.eventId}
                          onChange={(e) => setOnboardForm(f => ({ ...f, eventId: e.target.value }))}
                          className="w-full p-2 bg-accent/20 border border-border rounded-xl font-bold text-foreground outline-none focus:border-primary transition-all"
                        >
                           {events.map(ev => (
                              <option key={ev.id} value={ev.id}>
                                 📌 {ev.title} ({ev.city})
                              </option>
                           ))}
                        </select>
                     </div>
                  </div>

                  <div>
                     <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Full Name *
                     </label>
                     <input
                       required
                       type="text"
                       value={onboardForm.name}
                       onChange={e => setOnboardForm(f => ({ ...f, name: e.target.value }))}
                       placeholder="e.g. Apex Continental Logistics"
                       className="w-full p-2 bg-background border border-border rounded-xl font-medium text-foreground outline-none focus:border-primary transition-all"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div>
                        <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                           Email Address *
                        </label>
                        <input
                          required
                          type="email"
                          value={onboardForm.email}
                          onChange={e => setOnboardForm(f => ({ ...f, email: e.target.value }))}
                          placeholder="contact@apex.io"
                          className="w-full p-2 bg-background border border-border rounded-xl font-medium text-foreground outline-none focus:border-primary transition-all text-xs"
                        />
                     </div>

                     <div>
                        <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                           Company / Organization
                        </label>
                        <input
                          type="text"
                          value={onboardForm.org}
                          onChange={e => setOnboardForm(f => ({ ...f, org: e.target.value }))}
                          placeholder="e.g. Apex Global Corp"
                          className="w-full p-2 bg-background border border-border rounded-xl font-medium text-foreground outline-none focus:border-primary transition-all text-xs"
                        />
                     </div>
                  </div>

                  <div>
                     <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Biography
                     </label>
                     <textarea
                       rows={2}
                       value={onboardForm.bio}
                       onChange={e => setOnboardForm(f => ({ ...f, bio: e.target.value }))}
                       placeholder="Professional bio or notes about this participant..."
                       className="w-full p-2 bg-background border border-border rounded-xl font-medium text-foreground outline-none focus:border-primary transition-all text-xs"
                     />
                  </div>

                  <div className="pt-3 border-t border-border flex justify-end gap-2">
                     <button
                       type="button"
                       onClick={() => setShowOnboardModal(false)}
                       className="px-3 py-1.5 rounded-lg font-bold text-muted-foreground hover:text-foreground text-xs transition-colors"
                     >
                        Cancel
                     </button>
                     <GradientButton type="submit" size="sm" className="h-8 text-xs px-4">
                        Add Participant
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
