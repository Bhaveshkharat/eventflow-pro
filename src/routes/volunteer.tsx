import { createFileRoute } from "@tanstack/react-router";
import { ScanLine, CheckCircle2, XCircle, Users, Activity, History, Search } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { StatCard } from "@/components/ui-ext/StatCard";
import { attendees } from "@/data/mock";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/volunteer")({ component: VolunteerDashboard, head: () => ({ meta: [{ title: "Volunteer Hub — Eventra" }] }) });

function VolunteerDashboard() {
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<any>(null);
  const [history, setHistory] = useState([
    { id: 1, name: "Marcus Chen", ticket: "VIP", status: "Approved", time: "2m ago" },
    { id: 2, name: "Sofia Romano", ticket: "General", status: "Approved", time: "5m ago" },
    { id: 3, name: "Unknown", ticket: "None", status: "Rejected", time: "12m ago" },
  ]);

  const simulateScan = () => {
    setScanning(true);
    setLastScan(null);
    setTimeout(() => {
      const attendee = attendees[Math.floor(Math.random() * attendees.length)];
      const success = Math.random() > 0.1;
      setScanning(false);
      setLastScan({ ...attendee, success });
      
      if (success) {
        toast.success(`Entry Approved: ${attendee.name}`);
        setHistory([{ id: Date.now(), name: attendee.name, ticket: attendee.ticket, status: "Approved", time: "Just now" }, ...history]);
      } else {
        toast.error("Verification Failed");
        setHistory([{ id: Date.now(), name: "Invalid Pass", ticket: "N/A", status: "Rejected", time: "Just now" }, ...history]);
      }
    }, 1500);
  };

  return (
    <DashboardShell title="Volunteer Console" subtitle="Gate check-in and attendee verification.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Check-ins Today" value={142} delta="+24" />
        <StatCard icon={Activity} label="Current Gate" value="Hall A North" />
        <StatCard icon={History} label="Recent Activity" value="Active" />
        <StatCard icon={CheckCircle2} label="Shift Status" value="On Duty" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Scanner Panel */}
        <div className="lg:col-span-7 space-y-6">
           <GlassCard className="p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden" hover={false}>
              <div className="absolute inset-0 bg-neutral-950/20 pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {scanning ? (
                   <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                      <div className="relative h-48 w-48 border-2 border-primary/30 rounded-3xl overflow-hidden mb-6">
                         <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                         <motion.div className="absolute inset-x-0 h-1 bg-primary shadow-glow z-10"
                           initial={{ top: 0 }} animate={{ top: "100%" }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear", repeatType: "reverse" }} />
                      </div>
                      <p className="text-sm font-bold animate-pulse uppercase tracking-[0.2em] text-primary">Scanning Active...</p>
                   </motion.div>
                ) : lastScan ? (
                   <motion.div key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                      <div className={"mx-auto h-24 w-24 rounded-full flex items-center justify-center mb-6 " + (lastScan.success ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500")}>
                         {lastScan.success ? <CheckCircle2 className="h-12 w-12" /> : <XCircle className="h-12 w-12" />}
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight">{lastScan.success ? "Access Granted" : "Access Denied"}</h3>
                      <p className="text-muted-foreground mt-1">{lastScan.name}</p>
                      {lastScan.success && (
                        <div className="mt-4 px-4 py-1 rounded-full glass inline-block text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20">
                           {lastScan.ticket} Pass
                        </div>
                      )}
                      <div className="mt-8 flex gap-3 justify-center">
                         <GradientButton onClick={simulateScan} size="sm">Next Scan</GradientButton>
                         <button onClick={() => setLastScan(null)} className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">Reset</button>
                      </div>
                   </motion.div>
                ) : (
                   <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                      <div className="h-20 w-20 rounded-full glass flex items-center justify-center mx-auto mb-6 text-muted-foreground/40">
                         <ScanLine className="h-10 w-10" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground mb-8">Position QR code within the scanner frame.</p>
                      <GradientButton onClick={simulateScan} className="px-10 py-6 text-base shadow-glow" size="lg">Start Scanning</GradientButton>
                   </motion.div>
                )}
              </AnimatePresence>
           </GlassCard>

           <div className="flex items-center gap-4 glass p-4 rounded-2xl border border-white/5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Manual attendee search (name or ticket ID)..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
              <button className="text-xs font-bold text-primary px-3 py-1.5 rounded-lg glass-strong">Search</button>
           </div>
        </div>

        {/* Check-in Log */}
        <div className="lg:col-span-5 space-y-6">
           <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Session History</h2>
              <button className="text-[10px] font-bold text-primary">Download Log</button>
           </div>
           <div className="space-y-3">
              {history.map(item => (
                <GlassCard key={item.id} className="p-4" hover={false}>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className={"h-8 w-8 rounded-full grid place-items-center " + (item.status === "Approved" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}>
                            {item.status === "Approved" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                         </div>
                         <div>
                            <p className="text-xs font-bold">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{item.ticket} Pass</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-muted-foreground">{item.time}</p>
                         <p className={"text-[9px] font-bold mt-1 uppercase " + (item.status === "Approved" ? "text-emerald-500" : "text-rose-500")}>{item.status}</p>
                      </div>
                   </div>
                </GlassCard>
              ))}
           </div>
        </div>
      </div>
    </DashboardShell>
  );
}
