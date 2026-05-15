"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
  Plane, Train, Bus, DollarSign, MessageSquare, Plus, 
  ChevronRight, CheckCircle2, Clock, XCircle, MapPin, 
  Navigation, Info, Star, Trash2, X, Check, Upload,
  Briefcase, Coffee, Wifi, Shield, Users, ChevronDown,
  ArrowRight, CreditCard, LayoutGrid, Eye, Search
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { StatCard } from "@/components/ui-ext/StatCard";
import { inquiries } from "@/data/mock";
import { getPersistedServices, addServiceToStorage, CompanionService } from "@/lib/servicesStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function TravelAgentDashboard() {
  const [listings, setListings] = useState<CompanionService[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: Info, 2: Pricing, 3: Review

  // Options Mapping based on Transport Type
  const [seatMapping, setSeatMapping] = useState<Record<string, string[]>>({
    "Bus": ["Classic Seater", "Semi-Sleeper", "Full Sleeper", "VIP Recliner"],
    "Airplane": ["Economy", "Premium Economy", "Business", "First Class"],
    "Train": ["Sleeper (SL)", "3-Tier AC (3A)", "2-Tier AC (2A)", "1st Class AC (1A)"],
    "Private SUV": ["Driver + 4 Seats", "Driver + 6 Seats", "Luxury Captain Seats"],
    "Traveller": ["12-Seater", "17-Seater", "26-Seater", "Maharaja Seats"],
    "default": ["Standard Seat", "Premium Seat"]
  });

  const [transitTypes, setTransitTypes] = useState(["Bus", "Airplane", "Train", "Private SUV", "Traveller"]);
  const [availableFacilities, setAvailableFacilities] = useState(["Wi-Fi", "Water Bottle", "Charging Point", "Blanket", "Movies", "Meal Included"]);

  // Form State
  const [newTravel, setNewTravel] = useState({
    name: "", from: "", to: "", price: "",
    transitType: "Bus", selectedSeats: [] as string[], selectedFacilities: [] as string[],
    departureTime: "", arrivalTime: "", duration: "", image: "", seatsLeft: 30
  });

  // Dynamic Seat Pricing State (Base Fare + Overrides)
  const [seatPriceOverrides, setSeatPriceOverrides] = useState<Record<string, string>>({});

  const seatVarieties = useMemo(() => {
    return seatMapping[newTravel.transitType] || seatMapping["default"];
  }, [newTravel.transitType]);

  // Pricing Logic Map
  const pricingMultipliers: Record<string, number> = {
    // Bus
    "Classic Seater": 1.0, "Semi-Sleeper": 1.25, "Full Sleeper": 1.6, "VIP Recliner": 2.2,
    // Airplane
    "Economy": 1.0, "Premium Economy": 1.4, "Business": 2.5, "First Class": 4.5,
    // Train
    "Sleeper (SL)": 1.0, "3-Tier AC (3A)": 1.8, "2-Tier AC (2A)": 2.6, "1st Class AC (1A)": 3.5,
    // Private SUV / Traveller
    "Driver + 4 Seats": 1.0, "Driver + 6 Seats": 1.3, "Luxury Captain Seats": 1.8,
    "12-Seater": 1.0, "17-Seater": 1.4, "26-Seater": 1.9, "Maharaja Seats": 2.5,
    "default": 1.1
  };

  // Temporary inputs
  const [customTransit, setCustomTransit] = useState("");
  const [customSeat, setCustomSeat] = useState("");
  const [customFacility, setCustomFacility] = useState("");
  const [showAddTransit, setShowAddTransit] = useState(false);
  const [showAddSeat, setShowAddSeat] = useState(false);
  const [showAddFacility, setShowAddFacility] = useState(false);

  useEffect(() => {
    const all = getPersistedServices();
    setListings(all.filter(s => s.category === "Travel"));
  }, []);

  // Automatically update seat prices when base price or seats change
  useEffect(() => {
    const base = parseFloat(newTravel.price) || 0;
    if (base > 0) {
      const newOverrides = { ...seatPriceOverrides };
      newTravel.selectedSeats.forEach(seat => {
        if (!newOverrides[seat]) {
          const mult = pricingMultipliers[seat] || pricingMultipliers["default"];
          newOverrides[seat] = Math.round(base * mult).toString();
        }
      });
      setSeatPriceOverrides(newOverrides);
    }
  }, [newTravel.price, newTravel.selectedSeats]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setNewTravel(p => ({ ...p, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "Not set";
    if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr;
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours);
    const m = minutes;
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m} ${ampm}`;
  };

  const handlePublish = () => {
    const generated: CompanionService = {
      id: `t-${Date.now()}`,
      category: "Travel",
      name: newTravel.name,
      provider: "Global Transit Partners", 
      price: `₹${newTravel.price}`,
      rating: 4.8,
      image: newTravel.image,
      tags: [...newTravel.selectedSeats, ...newTravel.selectedFacilities].slice(0, 3),
      route: `${newTravel.from} → ${newTravel.to}`,
      departureTime: formatTime(newTravel.departureTime),
      arrivalTime: formatTime(newTravel.arrivalTime),
      duration: newTravel.duration || "3h 0m",
      seatsLeft: newTravel.seatsLeft,
      transitType: newTravel.transitType
    };

    const updated = addServiceToStorage(generated);
    setListings(updated.filter(s => s.category === "Travel"));
    setIsAddModalOpen(false);
    resetForm();
    toast.success("Travel service published and visible to participants!");
  };

  const resetForm = () => {
    setNewTravel({
      name: "", from: "", to: "", price: "",
      transitType: transitTypes[0], selectedSeats: [], selectedFacilities: [],
      departureTime: "", arrivalTime: "", duration: "", image: "", seatsLeft: 30
    });
    setSeatPriceOverrides({});
    setModalStep(1);
  };

  const toggleSelection = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) setter(list.filter(i => i !== item));
    else setter([...list, item]);
  };

  const addNewOption = (val: string, list: string[], listSetter: (l: string[]) => void, inputSetter: (v: string) => void, toggleSetter: (b: boolean) => void) => {
    if (!val.trim()) return;
    if (list.includes(val.trim())) { toast.error("Already exists"); return; }
    listSetter([...list, val.trim()]);
    inputSetter("");
    toggleSetter(false);
  };

  const handleNext = () => {
    if (modalStep === 1) {
      if (!newTravel.name || !newTravel.from || !newTravel.to || newTravel.selectedSeats.length === 0) {
        toast.error("Please fill in basic details and select at least one seat variety.");
        return;
      }
    }
    if (modalStep === 2) {
      if (!newTravel.price || !newTravel.image) {
        toast.error("Base fare and service image are required.");
        return;
      }
    }
    setModalStep(s => s + 1);
  };

  return (
    <DashboardShell title="Travel Partner Hub" subtitle="Manage routes, schedules and transport inventory.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Bus} label="Active Services" value={listings.length} delta="+1" />
        <StatCard icon={Users} label="Total Bookings" value={1420} delta="+12%" />
        <StatCard icon={MessageSquare} label="New Inquiries" value={inquiries.filter(i => i.type === "Travel").length} delta="+3" />
        <StatCard icon={DollarSign} label="Net Earnings" value={124800} prefix="₹" delta="+8%" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-1">
             <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">My Fleet Services</h2>
             <GradientButton size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest px-6" onClick={() => setIsAddModalOpen(true)}>
               <Plus className="h-4 w-4 mr-2" /> Add New Service
             </GradientButton>
          </div>

          <div className="space-y-4 pb-20">
             {listings.map(t => (
               <GlassCard key={t.id} className="p-0 overflow-hidden border-border/40 hover:border-primary/40 transition-all group">
                  <div className="flex flex-col md:flex-row">
                     <div className="w-full md:w-48 h-32 md:h-auto relative shrink-0 overflow-hidden">
                        <img src={t.image} className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                     </div>
                     <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                           <h3 className="font-black text-base text-foreground tracking-tight">{t.name}</h3>
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 flex items-center gap-1.5">
                              <Navigation className="h-3 w-3 text-primary" /> {t.route}
                           </p>
                           <div className="flex flex-wrap gap-2 mt-3">
                              <span className="px-2 py-0.5 rounded bg-accent text-[9px] font-bold uppercase tracking-tighter border border-border">{t.transitType}</span>
                              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[9px] font-bold uppercase tracking-tighter border border-blue-500/20">{t.departureTime} → {t.arrivalTime}</span>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase tracking-tighter border border-emerald-500/20">{t.seatsLeft} Seats</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-6 md:border-l border-border/40 md:pl-6 text-right">
                           <div>
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Base Price</p>
                              <p className="text-lg font-black text-foreground tracking-tighter">{t.price}</p>
                           </div>
                           <button className="h-9 w-9 rounded-xl bg-accent hover:bg-primary hover:text-white transition-all flex items-center justify-center"><Eye className="h-4 w-4" /></button>
                        </div>
                     </div>
                  </div>
               </GlassCard>
             ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <GlassCard className="p-6 bg-primary/5 border-primary/20" hover={false}>
              <h3 className="font-bold flex items-center gap-2 mb-2 text-sm"><Navigation className="h-4 w-4 text-primary" /> Service Performance</h3>
              <div className="mt-6 space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Successful Trips</span>
                    <span className="text-2xl font-black tracking-tighter">842</span>
                 </div>
                 <div className="h-[1px] bg-border/40" />
                 <div className="flex justify-between items-center opacity-60">
                    <span className="text-xs font-bold">On-time rate</span>
                    <span className="text-xs font-black text-emerald-500">98.4%</span>
                 </div>
              </div>
           </GlassCard>
        </div>
      </div>

      {/* ── MULTI-STEP ADD SERVICE MODAL ── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetForm} className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-background border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
               
               {/* Progress Bar */}
               <div className="px-8 pt-6 pb-4 border-b border-border bg-accent/5">
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Step {modalStep} of 3</span>
                        <h2 className="text-sm font-black text-foreground">
                           {modalStep === 1 && "Basic Information"}
                           {modalStep === 2 && "Pricing & Inventory"}
                           {modalStep === 3 && "Final Review"}
                        </h2>
                     </div>
                     <button onClick={resetForm} className="h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center transition-all"><X className="h-4 w-4" /></button>
                  </div>
                  <div className="flex gap-2">
                     {[1, 2, 3].map(s => <div key={s} className={cn("h-1 flex-1 rounded-full transition-all duration-500", s <= modalStep ? "bg-primary shadow-glow-sm" : "bg-border")} />)}
                  </div>
               </div>

               <div className="p-8 overflow-y-auto no-scrollbar flex-1">
                  {/* STEP 1: BASIC INFO */}
                  {modalStep === 1 && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="col-span-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Transport Service Name *</label>
                              <input type="text" value={newTravel.name} onChange={e => setNewTravel(p => ({ ...p, name: e.target.value }))} className="w-full bg-accent/30 border border-border rounded-xl py-3 px-4 text-xs outline-none focus:border-primary font-bold" placeholder="e.g. BlueBird Luxury Express" />
                           </div>
                           <div>
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Source *</label>
                              <input type="text" value={newTravel.from} onChange={e => setNewTravel(p => ({ ...p, from: e.target.value }))} className="w-full bg-accent/30 border border-border rounded-xl py-3 px-4 text-xs outline-none focus:border-primary font-bold" placeholder="From City" />
                           </div>
                           <div>
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Destination *</label>
                              <input type="text" value={newTravel.to} onChange={e => setNewTravel(p => ({ ...p, to: e.target.value }))} className="w-full bg-accent/30 border border-border rounded-xl py-3 px-4 text-xs outline-none focus:border-primary font-bold" placeholder="To City" />
                           </div>
                        </div>

                        {/* Transit Category Dropdown */}
                        <div>
                           <div className="flex items-center justify-between mb-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Transport Type *</label>
                              <button type="button" onClick={() => setShowAddTransit(!showAddTransit)} className="text-[10px] font-black text-primary uppercase hover:underline">
                                 {showAddTransit ? "Back to List" : "+ Add Other Category"}
                              </button>
                           </div>
                           {showAddTransit ? (
                              <div className="flex gap-2 animate-in slide-in-from-right-2 duration-200">
                                 <input type="text" value={customTransit} onChange={e => setCustomTransit(e.target.value)} className="flex-1 bg-accent/30 border border-border rounded-xl py-3 px-4 text-xs outline-none focus:border-primary" placeholder="Type new transport option (e.g. Helicopter)..." />
                                 <button type="button" onClick={() => addNewOption(customTransit, transitTypes, setTransitTypes, setCustomTransit, setShowAddTransit)} className="px-6 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest">Add</button>
                              </div>
                           ) : (
                              <div className="relative">
                                 <select value={newTravel.transitType} onChange={e => {
                                     const type = e.target.value;
                                     setNewTravel(p => ({ ...p, transitType: type, selectedSeats: [] }));
                                     setSeatPriceOverrides({});
                                  }} className="w-full bg-accent/30 border border-border rounded-xl py-3 px-4 text-xs outline-none focus:border-primary appearance-none cursor-pointer font-bold">
                                    <option value="Bus">Bus</option>
                                    <option value="Airplane">Airplane</option>
                                    <option value="Train">Train</option>
                                    <option value="Private SUV">Private SUV</option>
                                    <option value="Traveller">Traveller</option>
                                    {transitTypes.filter(t => !["Bus", "Airplane", "Train", "Private SUV", "Traveller"].includes(t)).map(t => <option key={t} value={t}>{t}</option>)}
                                 </select>
                                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                              </div>
                           )}
                        </div>

                        {/* Seat Varieties */}
                        <div>
                           <div className="flex items-center justify-between mb-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Seat Varieties *</label>
                              <button type="button" onClick={() => setShowAddSeat(!showAddSeat)} className="text-[10px] font-black text-primary uppercase hover:underline">+ Add New Variety</button>
                           </div>
                           <div className="flex flex-wrap gap-2 mb-3">
                              {seatVarieties.map(s => (
                                 <button key={s} type="button" onClick={() => toggleSelection(newTravel.selectedSeats, s, (v) => setNewTravel(p => ({ ...p, selectedSeats: v })))} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all", newTravel.selectedSeats.includes(s) ? "bg-primary border-primary text-white" : "bg-accent/30 border-border text-muted-foreground hover:border-primary/50")}>
                                    {s}
                                 </button>
                              ))}
                           </div>
                           {showAddSeat && (
                              <div className="flex gap-2 animate-in zoom-in-95 duration-200">
                                 <input type="text" value={customSeat} onChange={e => setCustomSeat(e.target.value)} className="flex-1 bg-accent/30 border border-border rounded-xl py-2 px-3 text-xs outline-none focus:border-primary" placeholder="New variety (e.g. Diamond Sleeper)..." />
                                  <button type="button" onClick={() => {
                                     const val = customSeat.trim();
                                     if (!val) return;
                                     const currentList = seatMapping[newTravel.transitType] || [];
                                     if (currentList.includes(val)) { toast.error("Already exists"); return; }
                                     setSeatMapping(prev => ({ ...prev, [newTravel.transitType]: [...currentList, val] }));
                                     setCustomSeat("");
                                     setShowAddSeat(false);
                                  }} className="px-4 rounded-xl bg-accent hover:bg-primary hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">Save</button>
                              </div>
                           )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Departure</label>
                              <input type="time" value={newTravel.departureTime} onChange={e => setNewTravel(p => ({ ...p, departureTime: e.target.value }))} className="w-full bg-accent/30 border border-border rounded-xl py-3 px-4 text-xs outline-none focus:border-primary font-bold" />
                           </div>
                           <div>
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Arrival</label>
                              <input type="time" value={newTravel.arrivalTime} onChange={e => setNewTravel(p => ({ ...p, arrivalTime: e.target.value }))} className="w-full bg-accent/30 border border-border rounded-xl py-3 px-4 text-xs outline-none focus:border-primary font-bold" />
                           </div>
                        </div>

                        {/* Facilities Selection */}
                        <div>
                           <div className="flex items-center justify-between mb-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">On-board Facilities</label>
                              <button type="button" onClick={() => setShowAddFacility(!showAddFacility)} className="text-[10px] font-black text-primary uppercase hover:underline">+ Add New Facility</button>
                           </div>
                           <div className="flex flex-wrap gap-2 mb-3">
                              {availableFacilities.map(f => (
                                 <button key={f} type="button" onClick={() => toggleSelection(newTravel.selectedFacilities, f, (v) => setNewTravel(p => ({ ...p, selectedFacilities: v })))} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all", newTravel.selectedFacilities.includes(f) ? "bg-primary/10 border-primary text-primary" : "bg-accent/30 border-border text-muted-foreground hover:border-primary/50")}>
                                    {f}
                                 </button>
                              ))}
                           </div>
                           {showAddFacility && (
                              <div className="flex gap-2 animate-in zoom-in-95 duration-200">
                                 <input type="text" value={customFacility} onChange={e => setCustomFacility(e.target.value)} className="flex-1 bg-accent/30 border border-border rounded-xl py-2 px-3 text-xs outline-none focus:border-primary" placeholder="New facility (e.g. Live Tracking)..." />
                                 <button type="button" onClick={() => addNewOption(customFacility, availableFacilities, setAvailableFacilities, setCustomFacility, setShowAddFacility)} className="px-4 rounded-xl bg-accent hover:bg-primary hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">Save</button>
                              </div>
                           )}
                        </div>
                     </div>
                  )}

                  {/* STEP 2: PRICING & INVENTORY */}
                  {modalStep === 2 && (
                     <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
                           <label className="text-[10px] font-black uppercase tracking-widest text-primary block mb-2">Global Base Fare (Classic Seater) *</label>
                           <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-primary">₹</span>
                              <input type="number" value={newTravel.price} onChange={e => setNewTravel(p => ({ ...p, price: e.target.value }))} className="w-full bg-background border border-primary/30 rounded-xl py-3.5 pl-10 pr-4 text-lg outline-none focus:border-primary font-black" placeholder="850" />
                           </div>
                           <p className="text-[9px] text-muted-foreground mt-2 font-bold uppercase tracking-wider italic">Premium seat prices will be auto-calculated below. You can override them manually.</p>
                        </div>

                        <div className="space-y-4">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Individual Seat Pricing</h4>
                           <div className="grid gap-3">
                              {newTravel.selectedSeats.map(seat => (
                                 <div key={seat} className="flex items-center justify-between p-4 rounded-xl bg-accent/20 border border-border group hover:border-primary/30 transition-all">
                                    <div className="flex items-center gap-3">
                                       <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center"><Briefcase className="h-4 w-4 text-primary" /></div>
                                       <span className="text-xs font-black text-foreground">{seat}</span>
                                    </div>
                                    <div className="relative w-32">
                                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground">₹</span>
                                       <input 
                                          type="number" 
                                          value={seatPriceOverrides[seat] || ""} 
                                          onChange={e => setSeatPriceOverrides(prev => ({ ...prev, [seat]: e.target.value }))}
                                          className="w-full bg-background border border-border rounded-lg py-2 pl-7 pr-3 text-xs font-black outline-none focus:border-primary" 
                                       />
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div>
                           <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-3">Vehicle Photo *</label>
                           <div className="relative rounded-2xl border-2 border-dashed border-border aspect-video bg-accent/5 flex flex-col items-center justify-center overflow-hidden">
                              <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                              {newTravel.image ? <img src={newTravel.image} className="w-full h-full object-cover" alt="" /> : <Upload className="h-8 w-8 text-muted-foreground" />}
                           </div>
                        </div>
                     </div>
                  )}

                  {/* STEP 3: REVIEW */}
                  {modalStep === 3 && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-start gap-4 p-5 rounded-3xl bg-accent/20 border border-border">
                           <img src={newTravel.image} className="h-20 w-32 rounded-xl object-cover" alt="" />
                           <div>
                              <h4 className="font-black text-lg text-foreground">{newTravel.name}</h4>
                              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{newTravel.transitType}</p>
                              <div className="flex items-center gap-2 mt-2">
                                 <MapPin className="h-3 w-3 text-muted-foreground" />
                                 <span className="text-[11px] font-bold">{newTravel.from} → {newTravel.to}</span>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 rounded-2xl border border-border bg-accent/10">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Departure</p>
                              <p className="text-sm font-black text-foreground">{formatTime(newTravel.departureTime)}</p>
                           </div>
                           <div className="p-4 rounded-2xl border border-border bg-accent/10">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Arrival</p>
                              <p className="text-sm font-black text-foreground">{formatTime(newTravel.arrivalTime)}</p>
                           </div>
                        </div>

                        <div className="p-5 rounded-3xl border border-border bg-accent/5">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Pricing Breakdown</h4>
                           <div className="space-y-3">
                              {newTravel.selectedSeats.map(seat => (
                                 <div key={seat} className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-muted-foreground">{seat}</span>
                                    <span className="text-xs font-black text-foreground">₹{seatPriceOverrides[seat]}</span>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-600">
                           <Shield className="h-5 w-5 shrink-0 mt-0.5" />
                           <p className="text-[10px] font-bold leading-relaxed">By publishing, this service will be instantly visible to all authorized participants. Ensure your route and pricing details are accurate.</p>
                        </div>
                     </div>
                  )}
               </div>

               {/* Footer */}
               <div className="p-6 border-t border-border bg-accent/5 flex gap-4">
                  {modalStep > 1 && (
                     <button onClick={() => setModalStep(s => s - 1)} className="px-6 h-12 rounded-2xl bg-accent font-black text-xs uppercase tracking-widest">Back</button>
                  )}
                  {modalStep < 3 ? (
                     <GradientButton onClick={handleNext} className="flex-1 h-12 text-xs font-black uppercase tracking-widest shadow-glow">
                        Continue to {modalStep === 1 ? "Pricing" : "Final Review"} <ArrowRight className="ml-2 h-4 w-4" />
                     </GradientButton>
                  ) : (
                     <GradientButton onClick={handlePublish} className="flex-1 h-12 text-xs font-black uppercase tracking-widest shadow-glow">
                        Publish & Go Live
                     </GradientButton>
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}
