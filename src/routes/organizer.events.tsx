import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  Plus, Search, Filter, MoreVertical, 
  ChevronRight, Calendar, MapPin, Users, 
  DollarSign, BarChart3, Edit3, Trash2 
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events } from "@/data/mock";

export const Route = createFileRoute("/organizer/events")({ 
  component: OrganizerEvents,
  head: () => ({ meta: [{ title: "My Events — Eventra" }] }) 
});

function OrganizerEvents() {
  return (
    <DashboardShell title="My Events" subtitle="Manage your portfolio of active and upcoming events.">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 flex-1 max-w-md">
           <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                placeholder="Search events by name, city or ID..." 
                className="w-full pl-10 pr-4 py-2 text-sm glass rounded-xl border border-white/5 outline-none focus:border-primary/30 transition-all"
              />
           </div>
           <button className="h-10 w-10 rounded-xl glass grid place-items-center hover:bg-accent/50 transition-colors border border-white/5">
              <Filter className="h-4 w-4 text-muted-foreground" />
           </button>
        </div>
        <Link to="/organizer/events/new">
          <GradientButton className="h-11 px-6 text-sm">
            <Plus className="h-4 w-4 mr-2" /> Create New Event
          </GradientButton>
        </Link>
      </div>

      <div className="grid gap-6">
        {events.map(e => (
          <GlassCard key={e.id} className="p-0 overflow-hidden group" hover={true}>
            <div className="flex flex-col md:flex-row">
              {/* Event Image & Status */}
              <div className="md:w-64 h-48 md:h-auto relative shrink-0">
                 <img src={e.image} className="absolute inset-0 h-full w-full object-cover" alt="" />
                 <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                 <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-emerald-500 text-white shadow-glow">Published</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest glass text-white backdrop-blur-md border border-white/20">ID: {e.id.toUpperCase()}</span>
                 </div>
              </div>

              {/* Event Details */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                 <div>
                    <div className="flex items-start justify-between gap-4">
                       <div>
                          <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{e.title}</h3>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                             <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" /> {e.date}
                             </div>
                             <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" /> {e.venue}, {e.city}
                             </div>
                          </div>
                       </div>
                       <div className="flex gap-2 shrink-0">
                          <Link to={`/organizer/events/${e.id}`}>
                            <button className="h-9 w-9 rounded-xl glass grid place-items-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all border border-white/5">
                               <Edit3 className="h-4 w-4" />
                            </button>
                          </Link>
                          <button className="h-9 w-9 rounded-xl glass grid place-items-center text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-white/5">
                             <Trash2 className="h-4 w-4" />
                          </button>
                       </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 leading-relaxed line-clamp-2 max-w-2xl">{e.description}</p>
                 </div>

                 {/* Stats Bar */}
                 <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <EventMiniStat icon={Users} label="Registered" value={e.attendees} color="text-blue-500" />
                    <EventMiniStat icon={DollarSign} label="Revenue" value="$142.5k" color="text-emerald-500" />
                    <EventMiniStat icon={BarChart3} label="Conversion" value="8.4%" color="text-purple-500" />
                    <Link to={`/organizer/events/${e.id}`} className="flex items-center justify-end">
                       <button className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1 group/btn">
                          Manage Event <ChevronRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                       </button>
                    </Link>
                 </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
      
      <div className="mt-12 flex flex-col items-center gap-4 text-center">
         <p className="text-xs text-muted-foreground">Showing 4 of 4 events</p>
         <div className="flex gap-2">
            {[1].map(i => (
              <button key={i} className="h-8 w-8 rounded-lg gradient-bg text-[10px] font-bold text-white shadow-glow">{i}</button>
            ))}
         </div>
      </div>
    </DashboardShell>
  );
}

function EventMiniStat({ icon: Icon, label, value, color }: any) {
  return (
    <div className="space-y-1">
       <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
       <div className="flex items-center gap-2">
          <Icon className={`h-3.5 w-3.5 ${color}`} />
          <span className="text-sm font-bold">{value}</span>
       </div>
    </div>
  );
}
