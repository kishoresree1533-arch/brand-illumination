import { Link, useLocation } from "@tanstack/react-router";
import { type Product } from "@/lib/products-data";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight, ChevronDown, Layers, Lightbulb, Building2, Printer } from "lucide-react";
import { Logo } from "./Logo";

// ── Mega-menu product columns ─────────────────────────────────────────────────
const PRODUCT_COLS = [
  {
    cat: "CNC & LASER CUTTING",
    icon: Layers,
    items: [
      { label: "ACP Router Cutting",            id: "acp-router-cutting" },
      { label: "MDF CNC Laser Cutting",          id: "mdf-cnc-cutting" },
      { label: "Acrylic Laser Cutting & E...",   id: "acrylic-laser-cutting" },
      { label: "CNC Aluminium Routing",          id: "cnc-aluminium-cutting" },
      { label: "Vacuum Foaming Signage",         id: "vacuum-foaming" },
    ],
  },
  {
    cat: "LED & ILLUMINATION",
    icon: Lightbulb,
    items: [
      { label: "LED Acrylic Glow Signage", id: "led-acrylic-signage" },
      { label: "LED Outdoor Glow Signs",   id: "led-outdoor-glow" },
      { label: "LED Pylon Sign",           id: "led-pylon-sign" },
      { label: "LED Acrylic Neon Sign",    id: "led-acrylic-neon" },
      { label: "Glass Neon Signage",       id: "neon-sign" },
      { label: "LED Digital Display",      id: "digital-display" },
    ],
  },
  {
    cat: "CORPORATE BRANDING",
    icon: Building2,
    items: [
      { label: "Brass Letter Signage",     id: "brass-letter-signage" },
      { label: "Mini SS 3D Letters",       id: "mini-ss-3d-letters" },
      { label: "Gold 3D Brushed Letters",  id: "gold-3d-brush-letters" },
      { label: "Epoxy Fiberglass Signage", id: "epoxy-fiberglass" },
      { label: "Premium Shop Signage",     id: "shop-signage" },
    ],
  },
  {
    cat: "PRINTING & SIGNBOARDS",
    icon: Printer,
    items: [
      { label: "Eco Solvent Printing",        id: "eco-solvent-printing" },
      { label: "Flex Banner Printing",        id: "flex-printing" },
      { label: "Outdoor Signboard",           id: "outdoor-signboard" },
      { label: "Traffic & Directional Signs", id: "traffic-u-sign" },
      { label: "Wayfinding Signage Sys...",   id: "wayfinding-signage" },
    ],
  },
] as const;

// Simple CSS-based active pill — no layoutId, no Framer layout animations
function NavLink({
  to,
  active,
  children,
  search,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
  search?: Record<string, string>;
}) {
  return (
    <Link
      to={to}
      search={search}
      className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full ${
        active ? "bg-[#f0f0f0] text-[#163458]" : "text-[#163458] hover:bg-[#f0f0f0]/60"
      }`}
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen]     = useState(false);
  const { pathname } = useLocation();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  // Fetch products from admin API to populate dropdown dynamically
  useEffect(() => {
    fetch("/admin/api/products.php")
      .then(res => res.json())
      .then((data: any) => {
        if (Array.isArray(data)) {
          setDbProducts(data.map(p => ({
            id: p.slug || String(p.id),
            title: p.title,
            cat: p.category,
          })));
        }
      })
      .catch(err => console.error("Error loading products for header:", err));
  }, []);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  const openMega  = () => { if (timerRef.current) clearTimeout(timerRef.current); setMegaOpen(true); };
  const closeMega = () => { timerRef.current = setTimeout(() => setMegaOpen(false), 150); };

  const isProductsActive = pathname.startsWith("/products");

  return (
    <header
      className={`fixed inset-x-0 top-0 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}
      style={{
        backgroundColor: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(16px)",
        /* Very high z-index to stay above any overlay */
        zIndex: 9999,
      }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* ── Full-width navbar ── */}
        <div className="flex items-center justify-between py-4 transition-all duration-300">
          {/* Logo */}
          <Logo />

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Home */}
            <NavLink to="/" active={pathname === "/"}>Home</NavLink>

            {/* About */}
            <NavLink to="/about" active={pathname.startsWith("/about")}>About</NavLink>

            {/* Our Products — mega dropdown */}
            <div className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
              <Link
                to="/products"
                className={`relative flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                  isProductsActive ? "bg-[#f0f0f0] text-[#163458]" : "text-[#163458] hover:bg-[#f0f0f0]/60"
                }`}
              >
                <span>Our Products</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} />
              </Link>

              {/* Mega menu */}
              {megaOpen && (
                <div
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                  className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[820px] transition-all duration-150 ease-out transform opacity-100 translate-y-0"
                  style={{ zIndex: 10000 }}
                >
                  <div className="rounded-2xl shadow-2xl border border-[#163458]/10 bg-white overflow-hidden">
                    <div className="grid grid-cols-4 gap-0 p-6">
                      {PRODUCT_COLS.map((col, ci) => {
                        // Combine static items with dynamic products from DB matching the category
                        const dynamicItems = dbProducts
                          .filter(p => p.cat === col.cat)
                          .map(p => ({ label: p.title, id: p.id } as const));
                        // Merge and deduplicate by id
                        const allItemsMap = new Map<string, { label: string; id: string }>();
                        col.items.forEach(item => allItemsMap.set(item.id, item));
                        dynamicItems.forEach(item => allItemsMap.set(item.id, item));
                        const allItems = Array.from(allItemsMap.values());
                        return (
                          <div key={col.cat} className={ci < 3 ? "border-r border-[#163458]/10 pr-5 mr-1" : ""}>
                            <Link to="/products" search={{ cat: col.cat }} className="flex items-center gap-2 mb-4 group" onClick={() => setMegaOpen(false)}>
                              <col.icon className="h-4 w-4 text-[var(--gold)] shrink-0" />
                              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#163458] group-hover:text-[var(--gold)] transition-colors leading-tight">
                                {col.cat}
                              </span>
                            </Link>
                            <ul className="space-y-2.5">
                              {allItems.map((item) => (
                                <li key={item.id}>
                                  <Link
                                    to="/products/$productId"
                                    params={{ productId: item.id }}
                                    className="text-[13px] text-[#163458]/70 hover:text-[#163458] hover:translate-x-1 duration-200 transition-all leading-snug block truncate"
                                    onClick={() => setMegaOpen(false)}
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t border-[#163458]/10 px-6 py-3 flex items-center justify-between bg-[#163458]/[0.02]">
                      <span className="text-[11px] text-[#163458]/40 uppercase tracking-widest">Luxury Signage Fabrications</span>
                      <Link to="/products" className="text-[11px] font-bold text-[#163458] hover:text-[var(--gold)] transition-colors uppercase tracking-wider" onClick={() => setMegaOpen(false)}>
                        View All Products →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Portfolio */}
            <NavLink to="/portfolio" active={pathname.startsWith("/portfolio")}>Portfolio</NavLink>

            {/* Contact */}
            <NavLink to="/contact" active={pathname.startsWith("/contact")}>Contact</NavLink>
          </nav>

          {/* CTA button */}
          <div className="hidden md:block">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-[#163458] hover:brightness-105 transition-all"
            >
              Get a Quote
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden grid h-10 w-10 place-items-center rounded-full border border-[#163458]/20 text-[#163458]"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div
            className="lg:hidden mt-0 p-3 max-h-[80vh] overflow-y-auto shadow-xl border-t border-[#163458]/10 transition-all duration-200"
            style={{ backgroundColor: "rgba(255,255,255,0.97)" }}
          >
            <Link to="/"          className="block rounded-xl px-4 py-3 text-sm font-medium text-[#163458] hover:bg-[#f0f0f0]" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/about"     className="block rounded-xl px-4 py-3 text-sm font-medium text-[#163458] hover:bg-[#f0f0f0]" onClick={() => setMobileOpen(false)}>About</Link>

            {/* Products accordion */}
            <div>
              <Link to="/products" className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#163458] hover:bg-[#f0f0f0]" onClick={() => setMobileOpen(false)}>
                Our Products
              </Link>
              <div className="ml-4 mt-1 space-y-1">
                {PRODUCT_COLS.map((col) => {
                  const dynamicItems = dbProducts
                    .filter(p => p.cat === col.cat)
                    .map(p => ({ label: p.title, id: p.id } as const));
                  const allItemsMap = new Map<string, { label: string; id: string }>();
                  col.items.forEach(item => allItemsMap.set(item.id, item));
                  dynamicItems.forEach(item => allItemsMap.set(item.id, item));
                  const allItems = Array.from(allItemsMap.values());
                  return (
                    <div key={col.cat}>
                      <p className="px-4 py-1 text-[10px] uppercase tracking-widest text-[var(--gold)] font-bold">{col.cat}</p>
                      {allItems.map((item) => (
                        <Link
                          key={item.id}
                          to="/products/$productId"
                          params={{ productId: item.id }}
                          className="block rounded-lg px-4 py-2 text-sm text-[#163458]/70 hover:text-[#163458] hover:bg-[#f0f0f0]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            <Link to="/portfolio" className="block rounded-xl px-4 py-3 text-sm font-medium text-[#163458] hover:bg-[#f0f0f0]" onClick={() => setMobileOpen(false)}>Portfolio</Link>
            <Link to="/contact"   className="block rounded-xl px-4 py-3 text-sm font-medium text-[#163458] hover:bg-[#f0f0f0]" onClick={() => setMobileOpen(false)}>Contact</Link>
            <Link
              to="/contact"
              className="mt-2 block rounded-xl bg-[var(--gold)] px-4 py-3 text-center text-sm font-semibold text-[#163458]"
              onClick={() => setMobileOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
