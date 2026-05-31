import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ZoomIn, X, Send, Info, ShieldCheck, ChevronRight, Layers, Check } from "lucide-react";
import { type Cat, type Product, CATS, PRODUCTS } from "@/lib/products-data";
import threeD from "@/assets/product-3d.jpg";

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): { cat?: Cat } => ({
    cat: (search.cat as Cat) || "All",
  }),
  head: () => ({
    meta: [
      { title: "Our Products — RM Sign Factory" },
      { name: "description", content: "LED, acrylic, neon, 3D, ACP, digital displays, wayfinding and custom signage." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const search = Route.useSearch();
  const [cat, setCat] = useState<Cat>((search.cat as Cat) || "All");
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [mobile, setMobile] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { if (search.cat) setCat(search.cat as Cat); }, [search.cat]);

  const filtered = useMemo(
    () => cat === "All" ? PRODUCTS : PRODUCTS.filter(p => p.cat === cat),
    [cat]
  );

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.trim().length < 10) { alert("Please enter a valid 10-digit mobile number."); return; }
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setMobile(""); setDetails(""); setPreviewProduct(null); }, 4000);
  };

  return (
    <SiteShell>
      {/* Hero Banner */}
      <section className="relative -mt-28 h-[50vh] min-h-[400px] lg:h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img src={threeD} alt="RM Sign Factory Catalogue" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70" />
          <div className="absolute inset-0 grid-bg opacity-[0.06] mix-blend-overlay" />
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="border-y border-[#163458]/10 bg-foreground/[0.04] py-4 relative z-20">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs md:text-sm text-[#163458]/60 font-medium">
            <Link to="/" className="hover:text-[var(--gold)] transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/products" className="hover:text-[var(--gold)] transition-colors">Our Products</Link>
            {cat !== "All" && (<><ChevronRight className="h-3 w-3" /><span className="text-[var(--gold)] font-bold">{cat}</span></>)}
          </div>
          <span className="text-[10px] uppercase tracking-wider text-[#163458]/40 font-bold hidden sm:inline-block">Luxury Signage Fabrications</span>
        </div>
      </div>

      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-4">
          {/* Category filter bar */}
          <div className="relative bg-[#163458]/5 border border-[#163458]/10 p-2 rounded-2xl md:rounded-full max-w-5xl mx-auto overflow-x-auto scrollbar-none shadow-sm mb-12 flex items-center gap-1">
            {CATS.map((c) => {
              const active = cat === c;
              return (
                <button key={c} onClick={() => setCat(c)}
                  className={`relative rounded-full px-5 py-2.5 text-xs md:text-sm font-bold transition-all duration-300 flex-shrink-0 cursor-pointer ${active ? "text-[var(--navy)]" : "text-[#163458]/60 hover:text-[#163458]"}`}
                >
                  <span className="relative z-10">{c}</span>
                  {active && (
                    <motion.div layoutId="active-cat-pill"
                      className="absolute inset-0 rounded-full bg-[var(--gold)] shadow-md"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* CNC info banner */}
          {cat === "CNC & LASER CUTTING" && (
            <Reveal>
              <div className="mb-12 rounded-3xl border border-[#163458]/10 bg-[#163458]/5 p-5 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="h-5 w-5 text-[var(--gold)]" />
                  <h3 className="text-xl md:text-2xl font-bold text-[#163458] tracking-wide">Luxury B2B Laser & CNC Router Cutting Services</h3>
                </div>
                <p className="text-sm text-[#163458]/70 leading-relaxed">
                  Unleash the potential of our Laser Cutting Service, which is one of the prime services offered by our company. As a service provider, manufacturer, fabricator, and B2B producer, we take pride in our remarkable Acp Router Cutting, Acrylic Laser Cutting, and MDF CNC Laser Cutting operations. Our service offers a high level of accuracy (±0.05 mm), ensuring that every cut is clean and glassy-burn free. We offer prompt 2-3 working days delivery and customized CAD profiling, guaranteeing optimal results.
                </p>
              </div>
            </Reveal>
          )}

          {/* Product grid */}
          {filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <motion.div key={p.id}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.3, delay: (i % 6) * 0.04 }}
                    className="relative group bg-white border border-[#163458]/10 rounded-3xl overflow-hidden hover:border-[var(--gold)]/40 hover:shadow-xl transition-all duration-500 flex flex-col h-full"
                  >
                    {/* Image */}
                    <div className="aspect-[4/5] overflow-hidden relative bg-slate-50 flex items-center justify-center border-b border-[#163458]/10">
                      <Link to="/products/$productId" params={{ productId: p.id }} className="absolute inset-0 z-10" aria-label={`View ${p.title}`} />
                      <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      <button onClick={() => setPreviewProduct(p)}
                        className="absolute right-4 top-4 h-10 w-10 bg-black/70 text-white rounded-full border border-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer z-20"
                        aria-label="Quick Preview"
                      >
                        <ZoomIn className="h-4 w-4 text-[var(--gold)]" />
                      </button>
                    </div>
                    {/* Card body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-bold">{p.cat}</p>
                        <h3 className="text-lg md:text-xl font-bold text-[#163458] tracking-tight group-hover:text-[var(--gold)] transition-colors relative z-20">
                          <Link to="/products/$productId" params={{ productId: p.id }}>{p.title}</Link>
                        </h3>
                        <p className="line-clamp-2 text-xs md:text-sm text-[#163458]/70 leading-relaxed">{p.desc}</p>
                      </div>
                      <div className="border-t border-[#163458]/10 pt-4 space-y-4">
                        <div className="text-xs text-[#163458]/60">Price: <span className="text-[var(--gold)] font-bold text-sm">{p.price}</span></div>
                        <div className="grid grid-cols-2 gap-3">
                          <Link to="/products/$productId" params={{ productId: p.id }}
                            className="flex items-center justify-center border border-[var(--gold)]/40 hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-bold px-2 py-2.5 rounded-xl transition-all active:scale-95"
                          >View Details</Link>
                          <button onClick={() => setPreviewProduct(p)}
                            className="flex items-center justify-center bg-[var(--gold)] hover:brightness-110 text-[var(--navy)] text-xs font-black px-2 py-2.5 rounded-xl transition-all led-glow-gold active:scale-95 cursor-pointer"
                          >Enquire</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="max-w-3xl mx-auto border border-[#163458]/10 bg-[#163458]/5 rounded-3xl p-6 md:p-10 text-center space-y-6"
            >
              <div className="h-14 w-14 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-[var(--gold)] flex items-center justify-center mx-auto">
                <Info className="h-7 w-7" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#163458]">Custom {cat} Fabrication Supported</h3>
              <p className="text-sm text-[#163458]/70 max-w-lg mx-auto leading-relaxed">Submit your requirement details and our engineering team will fabricate the exact product model.</p>
              <div className="bg-[#163458]/5 border border-[#163458]/10 rounded-2xl p-5 md:p-6 text-left max-w-xl mx-auto space-y-4">
                {submitted ? (
                  <div className="text-center py-4 space-y-2 text-emerald-600">
                    <ShieldCheck className="h-8 w-8 mx-auto" />
                    <p className="text-sm font-bold">Requirement Submitted!</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <textarea required rows={3} value={details} onChange={e => setDetails(e.target.value)}
                      placeholder={`Describe your custom specifications for ${cat}...`}
                      className="w-full bg-white border border-[#163458]/20 focus:border-[var(--gold)] rounded-xl px-4 py-3 text-xs text-[#163458] resize-none outline-none"
                    />
                    <div className="flex gap-3">
                      <div className="flex-1 flex rounded-xl overflow-hidden border border-[#163458]/20 bg-white">
                        <span className="inline-flex items-center px-3 bg-slate-50 text-xs text-[#163458]/60 font-bold border-r border-[#163458]/20 select-none">🇮🇳 +91</span>
                        <input type="tel" required pattern="[0-9]{10}" value={mobile} onChange={e => setMobile(e.target.value)}
                          placeholder="10-digit mobile" className="w-full bg-transparent px-3 py-2 text-xs text-[#163458] outline-none" />
                      </div>
                      <button type="submit" className="bg-[var(--gold)] hover:opacity-90 text-[var(--navy)] text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer">
                        <Send className="h-3.5 w-3.5" /> Submit
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Quick-preview modal */}
      <AnimatePresence>
        {previewProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={() => setPreviewProduct(null)}
          >
            <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="w-full max-w-4xl rounded-3xl border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] grid grid-cols-1 md:grid-cols-2 relative"
              style={{ background: "linear-gradient(180deg, oklch(0.14 0.06 264 / 0.98), oklch(0.10 0.04 264 / 0.99))" }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setPreviewProduct(null)}
                className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-black/60 border border-white/10 text-white hover:bg-black/80 flex items-center justify-center cursor-pointer"
                aria-label="Close"
              ><X className="h-4 w-4" /></button>

              {/* Image */}
              <div className="h-48 sm:h-64 md:h-auto bg-black relative overflow-hidden flex items-center justify-center border-r border-white/5">
                <img src={previewProduct.img} alt={previewProduct.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-flex items-center rounded-full bg-[var(--gold)]/10 px-2.5 py-0.5 text-[10px] font-bold text-[var(--gold)] border border-[var(--gold)]/20">{previewProduct.cat}</span>
                  <h4 className="text-xl font-bold text-white mt-1.5 leading-tight">{previewProduct.title}</h4>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="bg-black/30 border border-white/5 rounded-2xl p-4">
                    <p className="text-[10px] uppercase font-bold text-white/40">B2B Base Pricing</p>
                    <p className="text-lg font-black text-[var(--gold)] mt-0.5">{previewProduct.price}</p>
                  </div>
                  <div>
                    <h5 className="text-xs uppercase tracking-wider font-bold text-white/40 mb-1">Description</h5>
                    <p className="text-xs md:text-sm text-white/70 leading-relaxed">{previewProduct.desc}</p>
                  </div>
                </div>

                {/* Inline enquiry form */}
                <div className="bg-black/30 border border-white/5 p-5 rounded-2xl space-y-4">
                  <h5 className="text-xs uppercase tracking-wider font-bold text-white/60 flex items-center gap-1.5">
                    <Send className="h-3.5 w-3.5 text-[var(--gold)]" /> Tell us about your requirement
                  </h5>
                  {submitted ? (
                    <div className="text-center py-4 space-y-2 text-emerald-400">
                      <Check className="h-6 w-6 stroke-[3] mx-auto" />
                      <p className="text-xs font-bold">Requirement Sent!</p>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-3">
                      <textarea required rows={2} value={details} onChange={e => setDetails(e.target.value)}
                        placeholder={`I am interested in ${previewProduct.title}...`}
                        className="w-full bg-white/5 border border-white/10 focus:border-[var(--gold)] rounded-xl px-3 py-2 text-xs text-white resize-none outline-none"
                      />
                      <div className="flex gap-2">
                        <div className="flex-1 flex rounded-xl overflow-hidden border border-white/10 bg-white/5">
                          <span className="inline-flex items-center px-3 bg-white/5 text-[10px] text-white/40 font-bold border-r border-white/10 select-none">+91</span>
                          <input type="tel" required pattern="[0-9]{10}" value={mobile} onChange={e => setMobile(e.target.value)}
                            placeholder="Mobile number" className="w-full bg-transparent px-3 py-2 text-xs text-white outline-none" />
                        </div>
                        <button type="submit" className="bg-[var(--gold)] hover:opacity-90 text-[var(--navy)] text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer">Submit</button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SiteShell>
  );
}
