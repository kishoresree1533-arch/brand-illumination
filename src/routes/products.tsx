import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import acrylic from "@/assets/product-acrylic.jpg";
import neon from "@/assets/product-neon.jpg";
import outdoor from "@/assets/product-outdoor.jpg";
import digital from "@/assets/product-digital.jpg";
import threeD from "@/assets/product-3d.jpg";
import wayfinding from "@/assets/product-wayfinding.jpg";
import hero from "@/assets/hero-signage.jpg";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — RM Sign Factory" },
      { name: "description", content: "LED, acrylic, neon, 3D, ACP, digital displays, wayfinding and custom signage." },
    ],
  }),
  component: ProductsPage,
});

type Cat =
  | "All"
  | "LED"
  | "Acrylic"
  | "Glow"
  | "3D Letters"
  | "Neon"
  | "ACP"
  | "Outdoor"
  | "Digital"
  | "Wayfinding"
  | "Custom";

interface Product {
  id: string;
  title: string;
  cat: Exclude<Cat, "All">;
  img: string;
  desc: string;
}

const PRODUCTS: Product[] = [
  { id: "led-edge", title: "Edge-Lit LED Board", cat: "LED", img: hero, desc: "Slim, ultra-bright LED panels for storefront facades and indoor branding." },
  { id: "led-light", title: "LED Light Box", cat: "LED", img: digital, desc: "Even-lit aluminum light boxes with crisp full-color graphics." },
  { id: "acrylic-halo", title: "Halo-Lit Acrylic", cat: "Acrylic", img: acrylic, desc: "Polished acrylic letters with warm halo lighting on brushed metal." },
  { id: "glow-mod", title: "Modern Glow Sign", cat: "Glow", img: neon, desc: "Diffused glow signs with full-color matching to your brand palette." },
  { id: "3d-channel", title: "Channel Letter Set", cat: "3D Letters", img: threeD, desc: "Stainless / brass channel letters with internal RGB illumination." },
  { id: "neon-custom", title: "Custom Neon Art", cat: "Neon", img: neon, desc: "Hand-bent neon and flexible LED neon — any shape, any color." },
  { id: "acp-facade", title: "ACP Facade Cladding", cat: "ACP", img: outdoor, desc: "Weather-resistant ACP cladding with integrated signage." },
  { id: "out-billboard", title: "Outdoor Mega Board", cat: "Outdoor", img: hero, desc: "Large-format weatherproof boards for highways and high-rises." },
  { id: "digital-wall", title: "LED Video Wall", cat: "Digital", img: digital, desc: "Pixel-perfect indoor & outdoor video walls with content CMS." },
  { id: "way-airport", title: "Wayfinding System", cat: "Wayfinding", img: wayfinding, desc: "Coordinated wayfinding suites for malls, airports and hospitals." },
  { id: "custom-installation", title: "Custom Installation", cat: "Custom", img: threeD, desc: "End-to-end bespoke installations — from concept to commissioning." },
  { id: "led-pylon", title: "Illuminated Pylon", cat: "Outdoor", img: outdoor, desc: "Tall illuminated pylons for fuel stations, malls and complexes." },
];

const CATS: Cat[] = ["All", "LED", "Acrylic", "Glow", "3D Letters", "Neon", "ACP", "Outdoor", "Digital", "Wayfinding", "Custom"];

function ProductsPage() {
  const [cat, setCat] = useState<Cat>("All");
  const [preview, setPreview] = useState<Product | null>(null);

  const filtered = useMemo(() => (cat === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat)), [cat]);

  return (
    <SiteShell>
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold)]">The catalogue</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.98]">
              Every kind of sign, <span className="text-gradient-gold">engineered to glow.</span>
            </h1>
          </Reveal>

          <div className="mt-12 flex flex-wrap gap-2">
            {CATS.map((c) => {
              const active = cat === c;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`relative rounded-full border px-4 py-2 text-sm transition-all ${
                    active
                      ? "border-[var(--gold)]/60 bg-[var(--gold)]/10 text-[var(--gold)] led-glow-gold"
                      : "border-white/10 text-white/70 hover:text-white"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <motion.div layout className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.button
                  layout
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, delay: (i % 6) * 0.04 }}
                  onClick={() => setPreview(p)}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 text-left"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: "radial-gradient(420px circle at 50% 80%, oklch(0.82 0.16 88 / 0.35), transparent 60%)" }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--gold)]">{p.cat}</p>
                    <h3 className="mt-2 text-xl font-semibold">{p.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-white/70">{p.desc}</p>
                  </div>
                  <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full glass opacity-0 transition-opacity group-hover:opacity-100">
                    <ZoomIn className="h-4 w-4" />
                  </div>
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-transparent transition group-hover:ring-[var(--gold)]/40" />
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ y: 40, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 30, scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl overflow-hidden rounded-3xl glass-strong"
            >
              <button
                onClick={() => setPreview(null)}
                className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full glass"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="grid md:grid-cols-2">
                <div className="aspect-[4/3] md:aspect-auto md:h-full overflow-hidden">
                  <img src={preview.img} alt={preview.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-8 md:p-12">
                  <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold)]">{preview.cat}</p>
                  <h2 className="mt-3 text-3xl font-bold md:text-4xl">{preview.title}</h2>
                  <p className="mt-5 text-muted-foreground">{preview.desc}</p>
                  <ul className="mt-8 space-y-3 text-sm">
                    {["3-year warranty", "IP65 weather rating", "Custom colour matching", "In-house manufacturing & install"].map((f) => (
                      <li key={f} className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)] led-glow-gold" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button className="magnetic-btn mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-6 py-3 text-sm font-semibold text-[var(--navy)] led-glow-gold">
                    Request Quote
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SiteShell>
  );
}
