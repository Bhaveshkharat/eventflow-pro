import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Ticket, Users, Building2, Hotel, BarChart3, 
  ScanLine, Bell, Settings, Sparkles, Menu, X, Search, 
  Mic2, Briefcase, ShieldCheck, Truck, Plane, Calendar, DollarSign, FileText,
  ChevronLeft, ChevronRight, LogOut, HelpCircle, User, Layers, PackageCheck
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useRole } from "@/hooks/useRole";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Role } from "@/data/mock";

interface NavItem {
  to: string;
  label: string;
  icon: any;
  badge?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const roleNavGroups: Record<Role, NavGroup[]> = {
  organizer: [
    {
      group: "Overview",
      items: [
        { to: "/organizer", label: "Dashboard", icon: LayoutDashboard },
        { to: "/analytics", label: "Real-time Stats", icon: BarChart3, badge: "Live" },
      ]
    },
    {
      group: "Master",
      items: [
        { to: "/organizer/roles", label: "Roles", icon: User, badge: "RBAC" },
        { to: "/organizer/users", label: "Users", icon: Users },
      ]
    },
    {
      group: "Management",
      items: [
        { to: "/organizer/events", label: "Events Portfolio", icon: Calendar },
        { to: "/organizer/participants", label: "Event Participants", icon: Users },
        { to: "/organizer/operations", label: "Partner Hub", icon: Briefcase },
        { to: "/qr-verify", label: "Check-in Suite", icon: ScanLine },
      ]
    },
    {
      group: "Financials",
      items: [
        { to: "/organizer/settlements", label: "Finance & Payouts", icon: DollarSign },
      ]
    }
  ],
  visitor: [
    {
      group: "Discovery",
      items: [
        { to: "/events", label: "Upcoming Events", icon: Calendar, badge: "New" },
      ]
    },
    {
      group: "My Account",
      items: [
        { to: "/visitor", label: "My Bookings", icon: Ticket },
        { to: "/hotels-travel-catalog", label: "Hotels & Travel", icon: Hotel, badge: "New" },
        { to: "/notifications", label: "Updates", icon: Bell, badge: "3" },
        { to: "/settings", label: "Profile Settings", icon: Settings },
      ]
    }
  ],
  // Fallbacks for other roles (simplified for now)
  exhibitor: [
    {
      group: "Execution",
      items: [
        { to: "/exhibitor", label: "Dashboard", icon: LayoutDashboard },
        { to: "/exhibitor/booth", label: "Booth Management", icon: Building2 },
        { to: "/exhibitor/leads", label: "Smart Lead Capture", icon: ScanLine, badge: "Lens" },
      ]
    },
    {
      group: "Logistics",
      items: [
        { to: "/exhibitor/bookings", label: "My Bookings", icon: PackageCheck },
        { to: "/exhibitor/billing", label: "Invoices & Settlements", icon: DollarSign },
      ]
    }
  ],
  delegate: [{ group: "Main", items: [{ to: "/delegate", label: "Passes", icon: ShieldCheck }, { to: "/hotels-travel-catalog", label: "Hotels & Travel", icon: Hotel }] }],
  speaker: [
    { 
      group: "Operations", 
      items: [
        { to: "/speaker", label: "Speaker Hub", icon: Mic2 },
        { to: "/speaker/sessions", label: "My Sessions", icon: Calendar, badge: "Full Details" },
        { to: "/hotels-travel-catalog", label: "Hotels & Travel", icon: Hotel }
      ] 
    }
  ],
  "hotel-agent": [{ group: "Main", items: [{ to: "/hotel-agent", label: "Hotels", icon: Hotel }, { to: "/hotel-agent/events", label: "Assigned Events", icon: Calendar }] }],
  "travel-agent": [{ group: "Main", items: [{ to: "/travel-agent", label: "Travel", icon: Plane }, { to: "/travel-agent/events", label: "Assigned Events", icon: Calendar }] }],
  vendor: [
    { 
      group: "Execution", 
      items: [
        { to: "/vendor", label: "Service Execution", icon: Truck },
        { to: "/vendor/catalog", label: "Service Catalog", icon: Layers, badge: "Prices" },
        { to: "/vendor/events", label: "Assigned Events", icon: Calendar },
        { to: "/vendor/billing", label: "Billing & Settlement", icon: DollarSign, badge: "Invoices" },
        { to: "/vendor/history", label: "Fulfillment History", icon: FileText }
      ] 
    }
  ],
  volunteer: [{ group: "Main", items: [{ to: "/volunteer", label: "Tasks", icon: Users }] }],
  superadmin: [
    { 
      group: "Admin", 
      items: [
        { to: "/super-admin", label: "Platform", icon: ShieldCheck },
        { to: "/super-admin/organizers", label: "Organizers", icon: Users }
      ] 
    }
  ]
};

export function DashboardShell({ children, title, subtitle, backLink }: { children: React.ReactNode; title: string; subtitle?: string; backLink?: string }) {
  const path = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { role, setRole } = useRole();
  const router = useRouter();

  const handleRoleSwitch = (newRole: Role) => {
    setRole(newRole);
    // Map roles to their entry-point dashboards
    const routes: Record<string, string> = {
      organizer: "/organizer",
      visitor: "/visitor",
      exhibitor: "/exhibitor",
      speaker: "/speaker",
      vendor: "/vendor",
      "hotel-agent": "/hotel-agent",
      "travel-agent": "/travel-agent",
      delegate: "/delegate",
      volunteer: "/volunteer",
      superadmin: "/super-admin"
    };
    if (routes[newRole]) router.push(routes[newRole]);
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const currentGroups = roleNavGroups[role] || roleNavGroups.visitor;

  // Automated Role Switch based on URL + Onboarding Lock logic
  useEffect(() => {
    if (path.startsWith("/exhibitor") && role !== "exhibitor") setRole("exhibitor");
    if (path.startsWith("/vendor") && role !== "vendor") setRole("vendor");
    if (path.startsWith("/organizer") && role !== "organizer") setRole("organizer");
    if (path.startsWith("/visitor") && role !== "visitor") setRole("visitor");
    if (path.startsWith("/speaker") && role !== "speaker") setRole("speaker");
    if (path.startsWith("/hotel-agent") && role !== "hotel-agent") setRole("hotel-agent");
    if (path.startsWith("/travel-agent") && role !== "travel-agent") setRole("travel-agent");
  }, [path, role, setRole]);

  // Check if first booking is completed
  const [hasCompletedBooking, setHasCompletedBooking] = useState(true);
  useEffect(() => {
    const bookings = localStorage.getItem("eventflow_pro_user_bookings_v1");
    const stallBookings = localStorage.getItem("eventflow_pro_exhibitor_requests_v1"); // Simplified check
    
    // If on a restricted role dashboard, check if they have anything booked
    if (role === "visitor" || role === "exhibitor") {
       const hasAny = (bookings && JSON.parse(bookings).length > 0) || 
                      (stallBookings && JSON.parse(stallBookings).length > 0);
       // setHasCompletedBooking(!!hasAny);
       // For demo purposes, I'll allow everything if they are ALREADY on the dashboard
       // but restricted nav items will be hidden if not booked.
    }
  }, [role]);

  // Filter groups if onboarding is locked - Memoized for speed
  const filteredGroups = useMemo(() => {
    if (typeof window === "undefined") return currentGroups;

    const visitorBookings = localStorage.getItem("eventflow_pro_user_bookings_v1");
    const exhibitorBookings = localStorage.getItem("eventflow_pro_exhibitor_requests_v1");
    
    const hasAny = (visitorBookings && JSON.parse(visitorBookings).length > 0) || 
                   (exhibitorBookings && JSON.parse(exhibitorBookings).length > 0) ||
                   (role === "organizer" || role === "vendor" || role === "superadmin"); 

    if (!hasAny && ["visitor", "exhibitor", "delegate", "speaker"].includes(role)) {
       // Return only a "Getting Started" or empty list to hide the sidebar logic
       return [];
    }
    
    return currentGroups;
  }, [currentGroups, role]);

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* Desktop Sidebar */}
      {!isMobile && filteredGroups.length > 0 && (
        <motion.aside 
          initial={false}
          animate={{ width: isCollapsed ? 88 : 280 }}
          className="sticky top-0 h-screen shrink-0 flex flex-col border-r border-white/5 bg-sidebar/40 backdrop-blur-3xl z-40 overflow-hidden"
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {/* Sidebar Header */}
          <div className={cn("px-6 py-8 flex items-center justify-between transition-all", isCollapsed && "px-0 justify-center")}>
            <div className="flex items-center gap-3.5 overflow-hidden">
              <div className="shrink-0 grid h-10 w-10 place-items-center rounded-xl gradient-bg shadow-glow ring-4 ring-primary/10">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              {!isCollapsed && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col whitespace-nowrap">
                  <span className="font-bold text-base tracking-tight leading-tight">EventFlow Pro</span>
                  <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase opacity-70">Management</span>
                </motion.div>
              )}
            </div>
            
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "h-7 w-7 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition-all",
                isCollapsed && "absolute -right-3.5 top-10 shadow-lg z-50 border border-white/10"
              )}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Search (Sidebar) */}
          {!isCollapsed && (
            <div className="px-6 mb-6">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  placeholder="Quick search..." 
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-xs outline-none focus:border-primary/30 focus:bg-white/10 transition-all"
                />
              </div>
            </div>
          )}

          {/* Navigation with Groups */}
          <div className="flex-1 px-4 space-y-8 overflow-y-auto no-scrollbar py-2">
            {filteredGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1.5">
                {!isCollapsed && (
                  <h3 className="px-3 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-3">
                    {group.group}
                  </h3>
                )}
                {group.items.map(item => {
                  const active = path === item.to;
                  return (
                    <Link key={item.to} href={item.to} className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all relative",
                      active ? "text-foreground bg-white/5 shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}>
                      {active && (
                        <motion.div 
                          layoutId="sidebar-active" 
                          className="absolute inset-y-2 left-0 w-1 bg-primary rounded-full" 
                        />
                      )}
                      <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", active ? "text-primary" : "group-hover:text-primary/70")} />
                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between overflow-hidden">
                          <span className={cn("font-medium truncate transition-all", active && "font-semibold")}>{item.label}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-primary/10 text-primary border border-primary/20">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="fixed left-20 px-3 py-1.5 bg-background border border-white/10 rounded-lg text-xs font-medium shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap pointer-events-none">
                          {item.label}
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-background border-l border-b border-white/10 rotate-45" />
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Footer / Profile Area */}
          <div className="mt-auto p-4 border-t border-white/5 bg-white/[0.02]">
            {!isCollapsed ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 p-2.5 rounded-xl glass-strong border border-white/5">
                  <div className="h-9 w-9 rounded-lg overflow-hidden border border-white/10 shadow-elegant relative ring-2 ring-primary/20">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`} alt="Avatar" />
                    <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border-2 border-background" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold truncate">Shreyash Mane</p>
                    <p className="text-[10px] text-muted-foreground font-medium capitalize">{role.replace("-", " ")}</p>
                  </div>
                  <Settings className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                </div>
                
                <div className="px-2 py-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-[11px] font-medium text-muted-foreground hover:text-foreground cursor-pointer">Support</span>
                  </div>
                  <LogOut className="h-4 w-4 text-destructive/70 cursor-pointer hover:text-destructive transition-colors" />
                </div>

                <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                  <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-2">Simulation Role</p>
                  <select value={role} onChange={e => handleRoleSwitch(e.target.value as any)}
                    className="w-full bg-transparent text-[11px] font-bold capitalize outline-none cursor-pointer hover:text-primary transition-colors">
                    {Object.keys(roleNavGroups).map(r => <option key={r} value={r} className="bg-background text-foreground">{r.replace("-", " ")}</option>)}
                  </select>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 rounded-xl overflow-hidden border border-white/10 shadow-elegant relative group cursor-pointer ring-2 ring-transparent hover:ring-primary/40 transition-all">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`} alt="Avatar" />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <LogOut className="h-5 w-5 text-destructive/60 hover:text-destructive transition-all cursor-pointer" />
              </div>
            )}
          </div>
        </motion.aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 lg:px-12 bg-background/40 backdrop-blur-md border-b border-white/5 lg:border-none">
          <div className="flex items-center gap-4">
            {isMobile && (
               <div className="grid h-9 w-9 place-items-center rounded-xl gradient-bg shadow-glow mr-1">
                 <Sparkles className="h-5 w-5 text-white" />
               </div>
            )}
            <div>
              {backLink && (
                <Link href={backLink} className="text-[10px] font-bold text-primary flex items-center gap-1 mb-0.5 hover:underline uppercase tracking-wider">
                  <ChevronLeft className="h-3 w-3" /> Back
                </Link>
              )}
              <h1 className="text-xl lg:text-3xl font-bold tracking-tight">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            <div className="h-10 w-10 rounded-xl glass grid place-items-center relative cursor-pointer hover:bg-white/5 transition-all">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary border-2 border-background shadow-glow" />
            </div>
            <ThemeToggle />
            <div className="lg:hidden h-9 w-9 rounded-xl overflow-hidden border border-white/10 shadow-elegant">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`} alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="flex-1 px-6 lg:px-12 py-8 pb-32 lg:pb-12 overflow-y-auto no-scrollbar">
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 5 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-sm lg:text-base text-muted-foreground mb-8 max-w-2xl leading-relaxed font-medium opacity-80"
            >
              {subtitle}
            </motion.p>
          )}
          {children}
        </div>

        {/* Mobile Island Bottom Navigation */}
        {isMobile && (
          <div className="fixed bottom-6 left-6 right-6 z-50 flex justify-center">
            <nav className="flex items-center gap-1 p-1.5 glass-strong rounded-[2.5rem] shadow-2xl border border-white/10 max-w-sm w-full">
               {filteredGroups[0].items.slice(0, 4).map(item => {
                 const active = path === item.to;
                 return (
                   <Link key={item.to} href={item.to} className={cn(
                     "flex-1 flex flex-col items-center justify-center py-2 rounded-[1.8rem] transition-all relative overflow-hidden",
                     active ? "text-primary shadow-inner" : "text-muted-foreground hover:text-foreground"
                   )}>
                     {active && <motion.div layoutId="mobile-nav-glow" className="absolute inset-0 bg-primary/10" />}
                     <item.icon className={cn("h-5 w-5 relative z-10 transition-transform", active && "scale-110")} />
                     <span className="text-[8px] font-bold uppercase tracking-widest mt-1 relative z-10">{item.label.split(' ')[0]}</span>
                   </Link>
                 );
               })}
               <div className="w-[1px] h-6 bg-white/10 mx-1" />
               <button className="flex-1 flex flex-col items-center justify-center py-2 text-muted-foreground rounded-[1.8rem] hover:bg-white/5 transition-all">
                 <Menu className="h-5 w-5" />
                 <span className="text-[8px] font-bold uppercase tracking-widest mt-1">More</span>
               </button>
            </nav>
          </div>
        )}
      </main>
    </div>
  );
}
