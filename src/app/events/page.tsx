"use client";
import React, { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { EventCard } from "@/components/events/EventCard";
import { events } from "@/data/mock";
import { SectionHeading } from "@/components/ui-ext/SectionHeading";
import { EmptyState } from "@/components/ui-ext/EmptyState";

const cats = ["All", ...Array.from(new Set(events.map(e => e.category)))];
const cities = ["All", ...Array.from(new Set(events.map(e => e.city)))];

export default function EventsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [city, setCity] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");
  const [dateRange, setDateRange] = useState("All");

  const filtered = useMemo(() => {
    let result = events.filter(e => {
      const matchCat = cat === "All" || e.category === cat;
      const matchCity = city === "All" || e.city === city;
      const matchSearch = q === "" || 
        e.title.toLowerCase().includes(q.toLowerCase()) || 
        e.city.toLowerCase().includes(q.toLowerCase()) ||
        e.tags.some(t => t.toLowerCase().includes(q.toLowerCase()));
      
      // Mock date range logic
      let matchDate = true;
      if (dateRange === "Soon") {
        const d = new Date(e.date);
        matchDate = d.getMonth() <= 6; // Mock "Soon" as June/July 2026
      }

      return matchCat && matchCity && matchSearch && matchDate;
    });

    // Sorting logic
    result.sort((a, b) => {
      if (sortBy === "price-asc") return a.priceFrom - b.priceFrom;
      if (sortBy === "attendees-desc") return b.attendees - a.attendees;
      if (sortBy === "rating-desc") return b.rating - a.rating;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return result;
  }, [q, cat, city, sortBy, dateRange]);

  return (
    <div className="min-h-screen">
      <MarketingNav />
      <section className="mx-auto max-w-7xl px-4 pt-12 pb-8">
        <SectionHeading eyebrow="Discover" title="Find your next event" description="From global expos to intimate summits — curated and easy to book." />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 flex items-center gap-2 rounded-2xl glass px-4 py-3.5 focus-within:ring-2 ring-primary/20 transition-all">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search events, topics, or cities…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            {q && <button onClick={() => setQ("")} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>}
          </div>

          <div className="md:col-span-3">
            <select value={city} onChange={e => setCity(e.target.value)} className="w-full h-full rounded-2xl glass px-4 py-3.5 text-sm bg-transparent outline-none appearance-none cursor-pointer">
              <option value="All">All Cities</option>
              {cities.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="md:col-span-3">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full h-full rounded-2xl glass px-4 py-3.5 text-sm bg-transparent outline-none appearance-none cursor-pointer">
              <option value="date-desc">Newest first</option>
              <option value="price-asc">Price: Low to high</option>
              <option value="attendees-desc">Largest attendance</option>
              <option value="rating-desc">Highest rated</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mr-2">Categories:</span>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={"px-4 py-1.5 text-xs rounded-full transition-all " + (cat === c ? "gradient-bg text-white shadow-glow" : "glass hover:bg-accent/50")}>
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-medium text-muted-foreground">Showing {filtered.length} results</h2>
          <div className="flex items-center gap-4">
             <button onClick={() => setDateRange(dateRange === "Soon" ? "All" : "Soon")} 
               className={"text-xs flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all " + (dateRange === "Soon" ? "bg-primary/10 border-primary/20 text-primary" : "border-border text-muted-foreground hover:border-foreground/20")}>
               Upcoming soon
             </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Search} title="No events found" description="Try adjusting your search or filters." />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
