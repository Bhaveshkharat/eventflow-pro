import Link from "next/link";
import { Sparkles, Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="mx-auto max-w-7xl px-4 py-16 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl gradient-bg"><Sparkles className="h-4 w-4 text-white" /></div>
            <span className="font-semibold">Eventra</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">The premium platform for hosting, managing and scaling world-class events.</p>
          <div className="flex gap-2 pt-2">
            {[Twitter, Github, Linkedin].map((I, i) => (
              <a key={i} href="#" className="grid h-8 w-8 place-items-center rounded-full glass hover:scale-105 transition-transform"><I className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
        {[
          { title: "Product", links: [["Events","/events"],["Pricing","/pricing"],["Dashboard","/visitor"]] },
          { title: "Company", links: [["About","#"],["Careers","#"],["Press","#"]] },
          { title: "Resources", links: [["Docs","#"],["Support","#"],["Status","#"]] },
        ].map(col => (
          <div key={col.title}>
            <p className="font-semibold text-sm mb-4">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map(([l, h]) => (
                <li key={l}><Link href={h} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 Eventra. Crafted with care.</p>
          <p>Built for the next generation of events.</p>
        </div>
      </div>
    </footer>
  );
}
