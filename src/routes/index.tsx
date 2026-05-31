import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useMotionValue, animate, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  ArrowUpRight, Lightbulb, Sparkles, Zap, Shield, Layers, Cpu, MoveRight, Star, Quote,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Reveal, RevealText } from "@/components/Reveal";
import factoryImg from "@/assets/factory.jpg";
import homeHeroImg from "@/assets/home_hero.png";
import featureAcrylicImg from "@/assets/product-acrylic.jpg";
import featureNeonImg from "@/assets/product-neon.jpg";
import feature3dImg from "@/assets/product-3d.jpg";

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
  { icon: Lightbulb, title: "LED Sign Boards",      desc: "Edge-lit, slim panels engineered for 24/7 brightness and unrivaled lifespan.",           productId: "led-acrylic-signage",  color: "#F6B831", bg: "linear-gradient(135deg, #0d2240 0%, #163458 70%, #1e4a7a 100%)" },
  { icon: Sparkles,  title: "Acrylic & Glow Signs", desc: "Crystal-clear acrylic crafted with halo lighting for premium brand presence.",           productId: "led-acrylic-neon",     color: "#163458", bg: "linear-gradient(135deg, #c49000 0%, #F6B831 70%, #f8c84a 100%)" },
  { icon: Zap,       title: "Neon Signage",          desc: "Hand-bent retro neon and flexible LED neon in any custom curve or color.",               productId: "neon-sign",            color: "#F6B831", bg: "linear-gradient(135deg, #3a4245 0%, #555D60 70%, #6b7478 100%)" },
  { icon: Layers,    title: "3D Letter Boards",      desc: "Stainless steel, brass and acrylic channel letters with depth that commands attention.", productId: "brass-letter-signage", color: "#F6B831", bg: "linear-gradient(135deg, #0d2240 0%, #163458 70%, #1e4a7a 100%)" },
  { icon: Shield,    title: "Outdoor Signage",       desc: "Weather-sealed ACP cladding boards built for facades, gantries and high-rises.",         productId: "outdoor-signboard",    color: "#163458", bg: "linear-gradient(135deg, #c49000 0%, #F6B831 70%, #f8c84a 100%)" },
  { icon: Cpu,       title: "Digital Displays",      desc: "Pixel-perfect LED video walls and dynamic outdoor digital displays.",                    productId: "digital-display",      color: "#F6B831", bg: "linear-gradient(135deg, #3a4245 0%, #555D60 70%, #6b7478 100%)" },
];

const featuredCraft = [
  { title: "Halo-Lit Acrylic", label: "Acrylic", image: featureAcrylicImg },
  { title: "Custom Neon Art", label: "Neon", image: featureNeonImg },
  { title: "Channel Letter Suite", label: "3D", image: feature3dImg },
];

const stats = [
  { v: "1.2K+", l: "Brands Illuminated" },
  { v: "18", l: "Years of Craft" },
  { v: "47", l: "Cities Served" },
  { v: "99%", l: "Client Retention" },
];



const testimonials = [
  { q: "RM delivered a flagship facade that turned our brand into a city landmark. The light quality is unreal.", n: "Aanya Mehra", r: "Brand Director, Lumea Hotels" },
  { q: "From design to install in 11 days. The 3D channel letters are flawless — sharp, deep and warm at night.", n: "Rohan Kapoor", r: "Co-Founder, Northcraft Coffee" },
  { q: "Most signage vendors sell boards. RM sells presence. Their neon-acrylic combo redefined our showroom.", n: "Priya Nair", r: "Head of Retail, Vesta Living" },
];

function CounterNumber({ value }: { value: string }) {
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  useEffect(() => {
    if (!isInView) return;

    const extractNumber = (str: string) => parseInt(str.replace(/\D/g, ""), 10) || 0;
    const targetValue = extractNumber(value);
    const suffix = value.replace(/\d/g, "");

    const unsubscribe = count.on("change", (v) => {
      setDisplayValue(Math.floor(v) + suffix);
    });

    const animation = animate(count, targetValue, {
      duration: 2.5,
      ease: "easeOut",
    });

    return () => {
      unsubscribe();
      animation.stop();
    };
  }, [isInView, value, count]);

  return <motion.div ref={ref}>{displayValue}</motion.div>;
}

function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <Marquee />
      <Services />
      <Process />
      <WhyUs />
      <Stats />
      <Testimonials />
      <FeaturedCraft />
      <CtaBanner />
    </SiteShell>
  );
}

function Hero() {
  return (
    <section className="relative -mt-28 h-[100vh] min-h-[600px] w-full overflow-hidden flex items-end">
      <div className="absolute inset-0">
        <img src={homeHeroImg} alt="RM Sign Factory" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-l from-black/75 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        <div className="absolute inset-0 grid-bg opacity-20 mix-blend-overlay" />
      </div>

      {/* floating glows — hidden on mobile for performance */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute left-[8%] top-[28%] h-40 w-40 rounded-full bg-[var(--gold)]/30 blur-3xl animate-float" />
        <div className="absolute right-[10%] top-[40%] h-56 w-56 rounded-full bg-[var(--gold)]/15 blur-[100px] animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute left-[40%] bottom-[14%] h-24 w-24 rounded-full bg-[var(--gold)]/20 blur-2xl animate-float" style={{ animationDelay: "2.5s" }} />
      </div>

      {/* Content — right-aligned on desktop, left-aligned on mobile */}
      <div className="relative z-10 w-full pb-10 sm:pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-6 flex justify-start md:justify-end">
          <div className="w-full max-w-xl text-left md:mr-[-2rem]">
            <h1 className="font-display font-bold leading-[1.1] tracking-tight"
                style={{ fontSize: "clamp(1.6rem, 5vw, 2.6rem)" }}>
              <span className="block text-white">
                <RevealText text="Premium signage that" className="text-white" />
              </span>
              <span className="block mt-1">
                <span style={{ color: "#F6B831" }}>
                  <RevealText text="illuminates" className="text-white-shadow-premium" />
                </span>
                {" "}
                <RevealText text="your brand." className="text-white" />
              </span>
            </h1>

            <Reveal delay={0.3} className="mt-4 text-sm sm:text-base text-white/75 leading-relaxed max-w-md">
              We design, fabricate and install cinematic LED, acrylic, neon and architectural
              signage for storefronts, towers and stages worldwide.
            </Reveal>

            <Reveal delay={0.5} className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-start gap-3">
              <Link
                to="/contact"
                className="magnetic-btn group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[var(--gold)] px-7 py-3.5 text-sm font-semibold text-[var(--navy)] led-glow-gold"
              >
                Start Your Project <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/portfolio"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white/90 px-7 py-3.5 text-sm font-semibold text-[var(--navy)] hover:bg-white transition-all duration-300"
              >
                Explore Portfolio <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-white/50">
        <div className="mx-auto mb-2 h-8 w-px bg-gradient-to-b from-transparent via-[var(--gold)] to-transparent" />
        Scroll
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    { label: "LED Boards",       color: "#f59e0b" },
    { label: "Acrylic",          color: "#38bdf8" },
    { label: "Neon",             color: "#f472b6" },
    { label: "3D Letters",       color: "#a78bfa" },
    { label: "ACP Cladding",     color: "#34d399" },
    { label: "Glow Signs",       color: "#fb923c" },
    { label: "Digital Displays", color: "#60a5fa" },
    { label: "Wayfinding",       color: "#facc15" },
  ];
  const repeated = [...items, ...items, ...items];
  return (
    <section className="relative border-y border-[#163458]/10 py-5 overflow-hidden">
      <div className="flex w-max marquee-track gap-10 whitespace-nowrap">
        {repeated.map((item, i) => (
          <div key={i} className="flex items-center gap-10">
            <span
              className="text-sm font-bold uppercase tracking-[0.3em]"
              style={{ color: item.color, textShadow: `0 0 12px ${item.color}60` }}
            >
              {item.label}
            </span>
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="relative py-16 overflow-hidden bg-white">
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <Reveal>
            <p className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[var(--gold)]">
              <span className="h-px w-8 bg-[var(--gold)]/60" />
              Our Services
              <span className="h-px w-8 bg-[var(--gold)]/60" />
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 mx-auto max-w-3xl text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight text-[#163458]">
              A full spectrum of{" "}
              <span className="text-gradient-gold">signage</span>{" "}
              craft.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 mx-auto max-w-xl text-[#163458]/60">
              From edge-lit LEDs to hand-bent neon — every medium, every surface, every brand story brought to light.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <ServiceCard {...s} />
            </Reveal>
          ))}
        </div>      </div>
    </section>
  );
}

function FeaturedCraft() {
  return (
    <section className="relative py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[var(--gold)]">
              <span className="h-px w-8 bg-[var(--gold)]/60" />
              Featured Craft
              <span className="h-px w-8 bg-[var(--gold)]/60" />
            </p>
            <h2 className="mt-6 max-w-3xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#163458]">
              Signage with depth, presence <span className="text-gradient-gold">and glow.</span>
            </h2>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)] transition-colors hover:text-[#163458]">
            View all products <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr] items-start">
          {/* Main (Left) Featured Card */}
          <div className="group flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl h-[320px] sm:h-[400px] lg:h-[480px] w-full">
              <img
                src={featuredCraft[0].image}
                alt={featuredCraft[0].title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="px-2">
              <span className="text-[10px] uppercase tracking-[0.32em] text-[var(--gold)] font-semibold">{featuredCraft[0].label}</span>
              <h3 className="mt-2 text-2xl font-bold text-[#163458] md:text-3xl transition-colors duration-300 group-hover:text-[var(--gold)]">
                {featuredCraft[0].title}
              </h3>
            </div>
          </div>

          {/* Right Column Stack */}
          <div className="flex flex-col gap-8">
            {featuredCraft.slice(1).map((item) => (
              <div key={item.title} className="group flex flex-col gap-4">
                <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-48 w-full object-cover sm:h-56 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-2">
                  <span className="text-[10px] uppercase tracking-[0.32em] text-[var(--gold)] font-semibold">{item.label}</span>
                  <h3 className="mt-2 text-xl font-bold text-[#163458] transition-colors duration-300 group-hover:text-[var(--gold)]">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon: Icon, title, desc, productId, color, bg }: { icon: typeof Lightbulb; title: string; desc: string; productId: string; color: string; bg: string }) {
  return (
    <div
      className="group relative h-full w-full rounded-3xl border border-white/10 transition-all duration-500 ease-out overflow-hidden cursor-default"
      style={{ background: bg, transformStyle: "preserve-3d", perspective: "1000px" }}
      onMouseMove={(e) => {
        if (!window.matchMedia('(hover: hover)').matches) return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const cx = r.width / 2;
        const cy = r.height / 2;
        const rotX = ((y - cy) / cy) * -6;
        const rotY = ((x - cx) / cx) * 6;
        e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
        e.currentTarget.style.setProperty("--mx", `${x}px`);
        e.currentTarget.style.setProperty("--my", `${y}px`);
        e.currentTarget.style.boxShadow = `0 24px 48px -12px ${color}60`;
        e.currentTarget.style.borderColor = `${color}80`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
        e.currentTarget.style.boxShadow = "";
        e.currentTarget.style.borderColor = "";
      }}
    >
      {/* Shine */}
      <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(380px circle at var(--mx) var(--my), rgba(255,255,255,0.14), transparent 50%)" }} />

      <div className="relative flex h-full flex-col p-8">
        {/* Icon */}
        <div className="mb-6 inline-grid h-14 w-14 place-items-center rounded-2xl transition-all duration-500 group-hover:-translate-y-1"
          style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
          <Icon className="h-6 w-6" style={{ color, filter: `drop-shadow(0 0 8px ${color})` }} />
        </div>

        <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/80">{desc}</p>

        <div className="mt-auto pt-6">
          <Link
            to="/products/$productId"
            params={{ productId }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 opacity-100 md:opacity-0 md:-translate-x-3 md:group-hover:opacity-100 md:group-hover:translate-x-0"
            style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = color;
              (e.currentTarget as HTMLElement).style.color = "#0d1b2a";
              (e.currentTarget as HTMLElement).style.borderColor = color;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.2)";
              (e.currentTarget as HTMLElement).style.color = "#fff";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.35)";
            }}
          >
            Explore <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stats() {
  const repeated = [...stats, ...stats, ...stats];
  return (
    <section className="relative border-y border-[#163458]/10 py-10 overflow-hidden">
      <div className="flex w-max marquee-track gap-12">
        {repeated.map((stat, i) => (
          <div key={i} className="flex flex-col items-center text-center min-w-max">
            <div className="text-4xl md:text-5xl font-display font-bold text-gradient-gold">
              <CounterNumber value={stat.v} />
            </div>
            <div className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#163458]/50 font-medium whitespace-nowrap">{stat.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    {
      num: "01",
      title: "Conceptual Design",
      desc: "We map your brand DNA to architectural spaces — studying lighting behaviour, viewing angles, and material aesthetics.",
      icon: "✦",
      color: "#F6B831",
      bg: "linear-gradient(135deg, #0d2240 0%, #163458 60%, #1e4a7a 100%)",
    },
    {
      num: "02",
      title: "Precision Fabrication",
      desc: "Our factory combines CNC routing, laser cutting, and hand-crafted neon bending — every millimetre engineered for flawless output.",
      icon: "⬡",
      color: "#F6B831",
      bg: "linear-gradient(135deg, #c49000 0%, #F6B831 60%, #f8c84a 100%)",
    },
    {
      num: "03",
      title: "White-Glove Install",
      desc: "Seamless on-site integration with colour calibration, weather-sealing, and electrical sign-off — delivered on schedule, every time.",
      icon: "◈",
      color: "#e2e8f0",
      bg: "linear-gradient(135deg, #3a4245 0%, #555D60 60%, #6b7478 100%)",
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-white">
      <div className="absolute inset-0 grid-bg opacity-[0.04]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-[var(--gold)]/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 relative z-10">
        <div className="text-center mb-16">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[var(--gold)] font-bold">
              <span className="h-px w-8 bg-[var(--gold)]/50" />
              The Studio Way
              <span className="h-px w-8 bg-[var(--gold)]/50" />
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-[#163458] tracking-tight">
              Engineered for <span className="text-gradient-gold">permanence.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 max-w-xl mx-auto text-sm text-[#163458]/55 leading-relaxed">
              From first sketch to final install — a studio process built around precision, craft, and zero compromise.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:grid-rows-1 items-stretch relative">
          <div className="hidden lg:block absolute top-[52px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gradient-to-r from-[#163458]/40 via-[#F6B831]/30 to-[#555D60]/40" />

          {steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.12} className="h-full">
              <div className="group relative rounded-3xl border border-white/10 overflow-hidden transition-all duration-500 hover:scale-[1.02] h-full"
                style={{ background: step.bg }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(300px circle at 50% 0%, rgba(255,255,255,0.08), transparent 60%)" }} />
                <div className="relative p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl text-2xl font-bold"
                      style={{ background: "rgba(255,255,255,0.15)", color: step.color, backdropFilter: "blur(8px)", boxShadow: `0 0 20px ${step.color}40` }}>
                      {step.icon}
                    </div>
                    <span className="text-5xl font-black text-white/10 font-display leading-none select-none">{step.num}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">{step.desc}</p>
                  <div className="mt-8 h-0.5 w-12 rounded-full transition-all duration-500 group-hover:w-full"
                    style={{ backgroundColor: step.color, opacity: 0.7 }} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4}>
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
            <div className="flex items-center gap-3 text-sm text-[#163458]/55">
              <span className="h-2 w-2 rounded-full bg-[#163458]" />
              Design in 48 hrs
            </div>
            <div className="hidden sm:block h-4 w-px bg-[#163458]/15" />
            <div className="flex items-center gap-3 text-sm text-[#163458]/55">
              <span className="h-2 w-2 rounded-full bg-[#F6B831]" />
              Fabrication in 5–7 days
            </div>
            <div className="hidden sm:block h-4 w-px bg-[#163458]/15" />
            <div className="flex items-center gap-3 text-sm text-[#163458]/55">
              <span className="h-2 w-2 rounded-full bg-[#555D60]" />
              Install & handover
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="relative py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="text-base md:text-lg uppercase tracking-[0.32em] text-[var(--gold)] font-semibold">Why RM?</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#163458]">
                Engineering precision meets <span className="text-gradient-gold">cinematic light.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-lg text-[#163458]/60">
                Every sign that leaves our factory is colour-graded, photometric-tested
                and weather-sealed. We treat your brand the way a studio treats a film —
                with intention and lighting that lasts.
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { l: "Automated CNC routing & laser cutting", icon: Cpu },
                { l: "Weather-sealed electrical integration", icon: Zap },
                { l: "In-house neon glass bending", icon: Sparkles },
                { l: "Architectural-grade finishes", icon: Layers },
              ].map((item, i) => (
                <Reveal key={i} delay={0.3 + i * 0.1} className="flex items-start gap-4">
                  <div className="mt-0.5 rounded-full bg-[var(--gold)]/10 p-2 text-[var(--gold)]">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium leading-relaxed text-[#163458]">{item.l}</span>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.2} className="relative h-64 sm:h-96 lg:h-full min-h-[300px] lg:min-h-[500px] w-full overflow-hidden rounded-3xl lg:order-last">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--navy)]/80 to-transparent mix-blend-overlay z-10" />
            <img src={factoryImg} alt="Factory" loading="lazy" className="absolute inset-0 h-full w-full object-cover grayscale brightness-75 contrast-125" />
            
            {/* review overlay removed for this image */}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="relative py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold)]">Client voices</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 max-w-3xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#163458]">Trusted by brands that obsess over detail.</h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.n} delay={i * 0.08}>
              <div className="relative h-full rounded-3xl bg-white border border-[#163458]/10 p-6 md:p-8 shadow-md">
                <Quote className="h-7 w-7 text-[var(--gold)]" />
                <p className="mt-5 text-base leading-relaxed text-[#163458]">{t.q}</p>
                <div className="mt-8 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#163458]">{t.n}</div>
                    <div className="text-xs text-[#163458]/60">{t.r}</div>
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
    <section className="relative py-10">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border-transparent p-8 md:p-12 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#021026] via-[#072640] to-[#041025]" />
            <div className="absolute -top-16 -left-8 h-72 w-72 rounded-full bg-gradient-to-tr from-[#ffd976] to-[#ffb84d] opacity-12 blur-3xl animate-float" />
            <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-[rgba(150,155,255,0.06)] blur-[120px] animate-float" style={{ animationDelay: "1s" }} />
            <div className="absolute inset-0 grid-bg opacity-14 mix-blend-overlay" />

            <div className="relative grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold)]">Ready when you are</p>
                <h2 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight md:text-6xl text-white">
                  Let’s light up <span className="text-gradient-gold text-glow-gold">your brand</span>.
                </h2>
                <p className="mt-5 max-w-lg text-white/75">
                  Concept, render, manufacture, install. Tell us about your space and
                  we’ll come back with a cinematic proposal in 48 hours.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:justify-end">
                <Link
                  to="/contact"
                  className="magnetic-btn inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ffd976] to-[#f0a500] px-7 py-4 text-sm font-semibold text-[var(--navy)] shadow-2xl transform-gpu transition-transform hover:scale-105"
                >
                  Request a Quote <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/portfolio"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-7 py-4 text-sm font-semibold text-white border border-white/20 hover:bg-white/15"
                >
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
