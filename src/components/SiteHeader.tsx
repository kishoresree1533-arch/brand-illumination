import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 md:px-6 py-3 transition-all duration-500 ${
            scrolled ? "glass-strong led-glow-blue" : "glass"
          }`}
        >
          <Logo />

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="relative px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  <span className="relative z-10">{item.label}</span>
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-full bg-white/5 ring-1 ring-[var(--gold)]/40"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="pointer-events-none absolute left-4 right-4 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] transition-transform duration-500 group-hover:scale-x-100" />
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <Link
              to="/contact"
              className="magnetic-btn group inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-[var(--navy)] led-glow-gold"
            >
              Get a Quote
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden grid h-10 w-10 place-items-center rounded-full glass"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="lg:hidden mt-2 glass-strong rounded-2xl p-3"
            >
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block rounded-xl px-4 py-3 text-white/85 hover:bg-white/5"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/contact"
                className="mt-2 block rounded-xl bg-[var(--gold)] px-4 py-3 text-center font-semibold text-[var(--navy)]"
              >
                Get a Quote
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
