"use client";

// Shared reactive data models linking Master operations pipeline with Event-Specific tabs
export type PartnerService = "Vendor" | "Hotel" | "Travel";

export interface GlobalPartner {
  id: string;
  name: string;
  company: string;
  services: PartnerService[];
  providedService?: string;
  type: "Hotel" | "Travel" | "Vendor"; 
  email: string;
  phone: string;
  avatar: string;
  commission: number | string;
  split: string;
  status: string;
  eventId: string; // Legacy field for primary/first event
  assignedEventIds: string[]; // List of all assigned event IDs
  eventsCount: number;
  rating: number;
  bio: string;
  repName: string;
  region: string;
}

const STORAGE_KEY = "eventflow_pro_contracted_partners_v1";

export const INITIAL_GLOBAL_PARTNERS: GlobalPartner[] = [
  { 
    id: "gp-1", 
    eventId: "techsummit-26", 
    assignedEventIds: ["techsummit-26", "fintech-asia"],
    name: "SkyTravel Logistics", 
    company: "SkyTravel Global Hub",
    services: ["Travel", "Vendor"], 
    type: "Travel",
    eventsCount: 8, 
    rating: 4.8, 
    status: "Active Sync", 
    commission: 12, 
    split: "$12,400 Accrued",
    email: "corporate@skytravel.io", 
    phone: "+1 (555) 019-2244",
    avatar: "https://images.unsplash.com/photo-1436491865332-7a61e109cc05?w=120&auto=format&fit=crop&q=80",
    bio: "Global charter flight specialist providing discounted multi-leg routing bundles for incoming conference delegates.",
    repName: "Sarah Jenkins (Enterprise Lead)", 
    region: "North America & Europe"
  },
  { 
    id: "gp-2", 
    eventId: "techsummit-26", 
    assignedEventIds: ["techsummit-26"],
    name: "Grand Marquise Suites", 
    company: "Grand Marquise Hotels",
    services: ["Hotel"], 
    type: "Hotel",
    eventsCount: 12, 
    rating: 4.9, 
    status: "Active Sync", 
    commission: 10,
    split: "$10,100 Accrued",
    email: "reservations@grandmarquise.com", 
    phone: "+1 (555) 431-9900",
    avatar: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&auto=format&fit=crop&q=80",
    bio: "Five-star luxury complex located adjacent to the convention corridor offering automated programmatic API blocks.",
    repName: "Marcus Vance (VP Partnerships)", 
    region: "Downtown Hub"
  },
  { 
    id: "gp-3", 
    eventId: "designweek-26", 
    assignedEventIds: ["designweek-26", "techsummit-26"],
    name: "Peak Visual Vendors", 
    company: "Peak Visual Rigging",
    services: ["Vendor"], 
    type: "Vendor",
    eventsCount: 4, 
    rating: 4.5, 
    status: "Assigned Service Crew", 
    commission: 15,
    split: "$4,500 Base Setup",
    email: "rigging@peakvisuals.de", 
    phone: "+49 89 220199",
    avatar: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=120&auto=format&fit=crop&q=80",
    bio: "High-fidelity lighting, display rigging, and immersive panoramic video screen rental deployments serving assigned client stalls.",
    repName: "Hans Gruber (Staging Architect)", 
    region: "EU Central Zone"
  },
  { 
    id: "gp-4", 
    eventId: "fintech-asia", 
    assignedEventIds: ["fintech-asia"],
    name: "Global Stay Connect", 
    company: "Global Stay Connect Hub",
    services: ["Hotel", "Travel", "Vendor"], 
    type: "Hotel",
    eventsCount: 24, 
    rating: 4.7, 
    status: "Active Sync", 
    commission: 14,
    split: "$18,900 Total Yield",
    email: "partners@globalstay.sg", 
    phone: "+65 6889 1200",
    avatar: "https://images.unsplash.com/photo-1551882532-8dbf0a0c7c72?w=120&auto=format&fit=crop&q=80",
    bio: "Distributed block booking engine syncing with active attendee check-in portals to optimize vacancy yield.",
    repName: "Chloe Tan (Yield Director)", 
    region: "Asia Pacific"
  },
  { 
    id: "gp-5", 
    eventId: "techsummit-26", 
    assignedEventIds: ["techsummit-26"],
    name: "Transit Shuttle Pro", 
    company: "Transit Shuttle Agency",
    services: ["Travel"], 
    type: "Travel",
    eventsCount: 6, 
    rating: 4.6, 
    status: "Active Sync", 
    commission: 10,
    split: "$5,200 Accrued",
    email: "dispatch@transitshuttle.it", 
    phone: "+39 02 1199 4432",
    avatar: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=120&auto=format&fit=crop&q=80",
    bio: "Dedicated private electric shuttle networks looping continuously between destination transport hubs and staging halls.",
    repName: "Mateo Rossi (Fleet Manager)", 
    region: "Milan Metro Loop"
  }
];

export function getPersistedPartners(): GlobalPartner[] {
  if (typeof window === "undefined") return INITIAL_GLOBAL_PARTNERS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Storage parse issue, falling back to seed", err);
  }
  // Store default seed initially
  savePersistedPartners(INITIAL_GLOBAL_PARTNERS);
  return INITIAL_GLOBAL_PARTNERS;
}

export function savePersistedPartners(list: GlobalPartner[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Storage write limitation", err);
  }
}

export function pushNewPartnerToStorage(partner: GlobalPartner): GlobalPartner[] {
  const current = getPersistedPartners();
  const updated = [partner, ...current];
  savePersistedPartners(updated);
  return updated;
}
