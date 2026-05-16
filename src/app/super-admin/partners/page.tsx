"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, UserPlus, Search, Mail, Phone, MapPin,
  ChevronDown, X, Check, Activity, ShieldCheck,
  Globe, Sparkles, Building2, Sliders, Layers, Tag,
  Hotel, Plane, Truck, Star, Briefcase
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { StatCard } from "@/components/ui-ext/StatCard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type PartnerCategory = "Hotel" | "Travel" | "Vendor";

interface PartnerAccount {
  id: string;
  name: string;
  companyName: string;
  category: PartnerCategory;
  email: string;
  phone: string;
  region: string;
  rating: number;
  avatar: string;
  status: "Active" | "Pending Approval" | "Suspended";
  onboardedDate: string;
}

const INITIAL_PARTNERS: PartnerAccount[] = [
  {
    id: "p-1",
    name: "Vikram Malhotra",
    companyName: "Grand Marquee Hotels",
    category: "Hotel",
    email: "vikram@grandmarquee.com",
    phone: "+91 98765 43210",
    region: "Mumbai, India",
    rating: 4.8,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=60",
    status: "Active",
    onboardedDate: "Jan 12, 2026"
  },
  {
    id: "p-2",
    name: "Sarah Jenkins",
    companyName: "SkyHigh Travels",
    category: "Travel",
    email: "sjenkins@skyhigh.io",
    phone: "+44 20 7946 0123",
    region: "London, UK",
    rating: 4.5,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=60",
    status: "Active",
    onboardedDate: "Feb 05, 2026"
  },
  {
    id: "p-3",
    name: "Rajesh Kumar",
    companyName: "Royal Decor & Staging",
    category: "Vendor",
    email: "rkumar@royaldecor.in",
    phone: "+91 91234 56789",
    region: "Delhi, India",
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60",
    status: "Active",
    onboardedDate: "Mar 20, 2026"
  },
  {
    id: "p-4",
    name: "Elena Rossi",
    companyName: "LuxStay International",
    category: "Hotel",
    email: "erossi@luxstay.it",
    phone: "+39 02 1234 5678",
    region: "Milan, Italy",
    rating: 4.7,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=60",
    status: "Pending Approval",
    onboardedDate: "May 10, 2026"
  }
];

import { Suspense } from "react";

function PartnerManagementContent() {
  const [partners, setPartners] = useState<PartnerAccount[]>(INITIAL_PARTNERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<PartnerCategory | "All">("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category");
    if (category && ["Hotel", "Travel", "Vendor"].includes(category)) {
      setCategoryFilter(category as PartnerCategory);
    }
  }, [searchParams]);

  const [form, setForm] = useState({
    name: "",
    companyName: "",
    category: "Vendor" as PartnerCategory,
    email: "",
    phone: "",
    region: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.companyName.trim() || !form.email.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }

    const newPartner: PartnerAccount = {
      id: `p-${Date.now()}`,
      ...form,
      rating: 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(form.companyName)}`,
      status: "Pending Approval",
      onboardedDate: "Just Now"
    };

    setPartners(prev => [newPartner, ...prev]);
    toast.success(`${form.companyName} onboarded successfully! Review pending.`);
    setIsModalOpen(false);
    setForm({ name: "", companyName: "", category: "Vendor", email: "", phone: "", region: "" });
  };

  const filteredPartners = useMemo(() => {
    return partners.filter(p => {
      const matchSearch = !searchQuery || [p.name, p.companyName, p.email, p.region].some(v => v.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat = categoryFilter === "All" || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [partners, searchQuery, categoryFilter]);

  const stats = useMemo(() => {
    const hotels = partners.filter(p => p.category === "Hotel").length;
    const travel = partners.filter(p => p.category === "Travel").length;
    const vendors = partners.filter(p => p.category === "Vendor").length;
    return { hotels, travel, vendors };
  }, [partners]);

  return (
    <DashboardShell
      title="Global Partner Network"
      subtitle="Onboard and manage global service providers including Hotels, Travel Agencies, and Infrastructure Vendors."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Globe} label="Total Partners" value={partners.length} delta="Global Network" />
        <StatCard icon={Hotel} label="Hotels" value={stats.hotels} delta="Accommodation" />
        <StatCard icon={Plane} label="Travel Partners" value={stats.travel} delta="Transit & Logistics" />
        <StatCard icon={Truck} label="Vendors" value={stats.vendors} delta="Booth Infrastructure" />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 font-mono">
                NETWORK DIRECTORY
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">Authorized Partners</span>
            </div>
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <Briefcase className="h-4.5 w-4.5 text-primary" /> Active Service Partners
            </h2>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-accent/40 border border-border/60">
              {["All", "Hotel", "Travel", "Vendor"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat as any)}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", categoryFilter === cat ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground")}
                >
                  {cat}s
                </button>
              ))}
            </div>

            <GradientButton onClick={() => setIsModalOpen(true)} size="sm" className="h-9 px-4 shrink-0 shadow-sm">
              <UserPlus className="h-4 w-4 mr-1.5" /> Onboard New Partner
            </GradientButton>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-background border border-border flex items-center gap-2 max-w-md">
          <Search className="h-4 w-4 text-muted-foreground shrink-0 ml-1" />
          <input 
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search partners by name, company, or region..."
            className="w-full bg-transparent text-xs font-medium text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>

        <div className="grid gap-3">
          <AnimatePresence mode="popLayout">
            {filteredPartners.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 text-center glass rounded-xl border border-dashed border-border">
                <p className="text-xs font-bold text-foreground">No partners match your criteria.</p>
              </motion.div>
            ) : (
              filteredPartners.map(p => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="p-4 rounded-xl glass border border-border/60 hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group relative overflow-hidden"
                >
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-border group-hover:bg-primary transition-colors rounded-r" />

                  <div className="flex items-center gap-4 min-w-0 flex-1 pl-1">
                    <img src={p.avatar} alt="" className="h-12 w-12 rounded-2xl object-cover ring-2 ring-primary/20 shrink-0 bg-background" />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-black text-foreground truncate tracking-tight">{p.companyName}</h4>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                          p.category === "Hotel" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                          p.category === "Travel" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                          "bg-purple-500/10 text-purple-500 border-purple-500/20"
                        )}>
                          {p.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground font-bold">
                        <span className="flex items-center gap-1">👤 {p.name}</span>
                        <span className="text-border">·</span>
                        <span className="flex items-center gap-1">📍 {p.region}</span>
                        <span className="text-border">·</span>
                        <span className="flex items-center gap-1 text-amber-500"><Star className="h-2.5 w-2.5 fill-current" /> {p.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Primary Contact</span>
                      <p className="text-[10px] font-bold text-foreground mt-0.5">{p.email}</p>
                    </div>

                    <div className="flex flex-col items-end justify-center shrink-0 min-w-[100px]">
                      <span className={cn(
                        "px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-widest block",
                        p.status === "Active" ? "bg-emerald-500/10 text-emerald-400" :
                        p.status === "Pending Approval" ? "bg-amber-500/10 text-amber-500" :
                        "bg-rose-500/10 text-rose-500"
                      )}>
                        {p.status}
                      </span>
                      <span className="text-[8px] text-muted-foreground font-mono mt-1">Since {p.onboardedDate}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="relative w-full max-w-xl bg-background border-2 border-primary/40 rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 bg-accent/5 border-b border-border">
                <div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-0.5 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Partner Onboarding
                  </span>
                  <h2 className="font-black text-lg text-foreground tracking-tight">Onboard New Global Partner</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="h-8 w-8 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><X className="h-4 w-4" /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Company Name *</label>
                    <input required type="text" value={form.companyName} onChange={e => setForm(f => ({...f, companyName: e.target.value}))} placeholder="e.g. Ritz Carlton" className="w-full bg-accent/20 border border-border rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-primary transition-all shadow-inner" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Partner Category *</label>
                    <select required value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value as any}))} className="w-full bg-accent/20 border border-border rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-primary transition-all cursor-pointer">
                      <option value="Hotel">Hotel / Accommodation</option>
                      <option value="Travel">Travel & Transit</option>
                      <option value="Vendor">Stall & Service Vendor</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Primary Contact Name *</label>
                    <input required type="text" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. John Doe" className="w-full bg-accent/20 border border-border rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-primary transition-all shadow-inner" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Email Address *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="partner@example.com" className="w-full bg-accent/20 border border-border rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-primary transition-all shadow-inner" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Phone Number</label>
                    <input type="text" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+1 234 567 890" className="w-full bg-accent/20 border border-border rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-primary transition-all shadow-inner" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Operating Region</label>
                    <input type="text" value={form.region} onChange={e => setForm(f => ({...f, region: e.target.value}))} placeholder="e.g. Dubai, UAE" className="w-full bg-accent/20 border border-border rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-primary transition-all shadow-inner" />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">Cancel</button>
                  <GradientButton type="submit" className="h-11 px-8 font-black text-xs uppercase tracking-widest shadow-glow">Onboard Partner</GradientButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}

export default function PartnerManagementWorkspace() {
  return (
    <Suspense fallback={<DashboardShell title="Global Partner Network" subtitle="Loading partners..."><div className="h-96" /></DashboardShell>}>
      <PartnerManagementContent />
    </Suspense>
  );
}
