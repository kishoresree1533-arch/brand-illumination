import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Reveal, RevealText } from "@/components/Reveal";
import aboutHeroImg from "@/assets/about_hero.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — RM Sign Factory" },
      { name: "description", content: "Two decades of signage craft. Meet the studio behind RM Sign Factory." },
    ],
  }),
  component: AboutPage,
});

const timeline = [
  { y: "2007", t: "The Workshop",   d: "Founded as a 3-person workshop crafting acrylic signage for local brands." },
  { y: "2012", t: "First Flagship", d: "Delivered our first high-rise illuminated facade in Tamil Nadu and Pondicherry." },
  { y: "2017", t: "LED Studio",     d: "Opened a dedicated LED lab and channel-letter manufacturing line." },
  { y: "2021", t: "Pan-India",      d: "Scaled installs across 40+ cities with in-house logistics." },
  { y: "2025", t: "Studio 2.0",     d: "Launched motion-driven signage and digital LED display vertical." },
];

function AboutPage() {
  return (
    <SiteShell>

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <section className="relative -mt-28 h-[72vh] min-h-[560px] lg:h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={aboutHeroImg}
            alt="RM Sign Factory Workshop"
            className="h-full w-full object-cover object-center"
          />
          {/* Left-heavy dark overlay so text is readable on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/30" />
        </div>

        {/* Text — bottom-left, matching reference */}
        <div className="relative z-10 flex h-full flex-col justify-end pb-10 md:pb-14 px-6 md:px-12 lg:px-20">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.38em] text-[var(--gold)] font-extrabold mb-3">
              About RM Sign Factory
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-[clamp(1.8rem,5.5vw,4rem)] font-bold text-white leading-[1.05] max-w-[640px]">
              Crafting Light Since 2007
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-3 max-w-[520px] text-sm text-white/65 leading-relaxed">
              An authentic look behind the studio, engineering labs, and master craftsmen composing presence for
              top global brands.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Intro Statement ─────────────────────────────────────────────── */}
      <section className="relative py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="max-w-3xl">
            <h2 className="font-display font-bold leading-[1.05] text-[#163458]"
                style={{ fontSize: "clamp(2rem,4.5vw,3.8rem)" }}>
              <RevealText text="We don't make signs." />
              <span className="block mt-1">
                <RevealText text="We compose" />
                {" "}
                <RevealText text="light." className="text-gradient-gold" />
              </span>
            </h2>
            <Reveal delay={0.3}>
              <p className="mt-7 max-w-2xl text-sm md:text-base leading-relaxed"
                 style={{ color: "#163458cc" }}>
                For nearly two decades, RM Sign Factory has been the quiet studio behind
                storefronts, towers and stages you've already seen. Every sign that leaves
                our workshop is engineered to outlast trends and outshine its surroundings.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ────────────────────────────────────────────── */}
      <section className="relative py-10 bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-12 grid gap-6 md:grid-cols-2">

          {/* Mission card */}
          <Reveal>
            <div className="rounded-2xl border border-[#163458]/10 bg-white p-8 h-full space-y-3 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] font-bold">Our Mission</p>
              <h3 className="text-xl font-bold text-[#163458]">Mission</h3>
              <p className="text-sm font-medium leading-relaxed" style={{ color: "#163458" }}>
                At RM Sign Factory, our mission is to craft impactful signage solutions that
                elevate brands and leave lasting impressions. We combine creativity, precision,
                and premium-quality materials to deliver sign boards that reflect
                professionalism, innovation, and trust. From modern storefront displays to
                large-scale commercial branding, we are committed to helping businesses stand
                out with visually powerful and durable signage solutions.
              </p>
            </div>
          </Reveal>

          {/* Vision card */}
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-[#163458]/10 bg-white p-8 h-full space-y-3 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] font-bold">Our Vision</p>
              <h3 className="text-xl font-bold text-[#163458]">Vision</h3>
              <p className="text-sm font-medium leading-relaxed" style={{ color: "#163458" }}>
                Our vision is to become a leading name in the signage industry by setting new
                standards in design excellence, quality craftsmanship, and customer
                satisfaction. We aspire to transform spaces and businesses through creative
                visual branding while continuously embracing modern technology, innovative
                concepts, and premium finishing to create sign boards that inspire attention
                and recognition.
              </p>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ── Timeline — dark navy section, horizontal layout ─────────────── */}
      <section className="relative py-20 mt-16" style={{ backgroundColor: "#163458" }}>
        <div className="mx-auto max-w-7xl px-6 md:px-12">

          {/* Header row */}
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--gold)] font-bold mb-3">
              Our Journey
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="flex items-baseline gap-6 mb-14">
              <h2 className="text-2xl md:text-4xl font-bold text-white">
                From workshop to{" "}
                <span className="text-gradient-gold">national studio.</span>
              </h2>
              <span className="hidden md:block text-4xl font-black text-white/20 ml-auto">
                18 YEARS
              </span>
            </div>
          </Reveal>

          {/* Horizontal timeline grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {timeline.map((e, i) => (
              <Reveal key={e.y} delay={i * 0.08}>
                <div className="relative">
                  {/* Connector line (hidden on last) */}
                  {i < timeline.length - 1 && (
                    <div className="hidden lg:block absolute top-4 left-full w-full h-px bg-gradient-to-r from-[var(--gold)]/30 to-transparent -translate-y-1/2 z-0" />
                  )}
                  <p className="font-display text-3xl font-bold text-gradient-gold leading-none relative z-10">
                    {e.y}
                  </p>
                  <h3 className="mt-3 text-sm font-semibold text-white">{e.t}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/50">{e.d}</p>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="relative py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] p-8 md:p-12 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#021026] via-[#072640] to-[#041025]" />
              <div className="absolute -top-16 -left-8 h-72 w-72 rounded-full bg-gradient-to-tr from-[#ffd976] to-[#ffb84d] opacity-12 blur-3xl animate-float" />
              <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-[rgba(150,155,255,0.06)] blur-[120px] animate-float" style={{ animationDelay: "1s" }} />
              <div className="absolute inset-0 grid-bg opacity-14 mix-blend-overlay" />

              <div className="relative grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold)]">Ready when you are</p>
                  <h2 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight md:text-6xl text-white">
                    Let's light up <span className="text-gradient-gold text-glow-gold">your brand</span>.
                  </h2>
                  <p className="mt-5 max-w-lg text-white/75">
                    Concept, render, manufacture, install. Tell us about your space and
                    we'll come back with a cinematic proposal in 48 hours.
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

    </SiteShell>
  );
}
