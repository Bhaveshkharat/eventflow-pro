"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Sliders, CheckCircle2, 
  Layout, Check, ArrowRight, CircleDot, Info,
  ChevronDown, Hotel as HotelIcon, Plane as PlaneIcon, 
  ShoppingCart, Plus, Minus, Search, X, Sparkles,
  ChevronLeft, Trash2, MapPin, Star, Clock, Zap,
  Calendar, Wifi, Coffee, Car, Shield, ShieldCheck,
  CreditCard, Smartphone, Banknote, Map, Navigation,
  Ticket, Briefcase, Zap as ZapIcon, Info as InfoIcon,
  BarChart3, Activity, TrendingUp, History, ClipboardList,
  DollarSign, Settings
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events } from "@/data/mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { 
  getPersistedExhibitorRequests, 
  addExhibitorRequestToStorage, 
  ExhibitorRequest,
  getPersistedVendorServices,
  calculateCommissionedPrice,
  VendorServiceOffer,
  getPersistedServices,
  CompanionService,
  addBookingToStorage,
  Booking
} from "@/lib/servicesStore";

// --- Sub-components for Tabs ---

const ServiceCard = ({ service, price, onAdd, inCartCount }: { service: VendorServiceOffer, price: number, onAdd: (q: number, d: number) => void, inCartCount?: number }) => {
  const [qty, setQty] = useState(1);
  const [days, setDays] = useState(1);

  return (
    <GlassCard className="p-5 flex flex-col justify-between border-border/40 hover:border-primary/40 transition-all group relative">
      {inCartCount && inCartCount > 0 && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase flex items-center gap-1 shadow-glow-sm z-20">
           <Check className="h-2.5 w-2.5" /> Added ({inCartCount})
        </div>
      )}
      
      <div>
         <div className="flex items-center justify-between mb-3">
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-primary/10 text-primary border border-primary/20">{service.category}</span>
            <span className="text-[10px] font-bold text-muted-foreground">{service.pricingType}</span>
         </div>
         <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{service.name}</h4>
         <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{service.description}</p>
      </div>

      <div className="mt-6 space-y-4">
         <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
               <p className="text-[9px] font-bold text-muted-foreground uppercase">Quantity</p>
               <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="h-6 w-6 rounded bg-accent/40 flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                     <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{qty}</span>
                  <button 
                    onClick={() => setQty(qty + 1)}
                    className="h-6 w-6 rounded bg-accent/40 flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                     <Plus className="h-3 w-3" />
                  </button>
               </div>
            </div>

            {service.pricingType === "Per Day" && (
               <div className="space-y-1">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">Days</p>
                  <div className="flex items-center gap-2">
                     <button 
                       onClick={() => setDays(Math.max(1, days - 1))}
                       className="h-6 w-6 rounded bg-accent/40 flex items-center justify-center hover:bg-primary/20 transition-colors"
                     >
                        <Minus className="h-3 w-3" />
                     </button>
                     <span className="text-xs font-bold w-4 text-center">{days}</span>
                     <button 
                       onClick={() => setDays(days + 1)}
                       className="h-6 w-6 rounded bg-accent/40 flex items-center justify-center hover:bg-primary/20 transition-colors"
                     >
                        <Plus className="h-3 w-3" />
                     </button>
                  </div>
               </div>
            )}
         </div>

         <div className="flex items-center justify-between pt-4 border-t border-border/40">
            <div>
               <p className="text-[9px] font-bold text-muted-foreground uppercase">Total Cost</p>
               <span className="text-sm font-black text-foreground">₹{(price * qty * (service.pricingType === "Per Day" ? days : 1)).toLocaleString()}</span>
            </div>
            <button 
              onClick={() => onAdd(qty, days)}
              className="h-9 px-4 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-glow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
               <Plus className="h-3.5 w-3.5" /> Add to Cart
            </button>
         </div>
      </div>
    </GlassCard>
  );
};

const HotelCard = ({ hotel, onBook }: { hotel: CompanionService, onBook: (h: CompanionService) => void }) => {
  return (
    <GlassCard className="p-0 overflow-hidden border-border/40 hover:border-primary/40 transition-all group mb-6" hover={false}>
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-64 h-48 md:h-auto relative shrink-0">
          <img src={hotel.image} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={hotel.name} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          <div className="absolute bottom-3 left-3 flex gap-1">
             {hotel.images?.slice(0, 3).map((img, i) => (
               <div key={i} className="h-8 w-8 rounded border border-white/40 overflow-hidden shadow-lg">
                  <img src={img} className="h-full w-full object-cover" alt="" />
               </div>
             ))}
          </div>
        </div>

        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
               <h3 className="text-lg font-black text-foreground tracking-tight">{hotel.name}</h3>
               <div className="flex items-center bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                 {hotel.rating} <Star className="h-2 w-2 fill-white ml-0.5" />
               </div>
            </div>

            <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1.5 font-medium">
              <MapPin className="h-3 w-3 text-primary" /> {hotel.locationDescription} | <span className="font-bold text-foreground">{hotel.distance} from Venue</span>
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
               {hotel.amenities?.slice(0, 4).map(a => (
                 <div key={a} className="flex items-center gap-1 text-[10px] text-foreground font-medium">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {a}
                 </div>
               ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
             <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase tracking-widest border border-blue-500/20">Free Cancellation</span>
             <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">Breakfast Included</span>
          </div>
        </div>

        <div className="w-full md:w-48 p-5 bg-accent/20 md:border-l border-border/40 flex flex-col justify-center items-end text-right">
            <div className="mb-4">
               <div className="flex items-baseline justify-end gap-1">
                 <span className="text-xl font-black text-foreground tracking-tighter">{hotel.price}</span>
                 <span className="text-[9px] font-bold text-muted-foreground uppercase">/ NIGHT</span>
               </div>
               <p className="text-[8px] text-muted-foreground mt-0.5">+ Taxes & Fees</p>
            </div>
            <GradientButton onClick={() => onBook(hotel)} className="w-full h-10 text-[10px] font-black uppercase tracking-widest shadow-glow-sm">
              Book Stay
            </GradientButton>
        </div>
      </div>
    </GlassCard>
  );
};

const BoothActivityFeed = ({ boothId }: { boothId: string }) => {
  const activities = [
    { time: "2h ago", text: "Premium Sofas (Set of 2) have been positioned.", status: "completed", vendor: "Royal Decor" },
    { time: "5h ago", text: "Main electrical line (1500W) successfully grounded.", status: "completed", vendor: "PowerLink" },
    { time: "1d ago", text: "100Mbps Dedicated Line activated and tested.", status: "completed", vendor: "NetStream" },
    { time: "1d ago", text: "Booth cleaning scheduled for tomorrow 09:00 AM.", status: "pending", vendor: "SparkleCare" }
  ];

  return (
    <GlassCard className="p-6 border-border/40 bg-primary/5 h-fit" hover={false}>
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.2em] flex items-center gap-2">
           <Activity className="h-3.5 w-3.5" /> Live Booth Feed
        </h4>
        <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-glow animate-pulse" />
      </div>

      <div className="space-y-6">
        {activities.map((act, i) => (
          <div key={i} className="flex gap-4 relative">
             {i !== activities.length - 1 && <div className="absolute left-2.5 top-6 bottom-0 w-[1px] bg-border/40" />}
             <div className={cn(
               "h-5 w-5 rounded-full z-10 shrink-0 mt-0.5 flex items-center justify-center",
               act.status === "completed" ? "bg-emerald-500/20 border border-emerald-500/40" : "bg-primary/10 border border-primary/20"
             )}>
                {act.status === "completed" ? <Check className="h-2.5 w-2.5 text-emerald-500" /> : <Clock className="h-2.5 w-2.5 text-primary" />}
             </div>
             <div>
                <div className="flex items-center gap-2">
                   <p className="text-xs font-bold text-foreground leading-tight">{act.text}</p>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                   <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">{act.time}</span>
                   <span className="h-1 w-1 rounded-full bg-border" />
                   <span className="text-[9px] font-black text-primary/80 uppercase tracking-tighter">{act.vendor}</span>
                </div>
             </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

const TravelCard = ({ travel, onBook }: { travel: CompanionService, onBook: (t: CompanionService) => void }) => {
  return (
    <GlassCard className="p-0 overflow-hidden border-border/40 hover:border-primary/40 transition-all group mb-4" hover={false}>
      <div className="flex flex-col md:flex-row p-5 items-center gap-6">
        <div className="w-full md:w-40 shrink-0">
          <h4 className="font-black text-foreground text-sm tracking-tight">{travel.name}</h4>
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{travel.transitType}</p>
          <div className="flex items-center bg-emerald-500 text-white px-1.5 py-0.5 rounded text-[9px] font-bold w-fit mt-2">
            <Star className="h-2 w-2 fill-white mr-0.5" /> {travel.rating}
          </div>
        </div>

        <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-6 w-full px-4 border-x border-border/40">
           <div className="text-center md:text-left">
              <p className="text-base font-black text-foreground tracking-tighter">{travel.departureTime}</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Departure</p>
              <p className="text-[10px] font-medium text-foreground/70">{travel.route?.split('→')[0]}</p>
           </div>
           <div className="flex-1 flex flex-col items-center">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">{travel.duration}</span>
              <div className="relative w-full max-w-[120px] h-[2px] bg-border/60">
                 <div className="absolute -top-1 left-0 h-2 w-2 rounded-full border-2 border-primary bg-background" />
                 <div className="absolute -top-1 right-0 h-2 w-2 rounded-full border-2 border-primary bg-background" />
              </div>
              <span className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1">Non-Stop</span>
           </div>
           <div className="text-center md:text-right">
              <p className="text-base font-black text-foreground tracking-tighter">{travel.arrivalTime}</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Arrival</p>
              <p className="text-[10px] font-medium text-foreground/70">{travel.route?.split('→')[1]}</p>
           </div>
        </div>

        <div className="w-full md:w-40 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3">
           <div className="text-right">
              <p className="text-lg font-black text-foreground tracking-tighter">{travel.price}</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500 mt-0.5">
                {travel.seatsLeft} Seats Left
              </p>
           </div>
           <GradientButton onClick={() => onBook(travel)} className="h-9 px-4 text-[9px] font-black uppercase tracking-widest shadow-glow-sm">
             Select Transit
           </GradientButton>
        </div>
      </div>
    </GlassCard>
  );
};

const BookingModal = ({ item, onClose, commission, eventId }: { item: CompanionService, onClose: () => void, commission: number, eventId: string }) => {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState({ rooms: 1, guests: 1, passengers: 1, class: "Economy" });
  const [personDetails, setPersonDetails] = useState<{name: string, age: string, gender: string}[]>([]);
  const [userInfo, setUserInfo] = useState({ email: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  useEffect(() => {
    const totalPeople = item.category === "Hotel" ? config.guests : config.passengers;
    setPersonDetails(Array(totalPeople).fill(null).map((_, i) => personDetails[i] || { name: "", age: "", gender: "Male" }));
  }, [config.guests, config.passengers, item.category]);

  const totalPrice = useMemo(() => {
    const base = parseInt(item.price.replace(/[^\d]/g, ''));
    if (item.category === "Hotel") return base * config.rooms;
    return base * config.passengers;
  }, [item, config]);

  const handleNext = () => {
    if (step === 3) {
      if (personDetails.some(p => !p.name || !p.age) || !userInfo.email || !userInfo.phone) { 
        toast.error("Please fill details for all persons and contact info"); 
        return; 
      }
    }
    if (step === 4) {
      if (!paymentMethod) { toast.error("Select payment method"); return; }
      
      const newBooking: Booking = {
        id: `BK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        serviceId: item.id,
        serviceName: item.name,
        category: item.category,
        price: totalPrice.toLocaleString(),
        bookingDate: new Date().toLocaleDateString(),
        details: item.category === "Travel" 
          ? `${config.passengers} Pass (${personDetails.map(p => p.name).join(", ")})` 
          : `${config.rooms} Rooms, ${config.guests} Guests (${personDetails.map(p => p.name).join(", ")})`,
        status: "Confirmed",
        image: item.image
      };
      addBookingToStorage(newBooking);
      toast.success("Booking Confirmed!");
      onClose();
      return;
    }
    setStep(s => s + 1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-background border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
         <div className="p-6 border-b border-border flex items-center justify-between bg-accent/5">
            <div>
               <h2 className="text-sm font-black uppercase tracking-widest">Booking {item.name}</h2>
               <div className="flex gap-1 mt-2">
                  {[0, 1, 2, 3, 4].map(s => <div key={s} className={cn("h-1 w-10 rounded-full transition-all", s <= step ? "bg-primary shadow-glow-sm" : "bg-border")} />)}
               </div>
            </div>
            <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center"><X className="h-4 w-4" /></button>
         </div>
         <div className="p-8 overflow-y-auto no-scrollbar">
            {step === 0 && (
               <div className="space-y-6">
                  <div className="aspect-video w-full rounded-3xl overflow-hidden relative border border-border">
                     <img src={item.image} className="h-full w-full object-cover" alt="" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                     <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                        <div>
                           <h3 className="text-2xl font-black text-white tracking-tight">{item.name}</h3>
                           <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-black">
                                 {item.rating} <Star className="h-3 w-3 fill-white ml-1" />
                              </div>
                              <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest flex items-center gap-1.5">
                                 <MapPin className="h-3 w-3" /> {item.distance} from Venue
                              </span>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-white/60 uppercase">Starting From</p>
                           <p className="text-2xl font-black text-white">{item.price}</p>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">Service Description</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                           {item.category === "Hotel" 
                             ? `${item.name} offers premium accommodation with world-class facilities. Perfectly situated ${item.distance} from the event venue, it provides seamless transit for exhibitors.` 
                             : `Premium ${item.transitType} service ensuring high-speed transit on the ${item.route} route. Managed by our authorized logistics partner.`}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                           {item.category === "Hotel" ? (
                              item.amenities?.map(a => (
                                 <span key={a} className="px-3 py-1 rounded-full bg-accent/40 border border-border text-[10px] font-bold">{a}</span>
                              ))
                           ) : (
                              <>
                                 <span className="px-3 py-1 rounded-full bg-accent/40 border border-border text-[10px] font-bold">Priority Boarding</span>
                                 <span className="px-3 py-1 rounded-full bg-accent/40 border border-border text-[10px] font-bold">Extra Luggage</span>
                                 <span className="px-3 py-1 rounded-full bg-accent/40 border border-border text-[10px] font-bold">Insurance Incl.</span>
                              </>
                           )}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">Key Highlights</h4>
                        <div className="space-y-3">
                           {[
                             { icon: ShieldCheck, label: "Organizer Verified", desc: "Vetted by EventFlow" },
                             { icon: CreditCard, label: "Secure Payment", desc: "Escrow protection" },
                             { icon: Zap, label: "Fast Handoff", desc: "Priority support" }
                           ].map((h, i) => (
                             <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-accent/20 border border-border/40">
                                <h.icon className="h-4 w-4 text-primary" />
                                <div>
                                   <p className="text-[10px] font-black text-foreground uppercase">{h.label}</p>
                                   <p className="text-[9px] text-muted-foreground">{h.desc}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {step === 1 && (
               <div className="space-y-8">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">1</div>
                     <h3 className="text-sm font-black uppercase tracking-tight">Select Requirements</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {item.category === "Hotel" ? (
                        <>
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Number of Rooms</label>
                              <div className="flex items-center gap-4 bg-accent/30 p-3 rounded-2xl border border-border">
                                 <button onClick={() => setConfig(c => ({...c, rooms: Math.max(1, c.rooms - 1)}))} className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center"><Minus className="h-4 w-4" /></button>
                                 <span className="flex-1 text-center font-black">{config.rooms}</span>
                                 <button onClick={() => setConfig(c => ({...c, rooms: c.rooms + 1}))} className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center"><Plus className="h-4 w-4" /></button>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Total Guests</label>
                              <div className="flex items-center gap-4 bg-accent/30 p-3 rounded-2xl border border-border">
                                 <button onClick={() => setConfig(c => ({...c, guests: Math.max(1, c.guests - 1)}))} className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center"><Minus className="h-4 w-4" /></button>
                                 <span className="flex-1 text-center font-black">{config.guests}</span>
                                 <button onClick={() => setConfig(c => ({...c, guests: c.guests + 1}))} className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center"><Plus className="h-4 w-4" /></button>
                              </div>
                           </div>
                        </>
                     ) : (
                        <>
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Number of Passengers</label>
                              <div className="flex items-center gap-4 bg-accent/30 p-3 rounded-2xl border border-border">
                                 <button onClick={() => setConfig(c => ({...c, passengers: Math.max(1, c.passengers - 1)}))} className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center"><Minus className="h-4 w-4" /></button>
                                 <span className="flex-1 text-center font-black">{config.passengers}</span>
                                 <button onClick={() => setConfig(c => ({...c, passengers: c.passengers + 1}))} className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center"><Plus className="h-4 w-4" /></button>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Travel Class</label>
                              <select value={config.class} onChange={e => setConfig(c => ({...c, class: e.target.value}))} className="w-full bg-accent/30 p-4 rounded-2xl font-black text-xs outline-none border border-border appearance-none cursor-pointer">
                                 <option>Economy</option>
                                 <option>Business</option>
                                 <option>Premium</option>
                              </select>
                           </div>
                        </>
                     )}
                  </div>
               </div>
            )}
            {step === 2 && (
               <div className="text-center py-16 space-y-6">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto animate-pulse">
                    <Map className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight">Checking Real-time Availability</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-2">Connecting to partner inventory for {item.name} to secure the best organizer rates.</p>
                  </div>
               </div>
            )}
            {step === 3 && (
               <div className="space-y-8">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">3</div>
                     <h3 className="text-sm font-black uppercase tracking-tight">Guest/Passenger Details</h3>
                  </div>
                  
                  <div className="space-y-6">
                    {personDetails.map((person, i) => (
                      <div key={i} className="p-6 rounded-3xl bg-accent/10 border border-border space-y-4">
                        <p className="text-[10px] font-black uppercase text-primary tracking-widest">{item.category === "Hotel" ? `Guest ${i+1}` : `Passenger ${i+1}`}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <input 
                             type="text" 
                             placeholder="Full Name" 
                             value={person.name} 
                             onChange={e => {
                               const next = [...personDetails];
                               next[i].name = e.target.value;
                               setPersonDetails(next);
                             }}
                             className="md:col-span-1 bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold focus:border-primary outline-none" 
                           />
                           <input 
                             type="number" 
                             placeholder="Age" 
                             value={person.age}
                             onChange={e => {
                               const next = [...personDetails];
                               next[i].age = e.target.value;
                               setPersonDetails(next);
                             }}
                             className="bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold focus:border-primary outline-none" 
                           />
                           <select 
                             value={person.gender}
                             onChange={e => {
                               const next = [...personDetails];
                               next[i].gender = e.target.value;
                               setPersonDetails(next);
                             }}
                             className="bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold focus:border-primary outline-none"
                           >
                             <option value="Male">Male</option>
                             <option value="Female">Female</option>
                             <option value="Other">Other</option>
                           </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Contact Information</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <input 
                         type="email" 
                         placeholder="Email Address" 
                         value={userInfo.email} 
                         onChange={e => setUserInfo(u => ({...u, email: e.target.value}))} 
                         className="bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold focus:border-primary outline-none" 
                       />
                       <input 
                         type="tel" 
                         placeholder="Phone Number" 
                         value={userInfo.phone} 
                         onChange={e => setUserInfo(u => ({...u, phone: e.target.value}))} 
                         className="bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold focus:border-primary outline-none" 
                       />
                    </div>
                  </div>
               </div>
            )}
            {step === 4 && (
               <div className="space-y-8">
                  <div className="p-8 rounded-[40px] bg-emerald-500/5 border border-emerald-500/20 text-center">
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Final Payable Amount</p>
                     <h4 className="text-3xl font-black text-foreground">₹{totalPrice.toLocaleString()}</h4>
                     <p className="text-[9px] text-emerald-600 font-bold mt-2 flex items-center justify-center gap-1"><Check className="h-3 w-3" /> Organizer commission included</p>
                  </div>
                  <div className="space-y-3">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-4">Secure Payment Method</p>
                     {["Card", "UPI", "Net Banking"].map(m => (
                        <button key={m} onClick={() => setPaymentMethod(m)} className={cn("w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all", paymentMethod === m ? "border-primary bg-primary/5" : "border-border hover:border-border-strong bg-accent/5")}>
                           <span className="font-black text-xs uppercase tracking-widest">{m}</span>
                           <div className={cn("h-6 w-6 rounded-full border-2 flex items-center justify-center", paymentMethod === m ? "border-primary" : "border-border")}>
                              {paymentMethod === m && <div className="h-3 w-3 rounded-full bg-primary" />}
                           </div>
                        </button>
                     ))}
                  </div>
               </div>
            )}
         </div>
         <div className="p-8 border-t border-border bg-accent/5">
            <GradientButton onClick={handleNext} className="w-full h-14 uppercase tracking-widest font-black text-sm shadow-glow">
               {step === 4 ? "Authorize Payment" : "Continue to Next Step"} <ArrowRight className="ml-2 h-5 w-5" />
            </GradientButton>
         </div>
      </motion.div>
    </div>
  );
};
  
const DashboardTab = ({ syncedEvents }: { syncedEvents: any[] }) => {
  const stats = [
    { label: "Booked Events", value: syncedEvents.length, icon: Calendar, color: "text-blue-500" },
    { label: "Active Stalls", value: syncedEvents.reduce((sum, e) => sum + e.booths.length, 0), icon: Building2, color: "text-purple-500" },
    { label: "Active Requests", value: "12", icon: Zap, color: "text-amber-500" },
    { label: "Total Spend", value: "₹4.2L", icon: DollarSign, color: "text-emerald-500" }
  ];

  const chartData = [
    { x: 50, y: 160, label: "Jan" },
    { x: 150, y: 140, label: "Feb" },
    { x: 250, y: 180, label: "Mar" },
    { x: 350, y: 100, label: "Apr" },
    { x: 450, y: 120, label: "May" },
    { x: 550, y: 60, label: "Jun" }
  ];

  const linePath = chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${d.x} ${d.y}`).join(' ');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <GlassCard key={i} className="p-6 border-border/40" hover={false}>
            <div className="flex items-center justify-between mb-2">
              <s.icon className={cn("h-5 w-5", s.color)} />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global Stats</span>
            </div>
            <p className="text-2xl font-black text-foreground">{s.value}</p>
            <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tight">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 p-8 border-border/40 overflow-hidden relative" hover={false}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Spending Analytics</h3>
              <p className="text-[10px] text-muted-foreground mt-1">Stall & services expenditure over last 6 months</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary shadow-glow-sm" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Monthly Yield</span>
            </div>
          </div>
          
          <div className="h-48 w-full relative">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="exGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${linePath} L 550 200 L 50 200 Z`} fill="url(#exGrad)" />
              <path d={linePath} fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {chartData.map((d, i) => (
                <g key={i}>
                  <circle cx={d.x} cy={d.y} r="4" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2" />
                  <text x={d.x} y="195" textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold uppercase">{d.label}</text>
                </g>
              ))}
            </svg>
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard className="p-6 border-border/40" hover={false}>
             <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <History className="h-3.5 w-3.5 text-primary" /> Recent History
             </h4>
             <div className="space-y-4">
                {syncedEvents.slice(0, 3).map((e, i) => (
                   <div key={i} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl overflow-hidden border border-border">
                         <img src={e.image} className="h-full w-full object-cover" alt="" />
                      </div>
                      <div className="min-w-0 flex-1">
                         <p className="text-xs font-bold text-foreground truncate">{e.title}</p>
                         <p className="text-[9px] text-muted-foreground uppercase">{e.booths.length} Stalls · {e.date}</p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                   </div>
                ))}
             </div>
             <GradientButton size="sm" className="w-full mt-6 h-9 text-[10px] font-black uppercase tracking-widest">
                View Full Logs
             </GradientButton>
          </GlassCard>

          <GlassCard className="p-6 bg-primary/5 border-primary/20" hover={false}>
             <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 text-primary">Pro Recommendation</h4>
             <p className="text-[11px] text-muted-foreground leading-relaxed">
                Based on your last 3 events, upgrading to a <span className="font-bold text-foreground">Corner Stall</span> in TechSummit 2026 could increase footfall by 18%.
             </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

const RequestsTab = ({ eventId }: { eventId: string }) => {
  const [requests, setRequests] = useState<ExhibitorRequest[]>([]);
  
  useEffect(() => {
    const all = getPersistedExhibitorRequests();
    setRequests(all.filter(r => r.eventId === eventId));
  }, [eventId]);

  const statusColors = {
    Unassigned: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Assigned: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "In Progress": "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    Completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Pending: "bg-rose-500/10 text-rose-500 border-rose-500/20"
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
         <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Active Service Requests</h3>
         <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/40 border border-border">
            <Activity className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Real-time Status Feed</span>
         </div>
      </div>

      <div className="grid gap-4">
        {requests.length === 0 ? (
          <div className="p-20 text-center glass rounded-3xl border-2 border-dashed border-border opacity-40">
             <ClipboardList className="h-12 w-12 mx-auto mb-4" />
             <p className="text-xs font-bold">No requests found for this event.</p>
          </div>
        ) : (
          requests.map(req => (
            <GlassCard key={req.id} className="p-5 border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-4" hover={false}>
               <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="h-12 w-12 rounded-2xl bg-accent/40 flex items-center justify-center shrink-0">
                     <Settings className={cn("h-6 w-6", req.status === "Completed" ? "text-emerald-500" : "text-primary")} />
                  </div>
                  <div className="min-w-0">
                     <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{req.category}</p>
                     <h4 className="text-sm font-black text-foreground truncate">{req.title}</h4>
                     <p className="text-[10px] text-muted-foreground mt-0.5">Booth #{req.boothNumber} · Requested {new Date(req.timestamp).toLocaleDateString()}</p>
                  </div>
               </div>

               <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-border/40">
                  <div className="text-left md:text-right">
                     <p className="text-[9px] font-bold text-muted-foreground uppercase">Cost Estimate</p>
                     <p className="text-xs font-black text-foreground">{req.cost}</p>
                  </div>
                  <div className={cn("px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest", statusColors[req.status] || "bg-accent/40 text-muted-foreground")}>
                     {req.status}
                  </div>
               </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};

const ServicesTab = ({ eventId, booths }: { eventId: string, booths: any[] }) => {
  const [selectedBoothId, setSelectedBoothId] = useState<string | null>(null);
  const [vendorServices, setVendorServices] = useState<VendorServiceOffer[]>([]);
  const [cart, setCart] = useState<{ serviceId: string; quantity: number; days: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFeedOpen, setIsFeedOpen] = useState(false);
  const [customReq, setCustomReq] = useState("");
  const [customQty, setCustomQty] = useState(1);
  const [customDays, setCustomDays] = useState(1);
  
  const eventMeta = events.find(e => e.id === eventId);
  const commission = eventMeta?.commissionPercent || 13;

  useEffect(() => {
    setVendorServices(getPersistedVendorServices());
  }, []);

  const addToCart = (serviceId: string, quantity: number, days: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.serviceId === serviceId);
      if (existing) {
        return prev.map(item => item.serviceId === serviceId ? { ...item, quantity: item.quantity + quantity, days: Math.max(item.days, days) } : item);
      }
      return [...prev, { serviceId, quantity, days }];
    });
    const service = vendorServices.find(s => s.id === serviceId);
    toast.success(`${service?.name} added to cart!`);
  };

  const removeFromCart = (serviceId: string) => {
    setCart(prev => prev.filter(s => s.serviceId !== serviceId));
  };

  const submitRequests = () => {
    if (!selectedBoothId) return;
    cart.forEach(cartItem => {
      const service = vendorServices.find(s => s.id === cartItem.serviceId);
      if (!service) return;

      const basePrice = calculateCommissionedPrice(service.basePrice, commission);
      const totalPrice = basePrice * cartItem.quantity * (service.pricingType === "Per Day" ? cartItem.days : 1);

      const newReq: ExhibitorRequest = {
        id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        exhibitorName: "Global Tech Solutions",
        boothNumber: selectedBoothId,
        eventName: eventMeta?.title || "Exhibition",
        eventId: eventId,
        title: `${service.name} (Qty: ${cartItem.quantity}${service.pricingType === "Per Day" ? `, Days: ${cartItem.days}` : ""})`,
        category: service.category,
        status: "Unassigned",
        cost: `₹${totalPrice.toLocaleString()}`,
        deadline: "Setup Day",
        timestamp: new Date().toISOString()
      };
      addExhibitorRequestToStorage(newReq);
    });
    setCart([]);
    setIsCartOpen(false);
    toast.success("All service requests dispatched to vendors!");
  };

  const submitCustomReq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customReq.trim() || !selectedBoothId) return;

    const newReq: ExhibitorRequest = {
      id: `req-custom-${Date.now()}`,
      exhibitorName: "Global Tech Solutions",
      boothNumber: selectedBoothId,
      eventName: eventMeta?.title || "Exhibition",
      eventId: eventId,
      title: `${customReq} (Qty: ${customQty}, Days: ${customDays})`,
      category: "Custom",
      status: "Pending",
      cost: "TBD",
      deadline: "Organizer Review",
      timestamp: new Date().toISOString()
    };
    addExhibitorRequestToStorage(newReq);
    setCustomReq("");
    setCustomQty(1);
    setCustomDays(1);
    toast.success("Custom request sent to organizer for vendor assignment.");
  };

  if (!selectedBoothId) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-accent/10 p-8 rounded-[40px] border border-border/40 text-center">
           <h3 className="text-xl font-black text-foreground tracking-tight">Select Booth to Manage Services</h3>
           <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">Choose one of your booked stalls below to request furniture, electrical, and technical services.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {booths.map((booth, idx) => (
              <GlassCard 
                key={idx} 
                onClick={() => setSelectedBoothId(booth.boothNumber)}
                className="p-8 cursor-pointer group hover:border-primary/40 transition-all border-border/40 relative overflow-hidden"
              >
                 <div className="absolute -right-4 -top-4 h-24 w-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
                 <div className="relative z-10">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                       <Building2 className="h-7 w-7" />
                    </div>
                    <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-1">STALL {booth.category}</p>
                    <h4 className="text-2xl font-black text-foreground tracking-tighter">Booth #{booth.boothNumber}</h4>
                    <div className="mt-6 flex items-center gap-2 text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">
                       Manage Services <ArrowRight className="h-4 w-4" />
                    </div>
                 </div>
              </GlassCard>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setSelectedBoothId(null)}
             className="h-10 w-10 rounded-xl bg-accent/40 border border-border flex items-center justify-center hover:bg-accent transition-all group"
           >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
           </button>
           <div>
              <h3 className="text-lg font-black text-foreground tracking-tight">Booth #{selectedBoothId} Marketplace</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Assigned Vendors & Services</p>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsFeedOpen(true)}
             className="h-11 px-5 rounded-xl glass border border-primary/20 text-primary flex items-center gap-2 hover:bg-primary/5 transition-all group"
           >
              <Activity className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-widest">Live Booth Progress</span>
           </button>

           <button 
             onClick={() => setIsCartOpen(true)}
             className="relative h-11 px-5 rounded-xl bg-primary text-white flex items-center gap-2 hover:opacity-90 transition-all shadow-glow group"
           >
              <ShoppingCart className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-widest">Cart Summary</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white text-primary text-[10px] font-black flex items-center justify-center border-2 border-primary animate-in zoom-in">
                   {cart.length}
                </span>
              )}
           </button>
        </div>
      </div>

      <div className="space-y-8">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendorServices.map(service => {
              const finalPrice = calculateCommissionedPrice(service.basePrice, commission);
              const cartItem = cart.find(item => item.serviceId === service.id);
              
              return (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  price={finalPrice} 
                  onAdd={(q, d) => addToCart(service.id, q, d)}
                  inCartCount={cartItem?.quantity}
                />
              );
            })}
         </div>

         <GlassCard className="p-8 border-border/40 bg-primary/[0.02]" hover={false}>
            <h4 className="text-sm font-black text-foreground mb-4 flex items-center gap-2">
               <Sparkles className="h-4 w-4 text-primary" /> Customize / Unlisted Service Request
            </h4>
            <form onSubmit={submitCustomReq} className="flex flex-col lg:flex-row gap-4 items-end">
               <div className="flex-[3] w-full">
                  <label className="text-[9px] font-black uppercase text-muted-foreground mb-2 block tracking-widest">Detailed Requirement</label>
                  <input 
                    type="text" 
                    value={customReq}
                    onChange={(e) => setCustomReq(e.target.value)}
                    placeholder="E.g. Extra deep cleaning, custom lighting rig, etc."
                    className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-xs font-bold outline-none focus:border-primary transition-all shadow-inner"
                  />
               </div>
               
               <div className="w-full lg:w-40">
                  <label className="text-[9px] font-black uppercase text-muted-foreground mb-2 block tracking-widest">Quantity</label>
                  <div className="flex items-center gap-2 bg-background border border-border rounded-xl p-1">
                     <button type="button" onClick={() => setCustomQty(Math.max(1, customQty - 1))} className="h-8 w-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"><Minus className="h-3 w-3" /></button>
                     <span className="flex-1 text-center text-xs font-bold">{customQty}</span>
                     <button type="button" onClick={() => setCustomQty(customQty + 1)} className="h-8 w-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"><Plus className="h-3 w-3" /></button>
                  </div>
               </div>

               <div className="w-full lg:w-40">
                  <label className="text-[9px] font-black uppercase text-muted-foreground mb-2 block tracking-widest">Duration (Days)</label>
                  <div className="flex items-center gap-2 bg-background border border-border rounded-xl p-1">
                     <button type="button" onClick={() => setCustomDays(Math.max(1, customDays - 1))} className="h-8 w-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"><Minus className="h-3 w-3" /></button>
                     <span className="flex-1 text-center text-xs font-bold">{customDays}</span>
                     <button type="button" onClick={() => setCustomDays(customDays + 1)} className="h-8 w-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"><Plus className="h-3 w-3" /></button>
                  </div>
               </div>

               <div className="w-full lg:w-fit">
                  <GradientButton type="submit" className="w-full px-8 h-11 text-xs font-black uppercase tracking-widest shrink-0 shadow-glow">
                     Request Service
                  </GradientButton>
               </div>
            </form>
            <p className="text-[10px] text-muted-foreground mt-4 font-medium flex items-center gap-2">
               <InfoIcon className="h-3 w-3 text-primary" /> Note: Custom requests are sent to the organizer for manual vendor assignment and quoting.
            </p>
         </GlassCard>
      </div>

      <AnimatePresence>
        {isFeedOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFeedOpen(false)} className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm" />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-lg"
             >
                <div className="absolute top-4 right-4 z-20">
                   <button onClick={() => setIsFeedOpen(false)} className="h-8 w-8 rounded-full bg-background/20 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-background/40 transition-all">
                      <X className="h-4 w-4" />
                   </button>
                </div>
                <BoothActivityFeed boothId={selectedBoothId} />
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-end p-4">
           <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
           <motion.div 
             initial={{ x: 100, opacity: 0 }} 
             animate={{ x: 0, opacity: 1 }}
             exit={{ x: 100, opacity: 0 }}
             className="relative w-full max-w-md h-full sm:h-[80vh] bg-background border-l border-border shadow-2xl flex flex-col rounded-t-[40px] sm:rounded-3xl overflow-hidden"
           >
              <div className="p-6 border-b border-border flex items-center justify-between bg-accent/5">
                 <h3 className="font-black text-sm uppercase tracking-widest">Service Cart</h3>
                 <button onClick={() => setIsCartOpen(false)} className="h-8 w-8 rounded-lg hover:bg-accent flex items-center justify-center"><X className="h-4 w-4" /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                 {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                       <ShoppingCart className="h-12 w-12 mb-4" />
                       <p className="text-xs font-bold">Your cart is empty.</p>
                    </div>
                 ) : (
                    cart.map((item, idx) => {
                       const service = vendorServices.find(s => s.id === item.serviceId);
                       if (!service) return null;
                       const basePrice = calculateCommissionedPrice(service.basePrice, commission);
                       const totalPrice = basePrice * item.quantity * (service.pricingType === "Per Day" ? item.days : 1);
                       
                       return (
                          <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-accent/20 border border-border group">
                             <div className="min-w-0 flex-1 pr-4">
                                <p className="text-xs font-bold truncate">{service.name}</p>
                                <p className="text-[10px] text-muted-foreground uppercase">
                                   {item.quantity} Unit(s) {service.pricingType === "Per Day" ? `· ${item.days} Day(s)` : ""}
                                </p>
                                <p className="text-[10px] text-primary font-bold">Total: ₹{totalPrice.toLocaleString()}</p>
                             </div>
                             <button onClick={() => removeFromCart(item.serviceId)} className="h-8 w-8 rounded-lg text-rose-500 hover:bg-rose-500/10 flex items-center justify-center transition-all">
                                <Trash2 className="h-4 w-4" />
                             </button>
                          </div>
                       );
                    })
                 )}
              </div>

              {cart.length > 0 && (
                 <div className="p-6 border-t border-border bg-accent/5">
                    <div className="flex justify-between items-baseline mb-6">
                       <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Estimated Total</span>
                       <span className="text-2xl font-black text-foreground">
                          ₹{cart.reduce((sum, item) => {
                             const service = vendorServices.find(s => s.id === item.serviceId);
                             if (!service) return sum;
                             const basePrice = calculateCommissionedPrice(service.basePrice, commission);
                             return sum + (basePrice * item.quantity * (service.pricingType === "Per Day" ? item.days : 1));
                          }, 0).toLocaleString()}
                       </span>
                    </div>
                    <GradientButton onClick={submitRequests} className="w-full h-14 text-sm font-black uppercase tracking-widest shadow-glow">
                       Request Selected Services
                    </GradientButton>
                 </div>
              )}
           </motion.div>
        </div>
      )}
    </div>
  );
};

const LogisticsTab = ({ eventId }: { eventId: string }) => {
  const [catalog, setCatalog] = useState<CompanionService[]>([]);
  const [bookingItem, setBookingItem] = useState<CompanionService | null>(null);
  const [filterType, setFilterType] = useState<"All" | "Hotel" | "Travel">("All");
  
  const eventMeta = events.find(e => e.id === eventId);
  const commission = eventMeta?.commissionPercent || 13;

  useEffect(() => {
    setCatalog(getPersistedServices());
  }, []);

  const filteredItems = useMemo(() => {
    return catalog
      .filter(item => {
        const isCorrectType = filterType === "All" || item.category === filterType;
        const isAssigned = eventMeta?.assignedPartnerIds?.includes(item.id);
        return isCorrectType && isAssigned;
      })
      .map(item => ({
        ...item,
        priceValue: parseInt(item.price.replace(/[^\d]/g, '')),
        displayPrice: `₹${calculateCommissionedPrice(parseInt(item.price.replace(/[^\d]/g, '')), commission).toLocaleString()}`
      }));
  }, [catalog, filterType, commission, eventMeta]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-accent/10 p-6 rounded-3xl border border-border/40">
        <div>
          <h3 className="text-lg font-bold text-foreground">Stay & Transit Hub</h3>
          <p className="text-xs text-muted-foreground">Premium logistics partners assigned by the organizer for this event.</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-background border border-border rounded-xl">
           {(["All", "Hotel", "Travel"] as const).map(type => (
              <button 
                key={type} 
                onClick={() => setFilterType(type)}
                className={cn("px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all", filterType === type ? "bg-primary text-white shadow-glow-sm" : "text-muted-foreground hover:bg-accent")}
              >
                {type}
              </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredItems.length === 0 ? (
          <div className="p-20 rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center opacity-40">
             <InfoIcon className="h-12 w-12 mb-4" />
             <p className="text-sm font-bold">No logistics partners assigned to this event yet.</p>
          </div>
        ) : (
          filteredItems.map(item => (
            item.category === "Hotel" ? 
              <HotelCard key={item.id} hotel={item} onBook={setBookingItem} /> : 
              <TravelCard key={item.id} travel={item} onBook={setBookingItem} />
          ))
        )}
      </div>

      <AnimatePresence>
        {bookingItem && (
          <BookingModal 
            item={bookingItem} 
            onClose={() => setBookingItem(null)} 
            commission={commission} 
            eventId={eventId} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Page Component ---

export default function BoothManagementPage() {
  const [syncedEvents, setSyncedEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'services' | 'logistics' | 'requests'>('dashboard');
  const [showLogisticsPromo, setShowLogisticsPromo] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("eventflow_pro_exhibitor_requests_v1");
    if (raw) {
       const saved = JSON.parse(raw);
       const uniqueEventIds = Array.from(new Set(saved.map((s: any) => s.eventId)));
       const dashboardEvents = uniqueEventIds.map(eid => {
          const eventRequests = saved.filter((s: any) => s.eventId === eid);
          const eventMeta = events.find(e => e.id === eid);
          return {
             id: eid,
             title: eventMeta?.title || "Global Exposition",
             date: eventMeta?.date || "TBD",
             venue: eventMeta?.venue || "Main Convention Center",
             city: eventMeta?.city || "Metropolis",
             image: eventMeta?.image || "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=800&auto=format&fit=crop&q=80",
             booths: eventRequests.flatMap((r: any) => {
                const numbers = r.boothNumber.split(", ");
                return numbers.map((num: string) => ({
                   boothNumber: num,
                   category: r.category,
                   status: r.status
                }));
             })
          };
       });
       setSyncedEvents(dashboardEvents);
    }
  }, []);

  const handleEventSelection = (event: any) => {
     const skip = localStorage.getItem(`eventflow_pro_skip_logistics_promo_${event.id}`);
     if (skip === "true") {
        setSelectedEventId(event.id);
     } else {
        setPendingEvent(event);
        setShowLogisticsPromo(true);
     }
  };

  if (syncedEvents.length === 0) {
     return (
        <DashboardShell title="Booth Management">
           <div className="max-w-4xl mx-auto pt-20">
              <GlassCard className="p-12 text-center border-dashed border-primary/20 bg-primary/5" hover={false}>
                 <div className="h-20 w-20 rounded-3xl gradient-bg text-white grid place-items-center mx-auto mb-6 shadow-glow">
                    <Building2 className="h-10 w-10" />
                 </div>
                 <h2 className="text-2xl font-black text-foreground tracking-tight">Welcome to Booth Management</h2>
                 <p className="text-muted-foreground mt-2 mb-10 max-w-md mx-auto text-sm leading-relaxed">
                    Once you book a stall at an event, you'll be able to manage your booth infrastructure, request services, and handle logistics right here.
                 </p>
                 <Link href="/events">
                    <GradientButton className="h-14 px-10 text-sm font-black uppercase tracking-widest shadow-glow">
                       Find Events to Exhibit <ArrowRight className="ml-2 h-4 w-4" />
                    </GradientButton>
                 </Link>
              </GlassCard>
           </div>
        </DashboardShell>
     );
  }

  // --- RENDERING VIEWS ---

  if (selectedEventId) {
     const currentEvent = syncedEvents.find(e => e.id === selectedEventId);
     return (
        <DashboardShell 
          title="Manage Presence" 
          subtitle={`Staging and logistics for ${currentEvent.title}`}
          backLink="#"
        >
           {/* Custom back trigger */}
           <button onClick={() => setSelectedEventId(null)} className="flex items-center gap-2 text-xs font-bold text-primary mb-6 hover:translate-x-[-4px] transition-transform">
              <ChevronLeft className="h-4 w-4" /> Back to Event List
           </button>

           <div className="space-y-8">
              {/* Event Context Strip */}
              <GlassCard className="p-5 border-border/40 flex items-center justify-between" hover={false}>
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl overflow-hidden shrink-0 border border-border">
                       <img src={currentEvent.image} className="h-full w-full object-cover" alt="" />
                    </div>
                    <div>
                       <h2 className="text-lg font-bold text-foreground">{currentEvent.title}</h2>
                       <p className="text-xs text-muted-foreground">{currentEvent.venue} · {currentEvent.date}</p>
                    </div>
                 </div>
                 <div className="hidden sm:flex gap-2">
                    {currentEvent.booths.map((b: any) => (
                       <span key={b.boothNumber} className="px-2 py-1 rounded-lg bg-accent text-[10px] font-black uppercase tracking-tighter border border-border">
                          Stall {b.boothNumber}
                       </span>
                    ))}
                 </div>
              </GlassCard>

              {/* Tab Navigation */}
               <div className="flex border-b border-border/40 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
                    { id: 'services', label: 'Services', icon: Sliders },
                    { id: 'requests', label: 'My Requests', icon: ClipboardList },
                    { id: 'logistics', label: 'Logistics', icon: Map }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-widest transition-all relative",
                        activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                       <tab.icon className="h-4 w-4" />
                       {tab.label}
                       {activeTab === tab.id && (
                          <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full shadow-glow-sm" />
                       )}
                    </button>
                 ))}
              </div>

              {/* Tab Content */}
               <div className="pt-4">
                  {activeTab === 'dashboard' && <DashboardTab syncedEvents={syncedEvents} />}
                  {activeTab === 'services' && <ServicesTab eventId={selectedEventId} booths={currentEvent.booths} />}
                  {activeTab === 'requests' && <RequestsTab eventId={selectedEventId} />}
                  {activeTab === 'logistics' && <LogisticsTab eventId={selectedEventId} />}
               </div>
           </div>
        </DashboardShell>
     );
  }

  return (
    <DashboardShell 
      title="Booth Management" 
      subtitle="Select an event to manage your booth infrastructure and companion logistics."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {syncedEvents.map(event => (
          <GlassCard key={event.id} className="p-0 overflow-hidden flex flex-col border-border/40 group hover:border-primary/40 transition-all">
             <div className="h-48 relative overflow-hidden">
                <img src={event.image} className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                   <p className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 backdrop-blur-md px-2 py-0.5 rounded border border-primary/20 w-fit mb-1">
                      {event.booths.length} Stalls Booked
                   </p>
                   <h3 className="text-lg font-bold text-white leading-tight">{event.title}</h3>
                </div>
             </div>
             
             <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                   <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-primary" /> {event.date}
                   </div>
                   <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> {event.venue}, {event.city}
                   </div>
                   
                   <div className="flex flex-wrap gap-1.5 pt-2">
                      {event.booths.slice(0, 3).map((b: any) => (
                         <span key={b.boothNumber} className="px-2 py-0.5 rounded bg-accent/40 text-[9px] font-bold border border-border/60">Stall {b.boothNumber}</span>
                      ))}
                      {event.booths.length > 3 && <span className="text-[9px] text-muted-foreground font-bold ml-1">+{event.booths.length - 3} more</span>}
                   </div>
                </div>

                <GradientButton 
                  onClick={() => handleEventSelection(event)}
                  className="w-full mt-8 h-12 text-xs font-black uppercase tracking-widest shadow-glow-sm"
                >
                   Manage Services <ArrowRight className="ml-2 h-4 w-4" />
                </GradientButton>
             </div>
          </GlassCard>
        ))}
      </div>

      {/* LOGISTICS PROMOTION MODAL */}
      <AnimatePresence>
        {showLogisticsPromo && pendingEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowLogisticsPromo(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg relative z-10"
            >
              <GlassCard className="p-10 border-primary/30 shadow-2xl relative overflow-hidden" hover={false}>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
                
                <div className="text-center relative z-10">
                  <div className="h-20 w-20 bg-gradient-to-br from-primary to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow rotate-3">
                    <HotelIcon className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-foreground">Travel & Stay Simplified</h2>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed font-medium">
                    Need premium hotel accommodations or travel facilities for your staff at <span className="text-foreground font-black">{pendingEvent.title}</span>? 
                    Access exclusive exhibitor rates through our logistics partners.
                  </p>

                  <div className="mt-12 space-y-4">
                    <button 
                      onClick={() => {
                        setShowLogisticsPromo(false);
                        setSelectedEventId(pendingEvent.id);
                        setActiveTab('logistics');
                      }}
                      className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-glow flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Explore Logistics Hub <ArrowRight className="h-5 w-5" />
                    </button>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          setShowLogisticsPromo(false);
                          setSelectedEventId(pendingEvent.id);
                        }}
                        className="flex-1 h-12 rounded-xl bg-accent/30 text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-accent/50 transition-all"
                      >
                        Continue to Service
                      </button>
                      <button 
                        onClick={() => {
                          localStorage.setItem(`eventflow_pro_skip_logistics_promo_${pendingEvent.id}`, "true");
                          setShowLogisticsPromo(false);
                          setSelectedEventId(pendingEvent.id);
                        }}
                        className="flex-1 h-12 rounded-xl border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
                      >
                        Don't show again
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}
