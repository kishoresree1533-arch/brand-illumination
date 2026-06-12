import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { useEffect, useMemo, useState } from "react";
import { ZoomIn, X, Send, Info, ShieldCheck, ChevronRight, Layers, Check, ImageOff } from "lucide-react";
import { type Cat, type Product, CATS, PRODUCTS } from "@/lib/products-data";
import { resolveImagePath } from "@/lib/resolveImagePath";

const HERO_IMG = "/products/product-3d.jpg";

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

// Safe image with fallback
function SafeImg({ src, alt, style, className }: { src: string; alt: string; style?: React.CSSProperties; className?: string }) {
  const [errored, setErrored] = useState(false);
  const resolvedSrc = resolveImagePath(src);
  if (errored || !resolvedSrc) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, background: "#f1f5f9", color: "#94a3b8", ...style }} className={className}>
        <ImageOff style={{ width: 28, height: 28 }} />
        <span style={{ fontSize: 11 }}>Image unavailable</span>
      </div>
    );
  }
  return <img src={resolvedSrc} alt={alt} style={style} className={className} onError={() => setErrored(true)} />;
}

function ProductsPage() {
  const search = Route.useSearch();
  const [cat, setCat] = useState<Cat>((search.cat as Cat) || "All");
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [mobile, setMobile] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(resolveImagePath("/admin/api/products.php"))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map((p: any) => ({
            id: p.slug || String(p.id),
            title: p.title,
            cat: p.category as any,
            img: p.image_path,
            desc: p.description || "",
            price: p.price || "Price on Request",
            specs: typeof p.specs === "string" ? JSON.parse(p.specs) : p.specs,
            trade: typeof p.trade === "string" ? JSON.parse(p.trade) : p.trade,
            about: typeof p.about_data === "string" ? JSON.parse(p.about_data) : (p.about_data || null),
            faqs: typeof p.faqs === "string" ? JSON.parse(p.faqs) : (p.faqs || []),
          }));
          setDbProducts(mapped);
        }
      })
      .catch(err => console.error("Error loading products:", err))
      .finally(() => setLoading(false));
  }, []);

  const combinedProducts = useMemo(() => {
    if (dbProducts.length === 0) return PRODUCTS;
    const dbSlugs = new Set(dbProducts.map(p => p.id));
    const uniqueStatic = PRODUCTS.filter(p => !dbSlugs.has(p.id));
    return [...dbProducts, ...uniqueStatic];
  }, [dbProducts]);

  useEffect(() => { if (search.cat) setCat(search.cat as Cat); }, [search.cat]);

  const filtered = useMemo(
    () => cat === "All" ? combinedProducts : combinedProducts.filter(p => p.cat === cat),
    [cat, combinedProducts]
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
      <section style={{ position: "relative", marginTop: -112, height: "50vh", minHeight: 380, width: "100%", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img src={HERO_IMG} alt="RM Sign Factory Catalogue" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.2), rgba(0,0,0,0.7))" }} />
        </div>
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "0 16px", textAlign: "center"
        }}>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 800, color: "white", marginBottom: 12, textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
            Our Products
          </h1>
          <p style={{ fontSize: "clamp(13px, 2vw, 17px)", color: "rgba(255,255,255,0.8)", maxWidth: 500 }}>
            Premium signage solutions engineered for corporate and commercial excellence
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div style={{ borderTop: "1px solid rgba(22,52,88,0.10)", borderBottom: "1px solid rgba(22,52,88,0.10)", background: "rgba(22,52,88,0.025)", padding: "14px 0", position: "relative", zIndex: 20 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(22,52,88,0.6)", fontWeight: 500, flexWrap: "wrap" }}>
            <Link to="/" style={{ color: "rgba(22,52,88,0.7)" }}>Home</Link>
            <ChevronRight style={{ width: 12, height: 12 }} />
            <Link to="/products" style={{ color: "rgba(22,52,88,0.7)" }}>Our Products</Link>
            {cat !== "All" && (
              <>
                <ChevronRight style={{ width: 12, height: 12 }} />
                <span style={{ color: "var(--gold)", fontWeight: 700 }}>{cat}</span>
              </>
            )}
          </div>
          <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(22,52,88,0.4)", fontWeight: 700 }}>
            Luxury Signage Fabrications
          </span>
        </div>
      </div>

      <section style={{ padding: "48px 0 64px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px" }}>

          {/* Category filter bar */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center",
            background: "rgba(22,52,88,0.05)", border: "1px solid rgba(22,52,88,0.10)",
            padding: 8, borderRadius: 50, maxWidth: 900, margin: "0 auto 40px",
            overflowX: "auto"
          }}>
            {CATS.map((c) => {
              const active = cat === c;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  style={{
                    position: "relative", borderRadius: 40,
                    padding: "8px 18px", fontSize: 13, fontWeight: 700,
                    border: "none", cursor: "pointer", flexShrink: 0,
                    background: active ? "var(--gold)" : "transparent",
                    color: active ? "#163458" : "rgba(22,52,88,0.6)",
                    boxShadow: active ? "0 2px 12px rgba(22,52,88,0.15)" : "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* CNC info banner */}
          {cat === "CNC & LASER CUTTING" && (
            <Reveal>
              <div style={{
                marginBottom: 40, borderRadius: 24,
                border: "1px solid rgba(22,52,88,0.10)",
                background: "rgba(22,52,88,0.04)", padding: "24px 32px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <Layers style={{ width: 20, height: 20, color: "var(--gold)" }} />
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#163458" }}>Luxury B2B Laser & CNC Router Cutting Services</h3>
                </div>
                <p style={{ fontSize: 13, color: "rgba(22,52,88,0.7)", lineHeight: 1.8 }}>
                  Unleash the potential of our Laser Cutting Service, which is one of the prime services offered by our company. As a service provider, manufacturer, fabricator, and B2B producer, we take pride in our remarkable Acp Router Cutting, Acrylic Laser Cutting, and MDF CNC Laser Cutting operations. Our service offers a high level of accuracy (±0.05 mm), ensuring that every cut is clean and glassy-burn free. We offer prompt 2-3 working days delivery and customized CAD profiling.
                </p>
              </div>
            </Reveal>
          )}

          {/* Product grid */}
          {filtered.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24, maxWidth: 1100, margin: "0 auto"
            }}>
              {filtered.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: "white",
                    border: "1px solid rgba(22,52,88,0.10)",
                    borderRadius: 24, overflow: "hidden",
                    display: "flex", flexDirection: "column",
                    boxShadow: "0 2px 12px rgba(22,52,88,0.06)",
                    transition: "box-shadow 0.3s, border-color 0.3s"
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(22,52,88,0.14)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(22,52,88,0.22)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(22,52,88,0.06)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(22,52,88,0.10)";
                  }}
                >
                  {/* Image area — fixed height, white background */}
                  <Link
                    to="/products/$productId"
                    params={{ productId: p.id }}
                    style={{ display: "block", textDecoration: "none" }}
                    aria-label={`View ${p.title}`}
                  >
                  <div style={{
                    width: "100%", height: 240,
                    position: "relative",
                    background: "white",
                    borderBottom: "1px solid rgba(22,52,88,0.07)",
                    overflow: "hidden",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <SafeImg
                      src={p.img}
                      alt={p.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent 50%)",
                      pointerEvents: "none"
                    }} />
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreviewProduct(p); }}
                      style={{
                        position: "absolute", top: 12, right: 12, zIndex: 20,
                        width: 36, height: 36, borderRadius: "50%",
                        background: "rgba(22,52,88,0.75)", border: "1px solid rgba(255,255,255,0.2)",
                        color: "white", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "transform 0.15s"
                      }}
                      aria-label="Quick Preview"
                    >
                      <ZoomIn style={{ width: 16, height: 16, color: "var(--gold)" }} />
                    </button>
                  </div>
                  </Link>

                  {/* Card body */}
                  <div style={{ padding: "20px 20px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                      <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--gold)", fontWeight: 700, marginBottom: 6 }}>{p.cat}</p>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#163458", lineHeight: 1.3, marginBottom: 6 }}>
                        <Link to="/products/$productId" params={{ productId: p.id }} style={{ color: "inherit", textDecoration: "none" }}>
                          {p.title}
                        </Link>
                      </h3>
                      <p style={{ fontSize: 12, color: "rgba(22,52,88,0.65)", lineHeight: 1.7, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {p.desc}
                      </p>
                    </div>
                    <div style={{ borderTop: "1px solid rgba(22,52,88,0.08)", paddingTop: 14, marginTop: "auto" }}>
                      <div style={{ fontSize: 12, color: "rgba(22,52,88,0.6)", marginBottom: 12 }}>
                        Price: <strong style={{ color: "var(--gold)", fontSize: 13 }}>{p.price}</strong>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <Link
                          to="/products/$productId"
                          params={{ productId: p.id }}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            border: "1px solid rgba(22,52,88,0.25)", color: "#163458",
                            fontSize: 12, fontWeight: 700, padding: "9px 8px", borderRadius: 12,
                            textDecoration: "none", transition: "all 0.15s"
                          }}
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => setPreviewProduct(p)}
                          style={{
                            background: "var(--gold)", color: "#163458",
                            border: "none", fontSize: 12, fontWeight: 800,
                            padding: "9px 8px", borderRadius: 12, cursor: "pointer",
                            transition: "filter 0.15s"
                          }}
                          className="led-glow-gold"
                        >
                          Enquire
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              maxWidth: 640, margin: "0 auto",
              border: "1px solid rgba(22,52,88,0.10)",
              background: "rgba(22,52,88,0.04)",
              borderRadius: 24, padding: "40px 32px", textAlign: "center"
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(22,52,88,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px"
              }}>
                <Info style={{ width: 28, height: 28, color: "var(--gold)" }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#163458", marginBottom: 10 }}>Custom {cat} Fabrication Supported</h3>
              <p style={{ fontSize: 13, color: "rgba(22,52,88,0.7)", lineHeight: 1.8, marginBottom: 20 }}>
                Submit your requirement details and our engineering team will fabricate the exact product model.
              </p>
              <div style={{ background: "rgba(22,52,88,0.04)", border: "1px solid rgba(22,52,88,0.08)", borderRadius: 16, padding: "20px 24px" }}>
                {submitted ? (
                  <div style={{ textAlign: "center", padding: "16px 0", color: "#16a34a" }}>
                    <ShieldCheck style={{ width: 32, height: 32, margin: "0 auto 8px" }} />
                    <p style={{ fontSize: 13, fontWeight: 700 }}>Requirement Submitted!</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <textarea required rows={3} value={details} onChange={e => setDetails(e.target.value)}
                      placeholder={`Describe your custom specifications for ${cat}...`}
                      style={{ width: "100%", background: "white", border: "1px solid rgba(22,52,88,0.2)", borderRadius: 12, padding: "10px 14px", fontSize: 12, color: "#163458", resize: "none", outline: "none", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: 10 }}>
                      <div style={{ flex: 1, display: "flex", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(22,52,88,0.2)", background: "white" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", padding: "0 12px", background: "#f8f9fb", fontSize: 12, color: "rgba(22,52,88,0.6)", fontWeight: 700, borderRight: "1px solid rgba(22,52,88,0.15)" }}>🇮🇳 +91</span>
                        <input type="tel" required pattern="[0-9]{10}" maxLength={10} value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                          placeholder="10-digit mobile number"
                          title="Please enter a 10-digit mobile number"
                          style={{ flex: 1, background: "transparent", padding: "8px 12px", fontSize: 12, color: "#163458", outline: "none", border: "none" }} />
                      </div>
                      <button type="submit" style={{ background: "var(--gold)", color: "#163458", border: "none", fontSize: 12, fontWeight: 700, padding: "10px 16px", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                        <Send style={{ width: 14, height: 14 }} /> Submit
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick-preview modal — no framer-motion */}
      {previewProduct && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16, background: "rgba(0,0,0,0.80)",
            backdropFilter: "blur(16px)"
          }}
          onClick={() => setPreviewProduct(null)}
        >
          <div
            style={{
              width: "100%", maxWidth: 860, borderRadius: 24,
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
              overflow: "hidden", maxHeight: "90vh", overflowY: "auto",
              display: "grid", gridTemplateColumns: "1fr 1fr",
              background: "linear-gradient(180deg, #1a2a3a 0%, #111820 100%)",
              position: "relative"
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewProduct(null)}
              style={{
                position: "absolute", top: 14, right: 14, zIndex: 10,
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.15)",
                color: "white", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
              aria-label="Close"
            >
              <X style={{ width: 16, height: 16 }} />
            </button>

            {/* Modal image */}
            <div style={{
              height: 360, background: "#0a0f1a",
              position: "relative", overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRight: "1px solid rgba(255,255,255,0.05)"
            }}>
              <SafeImg
                src={previewProduct.img}
                alt={previewProduct.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
                <span style={{
                  display: "inline-block", borderRadius: 20,
                  background: "rgba(var(--gold),0.1)", padding: "3px 10px",
                  fontSize: 10, fontWeight: 700, color: "var(--gold)",
                  border: "1px solid rgba(22,52,88,0.3)", marginBottom: 6
                }}>{previewProduct.cat}</span>
                <h4 style={{ fontSize: 20, fontWeight: 700, color: "white", lineHeight: 1.3 }}>{previewProduct.title}</h4>
              </div>
            </div>

            {/* Modal details */}
            <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 20 }}>
              <div>
                <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
                  <p style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>B2B Base Pricing</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "var(--gold)" }}>{previewProduct.price}</p>
                </div>
                <h5 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Description</h5>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.75 }}>{previewProduct.desc}</p>
              </div>

              {/* Enquiry form */}
              <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "20px 16px" }}>
                <h5 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                  <Send style={{ width: 12, height: 12, color: "var(--gold)" }} /> Tell us your requirement
                </h5>
                {submitted ? (
                  <div style={{ textAlign: "center", padding: "14px 0", color: "#4ade80" }}>
                    <Check style={{ width: 24, height: 24, margin: "0 auto 8px" }} />
                    <p style={{ fontSize: 12, fontWeight: 700 }}>Requirement Sent!</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <textarea required rows={2} value={details} onChange={e => setDetails(e.target.value)}
                      placeholder={`I am interested in ${previewProduct.title}...`}
                      style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "white", resize: "none", outline: "none", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ flex: 1, display: "flex", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.05)" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", padding: "0 10px", fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,0.10)" }}>+91</span>
                        <input type="tel" required pattern="[0-9]{10}" maxLength={10} value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                          placeholder="10-digit mobile number"
                          title="Please enter a 10-digit mobile number"
                          style={{ flex: 1, background: "transparent", padding: "8px 10px", fontSize: 12, color: "white", outline: "none", border: "none" }} />
                      </div>
                      <button type="submit" style={{ background: "var(--gold)", color: "#163458", border: "none", fontSize: 12, fontWeight: 700, padding: "8px 14px", borderRadius: 10, cursor: "pointer" }}>
                        Submit
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </SiteShell>
  );
}
