"use client";
import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import type { Event } from "@/data/mock";

export function EventCard({ event, index = 0 }: { event: Event; index?: number }) {
  const date = new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.2, 0.8, 0.2, 1] }}>
      <Link href={`/events/${event.id}`} className="group block">
        <div className="overflow-hidden rounded-2xl glass shadow-elegant hover-lift">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img src={event.image} alt={event.title} loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-medium glass-strong">{event.category}</span>
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <p className="text-xs opacity-80">{date} · {event.city}</p>
              <h3 className="text-lg font-semibold tracking-tight mt-0.5">{event.title}</h3>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{event.venue}</span>
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{event.attendees.toLocaleString()}</span>
            <span className="font-medium text-foreground">From ${event.priceFrom}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
