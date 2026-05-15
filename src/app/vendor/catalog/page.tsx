"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Edit3, Save, X, 
  DollarSign, Package, Calendar, 
  Layers, Tag, Info, CheckCircle2,
  AlertCircle, ChevronRight, Wrench,
  Zap, Clock
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  VendorServiceOffer, 
  getPersistedVendorServices, 
  savePersistedVendorServices 
} from "@/lib/servicesStore";

export default function VendorCatalog() {
  const [services, setServices] = useState<VendorServiceOffer[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setServices(getPersistedVendorServices());
  }, []);

  const [form, setForm] = useState<Partial<VendorServiceOffer>>({
    name: "",
    category: "Technical",
    pricingType: "Per Day",
    basePrice: 0,
    currency: "INR",
    description: "",
    status: "Active"
  });

  const handleSave = () => {
    if (!form.name || !form.basePrice || !form.description) {
      toast.error("Please fill in all required operational parameters.");
      return;
    }

    let updated: VendorServiceOffer[];
    if (editingId) {
      updated = services.map(s => s.id === editingId ? { ...s, ...form } as VendorServiceOffer : s);
      toast.success("Service offering updated in global catalog.");
    } else {
      const newSrv: VendorServiceOffer = {
        ...form,
        id: `vs-${Date.now()}`,
      } as VendorServiceOffer;
      updated = [newSrv, ...services];
      toast.success("New service capability indexed successfully.");
    }

    setServices(updated);
    savePersistedVendorServices(updated);
    setIsAdding(false);
    setEditingId(null);
    setForm({ name: "", category: "Technical", pricingType: "Per Day", basePrice: 0, currency: "INR", description: "", status: "Active" });
  };

  const startEdit = (srv: VendorServiceOffer) => {
    setForm(srv);
    setEditingId(srv.id);
    setIsAdding(true);
  };

  const deleteService = (id: string) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    savePersistedVendorServices(updated);
    toast.info("Service capability removed from active directory.");
  };

  return (
    <DashboardShell
      title="Service Catalog"
      subtitle="Define your commercial service offerings, configure tiered pricing structures, and manage equipment availability."
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT: Service List */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <Layers className="h-4 w-4" /> Active Offerings Index
            </h2>
            <GradientButton onClick={() => setIsAdding(true)} size="sm" className="h-8 text-[10px] px-3">
              <Plus className="h-4 w-4 mr-1.5" /> Add New Capability
            </GradientButton>
          </div>

          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {services.map((srv) => (
                <motion.div
                  key={srv.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <GlassCard className="p-5 border-border/40 hover:border-primary/30 transition-all group overflow-hidden" hover={false}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center shrink-0 border border-primary/20 shadow-inner group-hover:scale-110 transition-transform">
                          {srv.category === "Electrical" && <Zap className="h-6 w-6" />}
                          {srv.category === "Furniture" && <Package className="h-6 w-6" />}
                          {srv.category === "Technical" && <Wrench className="h-6 w-6" />}
                          {srv.category === "Network" && <Layers className="h-6 w-6" />}
                          {srv.category === "Branding" && <Tag className="h-6 w-6" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors tracking-tight">{srv.name}</h3>
                            <span className={cn(
                              "text-[9px] font-bold px-1.5 py-0.2 rounded font-mono uppercase border shrink-0",
                              srv.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-accent text-muted-foreground border-border"
                            )}>
                              {srv.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mb-3 font-medium opacity-80">
                            {srv.description}
                          </p>
                          <div className="flex items-center gap-4 text-[10px]">
                            <div className="flex items-center gap-1.5 text-muted-foreground font-bold uppercase tracking-wider">
                              <DollarSign className="h-3 w-3 text-emerald-500" />
                              <span className="text-foreground">{srv.currency} {srv.basePrice}</span>
                              <span className="text-[9px] opacity-60">/ {srv.pricingType} (Base)</span>
                            </div>
                            <div className="h-1 w-1 rounded-full bg-border" />
                            <div className="flex items-center gap-1.5 text-muted-foreground font-bold uppercase tracking-wider">
                              <Tag className="h-3 w-3 text-primary" />
                              <span className="text-foreground">{srv.category}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 border-l border-border/40 pl-4">
                        <button 
                          onClick={() => startEdit(srv)}
                          className="h-8 w-8 rounded-xl bg-accent/30 border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-all hover:bg-primary/5 shadow-sm"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => deleteService(srv.id)}
                          className="h-8 w-8 rounded-xl bg-accent/30 border border-border flex items-center justify-center text-muted-foreground hover:text-destructive transition-all hover:bg-destructive/5 shadow-sm"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>

            {services.length === 0 && (
              <div className="p-16 text-center glass rounded-2xl border border-dashed border-border/60">
                <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-xs font-bold text-foreground tracking-tight">Your service catalog is currently offline.</p>
                <p className="text-[10px] text-muted-foreground mt-1 max-w-[200px] mx-auto leading-relaxed">
                  Start by adding your first service capability using the 'Add New' button above.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Add/Edit Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full lg:w-[400px] shrink-0"
            >
              <GlassCard className="p-6 border-primary/30 sticky top-8 shadow-glow-sm" hover={false}>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
                  <div>
                    <h3 className="font-extrabold text-sm text-foreground tracking-tight flex items-center gap-2">
                      {editingId ? <Edit3 className="h-4 w-4 text-primary" /> : <Plus className="h-4 w-4 text-primary" />}
                      {editingId ? "Update Capability" : "Provision New Service"}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Index your operational hardware & labor.</p>
                  </div>
                  <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Service Identifier Name</label>
                    <input 
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. 100Mbps Dedicated Fiber Drop"
                      className="w-full bg-accent/20 border-2 border-border/80 rounded-xl py-2.5 px-4 text-xs font-bold text-foreground outline-none focus:border-primary transition-all shadow-inner"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Operational Scope</label>
                      <select 
                        value={form.category}
                        onChange={e => setForm(f => ({ ...f, category: e.target.value as any }))}
                        className="w-full bg-accent/20 border-2 border-border/80 rounded-xl py-2.5 px-3 text-xs font-bold text-foreground outline-none focus:border-primary transition-all shadow-inner cursor-pointer"
                      >
                        <option value="Technical">Technical</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Network">Network</option>
                        <option value="Branding">Branding</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Status</label>
                      <select 
                        value={form.status}
                        onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
                        className="w-full bg-accent/20 border-2 border-border/80 rounded-xl py-2.5 px-3 text-xs font-bold text-foreground outline-none focus:border-primary transition-all shadow-inner cursor-pointer"
                      >
                        <option value="Active">Active</option>
                        <option value="Draft">Draft / Offline</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Pricing Architecture</label>
                    <div className="flex gap-2 p-1 bg-accent/20 rounded-xl border border-border/40">
                      {(["Per Day", "Per Event", "Package"] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => setForm(f => ({ ...f, pricingType: type }))}
                          className={cn(
                            "flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all",
                            form.pricingType === type ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Base Cost (Vendor Get)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-500" />
                        <input 
                          type="number"
                          value={form.basePrice}
                          onChange={e => setForm(f => ({ ...f, basePrice: Number(e.target.value) }))}
                          className="w-full bg-accent/20 border-2 border-border/80 rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold text-foreground outline-none focus:border-primary transition-all shadow-inner"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Currency Unit</label>
                      <select 
                        value={form.currency}
                        onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                        className="w-full bg-accent/20 border-2 border-border/80 rounded-xl py-2.5 px-3 text-xs font-bold text-foreground outline-none focus:border-primary transition-all shadow-inner cursor-pointer"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                    <p className="text-[9px] font-bold text-primary uppercase tracking-wider">Commission Insight</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      The Organizer's commission (e.g. 13%) will be added to this price when shown to Exhibitors.
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Service Breakdown / Inclusion Specs</label>
                    <textarea 
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      rows={4}
                      placeholder="Detail exactly what this service provides to the client stall..."
                      className="w-full bg-accent/20 border-2 border-border/80 rounded-xl py-2.5 px-4 text-xs font-medium text-foreground outline-none focus:border-primary transition-all shadow-inner resize-none font-sans"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      onClick={() => { setIsAdding(false); setEditingId(null); }}
                      className="flex-1 px-4 py-2.5 rounded-xl border-2 border-border text-xs font-bold text-muted-foreground hover:text-foreground transition-all"
                    >
                      Cancel
                    </button>
                    <GradientButton 
                      onClick={handleSave}
                      className="flex-1 h-10 text-xs font-black"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingId ? "Update Capability" : "Index Service"}
                    </GradientButton>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Sidebar for Vendor */}
        {!isAdding && (
          <div className="w-full lg:w-72 space-y-6">
            <GlassCard className="p-5 border-emerald-500/20 bg-emerald-500/[0.02]" hover={false}>
               <h3 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                 <CheckCircle2 className="h-4 w-4" /> Provider Best Practices
               </h3>
               <ul className="space-y-3">
                 <li className="flex gap-2 text-[11px] leading-tight text-muted-foreground">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
                   <span>Ensure your <span className="font-bold text-foreground">pricing type</span> correctly matches your inventory turnaround.</span>
                 </li>
                 <li className="flex gap-2 text-[11px] leading-tight text-muted-foreground">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
                   <span>Clear <span className="font-bold text-foreground">descriptions</span> reduce triage friction for Organizers.</span>
                 </li>
                 <li className="flex gap-2 text-[11px] leading-tight text-muted-foreground">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
                   <span>Categorize accurately to show up in the correct <span className="font-bold text-foreground">Exhibitor Store</span> tabs.</span>
                 </li>
               </ul>
            </GlassCard>

            <div className="p-5 rounded-2xl bg-accent/20 border border-border/40">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Market Demand</h3>
                 <Clock className="h-3.5 w-3.5 text-muted-foreground" />
               </div>
               <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-[10px] font-bold mb-1.5">
                       <span className="text-foreground">Technical Crew</span>
                       <span className="text-primary">High Demand</span>
                    </div>
                    <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
                       <div className="h-full w-[85%] bg-primary shadow-glow-sm" />
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-[10px] font-bold mb-1.5">
                       <span className="text-foreground">Furniture Rentals</span>
                       <span className="text-emerald-500">Normal</span>
                    </div>
                    <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
                       <div className="h-full w-[45%] bg-emerald-500 shadow-glow-sm" />
                    </div>
                 </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
