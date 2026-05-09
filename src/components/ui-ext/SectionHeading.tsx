export function SectionHeading({ eyebrow, title, description, center }: { eyebrow?: string; title: string; description?: string; center?: boolean }) {
  return (
    <div className={"space-y-3 " + (center ? "text-center mx-auto max-w-2xl" : "")}>
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] gradient-text">{eyebrow}</p>}
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
      {description && <p className="text-muted-foreground text-base md:text-lg leading-relaxed">{description}</p>}
    </div>
  );
}
