import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Logo } from "./Logo";

const cols = [
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Portfolio", to: "/portfolio" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "LED Sign Boards", to: "/products" },
      { label: "Acrylic Signs", to: "/products" },
      { label: "Neon Signs", to: "/products" },
      { label: "3D Letter Signage", to: "/products" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-white/10">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-[var(--royal)] opacity-30 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <Logo />
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              RM Sign Factory crafts premium signage, LED branding and large-format
              outdoor displays that put your brand in the spotlight — literally.
            </p>
            <div className="space-y-2 text-sm">
              <a href="tel:+910000000000" className="flex items-center gap-3 text-white/80 hover:text-[var(--gold)]">
                <Phone className="h-4 w-4 text-[var(--gold)]" /> +91 00000 00000
              </a>
              <a href="mailto:hello@rmsignfactory.com" className="flex items-center gap-3 text-white/80 hover:text-[var(--gold)]">
                <Mail className="h-4 w-4 text-[var(--gold)]" /> hello@rmsignfactory.com
              </a>
              <p className="flex items-center gap-3 text-white/80">
                <MapPin className="h-4 w-4 text-[var(--gold)]" /> Manufacturing Unit · India
              </p>
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title} className="lg:col-span-3">
              <h4 className="mb-5 text-xs uppercase tracking-[0.24em] text-[var(--gold)]">{c.title}</h4>
              <ul className="space-y-3 text-sm">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="group inline-flex items-center text-white/75 hover:text-white">
                      <span className="story-link">{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-1 flex lg:flex-col gap-3">
            {[Instagram, Facebook, Linkedin, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-10 w-10 place-items-center rounded-full glass transition-all hover:led-glow-gold"
                aria-label="social"
              >
                <Icon className="h-4 w-4 text-white/80" />
              </a>
            ))}
          </div>
        </div>

        <div className="relative mt-16 pt-6">
          <div className="absolute inset-x-0 top-0 h-px overflow-hidden">
            <div className="h-full w-[200%] bg-[linear-gradient(90deg,transparent,oklch(0.82_0.16_88/0.7),transparent)] animate-marquee" />
          </div>
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} RM Sign Factory. All rights reserved.</p>
            <p>Crafted with cinematic light · Manufactured in India</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
