import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Calendar, MapPin, Users, Star, Share2, CalendarPlus, Building2 } from "lucide-react";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { events, tickets, hotels, agenda } from "@/data/mock";
import { HotelCard } from "@/components/events/HotelCard";
import { toast } from "sonner";

export const Route = createFileRoute("/events/$eventId")({
  component: EventDetail,
  loader: ({ params }) => {
    const event = events.find(e => e.id === params.eventId);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.event.title} — Eventra` },
      { name: "description", content: loaderData.event.tagline },
      { property: "og:title", content: loaderData.event.title },
      { property: "og:image", content: loaderData.event.image },
    ] : [],
  }),
  errorComponent: () => <div className="p-12 text-center">Could not load event.</div>,
  notFoundComponent: () => <div className="p-12 text-center">Event not found.</div>,
});

function EventDetail() {
  const { event } = Route.useLoaderData();
  const date = new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const end = new Date(event.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return (
    <div className="min-h-screen">
      <MarketingNav />
      {/* Banner */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src={event.image} alt={event.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 h-full flex flex-col justify-end pb-10">
          <span className="self-start px-3 py-1 rounded-full text-xs glass-strong">{event.category}</span>
          <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl">{event.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl">{event.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{date} – {end}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{event.venue}, {event.city}</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{event.attendees.toLocaleString()} attendees</span>
            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{event.rating}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 grid lg:grid-cols-3 gap-10">
        {/* Left */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">About this event</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Join {event.attendees.toLocaleString()}+ professionals at {event.venue} for {event.title}. Three days of keynotes,
              workshops and networking with the brightest minds in {event.category.toLowerCase()}.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {event.tags.map(t => <span key={t} className="text-xs px-3 py-1 rounded-full glass">{t}</span>)}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Agenda · Day 1</h2>
            <div className="mt-5 space-y-2">
              {agenda.map((a, i) => (
                <GlassCard key={i} className="p-4 flex items-center gap-4" hover={false}>
                  <div className="w-16 text-sm font-mono text-muted-foreground">{a.time}</div>
                  <div className="flex-1">
                    <p className="font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.speaker} · {a.track}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Hotels & travel</h2>
            <p className="text-sm text-muted-foreground mt-1">Negotiated rates near the venue.</p>
            <div className="mt-5 grid sm:grid-cols-2 gap-5">
              {hotels.slice(0, 4).map(h => <HotelCard key={h.id} hotel={h} />)}
            </div>
          </div>
        </div>

        {/* Sticky purchase */}
        <aside className="lg:sticky lg:top-24 h-max">
          <GlassCard className="p-6 space-y-4" hover={false}>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Tickets from</p>
              <p className="text-2xl font-semibold gradient-text">${event.priceFrom}</p>
            </div>
            <div className="space-y-2">
              {tickets.map(t => (
                <div key={t.id} className={"rounded-xl border p-3 flex items-center justify-between " + (t.popular ? "border-primary/40 bg-primary/5" : "border-border")}>
                  <div>
                    <p className="text-sm font-medium">{t.name} {t.popular && <span className="ml-1 text-[10px] gradient-text font-semibold">POPULAR</span>}</p>
                    <p className="text-xs text-muted-foreground">{t.perks[0]}</p>
                  </div>
                  <p className="font-semibold">${t.price}</p>
                </div>
              ))}
            </div>
            <Link to="/book/$eventId" params={{ eventId: event.id }} className="block">
              <GradientButton className="w-full" size="lg">Book tickets</GradientButton>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => toast.success("Added to calendar")} className="rounded-xl glass py-2.5 text-xs font-medium flex items-center justify-center gap-1.5"><CalendarPlus className="h-4 w-4" />Calendar</button>
              <button onClick={() => toast.success("Link copied")} className="rounded-xl glass py-2.5 text-xs font-medium flex items-center justify-center gap-1.5"><Share2 className="h-4 w-4" />Share</button>
            </div>
            <div className="pt-3 border-t border-border text-xs text-muted-foreground flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5" /> {event.exhibitors} exhibitors confirmed
            </div>
          </GlassCard>
        </aside>
      </section>

      <Footer />
    </div>
  );
}
