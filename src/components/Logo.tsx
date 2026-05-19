import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group flex items-center gap-3 ${className}`} aria-label="RM Sign Factory home">
      <div className="relative h-11 w-11 shrink-0">
        <div className="absolute inset-0 rounded-xl bg-[var(--royal)] led-glow-blue transition-all duration-500 group-hover:led-glow-gold" />
        <div className="absolute inset-[2px] rounded-[10px] bg-gradient-to-br from-[var(--navy)] to-black grid place-items-center">
          <span className="font-display text-[var(--gold)] text-lg font-bold tracking-tight text-glow-gold">RM</span>
        </div>
      </div>
      <div className="leading-tight">
        <div className="font-display text-[15px] font-semibold tracking-[0.18em] text-white">
          SIGN <span className="text-gradient-gold">FACTORY</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
          Illuminating Brands
        </div>
      </div>
    </Link>
  );
}
