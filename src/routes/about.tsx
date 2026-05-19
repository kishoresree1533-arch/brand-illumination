import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Reveal, RevealText } from "@/components/Reveal";
import { motion } from "framer-motion";
import factoryImg from "@/assets/factory.jpg";
import heroImg from "@/assets/hero-signage.jpg";

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
  { y: "2007", t: "The Workshop", d: "Founded as a 3-person workshop crafting acrylic signage for local brands." },
  { y: "2012", t: "First Flagship", d: "Delivered our first high-rise illuminated facade in Mumbai." },
  { y: "2017", t: "LED Studio", d: "Opened a dedicated LED lab and channel-letter manufacturing line." },
  { y: "2021", t: "Pan-India", d: "Scaled installs across 40+ cities with in-house logistics." },
  { y: "2025", t: "Studio 2.0", d: "Launched motion-driven signage and digital LED display vertical." },
];

const team = [
  { n: "Rajesh Mehra", r: "Founder & Master Craftsman" },
  { n: "Ayesha Khan", r: "Head of Design" },
  { n: "Vikrant Sahu", r: "Lead Engineer" },
  { n: "Maya Iyer", r: "Production Director" },
];

function AboutPage() {
  return (
    <SiteShell>
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold)]">About RM Sign Factory</p>
          </Reveal>
          <h1 className="mt-6 max-w-5xl font-display text-[clamp(2.4rem,6vw,5.5rem)] font-bold leading-[0.98]">
            <RevealText text="We don't make signs." />
            <span className="block">
              <RevealText text="We compose" />{" "}
              <RevealText text="light." className="text-gradient-gold text-glow-gold" />
            </span>
          </h1>
          <Reveal delay={0.3}>
            <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
              For nearly two decades, RM Sign Factory has been the quiet studio behind
              storefronts, towers and stages you've already seen. Every sign that leaves
              our workshop is engineered to outlast trends and outshine its surroundings.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative py-12">
        <div className="mx-auto max-w-7xl px-4 grid gap-8 md:grid-cols-2">
          {[
            { t: "Mission", d: "To craft signage that turns brands into landmarks — built with precision lighting and uncompromising materials." },
            { t: "Vision", d: "To be the most trusted premium signage manufacturer in Asia, where engineering and storytelling meet." },
          ].map((b, i) => (
            <Reveal key={b.t} delay={i * 0.1}>
              <div className="rounded-3xl glass-strong p-10 h-full">
                <div className="text-xs uppercase tracking-[0.32em] text-[var(--gold)]">Our {b.t}</div>
                <h3 className="mt-4 text-3xl font-semibold">{b.d.split(".")[0]}.</h3>
                <p className="mt-4 text-muted-foreground">{b.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative py-32">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold)]">Our journey</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold md:text-5xl">From a small workshop to a national studio.</h2>
          </Reveal>

          <div className="relative mt-16">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--gold)]/60 to-transparent md:left-1/2" />
            <div className="space-y-12">
              {timeline.map((e, i) => (
                <Reveal key={e.y}>
                  <div className={`relative grid gap-6 md:grid-cols-2 ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}>
                    <div className="md:pr-12 md:text-right pl-12 md:pl-0">
                      <div className="font-display text-5xl text-gradient-gold">{e.y}</div>
                      <h3 className="mt-2 text-2xl font-semibold">{e.t}</h3>
                      <p className="mt-2 text-muted-foreground">{e.d}</p>
                    </div>
                    <div className="hidden md:block" />
                    <div className="absolute left-4 top-3 h-3 w-3 -translate-x-1/2 rounded-full bg-[var(--gold)] led-glow-gold md:left-1/2" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-32">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
            <img src={factoryImg} alt="" loading="lazy" className="h-[520px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 grid grid-cols-2 gap-6 p-8 md:grid-cols-4 md:p-14">
              {[
                { v: "12K+", l: "Projects" },
                { v: "47", l: "Cities" },
                { v: "98%", l: "On-Time" },
                { v: "18yrs", l: "Of Craft" },
              ].map((s, i) => (
                <Reveal key={s.l} delay={i * 0.06}>
                  <div>
                    <div className="font-display text-4xl font-bold text-gradient-gold md:text-6xl">{s.v}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">{s.l}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-32">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold)]">The studio</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl">Craftspeople, engineers and storytellers.</h2>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <Reveal key={m.n} delay={i * 0.06}>
                <motion.div whileHover={{ y: -6 }} className="group relative overflow-hidden rounded-2xl border border-white/10">
                  <div className="aspect-[3/4] bg-gradient-to-br from-[var(--royal)]/40 to-[var(--navy)] grid place-items-center overflow-hidden">
                    <img src={heroImg} alt="" className="h-full w-full object-cover opacity-40 transition-transform duration-[1.4s] group-hover:scale-110" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-0 p-6">
                    <h3 className="text-lg font-semibold">{m.n}</h3>
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold)]">{m.r}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
