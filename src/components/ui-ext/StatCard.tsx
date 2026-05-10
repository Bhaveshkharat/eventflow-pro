"use client";
import { GlassCard } from "./GlassCard";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({ icon: Icon, label, value, delta, prefix = "", suffix = "" }: {
  icon: LucideIcon; label: string; value: number; delta?: string; prefix?: string; suffix?: string;
}) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`);
  useEffect(() => { const c = animate(mv, value, { duration: 1.2, ease: "easeOut" }); return () => c.stop(); }, [value, mv]);
  const positive = delta?.startsWith("+");
  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <motion.p className="text-3xl font-semibold tracking-tight">{rounded}</motion.p>
          {delta && (
            <p className={cn("text-xs font-medium", positive ? "text-emerald-500" : "text-rose-500")}>{delta} vs last week</p>
          )}
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-xl gradient-bg text-white shadow-glow">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </GlassCard>
  );
}
