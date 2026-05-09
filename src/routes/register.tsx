import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, User, Building2, Mail, Sparkles, Hotel, Plane } from "lucide-react";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { toast } from "sonner";
import { events, tickets } from "@/data/mock";

export const Route = createFileRoute("/register")({
  component: RegisterFlow,
  head: () => ({ meta: [{ title: "Get started — Eventra" }] }),
});

const steps = ["Account", "Profile", "Interests", "Tickets", "Success"];

function RegisterFlow() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    email: "", name: "", password: "",
    org: "", role: "Visitor",
    interests: [] as string[],
    eventId: events[0].id,
    ticketId: tickets[0].id
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!formData.email.includes("@")) newErrors.email = "Invalid email";
      if (formData.password.length < 6) newErrors.password = "Min 6 characters";
    }
    if (step === 1) {
      if (!formData.name) newErrors.name = "Name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      if (step === steps.length - 2) toast.success("Registration complete!");
      setStep(s => s + 1);
    } else {
      toast.error("Please fix the errors");
    }
  };

  const toggleInterest = (t: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(t) 
        ? prev.interests.filter(i => i !== t) 
        : [...prev.interests, t]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <section className="mx-auto max-w-2xl px-4 py-16">
        <div className="flex items-center gap-2 mb-10 px-2">
          {steps.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className={"h-9 w-9 rounded-full grid place-items-center text-xs font-semibold transition-all duration-500 " + (i <= step ? "gradient-bg text-white shadow-glow scale-110" : "glass text-muted-foreground")}>
                  {i < step ? <Check className="h-5 w-5" /> : i + 1}
                </div>
                {i < steps.length - 1 && <div className={"h-1 flex-1 rounded-full transition-all duration-700 " + (i < step ? "bg-primary" : "bg-border")} />}
              </div>
              <span className={"text-[10px] font-bold uppercase tracking-wider transition-colors " + (i <= step ? "text-foreground" : "text-muted-foreground/50")}>{s}</span>
            </div>
          ))}
        </div>

        <GlassCard className="p-8 md:p-10" hover={false}>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              {step === 0 && <Step title="Create your account" sub="Start your 14-day free trial.">
                <Field icon={Mail} placeholder="you@company.com" type="email" value={formData.email} onChange={(e:any) => setFormData({...formData, email: e.target.value})} error={errors.email} />
                <Field placeholder="Password" type="password" value={formData.password} onChange={(e:any) => setFormData({...formData, password: e.target.value})} error={errors.password} />
                <p className="text-[11px] text-muted-foreground mt-2 px-1">By continuing, you agree to our Terms of Service.</p>
              </Step>}
              
              {step === 1 && <Step title="Tell us about you" sub="So we can tailor the experience.">
                <Field icon={User} placeholder="Full name" value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} error={errors.name} />
                <Field icon={Building2} placeholder="Company or organization" value={formData.org} onChange={(e:any) => setFormData({...formData, org: e.target.value})} />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Visitor", "Exhibitor", "Organizer", "Partner"].map(r => (
                    <button key={r} onClick={() => setFormData({...formData, role: r})}
                      className={"px-4 py-3 rounded-xl text-sm transition-all border " + (formData.role === r ? "bg-primary/10 border-primary text-primary" : "glass border-transparent hover:border-border")}>
                      {r}
                    </button>
                  ))}
                </div>
              </Step>}

              {step === 2 && <Step title="Pick your interests" sub="We'll surface events you'll love.">
                <div className="flex flex-wrap gap-2 py-2">
                  {["AI","FinTech","Design","Healthcare","Climate","Gaming","EdTech","Mobility","Web3","Cloud"].map(t => (
                    <button key={t} onClick={() => toggleInterest(t)}
                      className={"px-4 py-2 rounded-full text-sm transition-all border flex items-center gap-2 " + (formData.interests.includes(t) ? "bg-primary text-white border-primary shadow-glow" : "glass border-transparent hover:border-border")}>
                      {t} {formData.interests.includes(t) && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
              </Step>}

              {step === 3 && <Step title="Finalize Details" sub="Select your primary event and ticket.">
                 <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Featured Event</label>
                      <select value={formData.eventId} onChange={e => setFormData({...formData, eventId: e.target.value})} 
                        className="w-full mt-1.5 rounded-xl glass px-4 py-3.5 text-sm bg-transparent outline-none ring-primary/20 focus:ring-2">
                        {events.map(e => <option key={e.id} value={e.id}>{e.title} ({e.city})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Ticket Tier</label>
                      <div className="grid gap-2 mt-1.5">
                        {tickets.map(t => (
                          <button key={t.id} onClick={() => setFormData({...formData, ticketId: t.id})}
                            className={"flex items-center justify-between p-4 rounded-xl border transition-all " + (formData.ticketId === t.id ? "bg-primary/5 border-primary" : "glass border-transparent hover:border-border")}>
                            <div className="text-left">
                              <p className="text-sm font-semibold">{t.name}</p>
                              <p className="text-[11px] text-muted-foreground">${t.price} · {t.perks[0]}</p>
                            </div>
                            {formData.ticketId === t.id && <div className="h-5 w-5 rounded-full gradient-bg grid place-items-center"><Check className="h-3 w-3 text-white" /></div>}
                          </button>
                        ))}
                      </div>
                    </div>
                 </div>
              </Step>}

              {step === 4 && <div className="text-center py-6">
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 12 }}
                  className="mx-auto h-20 w-20 rounded-full gradient-bg grid place-items-center shadow-glow mb-6">
                  <Check className="h-10 w-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold tracking-tight">You're confirmed!</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Welcome to Eventra, <span className="text-foreground font-medium">{formData.name || "friend"}</span>.<br/>
                  We've sent a confirmation to <span className="text-foreground font-medium">{formData.email}</span>.
                </p>
                <div className="mt-8 p-6 rounded-2xl glass-strong border border-primary/20 text-left bg-primary/5">
                   <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Exclusive Partner Offers</p>
                   </div>
                   <h3 className="text-sm font-bold mb-2">Need to arrange your stay or travel?</h3>
                   <p className="text-[11px] text-muted-foreground leading-relaxed mb-6">As a confirmed attendee, you get access to discounted rates at partner hotels and group flight packages.</p>
                   
                   <div className="grid grid-cols-2 gap-3">
                      <Link to="/hotel-agent" className="p-3 rounded-xl glass border border-white/5 hover:border-primary/30 transition-all flex flex-col gap-2 group">
                         <Hotel className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                         <span className="text-[10px] font-bold uppercase tracking-tight">Hotel Booking</span>
                      </Link>
                      <Link to="/travel-agent" className="p-3 rounded-xl glass border border-white/5 hover:border-primary/30 transition-all flex flex-col gap-2 group">
                         <Plane className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                         <span className="text-[10px] font-bold uppercase tracking-tight">Travel Packages</span>
                      </Link>
                   </div>
                </div>

                <Link to="/visitor" className="inline-block mt-8 w-full"><GradientButton className="w-full py-6" size="lg">Go to my dashboard <ArrowRight className="ml-2 h-5 w-5" /></GradientButton></Link>
              </div>}
            </motion.div>
          </AnimatePresence>

          {step < 4 && (
            <div className="mt-10 flex items-center justify-between border-t border-white/5 pt-8">
              <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
                className="text-sm font-medium flex items-center gap-2 text-muted-foreground disabled:opacity-20 hover:text-foreground transition-all">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <GradientButton onClick={handleNext} size="lg" className="px-8 shadow-glow-sm">
                {step === 3 ? "Complete Registration" : "Next step"} <ArrowRight className="ml-2 h-4 w-4" />
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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-base text-muted-foreground mt-2">{sub}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
function Field({ icon: Icon, error, ...props }: any) {
  return (
    <div className="space-y-1.5 w-full">
      <div className={"flex items-center gap-3 rounded-xl glass px-4 py-3.5 transition-all focus-within:ring-2 " + (error ? "ring-rose-500/20 border-rose-500/30" : "ring-primary/20")}>
        {Icon && <Icon className={"h-4 w-4 " + (error ? "text-rose-500" : "text-muted-foreground")} />}
        <input {...props} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60" />
      </div>
      {error && <p className="text-[10px] font-medium text-rose-500 ml-2">{error}</p>}
    </div>
  );
}
