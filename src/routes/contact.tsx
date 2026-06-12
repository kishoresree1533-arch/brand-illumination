import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import contactHeroImg from "@/assets/contact_hero.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — RM Sign Factory" },
      { name: "description", content: "Get a cinematic signage proposal in 48 hours. Talk to the RM Sign Factory studio." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <SiteShell>

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <section className="relative -mt-28 h-[65vh] min-h-[500px] lg:h-[75vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={contactHeroImg}
            alt="Contact RM Sign Factory"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
          <div className="absolute inset-0 grid-bg opacity-[0.06] mix-blend-overlay" />
        </div>
        <div className="relative z-10 flex h-full flex-col items-start justify-center pt-16 md:pt-24 px-6 md:px-16 lg:px-24 max-w-4xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--gold)] font-bold">
              Get in Touch
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-3 font-display text-[clamp(1.8rem,5.5vw,4.5rem)] font-bold text-white leading-tight">
              Tell us about your <span className="text-gradient-gold">brand light.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 max-w-xl text-sm md:text-base text-white/70 leading-relaxed">
              From first draft to factory commissioning — talk to our studio masters to
              initiate your signage brief today.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Form + Contact Cards ─────────────────────────────────────────── */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">

            {/* Form */}
            <Reveal>
              <form
                onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                className="relative rounded-3xl glass-strong p-8 md:p-12 led-glow-gold"
              >
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  <Field label="Full Name"  type="text"  id="name"    placeholder="Your full name" />
                  <Field label="Email"      type="email" id="email"   placeholder="you@company.com" />
                  <Field label="Phone"      type="tel"   id="phone"   placeholder="+91 88072 47435" />
                  <Field label="Company"    type="text"  id="company" placeholder="Company name" />
                </div>
                <div className="mt-6">
                  <label htmlFor="msg" className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Project Brief
                  </label>
                  <textarea
                    id="msg"
                    rows={5}
                    className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-all focus:border-[var(--gold)]/60 placeholder:text-white/30 text-white"
                    placeholder="Type of signage, location, dimensions, timeline…"
                  />
                </div>

                <button
                  type="submit"
                  className="magnetic-btn mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-7 py-4 text-sm font-semibold text-[var(--navy)] led-glow-gold"
                >
                  {sent
                    ? "Thank you — we'll reply in 48h"
                    : (<>Send Enquiry <Send className="h-4 w-4" /></>)
                  }
                </button>
              </form>
            </Reveal>

            {/* Contact cards */}
            <Reveal delay={0.1}>
              <div className="space-y-4">
                <ContactCard
                  icon={Phone}
                  label="Call Representative 1"
                  value="+91 88072 47435"
                  href="tel:+918807247435"
                />
                <ContactCard
                  icon={Phone}
                  label="Call Representative 2"
                  value="+91 63748 63533"
                  href="tel:+916374863533"
                />
                <ContactCard
                  icon={Mail}
                  label="Email"
                  value="hello@rmsignfactory.com"
                  href="mailto:hello@rmsignfactory.com"
                />
                <ContactCard
                  icon={MapPin}
                  label="Studio"
                  value="No: 14, Thanigai Valan st, Kailash Nagar, ECR Main Road, Puducherry - 605 008"
                />
                <ContactCard
                  icon={MessageCircle}
                  label="WhatsApp Rep 1"
                  value="Chat with Representative 1"
                  href="https://wa.me/918807247435"
                />
                <ContactCard
                  icon={MessageCircle}
                  label="WhatsApp Rep 2"
                  value="Chat with Representative 2"
                  href="https://wa.me/916374863533"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

    </SiteShell>
  );
}

function Field({
  label,
  id,
  type,
  placeholder,
}: {
  label: string;
  id: string;
  type: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-all focus:border-[var(--gold)]/60 placeholder:text-white/30 text-white"
      />
    </div>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href?: string;
}) {
  const Wrap: any = href ? "a" : "div";
  return (
    <Wrap
      href={href}
      className="group flex items-center gap-4 rounded-2xl glass p-5 transition-all hover:led-glow-gold"
    >
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--gold)]/10 ring-1 ring-[var(--gold)]/30">
        <Icon className="h-5 w-5 text-[var(--gold)]" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</div>
        <div className="font-medium text-white">{value}</div>
      </div>
    </Wrap>
  );
}
