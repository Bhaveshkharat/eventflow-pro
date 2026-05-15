"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Hotel, Plane, MapPin, Star, Clock, 
  CheckCircle2, Building2, Ticket, ArrowRight, ShieldCheck, Map,
  ChevronDown, Wifi, Coffee, Car, Shield, X, Check, Search,
  AlertCircle, Users, Navigation, CreditCard, Smartphone, Banknote,
  Minus, Plus, User, Mail, Phone, ChevronLeft, SlidersHorizontal,
  Armchair, RectangleHorizontal, Info, Briefcase, Zap
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { useRole } from "@/hooks/useRole";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  getPersistedServices, 
  CompanionService, 
  ServiceCategory, 
  addBookingToStorage, 
  Booking,
  calculateCommissionedPrice
} from "@/lib/servicesStore";
import { events } from "@/data/mock";

type SortOption = "default" | "price-low" | "price-high" | "luxury";

interface Seat {
  id: string;
  type: "seater" | "sleeper";
  deck: "lower" | "upper";
  row: number;
  col: number; // 1: Left, 2-3: Right (Aisle between 1 and 2)
  isBooked: boolean;
  price: number;
}

// ── HOTEL CARD (MMT STYLE) ──
const HotelCard = ({ hotel, onBook }: { hotel: CompanionService, onBook: (h: CompanionService) => void }) => {
  return (
    <GlassCard className="p-0 overflow-hidden border-border/40 hover:border-primary/40 transition-all group mb-6" hover={false}>
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-80 h-56 md:h-auto relative shrink-0">
          <img src={hotel.image} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={hotel.name} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 flex gap-1">
             {hotel.images?.slice(0, 3).map((img, i) => (
               <div key={i} className="h-10 w-10 rounded border border-white/40 overflow-hidden shadow-lg">
                  <img src={img} className="h-full w-full object-cover" alt="" />
               </div>
             ))}
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black text-foreground tracking-tight">{hotel.name}</h3>
            <div className="flex items-center gap-2 mt-1.5">
               <div className="flex items-center bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                 {hotel.rating} <Star className="h-2.5 w-2.5 fill-white ml-0.5" />
               </div>
               <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">{hotel.rating > 4.5 ? 'VERY GOOD' : 'GOOD'}</span>
               <span className="text-[11px] text-muted-foreground">({hotel.reviewsCount?.toLocaleString()} Reviews)</span>
            </div>

            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" /> {hotel.locationDescription} | <span className="font-bold text-foreground">{hotel.distance} from Venue</span>
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
               {hotel.amenities?.map(a => (
                 <div key={a} className="flex items-center gap-1.5 text-[11px] text-foreground font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {a}
                 </div>
               ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
             <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase tracking-widest border border-blue-500/20">Free Cancellation</span>
             <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Breakfast Included</span>
          </div>
        </div>

        <div className="w-full md:w-56 p-6 bg-accent/20 md:border-l border-border/40 flex flex-col justify-center items-end text-right">
           <div className="mb-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest line-through">₹{(parseInt(hotel.price.replace(/[^\d]/g, '')) * 1.2).toLocaleString()}</p>
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-2xl font-black text-foreground tracking-tighter">{hotel.price}</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">/ NIGHT</span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-1">+ ₹950 taxes & fees</p>
           </div>
           <GradientButton onClick={() => onBook(hotel)} className="w-full h-11 text-[11px] font-black uppercase tracking-widest shadow-glow-sm">
             Select Room
           </GradientButton>
        </div>
      </div>
    </GlassCard>
  );
};

// ── TRAVEL CARD (REDBUS STYLE) ──
const TravelCard = ({ travel, onBook }: { travel: CompanionService, onBook: (t: CompanionService) => void }) => {
  return (
    <GlassCard className="p-0 overflow-hidden border-border/40 hover:border-primary/40 transition-all group mb-4" hover={false}>
      <div className="flex flex-col md:flex-row p-6 items-center gap-6">
        <div className="w-full md:w-48 shrink-0">
          <h4 className="font-black text-foreground text-sm tracking-tight">{travel.name}</h4>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{travel.transitType}</p>
          <div className="flex items-center gap-1 mt-3">
             <div className="flex items-center bg-emerald-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
               <Star className="h-2.5 w-2.5 fill-white mr-0.5" /> {travel.rating}
             </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-between gap-8 w-full">
           <div className="text-center md:text-left">
              <p className="text-lg font-black text-foreground tracking-tighter">{travel.departureTime}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Departure</p>
           </div>
           <div className="flex-1 flex flex-col items-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{travel.duration}</span>
              <div className="relative w-full h-[2px] bg-border/60">
                 <div className="absolute -top-1 left-0 h-2 w-2 rounded-full border-2 border-primary bg-background" />
                 <div className="absolute -top-1 right-0 h-2 w-2 rounded-full border-2 border-primary bg-background" />
              </div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Non-Stop</span>
           </div>
           <div className="text-center md:text-right">
              <p className="text-lg font-black text-foreground tracking-tighter">{travel.arrivalTime}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Arrival</p>
           </div>
        </div>

        <div className="w-full md:w-48 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
           <div className="text-right">
              <p className="text-xl font-black text-foreground tracking-tighter">{travel.price}</p>
              <p className={cn("text-[10px] font-black uppercase tracking-widest mt-0.5", travel.seatsLeft && travel.seatsLeft < 5 ? "text-rose-500" : "text-emerald-500")}>
                {travel.seatsLeft} SEATS LEFT
              </p>
           </div>
           <GradientButton onClick={() => onBook(travel)} className="h-10 px-6 text-[10px] font-black uppercase tracking-widest shadow-glow-sm">
             View Seats
           </GradientButton>
        </div>
      </div>
    </GlassCard>
  );
};

function HotelsTravelCatalogContent() {
  const { role } = useRole();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");
  const [servicesList, setServicesList] = useState<CompanionService[]>([]);
  const [activeFilters, setActiveFilters] = useState<ServiceCategory[]>(["Hotel", "Travel"]);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Advanced Filter State
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedDistances, setSelectedDistances] = useState<string[]>([]);
  const [selectedTransitTypes, setSelectedTransitTypes] = useState<string[]>([]);
  const [selectedDepTime, setSelectedDepTime] = useState<string[]>([]);

  // Booking Flow State
  const [bookingItem, setBookingItem] = useState<CompanionService | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingConfig, setBookingConfig] = useState({ rooms: 1, guests: 1, passengers: 1, class: "" });
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  // RedBus Style Seat State
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [boardingPoint, setBoardingPoint] = useState<string>("");
  const [droppingPoint, setDroppingPoint] = useState<string>("");
  const [passengers, setPassengers] = useState<{name: string, age: string, gender: string}[]>([]);

  const mockBoardingPoints = ["Mumbai Central (09:00 PM)", "Sion (09:30 PM)", "Thane (10:15 PM)", "Vashi (10:45 PM)"];
  const mockDroppingPoints = ["Pune Station (02:00 AM)", "Swargate (02:30 AM)", "Katraj (03:00 AM)"];

  // specialized RedBus Layout (2+1, Lower/Upper)
  const seatLayout = useMemo(() => {
    if (!bookingItem || bookingItem.category !== "Travel" || !["Bus", "Executive Minibus", "Luxury Coach"].includes(bookingItem.transitType || "")) return [];
    const layout: Seat[] = [];
    const basePrice = parseInt(bookingItem.price.replace(/[^\d]/g, ''));
    
    ["lower", "upper"].forEach((deck) => {
      for (let row = 1; row <= 6; row++) {
        // Col 1: Left Side (Single)
        layout.push({
          id: `${deck === "lower" ? "L" : "U"}${row}A`,
          type: row > 3 ? "sleeper" : "seater",
          deck: deck as any, row, col: 1,
          isBooked: Math.random() > 0.8,
          price: row > 3 ? basePrice * 1.6 : basePrice
        });
        // Col 2-3: Right Side (Double)
        [2, 3].forEach(col => {
          layout.push({
            id: `${deck === "lower" ? "L" : "U"}${row}${String.fromCharCode(64 + col)}`,
            type: row > 3 ? "sleeper" : "seater",
            deck: deck as any, row, col,
            isBooked: Math.random() > 0.8,
            price: row > 3 ? basePrice * 1.6 : basePrice
          });
        });
      }
    });
    return layout;
  }, [bookingItem]);

  // Sync passengers with selected seats
  useEffect(() => {
    if (bookingItem?.category === "Travel" && bookingItem.transitType === "Bus") {
      setPassengers(prev => {
        const next = [...prev];
        if (next.length < selectedSeats.length) {
          for (let i = next.length; i < selectedSeats.length; i++) {
            next.push({ name: "", age: "", gender: "Male" });
          }
        } else if (next.length > selectedSeats.length) return next.slice(0, selectedSeats.length);
        return next;
      });
    }
  }, [selectedSeats, bookingItem?.category]);

  useEffect(() => {
    setServicesList(getPersistedServices());
  }, []);

  useEffect(() => {
    if (filterParam === "hotel") setActiveFilters(["Hotel"]);
    else if (filterParam === "travel") setActiveFilters(["Travel"]);
    else setActiveFilters(["Hotel", "Travel"]);
  }, [filterParam]);

  const toggleFilter = (category: ServiceCategory) => {
    setActiveFilters(prev => {
      if (prev.includes(category)) {
        const newFilters = prev.filter(f => f !== category);
        return newFilters.length === 0 ? ["Hotel", "Travel"] : newFilters;
      } else {
        return [...prev, category];
      }
    });
  };

  const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^\d]/g, ''));
  };

  const eventId = searchParams.get("event");
  const currentEvent = useMemo(() => {
    return events.find(e => e.id === eventId) || events[0];
  }, [eventId]);

  const commission = currentEvent?.commissionPercent || 13;

  const filteredAndSortedCatalog = useMemo(() => {
    let result = servicesList.map(item => {
      const basePrice = parseInt(item.price.replace(/[^\d]/g, ''));
      const commissionedPrice = calculateCommissionedPrice(basePrice, commission);
      return {
        ...item,
        price: `₹${commissionedPrice.toLocaleString()}`,
        _isCommissioned: true
      };
    });

    // Filter by Category
    if (activeFilters.length > 0) result = result.filter(item => activeFilters.includes(item.category));

    // Filter by Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.provider.toLowerCase().includes(q) ||
        (item.locationDescription && item.locationDescription.toLowerCase().includes(q)) ||
        (item.route && item.route.toLowerCase().includes(q))
      );
    }

    // Filter by Price
    result = result.filter(item => {
      const price = parsePrice(item.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by Rating
    if (selectedRatings.length > 0) {
      result = result.filter(item => selectedRatings.some(r => item.rating >= r));
    }

    // Filter by Amenities (Hotels only)
    if (selectedAmenities.length > 0) {
      result = result.filter(item => 
        item.category === "Travel" || 
        (item.amenities && selectedAmenities.some(a => item.amenities?.includes(a)))
      );
    }

    // Filter by Distance (Hotels only)
    if (selectedDistances.length > 0) {
      result = result.filter(item => 
        item.category === "Travel" || 
        (item.distance && selectedDistances.some(d => {
           const dist = parseFloat(item.distance || "0");
           if (d === "< 1 mile") return dist < 1;
           if (d === "1-5 miles") return dist >= 1 && dist <= 5;
           return dist > 5;
        }))
      );
    }

    // Filter by Transit Type (Travel only)
    if (selectedTransitTypes.length > 0) {
      result = result.filter(item => 
        item.category === "Hotel" || 
        (item.transitType && selectedTransitTypes.includes(item.transitType))
      );
    }

    // Filter by Departure Time (Travel only)
    if (selectedDepTime.length > 0) {
      result = result.filter(item => {
        if (item.category === "Hotel") return true;
        if (!item.departureTime) return false;
        const hour = parseInt(item.departureTime.split(":")[0]);
        const isPM = item.departureTime.includes("PM");
        const realHour = (isPM && hour !== 12) ? hour + 12 : (!isPM && hour === 12) ? 0 : hour;
        
        return selectedDepTime.some(t => {
           if (t === "Morning") return realHour >= 6 && realHour < 12;
           if (t === "Afternoon") return realHour >= 12 && realHour < 18;
           if (t === "Evening") return realHour >= 18 && realHour < 24;
           return realHour >= 0 && realHour < 6;
        });
      });
    }

    // Sort
    switch (sortBy) {
      case "price-low": result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price)); break;
      case "price-high": result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price)); break;
      case "luxury": result.sort((a, b) => b.rating - a.rating); break;
    }

    return result;
  }, [activeFilters, searchQuery, sortBy, servicesList, priceRange, selectedRatings, selectedAmenities, selectedDistances, selectedTransitTypes, selectedDepTime]);

  const resetBooking = () => {
    setBookingItem(null);
    setBookingStep(1);
    setBookingConfig({ rooms: 1, guests: 1, passengers: 1, class: "" });
    setUserInfo({ name: "", email: "", phone: "" });
    setPaymentMethod(null);
    setSelectedSeats([]);
    setBoardingPoint("");
    setDroppingPoint("");
    setPassengers([]);
  };

  const totalPrice = useMemo(() => {
    if (bookingItem?.category === "Hotel") return parseInt(bookingItem.price.replace(/[^\d]/g, '')) * bookingConfig.rooms;
    if (bookingItem?.transitType === "Bus") return selectedSeats.reduce((sum, s) => sum + s.price, 0);
    // Airplane/Train simple pricing
    const base = parseInt(bookingItem?.price.replace(/[^\d]/g, '') || "0");
    const mult = bookingConfig.class === "Business" ? 2.5 : (bookingConfig.class === "3A" ? 1.8 : 1.0);
    return base * mult * bookingConfig.passengers;
  }, [bookingItem, bookingConfig, selectedSeats]);

  const handleNext = () => {
    if (["Bus", "Executive Minibus", "Luxury Coach"].includes(bookingItem?.transitType || "")) {
       if (bookingStep === 1 && selectedSeats.length === 0) { toast.error("Please select at least one seat"); return; }
       if (bookingStep === 2 && (!boardingPoint || !droppingPoint)) { toast.error("Please select boarding/dropping points"); return; }
    } else if (bookingItem?.category === "Travel") {
       if (bookingStep === 1 && !bookingConfig.class) { toast.error("Please select a travel class"); return; }
    }
    
    if (bookingStep === 3) {
      if (bookingItem?.category === "Travel") {
        if (["Bus", "Executive Minibus", "Luxury Coach"].includes(bookingItem.transitType || "")) {
           const incomplete = passengers.some(p => !p.name || !p.age);
           if (incomplete) { toast.error("Please fill all passenger details"); return; }
        } else {
           if (!userInfo.name) { toast.error("Please provide primary passenger name"); return; }
        }
        if (!userInfo.email || !userInfo.phone) { toast.error("Please provide contact details"); return; }
      } else {
        if (!userInfo.name || !userInfo.email || !userInfo.phone) { toast.error("Please fill all contact details"); return; }
      }
    }
    if (bookingStep === 4) {
       if (!paymentMethod) { toast.error("Please select a payment method"); return; }
       if (!bookingItem) { toast.error("Something went wrong. Please try again."); return; }
       // Save to My Bookings
       const newBooking: Booking = {
          id: `BK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          serviceId: bookingItem.id,
          serviceName: bookingItem.name,
          category: bookingItem.category,
          price: totalPrice.toLocaleString(),
          bookingDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          details: bookingItem.category === "Travel" 
             ? (["Bus", "Executive Minibus", "Luxury Coach"].includes(bookingItem.transitType || "") ? `Seats: ${selectedSeats.map(s => s.id).join(', ')}` : `${bookingConfig.passengers} Passengers, ${bookingConfig.class}`)
             : `${bookingConfig.rooms} Rooms, ${bookingConfig.guests} Guests`,
          status: "Confirmed",
          image: bookingItem.image,
          eventId: eventId || undefined,
          transitType: bookingItem.transitType,
          route: bookingItem.route
       };
       addBookingToStorage(newBooking);

       toast.success("Booking Confirmed! View it in 'My Bookings'");
       resetBooking();
       return;
    }
    setBookingStep(s => s + 1);
  };

  const toggleSeat = (seat: Seat) => {
    if (seat.isBooked) return;
    setSelectedSeats(prev => {
      const exists = prev.find(s => s.id === seat.id);
      if (exists) return prev.filter(s => s.id !== seat.id);
      if (prev.length >= 6) { toast.error("Max 6 seats per booking"); return prev; }
      return [...prev, seat];
    });
  };

  return (
    <DashboardShell title="Stay & Transit" subtitle="Exclusive participant rates in INR. Seamlessly linked to your EventFlow badge.">
      
      {/* List Display & Filters (Same as before) */}
      <div className="flex flex-col gap-6 mb-8 p-6 rounded-2xl bg-background border border-border/60 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-2">Service Type:</span>
            <button onClick={() => toggleFilter("Hotel")} className={cn("flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all border-2", activeFilters.includes("Hotel") ? "bg-primary text-white border-primary shadow-glow-sm" : "bg-accent/40 border-transparent text-muted-foreground hover:bg-accent")}>
              <Hotel className="h-4 w-4" /> Hotels
            </button>
            <button onClick={() => toggleFilter("Travel")} className={cn("flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all border-2", activeFilters.includes("Travel") ? "bg-primary text-white border-primary shadow-glow-sm" : "bg-accent/40 border-transparent text-muted-foreground hover:bg-accent")}>
              <Plane className="h-4 w-4" /> Travel
            </button>
            <div className="h-10 w-[1px] bg-border mx-2 hidden md:block" />
            <a href="/visitor/bookings" className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all border-2 border-emerald-500/30 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500 hover:text-white group">
              <Ticket className="h-4 w-4 group-hover:rotate-12 transition-transform" /> My Bookings
            </a>
          </div>

          <div className="flex-1 max-w-md relative group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
             <input 
               type="text" 
               placeholder="Search by name, city or transit route..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-accent/30 border border-border rounded-xl py-2.5 pl-11 pr-4 text-xs outline-none focus:border-primary transition-all font-medium" 
             />
          </div>

          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <div className="relative">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as SortOption)} 
                className="appearance-none bg-accent/40 border border-border hover:border-primary/40 rounded-xl px-5 py-2.5 pr-12 text-xs font-black outline-none cursor-pointer transition-all"
              >
                <option value="default">Sort: Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="luxury">Luxury (Rating)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 pb-20">
        {/* Flipkart-Style Left Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0 space-y-4">
           <GlassCard className="p-0 border-border/40 overflow-hidden sticky top-24" hover={false}>
              <div className="p-4 border-b border-border/60 bg-accent/20 flex items-center justify-between">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">Filters</h3>
                 <button 
                  onClick={() => {
                    setPriceRange([0, 25000]);
                    setSelectedRatings([]);
                    setSelectedAmenities([]);
                    setSelectedDistances([]);
                    setSelectedTransitTypes([]);
                    setSelectedDepTime([]);
                  }}
                  className="text-[9px] font-bold text-primary uppercase hover:underline"
                 >
                   Clear All
                 </button>
              </div>

              <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                 {/* Price Range */}
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Price Range</h4>
                    <div className="px-2">
                       <input 
                        type="range" min="0" max="25000" step="500"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full accent-primary h-1 bg-accent rounded-lg appearance-none cursor-pointer"
                       />
                       <div className="flex items-center justify-between mt-3">
                          <div className="px-3 py-1.5 rounded-lg bg-accent/40 border border-border text-[10px] font-bold">₹{priceRange[0]}</div>
                          <span className="text-[10px] text-muted-foreground">to</span>
                          <div className="px-3 py-1.5 rounded-lg bg-accent/40 border border-border text-[10px] font-bold">₹{priceRange[1]}</div>
                       </div>
                    </div>
                 </div>

                 {/* Ratings */}
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Customer Rating</h4>
                    <div className="space-y-2.5">
                       {[4, 3, 2].map(star => (
                          <label key={star} className="flex items-center gap-3 cursor-pointer group">
                             <input 
                              type="checkbox" 
                              checked={selectedRatings.includes(star)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedRatings([...selectedRatings, star]);
                                else setSelectedRatings(selectedRatings.filter(r => r !== star));
                              }}
                              className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
                             />
                             <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1.5">
                                {star}★ & above
                             </span>
                          </label>
                       ))}
                    </div>
                 </div>

                 {activeFilters.includes("Hotel") && (
                    <>
                       {/* Amenities */}
                       <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Hotel Amenities</h4>
                          <div className="space-y-2.5">
                             {["Free Wi-Fi", "Pool", "Spa", "Gym", "Breakfast"].map(amenity => (
                                <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                                   <input 
                                    type="checkbox" 
                                    checked={selectedAmenities.includes(amenity)}
                                    onChange={(e) => {
                                      if (e.target.checked) setSelectedAmenities([...selectedAmenities, amenity]);
                                      else setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                                    }}
                                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
                                   />
                                   <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">{amenity}</span>
                                </label>
                             ))}
                          </div>
                       </div>

                       {/* Distance */}
                       <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Distance from Venue</h4>
                          <div className="space-y-2.5">
                             {["< 1 mile", "1-5 miles", "> 5 miles"].map(dist => (
                                <label key={dist} className="flex items-center gap-3 cursor-pointer group">
                                   <input 
                                    type="checkbox" 
                                    checked={selectedDistances.includes(dist)}
                                    onChange={(e) => {
                                      if (e.target.checked) setSelectedDistances([...selectedDistances, dist]);
                                      else setSelectedDistances(selectedDistances.filter(d => d !== dist));
                                    }}
                                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
                                   />
                                   <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">{dist}</span>
                                </label>
                             ))}
                          </div>
                       </div>
                    </>
                 )}

                 {activeFilters.includes("Travel") && (
                    <>
                       {/* Transit Type */}
                       <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Transit Type</h4>
                          <div className="space-y-2.5">
                             {["Airplane", "Bus", "Train", "Private SUV"].map(type => (
                                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                   <input 
                                    type="checkbox" 
                                    checked={selectedTransitTypes.includes(type)}
                                    onChange={(e) => {
                                      if (e.target.checked) setSelectedTransitTypes([...selectedTransitTypes, type]);
                                      else setSelectedTransitTypes(selectedTransitTypes.filter(t => t !== type));
                                    }}
                                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
                                   />
                                   <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">{type}</span>
                                </label>
                             ))}
                          </div>
                       </div>

                       {/* Departure Time */}
                       <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Departure Time</h4>
                          <div className="space-y-2.5">
                             {["Morning", "Afternoon", "Evening", "Night"].map(time => (
                                <label key={time} className="flex items-center gap-3 cursor-pointer group">
                                   <input 
                                    type="checkbox" 
                                    checked={selectedDepTime.includes(time)}
                                    onChange={(e) => {
                                      if (e.target.checked) setSelectedDepTime([...selectedDepTime, time]);
                                      else setSelectedDepTime(selectedDepTime.filter(t => t !== time));
                                    }}
                                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
                                   />
                                   <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">{time}</span>
                                </label>
                             ))}
                          </div>
                       </div>
                    </>
                 )}
              </div>
           </GlassCard>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {eventId && (
             <div className="p-3 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                   <Info className="h-4 w-4 text-primary" />
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pricing Transparency: {currentEvent.title}</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase">
                   +{commission}% Organizer Fee Included
                </div>
             </div>
          )}
          <AnimatePresence mode="popLayout">
            {filteredAndSortedCatalog.length > 0 ? (
              filteredAndSortedCatalog.map(item => (
                <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {item.category === "Hotel" ? <HotelCard hotel={item} onBook={setBookingItem} /> : <TravelCard travel={item} onBook={setBookingItem} />}
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center glass rounded-3xl border border-dashed border-border/60">
                <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-foreground">No matches found</h3>
                <p className="text-[11px] text-muted-foreground mt-1">Try adjusting your filters or search query.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── SPECIALIZED BOOKING MODAL ── */}
      <AnimatePresence>
        {bookingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetBooking} className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-4xl bg-background border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
               
               <div className="p-6 border-b border-border bg-accent/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <button onClick={() => bookingStep > 1 ? setBookingStep(s => s - 1) : resetBooking()} className="h-10 w-10 rounded-full hover:bg-accent flex items-center justify-center"><ChevronLeft className="h-5 w-5" /></button>
                     <div>
                        <h2 className="text-sm font-black uppercase tracking-widest">{bookingItem.name}</h2>
                        <div className="flex gap-1 mt-1">
                           {[1, 2, 3, 4].map(s => <div key={s} className={cn("h-1 w-8 rounded-full transition-all", s <= bookingStep ? "bg-primary shadow-glow-sm" : "bg-border")} />)}
                        </div>
                     </div>
                  </div>
                  <button onClick={resetBooking} className="h-10 w-10 rounded-full hover:bg-accent flex items-center justify-center"><X className="h-5 w-5" /></button>
               </div>

               <div className="p-8 overflow-y-auto no-scrollbar flex-1">
                  
                  {/* STEP 1: TRANSIT SPECIFIC SELECTION */}
                  {bookingStep === 1 && (
                     <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {["Bus", "Executive Minibus", "Luxury Coach"].includes(bookingItem.transitType || "") ? (
                           <div className="flex flex-col lg:flex-row gap-12 items-start">
                              {/* RedBus 2+1 Layout */}
                              <div className="flex-1 flex flex-col md:flex-row gap-10 bg-accent/10 p-8 rounded-[40px] border border-border/50">
                                 {["lower", "upper"].map(deck => (
                                    <div key={deck} className="flex-1">
                                       <div className="flex items-center justify-between mb-4 px-2">
                                          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{deck} Deck</h4>
                                          {deck === "lower" && <div className="h-8 w-8 rounded-full border-2 border-neutral-300 flex items-center justify-center"><Zap className="h-4 w-4 text-neutral-300" /></div>}
                                       </div>
                                       <div className="grid grid-cols-4 gap-3">
                                          {seatLayout.filter(s => s.deck === deck).map(seat => {
                                             const isSelected = selectedSeats.some(s => s.id === seat.id);
                                             return (
                                                <button key={seat.id} onClick={() => toggleSeat(seat)} className={cn("relative rounded-lg border-2 transition-all flex items-center justify-center font-bold text-[8px]", seat.col === 1 ? "col-start-1" : (seat.col === 2 ? "col-start-3" : "col-start-4"), seat.type === "sleeper" ? "h-16" : "h-10", seat.isBooked ? "bg-neutral-200 border-neutral-300 text-neutral-400" : isSelected ? "bg-primary border-primary text-white shadow-glow-sm" : "bg-white border-border text-muted-foreground hover:border-primary/50")}>
                                                   {seat.id}
                                                </button>
                                             );
                                          })}
                                       </div>
                                    </div>
                                 ))}
                              </div>
                              <div className="w-full lg:w-72 space-y-6">
                                 <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Selection Details</h3>
                                 <div className="space-y-3">
                                    {selectedSeats.map(s => (
                                       <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-accent/20 border border-border">
                                          <div><p className="text-xs font-black">Seat {s.id}</p><p className="text-[9px] uppercase font-bold text-muted-foreground">{s.type}</p></div>
                                          <p className="text-xs font-black text-primary">₹{s.price}</p>
                                       </div>
                                    ))}
                                    <div className="pt-4 border-t border-border flex justify-between items-baseline"><span className="text-[10px] font-black uppercase text-muted-foreground">Total Payable</span><span className="text-2xl font-black text-foreground">₹{totalPrice}</span></div>
                                 </div>
                              </div>
                           </div>
                        ) : bookingItem.category === "Hotel" ? (
                           <div className="max-w-2xl mx-auto space-y-8">
                              <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 text-center">
                                 <Hotel className="h-10 w-10 text-primary mx-auto mb-4" />
                                 <h3 className="text-lg font-black tracking-tight">Select Stay Preferences</h3>
                                 <p className="text-xs text-muted-foreground mt-1">Direct booking through partner APIs for {bookingItem.name}</p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Number of Rooms</label>
                                    <div className="flex items-center gap-4 bg-accent/40 p-3 rounded-2xl border border-border">
                                       <button onClick={() => setBookingConfig(p => ({ ...p, rooms: Math.max(1, p.rooms - 1) }))} className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center"><Minus className="h-5 w-5" /></button>
                                       <span className="flex-1 text-center font-black">{bookingConfig.rooms}</span>
                                       <button onClick={() => setBookingConfig(p => ({ ...p, rooms: Math.min(5, p.rooms + 1) }))} className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center"><Plus className="h-5 w-5" /></button>
                                    </div>
                                 </div>
                                 <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Total Guests</label>
                                    <div className="flex items-center gap-4 bg-accent/40 p-3 rounded-2xl border border-border">
                                       <button onClick={() => setBookingConfig(p => ({ ...p, guests: Math.max(1, p.guests - 1) }))} className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center"><Minus className="h-5 w-5" /></button>
                                       <span className="flex-1 text-center font-black">{bookingConfig.guests}</span>
                                       <button onClick={() => setBookingConfig(p => ({ ...p, guests: Math.min(10, p.guests + 1) }))} className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center"><Plus className="h-5 w-5" /></button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ) : (
                           <div className="max-w-2xl mx-auto space-y-8">
                              <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 text-center">
                                 <Plane className="h-10 w-10 text-primary mx-auto mb-4" />
                                 <h3 className="text-lg font-black tracking-tight">Select Travel Preferences</h3>
                                 <p className="text-xs text-muted-foreground mt-1">Direct booking through partner APIs for {bookingItem.transitType}</p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Number of Passengers</label>
                                    <div className="flex items-center gap-4 bg-accent/40 p-3 rounded-2xl border border-border">
                                       <button onClick={() => setBookingConfig(p => ({ ...p, passengers: Math.max(1, p.passengers - 1) }))} className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center"><Minus className="h-5 w-5" /></button>
                                       <span className="flex-1 text-center font-black">{bookingConfig.passengers}</span>
                                       <button onClick={() => setBookingConfig(p => ({ ...p, passengers: Math.min(10, p.passengers + 1) }))} className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center"><Plus className="h-5 w-5" /></button>
                                    </div>
                                 </div>
                                 <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Class / Category</label>
                                    <select value={bookingConfig.class} onChange={e => setBookingConfig(p => ({ ...p, class: e.target.value }))} className="w-full bg-accent/40 border border-border rounded-2xl py-3.5 px-4 text-xs font-black outline-none focus:border-primary appearance-none">
                                       <option value="">Choose Class...</option>
                                       {bookingItem.transitType === "Airplane" ? (<><option value="Economy">Economy</option><option value="Business">Business Class</option><option value="First">First Class</option></>) : 
                                        bookingItem.transitType === "Train" ? (<><option value="SL">Sleeper (SL)</option><option value="3A">3-Tier AC (3A)</option><option value="2A">2-Tier AC (2A)</option><option value="1A">1st Class AC (1A)</option></>) : 
                                        (<option value="Full">Book Full Vehicle</option>)}
                                    </select>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                  )}

                  {/* STEP 2: POINTS & ROUTES (Travel) or DATES (Hotel) */}
                  {bookingStep === 2 && (
                     <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {bookingItem.category === "Hotel" ? (
                           <div className="max-w-xl mx-auto space-y-8">
                              <div className="p-6 rounded-3xl bg-accent/10 border border-border">
                                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 mb-6"><Calendar className="h-4 w-4" /> Select Stay Dates</h4>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Check-in Date</label>
                                       <input type="date" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-primary" defaultValue="2026-11-12" />
                                    </div>
                                    <div>
                                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Check-out Date</label>
                                       <input type="date" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-primary" defaultValue="2026-11-15" />
                                    </div>
                                 </div>
                              </div>
                              <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                                 <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center"><Clock className="h-5 w-5 text-emerald-500" /></div>
                                    <div>
                                       <p className="text-xs font-black">Flexible Check-in</p>
                                       <p className="text-[10px] text-muted-foreground">Early check-in available on request</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ) : (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div className="space-y-4">
                                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><MapPin className="h-4 w-4" /> Boarding Stop</h4>
                                 {mockBoardingPoints.map(p => (
                                    <button key={p} onClick={() => setBoardingPoint(p)} className={cn("w-full p-5 rounded-2xl border-2 text-left transition-all", boardingPoint === p ? "border-primary bg-primary/5" : "border-border bg-accent/10")}>
                                       <p className="text-sm font-black">{p}</p>
                                    </button>
                                 ))}
                              </div>
                              <div className="space-y-4">
                                 <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-2"><MapPin className="h-4 w-4" /> Dropping Stop</h4>
                                 {mockDroppingPoints.map(p => (
                                    <button key={p} onClick={() => setDroppingPoint(p)} className={cn("w-full p-5 rounded-2xl border-2 text-left transition-all", droppingPoint === p ? "border-rose-500 bg-rose-500/5" : "border-border bg-accent/10")}>
                                       <p className="text-sm font-black">{p}</p>
                                    </button>
                                 ))}
                              </div>
                           </div>
                        )}
                     </div>
                  )}

                  {/* STEP 3: PASSENGER DETAILS */}
                  {bookingStep === 3 && (
                     <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
                        {["Bus", "Executive Minibus", "Luxury Coach"].includes(bookingItem.transitType || "") ? (
                           passengers.map((p, i) => (
                              <div key={i} className="p-6 rounded-3xl bg-accent/10 border border-border space-y-4">
                                 <p className="text-[10px] font-black uppercase text-primary">Passenger {i+1} (Seat {selectedSeats[i]?.id})</p>
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input type="text" value={p.name} onChange={e => { const n = [...passengers]; n[i].name = e.target.value; setPassengers(n); }} className="md:col-span-1 bg-background border border-border rounded-xl px-4 py-2.5 text-xs font-bold" placeholder="Full Name" />
                                    <input type="number" value={p.age} onChange={e => { const n = [...passengers]; n[i].age = e.target.value; setPassengers(n); }} className="bg-background border border-border rounded-xl px-4 py-2.5 text-xs font-bold" placeholder="Age" />
                                    <select value={p.gender} onChange={e => { const n = [...passengers]; n[i].gender = e.target.value; setPassengers(n); }} className="bg-background border border-border rounded-xl px-4 py-2.5 text-xs font-bold"><option value="Male">Male</option><option value="Female">Female</option></select>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <div className="max-w-xl mx-auto space-y-4">
                              <input type="text" value={userInfo.name} onChange={e => setUserInfo(p => ({ ...p, name: e.target.value }))} className="w-full bg-accent/20 border border-border rounded-2xl px-5 py-3.5 text-xs font-black" placeholder={bookingItem.category === "Hotel" ? "Primary Guest Name" : "Primary Passenger Name"} />
                           </div>
                        )}
                        <div className="max-w-xl mx-auto grid grid-cols-2 gap-4">
                           <input type="email" value={userInfo.email} onChange={e => setUserInfo(p => ({ ...p, email: e.target.value }))} className="bg-accent/20 border border-border rounded-2xl px-5 py-3.5 text-xs font-black" placeholder="Email Address" />
                           <input type="tel" value={userInfo.phone} onChange={e => setUserInfo(p => ({ ...p, phone: e.target.value }))} className="bg-accent/20 border border-border rounded-2xl px-5 py-3.5 text-xs font-black" placeholder="Phone Number" />
                        </div>
                     </div>
                  )}

                  {/* STEP 4: PAYMENT */}
                  {bookingStep === 4 && (
                     <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl mx-auto space-y-8">
                        <div className="p-8 rounded-[32px] bg-emerald-500/5 border border-emerald-500/20 text-center">
                           <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto mb-4" />
                           <h4 className="text-xl font-black text-foreground">₹{totalPrice.toLocaleString()}</h4>
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Final Payable (Inclusive of Badge Discount)</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                           {["UPI", "Card", "NetBanking"].map(m => (
                              <button key={m} onClick={() => setPaymentMethod(m)} className={cn("flex items-center justify-between p-6 rounded-2xl border-2 transition-all", paymentMethod === m ? "border-primary bg-primary/5" : "border-border hover:border-border-strong")}>
                                 <span className="font-black text-sm">{m}</span>
                                 <div className={cn("h-6 w-6 rounded-full border-2", paymentMethod === m ? "bg-primary border-primary" : "border-border")} />
                              </button>
                           ))}
                        </div>
                     </div>
                  )}
               </div>

               <div className="p-8 border-t border-border bg-accent/5">
                  <GradientButton onClick={handleNext} className="w-full h-14 text-sm font-black uppercase tracking-widest shadow-glow">
                     {bookingStep === 4 ? "Complete Secure Booking" : "Proceed to Next Step"} <ArrowRight className="ml-2 h-5 w-5" />
                  </GradientButton>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}

export default function HotelsTravelCatalog() {
  return (
    <Suspense fallback={<DashboardShell title="Stay & Transit" subtitle="Loading catalog..."><div className="h-96" /></DashboardShell>}>
      <HotelsTravelCatalogContent />
    </Suspense>
  );
}
