import { createFileRoute } from "@tanstack/react-router";
import { ScanLine, CheckCircle2, XCircle, Camera } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/qr-verify")({ component: QRVerify, head: () => ({ meta: [{ title: "QR Verification — Eventra" }] }) });

const recent = [
  { id: 1, name: "Olivia Bennett", code: "TS26-PRO-94821", status: "ok", time: "Just now" },
  { id: 2, name: "Marcus Chen", code: "TS26-VIP-44102", status: "ok", time: "1m ago" },
  { id: 3, name: "Sofia Romano", code: "TS26-GEN-77390", status: "fail", time: "3m ago" },
  { id: 4, name: "Aiden Park", code: "TS26-PRO-22918", status: "ok", time: "5m ago" },
];

function QRVerify() {
  const [scanning, setScanning] = useState(false);
  return (
    <DashboardShell title="QR Verification" subtitle="Scan attendee passes for instant check-in.">
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="p-6" hover={false}>
          <div className="relative aspect-square rounded-2xl glass-strong overflow-hidden grid place-items-center">
            <Camera className="h-16 w-16 text-muted-foreground/40" />
            {scanning && (
              <motion.div className="absolute left-0 right-0 h-0.5 gradient-bg shadow-glow"
                initial={{ top: "5%" }} animate={{ top: "95%" }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }} />
            )}
            <div className="absolute inset-6 border-2 border-primary/40 rounded-2xl pointer-events-none" />
            <div className="absolute top-3 left-3 px-2 py-1 rounded-full glass text-xs flex items-center gap-1.5">
              <span className={"h-1.5 w-1.5 rounded-full " + (scanning ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground")} />
              {scanning ? "Scanning…" : "Idle"}
            </div>
          </div>
          <div className="mt-5 flex justify-center gap-3">
            <GradientButton onClick={() => { setScanning(s => !s); if (!scanning) setTimeout(() => toast.success("Pass verified · Olivia Bennett"), 1800); }}>
              <ScanLine className="h-4 w-4" />{scanning ? "Stop" : "Start scanning"}
            </GradientButton>
          </div>
        </GlassCard>

        <GlassCard className="p-6" hover={false}>
          <h2 className="font-semibold tracking-tight mb-4">Recent scans</h2>
          <div className="space-y-2">
            {recent.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/40 transition-colors">
                {r.status === "ok"
                  ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  : <XCircle className="h-5 w-5 text-rose-500" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs font-mono text-muted-foreground">{r.code}</p>
                </div>
                <span className="text-xs text-muted-foreground">{r.time}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </DashboardShell>
  );
}
