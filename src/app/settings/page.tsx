"use client";
import React, { useState } from "react";
import { User, Building2, CreditCard, Bell, Palette } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "org", label: "Organization", icon: Building2 },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "notifs", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
];

export default function Settings() {
  const [tab, setTab] = useState("profile");
  const { theme } = useTheme();
  return (
    <DashboardShell title="Settings" subtitle="Manage your account, organization and preferences.">
      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <nav className="space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all",
              tab === t.id ? "glass shadow-elegant" : "text-muted-foreground hover:text-foreground"
            )}>
              <t.icon className="h-4 w-4" />{t.label}
            </button>
          ))}
        </nav>

        <GlassCard className="p-6" hover={false}>
          {tab === "profile" && (
            <div className="space-y-5 max-w-lg">
              <div className="flex items-center gap-4">
                <img src="https://i.pravatar.cc/120?img=68" className="h-16 w-16 rounded-full ring-2 ring-border" />
                <div>
                  <p className="font-medium">Olivia Bennett</p>
                  <p className="text-xs text-muted-foreground">olivia@aurora.io</p>
                </div>
              </div>
              <Field label="Full name" defaultValue="Olivia Bennett" />
              <Field label="Email" defaultValue="olivia@aurora.io" type="email" />
              <Field label="Phone" defaultValue="+1 (415) 555-0123" />
              <GradientButton onClick={() => toast.success("Profile saved")}>Save changes</GradientButton>
            </div>
          )}
          {tab === "org" && (
            <div className="space-y-5 max-w-lg">
              <Field label="Organization name" defaultValue="Aurora Studios" />
              <Field label="Website" defaultValue="https://aurora.io" />
              <Field label="Industry" defaultValue="Technology" />
              <GradientButton onClick={() => toast.success("Organization updated")}>Save</GradientButton>
            </div>
          )}
          {tab === "billing" && (
            <div className="space-y-4 max-w-lg">
              <p className="text-sm text-muted-foreground">Current plan</p>
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center justify-between">
                <div><p className="font-medium">Growth · $49/mo</p><p className="text-xs text-muted-foreground">Renews Jan 12, 2026</p></div>
                <button className="text-sm gradient-text font-medium">Manage</button>
              </div>
              <p className="text-sm text-muted-foreground pt-3">Payment method</p>
              <div className="rounded-xl glass p-4 flex items-center gap-3"><CreditCard className="h-5 w-5" /><span className="text-sm">Visa ending in 4242</span></div>
            </div>
          )}
          {tab === "notifs" && (
            <div className="space-y-3 max-w-lg">
              {["Email digests","Push notifications","SMS alerts","Marketing updates"].map(l => (
                <label key={l} className="flex items-center justify-between rounded-xl glass p-4 cursor-pointer">
                  <span className="text-sm">{l}</span>
                  <input type="checkbox" defaultChecked={l !== "Marketing updates"} className="h-5 w-9 appearance-none rounded-full bg-muted checked:bg-primary relative cursor-pointer transition" />
                </label>
              ))}
            </div>
          )}
          {tab === "appearance" && (
            <div className="space-y-4 max-w-lg">
              <p className="text-sm">Theme · currently <span className="font-medium capitalize">{theme}</span></p>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <span className="text-xs text-muted-foreground">Tap to switch between light and dark.</span>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardShell>
  );
}

function Field({ label, ...props }: any) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input {...props} className="mt-1.5 w-full rounded-xl glass px-4 py-2.5 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary/30" />
    </div>
  );
}
