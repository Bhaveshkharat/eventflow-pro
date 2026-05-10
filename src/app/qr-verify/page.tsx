"use client";
import React, { useState } from "react";
import { ScanLine, CheckCircle2, XCircle, Camera } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { attendees } from "@/data/mock";

export default function QRVerify() {
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<any>(null);
  const [history, setHistory] = useState([
    { id: 1, name: "Marcus Chen", code: "TS26-VIP-44102", status: "ok", time: "1m ago" },
    { id: 2, name: "Sofia Romano", code: "TS26-GEN-77390", status: "fail", time: "3m ago" },
  ]);

  const simulateScan = () => {
    if (scanning) {
      setScanning(false);
      return;
    }
    setScanning(true);
    setLastScan(null);
    
    // Simulate scan delay
    setTimeout(() => {
      const attendee = attendees[Math.floor(Math.random() * attendees.length)];
      const success = Math.random() > 0.2;
      
      setScanning(false);
      setLastScan({ ...attendee, success });
      
      if (success) {
        toast.success(`Pass verified: ${attendee.name}`, {
          description: `${attendee.ticket} Tier · Access Granted`,
        });
        setHistory([{ id: Date.now(), name: attendee.name, code: `TS26-${attendee.ticket.toUpperCase()}-${Math.floor(Math.random()*100000)}`, status: "ok", time: "Just now" }, ...history]);
      } else {
        toast.error("Verification failed", {
          description: "Invalid or expired pass presented.",
        });
        setHistory([{ id: Date.now(), name: "Unknown User", code: "ERR-INVALID-CODE", status: "fail", time: "Just now" }, ...history]);
      }
    }, 2000);
  };

  return (
    <DashboardShell title="QR Verification" subtitle="Scan attendee passes for instant check-in.">
      <div className="grid lg:grid-cols-2 gap-8">
        <GlassCard className="p-8 flex flex-col items-center" hover={false}>
          <div className="relative w-full aspect-square max-w-[360px] rounded-3xl glass-strong overflow-hidden border border-white/10 shadow-2xl">
            {/* Mock Camera Feed */}
            <div className="absolute inset-0 bg-neutral-950">
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--brand)_0%,_transparent_70%)] animate-pulse" />
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            {scanning && (
              <>
                <motion.div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-primary shadow-[0_0_15px_var(--brand)] z-10"
                  initial={{ top: "20%" }} animate={{ top: "80%" }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear", repeatType: "reverse" }} />
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                   <div className="w-48 h-48 border-2 border-primary/30 rounded-3xl animate-pulse" />
                </div>
              </>
            )}

            {lastScan && (
               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} 
                 className={"absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center " + (lastScan.success ? "bg-emerald-500/10" : "bg-rose-500/10")}>
                  <div className={"mb-4 h-20 w-20 rounded-full border-4 flex items-center justify-center " + (lastScan.success ? "border-emerald-500 bg-emerald-500/20" : "border-rose-500 bg-rose-500/20")}>
                    {lastScan.success ? <CheckCircle2 className="h-10 w-10 text-emerald-500" /> : <XCircle className="h-10 w-10 text-rose-500" />}
                  </div>
                  <h3 className="text-xl font-bold">{lastScan.success ? "Access Granted" : "Access Denied"}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{lastScan.success ? lastScan.name : "Invalid Token"}</p>
                  {lastScan.success && (
                    <div className="mt-4 px-3 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-widest text-primary">
                      {lastScan.ticket} Pass
                    </div>
                  )}
               </motion.div>
            )}

            {!scanning && !lastScan && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40 gap-4">
                <Camera className="h-16 w-16" />
                <p className="text-xs font-medium uppercase tracking-widest">Camera Ready</p>
              </div>
            )}

            {/* Corner Brackets */}
            <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-white/20 rounded-tl-lg" />
            <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-lg" />
            <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-white/20 rounded-bl-lg" />
            <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-white/20 rounded-br-lg" />
            
            <div className="absolute top-4 left-4 px-2 py-1 rounded-full glass text-[10px] font-bold tracking-tighter flex items-center gap-1.5 z-30">
              <span className={"h-1.5 w-1.5 rounded-full " + (scanning ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground")} />
              {scanning ? "SCANNING_ACTIVE" : "SCANNER_IDLE"}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 w-full max-w-[360px]">
            <GradientButton onClick={simulateScan} disabled={scanning} className="w-full py-7 text-base shadow-glow-sm" size="lg">
              {scanning ? "Searching..." : "Simulate QR Scan"}
            </GradientButton>
            <button onClick={() => { setScanning(false); setLastScan(null); }} className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
              Reset Scanner
            </button>
          </div>
        </GlassCard>

        <GlassCard className="p-8" hover={false}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold tracking-tight text-lg">Verification History</h2>
            <span className="text-[10px] font-bold bg-muted px-2 py-1 rounded uppercase tracking-wider text-muted-foreground">Session Log</span>
          </div>
          <div className="space-y-3">
            {history.map(r => (
              <div key={r.id} className="group flex items-center gap-4 p-4 rounded-2xl glass hover:bg-accent/40 transition-all border border-transparent hover:border-white/5">
                <div className={"h-10 w-10 rounded-full flex items-center justify-center shrink-0 " + (r.status === "ok" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}>
                  {r.status === "ok" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{r.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground mt-0.5 tracking-tight">{r.code}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-medium text-muted-foreground">{r.time}</p>
                   {r.status === "ok" && <p className="text-[9px] font-bold text-primary mt-0.5 uppercase tracking-tighter">Approved</p>}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </DashboardShell>
  );
}
