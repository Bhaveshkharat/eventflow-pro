export type Event = {
  id: string;
  title: string;
  tagline: string;
  category: string;
  date: string;
  endDate: string;
  city: string;
  country: string;
  venue: string;
  image: string;
  attendees: number;
  exhibitors: number;
  rating: number;
  priceFrom: number;
  featured?: boolean;
  tags: string[];
  stallConfig?: {
    rows: number;
    cols: number;
    stallSize: string; // e.g. "3x3m"
    premiumPrice: number;
    regularPrice: number;
    cornerPrice: number;
    islandPrice?: number;
    inclusions: string[];
  };
  commissionPercent?: number; // Organizer's commission (e.g. 13 for 13%)
  assignedPartnerIds?: string[]; // IDs of assigned Hotel/Travel partners
};

const img = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1600&q=70`;

export const events: Event[] = [
  { id: "techsummit-26", title: "TechSummit 2026", tagline: "Where the future is built.", category: "Technology", date: "2026-06-12", endDate: "2026-06-14", city: "San Francisco", country: "USA", venue: "Moscone Center", image: img("photo-1540575467063-178a50c2df87"), attendees: 18420, exhibitors: 320, rating: 4.9, priceFrom: 299, featured: true, tags: ["AI", "Cloud", "Devtools"], 
    stallConfig: {
      rows: 5,
      cols: 8,
      stallSize: "3x3m",
      premiumPrice: 45000,
      regularPrice: 25000,
      cornerPrice: 32000,
      inclusions: ["1 Executive Table", "2 Premium Chairs", "5A Electrical Point", "Fascia Board Name"]
    },
    commissionPercent: 13,
    assignedPartnerIds: ["h1", "h3", "t1", "t2"]
  },
  { id: "designweek-26", title: "Design Week Milano", tagline: "Form meets function.", category: "Design", date: "2026-04-08", endDate: "2026-04-13", city: "Milan", country: "Italy", venue: "Fiera Milano", image: img("photo-1505373877841-8d25f7d46678"), attendees: 9800, exhibitors: 410, rating: 4.8, priceFrom: 180, featured: true, tags: ["Design", "Architecture"], assignedPartnerIds: ["h2", "t3"] },
  { id: "fintech-asia", title: "FinTech Asia", tagline: "Money, reimagined.", category: "Finance", date: "2026-09-22", endDate: "2026-09-24", city: "Singapore", country: "Singapore", venue: "Marina Bay Sands", image: img("photo-1518770660439-4636190af475"), attendees: 12500, exhibitors: 280, rating: 4.7, priceFrom: 450, featured: true, tags: ["FinTech", "Web3"] },
  { id: "healthx-berlin", title: "HealthX Berlin", tagline: "Healthcare, evolved.", category: "Healthcare", date: "2026-05-18", endDate: "2026-05-20", city: "Berlin", country: "Germany", venue: "Messe Berlin", image: img("photo-1576091160399-112ba8d25d1d"), attendees: 7200, exhibitors: 190, rating: 4.6, priceFrom: 220, tags: ["BioTech", "MedTech"] },
  { id: "greenexpo-26", title: "Green Future Expo", tagline: "Sustainability for tomorrow.", category: "Sustainability", date: "2026-07-03", endDate: "2026-07-05", city: "Amsterdam", country: "Netherlands", venue: "RAI Amsterdam", image: img("photo-1518837695005-2083093ee35b"), attendees: 6500, exhibitors: 150, rating: 4.5, priceFrom: 120, tags: ["ClimateTech"] },
  { id: "gameconf-26", title: "GameConf Tokyo", tagline: "Play the next decade.", category: "Gaming", date: "2026-11-10", endDate: "2026-11-12", city: "Tokyo", country: "Japan", venue: "Tokyo Big Sight", image: img("photo-1542751371-adc38448a05e"), attendees: 22000, exhibitors: 360, rating: 4.9, priceFrom: 199, tags: ["Gaming", "Esports"] },
  { id: "edusummit", title: "EduSummit Dubai", tagline: "Learning without limits.", category: "Education", date: "2026-03-15", endDate: "2026-03-17", city: "Dubai", country: "UAE", venue: "World Trade Centre", image: img("photo-1523580494863-6f3031224c94"), attendees: 5800, exhibitors: 140, rating: 4.4, priceFrom: 99, tags: ["EdTech"] },
  { id: "automotive-26", title: "Automotive Future", tagline: "Mobility for the next era.", category: "Automotive", date: "2026-10-05", endDate: "2026-10-08", city: "Munich", country: "Germany", venue: "Messe München", image: img("photo-1503376780353-7e6692767b70"), attendees: 16800, exhibitors: 290, rating: 4.7, priceFrom: 320, tags: ["EV", "Mobility"] },
];

export type Ticket = { id: string; name: string; price: number; perks: string[]; popular?: boolean };
export const tickets: Ticket[] = [
  { id: "general", name: "General Pass", price: 299, perks: ["All keynotes", "Expo floor access", "Welcome kit"] },
  { id: "pro", name: "Pro Pass", price: 599, perks: ["Everything in General", "Workshops", "Priority seating", "Networking lounge"], popular: true },
  { id: "vip", name: "VIP Pass", price: 1299, perks: ["Everything in Pro", "Speaker dinners", "Backstage access", "Concierge service"] },
];

export type Hotel = { id: string; name: string; distance: string; rating: number; price: number; image: string; perks: string[] };
export const hotels: Hotel[] = [
  { id: "h1", name: "The Grand Marquise", distance: "0.4 km from venue", rating: 4.9, price: 320, image: img("photo-1566073771259-6a8506099945"), perks: ["Free breakfast", "Spa", "Shuttle"] },
  { id: "h2", name: "Aurora Boutique", distance: "1.1 km from venue", rating: 4.7, price: 210, image: img("photo-1551882547-ff40c63fe5fa"), perks: ["Rooftop bar", "Gym"] },
  { id: "h3", name: "Skyline Loft", distance: "0.7 km from venue", rating: 4.8, price: 270, image: img("photo-1564501049412-61c2a3083791"), perks: ["City view", "Workspace"] },
  { id: "h4", name: "Harbor Suites", distance: "1.8 km from venue", rating: 4.6, price: 180, image: img("photo-1582719478250-c89cae4dc85b"), perks: ["Pool", "Bike rental"] },
];

export type AgendaItem = { time: string; title: string; speaker: string; track: string };
export const agenda: AgendaItem[] = [
  { time: "09:00", title: "Opening Keynote: The Next Decade", speaker: "Ada Lovelace", track: "Main Stage" },
  { time: "10:30", title: "Designing for Trust at Scale", speaker: "Hiro Tanaka", track: "Design" },
  { time: "12:00", title: "Lunch & Networking", speaker: "—", track: "Hall B" },
  { time: "13:30", title: "AI in Production", speaker: "Maria Garcia", track: "Engineering" },
  { time: "15:00", title: "Fireside: Building Resilient Teams", speaker: "Jordan Lee", track: "Leadership" },
  { time: "17:00", title: "Closing Reception", speaker: "—", track: "Rooftop" },
];

export const revenueSeries = Array.from({ length: 12 }).map((_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  revenue: Math.round(40000 + Math.sin(i / 1.6) * 18000 + i * 3200),
  tickets: Math.round(800 + Math.cos(i / 1.4) * 280 + i * 60),
}));

export const registrationsSeries = Array.from({ length: 7 }).map((_, i) => ({
  day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i],
  visitors: Math.round(200 + Math.random() * 400),
  exhibitors: Math.round(20 + Math.random() * 40),
}));

export const ticketBreakdown = [
  { name: "General", value: 5400 },
  { name: "Pro", value: 3200 },
  { name: "VIP", value: 980 },
];

export type Attendee = { id: string; name: string; email: string; ticket: string; status: "Checked-in" | "Confirmed" | "Pending"; avatar: string };
export const attendees: Attendee[] = [
  { id: "a1", name: "Olivia Bennett", email: "olivia@aurora.io", ticket: "Pro", status: "Checked-in", avatar: "https://i.pravatar.cc/80?img=47" },
  { id: "a2", name: "Marcus Chen", email: "marcus@nimbus.dev", ticket: "VIP", status: "Confirmed", avatar: "https://i.pravatar.cc/80?img=12" },
  { id: "a3", name: "Sofia Romano", email: "sofia@studio.co", ticket: "General", status: "Pending", avatar: "https://i.pravatar.cc/80?img=32" },
  { id: "a4", name: "Aiden Park", email: "aiden@orbit.ai", ticket: "Pro", status: "Checked-in", avatar: "https://i.pravatar.cc/80?img=15" },
  { id: "a5", name: "Yuki Sato", email: "yuki@kanji.jp", ticket: "VIP", status: "Confirmed", avatar: "https://i.pravatar.cc/80?img=23" },
  { id: "a6", name: "Liam O'Connor", email: "liam@ember.io", ticket: "General", status: "Pending", avatar: "https://i.pravatar.cc/80?img=8" },
];

export type Notification = { id: string; title: string; body: string; time: string; type: "info" | "success" | "warning"; read?: boolean };
export const notifications: Notification[] = [
  { id: "n1", title: "Your VIP ticket is ready", body: "TechSummit 2026 — download your QR pass.", time: "2m ago", type: "success" },
  { id: "n2", title: "New exhibitor at HealthX", body: "Nimbus Bio just joined Hall C.", time: "1h ago", type: "info" },
  { id: "n3", title: "Hotel price drop", body: "Aurora Boutique now $189/night.", time: "3h ago", type: "info", read: true },
  { id: "n4", title: "Schedule update", body: "Keynote moved to 09:30 on Day 2.", time: "Yesterday", type: "warning", read: true },
];

export type Plan = { id: string; name: string; price: number; period: string; tagline: string; features: string[]; popular?: boolean };
export const plans: Plan[] = [
  { id: "starter", name: "Starter", price: 0, period: "free", tagline: "For individuals exploring events.", features: ["Browse all events", "Up to 2 tickets / month", "Basic notifications", "Community support"] },
  { id: "growth", name: "Growth", price: 49, period: "/month", tagline: "For exhibitors building presence.", features: ["Unlimited tickets", "Exhibitor dashboard", "Lead capture (1k/mo)", "Email & chat support", "Custom booth page"], popular: true },
  { id: "scale", name: "Scale", price: 199, period: "/month", tagline: "For organizers running expos.", features: ["Multi-event management", "Advanced analytics", "Hotel & travel module", "QR check-in suite", "Priority 24/7 support", "API access"] },
];

export const testimonials = [
  { name: "Elena Vasquez", role: "Head of Events, Lumen", quote: "The most polished event platform we've used. Setup took an afternoon.", avatar: "https://i.pravatar.cc/100?img=5" },
  { name: "Rohan Mehta", role: "Founder, Orbit Expos", quote: "Our exhibitors love the lead capture flow. Renewals jumped 38%.", avatar: "https://i.pravatar.cc/100?img=11" },
  { name: "Naomi Park", role: "VP Marketing, Nimbus", quote: "Beautiful UI, real depth. Analytics finally feel actionable.", avatar: "https://i.pravatar.cc/100?img=20" },
];

export const stats = [
  { label: "Events powered", value: "2,400+" },
  { label: "Tickets issued", value: "1.2M" },
  { label: "Exhibitors", value: "18,500" },
  { label: "Cities", value: "94" },
];

export type Role = "visitor" | "exhibitor" | "delegate" | "speaker" | "organizer" | "hotel-agent" | "travel-agent" | "vendor" | "volunteer" | "superadmin";

export type Booth = { id: string; eventId: string; exhibitorId: string; number: string; size: string; status: "Confirmed" | "Pending" | "Allocated" };
export const booths: Booth[] = [
  { id: "b1", eventId: "techsummit-26", exhibitorId: "ex1", number: "A-101", size: "3x3m", status: "Allocated" },
  { id: "b2", eventId: "techsummit-26", exhibitorId: "ex2", number: "B-205", size: "6x3m", status: "Confirmed" },
];

export type Session = { id: string; eventId: string; title: string; time: string; speaker: string; status: "Upcoming" | "Live" | "Completed" };
export const sessions: Session[] = [
  { id: "s1", eventId: "techsummit-26", title: "Future of AI", time: "10:00 AM", speaker: "Ada Lovelace", status: "Upcoming" },
  { id: "s2", eventId: "techsummit-26", title: "Cloud Scale", time: "11:30 AM", speaker: "Maria Garcia", status: "Live" },
];

export type Inquiry = { id: string; user: string; type: "Hotel" | "Travel"; item: string; date: string; status: "Pending" | "Confirmed" | "Rejected" };
export const inquiries: Inquiry[] = [
  { id: "i1", user: "Olivia Bennett", type: "Hotel", item: "The Grand Marquise (2 nights)", date: "2026-06-12", status: "Confirmed" },
  { id: "i2", user: "Marcus Chen", type: "Travel", item: "SFO Flight Package", date: "2026-06-11", status: "Pending" },
];

export type Task = { id: string; event: string; title: string; deadline: string; status: "To Do" | "In Progress" | "Completed" };
export const vendorTasks: Task[] = [
  { id: "t1", event: "TechSummit 2026", title: "Sound System Setup - Hall A", deadline: "2026-06-11", status: "In Progress" },
  { id: "t2", event: "TechSummit 2026", title: "Exhibitor Banner Printing", deadline: "2026-06-10", status: "Completed" },
];

export type Settlement = { id: string; recipient: string; role: string; amount: number; date: string; status: "Pending" | "Paid" };
export const settlements: Settlement[] = [
  { id: "set1", recipient: "Lumen Tech", role: "Exhibitor", amount: 4500, date: "2026-07-01", status: "Paid" },
  { id: "set2", recipient: "Grand Marquise", role: "Hotel Agent", amount: 12400, date: "2026-07-15", status: "Pending" },
  { id: "set3", recipient: "SkyTravel", role: "Travel Agent", amount: 8200, date: "2026-07-15", status: "Pending" },
];

export type Organizer = { id: string; name: string; email: string; status: "Pro" | "Enterprise" | "Trial"; events: number; revenue: number; logo: string; joinedDate: string };
export const superAdminOrganizers: Organizer[] = [
  { id: "org1", name: "Lumen Events", email: "contact@lumenevents.com", status: "Pro", events: 12, revenue: 42000, logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Lumen", joinedDate: "2024-01-15" },
  { id: "org2", name: "Orbit Expos", email: "admin@orbitexpos.com", status: "Enterprise", events: 45, revenue: 184000, logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Orbit", joinedDate: "2023-11-02" },
  { id: "org3", name: "Studio Co", email: "hello@studioco.io", status: "Trial", events: 2, revenue: 850, logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Studio", joinedDate: "2024-05-10" },
];
