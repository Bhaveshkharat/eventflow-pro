import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Ticket, Users, Building2, Hotel, BarChart3, ScanLine, Bell, Settings, Sparkles, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useRole } from "@/hooks/useRole";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/visitor", label: "Visitor", icon: Ticket },
  { to: "/exhibitor", label: "Exhibitor", icon: Building2 },
  { to: "/organizer", label: "Organizer", icon: LayoutDashboard },
  { to: "/hotel-travel", label: "Hotel & Travel", icon: Hotel },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/qr-verify", label: "QR Verify", icon: ScanLine },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function DashboardShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const path = useRouterState({ select: s => s.location.pathname });
  const [open, setOpen] = useState(false);
  const { role, setRole } = useRole();

  const Sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-sidebar/50 backdrop-blur-xl">
      <div className="px-5 py-5 flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-xl gradient-bg shadow-glow"><Sparkles className="h-4 w-4 text-white" /></div>
        <Link to="/" className="font-semibold tracking-tight">Eventra</Link>
      </div>
      <nav className="flex-1 px-3 space-y-0.5">
        {nav.map(item => {
          const active = path === item.to;
          return (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all relative",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
            )}>
              {active && <motion.div layoutId="navhi" className="absolute inset-0 rounded-xl gradient-bg opacity-15" />}
              <item.icon className={cn("h-4 w-4 relative", active && "text-primary")} />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3">
        <div className="glass rounded-xl p-3 space-y-2">
          <p className="text-xs text-muted-foreground">Active role</p>
          <select value={role} onChange={e => setRole(e.target.value as any)}
            className="w-full bg-transparent text-sm font-medium capitalize outline-none cursor-pointer">
            <option value="visitor">Visitor</option>
            <option value="exhibitor">Exhibitor</option>
            <option value="organizer">Organizer</option>
            <option value="hotel">Hotel & Travel</option>
          </select>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="hidden lg:block fixed inset-y-0 left-0">{Sidebar}</div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-background/60 backdrop-blur-sm z-40" onClick={() => setOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 24 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50">{Sidebar}</motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-30 glass-strong border-b border-border">
          <div className="flex items-center gap-3 px-4 lg:px-8 h-16">
            <button className="lg:hidden grid h-9 w-9 place-items-center rounded-full glass" onClick={() => setOpen(true)}><Menu className="h-4 w-4" /></button>
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md rounded-full glass px-4 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Search events, attendees, sessions…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
              <kbd className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">⌘K</kbd>
            </div>
            <div className="flex-1 md:flex-none" />
            <Link to="/notifications" className="grid h-9 w-9 place-items-center rounded-full glass relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full gradient-bg" />
            </Link>
            <ThemeToggle />
            <img src="https://i.pravatar.cc/80?img=68" alt="" className="h-9 w-9 rounded-full ring-2 ring-border" />
          </div>
        </header>
        <main className="px-4 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
