import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowUpRight, Lightbulb, Sparkles, Zap, Shield, Layers, Cpu, MoveRight, Star, Quote,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Reveal, RevealText } from "@/components/Reveal";
import heroImg from "@/assets/hero-signage.jpg";
import acrylicImg from "@/assets/product-acrylic.jpg";
import neonImg from "@/assets/product-neon.jpg";
import outdoorImg from "@/assets/product-outdoor.jpg";
import digitalImg from "@/assets/product-digital.jpg";
import threeDImg from "@/assets/product-3d.jpg";
import factoryImg from "@/assets/factory.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RM Sign Factory — Premium Signage Solutions" },
      { name: "description", content: "Cinematic LED signage, acrylic, neon and 3D branding manufactured to illuminate iconic storefronts." },
    ],
  }),
  component: HomePage,
});

const services = [
  { icon: Lightbulb, title: "LED Sign Boards", desc: "Edge-lit, slim panels engineered for 24/7 brightness and unrivaled lifespan." },
  { icon: Sparkles, title: "Acrylic & Glow Signs", desc: "Crystal-clear acrylic crafted with halo lighting for premium brand presence." },
  { icon: Zap, title: "Neon Signage", desc: "Hand-bent retro neon and flexible LED neon in any custom curve or color." },
  { icon: Layers, title: "3D Letter Boards", desc: "Stainless steel, brass and acrylic channel letters with depth that commands attention." },
  { icon: Shield, title: "Outdoor Signage", desc: "Weather-sealed ACP cladding boards built for facades, gantries and high-rises." },
  { icon: Cpu, title: "Digital Displays", desc: "Pixel-perfect LED video walls and dynamic outdoor digital displays." },
];

const stats = [
  { v: "1.2K+", l: "Brands Illuminated" },
  { v: "18", l: "Years of Craft" },
  { v: "47", l: "Cities Served" },
  { v: "99%", l: "Client Retention" },
];

const products = [
  { img: acrylicImg, label: "Acrylic", title: "Halo-Lit Acrylic" },
  { img: neonImg, label: "Neon", title: "Custom Neon Art" },
  { img: threeDImg, label: "3D Letters", title: "Channel Letter Suite" },
  { img: outdoorImg, label: "Outdoor", title: "Architectural ACP" },
  { img: digitalImg, label: "Digital", title: "LED Display Walls" },
];

const testimonials = [
  { q: "RM delivered a flagship facade that turned our brand into a city landmark. The light quality is unreal.", n: "Aanya Mehra", r: "Brand Director, Lumea Hotels" },
  { q: "From design to install in 11 days. The 3D channel letters are flawless — sharp, deep and warm at night.", n: "Rohan Kapoor", r: "Co-Founder, Northcraft Coffee" },
  { q: "Most signage vendors sell boards. RM sells presence. Their neon-acrylic combo redefined our showroom.", n: "Priya Nair", r: "Head of Retail, Vesta Living" },
];

function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <Marquee />
      <Services />
      <WhyUs />
      <FeaturedProducts />
      <Showcase />
      <Testimonials />
      <CtaBanner />
    </SiteShell>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative -mt-28 h-[100vh] min-h-[720px] w-full overflow-hidden">
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <img src={heroImg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/60 via-[var(--background)]/30 to-[var(--background)]" />
        <div className="absolute inset-0 grid-bg opacity-30 mix-blend-overlay" />
      </motion.div>

      {/* floating glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[28%] h-40 w-40 rounded-full bg-[var(--gold)]/30 blur-3xl animate-float" />
        <div className="absolute right-[10%] top-[40%] h-56 w-56 rounded-full bg-[var(--royal)]/40 blur-[100px] animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute left-[40%] bottom-[14%] h-24 w-24 rounded-full bg-[var(--accent)]/40 blur-2xl animate-float" style={{ animationDelay: "2.5s" }} />
      </div>

      <motion.div style={{ opacity }} className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-24">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.28em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)] animate-glow-pulse" />
            Premium Signage Studio · Est. 2007
          </div>
        </Reveal>

        <h1 className="mt-6 max-w-5xl font-display text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.95] tracking-tight">
          <RevealText text="Premium signage that" />
          <span className="block">
            <RevealText text="illuminates" className="text-gradient-gold text-glow-gold" />{" "}
            <RevealText text="your brand." />
          </span>
        </h1>

        <Reveal delay={0.3} className="mt-8 max-w-xl text-base text-muted-foreground md:text-lg">
          We design, fabricate and install cinematic LED, acrylic, neon and architectural
          signage for storefronts, towers and stages worldwide.
        </Reveal>

        <Reveal delay={0.5} className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/contact"
            className="magnetic-btn group inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-7 py-4 text-sm font-semibold text-[var(--navy)] led-glow-gold"
          >
            Start Your Project <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            to="/portfolio"
            className="group inline-flex items-center gap-2 rounded-full glass px-7 py-4 text-sm font-semibold text-white hover:led-glow-blue"
          >
            Explore Portfolio <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </motion.div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-white/60">
        <div className="mx-auto mb-3 h-10 w-px bg-gradient-to-b from-transparent via-[var(--gold)] to-transparent" />
        Scroll
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["LED Boards", "Acrylic", "Neon", "3D Letters", "ACP Cladding", "Glow Signs", "Digital Displays", "Wayfinding"];
  return (
    <section className="relative border-y border-white/10 bg-black/30 py-6 overflow-hidden">
      <div className="flex w-max marquee-track gap-12 whitespace-nowrap">
        {[...items, ...items, ...items].map((t, i) => (
          <div key={i} className="flex items-center gap-12 text-sm uppercase tracking-[0.35em] text-white/40">
            <span>{t}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold)]">What we craft</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            A full spectrum of <span className="text-gradient-royal">signage</span> craft.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.07}>
              <ServiceCard {...s} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon: Icon, title, desc }: { icon: typeof Lightbulb; title: string; desc: string }) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-8 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--gold)]/40"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(380px circle at var(--mx) var(--my), oklch(0.82 0.16 88 / 0.18), transparent 60%)" }}
      />
      <div className="relative">
        <div className="mb-6 inline-grid h-12 w-12 place-items-center rounded-xl bg-[var(--royal)]/30 ring-1 ring-[var(--royal)]/40 transition-all group-hover:led-glow-blue">
          <Icon className="h-5 w-5 text-[var(--gold)]" />
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
        <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--gold)] opacity-0 transition-opacity group-hover:opacity-100">
          Explore <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}

function WhyUs() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold)]">Why RM</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                Engineering precision meets <span className="text-gradient-gold">cinematic light.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-lg text-muted-foreground">
                Every sign that leaves our factory is colour-graded, photometric-tested
                and weather-sealed. We treat your brand the way a studio treats a film —
                with intention and lighting that lasts.
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-2 gap-6">
              {stats.map((s) => (
                <Reveal key={s.l}>
                  <div className="rounded-2xl glass p-6">
                    <div className="font-display text-4xl font-bold text-gradient-gold md:text-5xl">{s.v}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">{s.l}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal>
            <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10">
              <img src={factoryImg} alt="Manufacturing" loading="lazy" width={1600} height={1000} className="h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-0 p-8">
                <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold)]">Inside the studio</p>
                <h3 className="mt-3 text-2xl font-semibold">Where every photon is intentional.</h3>
              </div>
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[var(--gold)]/0 transition group-hover:ring-[var(--gold)]/50" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold)]">Featured craft</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-4 max-w-2xl text-4xl font-bold md:text-5xl">Signage with depth, presence and glow.</h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <Link to="/products" className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--gold)]">
              View all products <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid auto-rows-[280px] gap-5 md:grid-cols-3 md:auto-rows-[320px]">
          {products.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i * 0.06}
              className={
                i === 0
                  ? "md:col-span-2 md:row-span-2 md:h-auto"
                  : ""
              }
            >
              <ProductTile {...p} large={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductTile({ img, label, title, large }: { img: string; label: string; title: string; large?: boolean }) {
  return (
    <div className="group relative h-full w-full overflow-hidden rounded-2xl border border-white/10">
      <img src={img} alt={title} loading="lazy" width={1280} height={960} className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-[1.08]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(500px circle at 50% 80%, oklch(0.82 0.16 88 / 0.35), transparent 60%)" }}
      />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--gold)]">{label}</p>
        <h3 className={`mt-2 font-semibold ${large ? "text-3xl md:text-4xl" : "text-xl"}`}>{title}</h3>
      </div>
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/0 transition group-hover:ring-[var(--gold)]/40" />
    </div>
  );
}

function Showcase() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold)]">Before & after</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 max-w-3xl text-4xl font-bold md:text-5xl">
            Watch a storefront <span className="text-gradient-royal">transform</span> after dark.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 aspect-[4/3]">
              <img src={outdoorImg} alt="Before" loading="lazy" className="h-full w-full object-cover grayscale" />
              <div className="absolute left-4 top-4 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-[0.3em]">Before</div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-3xl border border-[var(--gold)]/40 led-glow-gold aspect-[4/3]">
              <img src={heroImg} alt="After" loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute left-4 top-4 rounded-full bg-[var(--gold)] px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[var(--navy)] font-semibold">After</div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold)]">Client voices</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 max-w-3xl text-4xl font-bold md:text-5xl">Trusted by brands that obsess over detail.</h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.n} delay={i * 0.08}>
              <div className="relative h-full rounded-3xl glass-strong p-8">
                <Quote className="h-7 w-7 text-[var(--gold)]" />
                <p className="mt-5 text-base leading-relaxed text-white/85">{t.q}</p>
                <div className="mt-8 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{t.n}</div>
                    <div className="text-xs text-muted-foreground">{t.r}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} className="h-3.5 w-3.5 fill-[var(--gold)] text-[var(--gold)]" />
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 p-10 md:p-16">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--royal)] via-[var(--navy)] to-black" />
            <div className="absolute -top-20 -left-10 h-80 w-80 rounded-full bg-[var(--gold)]/30 blur-3xl animate-float" />
            <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-[var(--accent)]/40 blur-[120px] animate-float" style={{ animationDelay: "1s" }} />
            <div className="absolute inset-0 grid-bg opacity-30" />

            <div className="relative grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold)]">Ready when you are</p>
                <h2 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
                  Let’s light up <span className="text-gradient-gold text-glow-gold">your brand</span>.
                </h2>
                <p className="mt-5 max-w-lg text-muted-foreground">
                  Concept, render, manufacture, install. Tell us about your space and
                  we’ll come back with a cinematic proposal in 48 hours.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 md:justify-end">
                <Link to="/contact" className="magnetic-btn inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-7 py-4 text-sm font-semibold text-[var(--navy)] led-glow-gold">
                  Request a Quote <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link to="/portfolio" className="inline-flex items-center gap-2 rounded-full glass px-7 py-4 text-sm font-semibold">
                  See Our Work
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
