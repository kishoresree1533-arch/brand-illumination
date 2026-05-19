import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";

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
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold)]">Get in touch</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.98]">
              Tell us about your <span className="text-gradient-gold">brand light.</span>
            </h1>
          </Reveal>

          <div className="mt-16 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <Reveal>
              <form
                onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                className="relative rounded-3xl glass-strong p-8 md:p-12 led-glow-blue"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="Full name" type="text" id="name" />
                  <Field label="Email" type="email" id="email" />
                  <Field label="Phone" type="tel" id="phone" />
                  <Field label="Company" type="text" id="company" />
                </div>
                <div className="mt-6">
                  <label htmlFor="msg" className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Project brief
                  </label>
                  <textarea
                    id="msg"
                    rows={5}
                    className="peer mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-all focus:border-[var(--gold)]/60 focus:led-glow-gold"
                    placeholder="Type of signage, location, dimensions, timeline…"
                  />
                </div>

                <button
                  type="submit"
                  className="magnetic-btn mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-7 py-4 text-sm font-semibold text-[var(--navy)] led-glow-gold"
                >
                  {sent ? "Thank you — we’ll reply in 48h" : (<>Send Enquiry <Send className="h-4 w-4" /></>)}
                </button>
              </form>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-4">
                <ContactCard icon={Phone} label="Call" value="+91 00000 00000" href="tel:+910000000000" />
                <ContactCard icon={Mail} label="Email" value="hello@rmsignfactory.com" href="mailto:hello@rmsignfactory.com" />
                <ContactCard icon={MapPin} label="Studio" value="Manufacturing Unit, India" />
                <ContactCard icon={MessageCircle} label="WhatsApp" value="Chat with the studio" href="https://wa.me/910000000000" />

                <div className="rounded-3xl glass overflow-hidden">
                  <iframe
                    title="Map"
                    src="https://www.google.com/maps?q=Mumbai&output=embed"
                    className="h-72 w-full grayscale contrast-125"
                    loading="lazy"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <a
        href="https://wa.me/910000000000"
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-[var(--gold)] text-[var(--navy)] led-glow-gold animate-glow-pulse"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </SiteShell>
  );
}

function Field({ label, id, type }: { label: string; id: string; type: string }) {
  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-[0.28em] text-muted-foreground">{label}</label>
      <input
        id={id}
        type={type}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-all focus:border-[var(--gold)]/60 focus:led-glow-gold"
      />
    </div>
  );
}

function ContactCard({ icon: Icon, label, value, href }: { icon: typeof Phone; label: string; value: string; href?: string }) {
  const Wrap: any = href ? "a" : "div";
  return (
    <Wrap href={href} className="group flex items-center gap-4 rounded-2xl glass p-5 transition-all hover:led-glow-gold">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--royal)]/30 ring-1 ring-[var(--royal)]/40">
        <Icon className="h-5 w-5 text-[var(--gold)]" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </Wrap>
  );
}
