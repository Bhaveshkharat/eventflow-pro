"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { 
  Package, 
  Hotel, 
  Plane, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  ExternalLink,
  Search,
  Filter,
  Calendar,
  Building2,
  Receipt,
  Plus,
  X,
  Download,
  CreditCard,
  MapPin,
  User,
  ShieldCheck,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  getPersistedExhibitorRequests, 
  getPersistedBookings, 
  ExhibitorRequest, 
  Booking,
  getVendorById
} from "@/lib/servicesStore";
import { AnimatePresence, motion } from "framer-motion";

export default function MyBookingsPage() {
  const [activeType, setActiveType] = useState<"services" | "logistics">("services");
  const [subFilter, setSubFilter] = useState<"all" | "Hotel" | "Travel">("all");
  const [serviceRequests, setServiceRequests] = useState<ExhibitorRequest[]>([]);
  const [logisticsBookings, setLogisticsBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ExhibitorRequest | null>(null);

  useEffect(() => {
    setServiceRequests(getPersistedExhibitorRequests());
    setLogisticsBookings(getPersistedBookings());
  }, []);

  const filteredServices = serviceRequests.filter(req => 
    (req.title || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (req.eventName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLogistics = logisticsBookings.filter(book => {
    // Only show items with a valid logistics category (exclude event passes)
    if (book.category !== "Hotel" && book.category !== "Travel") return false;
    
    const name = book.serviceName || "";
    const category = book.category || "";
    
    // Filter by searchTerm
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by subFilter
    const matchesSubFilter = subFilter === "all" || book.category === subFilter;
    
    return matchesSearch && matchesSubFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
      case "Confirmed":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "In Progress":
      case "Assigned":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "Unassigned":
      case "Pending":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default:
        return "text-muted-foreground bg-accent/50 border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
      case "Confirmed":
        return <CheckCircle2 className="h-3 w-3" />;
      case "In Progress":
      case "Assigned":
        return <Clock className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  return (
    <DashboardShell 
      title="My Bookings & Requests" 
      subtitle="Track your service procurement and logistics bookings across all events."
    >
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-accent/5 p-6 rounded-3xl border border-border/40">
           <div className="flex items-center gap-2 p-1 bg-background border border-border rounded-2xl w-fit">
              <button 
                onClick={() => setActiveType("services")}
                className={cn(
                  "px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                  activeType === "services" ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:bg-accent"
                )}
              >
                <Package className="h-3.5 w-3.5" /> Services
              </button>
              <button 
                onClick={() => setActiveType("logistics")}
                className={cn(
                  "px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                  activeType === "logistics" ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:bg-accent"
                )}
              >
                <Hotel className="h-3.5 w-3.5" /> Logistics
              </button>
           </div>

            <div className="relative flex-1 max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <input 
                 type="text" 
                 placeholder={activeType === "services" ? "Search services, events..." : "Search hotels, travel..."}
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-background border border-border rounded-2xl pl-11 pr-4 py-3 text-xs font-bold focus:border-primary outline-none transition-all"
               />
            </div>

            <div className="flex items-center gap-2">
               {activeType === "logistics" && (
                  <div className="flex items-center gap-2 p-1 bg-background border border-border rounded-2xl">
                     <button 
                       onClick={() => setSubFilter("all")}
                       className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", subFilter === "all" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}
                     >
                        All
                     </button>
                     <button 
                       onClick={() => setSubFilter("Hotel")}
                       className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5", subFilter === "Hotel" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}
                     >
                        <Hotel className="h-3 w-3" /> Hotels
                     </button>
                     <button 
                       onClick={() => setSubFilter("Travel")}
                       className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5", subFilter === "Travel" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}
                     >
                        <Plane className="h-3 w-3" /> Travel
                     </button>
                  </div>
               )}
            </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 gap-4">
          {activeType === "services" ? (
            filteredServices.length === 0 ? (
              <div className="text-center py-20 opacity-30">
                 <Package className="h-16 w-16 mx-auto mb-4" />
                 <p className="font-black uppercase tracking-widest">No service requests found</p>
              </div>
            ) : (
              filteredServices.map((req) => (
                <GlassCard key={req.id} className="p-0 overflow-hidden group" hover={false}>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <div className="p-6 flex-1 space-y-4">
                       <div className="flex items-center justify-between">
                          <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5", getStatusColor(req.status))}>
                             {getStatusIcon(req.status)} {req.status}
                          </div>
                          <span className="text-[10px] font-bold text-muted-foreground">{new Date(req.timestamp).toLocaleDateString()}</span>
                       </div>
                       
                       <div>
                          <h4 className="text-base font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{req.title}</h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                             <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                                <Building2 className="h-3.5 w-3.5" /> {req.eventName}
                             </div>
                             <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                                <AlertCircle className="h-3.5 w-3.5" /> Stall {req.boothNumber}
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="p-6 sm:w-64 bg-accent/5 border-t sm:border-t-0 sm:border-l border-border flex flex-col justify-center gap-4">
                       <div className="flex justify-between sm:flex-col sm:gap-1">
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Request Value</span>
                          <span className="text-xl font-black text-foreground">{req.cost}</span>
                       </div>
                       <GradientButton 
                          onClick={() => setSelectedRequest(req)}
                          className="h-10 w-full text-[10px] font-black uppercase tracking-widest"
                        >
                           View Status <ChevronRight className="ml-1 h-3 w-3" />
                        </GradientButton>
                    </div>
                  </div>
                </GlassCard>
              ))
            )
          ) : (
            filteredLogistics.length === 0 ? (
              <div className="text-center py-20 opacity-30">
                 <Hotel className="h-16 w-16 mx-auto mb-4" />
                 <p className="font-black uppercase tracking-widest">No logistics bookings found</p>
              </div>
            ) : (
              filteredLogistics.map((booking) => (
                <GlassCard key={booking.id} className="p-0 overflow-hidden group" hover={false}>
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="h-40 md:h-full md:w-48 shrink-0 relative overflow-hidden">
                       <img src={booking.image} className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                       <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent md:hidden" />
                       <div className="absolute top-4 left-4 h-8 w-8 rounded-xl glass grid place-items-center">
                          {booking.category === "Hotel" ? <Hotel className="h-4 w-4 text-white" /> : <Plane className="h-4 w-4 text-white" />}
                       </div>
                    </div>

                    <div className="p-6 flex-1 space-y-4">
                       <div className="flex items-center justify-between">
                          <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5", getStatusColor(booking.status))}>
                             {getStatusIcon(booking.status)} {booking.status}
                          </div>
                          <span className="text-[10px] font-black text-primary tracking-widest">{booking.id}</span>
                       </div>
                       
                        <div>
                           <h4 className="text-base font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
                              {booking.serviceName || (booking as any).passTier}
                           </h4>
                           <p className="text-xs font-bold text-muted-foreground mt-1 leading-relaxed">
                              {booking.details || (booking as any).attendeeName}
                           </p>
                        </div>

                       <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {booking.bookingDate}</span>
                          <span className="h-1 w-1 rounded-full bg-border" />
                          <span className="flex items-center gap-1.5"><Receipt className="h-3 w-3" /> Paid</span>
                       </div>
                    </div>

                    <div className="p-6 md:w-64 bg-accent/5 border-t md:border-t-0 md:border-l border-border flex flex-col justify-center gap-4">
                       <div className="flex justify-between md:flex-col md:gap-1">
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Amount</span>
                          <span className="text-xl font-black text-foreground">
                             {booking.price ? `₹${booking.price}` : (booking as any).pricePaid}
                          </span>
                       </div>
                       <div className="flex gap-2">
                          <GradientButton className="h-10 flex-1 text-[10px] font-black uppercase tracking-widest shadow-glow-sm">
                             Voucher
                          </GradientButton>
                          <button className="h-10 w-10 rounded-xl glass border-border hover:bg-accent flex items-center justify-center transition-all">
                             <ExternalLink className="h-4 w-4" />
                          </button>
                       </div>
                    </div>
                  </div>
                </GlassCard>
              ))
            )
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar relative z-10 glass-strong border border-white/10 rounded-[2.5rem] shadow-2xl p-8 md:p-10"
            >
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl gradient-bg shadow-glow flex items-center justify-center">
                       <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase text-primary tracking-widest">Service Status</p>
                       <h3 className="text-2xl font-black tracking-tight">{selectedRequest.title}</h3>
                    </div>
                 </div>
                 <button onClick={() => setSelectedRequest(null)} className="h-10 w-10 rounded-full hover:bg-accent flex items-center justify-center transition-colors">
                    <X className="h-5 w-5" />
                 </button>
              </div>

              {/* Progress Timeline */}
              <div className="mb-10">
                 <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-6">Fulfillment Progress</p>
                 <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border/40" />
                    <div className="space-y-8 relative">
                       {[
                         { label: "Request Placed", date: selectedRequest.timestamp, status: "completed", desc: "Service request initialized in system." },
                         { label: "Vendor Assigned", date: "System Auto-Assigned", status: selectedRequest.assignedVendorId ? "completed" : "current", desc: selectedRequest.assignedVendorId ? `Assigned to ${getVendorById(selectedRequest.assignedVendorId)?.name}` : "Matching with local vendor..." },
                         { label: "Setup In-Progress", date: "T-Minus 48h", status: selectedRequest.status === "Completed" ? "completed" : (selectedRequest.status === "In Progress" ? "current" : "pending"), desc: "Equipment/Service mobilization started." },
                         { label: "Final Handoff", date: selectedRequest.deadline, status: selectedRequest.status === "Completed" ? "completed" : "pending", desc: "Final quality check and exhibitor handoff." }
                       ].map((item, i) => (
                         <div key={i} className="flex gap-6 pl-2">
                            <div className={cn(
                              "h-5 w-5 rounded-full z-10 mt-1 flex items-center justify-center",
                              item.status === "completed" ? "bg-emerald-500 shadow-glow" : (item.status === "current" ? "bg-primary shadow-glow animate-pulse" : "bg-muted border border-border")
                            )}>
                               {item.status === "completed" && <CheckCircle2 className="h-3 w-3 text-white" />}
                            </div>
                            <div>
                               <div className="flex items-center gap-3">
                                  <h4 className={cn("text-sm font-black", item.status === "pending" ? "text-muted-foreground" : "text-foreground")}>{item.label}</h4>
                                  <span className="text-[9px] font-bold text-muted-foreground/60">{item.date === "System Auto-Assigned" ? "Auto" : new Date(item.date).toLocaleDateString()}</span>
                               </div>
                               <p className="text-xs text-muted-foreground font-medium mt-1">{item.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                 {/* Booth Details */}
                 <div className="p-6 rounded-3xl glass border border-white/5 space-y-4">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><MapPin className="h-3 w-3" /> Location Details</p>
                    <div>
                       <p className="text-xs font-black text-foreground">{selectedRequest.eventName}</p>
                       <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase">Stall {selectedRequest.boothNumber}</span>
                          <span className="px-2 py-0.5 rounded-lg bg-accent text-muted-foreground text-[10px] font-black uppercase">Hall B</span>
                       </div>
                    </div>
                 </div>

                 {/* Payment Details */}
                 <div className="p-6 rounded-3xl glass border border-white/5 space-y-4">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><CreditCard className="h-3 w-3" /> Financial Summary</p>
                    <div>
                       <p className="text-xl font-black text-foreground">{selectedRequest.cost}</p>
                       <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Fully Paid</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                 <button className="flex-1 h-14 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all">
                    <Download className="h-4 w-4" /> Download Service Pass
                 </button>
                 <button className="h-14 px-8 rounded-2xl glass border border-border/40 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-accent transition-all">
                    <User className="h-4 w-4" /> Contact Vendor
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </DashboardShell>
  );
}
