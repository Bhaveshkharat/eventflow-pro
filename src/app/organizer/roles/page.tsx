"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ShieldCheck, Plus, Check, Trash2, X, Layers,
  Lock, Sliders, Sparkles, Activity, Users,
  CheckCircle2, ArrowRight, CornerDownRight, Tag
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { StatCard } from "@/components/ui-ext/StatCard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── RBAC Routing Definitions ──────────────────────────────────────────────────
export type AppSectionKey = "overview" | "management" | "financials" | "administration";
export type AppViewRoute = 
  | "Dashboard" 
  | "Real-time Stats" 
  | "Events Portfolio" 
  | "Event Participants" 
  | "Partner Hub" 
  | "Check-in Suite" 
  | "Finance & Payouts" 
  | "Roles Controller"
  | "Staff Users";

export interface PermissionSectionDef {
  key: AppSectionKey;
  title: string;
  desc: string;
  views: {
    route: AppViewRoute;
    pathString: string;
    desc: string;
  }[];
}

const PERMISSION_SECTIONS: PermissionSectionDef[] = [
  {
    key: "overview",
    title: "Dashboard & Analytics",
    desc: "Access the main dashboard overview and live real-time statistics.",
    views: [
      { route: "Dashboard", pathString: "/organizer", desc: "Main summary metrics, event quick links, and pending payouts." },
      { route: "Real-time Stats", pathString: "/analytics", desc: "Live check-in performance charts, sales velocity graphs, and daily tracking." }
    ]
  },
  {
    key: "management",
    title: "Event Operations",
    desc: "Manage your events, view registered attendees, and coordinate partner agencies.",
    views: [
      { route: "Events Portfolio", pathString: "/organizer/events", desc: "Create and update events, manage ticket pricing tiers, and configure sub-pages." },
      { route: "Event Participants", pathString: "/organizer/participants", desc: "Search and review lists of registered Visitors, Exhibitors, and Speakers." },
      { route: "Partner Hub", pathString: "/organizer/operations", desc: "Invite commercial partners, assign service crews, and configure commission rates." },
      { route: "Check-in Suite", pathString: "/qr-verify", desc: "Digital ticket scanner interface for verifying attendee QR badges at the door." }
    ]
  },
  {
    key: "financials",
    title: "Finance & Payouts",
    desc: "View ticket sales revenue, monitor account balances, and process partner payouts.",
    views: [
      { route: "Finance & Payouts", pathString: "/organizer/settlements", desc: "Review revenue balance streams, authorize partner payout splits, and export logs." }
    ]
  },
  {
    key: "administration",
    title: "Staff Administration",
    desc: "Manage custom role permissions and invite team members to your portal.",
    views: [
      { route: "Roles Controller", pathString: "/organizer/roles", desc: "Create new staff roles and customize feature access permissions." },
      { route: "Staff Users", pathString: "/organizer/users", desc: "Invite internal staff members and assign their accounts to specific created roles." }
    ]
  }
];

// ─── Data Types ─────────────────────────────────────────────────────────────────
export interface CustomRoleTemplate {
  id: string;
  name: string;
  desc: string;
  color: string;
  permissions: AppViewRoute[];
  isSystem?: boolean;
  createdAt: string;
}

const INITIAL_ROLE_TEMPLATES: CustomRoleTemplate[] = [
  {
    id: "role-global-master",
    name: "Full Access Organizer",
    desc: "Complete, unrestricted control across all event settings, analytics pages, finance actions, and system accounts.",
    color: "from-primary/25 via-primary/10 to-transparent border-primary/40 text-primary",
    permissions: ["Dashboard", "Real-time Stats", "Events Portfolio", "Event Participants", "Partner Hub", "Check-in Suite", "Finance & Payouts", "Roles Controller", "Staff Users"],
    isSystem: true,
    createdAt: "System Default"
  },
  {
    id: "role-ops-lead",
    name: "Operations Desk Lead",
    desc: "Manage live event operations, oversee ticket verification scanning, and review assigned service partners.",
    color: "from-amber-500/20 via-amber-500/10 to-transparent border-amber-500/40 text-amber-500",
    permissions: ["Dashboard", "Events Portfolio", "Event Participants", "Partner Hub", "Check-in Suite", "Staff Users"],
    isSystem: true,
    createdAt: "Default Role"
  },
  {
    id: "role-financial-auditor",
    name: "Finance Auditor",
    desc: "View gross revenue charts, audit daily ticket sales, and approve outstanding commercial partner payouts.",
    color: "from-blue-500/20 via-blue-500/10 to-transparent border-blue-500/40 text-blue-400",
    permissions: ["Dashboard", "Real-time Stats", "Finance & Payouts"],
    isSystem: true,
    createdAt: "Default Role"
  }
];

export default function DedicatedRolesWorkspace() {
  const [roleTemplates, setRoleTemplates] = useState<CustomRoleTemplate[]>(INITIAL_ROLE_TEMPLATES);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const [newRoleForm, setNewRoleForm] = useState({
    name: "",
    desc: "",
    colorOption: "from-purple-500/25 via-purple-500/10 to-transparent border-purple-500/40 text-purple-400",
    selectedViews: [] as AppViewRoute[]
  });

  const totalAvailableViewsCount = useMemo(() => {
    return PERMISSION_SECTIONS.flatMap(s => s.views).length;
  }, []);

  const isAllGlobalSelected = useMemo(() => {
    return newRoleForm.selectedViews.length === totalAvailableViewsCount;
  }, [newRoleForm.selectedViews, totalAvailableViewsCount]);

  const toggleGlobalAll = () => {
    if (isAllGlobalSelected) {
      setNewRoleForm(prev => ({ ...prev, selectedViews: [] }));
      toast.info("Cleared all custom access checkbox items.");
    } else {
      const allViews = PERMISSION_SECTIONS.flatMap(s => s.views.map(v => v.route));
      setNewRoleForm(prev => ({ ...prev, selectedViews: allViews }));
      toast.success("Selected all available platform features.");
    }
  };

  const isSectionSelected = (secKey: AppSectionKey) => {
    const secViews = PERMISSION_SECTIONS.find(s => s.key === secKey)?.views.map(v => v.route) || [];
    return secViews.length > 0 && secViews.every(v => newRoleForm.selectedViews.includes(v));
  };

  const toggleSectionAll = (secKey: AppSectionKey) => {
    const secDef = PERMISSION_SECTIONS.find(s => s.key === secKey);
    if (!secDef) return;
    const secViews = secDef.views.map(v => v.route);
    const currentlySelected = isSectionSelected(secKey);

    if (currentlySelected) {
      setNewRoleForm(prev => ({
        ...prev,
        selectedViews: prev.selectedViews.filter(v => !secViews.includes(v))
      }));
    } else {
      setNewRoleForm(prev => {
        const merged = Array.from(new Set([...prev.selectedViews, ...secViews]));
        return { ...prev, selectedViews: merged };
      });
    }
  };

  const toggleIndividualView = (route: AppViewRoute) => {
    setNewRoleForm(prev => {
      const exists = prev.selectedViews.includes(route);
      if (exists) {
        return { ...prev, selectedViews: prev.selectedViews.filter(v => v !== route) };
      } else {
        return { ...prev, selectedViews: [...prev.selectedViews, route] };
      }
    });
  };

  const handleCreateCustomRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleForm.name.trim()) {
      toast.error("Please supply a role name.");
      return;
    }
    if (newRoleForm.selectedViews.length === 0) {
      toast.error("Please select at least one feature permission for this role.");
      return;
    }

    const newTemplate: CustomRoleTemplate = {
      id: `role-custom-${Date.now()}`,
      name: newRoleForm.name.trim(),
      desc: newRoleForm.desc.trim() || "Custom staff permission group.",
      color: newRoleForm.colorOption,
      permissions: newRoleForm.selectedViews,
      isSystem: false,
      createdAt: "Custom Role"
    };

    setRoleTemplates(prev => [...prev, newTemplate]);
    toast.success(`Successfully created custom role: "${newTemplate.name}"!`);
    
    setNewRoleForm({
      name: "",
      desc: "",
      colorOption: "from-purple-500/25 via-purple-500/10 to-transparent border-purple-500/40 text-purple-400",
      selectedViews: []
    });
    setIsRoleModalOpen(false);
  };

  const handleDeleteCustomRole = (templateId: string, name: string) => {
    setRoleTemplates(prev => prev.filter(r => r.id !== templateId));
    toast.success(`Deleted role: "${name}".`);
  };

  return (
    <DashboardShell
      title="Roles & Permissions"
      subtitle="Create custom roles and select which dashboard sections your staff members are allowed to access."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={ShieldCheck} label="Created Roles" value={roleTemplates.length} delta="Custom Groups" />
        <StatCard icon={Sliders} label="Available Features" value={totalAvailableViewsCount} delta="4 Main Sections" />
        <StatCard icon={Users} label="Staff Management Access" value={roleTemplates.filter(r => r.permissions.includes("Staff Users")).length} delta="Roles with access" />
        <StatCard icon={Activity} label="Security Status" value={"Active"} delta="Strict Rules Enabled" />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 font-mono">
                ACCESS CONTROL
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">Manage Permissions</span>
            </div>
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-primary" /> Configured Staff Roles
            </h2>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link href="/organizer/users">
              <button className="h-9 px-4 rounded-xl bg-background border border-border text-xs font-bold text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 shadow-xs">
                <span>Manage staff accounts</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>

            <GradientButton onClick={() => setIsRoleModalOpen(true)} size="sm" className="h-9 px-4 shrink-0 shadow-sm">
              <Plus className="h-4 w-4 mr-1.5" /> Create New Role
            </GradientButton>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {roleTemplates.map(template => {
            const authorizesUsersTab = template.permissions.includes("Staff Users");

            return (
              <GlassCard key={template.id} className="p-5 border-border/60 flex flex-col justify-between relative overflow-hidden group hover:border-primary/40 transition-all" hover={false}>
                <div className={cn("absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r", template.color.split(' ')[0])} />

                <div>
                  <div className="flex items-start justify-between gap-3 mb-2 pt-1">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-foreground truncate tracking-tight">{template.name}</h3>
                        {template.isSystem ? (
                          <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-background border border-border text-muted-foreground font-mono shrink-0 flex items-center gap-0.5">
                            <Lock className="h-2 w-2" /> Default
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-primary/10 text-primary border border-primary/20 font-mono shrink-0">
                            Custom
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono block mt-0.5">
                        Created: {template.createdAt}
                      </span>
                    </div>

                    <span className={cn("px-2 py-1 rounded text-[9px] font-bold font-mono tracking-tight shrink-0 border", authorizesUsersTab ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-neutral-500/10 text-muted-foreground border-border")}>
                      {authorizesUsersTab ? "👥 Admins Setup" : "🔒 Restricted"}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                    {template.desc}
                  </p>

                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                      Allowed Dashboard Features ({template.permissions.length}/{totalAvailableViewsCount})
                    </span>

                    <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pr-1 no-scrollbar">
                      {template.permissions.map(routeStr => {
                        const isCore = ["Dashboard", "Real-time Stats"].includes(routeStr);
                        const isMgmt = ["Events Portfolio", "Event Participants", "Partner Hub", "Check-in Suite"].includes(routeStr);
                        const isUserTab = routeStr === "Staff Users";

                        return (
                          <span
                            key={routeStr}
                            className={cn(
                              "px-2 py-0.5 rounded-md text-[10px] font-bold border font-mono tracking-tight",
                              isUserTab ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 animate-pulse" :
                              isCore ? "bg-blue-500/5 text-blue-400 border-blue-500/20" :
                              isMgmt ? "bg-amber-500/5 text-amber-500 border-amber-500/20" :
                              "bg-purple-500/5 text-purple-400 border-purple-500/20"
                            )}
                          >
                            {routeStr}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between gap-2">
                  <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                    <Sliders className="h-2.5 w-2.5 text-primary" /> Workspace Scoped
                  </span>

                  {!template.isSystem && (
                    <button
                      onClick={() => handleDeleteCustomRole(template.id, template.name)}
                      className="h-7 px-2.5 rounded-md bg-background border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors text-[10px] font-bold flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════════════
          OVERHAULED HYPER-VISIBLE PREMIUM GLASSMORPHIC MINTING DIALOG
          ═════════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isRoleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsRoleModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              className="relative w-full max-w-3xl bg-background border-2 border-primary/40 rounded-2xl shadow-[0_0_50px_-12px_rgba(var(--primary),0.3)] z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Premium Header Bar with distinct vibrant contrast */}
              <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-primary/30 via-background/90 to-background/90 border-b border-primary/30 backdrop-blur-md">
                <div>
                  <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest block mb-0.5 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Role Setup Guide
                  </span>
                  <h2 className="font-extrabold text-base text-foreground tracking-tight">Create Custom Role & Choose Permissions</h2>
                </div>
                <button
                  onClick={() => setIsRoleModalOpen(false)}
                  className="h-8 w-8 rounded-xl bg-background/80 border-2 border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-xs"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCustomRoleSubmit} className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
                {/* 1. Highly visible Input structures */}
                <div className="grid sm:grid-cols-2 gap-4 bg-accent/20 p-4 rounded-xl border border-border/40">
                  <div>
                    <label className="text-xs font-extrabold text-foreground uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-primary" /> Role Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={newRoleForm.name}
                      onChange={e => setNewRoleForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Finance Auditor, Door Security"
                      className="w-full bg-background/95 border-2 border-border/80 rounded-xl py-2.5 px-3.5 text-xs outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 font-bold shadow-inner transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-foreground uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                      <Sliders className="h-3.5 w-3.5 text-muted-foreground" /> Description
                    </label>
                    <input
                      type="text"
                      value={newRoleForm.desc}
                      onChange={e => setNewRoleForm(f => ({ ...f, desc: e.target.value }))}
                      placeholder="e.g. Can manage check-ins and view analytics."
                      className="w-full bg-background/95 border-2 border-border/80 rounded-xl py-2.5 px-3.5 text-xs outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 font-bold shadow-inner transition-all"
                    />
                  </div>
                </div>

                {/* Root application strip */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-primary/10 rounded-xl border-2 border-primary/30 mb-4 backdrop-blur-sm shadow-xs">
                    <div>
                      <span className="text-xs font-black text-foreground block tracking-tight">
                        Full Dashboard Access
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium block mt-0.5">
                        Choose which sections and screens users with this role can view.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={toggleGlobalAll}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-mono font-extrabold transition-all shrink-0 border-2 flex items-center gap-2",
                        isAllGlobalSelected 
                          ? "bg-primary text-primary-foreground border-primary shadow-glow-xs" 
                          : "bg-background text-foreground hover:bg-accent border-border"
                      )}
                    >
                      <div className={cn("h-4 w-4 rounded-md border-2 grid place-items-center shrink-0 transition-colors", isAllGlobalSelected ? "bg-white text-primary border-white" : "border-muted-foreground/40")}>
                        {isAllGlobalSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <span>{isAllGlobalSelected ? "All Selected" : "Select All Features"}</span>
                    </button>
                  </div>

                  {/* Sectional Views Grid */}
                  <div className="space-y-4">
                    {PERMISSION_SECTIONS.map(sec => {
                      const isSecSelected = isSectionSelected(sec.key);
                      const secViewsCount = sec.views.length;
                      const selectedSecViewsCount = sec.views.filter(v => newRoleForm.selectedViews.includes(v.route)).length;
                      const isAdminSec = sec.key === "administration";

                      return (
                        <div 
                          key={sec.key} 
                          className={cn(
                            "p-4 rounded-xl space-y-3.5 transition-all relative overflow-hidden",
                            isAdminSec 
                              ? "bg-emerald-500/10 border-2 border-emerald-500/30" 
                              : "bg-accent/30 border border-border/60"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/60 relative z-10">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-extrabold text-foreground tracking-tight">{sec.title}</h4>
                                {isAdminSec && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black font-mono bg-emerald-500 text-background tracking-wider">
                                    User Access Scope
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground font-medium leading-tight mt-1">{sec.desc}</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleSectionAll(sec.key)}
                              className="px-3 py-1.5 rounded-xl bg-background/90 border-2 border-border text-xs font-extrabold text-foreground hover:bg-accent transition-all flex items-center gap-2 shrink-0 shadow-xs"
                            >
                              <div className={cn("h-3.5 w-3.5 rounded border-2 grid place-items-center shrink-0 transition-colors", isSecSelected ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground/40")}>
                                {isSecSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                              </div>
                              <span className="font-mono">Section ({selectedSecViewsCount}/{secViewsCount})</span>
                            </button>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-3 relative z-10">
                            {sec.views.map(viewDef => {
                              const isChecked = newRoleForm.selectedViews.includes(viewDef.route);
                              const isUsersTarget = viewDef.route === "Staff Users";

                              return (
                                <button
                                  key={viewDef.route}
                                  type="button"
                                  onClick={() => toggleIndividualView(viewDef.route)}
                                  className={cn(
                                    "p-3.5 rounded-xl border-2 text-left transition-all flex items-start gap-3 group relative",
                                    isChecked 
                                      ? isUsersTarget 
                                        ? "bg-gradient-to-r from-emerald-500/30 via-emerald-500/10 to-transparent border-emerald-500/60 shadow-xs" 
                                        : "bg-gradient-to-r from-primary/25 via-primary/10 to-transparent border-primary/60 shadow-xs" 
                                      : "bg-background/80 border-border/80 hover:border-border text-muted-foreground"
                                  )}
                                >
                                  <div className={cn("h-4.5 w-4.5 rounded-md border-2 grid place-items-center shrink-0 mt-0.5 transition-colors", isChecked ? isUsersTarget ? "bg-emerald-500 border-emerald-500 text-background" : "bg-primary border-primary text-background" : "border-border bg-background/95")}>
                                    {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className={cn("text-xs font-extrabold leading-tight truncate", isChecked ? "text-foreground" : "text-foreground/80")}>
                                        {viewDef.route}
                                      </span>
                                      <span className="text-[9px] text-muted-foreground font-mono font-bold truncate">
                                        ({viewDef.pathString})
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground font-medium line-clamp-1 mt-1 leading-tight">
                                      {viewDef.desc}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRoleModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-extrabold text-muted-foreground hover:text-foreground transition-all"
                  >
                    Cancel
                  </button>
                  <GradientButton type="submit" size="sm" className="h-10 px-6 font-extrabold text-xs shadow-md">
                    Save Custom Role
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
