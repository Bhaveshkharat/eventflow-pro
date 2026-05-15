"use client";

import React, { useState, useMemo } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { Search, Plus, X, Users, Building2, Globe, Mail, Calendar, TrendingUp, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { superAdminOrganizers, Organizer } from "@/data/mock";
import { cn } from "@/lib/utils";

export default function OrganizersDirectory() {
  const [organizers, setOrganizers] = useState<Organizer[]>(superAdminOrganizers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null);

  const [newOrganizerForm, setNewOrganizerForm] = useState({
    name: "",
    email: "",
    status: "Trial" as "Pro" | "Enterprise" | "Trial"
  });

  const filteredOrganizers = useMemo(() => {
    return organizers.filter(o => 
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [organizers, searchQuery]);

  const handleCreateOrganizer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrganizerForm.name.trim() || !newOrganizerForm.email.trim()) {
      toast.error("Please provide both name and email.");
      return;
    }

    const newOrg: Organizer = {
      id: `org-${Date.now()}`,
      name: newOrganizerForm.name.trim(),
      email: newOrganizerForm.email.trim(),
      status: newOrganizerForm.status,
      events: 0,
      revenue: 0,
      logo: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(newOrganizerForm.name)}`,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    // Update local state
    setOrganizers(prev => [newOrg, ...prev]);
    // Also push to shared mock array so it's globally visible across navigation
    superAdminOrganizers.unshift(newOrg);

    toast.success(`Organizer "${newOrg.name}" successfully provisioned.`);
    setNewOrganizerForm({ name: "", email: "", status: "Trial" });
    setIsCreateModalOpen(false);
  };

  return (
    <DashboardShell
      title="Organizers Directory"
      subtitle="Manage your platform's event organizers, review their generated revenue, and assign subscription tiers."
      backLink="/super-admin"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search organizers by name or email..."
            className="w-full bg-background border border-border rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary transition-all"
          />
        </div>
        <GradientButton onClick={() => setIsCreateModalOpen(true)} className="shrink-0 h-10">
          <Plus className="h-4 w-4 mr-2" /> Provision Organizer
        </GradientButton>
      </div>

      <div className="grid gap-4">
        {filteredOrganizers.length === 0 ? (
          <div className="text-center py-12 glass rounded-2xl border border-dashed border-border">
            <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm font-bold text-foreground">No organizers found.</p>
          </div>
        ) : (
          filteredOrganizers.map(org => (
            <GlassCard key={org.id} hover={true} className="p-4 cursor-pointer transition-all border-border/40 hover:border-primary/40 group relative overflow-hidden">
               <div onClick={() => setSelectedOrganizer(org)} className="flex flex-col md:flex-row md:items-center gap-4">
                  <img src={org.logo} alt={org.name} className="h-12 w-12 rounded-xl bg-background border border-border group-hover:border-primary/50 transition-colors" />
                  
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">{org.name}</h3>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                          org.status === "Enterprise" ? "bg-primary text-white" : 
                          org.status === "Pro" ? "bg-amber-500/10 text-amber-500" : "bg-accent text-muted-foreground"
                        )}>
                          {org.status}
                        </span>
                     </div>
                     <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {org.email}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Joined {org.joinedDate}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 md:gap-12 md:pl-8 md:border-l border-border/50 shrink-0">
                     <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-0.5">Events Hosted</span>
                        <span className="text-sm font-black text-foreground flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-blue-500" /> {org.events}</span>
                     </div>
                     <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-0.5">Total Revenue</span>
                        <span className="text-sm font-black text-emerald-500 flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> ${org.revenue.toLocaleString()}</span>
                     </div>
                  </div>
               </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-background border-2 border-primary/40 rounded-2xl shadow-2xl z-10 flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-border/40">
                 <div>
                    <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                       <Plus className="h-4 w-4 text-primary" /> Provision Organizer
                    </h2>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Create a new organizational tenant on the platform.</p>
                 </div>
                 <button onClick={() => setIsCreateModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                 </button>
              </div>

              <form onSubmit={handleCreateOrganizer} className="p-5 space-y-4">
                 <div className="p-4 rounded-xl bg-accent/20 border border-border/40 space-y-3">
                    <div>
                       <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Company / Brand Name *</label>
                       <input
                          required
                          value={newOrganizerForm.name}
                          onChange={(e) => setNewOrganizerForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-background border-2 border-border/80 rounded-xl py-2 px-3 text-xs outline-none focus:border-primary font-bold text-foreground transition-all"
                          placeholder="e.g. Acme Exhibits"
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Owner Email *</label>
                       <input
                          required
                          type="email"
                          value={newOrganizerForm.email}
                          onChange={(e) => setNewOrganizerForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-background border-2 border-border/80 rounded-xl py-2 px-3 text-xs outline-none focus:border-primary font-bold text-foreground transition-all"
                          placeholder="admin@acmeexhibits.com"
                       />
                    </div>
                 </div>

                 <div className="p-4 rounded-xl bg-accent/30 border border-border/60">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Subscription Tier</label>
                    <select
                       value={newOrganizerForm.status}
                       onChange={(e) => setNewOrganizerForm(prev => ({ ...prev, status: e.target.value as any }))}
                       className="w-full bg-background border-2 border-border/80 rounded-xl py-2 px-3 text-xs outline-none focus:border-primary font-bold text-foreground cursor-pointer transition-all"
                    >
                       <option value="Trial">Trial (14 Days Free)</option>
                       <option value="Pro">Pro ($49/mo)</option>
                       <option value="Enterprise">Enterprise (Custom)</option>
                    </select>
                 </div>

                 <div className="pt-3 border-t border-border/60 flex justify-end gap-2">
                    <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground">
                       Cancel
                    </button>
                    <GradientButton type="submit" size="sm" className="h-9 px-5">
                       Create Tenant
                    </GradientButton>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAILS MODAL */}
      <AnimatePresence>
        {selectedOrganizer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedOrganizer(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl z-10 flex flex-col"
            >
              <div className="p-6 bg-accent/20 border-b border-border flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img src={selectedOrganizer.logo} alt="" className="h-16 w-16 rounded-2xl bg-background ring-1 ring-border shadow-sm" />
                  <div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-primary text-white mb-1 inline-block">
                      {selectedOrganizer.status} Tenant
                    </span>
                    <h2 className="text-xl font-black text-foreground tracking-tight leading-none">{selectedOrganizer.name}</h2>
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 font-medium">
                      <Mail className="h-3.5 w-3.5" /> {selectedOrganizer.email}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedOrganizer(null)} className="h-8 w-8 rounded-xl glass grid place-items-center text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl glass border border-border/50 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Total Hosted Events</span>
                    <span className="text-2xl font-black text-foreground">{selectedOrganizer.events}</span>
                  </div>
                  <div className="p-4 rounded-xl glass border border-border/50 text-center bg-emerald-500/5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 block mb-1">Platform Revenue</span>
                    <span className="text-2xl font-black text-emerald-500">${selectedOrganizer.revenue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" /> Tenant Configuration
                  </h3>
                  <div className="p-4 rounded-xl bg-accent/10 border border-border/40 text-xs text-muted-foreground leading-relaxed">
                    This organizer was provisioned on <strong className="text-foreground">{selectedOrganizer.joinedDate}</strong>. 
                    They are currently on the <strong className="text-primary">{selectedOrganizer.status}</strong> tier. 
                    API access is fully granted and their payment gateways are linked properly.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}
