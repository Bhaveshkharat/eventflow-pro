"use client";

export type ServiceCategory = "Hotel" | "Travel";

export interface CompanionService {
  id: string;
  category: ServiceCategory;
  name: string;
  provider: string;
  price: string;
  rating: number;
  image: string;
  images?: string[];
  description?: string;
  tags: string[];
  // Hotel specific (MMT style)
  distance?: string;
  amenities?: string[];
  reviewsCount?: number;
  locationDescription?: string;
  // Travel specific (RedBus style)
  route?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  seatsLeft?: number;
  transitType?: string; // e.g., Luxury AC Bus, Private SUV
  vendorId?: string;
}

const STORAGE_KEY = "eventflow_pro_services_catalog_v1";

const INITIAL_SERVICES: CompanionService[] = [
  {
    id: "h1",
    category: "Hotel",
    name: "The Grand Marquise",
    provider: "Marquise Hospitality",
    price: "₹18,500",
    rating: 4.9,
    reviewsCount: 1240,
    locationDescription: "Central Business District, Near Expo Center",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Experience unparalleled luxury in the heart of the city. Our flagship property offers world-class amenities and service.",
    tags: ["5-Star", "Official Partner", "Luxury"],
    distance: "0.2 miles",
    amenities: ["Spa", "Executive Lounge", "Fast Wi-Fi", "Free Parking"],
    vendorId: "v-hotel-1"
  },
  {
    id: "h2",
    category: "Hotel",
    name: "Aura Boutique Suites",
    provider: "Aura Group",
    price: "₹8,500",
    rating: 4.7,
    reviewsCount: 850,
    locationDescription: "Riverside District, 10 mins from Venue",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80",
    description: "Modern elegance meets business convenience. Perfect for the professional traveler.",
    tags: ["Boutique", "Business Rate"],
    distance: "1.5 miles",
    amenities: ["24/7 Gym", "Co-working Space", "Breakfast Included"],
    vendorId: "v-hotel-1"
  },
  {
    id: "t1",
    category: "Travel",
    name: "Intercity Gold Class",
    provider: "LuxeTransit",
    price: "₹2,400",
    rating: 4.8,
    seatsLeft: 12,
    transitType: "Premium AC Sleeper",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
    tags: ["On-time", "Water Bottle"],
    route: "Downtown Terminal → Airport",
    departureTime: "08:30 AM",
    arrivalTime: "10:45 AM",
    duration: "2h 15m",
    vendorId: "v-travel-1"
  },
  {
    id: "t2",
    category: "Travel",
    name: "Event Express Shuttle",
    provider: "City Fleet",
    price: "₹850",
    rating: 4.5,
    seatsLeft: 4,
    transitType: "Executive Minibus",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80",
    tags: ["Frequent", "Eco-Friendly"],
    route: "North Hub ⇄ Expo Center",
    departureTime: "09:00 AM",
    arrivalTime: "09:30 AM",
    duration: "30m",
    vendorId: "v-travel-2"
  },
  {
    id: "h3",
    category: "Hotel",
    name: "Neon City Pods",
    provider: "MicroStays",
    price: "₹4,200",
    rating: 4.3,
    reviewsCount: 2100,
    locationDescription: "Tech Hub, Directly across Metro",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80",
    description: "Compact, tech-forward, and centrally located. The future of urban stay.",
    tags: ["Budget", "Modern"],
    distance: "0.5 miles",
    amenities: ["Smart Pods", "Cafe", "Digital Key"]
  },
  {
    id: "t3",
    category: "Travel",
    name: "Regional SkyLink",
    provider: "AeroLink",
    price: "₹8,900",
    rating: 4.9,
    seatsLeft: 2,
    transitType: "Business Class Shuttle",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80",
    tags: ["Fastest", "Wifi"],
    route: "Secondary Airport ⇄ Main Hub",
    departureTime: "02:15 PM",
    arrivalTime: "03:00 PM",
    duration: "45m"
  },
  {
    id: "t4",
    category: "Travel",
    name: "Royal Sleeper Coach",
    provider: "InterCity Luxury",
    price: "₹1,250",
    rating: 4.8,
    seatsLeft: 12,
    transitType: "Luxury Coach",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
    tags: ["Comfort", "Sleeper"],
    route: "Mumbai ⇄ Venue",
    departureTime: "09:00 PM",
    description: "Premium sleeper coach with AC, blankets, and individual charging points."
  }
];

export function getPersistedServices(): CompanionService[] {
  if (typeof window === "undefined") return INITIAL_SERVICES;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error("Storage error", err);
  }
  savePersistedServices(INITIAL_SERVICES);
  return INITIAL_SERVICES;
}

export function savePersistedServices(services: CompanionService[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
}

export function addServiceToStorage(service: CompanionService): CompanionService[] {
  const current = getPersistedServices();
  const updated = [service, ...current];
  savePersistedServices(updated);
  return updated;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  price: string;
  bookingDate: string;
  details: string; // e.g., "Seat 12A, 12B" or "2 Rooms, 4 Guests"
  status: "Confirmed" | "Pending" | "Cancelled";
  image: string;
  eventId?: string;
  transitType?: string;
  route?: string;
}

const BOOKINGS_KEY = "eventflow_pro_user_bookings_v1";

export function getPersistedBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Booking storage error", err);
    return [];
  }
}

export function addBookingToStorage(booking: Booking) {
  if (typeof window === "undefined") return;
  const current = getPersistedBookings();
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify([booking, ...current]));
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  specialties: string[];
  rating: number;
}

export const MOCK_VENDORS: Vendor[] = [
  { id: "v-1", name: "Apex Infrastructure", contactPerson: "John Doe", phone: "+91 98765 43210", email: "john@apex.com", specialties: ["Technical", "Electrical"], rating: 4.8 },
  { id: "v-2", name: "Elite Decor & Furniture", contactPerson: "Jane Smith", phone: "+91 87654 32109", email: "jane@elitedecor.com", specialties: ["Furniture"], rating: 4.9 },
  { id: "v-3", name: "Global Connectivity Hub", contactPerson: "Robert Brown", phone: "+91 76543 21098", email: "robert@globalconnect.net", specialties: ["Technical", "Network"], rating: 4.7 }
];

export function getVendorById(id: string): Vendor | undefined {
  return MOCK_VENDORS.find(v => v.id === id);
}

export interface ExhibitorRequest {
  id: string;
  exhibitorName: string;
  boothNumber: string;
  eventName: string;
  eventId: string;
  title: string;
  category: string;
  status: "Unassigned" | "Assigned" | "In Progress" | "Completed" | "Pending";
  assignedVendorId?: string;
  cost: string;
  deadline: string;
  timestamp: string;
}

const EXHIBITOR_REQUESTS_KEY = "eventflow_pro_exhibitor_requests_v1";

export function getPersistedExhibitorRequests(): ExhibitorRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(EXHIBITOR_REQUESTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Exhibitor requests storage error", err);
    return [];
  }
}

export function addExhibitorRequestToStorage(req: ExhibitorRequest) {
  if (typeof window === "undefined") return;
  const current = getPersistedExhibitorRequests();
  localStorage.setItem(EXHIBITOR_REQUESTS_KEY, JSON.stringify([req, ...current]));
}

export function assignVendorToRequest(requestId: string, vendorId: string) {
  if (typeof window === "undefined") return;
  const current = getPersistedExhibitorRequests();
  const updated = current.map(r => r.id === requestId ? { ...r, assignedVendorId: vendorId, status: "Assigned" as const } : r);
  localStorage.setItem(EXHIBITOR_REQUESTS_KEY, JSON.stringify(updated));
}

export function updateExhibitorRequestStatus(id: string, status: ExhibitorRequest["status"]) {
  if (typeof window === "undefined") return;
  const current = getPersistedExhibitorRequests();
  const updated = current.map(r => r.id === id ? { ...r, status } : r);
  localStorage.setItem(EXHIBITOR_REQUESTS_KEY, JSON.stringify(updated));
}

// ── VENDOR SERVICE CATALOG ──

export interface VendorServiceOffer {
  id: string;
  name: string;
  category: "Technical" | "Furniture" | "Electrical" | "Network" | "Branding";
  pricingType: "Per Day" | "Per Event" | "Package";
  basePrice: number; // The price the vendor gets
  currency: string;
  description: string;
  status: "Active" | "Draft";
}

const VENDOR_SERVICES_KEY = "eventflow_pro_vendor_services_v1";

const DEFAULT_VENDOR_SERVICES: VendorServiceOffer[] = [
  {
    id: "vs-1",
    name: "High-Voltage Electrical Drop (15A)",
    category: "Electrical",
    pricingType: "Per Day",
    basePrice: 350,
    currency: "INR",
    description: "Standard 15A power drop with 3-pin socket for booth equipment.",
    status: "Active"
  },
  {
    id: "vs-2",
    name: "Standard Furniture Bundle (Compact)",
    category: "Furniture",
    pricingType: "Per Event",
    basePrice: 2500,
    currency: "INR",
    description: "Includes 2 chairs, 1 draped table, and 1 waste basket for the entire duration.",
    status: "Active"
  },
  {
    id: "vs-3",
    name: "Dedicated Fiber WiFi (100Mbps)",
    category: "Network",
    pricingType: "Per Event",
    basePrice: 8500,
    currency: "INR",
    description: "Dedicated high-speed fiber link with private SSID for your booth staff and visitors.",
    status: "Active"
  },
  {
    id: "vs-4",
    name: "Premium LED Wall (2x2m)",
    category: "Technical",
    pricingType: "Per Day",
    basePrice: 12000,
    currency: "INR",
    description: "High-resolution P2.5 LED wall for stunning video displays and brand visuals.",
    status: "Active"
  },
  {
    id: "vs-5",
    name: "Vinyl Branding (Fascia Name Plate)",
    category: "Branding",
    pricingType: "Package",
    basePrice: 1200,
    currency: "INR",
    description: "Custom vinyl printing for your booth fascia with your company logo and name.",
    status: "Active"
  }
];

export function getPersistedVendorServices(): VendorServiceOffer[] {
  if (typeof window === "undefined") return DEFAULT_VENDOR_SERVICES;
  try {
    const data = localStorage.getItem(VENDOR_SERVICES_KEY);
    return data ? JSON.parse(data) : DEFAULT_VENDOR_SERVICES;
  } catch (err) {
    return DEFAULT_VENDOR_SERVICES;
  }
}

export function savePersistedVendorServices(services: VendorServiceOffer[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(VENDOR_SERVICES_KEY, JSON.stringify(services));
}

/**
 * Calculates the price shown to the exhibitor (Base Price + Commission)
 */
export function calculateCommissionedPrice(basePrice: number, commissionPercent: number): number {
  return Math.ceil(basePrice * (1 + (commissionPercent / 100)));
}
