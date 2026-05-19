import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import acrylic from "@/assets/product-acrylic.jpg";
import neon from "@/assets/product-neon.jpg";
import outdoor from "@/assets/product-outdoor.jpg";
import digital from "@/assets/product-digital.jpg";
import threeD from "@/assets/product-3d.jpg";
import wayfinding from "@/assets/product-wayfinding.jpg";
import hero from "@/assets/hero-signage.jpg";
import factory from "@/assets/factory.jpg";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — RM Sign Factory" },
      { name: "description", content: "Featured installations and brand transformations crafted by RM Sign Factory." },
    ],
  }),
  component: PortfolioPage,
});

const CATS = ["All", "Retail", "Hospitality", "Corporate", "Outdoor"] as const;
type Cat = (typeof CATS)[number];

interface Item { id: string; title: string; cat: Exclude<Cat, "All">; img: string; year: string; tall?: boolean; wide?: boolean }

const ITEMS: Item[] = [
  { id: "1", title: "Lumea Hotels Facade", cat: "Hospitality", img: hero, year: "2025", wide: true },
  { id: "2", title: "Northcraft Coffee", cat: "Retail", img: acrylic, year: "2024", tall: true },
  { id: "3", title: "Vesta Living Showroom", cat: "Retail", img: threeD, year: "2024" },
  { id: "4", title: "Aurora Lounge Neon", cat: "Hospitality", img: neon, year: "2025" },
  { id: "5", title: "Corp HQ ACP Tower", cat: "Corporate", img: outdoor, year: "2023", tall: true },
  { id: "6", title: "Galleria Digital Wall", cat: "Outdoor", img: digital, year: "2025", wide: true },
  { id: "7", title: "Skyline Wayfinding", cat: "Corporate", img: wayfinding, year: "2024" },
  { id: "8", title: "Studio Manufacturing", cat: "Corporate", img: factory, year: "2024" },
];

function PortfolioPage() {
  const [cat, setCat] = useState<Cat>("All");
  const [active, setActive] = useState<Item | null>(null);
  const items = useMemo(() => (cat === "All" ? ITEMS : ITEMS.filter((i) => i.cat === cat)), [cat]);

  return (
    <SiteShell>
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold)]">Selected work</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.98]">
              Brands that became <span className="text-gradient-gold">landmarks.</span>
            </h1>
          </Reveal>

          <div className="mt-10 flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-2 text-sm transition-all ${
                  cat === c
                    ? "border-[var(--gold)]/60 bg-[var(--gold)]/10 text-[var(--gold)] led-glow-gold"
                    : "border-white/10 text-white/70 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <motion.div layout className="mt-12 grid gap-5 md:grid-cols-3 md:auto-rows-[280px]">
            <AnimatePresence mode="popLayout">
              {items.map((it, i) => (
                <motion.button
                  layout
                  key={it.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
                  onClick={() => setActive(it)}
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 text-left ${
                    it.wide ? "md:col-span-2" : ""
                  } ${it.tall ? "md:row-span-2" : ""}`}
                >
                  <img
                    src={it.img}
                    alt={it.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: "radial-gradient(500px circle at 50% 70%, oklch(0.55 0.24 264 / 0.4), transparent 60%)" }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--gold)]">{it.cat} · {it.year}</p>
                    <h3 className="mt-2 text-xl font-semibold md:text-2xl">{it.title}</h3>
                  </div>
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-transparent transition group-hover:ring-[var(--gold)]/40" />
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[80] grid place-items-center bg-black/85 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10"
            >
              <img src={active.img} alt={active.title} className="aspect-[16/10] w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-8">
                <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold)]">{active.cat} · {active.year}</p>
                <h2 className="mt-2 text-3xl font-bold md:text-5xl">{active.title}</h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SiteShell>
  );
}
