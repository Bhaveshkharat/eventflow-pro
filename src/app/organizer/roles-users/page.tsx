"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Truck, Hotel, Plane, Plus, Search,
  Trash2, X, Mail, Phone, Building2, MapPin,
  ShieldCheck, UserPlus, ChevronDown, Check
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events } from "@/data/mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
type RoleKey = "vendor" | "volunteer" | "hotel-agent" | "travel-agent";

interface AssignedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  roles: RoleKey[]; // Updated to strictly support multi-select role assignment
  eventId: string;
  createdAt: string;
}

// ─── Predefined Role Configurations ───────────────────────────────────────────
const ROLES: { key: RoleKey; label: string; icon: React.ElementType; color: string; bg: string; border: string }[] = [
  { key: "hotel-agent",   label: "Hotel Partner",   icon: Hotel,  color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/30" },
  { key: "travel-agent",  label: "Travel Partner",  icon: Plane,  color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  { key: "vendor",        label: "Vendor",          icon: Truck,  color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/30" },
  { key: "volunteer",     label: "Volunteer",       icon: Users,  color: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/30" },
];

const getRoleMeta = (key: RoleKey) => ROLES.find(r => r.key === key) ?? ROLES[0];
const getEvent = (id: string) => events.find(e => e.id === id);

// ─── Rich Initial Seed Data with Multi-Select support ─────────────────────────
const SEED: AssignedUser[] = [
  { 
    id: "u1", 
    name: "Marcus Vance",  
    email: "marcus@grandmarquise.com", 
    phone: "+1 555-431-9900", 
    company: "Grand Marquise Hotels",    
    roles: ["hotel-agent"],  
    eventId: "techsummit-26",  
    createdAt: "May 10, 2026" 
  },
  { 
    id: "u2", 
    name: "Sarah Jenkins", 
    email: "sarah@skytravel.io",        
    phone: "+1 555-019-2244", 
    company: "SkyTravel Logistics",       
    roles: ["travel-agent", "vendor"], 
    eventId: "techsummit-26",  
    createdAt: "May 11, 2026" 
  },
  { 
    id: "u3", 
    name: "Hans Gruber",   
    email: "hans@peakvisuals.de",       
    phone: "+49 89 220199",   
    company: "Peak Visual Rigging",       
    roles: ["vendor"],       
    eventId: "designweek-26", 
    createdAt: "May 08, 2026" 
  },
  { 
    id: "u4", 
    name: "Elena Rostova", 
    email: "elena@globalstay.sg",       
    phone: "+65 6889-1200",   
    company: "Global Stay Hotels",        
    roles: ["hotel-agent", "travel-agent"],  
    eventId: "fintech-asia",  
    createdAt: "May 12, 2026" 
  },
  { 
    id: "u5", 
    name: "David Kim",     
    email: "david@eventflow.org",       
    phone: "+1 555-882-3311", 
    company: "EventFlow Volunteer Ops",   
    roles: ["volunteer"],    
    eventId: "techsummit-26",  
    createdAt: "May 12, 2026" 
  },
  { 
    id: "u6", 
    name: "Mateo Rossi",   
    email: "mateo@milano-transit.it",   
    phone: "+39 02 1199-4432",
    company: "Milano Private Transit",    
    roles: ["travel-agent"], 
    eventId: "designweek-26", 
    createdAt: "May 09, 2026" 
  },
];

// ─── Initial Form Defaults ────────────────────────────────────────────────────
const emptyForm = { 
  name: "", 
  email: "", 
  phone: "", 
  company: "", 
  roles: ["hotel-agent"] as RoleKey[], 
  eventId: events[0]?.id ?? "" 
};

export default function OrganizerRolesUsers() {
  const [users, setUsers]         = useState<AssignedUser[]>(SEED);
  const [filter, setFilter]       = useState<RoleKey | "all">("all");
  const [search, setSearch]       = useState("");
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]           = useState(emptyForm);

  // ─── Dynamic Counts derived from multi-role mappings ────────────────────────
  const counts = useMemo(() => ({
    total:     users.length,
    hotel:     users.filter(u => u.roles.includes("hotel-agent")).length,
    travel:    users.filter(u => u.roles.includes("travel-agent")).length,
    vendor:    users.filter(u => u.roles.includes("vendor")).length,
    volunteer: users.filter(u => u.roles.includes("volunteer")).length,
  }), [users]);

  // ─── Filterable List logic ──────────────────────────────────────────────────
  const visible = useMemo(() =>
    users.filter(u => {
      const matchRole   = filter === "all" || u.roles.includes(filter);
      const matchSearch = !search || [u.name, u.email, u.company].some(v => v.toLowerCase().includes(search.toLowerCase()));
      return matchRole && matchSearch;
    }), [users, filter, search]);

  // ─── Multi-Select Role Toggler ──────────────────────────────────────────────
  const toggleRoleSelection = (roleKey: RoleKey) => {
    setForm(prev => {
      const exists = prev.roles.includes(roleKey);
      if (exists) {
        // Prevent deselecting the final role to maintain data sanity
        if (prev.roles.length === 1) {
          toast.info("A user must have at least one predefined role assigned.");
          return prev;
        }
        return { ...prev, roles: prev.roles.filter(r => r !== roleKey) };
      } else {
        return { ...prev, roles: [...prev.roles, roleKey] };
      }
    });
  };

  // ─── Action Handlers ────────────────────────────────────────────────────────
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) {
      toast.error("Please supply the required user identity credentials.");
      return;
    }
    if (form.roles.length === 0) {
      toast.error("Please assign at least one operational role.");
      return;
    }

    const newUser: AssignedUser = {
      id: `u${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone || "+1 555-019-3388",
      company: form.company,
      roles: form.roles,
      eventId: form.eventId,
      createdAt: "Just now",
    };

    setUsers(prev => [newUser, ...prev]);
    toast.success(`User provisioned successfully with ${form.roles.length} assigned role(s)!`);
    setForm(emptyForm);
    setShowModal(false);
  };

  const handleDeleteUser = (id: string, name: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast.success(`Removed assigned roles and access access for "${name}".`);
  };

  return (
    <DashboardShell
      title="Users & Predefined Role Assignments"
      subtitle="Instantiate partner users and multi-assign them to predefined system roles mapped specifically to local geographical events."
    >
      {/* ── Gorgeous KPI Counters Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Assigned Hotels",   value: counts.hotel,     icon: Hotel,  color: "text-blue-400",   border: "border-blue-500/20",   bg: "bg-blue-500/[0.04]" },
          { label: "Assigned Travels",  value: counts.travel,    icon: Plane,  color: "text-purple-400", border: "border-purple-500/20", bg: "bg-purple-500/[0.04]" },
          { label: "Assigned Vendors",  value: counts.vendor,    icon: Truck,  color: "text-amber-400",  border: "border-amber-500/20",  bg: "bg-amber-500/[0.04]" },
          { label: "Active Volunteers", value: counts.volunteer, icon: Users,  color: "text-emerald-400",border: "border-emerald-500/20",bg: "bg-emerald-500/[0.04]" },
        ].map(({ label, value, icon: Icon, color, border, bg }) => (
          <div key={label} className={cn("rounded-2xl border p-4.5 flex items-center gap-3.5 transition-all shadow-sm backdrop-blur-sm", border, bg)}>
            <div className={cn("h-10 w-10 rounded-xl glass-strong flex items-center justify-center shrink-0 border border-white/10 shadow-inner", color)}>
              <Icon className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground tracking-tight">{value}</p>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search & Actions Controls Header ── */}
      <div className="p-4 rounded-2xl glass border border-white/10 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.01]">
        {/* Interactive Role Tab Pivot filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200",
              filter === "all" ? "bg-primary text-primary-foreground shadow-md" : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
            )}
          >
            All Accounts ({counts.total})
          </button>
          {ROLES.map(r => {
            const isActive = filter === r.key;
            const countMap: Record<string, number> = {
              "hotel-agent": counts.hotel,
              "travel-agent": counts.travel,
              "vendor": counts.vendor,
              "volunteer": counts.volunteer
            };
            return (
              <button
                key={r.key}
                onClick={() => setFilter(r.key)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2",
                  isActive ? "bg-white/15 text-foreground border border-white/20 shadow-sm" : "bg-white/[0.02] text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
                )}
              >
                <r.icon className={cn("h-3.5 w-3.5", r.color)} />
                <span>{r.label}</span>
                <span className={cn("px-1.5 py-0.2 text-[9px] rounded-md font-mono", isActive ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground")}>
                  {countMap[r.key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Global Search and Assignment Modality Trigger */}
        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by name, email..."
              className="w-full bg-white/10 border border-white/15 rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:border-primary/50 text-white placeholder:text-muted-foreground transition-all shadow-inner"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-[10px]">
                Clear
              </button>
            )}
          </div>

          <GradientButton onClick={() => setShowModal(true)} size="sm" className="h-9 px-4 shrink-0 shadow-glow">
            <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Assign Role
          </GradientButton>
        </div>
      </div>

      {/* ── High-Fidelity Table Metadata Header ── */}
      <div className="grid grid-cols-12 gap-3 px-5 mb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 select-none">
        <span className="col-span-5 sm:col-span-4">User Entity Details</span>
        <span className="col-span-4 sm:col-span-4">Predefined Roles Assigned</span>
        <span className="col-span-3 sm:col-span-3 hidden sm:block">Scoped Geographical Event</span>
        <span className="col-span-3 sm:col-span-1 text-right">Revoke</span>
      </div>

      {/* ── Provisioned Assigned User Data Grid Rows ── */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {visible.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.98 }}
              className="py-16 text-center glass rounded-2xl border border-dashed border-white/15"
            >
              <ShieldCheck className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-bold text-foreground">No matching assigned users found</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No users meet your query term filters. Click "Assign Role" to create an identity record and pair it with operational roles instantly.
              </p>
            </motion.div>
          ) : (
            visible.map(user => {
              const eventObj = getEvent(user.eventId);
              return (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-12 gap-3 items-center px-5 py-3.5 rounded-xl glass-strong border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden"
                >
                  {/* Subtle left boundary indicator */}
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-white/10 group-hover:bg-primary rounded-r-full transition-colors" />

                  {/* 1. Core Profile Details */}
                  <div className="col-span-5 sm:col-span-4 flex items-center gap-3 min-w-0 pl-1">
                    <div className="h-9 w-9 rounded-xl gradient-bg flex items-center justify-center shrink-0 font-black text-xs text-white shadow-md">
                      {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <span className="text-[10px] text-muted-foreground font-mono">({user.company})</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate font-medium mt-0.5">{user.email}</p>
                    </div>
                  </div>

                  {/* 2. Multi-Select Predefined Assigned Roles stack */}
                  <div className="col-span-4 sm:col-span-4 flex flex-wrap items-center gap-1.5">
                    {user.roles.map(rk => {
                      const rMeta = getRoleMeta(rk);
                      return (
                        <span 
                          key={rk}
                          className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border transition-transform",
                            rMeta.bg, rMeta.color, rMeta.border
                          )}
                        >
                          <rMeta.icon className="h-3 w-3 shrink-0" />
                          <span>{rMeta.label}</span>
                        </span>
                      );
                    })}
                  </div>

                  {/* 3. Mapped Geographical Event Target */}
                  <div className="col-span-3 sm:col-span-3 hidden sm:block min-w-0">
                    <p className="text-xs font-bold text-foreground/90 truncate flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{eventObj?.title ?? "All Venues Scope"}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate pl-5">
                      {eventObj?.city ?? "Global Deployment"} · {user.createdAt}
                    </p>
                  </div>

                  {/* 4. Revoke Actions */}
                  <div className="col-span-3 sm:col-span-1 flex items-center justify-end">
                    <button
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      className="h-8 w-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/15 transition-all opacity-80 group-hover:opacity-100"
                      title="Revoke partner access and multi-roles"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* ── HIGH-CONTRAST PREDEFINED MULTI-SELECT ASSIGNMENT MODAL ── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Layer */}
            <motion.div
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />

            {/* Centered Premium Dialog Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 320 }}
              className="relative w-full max-w-xl bg-neutral-900 border border-white/20 rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Premium Top Dialog Bar */}
              <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-0.5">Predefined Roles Controller</span>
                  <h2 className="font-bold text-base text-white">Create User & Assign Multi-Roles</h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="h-8 w-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Setup Inputs section */}
              <form onSubmit={handleAddSubmit} className="p-6 space-y-5 overflow-y-auto no-scrollbar flex-1">
                {/* 1. Core Profile Identity fields */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block mb-2.5">
                    User Contact & Identity Mapping
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground block mb-1">Full Name *</span>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. Rachel Adams"
                        className="w-full bg-white/10 border border-white/20 rounded-xl py-2 px-3 text-xs outline-none focus:border-primary focus:bg-white/15 text-white placeholder:text-muted-foreground/60 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground block mb-1">Company / Subcontractor Brand *</span>
                      <input
                        required
                        type="text"
                        value={form.company}
                        onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                        placeholder="e.g. Apex Continental Logistics"
                        className="w-full bg-white/10 border border-white/20 rounded-xl py-2 px-3 text-xs outline-none focus:border-primary focus:bg-white/15 text-white placeholder:text-muted-foreground/60 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground block mb-1">Email Address *</span>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          placeholder="rachel@apexlogistics.com"
                          className="w-full bg-white/10 border border-white/20 rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:border-primary focus:bg-white/15 text-white placeholder:text-muted-foreground/60 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground block mb-1">Direct Telephony Number</span>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          value={form.phone}
                          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                          placeholder="+1 (555) 019-3388"
                          className="w-full bg-white/10 border border-white/20 rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:border-primary focus:bg-white/15 text-white placeholder:text-muted-foreground/60 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Interactive Multi-Select Predefined Roles selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                      Assign Predefined System Roles (Multi-Select) *
                    </label>
                    <span className="text-[10px] font-bold text-primary font-mono">
                      Selected: {form.roles.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-3 leading-tight">
                    Click tiles to grant or revoke overlapping portal permissions simultaneously. Users can manage multiple logistics functions under one dashboard.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ROLES.map(r => {
                      const isAssigned = form.roles.includes(r.key);
                      return (
                        <button
                          key={r.key}
                          type="button"
                          onClick={() => toggleRoleSelection(r.key)}
                          className={cn(
                            "p-3 rounded-xl border text-left transition-all relative overflow-hidden flex items-start gap-3",
                            isAssigned 
                              ? "border-primary bg-primary/10 shadow-glow-sm" 
                              : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-muted-foreground"
                          )}
                        >
                          <div className={cn("p-1.5 rounded-lg shrink-0 mt-0.5 border", isAssigned ? "bg-primary/20 text-primary border-primary/30" : "bg-white/5 text-muted-foreground border-transparent")}>
                            <r.icon className="h-4 w-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className={cn("text-xs font-bold leading-tight", isAssigned ? "text-white" : "text-foreground/80")}>
                              {r.label}
                            </p>
                            <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                              {r.key === "hotel-agent" ? "Manage nearest lodgings" :
                               r.key === "travel-agent" ? "Dispatch location transit" :
                               r.key === "vendor" ? "Rigging & staging setup" : "Floor entry turns & support"}
                            </p>
                          </div>

                          <div className={cn("h-4 w-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all", isAssigned ? "bg-primary border-primary text-background" : "border-white/20 bg-black/20")}>
                            {isAssigned && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Event Scope Dropdown */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block mb-2">
                    Target Geographical Event Scope *
                  </label>
                  
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary" />
                    <select
                      value={form.eventId}
                      onChange={e => setForm(f => ({ ...f, eventId: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-2.5 pl-9 pr-8 text-xs font-bold text-white outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                    >
                      {events.map(ev => (
                        <option key={ev.id} value={ev.id} className="bg-neutral-900 text-white font-medium">
                          📍 {ev.title} — {ev.venue} ({ev.city})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    Ensures partner permissions stay bound strictly to the specific host municipality and dates.
                  </p>
                </div>

                {/* Form Action confirmation bar */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setForm(emptyForm); }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
                  >
                    Cancel Setup
                  </button>
                  <GradientButton type="submit" size="sm" className="h-9 px-5 shadow-glow">
                    Provision Account & Assign Roles
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
