import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone, Send, Clock, Globe } from "lucide-react";
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
      <section className="relative -mt-28 h-[50vh] min-h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={contactHeroImg}
            alt="Contact RM Sign Factory"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        </div>
        <div className="relative z-10 flex h-full flex-col items-start justify-center pt-16 md:pt-24 px-6 md:px-16 lg:px-24 max-w-4xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--gold)] font-bold">
              Reach Our Studio
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-3 font-display text-[clamp(1.8rem,5vw,4rem)] font-bold text-white leading-tight">
              Let's create something <span className="text-gradient-gold">extraordinary.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 max-w-xl text-sm md:text-base text-white/70 leading-relaxed">
              Have a signage brief? Get in touch with our studio masters, request estimates, or find our manufacturing facility.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Main Section ────────────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-7xl mx-auto bg-white">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          
          {/* Form Side */}
          <Reveal>
            <div className="rounded-3xl border border-gray-100 bg-white p-8 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <h2 className="font-space text-2xl font-bold text-gray-900 mb-2">Send an Enquiry</h2>
              <p className="text-sm text-gray-400 mb-8">Fill out the brief and our design team will reply in 48 hours.</p>
              
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-6">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  <Field label="Full Name" type="text" id="name" placeholder="Your full name" />
                  <Field label="Email" type="email" id="email" placeholder="you@company.com" />
                  <Field label="Phone" type="tel" id="phone" placeholder="+91 88072 47435" />
                  <Field label="Company" type="text" id="company" placeholder="Company name" />
                </div>
                
                <div>
                  <label htmlFor="msg" className="block text-[10px] font-black uppercase tracking-widest text-[#c9a84c] mb-2">
                    Project Brief & Details
                  </label>
                  <textarea
                    id="msg"
                    rows={5}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#c9a84c] focus:bg-white focus:ring-1 focus:ring-[#c9a84c]/20"
                    placeholder="Type of signage, location, dimensions, timeline, etc."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#a07830] px-8 py-4 text-sm font-bold text-white transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-[#c9a84c]/25"
                >
                  {sent ? "Message Sent Successfully!" : <><span className="tracking-wide text-[#0d1b2a]">Submit Brief</span><Send className="h-4 w-4 text-[#0d1b2a]" /></>}
                </button>
              </form>
            </div>
          </Reveal>

          {/* Map & Office Address */}
          <Reveal delay={0.15}>
            <div className="flex flex-col gap-6">
              {/* Google Map */}
              <div className="relative rounded-3xl border border-gray-100 overflow-hidden h-72 md:h-80 bg-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <iframe 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?q=No:%2014,%20Thanigai%20Valan%20st,%20Kailash%20Nagar,%20ECR%20Main%20Road,%20Puducherry%20-%20605008&t=&z=15&ie=UTF8&iwloc=&output=embed"
                />
              </div>

              {/* Studio Info Card */}
              <div className="rounded-3xl border border-gray-100 bg-white p-6 flex gap-4 items-start shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 shrink-0">
                  <MapPin className="h-5 w-5 text-[#c9a84c]" />
                </div>
                <div>
                  <h3 className="font-space text-sm font-bold text-[#c9a84c] uppercase tracking-widest">Our Manufacturing Facility</h3>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed font-medium">
                    No: 14, Thanigai Valan st, Kailash Nagar, ECR Main Road, Puducherry - 605 008
                  </p>
                  <div className="mt-4 flex gap-6 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[#c9a84c]/70" /> 9:00 AM – 7:30 PM</span>
                    <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-[#c9a84c]/70" /> Puducherry, India</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Direct Contact Grid ───────────────────────────────────────── */}
        <div className="mt-16 pt-16 border-t border-gray-100">
          <Reveal>
            <h2 className="font-space text-xl font-bold text-gray-900 mb-2 text-center">Direct Connections</h2>
            <p className="text-sm text-gray-400 text-center mb-10">Select a direct link to call, email, or WhatsApp our studio representatives.</p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal delay={0.05}>
              <ContactCard
                icon={Phone}
                label="Call Representative 1"
                value="+91 88072 47435"
                href="tel:+918807247435"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <ContactCard
                icon={Phone}
                label="Call Representative 2"
                value="+91 63748 63533"
                href="tel:+916374863533"
              />
            </Reveal>
            <Reveal delay={0.15}>
              <ContactCard
                icon={Mail}
                label="General Inquiry Email"
                value="hello@rmsignfactory.com"
                href="mailto:hello@rmsignfactory.com"
              />
            </Reveal>
            <Reveal delay={0.2}>
              <ContactCard
                icon={MessageCircle}
                label="WhatsApp Representative 1"
                value="Chat on WhatsApp"
                href="https://wa.me/918807247435"
              />
            </Reveal>
            <Reveal delay={0.25}>
              <ContactCard
                icon={MessageCircle}
                label="WhatsApp Representative 2"
                value="Chat on WhatsApp"
                href="https://wa.me/916374863533"
              />
            </Reveal>
            <Reveal delay={0.3}>
              <div className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gray-50 border border-gray-100 text-gray-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-gray-400">Studio Hours</div>
                  <div className="font-semibold text-gray-700">Mon – Sat: 9am – 7:30pm</div>
                </div>
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
      <label htmlFor={id} className="block text-[10px] font-black uppercase tracking-widest text-[#c9a84c] mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#c9a84c] focus:bg-white focus:ring-1 focus:ring-[#c9a84c]/20"
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
  icon: any;
  label: string;
  value: string;
  href?: string;
}) {
  const Wrap: any = href ? "a" : "div";
  return (
    <Wrap
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-[#c9a84c]/40 hover:bg-gray-50/20 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
    >
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 group-hover:bg-[#c9a84c]/20 group-hover:scale-105 transition-all duration-300">
        <Icon className="h-5 w-5 text-[#c9a84c]" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.28em] text-gray-400">{label}</div>
        <div className="font-semibold text-gray-800 group-hover:text-[#c9a84c] transition-colors">{value}</div>
      </div>
    </Wrap>
  );
}
