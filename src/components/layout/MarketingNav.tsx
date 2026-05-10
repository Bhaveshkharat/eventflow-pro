"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { GradientButton } from "../ui-ext/GradientButton";
import { cn } from "@/lib/utils";

const links = [
  { href: "/events", label: "Events" },
  { href: "/pricing", label: "Pricing" },
  { href: "/visitor", label: "Dashboard" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("sticky top-0 z-50 transition-all duration-300", scrolled ? "py-2" : "py-4")}>
      <div className="mx-auto max-w-7xl px-4">
        <div className={cn("flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all", scrolled ? "glass-strong shadow-elegant" : "")}>
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl gradient-bg shadow-glow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight">Eventra</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link 
                key={l.href} 
                href={l.href} 
                className={cn(
                  "px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent/50",
                  pathname === l.href && "text-foreground bg-accent/60"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/register" className="hidden md:inline-flex">
              <GradientButton size="sm">Get started</GradientButton>
            </Link>
            <button className="md:hidden grid h-9 w-9 place-items-center rounded-full glass" onClick={() => setOpen(o => !o)} aria-label="Menu">
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden mt-2 glass-strong rounded-2xl p-3 shadow-elegant flex flex-col gap-1 animate-in fade-in slide-in-from-top-2">
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-3 py-2 rounded-xl hover:bg-accent text-sm">{l.label}</Link>
            ))}
            <Link href="/register" onClick={() => setOpen(false)} className="px-3 py-2 rounded-xl text-sm gradient-text font-semibold">Get started →</Link>
          </div>
        )}
      </div>
    </header>
  );
}
