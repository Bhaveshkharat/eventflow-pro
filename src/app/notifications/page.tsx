"use client";
import React from "react";
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { notifications } from "@/data/mock";
import { toast } from "sonner";

const iconFor = { info: Info, success: CheckCircle2, warning: AlertTriangle } as const;
const colorFor = { info: "text-sky-500", success: "text-emerald-500", warning: "text-amber-500" } as const;

export default function Notifications() {
  return (
    <DashboardShell title="Notifications" subtitle="Stay on top of every update across your events.">
      <div className="flex justify-end mb-4">
        <button onClick={() => toast.success("All marked as read")} className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
          <CheckCheck className="h-3.5 w-3.5" /> Mark all read
        </button>
      </div>
      <div className="space-y-3">
        {notifications.map(n => {
          const Icon = iconFor[n.type];
          return (
            <GlassCard key={n.id} className="p-4 flex items-start gap-4" hover={false}>
              <div className={"grid h-10 w-10 place-items-center rounded-xl glass-strong " + colorFor[n.type]}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{n.title}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{n.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>
              </div>
              {!n.read && <span className="h-2 w-2 rounded-full gradient-bg mt-2" />}
            </GlassCard>
          );
        })}
      </div>
    </DashboardShell>
  );
}
