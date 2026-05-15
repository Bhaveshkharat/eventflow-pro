"use client";
import React, { useState, useEffect } from "react";
import { 
  Hotel, Bed, DollarSign, Calendar, MessageSquare, 
  ChevronRight, CheckCircle2, Clock, XCircle, Plus, 
  X, Check, Image as ImageIcon, MapPin, Tag, Info, Star, Zap,
  Upload, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { StatCard } from "@/components/ui-ext/StatCard";
import { inquiries } from "@/data/mock";
import { getPersistedServices, addServiceToStorage, CompanionService } from "@/lib/servicesStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function HotelAgentDashboard() {
  const [listings, setListings] = useState<CompanionService[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // State for the interactive form
  const [newProperty, setNewProperty] = useState({
    name: "",
    price: "",
    description: "",
    distance: "",
    image: "", // base64
    images: [] as string[], // array of base64
    amenities: [] as string[],
    tags: [] as string[]
  });

  // Temporary input states for chips
  const [tempAmenity, setTempAmenity] = useState("");
  const [tempTag, setTempTag] = useState("");

  useEffect(() => {
    const all = getPersistedServices();
    setListings(all.filter(s => s.category === "Hotel"));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "main" | "gallery") => {
    const files = e.target.files;
    if (!files) return;

    const processFile = (file: File): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    };

    if (type === "main") {
      processFile(files[0]).then(res => setNewProperty(p => ({ ...p, image: res })));
    } else {
      Promise.all(Array.from(files).map(processFile)).then(results => {
        setNewProperty(p => ({ ...p, images: [...p.images, ...results] }));
      });
    }
  };

  const addChip = (type: "amenities" | "tags", value: string) => {
    if (!value.trim()) return;
    if (newProperty[type].includes(value.trim())) {
      toast.error("Already added.");
      return;
    }
    setNewProperty(p => ({ ...p, [type]: [...p[type], value.trim()] }));
    if (type === "amenities") setTempAmenity("");
    else setTempTag("");
  };

  const removeChip = (type: "amenities" | "tags", value: string) => {
    setNewProperty(p => ({ ...p, [type]: p[type].filter(v => v !== value) }));
  };

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProperty.name || !newProperty.price || !newProperty.image) {
      toast.error("Please provide a name, price, and primary image.");
      return;
    }

    const generated: CompanionService = {
      id: `h-${Date.now()}`,
      category: "Hotel",
      name: newProperty.name,
      provider: "Grand Marquise Hospitality",
      price: `$${newProperty.price}/night`,
      rating: 5.0,
      image: newProperty.image,
      images: newProperty.images,
      description: newProperty.description,
      distance: newProperty.distance || "Walking distance to venue",
      amenities: newProperty.amenities,
      tags: newProperty.tags
    };

    const updated = addServiceToStorage(generated);
    setListings(updated.filter(s => s.category === "Hotel"));
    setIsAddModalOpen(false);
    setNewProperty({ name: "", price: "", description: "", distance: "", image: "", images: [], amenities: [], tags: [] });
    toast.success("Property published with custom assets!");
  };

  const hotelInquiries = inquiries.filter(i => i.type === "Hotel");

  return (
    <DashboardShell title="Hotel Partner Hub" subtitle="Manage listings, room inventory and guest inquiries.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Hotel} label="Properties" value={listings.length} delta="0" />
        <StatCard icon={Bed} label="Booked Rooms" value={284} delta="+14" />
        <StatCard icon={MessageSquare} label="New Inquiries" value={12} delta="+3" />
        <StatCard icon={DollarSign} label="Total Earnings" value={18400} prefix="$" delta="+8%" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-1">
             <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">My Listings</h2>
             <GradientButton 
               size="sm" 
               className="h-9 text-[10px] font-bold uppercase tracking-wider"
               onClick={() => setIsAddModalOpen(true)}
             >
               <Plus className="h-4 w-4 mr-2" /> Add New Property
             </GradientButton>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             {listings.map(h => (
               <GlassCard key={h.id} className="p-0 overflow-hidden group border-border/40">
                  <div className="h-44 relative">
                     <img src={h.image} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                     <div className="absolute top-3 right-3 px-2 py-1 rounded-md glass-strong text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {h.rating}
                     </div>
                  </div>
                  <div className="p-5">
                     <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{h.name}</h3>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 flex items-center gap-1">
                       <MapPin className="h-2.5 w-2.5" /> {h.distance}
                     </p>
                     <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{h.price}</span>
                        <div className="flex gap-2">
                           <button className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors">Edit</button>
                           <span className="text-muted-foreground/30">|</span>
                           <button className="text-[10px] font-bold text-muted-foreground hover:text-rose-500 transition-colors">Archive</button>
                        </div>
                     </div>
                  </div>
               </GlassCard>
             ))}
          </div>

          <div className="pt-8 space-y-6">
             <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent Inquiries</h2>
                <button className="text-[10px] font-bold text-primary">View Inbox</button>
             </div>
             <div className="space-y-3">
                {hotelInquiries.map(i => (
                   <GlassCard key={i.id} className="p-4 flex items-center justify-between gap-4 border-border/40">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-full glass grid place-items-center border-primary/20"><MessageSquare className="h-4 w-4 text-primary" /></div>
                         <div>
                            <p className="text-xs font-bold">{i.user}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{i.item}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="hidden md:block text-right">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Requested</p>
                            <p className="text-xs font-medium">{i.date}</p>
                         </div>
                         {i.status === "Pending" ? (
                            <div className="flex gap-2">
                               <button className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 grid place-items-center hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"><CheckCircle2 className="h-4 w-4" /></button>
                               <button className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-500 grid place-items-center hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"><XCircle className="h-4 w-4" /></button>
                            </div>
                         ) : (
                            <div className={"flex items-center gap-1.5 text-[10px] font-bold " + (i.status === "Confirmed" ? "text-emerald-500" : "text-rose-500")}>
                               {i.status === "Confirmed" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                               {i.status}
                            </div>
                         )}
                      </div>
                   </GlassCard>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <GlassCard className="p-6 bg-primary/[0.03] border-primary/20" hover={false}>
              <h3 className="font-bold text-sm flex items-center gap-2 mb-4">
                 <Calendar className="h-4 w-4 text-primary" /> High Demand Alert
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                 <span className="font-bold text-foreground">TechSummit 2026</span> surge detected.
              </p>
              <GradientButton className="w-full mt-6 h-10 text-[10px] font-bold uppercase tracking-wider">Manage Inventory</GradientButton>
           </GlassCard>
        </div>
      </div>

      {/* ── ADD PROPERTY MODAL ── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-xl bg-background border border-border rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-accent/5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Hotel className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-foreground tracking-tight">New Property</h2>
                    <p className="text-[10px] text-muted-foreground">Fill in the details to publish your listing.</p>
                  </div>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center text-muted-foreground transition-all">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddProperty} className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
                {/* Identity & Pricing */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">Property Name *</label>
                      <input required type="text" value={newProperty.name} onChange={e => setNewProperty(p => ({ ...p, name: e.target.value }))} className="w-full bg-accent/20 border border-border rounded-xl py-2 px-3 text-xs outline-none focus:border-primary transition-all" placeholder="e.g. Grand Plaza Resort" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">USD / Night *</label>
                      <input required type="number" value={newProperty.price} onChange={e => setNewProperty(p => ({ ...p, price: e.target.value }))} className="w-full bg-accent/20 border border-border rounded-xl py-2 px-3 text-xs outline-none focus:border-primary transition-all" placeholder="250" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">Location</label>
                      <input type="text" value={newProperty.distance} onChange={e => setNewProperty(p => ({ ...p, distance: e.target.value }))} className="w-full bg-accent/20 border border-border rounded-xl py-2 px-3 text-xs outline-none focus:border-primary transition-all" placeholder="e.g. 0.3 miles away" />
                    </div>
                  </div>
                </div>

                {/* Visual Assets */}
                <div className="space-y-4 pt-2 border-t border-border/50">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block">Cover & Gallery</label>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="col-span-2 relative aspect-square group overflow-hidden rounded-xl border-2 border-dashed border-border bg-accent/5 hover:border-primary/50 transition-all cursor-pointer">
                      <input type="file" accept="image/*" onChange={e => handleFileChange(e, "main")} className="absolute inset-0 opacity-0 z-20 cursor-pointer" />
                      {newProperty.image ? (
                        <img src={newProperty.image} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                          <Upload className="h-4 w-4 text-primary mb-1" />
                          <span className="text-[8px] font-bold uppercase">Main Photo</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="col-span-3 grid grid-cols-3 gap-2">
                       {newProperty.images.map((img, i) => (
                         <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border group/img">
                            <img src={img} className="w-full h-full object-cover" alt="" />
                            <button type="button" onClick={() => setNewProperty(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))} className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                              <X className="h-3 w-3" />
                            </button>
                         </div>
                       ))}
                       {newProperty.images.length < 6 && (
                         <label className="aspect-square rounded-lg border-2 border-dashed border-border bg-accent/5 flex items-center justify-center cursor-pointer hover:bg-accent/10 hover:border-primary/40 transition-all">
                            <input type="file" multiple accept="image/*" onChange={e => handleFileChange(e, "gallery")} className="hidden" />
                            <Plus className="h-3 w-3 text-muted-foreground" />
                         </label>
                       )}
                    </div>
                  </div>
                </div>

                {/* Amenities & Tags */}
                <div className="space-y-4 pt-2 border-t border-border/50">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Amenities</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {newProperty.amenities.map(a => (
                        <span key={a} className="pl-2 pr-1 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold flex items-center gap-1 border border-primary/10">
                          {a}
                          <button type="button" onClick={() => removeChip("amenities", a)} className="hover:text-foreground"><X className="h-2.5 w-2.5" /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      <input type="text" value={tempAmenity} onChange={e => setTempAmenity(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addChip("amenities", tempAmenity))} placeholder="Add facility..." className="flex-1 bg-accent/20 border border-border rounded-lg py-1.5 px-3 text-[10px] outline-none focus:border-primary transition-all" />
                      <button type="button" onClick={() => addChip("amenities", tempAmenity)} className="px-3 rounded-lg bg-accent hover:bg-primary hover:text-white transition-all text-[10px] font-bold">Add</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Description</label>
                      <textarea rows={2} value={newProperty.description} onChange={e => setNewProperty(p => ({ ...p, description: e.target.value }))} placeholder="Brief details..." className="w-full bg-accent/20 border border-border rounded-xl py-2 px-3 text-xs outline-none focus:border-primary transition-all resize-none" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Tags</label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {newProperty.tags.map(t => (
                          <span key={t} className="pl-2 pr-1 py-1 rounded-md bg-accent text-foreground text-[10px] font-bold flex items-center gap-1 border border-border">
                            {t}
                            <button type="button" onClick={() => removeChip("tags", t)} className="hover:text-primary"><X className="h-2.5 w-2.5" /></button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-1.5">
                        <input type="text" value={tempTag} onChange={e => setTempTag(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addChip("tags", tempTag))} placeholder="Add tag..." className="flex-1 bg-accent/20 border border-border rounded-lg py-1.5 px-3 text-[10px] outline-none focus:border-primary transition-all" />
                        <button type="button" onClick={() => addChip("tags", tempTag)} className="px-3 rounded-lg bg-accent hover:bg-primary hover:text-white transition-all text-[10px] font-bold">Add</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-lg text-[10px] font-bold text-muted-foreground hover:text-foreground transition-all">Cancel</button>
                  <GradientButton type="submit" size="sm" className="h-10 px-8 font-bold text-[10px] uppercase tracking-widest">
                    Publish Property
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
