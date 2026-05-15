"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, ArrowRight, ArrowLeft, Calendar, 
  MapPin, Ticket, DollarSign, Image as ImageIcon, 
  Settings, Users, ShieldCheck, Zap, Mic2, Layers,
  Hotel, Plane, Truck, Plus, Trash2, Box, Sparkles, 
  Building2, Mail, Phone, CheckCircle2, X, Search
} from "lucide-react";
import { useRouter } from "next/navigation";
import { events } from "@/data/mock";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Expanded explicit steps supporting highly visual mapping of Stalls & Partners
const steps = ["Basics", "Ticketing Tiers", "Stalls Info", "Assign Partners", "Permissions", "Media"];

type RoleKey = "vendor" | "hotel-agent" | "travel-agent";

const PARTNER_ROLES_META: { key: RoleKey; label: string; icon: React.ElementType; color: string; bg: string; border: string }[] = [
  { key: "hotel-agent",   label: "Hotel Partner",   icon: Hotel,  color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/30" },
  { key: "travel-agent",  label: "Travel Partner",  icon: Plane,  color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  { key: "vendor",        label: "Vendor",          icon: Truck,  color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/30" },
];

const getRoleMeta = (key: RoleKey) => PARTNER_ROLES_META.find(r => r.key === key) ?? PARTNER_ROLES_META[0];

export default function NewEventWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  
  // State extension containing explicit pricing metrics mapping, Stalls footprints, and Partner connections
  const [formData, setFormData] = useState({
    title: "", date: "", venue: "", city: "",
    currency: "INR", commission: "10",
    dynamicPricing: true,
    isMultiDay: false,
    endDate: "",
    schedule: [
      {
        day: 1,
        title: "Day 1 Agenda",
        tracks: [
          { id: "tr-1", time: "09:00 AM", title: "Registration & Welcome", speaker: "Organizing Committee" },
          { id: "tr-2", time: "10:30 AM", title: "Opening Keynote", speaker: "Guest Speaker" }
        ]
      }
    ],
    pricingTiers: {
      general: { price: "150", slots: "500" },
      pro: { price: "450", slots: "200" },
      vip: { price: "899", slots: "50" }
    },
    // Options to create stalls info like four facing island or any and price accordingly
    stallsInfo: [
      { id: "st-1", type: "Four Facing Island", size: "30x30 ft", price: "6000", slots: "4", active: true, desc: "Premium central placement with absolute 360-degree visibility & quad open parameters." },
      { id: "st-2", type: "Peninsula Prime", size: "20x20 ft", price: "4500", slots: "8", active: true, desc: "High-traffic junction priority access featuring three exposed operational boundaries." },
      { id: "st-3", type: "Standard Inline Booth", size: "10x10 ft", price: "2500", slots: "20", active: true, desc: "Classic row display framework with included high-contrast backwall grid drops." }
    ],
    // Option to assign partner while creating event itself matching users & partner section
    assignedPartners: [
      { id: "u1", name: "Marcus Vance", email: "marcus@grandmarquise.com", company: "Grand Marquise Hotels", roles: ["hotel-agent"] as RoleKey[], selected: true },
      { id: "u2", name: "Sarah Jenkins", email: "sarah@skytravel.io", company: "SkyTravel Logistics", roles: ["travel-agent", "vendor"] as RoleKey[], selected: true },
      { id: "u3", name: "Hans Gruber", email: "hans@peakvisuals.de", company: "Peak Visual Rigging", roles: ["vendor"] as RoleKey[], selected: true },
      { id: "u4", name: "Elena Rostova", email: "elena@globalstay.sg", company: "Global Stay Hotels", roles: ["hotel-agent", "travel-agent"] as RoleKey[], selected: false },
    ],
    roles: {
      visitor: true,
      exhibitor: true,
      delegate: true,
      speaker: true,
    }
  });

  // Custom inline form fields for dynamic state additions
  const [newStallType, setNewStallType]   = useState("");
  const [newStallSize, setNewStallSize]   = useState("");
  const [newStallPrice, setNewStallPrice] = useState("");
  const [newStallSlots, setNewStallSlots] = useState("");

  const [newPartnerName, setNewPartnerName]       = useState("");
  const [newPartnerEmail, setNewPartnerEmail]     = useState("");
  const [newPartnerCompany, setNewPartnerCompany] = useState("");
  const [newPartnerRole, setNewPartnerRole]       = useState<RoleKey>("vendor");

  // Success dispatch verification dialog overlay
  const [showSuccessSummary, setShowSuccessSummary] = useState(false);
  const [dispatchedPartners, setDispatchedPartners] = useState<any[]>([]);
  const [publishedEventId, setPublishedEventId] = useState("");
  const router = useRouter();

  const [partnerSearchQuery, setPartnerSearchQuery] = useState("");
  const [partnerRoleFilter, setPartnerRoleFilter] = useState<"all" | RoleKey>("all");
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);

  const nextStep = () => setCurrentStep(s => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 0));

  const updateTierField = (key: "general" | "pro" | "vip", field: "price" | "slots", val: string) => {
    setFormData(prev => ({
      ...prev,
      pricingTiers: {
        ...prev.pricingTiers,
        [key]: { ...prev.pricingTiers[key], [field]: val }
      }
    }));
  };

  // Stall pricing update triggers
  const updateStallField = (id: string, field: "price" | "slots", val: string) => {
    setFormData(prev => ({
      ...prev,
      stallsInfo: prev.stallsInfo.map(s => s.id === id ? { ...s, [field]: val } : s)
    }));
  };

  const toggleStallActive = (id: string) => {
    setFormData(prev => ({
      ...prev,
      stallsInfo: prev.stallsInfo.map(s => s.id === id ? { ...s, active: !s.active } : s)
    }));
    toast.info("Stall configuration status toggled.");
  };

  const toggleRole = (roleKey: keyof typeof formData.roles) => {
    setFormData(prev => ({
      ...prev,
      roles: {
        ...prev.roles,
        [roleKey]: !prev.roles[roleKey]
      }
    }));
  };

  const handleAddCustomStall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStallType.trim()) return;
    const newStallObj = {
      id: `st-custom-${Date.now()}`,
      type: newStallType,
      size: newStallSize.trim() || "15x15 ft",
      price: newStallPrice.trim() || "3200",
      slots: newStallSlots.trim() || "5",
      active: true,
      desc: "Custom operational layout footprint established during startup initialization."
    };
    setFormData(prev => ({
      ...prev,
      stallsInfo: [...prev.stallsInfo, newStallObj]
    }));
    setNewStallType("");
    setNewStallSize("");
    setNewStallPrice("");
    setNewStallSlots("");
    toast.success("Custom exposition stall configured successfully!");
  };

  // Multi-day schedule management controllers
  const addNewDayToSchedule = () => {
    setFormData(prev => {
      const nextDayNum = prev.schedule.length + 1;
      return {
        ...prev,
        schedule: [
          ...prev.schedule,
          {
            day: nextDayNum,
            title: `Day ${nextDayNum} Agenda`,
            tracks: [
              { id: `tr-${Date.now()}-1`, time: "09:00 AM", title: "Morning Welcome & Briefing", speaker: "Host Committee" }
            ]
          }
        ]
      };
    });
    toast.success("Added new day to event schedule!");
  };

  const updateDayTitle = (dayIndex: number, newTitle: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.map((sch, idx) => idx === dayIndex ? { ...sch, title: newTitle } : sch)
    }));
  };

  const addTrackToDay = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.map((sch, idx) => {
        if (idx !== dayIndex) return sch;
        return {
          ...sch,
          tracks: [
            ...sch.tracks,
            { id: `tr-${Date.now()}-${Math.random()}`, time: "12:00 PM", title: "New Session Track", speaker: "Speaker Name" }
          ]
        };
      })
    }));
  };

  const updateTrackField = (dayIndex: number, trackId: string, field: "time" | "title" | "speaker", val: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.map((sch, idx) => {
        if (idx !== dayIndex) return sch;
        return {
          ...sch,
          tracks: sch.tracks.map(tr => tr.id === trackId ? { ...tr, [field]: val } : tr)
        };
      })
    }));
  };

  const deleteTrackFromDay = (dayIndex: number, trackId: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.map((sch, idx) => {
        if (idx !== dayIndex) return sch;
        return {
          ...sch,
          tracks: sch.tracks.filter(tr => tr.id !== trackId)
        };
      })
    }));
  };

  const removeDayFromSchedule = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, idx) => idx !== dayIndex).map((sch, i) => ({
        ...sch,
        day: i + 1,
        title: sch.title.startsWith("Day ") ? `Day ${i + 1} Agenda` : sch.title
      }))
    }));
    toast.info("Removed day from schedule.");
  };

  // Partner assignment controllers
  const togglePartnerSelect = (id: string) => {
    setFormData(prev => ({
      ...prev,
      assignedPartners: prev.assignedPartners.map(p => p.id === id ? { ...p, selected: !p.selected } : p)
    }));
  };

  const handleAddCustomPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName.trim() || !newPartnerEmail.trim()) return;
    const newPartnerObj = {
      id: `p-custom-${Date.now()}`,
      name: newPartnerName,
      email: newPartnerEmail,
      company: newPartnerCompany.trim() || "Independent Vendor Ops",
      roles: [newPartnerRole],
      selected: true
    };
    setFormData(prev => ({
      ...prev,
      assignedPartners: [newPartnerObj, ...prev.assignedPartners]
    }));
    setNewPartnerName("");
    setNewPartnerEmail("");
    setNewPartnerCompany("");
    setShowAddPartnerModal(false);
    toast.success(`Partner identity mapped & designated to active scoping ledger!`);
  };

  // Final confirmation action: computing auto invitations
  const handlePublishSequence = () => {
    const invitedList = formData.assignedPartners.filter(partner => partner.selected);
    const newId = (formData.title || "New Event").toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);
    
    events.unshift({
      id: newId,
      title: formData.title || "Untitled Event",
      tagline: "Custom configured event payload.",
      category: "Technology",
      date: formData.date ? formData.date.split("T")[0] : "2026-01-01",
      endDate: formData.endDate ? formData.endDate.split("T")[0] : "2026-01-02",
      city: formData.city || "San Francisco",
      country: "USA",
      venue: formData.venue || "TBD",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=70",
      attendees: 0,
      exhibitors: formData.stallsInfo.filter(s => s.active).length,
      rating: 0,
      priceFrom: parseInt(formData.pricingTiers.general.price) || 0,
      featured: true,
      tags: ["New"]
    });

    setPublishedEventId(newId);
    setDispatchedPartners(invitedList);
    setShowSuccessSummary(true);
    toast.success("Event published successfully!");
  };

  const handleFinalRedirect = () => {
    router.push("/organizer/events");
  };

  return (
    <DashboardShell 
      title="Create New Event" 
      subtitle="Set up event details, configure ticket pricing, manage exhibition stalls, and assign trusted partners."
    >
      <div className="max-w-4xl mx-auto">
        {/* Progress Navigation Tracker */}
        <div className="flex items-center justify-between mb-12 relative px-2">
           <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border/60 -translate-y-1/2 z-0" />
           <div 
             className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
             style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} 
           />
           
           {steps.map((label, idx) => (
             <div key={label} className="relative z-10 flex flex-col items-center gap-2">
                <div className={cn(
                  "h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 bg-background font-mono",
                  idx <= currentStep ? "border-primary text-primary shadow-glow-sm font-bold" : "border-border text-muted-foreground"
                )}>
                   {idx < currentStep ? <Check className="h-4 w-4 stroke-[3]" /> : <span className="text-xs">{idx + 1}</span>}
                </div>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider font-mono hidden sm:block text-center",
                  idx <= currentStep ? "text-primary" : "text-muted-foreground"
                )}>
                  {label}
                </span>
             </div>
           ))}
        </div>

        <GlassCard className="p-6 md:p-10 border-border/40" hover={false}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* STEP 0: BASICS */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="border-b border-border/40 pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Event Details
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field 
                      label="Event Title *" 
                      value={formData.title} 
                      onChange={(e: any) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Future Tech Expo 2026" 
                    />
                    <Field 
                      label="Category" 
                      placeholder="Technology, Design, Healthcare..." 
                    />
                    <Field 
                      label="Start Date & Time" 
                      type="datetime-local" 
                      value={formData.date}
                      onChange={(e: any) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                    {formData.isMultiDay ? (
                      <Field 
                        label="End Date & Time" 
                        type="datetime-local" 
                        value={formData.endDate}
                        onChange={(e: any) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    ) : (
                      <div className="flex flex-col justify-center pt-4">
                        <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer select-none w-fit">
                          <input 
                            type="checkbox" 
                            checked={formData.isMultiDay}
                            onChange={(e) => setFormData(prev => ({ ...prev, isMultiDay: e.target.checked }))}
                            className="rounded border-border accent-primary h-4 w-4"
                          />
                          <span>Multi-Day Event Schedule</span>
                        </label>
                        <span className="text-[10px] text-muted-foreground block mt-0.5 ml-6">
                          Enable to add an end date and manage schedules per day.
                        </span>
                      </div>
                    )}
                    <Field 
                      label="Venue Name" 
                      value={formData.venue}
                      onChange={(e: any) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                      placeholder="e.g. Moscone Center" 
                    />
                    <Field 
                      label="City" 
                      value={formData.city}
                      onChange={(e: any) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="e.g. San Francisco" 
                    />
                  </div>

                  {formData.isMultiDay && (
                    <div className="pt-2 border-t border-border/40">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <div>
                          <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer select-none w-fit">
                            <input 
                              type="checkbox" 
                              checked={formData.isMultiDay}
                              onChange={(e) => setFormData(prev => ({ ...prev, isMultiDay: e.target.checked }))}
                              className="rounded border-border accent-primary h-4 w-4"
                            />
                            <span className="text-primary font-bold">Multi-Day Schedule Builder</span>
                          </label>
                          <p className="text-[10px] text-muted-foreground mt-0.5 ml-6">
                            Write custom daily schedules and presentation tracks for your event.
                          </p>
                        </div>
                        <GradientButton 
                          type="button" 
                          onClick={addNewDayToSchedule} 
                          size="sm" 
                          className="text-xs h-8 px-3 shrink-0 self-start sm:self-auto"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" /> Add Day
                        </GradientButton>
                      </div>

                      <div className="space-y-4">
                        {formData.schedule.map((dayObj, dIdx) => (
                          <div key={dayObj.day} className="p-4 rounded-xl bg-accent/5 border border-border space-y-3">
                            <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/40">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="px-2 py-0.5 rounded bg-primary text-white font-mono font-bold text-[10px] shrink-0">
                                  Day {dayObj.day}
                                </span>
                                <input 
                                  type="text"
                                  value={dayObj.title}
                                  onChange={(e) => updateDayTitle(dIdx, e.target.value)}
                                  placeholder="Day Agenda Title"
                                  className="bg-transparent border-none text-xs font-bold text-foreground outline-none focus:underline flex-1 min-w-0"
                                />
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => addTrackToDay(dIdx)}
                                  className="px-2 py-1 rounded bg-background border border-border text-[10px] font-bold text-foreground hover:border-primary transition-all flex items-center gap-1"
                                >
                                  <Plus className="h-3 w-3 text-primary" /> Add Track
                                </button>
                                {formData.schedule.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeDayFromSchedule(dIdx)}
                                    className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                    title="Delete Day"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Tracks loop */}
                            <div className="space-y-2 pt-1">
                              {dayObj.tracks.map(tr => (
                                <div key={tr.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-2 rounded-lg bg-background border border-border items-center text-xs">
                                  <div className="sm:col-span-3">
                                    <input 
                                      type="text"
                                      value={tr.time}
                                      onChange={(e) => updateTrackField(dIdx, tr.id, "time", e.target.value)}
                                      placeholder="Time (e.g. 09:00 AM)"
                                      className="w-full bg-transparent border-none text-xs font-mono font-bold outline-none text-muted-foreground focus:text-foreground"
                                    />
                                  </div>
                                  <div className="sm:col-span-5">
                                    <input 
                                      type="text"
                                      value={tr.title}
                                      onChange={(e) => updateTrackField(dIdx, tr.id, "title", e.target.value)}
                                      placeholder="Session Title"
                                      className="w-full bg-transparent border-none text-xs font-bold text-foreground outline-none"
                                    />
                                  </div>
                                  <div className="sm:col-span-3">
                                    <input 
                                      type="text"
                                      value={tr.speaker}
                                      onChange={(e) => updateTrackField(dIdx, tr.id, "speaker", e.target.value)}
                                      placeholder="Speaker / Info"
                                      className="w-full bg-transparent border-none text-[11px] text-muted-foreground outline-none"
                                    />
                                  </div>
                                  <div className="sm:col-span-1 text-right">
                                    <button
                                      type="button"
                                      onClick={() => deleteTrackFromDay(dIdx, tr.id)}
                                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                                      title="Remove Track"
                                    >
                                      <X className="h-3.5 w-3.5 inline" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 1: EXPLICIT TIER PRICING CONFIGURATION */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-border/40 pb-3">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider block flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-primary" /> Ticket Pricing
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Configure ticket pricing tiers for your event attendees.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Tier A: General Attendee */}
                    <div className="p-4 rounded-xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent text-foreground font-mono uppercase tracking-wider block w-fit mb-1">
                          Standard Access
                        </span>
                        <h4 className="text-xs font-bold text-foreground">General Attendee Pass</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Basic event entry and standard seating.</p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                        <div className="relative w-full sm:w-28">
                          <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <input 
                            type="number" 
                            value={formData.pricingTiers.general.price}
                            onChange={(e) => updateTierField("general", "price", e.target.value)}
                            placeholder="Price"
                            className="w-full pl-7 pr-2 py-2 text-xs bg-accent/10 border border-border rounded-xl text-foreground font-mono font-bold outline-none focus:border-primary transition-all"
                          />
                          <span className="absolute -top-2 left-2 text-[8px] px-1 bg-background text-muted-foreground font-mono">Price</span>
                        </div>
                        <div className="relative w-full sm:w-24">
                          <input 
                            type="number" 
                            value={formData.pricingTiers.general.slots}
                            onChange={(e) => updateTierField("general", "slots", e.target.value)}
                            placeholder="Slots"
                            className="w-full px-2.5 py-2 text-xs bg-accent/10 border border-border rounded-xl text-foreground font-mono font-bold outline-none focus:border-primary transition-all text-center"
                          />
                          <span className="absolute -top-2 left-2 text-[8px] px-1 bg-background text-muted-foreground font-mono">Slots</span>
                        </div>
                      </div>
                    </div>

                    {/* Tier B: Pro Access Delegate */}
                    <div className="p-4 rounded-xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-mono uppercase tracking-wider block w-fit mb-1">
                          Popular Upgrade
                        </span>
                        <h4 className="text-xs font-bold text-foreground">Pro Pass</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Priority entry and access to networking sessions.</p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                        <div className="relative w-full sm:w-28">
                          <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <input 
                            type="number" 
                            value={formData.pricingTiers.pro.price}
                            onChange={(e) => updateTierField("pro", "price", e.target.value)}
                            placeholder="Price"
                            className="w-full pl-7 pr-2 py-2 text-xs bg-accent/10 border border-border rounded-xl text-foreground font-mono font-bold outline-none focus:border-primary transition-all"
                          />
                          <span className="absolute -top-2 left-2 text-[8px] px-1 bg-background text-muted-foreground font-mono">Price</span>
                        </div>
                        <div className="relative w-full sm:w-24">
                          <input 
                            type="number" 
                            value={formData.pricingTiers.pro.slots}
                            onChange={(e) => updateTierField("pro", "slots", e.target.value)}
                            placeholder="Slots"
                            className="w-full px-2.5 py-2 text-xs bg-accent/10 border border-border rounded-xl text-foreground font-mono font-bold outline-none focus:border-primary transition-all text-center"
                          />
                          <span className="absolute -top-2 left-2 text-[8px] px-1 bg-background text-muted-foreground font-mono">Slots</span>
                        </div>
                      </div>
                    </div>

                    {/* Tier C: VIP Executive Track */}
                    <div className="p-4 rounded-xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 border border-purple-500/20 font-mono uppercase tracking-wider block w-fit mb-1">
                          All-Inclusive Pass
                        </span>
                        <h4 className="text-xs font-bold text-foreground">VIP Pass</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Full access including backstage, speaker meetups, and VIP lounge.</p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                        <div className="relative w-full sm:w-28">
                          <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <input 
                            type="number" 
                            value={formData.pricingTiers.vip.price}
                            onChange={(e) => updateTierField("vip", "price", e.target.value)}
                            placeholder="Price"
                            className="w-full pl-7 pr-2 py-2 text-xs bg-accent/10 border border-border rounded-xl text-foreground font-mono font-bold outline-none focus:border-primary transition-all"
                          />
                          <span className="absolute -top-2 left-2 text-[8px] px-1 bg-background text-muted-foreground font-mono">Price</span>
                        </div>
                        <div className="relative w-full sm:w-24">
                          <input 
                            type="number" 
                            value={formData.pricingTiers.vip.slots}
                            onChange={(e) => updateTierField("vip", "slots", e.target.value)}
                            placeholder="Slots"
                            className="w-full px-2.5 py-2 text-xs bg-accent/10 border border-border rounded-xl text-foreground font-mono font-bold outline-none focus:border-primary transition-all text-center"
                          />
                          <span className="absolute -top-2 left-2 text-[8px] px-1 bg-background text-muted-foreground font-mono">Slots</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Supplementary settings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <Field 
                      label="Partner Commission (%)" 
                      type="number" 
                      value={formData.commission}
                      onChange={(e: any) => setFormData(prev => ({ ...prev, commission: e.target.value }))}
                      placeholder="10" 
                      icon={ShieldCheck} 
                    />
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Currency</label>
                      <select 
                        value={formData.currency} 
                        onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                        className="w-full py-2.5 px-3 bg-background border border-border rounded-xl text-xs font-bold font-mono outline-none focus:border-primary"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-accent/10 border border-border/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Zap className="h-4 w-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-foreground">Dynamic Pricing</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Automatically adjust ticket prices based on remaining availability.</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded shrink-0 font-mono">
                      Active
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 2: STALLS INFO CONFIGURATION */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-border/40 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider block flex items-center gap-2">
                        <Box className="h-4 w-4 text-primary" /> Exhibition Stalls
                      </span>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Configure booth types, dimensions, and pricing for exhibitors.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono font-bold self-start sm:self-auto">
                      Dynamic Booth Pricing
                    </span>
                  </div>

                  <div className="space-y-3">
                    {formData.stallsInfo.map(stall => (
                      <div 
                        key={stall.id} 
                        className={cn(
                          "p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden",
                          stall.active ? "bg-background border-border hover:border-primary/40" : "bg-background/40 border-border/40 opacity-60"
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-black text-foreground tracking-tight">{stall.type}</span>
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-accent text-foreground">
                              {stall.size}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{stall.desc}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto pt-2 sm:pt-0">
                          <div className="relative w-24">
                            <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <input 
                              type="number"
                              disabled={!stall.active}
                              value={stall.price}
                              onChange={(e) => updateStallField(stall.id, "price", e.target.value)}
                              placeholder="Price"
                              className="w-full pl-6 pr-1 py-1.5 text-xs bg-accent/10 border border-border rounded-lg text-foreground font-mono font-bold outline-none focus:border-primary transition-all disabled:opacity-50"
                            />
                            <span className="absolute -top-2 left-2 text-[8px] px-1 bg-background text-muted-foreground font-mono">Price</span>
                          </div>

                          <div className="relative w-20">
                            <input 
                              type="number"
                              disabled={!stall.active}
                              value={stall.slots || ""}
                              onChange={(e) => updateStallField(stall.id, "slots", e.target.value)}
                              placeholder="Slots"
                              className="w-full px-2 py-1.5 text-xs bg-accent/10 border border-border rounded-lg text-foreground font-mono font-bold outline-none focus:border-primary transition-all text-center disabled:opacity-50"
                            />
                            <span className="absolute -top-2 left-2 text-[8px] px-1 bg-background text-muted-foreground font-mono">Slots</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleStallActive(stall.id)}
                            className={cn(
                              "px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider font-mono border transition-all shrink-0 ml-1",
                              stall.active ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-accent text-muted-foreground border-border"
                            )}
                          >
                            {stall.active ? "Enabled" : "Disabled"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Inline creation widget for custom stall types */}
                  <form onSubmit={handleAddCustomStall} className="p-4 rounded-xl glass border border-border/60 space-y-3 bg-accent/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-primary" /> Add Custom Booth Type
                    </span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      <input 
                        type="text" 
                        value={newStallType}
                        onChange={(e) => setNewStallType(e.target.value)}
                        placeholder="Type (e.g. Center Octagon)" 
                        className="px-3 py-2 text-xs bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-medium"
                      />
                      <input 
                        type="text" 
                        value={newStallSize}
                        onChange={(e) => setNewStallSize(e.target.value)}
                        placeholder="Dimensions (e.g. 40x40 ft)" 
                        className="px-3 py-2 text-xs bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-medium"
                      />
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <input 
                          type="number" 
                          value={newStallPrice}
                          onChange={(e) => setNewStallPrice(e.target.value)}
                          placeholder="Price" 
                          className="w-full pl-7 pr-2 py-2 text-xs bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-mono font-bold"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={newStallSlots}
                          onChange={(e) => setNewStallSlots(e.target.value)}
                          placeholder="Slots count" 
                          className="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-mono font-bold text-center"
                        />
                        <GradientButton type="submit" size="sm" className="h-9 px-3 shrink-0 shadow-sm text-xs">
                          <Plus className="h-4 w-4" />
                        </GradientButton>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 3: ASSIGN PARTNERS INLINE */}
              {currentStep === 3 && (() => {
                const filteredPartners = formData.assignedPartners.filter(p => {
                  const matchesSearch = p.name.toLowerCase().includes(partnerSearchQuery.toLowerCase()) || 
                                        p.email.toLowerCase().includes(partnerSearchQuery.toLowerCase()) || 
                                        p.company.toLowerCase().includes(partnerSearchQuery.toLowerCase());
                  const matchesRole = partnerRoleFilter === "all" || p.roles.includes(partnerRoleFilter as RoleKey);
                  return matchesSearch && matchesRole;
                });

                return (
                <div className="space-y-6">
                  <div className="border-b border-border/40 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider block flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" /> Assign Partners
                      </span>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        Select external partners (vendors, travel, and hotel providers) for this event. 
                        Invitations will be sent automatically when published.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="text"
                        value={partnerSearchQuery}
                        onChange={(e) => setPartnerSearchQuery(e.target.value)}
                        placeholder="Search partners..."
                        className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-medium"
                      />
                    </div>
                    <select
                      value={partnerRoleFilter}
                      onChange={(e) => setPartnerRoleFilter(e.target.value as "all" | RoleKey)}
                      className="px-3 py-2 text-xs bg-background border border-border rounded-xl text-foreground font-medium outline-none focus:border-primary transition-all cursor-pointer"
                    >
                      <option value="all">All Categories</option>
                      <option value="vendor">Vendor</option>
                      <option value="hotel-agent">Hotel Partner</option>
                      <option value="travel-agent">Travel Partner</option>
                    </select>
                    <GradientButton 
                      onClick={() => setShowAddPartnerModal(true)} 
                      type="button" 
                      size="sm" 
                      className="h-9 px-4 shrink-0 text-xs flex items-center gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" /> Create New Partner
                    </GradientButton>
                  </div>

                  {/* Scroller array containing state assignments */}
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                    {filteredPartners.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center text-muted-foreground bg-accent/5 py-8">
                        <Building2 className="h-6 w-6 mb-2 opacity-50" />
                        <p className="text-xs font-bold text-foreground">No partners found</p>
                        <p className="text-[10px] mt-1">Adjust your search or filter.</p>
                      </div>
                    ) : filteredPartners.map(partner => (
                      <div 
                        key={partner.id} 
                        onClick={() => togglePartnerSelect(partner.id)}
                        className={cn(
                          "p-3 rounded-xl glass border flex items-center justify-between gap-3 cursor-pointer transition-all group",
                          partner.selected ? "border-primary bg-primary/[0.03]" : "border-border/40 hover:border-border/80 bg-background/50"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={cn(
                            "h-4 w-4 rounded-md border flex items-center justify-center shrink-0 transition-colors",
                            partner.selected ? "bg-primary border-primary text-background shadow-glow-xs" : "border-border/60 bg-background"
                          )}>
                            {partner.selected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                          </div>

                          <div className="h-8 w-8 rounded-lg gradient-bg text-white font-black text-xs grid place-items-center shrink-0">
                            {partner.name.charAt(0)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className={cn("text-xs font-bold truncate", partner.selected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                                {partner.name}
                              </p>
                              <span className="text-[10px] text-muted-foreground truncate hidden sm:inline">· {partner.company}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground truncate">{partner.email}</p>
                          </div>
                        </div>

                        {/* Rendering mapped multi-select role tags */}
                        <div className="flex items-center gap-1 shrink-0">
                          {partner.roles.map(rk => {
                            const rMeta = getRoleMeta(rk);
                            return (
                              <span 
                                key={rk}
                                className={cn(
                                  "flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold border font-mono",
                                  rMeta.bg, rMeta.color, rMeta.border
                                )}
                              >
                                <rMeta.icon className="h-2.5 w-2.5 shrink-0" />
                                <span className="hidden sm:inline">{rMeta.label}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                );
              })()}

              {/* STEP 4: PERMISSIONS */}
              {currentStep === 4 && (
                <div className="space-y-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block border-b border-border/40 pb-2">
                    Attendee Role Authorizations
                  </span>
                  <div className="grid gap-3 md:grid-cols-2">
                    <ToggleCard 
                      icon={Users} label="Visitor Turnstile Access" desc="General ticket purchasers" 
                      active={formData.roles.visitor} 
                      onClick={() => toggleRole("visitor")} 
                    />
                    <ToggleCard 
                      icon={Layers} label="Exhibitor Portal Mapping" desc="Allows assigning hall footprint booths" 
                      active={formData.roles.exhibitor} 
                      onClick={() => toggleRole("exhibitor")} 
                    />
                    <ToggleCard 
                      icon={Ticket} label="Delegate Fast-Track" desc="VIP access control matrix" 
                      active={formData.roles.delegate} 
                      onClick={() => toggleRole("delegate")} 
                    />
                    <ToggleCard 
                      icon={Mic2} label="Speaker Track Submission" desc="Call for papers entry pipeline" 
                      active={formData.roles.speaker} 
                      onClick={() => toggleRole("speaker")} 
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: MEDIA */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="h-56 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center gap-3 bg-accent/5 hover:bg-accent/10 transition-colors cursor-pointer group">
                     <div className="h-12 w-12 rounded-xl glass grid place-items-center text-muted-foreground group-hover:text-primary transition-colors">
                        <ImageIcon className="h-5 w-5" />
                     </div>
                     <div className="text-center">
                        <p className="text-xs font-bold text-foreground">Upload Exposition Artwork Vector</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">Recommended: 1920x1080px (Max 5MB)</p>
                     </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-background border border-border text-xs">
                     <span className="font-bold text-foreground block mb-1">Global Authorization Handshake</span>
                     <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Configured ticket prices propagate securely to client dashboards. Commission splits trigger localized payment settlements upon event validation.
                     </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Form Actions Footer */}
          <div className="mt-8 pt-5 border-t border-border/60 flex items-center justify-between">
            <button 
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
               Back
            </button>
            
            {currentStep < steps.length - 1 ? (
              <GradientButton onClick={nextStep} size="sm" className="h-9 px-5 text-xs">
                 Next Stage
              </GradientButton>
            ) : (
              <GradientButton onClick={handlePublishSequence} size="sm" className="h-9 px-6 text-xs shadow-glow">
                 Publish Configured Summit
              </GradientButton>
            )}
          </div>
        </GlassCard>
      </div>

      {/* RICH VISUAL CONFIRMATION DIALOG OVERLAY (Aesthetics WOW demonstration) */}
      <AnimatePresence>
        {showSuccessSummary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-950/85 backdrop-blur-md" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-xl bg-neutral-900 border border-white/20 rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Splendid Title Bar */}
              <div className="p-6 pb-4 bg-gradient-to-r from-emerald-500/10 via-primary/10 to-transparent border-b border-white/10 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white grid place-items-center shrink-0 shadow-glow-sm">
                    <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">Success</span>
                    <h2 className="text-base font-bold text-white">Event Created Successfully</h2>
                  </div>
                </div>
                
                <button 
                  onClick={handleFinalRedirect}
                  className="h-8 w-8 rounded-lg glass grid place-items-center text-muted-foreground hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Data Review Deck */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1 no-scrollbar">
                {/* 1. Basic Metadata */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Event Details
                  </span>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
                    <div>
                      <p className="font-bold text-white text-sm">{formData.title || "Future Tech Expo 2026"}</p>
                      <p className="text-muted-foreground mt-0.5">{formData.venue || "Moscone Center"} · {formData.city || "San Francisco"}</p>
                    </div>

                    {formData.date && (
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Timeline:</span>
                        <span className="font-mono text-emerald-400 font-medium">
                          {formData.date} {formData.isMultiDay && formData.endDate ? `to ${formData.endDate}` : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Schedule Deck */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    {formData.isMultiDay ? "Multi-Day Agenda" : "Event Schedule"}
                  </span>
                  <div className="space-y-2">
                    {formData.schedule.map((sch) => (
                      <div key={sch.day} className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs">
                        <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-1.5">
                          <span className="font-bold text-emerald-400 text-[11px]">Day {sch.day}: {sch.title || `Day ${sch.day} Schedule`}</span>
                          <span className="text-[9px] font-mono text-muted-foreground">{sch.tracks.length} sessions</span>
                        </div>
                        <div className="space-y-1.5">
                          {sch.tracks.map((tr) => (
                            <div key={tr.id} className="flex items-start justify-between gap-2 text-[11px]">
                              <div className="min-w-0">
                                <span className="font-medium text-white block truncate">{tr.title}</span>
                                <span className="text-[10px] text-muted-foreground truncate block">by {tr.speaker}</span>
                              </div>
                              <span className="font-mono text-[10px] text-primary/80 shrink-0 mt-0.5">{tr.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Configured Ticket Tier Subsystem */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Ticket Pricing Tiers
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-center">
                      <span className="text-[9px] text-muted-foreground block font-bold uppercase">General</span>
                      <span className="font-mono font-bold text-white text-xs block">${formData.pricingTiers.general.price}</span>
                      <span className="text-[9px] text-muted-foreground font-mono block mt-0.5">{formData.pricingTiers.general.slots} slots</span>
                    </div>
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-center">
                      <span className="text-[9px] text-primary block font-bold uppercase">Pro Tier</span>
                      <span className="font-mono font-bold text-white text-xs block">${formData.pricingTiers.pro.price}</span>
                      <span className="text-[9px] text-primary/70 font-mono block mt-0.5">{formData.pricingTiers.pro.slots} slots</span>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
                      <span className="text-[9px] text-purple-400 block font-bold uppercase">VIP Pass</span>
                      <span className="font-mono font-bold text-white text-xs block">${formData.pricingTiers.vip.price}</span>
                      <span className="text-[9px] text-purple-400/70 font-mono block mt-0.5">{formData.pricingTiers.vip.slots} slots</span>
                    </div>
                  </div>
                </div>

                {/* 3. Configured Stalls Information */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Exhibition Stalls
                  </span>
                  <div className="space-y-1.5">
                    {formData.stallsInfo.filter(s => s.active).map(st => (
                      <div key={st.id} className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{st.type}</span>
                          <span className="text-[9px] text-muted-foreground font-mono">({st.size})</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-emerald-400 block">${st.price}</span>
                          <span className="text-[9px] text-muted-foreground font-mono block">{st.slots} slots</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Dispatched Invitations Queue */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Partner Invitations Sent
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold font-mono bg-emerald-500/20 text-emerald-400">
                      Dispatched: {dispatchedPartners.length}
                    </span>
                  </div>
                  
                  <p className="text-[11px] text-muted-foreground mb-2 leading-tight">
                    Invitations sent automatically to selected operational vendors and travel partners.
                  </p>

                  <div className="space-y-1.5">
                    {dispatchedPartners.length === 0 ? (
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center text-xs text-muted-foreground">
                        No operational partners selected for automatic invitations.
                      </div>
                    ) : (
                      dispatchedPartners.map(dp => (
                        <div key={dp.id} className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-white truncate flex items-center gap-1.5">
                              <span>{dp.name}</span>
                              <span className="text-[10px] text-muted-foreground font-normal">({dp.company})</span>
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">{dp.email}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {dp.roles.map((rk: RoleKey) => {
                              const rMeta = getRoleMeta(rk);
                              return (
                                <span key={rk} className={cn("px-1.5 py-0.2 rounded text-[9px] font-bold font-mono", rMeta.bg, rMeta.color)}>
                                  {rMeta.label}
                                </span>
                              );
                            })}
                            <span className="h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0" title="Sent verification check">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Action Handshake Close Bar */}
              <div className="p-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" /> Ready for Operations
                </span>

                <GradientButton onClick={handleFinalRedirect} size="sm" className="h-9 px-5 text-xs shadow-glow">
                  Go to Event Dashboard
                </GradientButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE NEW PARTNER MODAL */}
      <AnimatePresence>
        {showAddPartnerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddPartnerModal(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 22, stiffness: 320 }}
              className="relative w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col"
            >
               <div className="flex items-center justify-between px-6 py-4 bg-accent/20 border-b border-border">
                  <div>
                     <span className="text-[9px] font-bold font-mono text-primary uppercase tracking-widest block mb-0.5">
                        Partner Hub Onboarding
                     </span>
                     <h2 className="text-sm font-bold text-foreground">
                        Invite New Partner
                     </h2>
                  </div>
                  <button onClick={() => setShowAddPartnerModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                     <X className="h-4 w-4" />
                  </button>
               </div>

               <form onSubmit={handleAddCustomPartner} className="p-6 space-y-4">
                  <div className="space-y-4 text-xs">
                     <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                           Partner Contact Name *
                        </label>
                        <input 
                           type="text" 
                           required
                           value={newPartnerName}
                           onChange={(e) => setNewPartnerName(e.target.value)}
                           placeholder="e.g. John Doe" 
                           className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-medium"
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                           Email Address *
                        </label>
                        <input 
                           type="email" 
                           required
                           value={newPartnerEmail}
                           onChange={(e) => setNewPartnerEmail(e.target.value)}
                           placeholder="e.g. partner@company.com" 
                           className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-medium"
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                           Company Brand
                        </label>
                        <input 
                           type="text" 
                           value={newPartnerCompany}
                           onChange={(e) => setNewPartnerCompany(e.target.value)}
                           placeholder="e.g. Global Supplies Inc." 
                           className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all font-medium"
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                           Partner Category *
                        </label>
                        <select
                           value={newPartnerRole}
                           onChange={(e) => setNewPartnerRole(e.target.value as RoleKey)}
                           className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground font-bold outline-none focus:border-primary transition-all cursor-pointer"
                        >
                           {PARTNER_ROLES_META.map(r => (
                              <option key={r.key} value={r.key}>
                                 {r.label}
                              </option>
                           ))}
                        </select>
                     </div>
                  </div>

                  <div className="pt-4 border-t border-border flex justify-end gap-2">
                     <button
                        type="button"
                        onClick={() => setShowAddPartnerModal(false)}
                        className="px-3 py-1.5 rounded-lg font-bold text-muted-foreground hover:text-foreground text-xs transition-colors"
                     >
                        Cancel
                     </button>
                     <GradientButton type="submit" size="sm" className="h-9 text-xs px-5">
                        Add & Select Partner
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

function Field({ label, type = "text", value, onChange, placeholder, icon: Icon, className = "" }: any) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-[10px] font-bold text-muted-foreground block">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />}
        <input 
          type={type} 
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "w-full py-2 bg-background rounded-xl border border-border outline-none focus:border-primary transition-all text-xs font-medium text-foreground placeholder:text-muted-foreground",
            Icon ? "pl-9 pr-3" : "px-3"
          )}
        />
      </div>
    </div>
  );
}

function ToggleCard({ icon: Icon, label, desc, active = true, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-4 rounded-xl bg-background border flex items-center justify-between gap-3 cursor-pointer transition-all",
        active ? "border-primary/40 shadow-[0_0_15px_rgba(var(--primary),0.1)]" : "border-border hover:border-border/80 opacity-70"
      )}
    >
       <div className="flex items-center gap-3 min-w-0">
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors", active ? "bg-primary/10 text-primary" : "bg-accent text-muted-foreground")}>
             <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
             <p className={cn("text-xs font-bold truncate transition-colors", active ? "text-foreground" : "text-muted-foreground")}>{label}</p>
             <p className="text-[10px] text-muted-foreground truncate">{desc}</p>
          </div>
       </div>
       
       <div className="flex items-center gap-2 shrink-0">
          <span className={cn(
            "text-[9px] font-bold uppercase tracking-wider hidden sm:block transition-colors",
            active ? "text-emerald-500" : "text-muted-foreground"
          )}>
            {active ? "Active" : "Inactive"}
          </span>
          <div className={cn(
            "w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center shadow-inner",
            active ? "bg-primary" : "bg-muted"
          )}>
            <motion.div 
              layout
              className="w-4 h-4 bg-background rounded-full shadow-sm"
              animate={{ x: active ? 16 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
       </div>
    </div>
  );
}
