import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// ── Asset imports ────────────────────────────────────────────────────────────
import acrylic    from "@/assets/product-acrylic.jpg";
import neon       from "@/assets/product-neon.jpg";
import outdoor    from "@/assets/product-outdoor.jpg";
import digital    from "@/assets/product-digital.jpg";
import wayfinding from "@/assets/product-wayfinding.jpg";
import factory    from "@/assets/factory.jpg";
import premiumHero from "@/assets/premium_hero.png";
import brassLetter from "@/assets/image copy 7.png";
import miniSs3d   from "@/assets/image copy 8.png";
import gold3dBrush from "@/assets/image copy 9.png";
import ledPylon   from "@/assets/image copy 10.png";
import trafficU   from "@/assets/image copy 11.png";
import shopSignage from "@/assets/image copy 12.png";
import vacuumFoaming from "@/assets/image copy 4.png";
import ledAcrylic from "@/assets/image copy 3.png";
import ledOutdoor from "@/assets/image copy 5.png";
import flexPrinting from "@/assets/image copy 6.png";
import ecoSolvent  from "@/assets/image.png";
import acpRouter  from "@/assets/product-acp-router.png";
import engineeredHero from "@/assets/engineered_hero.png";
import portfolioHero from "@/assets/portfolio_hero.jpg";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — RM Sign Factory" },
      { name: "description", content: "Featured installations and brand transformations crafted by RM Sign Factory." },
    ],
  }),
  component: PortfolioPage,
});

const CATS = ["All", "Retail", "Hospitality", "Corporate", "Outdoor", "LED & Neon", "Printing"] as const;
type Cat = (typeof CATS)[number];

interface Item {
  id: string;
  title: string;
  cat: Exclude<Cat, "All">;
  client: string;
  img: string;
  year: string;
}

const ITEMS: Item[] = [
  { id: "1",  title: "Luxury Hotel Facade Signage",       cat: "Hospitality", client: "Grand Palace Hotels",         img: premiumHero,     year: "2024" },
  { id: "2",  title: "Corporate Lobby 3D Brass Letters",  cat: "Corporate",   client: "Infosys Chennai",             img: brassLetter,     year: "2024" },
  { id: "3",  title: "LED Acrylic Glow Storefront",       cat: "Retail",      client: "Reliance Trends",             img: ledAcrylic,      year: "2024" },
  { id: "4",  title: "Outdoor LED Pylon Sign",            cat: "Outdoor",     client: "Phoenix Mall",                img: ledPylon,        year: "2023" },
  { id: "5",  title: "Gold 3D Brushed Reception Wall",    cat: "Corporate",   client: "HDFC Bank HQ",                img: gold3dBrush,     year: "2024" },
  { id: "6",  title: "Neon Art Installation",             cat: "LED & Neon",  client: "The Brew House",              img: neon,            year: "2023" },
  { id: "7",  title: "ACP Router Cut Facade Cladding",    cat: "Outdoor",     client: "Prestige Group",              img: acpRouter,       year: "2024" },
  { id: "8",  title: "Mini SS 3D Office Nameplate",       cat: "Corporate",   client: "Deloitte India",              img: miniSs3d,        year: "2023" },
  { id: "9",  title: "Flex Banner Campaign",              cat: "Printing",    client: "Big Bazaar",                  img: flexPrinting,    year: "2024" },
  { id: "10", title: "LED Digital Display Wall",          cat: "LED & Neon",  client: "Lulu Mall",                   img: digital,         year: "2024" },
  { id: "11", title: "Wayfinding Signage System",         cat: "Corporate",   client: "Apollo Hospitals",            img: wayfinding,      year: "2023" },
  { id: "12", title: "Traffic & Directional Signs",       cat: "Outdoor",     client: "Chennai Smart City",          img: trafficU,        year: "2023" },
  { id: "13", title: "Premium Shop Front Branding",       cat: "Retail",      client: "Tanishq Jewellers",           img: shopSignage,     year: "2024" },
  { id: "14", title: "Vacuum Foaming 3D Fascia",          cat: "Retail",      client: "Westside Stores",             img: vacuumFoaming,   year: "2023" },
  { id: "15", title: "Eco Solvent Vehicle Wrap",          cat: "Printing",    client: "Swiggy Fleet",                img: ecoSolvent,      year: "2024" },
  { id: "16", title: "LED Outdoor Glow Hoarding",         cat: "Outdoor",     client: "Godrej Properties",           img: ledOutdoor,      year: "2024" },
  { id: "17", title: "Acrylic Laser Cut Reception Sign",  cat: "Hospitality", client: "Taj Coromandel",              img: acrylic,         year: "2023" },
  { id: "18", title: "Factory Signage & Safety Boards",   cat: "Corporate",   client: "TVS Motors",                  img: factory,         year: "2023" },
  { id: "19", title: "Engineered 3D Channel Letters",     cat: "Retail",      client: "Croma Electronics",           img: engineeredHero,  year: "2024" },
  { id: "20", title: "Outdoor Signboard Installation",    cat: "Outdoor",     client: "National Highway Authority",  img: outdoor,         year: "2024" },
];

const STATS = [
  { v: "500+", l: "Projects Completed" },
  { v: "200+", l: "Happy Clients" },
  { v: "10+",  l: "Years Experience" },
  { v: "4",    l: "Service Categories" },
];

function PortfolioPage() {
  const [cat, setCat] = useState<Cat>("All");
  const [active, setActive] = useState<Item | null>(null);

  const items = useMemo(
    () => (cat === "All" ? ITEMS : ITEMS.filter((i) => i.cat === cat)),
    [cat]
  );

  // Count per category for labels
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    ITEMS.forEach((i) => { map[i.cat] = (map[i.cat] || 0) + 1; });
    return map;
  }, []);

  return (
    <SiteShell>

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <section className="relative -mt-28 h-[55vh] min-h-[420px] lg:h-[65vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={portfolioHero}
            alt="RM Sign Factory Portfolio"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/30" />
          <div className="absolute inset-0 grid-bg opacity-[0.06] mix-blend-overlay" />
        </div>
        <div className="relative z-10 flex h-full flex-col justify-end pb-10 md:pb-14 px-6 md:px-12 lg:px-20">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--gold)] font-bold mb-3">
              Selected Work
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-[clamp(1.8rem,5.5vw,4rem)] font-bold text-white leading-[1.05] max-w-[640px]">
              Brands that became landmarks.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-3 max-w-[520px] text-sm text-white/65 leading-relaxed">
              A premium exhibition of flagship storefront facades, luxury hotel indicators,
              neon lounges, and digital walls we designed and fabricated.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────────────────── */}
      <div className="border-y border-white/10 bg-foreground/[0.04] py-6">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.l} delay={i * 0.06}>
                <div className="text-center">
                  <div className="font-display text-3xl font-bold text-gradient-gold">{s.v}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{s.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter + Grid ───────────────────────────────────────────────── */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-4">

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-12">
            {CATS.map((c) => {
              const count = c === "All" ? ITEMS.length : (counts[c] || 0);
              const active_cat = cat === c;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    active_cat
                      ? "border-[var(--gold)]/60 bg-[var(--gold)]/10 text-[var(--gold)] led-glow-gold"
                      : "border-white/10 text-white/70 hover:text-white hover:border-white/30"
                  }`}
                >
                  {c}
                  {c !== "All" && (
                    <span className={`ml-1.5 text-[10px] ${active_cat ? "text-[var(--gold)]/70" : "text-white/40"}`}>
                      ({count})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Masonry-style grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {items.map((it, i) => (
                <motion.button
                  key={it.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: (i % 8) * 0.04 }}
                  onClick={() => setActive(it)}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 text-left aspect-[4/3] cursor-pointer"
                >
                  <img
                    src={it.img}
                    alt={it.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: "radial-gradient(400px circle at 50% 80%, oklch(0.82 0.16 88 / 0.18), transparent 60%)" }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--gold)] font-bold">
                      {it.cat}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mt-0.5">
                      {it.client} · {it.year}
                    </p>
                    <h3 className="mt-1.5 text-sm font-semibold text-white leading-tight">{it.title}</h3>
                  </div>
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-transparent transition group-hover:ring-[var(--gold)]/40" />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Lightbox ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[80] grid place-items-center bg-black/85 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10"
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-black/60 border border-white/10 text-white hover:bg-black/80 flex items-center justify-center transition-all"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <img
                src={active.img}
                alt={active.title}
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-8">
                <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold)] font-bold">
                  {active.cat} · {active.client} · {active.year}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white md:text-4xl">{active.title}</h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </SiteShell>
  );
}
