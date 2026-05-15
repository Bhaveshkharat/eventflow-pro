"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Users, UserPlus, Search, Mail, Phone, MapPin,
  ChevronDown, X, Check, Activity, ShieldCheck,
  Globe, Sparkles, Building2, Sliders, Layers, Tag
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { StatCard } from "@/components/ui-ext/StatCard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CustomRoleTemplate {
  id: string;
  name: string;
  permissionsCount: number;
  color: string;
}

const LOCAL_AVAILABLE_TEMPLATES: CustomRoleTemplate[] = [
  { id: "role-global-master", name: "Full Access Organizer", permissionsCount: 9, color: "text-primary border-primary/40" },
  { id: "role-ops-lead", name: "Operations Desk Lead", permissionsCount: 6, color: "text-amber-500 border-amber-500/40" },
  { id: "role-financial-auditor", name: "Finance Auditor", permissionsCount: 3, color: "text-blue-400 border-blue-500/40" }
];

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleTemplateId: string;
  assignedCityScope: string;
  avatar: string;
  status: "Active" | "Invite Pending" | "Suspended";
  joinedDate: string;
}

const INITIAL_STAFF_USERS: StaffUser[] = [
  {
    id: "staff-1",
    name: "Rachel Vance",
    email: "rvance@eventflow-pro.internal",
    phone: "+1 (555) 019-3388",
    roleTemplateId: "role-global-master",
    assignedCityScope: "Global Network",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=60",
    status: "Active",
    joinedDate: "May 01, 2026"
  },
  {
    id: "staff-2",
    name: "Marcus Aurelius",
    email: "marcus.ops@eventflow-pro.internal",
    phone: "+1 (555) 431-9900",
    roleTemplateId: "role-ops-lead",
    assignedCityScope: "San Francisco Metro",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=60",
    status: "Active",
    joinedDate: "May 05, 2026"
  },
  {
    id: "staff-3",
    name: "Seraphina Lin",
    email: "slin.audit@eventflow-pro.internal",
    phone: "+65 6221-8899",
    roleTemplateId: "role-financial-auditor",
    assignedCityScope: "Singapore Expo Center",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=60",
    status: "Active",
    joinedDate: "May 09, 2026"
  },
  {
    id: "staff-4",
    name: "Devon Cross",
    email: "dcross@eventflow-pro.internal",
    phone: "+44 20 7946-0912",
    roleTemplateId: "role-ops-lead",
    assignedCityScope: "London Arena Branch",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
    status: "Invite Pending",
    joinedDate: "May 12, 2026"
  }
];

export default function DedicatedUsersWorkspace() {
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(INITIAL_STAFF_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("All");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    roleTemplateId: LOCAL_AVAILABLE_TEMPLATES[0].id,
    assignedCityScope: "Main Office"
  });

  const handleProvisionStaffUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name.trim() || !newUserForm.email.trim()) {
      toast.error("Please supply a valid staff name and email address.");
      return;
    }

    const targetTemplate = LOCAL_AVAILABLE_TEMPLATES.find(r => r.id === newUserForm.roleTemplateId);

    const newStaff: StaffUser = {
      id: `staff-${Date.now()}`,
      name: newUserForm.name.trim(),
      email: newUserForm.email.trim(),
      phone: newUserForm.phone.trim() || "+1 (555) 891-2200",
      roleTemplateId: newUserForm.roleTemplateId,
      assignedCityScope: newUserForm.assignedCityScope.trim() || "Main Office",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newUserForm.name)}`,
      status: "Active",
      joinedDate: "Invited Today"
    };

    setStaffUsers(prev => [newStaff, ...prev]);
    toast.success(`Invited staff member ${newStaff.name} with role: "${targetTemplate?.name}".`);
    
    setNewUserForm({
      name: "",
      email: "",
      phone: "",
      roleTemplateId: LOCAL_AVAILABLE_TEMPLATES[0].id,
      assignedCityScope: "Main Office"
    });
    setIsUserModalOpen(false);
  };

  const handleUpdateUserRoleLink = (staffId: string, newTemplateId: string) => {
    setStaffUsers(prev => prev.map(u => {
      if (u.id === staffId) {
        return { ...u, roleTemplateId: newTemplateId };
      }
      return u;
    }));

    const targetTemplate = LOCAL_AVAILABLE_TEMPLATES.find(r => r.id === newTemplateId);
    const targetUser = staffUsers.find(u => u.id === staffId);
    toast.success(`Updated role for ${targetUser?.name} to "${targetTemplate?.name}".`);
  };

  const filteredStaff = useMemo(() => {
    return staffUsers.filter(u => {
      const matchSearch = !searchQuery || [u.name, u.email, u.assignedCityScope].some(v => v.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchRole = selectedRoleFilter === "All" || u.roleTemplateId === selectedRoleFilter;
      return matchSearch && matchRole;
    });
  }, [staffUsers, searchQuery, selectedRoleFilter]);

  const kpis = useMemo(() => {
    const fullAdmins = staffUsers.filter(u => u.roleTemplateId === "role-global-master").length;
    const scopedOperators = staffUsers.filter(u => u.roleTemplateId !== "role-global-master").length;
    return { fullAdmins, scopedOperators };
  }, [staffUsers]);

  return (
    <DashboardShell
      title="Staff Users"
      subtitle="Invite staff members to your organizer portal, review contact details, and assign access roles instantly."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Users} label="Total Staff Members" value={staffUsers.length} delta="Active Team Directory" />
        <StatCard icon={ShieldCheck} label="Full Access Admins" value={kpis.fullAdmins} delta="All Features Enabled" />
        <StatCard icon={Sliders} label="Custom Role Staff" value={kpis.scopedOperators} delta="Specific Permissions" />
        <StatCard icon={Globe} label="Available Roles" value={LOCAL_AVAILABLE_TEMPLATES.length} delta="Preconfigured Groups" />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 font-mono">
                TEAM DIRECTORY
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">Manage Personnel</span>
            </div>
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <Users className="h-4.5 w-4.5 text-primary" /> Active Staff Accounts
            </h2>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-accent/40 border border-border/60">
              <button
                onClick={() => setSelectedRoleFilter("All")}
                className={cn("px-2.5 py-1 rounded-lg text-xs font-bold transition-all", selectedRoleFilter === "All" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground")}
              >
                All Roles
              </button>
              {LOCAL_AVAILABLE_TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedRoleFilter(t.id)}
                  className={cn("px-2.5 py-1 rounded-lg text-xs font-bold transition-all truncate max-w-[120px]", selectedRoleFilter === t.id ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground")}
                  title={t.name}
                >
                  {t.name.split(' ')[0]}
                </button>
              ))}
            </div>

            <GradientButton onClick={() => setIsUserModalOpen(true)} size="sm" className="h-9 px-4 shrink-0 shadow-sm">
              <UserPlus className="h-4 w-4 mr-1.5" /> Add New Staff Member
            </GradientButton>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-background border border-border flex items-center gap-2 max-w-md">
          <Search className="h-4 w-4 text-muted-foreground shrink-0 ml-1" />
          <input 
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search staff members by name, email, or region..."
            className="w-full bg-transparent text-xs font-medium text-foreground placeholder:text-muted-foreground outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-[10px] font-bold text-muted-foreground hover:text-foreground shrink-0 pr-1">
              Clear
            </button>
          )}
        </div>

        <div className="grid gap-3">
          <AnimatePresence mode="popLayout">
            {filteredStaff.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 text-center glass rounded-xl border border-dashed border-border">
                <p className="text-xs font-bold text-foreground">No staff members match your search criteria.</p>
              </motion.div>
            ) : (
              filteredStaff.map(user => {
                const boundTemplate = LOCAL_AVAILABLE_TEMPLATES.find(r => r.id === user.roleTemplateId) || LOCAL_AVAILABLE_TEMPLATES[0];

                return (
                  <motion.div
                    key={user.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-xl glass border border-border/60 hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-border group-hover:bg-primary transition-colors rounded-r" />

                    <div className="flex items-center gap-3.5 min-w-0 flex-1 pl-1">
                      <img src={user.avatar} alt="" className="h-10 w-10 rounded-xl object-cover ring-2 ring-primary/20 shrink-0 bg-background" />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-foreground truncate tracking-tight">{user.name}</h4>
                          <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-background border border-border text-muted-foreground font-mono truncate">
                            📍 {user.assignedCityScope}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground font-medium">
                          <span className="flex items-center gap-1 truncate text-foreground/80">📧 {user.email}</span>
                          <span className="text-border">·</span>
                          <span className="flex items-center gap-1 shrink-0 font-mono">📞 {user.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-border/40 shrink-0">
                      <div className="text-left md:text-right">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                          Assigned Staff Role
                        </span>

                        <div className="relative inline-block">
                          <select
                            value={user.roleTemplateId}
                            onChange={(e) => handleUpdateUserRoleLink(user.id, e.target.value)}
                            className={cn(
                              "pl-2.5 pr-8 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer appearance-none bg-background shadow-xs outline-none",
                              boundTemplate.color
                            )}
                          >
                            {LOCAL_AVAILABLE_TEMPLATES.map(tmpl => (
                              <option key={tmpl.id} value={tmpl.id} className="bg-background text-foreground font-medium">
                                {tmpl.name} ({tmpl.permissionsCount} features allowed)
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-center shrink-0 pl-2">
                        <span className={cn("px-2 py-0.5 rounded font-mono font-bold text-[9px] block", user.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-500")}>
                          {user.status}
                        </span>
                        <span className="text-[8px] text-muted-foreground font-mono mt-0.5">{user.joinedDate}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════════════
          OVERHAULED HYPER-VISIBLE PREMIUM GLASSMORPHIC PROVISIONING MODAL
          ═════════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsUserModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              className="relative w-full max-w-xl bg-background border-2 border-primary/40 rounded-2xl shadow-[0_0_50px_-12px_rgba(var(--primary),0.3)] z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-primary/30 via-background/90 to-background/90 border-b border-primary/30 backdrop-blur-md">
                <div>
                  <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest block mb-0.5 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Staff Setup
                  </span>
                  <h2 className="font-extrabold text-base text-foreground tracking-tight">Create Staff Account & Assign Role</h2>
                </div>
                <button
                  onClick={() => setIsUserModalOpen(false)}
                  className="h-8 w-8 rounded-xl bg-background/80 border-2 border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-xs"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleProvisionStaffUserSubmit} className="p-6 space-y-5 overflow-y-auto no-scrollbar flex-1">
                <div className="p-4 rounded-xl bg-accent/20 border border-border/40 space-y-4">
                  <div>
                    <label className="text-xs font-extrabold text-foreground uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-primary" /> Staff Account Details
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider block mb-1">Full Name *</span>
                        <input
                          required
                          type="text"
                          value={newUserForm.name}
                          onChange={e => setNewUserForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="e.g. Elena Rosamund"
                          className="w-full bg-background/95 border-2 border-border/80 rounded-xl py-2.5 px-3.5 text-xs outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 font-bold shadow-inner transition-all"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider block mb-1">Email Address *</span>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <input
                            required
                            type="email"
                            value={newUserForm.email}
                            onChange={e => setNewUserForm(f => ({ ...f, email: e.target.value }))}
                            placeholder="erosamund@eventflow-pro.internal"
                            className="w-full bg-background/95 border-2 border-border/80 rounded-xl py-2.5 pl-9 pr-3.5 text-xs outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 font-bold shadow-inner transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider block mb-1">Phone Number</span>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <input
                            type="text"
                            value={newUserForm.phone}
                            onChange={e => setNewUserForm(f => ({ ...f, phone: e.target.value }))}
                            placeholder="+1 (555) 441-0900"
                            className="w-full bg-background/95 border-2 border-border/80 rounded-xl py-2.5 pl-9 pr-3.5 text-xs outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 font-bold shadow-inner transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider block mb-1">Assigned Region or Branch</span>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary" />
                          <input
                            type="text"
                            value={newUserForm.assignedCityScope}
                            onChange={e => setNewUserForm(f => ({ ...f, assignedCityScope: e.target.value }))}
                            placeholder="e.g. Downtown Center"
                            className="w-full bg-background/95 border-2 border-border/80 rounded-xl py-2.5 pl-9 pr-3.5 text-xs outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 font-bold shadow-inner transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-accent/30 border border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-foreground uppercase tracking-wider block">
                      Assign Staff Role *
                    </label>
                    <span className="text-[9px] font-mono font-black text-primary uppercase">
                      Controls permissions
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground font-medium leading-tight">
                    Choose the role that controls which features and menu items this staff member is allowed to see.
                  </p>

                  <select
                    value={newUserForm.roleTemplateId}
                    onChange={e => setNewUserForm(f => ({ ...f, roleTemplateId: e.target.value }))}
                    className="w-full bg-background/95 border-2 border-border/80 rounded-xl py-2.5 px-3.5 text-xs font-extrabold text-foreground outline-none focus:border-primary transition-all cursor-pointer mt-3 shadow-inner"
                  >
                    {LOCAL_AVAILABLE_TEMPLATES.map(tmpl => (
                      <option key={tmpl.id} value={tmpl.id} className="bg-background text-foreground font-bold">
                        🛡️ {tmpl.name} — Grants access to {tmpl.permissionsCount} features
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsUserModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-extrabold text-muted-foreground hover:text-foreground transition-all"
                  >
                    Cancel
                  </button>
                  <GradientButton type="submit" size="sm" className="h-10 px-6 font-extrabold text-xs shadow-md">
                    Send Invitation
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
