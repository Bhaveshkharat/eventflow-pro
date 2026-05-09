import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, User, Building2, Mail } from "lucide-react";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  component: RegisterFlow,
  head: () => ({ meta: [{ title: "Get started — Eventra" }] }),
});

const steps = ["Account", "Profile", "Preferences", "Done"];

function RegisterFlow() {
  const [step, setStep] = useState(0);
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <section className="mx-auto max-w-2xl px-4 py-16">
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={"h-8 w-8 rounded-full grid place-items-center text-xs font-medium transition-all " + (i <= step ? "gradient-bg text-white shadow-glow" : "glass text-muted-foreground")}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && <div className={"h-px flex-1 transition-colors " + (i < step ? "bg-primary" : "bg-border")} />}
            </div>
          ))}
        </div>
        <GlassCard className="p-8" hover={false}>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              {step === 0 && <Step title="Create your account" sub="Start your 14-day free trial.">
                <Field icon={Mail} placeholder="you@company.com" type="email" />
                <Field icon={User} placeholder="Full name" />
                <Field placeholder="Password" type="password" />
              </Step>}
              {step === 1 && <Step title="Tell us about you" sub="So we can tailor the experience.">
                <Field icon={Building2} placeholder="Company or organization" />
                <select className="w-full rounded-xl glass px-4 py-3 text-sm bg-transparent">
                  <option>I'm a Visitor</option><option>I'm an Exhibitor</option><option>I'm an Organizer</option><option>Hotel & Travel partner</option>
                </select>
                <Field placeholder="City" />
              </Step>}
              {step === 2 && <Step title="Pick your interests" sub="We'll surface events you'll love.">
                <div className="flex flex-wrap gap-2">
                  {["AI","FinTech","Design","Healthcare","Climate","Gaming","EdTech","Mobility","Web3"].map(t => (
                    <button key={t} className="px-3 py-1.5 rounded-full glass text-sm hover:scale-105 transition-transform">{t}</button>
                  ))}
                </div>
              </Step>}
              {step === 3 && <div className="text-center py-6">
                <div className="mx-auto h-16 w-16 rounded-full gradient-bg grid place-items-center shadow-glow"><Check className="h-8 w-8 text-white" /></div>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight">You're all set</h2>
                <p className="mt-2 text-muted-foreground">Welcome to Eventra. Let's find your first event.</p>
                <Link to="/visitor" className="inline-block mt-6"><GradientButton size="lg">Open dashboard <ArrowRight className="h-4 w-4" /></GradientButton></Link>
              </div>}
            </motion.div>
          </AnimatePresence>

          {step < 3 && (
            <div className="mt-8 flex items-center justify-between">
              <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
                className="text-sm flex items-center gap-1.5 text-muted-foreground disabled:opacity-40 hover:text-foreground transition">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <GradientButton onClick={() => { if (step === 2) toast.success("Account created"); setStep(s => s + 1); }}>
                {step === 2 ? "Finish" : "Continue"} <ArrowRight className="h-4 w-4" />
              </GradientButton>
            </div>
          )}
        </GlassCard>
      </section>
      <Footer />
    </div>
  );
}

function Step({ title, sub, children }: any) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{sub}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
function Field({ icon: Icon, ...props }: any) {
  return (
    <div className="flex items-center gap-2 rounded-xl glass px-4 py-3">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      <input {...props} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
    </div>
  );
}
