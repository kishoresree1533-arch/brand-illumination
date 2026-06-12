import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import rmLogo from "@/assets/rm logo png.png";

const COMPANY_LINKS = [
  { label: "About",     to: "/about" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Contact",   to: "/contact" },
];

const SERVICE_LINKS = [
  { label: "LED Sign Boards",  to: "/products" },
  { label: "Acrylic Signs",    to: "/products" },
  { label: "Neon Signs",       to: "/products" },
  { label: "3D Letter Signage",to: "/products" },
];

const SOCIALS = [
  { Icon: Instagram, label: "Instagram" },
  { Icon: Facebook,  label: "Facebook"  },
  { Icon: Linkedin,  label: "LinkedIn"  },
  { Icon: Youtube,   label: "YouTube"   },
];

export function SiteFooter() {
  return (
    <footer
      className="relative mt-24 border-t border-white/10"
      style={{ backgroundColor: "#163458" }}
    >
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">

        {/* ── Main grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto]">

          {/* Col 1 — Logo + description + contact */}
          <div className="space-y-5 max-w-xs">
            {/* Logo image */}
            <Link to="/" aria-label="RM Sign Factory home">
              <div className="inline-block rounded-xl bg-white p-2">
                <img
                  src={rmLogo}
                  alt="RM Sign Factory Logo"
                  className="h-24 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-white/75">
              RM Sign Factory crafts premium signage, LED branding and large-format
              outdoor displays that put your brand in the spotlight — literally.
            </p>

            <div className="space-y-2.5 text-sm">
              <a
                href="tel:+918807247435"
                className="flex items-center gap-3 text-white/80 hover:text-[var(--gold)] transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0 text-[var(--gold)]" />
                +91 88072 47435
              </a>
              <a
                href="tel:+916374863533"
                className="flex items-center gap-3 text-white/80 hover:text-[var(--gold)] transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0 text-[var(--gold)]" />
                +91 63748 63533
              </a>
              <a
                href="mailto:hello@rmsignfactory.com"
                className="flex items-center gap-3 text-white/80 hover:text-[var(--gold)] transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0 text-[var(--gold)]" />
                hello@rmsignfactory.com
              </a>
              <p className="flex items-center gap-3 text-white/80">
                <MapPin className="h-4 w-4 shrink-0 text-[var(--gold)]" />
                No: 14, Thanigai Valan st, Kailash Nagar, ECR Main Road, Puducherry - 605 008
              </p>
            </div>
          </div>

          {/* Col 2 — Company */}
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
              Company
            </h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Services */}
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
              Services
            </h4>
            <ul className="space-y-3">
              {SERVICE_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Social icons */}
          <div className="flex flex-row lg:flex-col gap-3">
            {SOCIALS.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-lg transition-all hover:opacity-80"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                <Icon className="h-4 w-4 text-white" />
              </a>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────── */}
        <div className="mt-14 border-t border-white/10 pt-6 flex flex-col items-center justify-between gap-3 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} RM Sign Factory. All rights reserved.</p>
          <p>Crafted with cinematic light · Manufactured in India</p>
        </div>
      </div>
    </footer>
  );
}
