import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { ArrowLeft, Mail, Phone, Share2, ChevronRight, CheckCircle2, ImageOff } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { PRODUCTS, type Product } from "@/lib/products-data";

export const Route = createFileRoute("/products/$productId")({
  head: ({ params }) => {
    const product = PRODUCTS.find(p => p.id === params.productId);
    return {
      meta: [
        { title: product ? `${product.title} — RM Sign Factory` : "Product Details — RM Sign Factory" },
        { name: "description", content: product?.desc || "Premium signage specifications and B2B enquiry." },
      ],
    };
  },
  component: ProductDetailPage,
  notFoundComponent: () => (
    <SiteShell>
      <div className="text-center py-32 px-4 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-[#163458]">Product Not Found</h1>
        <Link to="/products" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-6 py-2.5 font-semibold text-[var(--navy)]">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
      </div>
    </SiteShell>
  ),
});

function getDynamicAbout(product: Product) {
  return {
    intro: `Experience unparalleled craftsmanship with our premium ${product.title}. Specifically engineered for ${product.cat} applications, this product delivers exceptional durability, exact precision, and striking visual presence for corporate and commercial spaces.`,
    sections: [
      {
        heading: `Premium ${product.title} - Perfect Fit for Multiple Applications`,
        text: `Our ${product.title} service provides robust performance tailored for high-end exterior and interior environments. ${product.desc} We ensure perfect execution matching the stringent requirements of modern architecture.`,
      },
      {
        heading: "Reliable Supply, Expert Packaging, and Flexible Transportation Options",
        text: `With an optimized B2B production capacity, we guarantee prompt project completions. Your units are expertly packaged for safe transportation across India. Delivery is available on standard terms, tailored to suit your procurement flow.`,
      },
    ],
  };
}

function getDynamicFaqs(product: Product) {
  return [
    { q: `How does the fabrication process for ${product.title} ensure precise results?`, a: `Our facility utilizes advanced precision machinery and premium grade materials, ensuring that every edge, angle, and illumination parameter is executed with surgical accuracy and flawless finish.` },
    { q: `What is the typical lead time for ${product.title} orders?`, a: `Depending on the volume and design complexity, standard lead times range from 3 to 7 working days, ensuring prompt and dependable delivery.` },
    { q: `What applications are best suited for this product?`, a: `This is highly ideal for corporate branding, structural facade displays, luxury interior design, and large-scale architectural projects.` },
  ];
}

// Safe image component — shows a proper fallback if the image fails
function ProductImage({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: React.CSSProperties }) {
  const [errored, setErrored] = useState(false);

  if (errored || !src) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, background: "#f1f5f9", color: "#94a3b8", height: "100%", width: "100%", ...style }} className={className}>
        <ImageOff style={{ width: 28, height: 28 }} />
        <span style={{ fontSize: 11 }}>Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ display: "block", ...style }}
      onError={() => setErrored(true)}
      loading="eager"
    />
  );
}

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const product = useMemo(() => PRODUCTS.find(p => p.id === productId) ?? null, [productId]);

  const [quantity, setQuantity] = useState("50");
  const [unit, setUnit] = useState("Foot");
  const [details, setDetails] = useState("");
  const [mobile, setMobile] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const detailTextareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveImage(null);
    setSubmitted(false);
  }, [productId]);

  if (!product) return (
    <SiteShell>
      <div className="text-center py-32 px-4 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-[#163458]">Product Not Found</h1>
        <Link to="/products" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-6 py-2.5 font-semibold text-[var(--navy)]">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
      </div>
    </SiteShell>
  );

  const aboutContent = product.about || getDynamicAbout(product);
  const faqsContent  = product.faqs  || getDynamicFaqs(product);
  const currentImg   = activeImage || product.img;
  const relatedProducts = PRODUCTS.filter(p => p.cat === product.cat && p.id !== product.id).slice(0, 2);
  const getMoq = (p: Product) => p.trade?.["Minimum Order Quantity"] || "10 Units";

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCallbackClick = (msg: string) => {
    setDetails(msg);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => detailTextareaRef.current?.focus(), 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.trim().length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setMobile(""); setDetails(""); }, 4000);
  };

  return (
    <SiteShell>
      <div className="min-h-screen bg-white">

        {/* ── Breadcrumb / Back bar ── */}
        <div style={{ borderBottom: "1px solid rgba(22,52,88,0.10)", backgroundColor: "rgba(22,52,88,0.02)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 13, color: "rgba(22,52,88,0.6)", fontWeight: 500 }}>
              {/* Back button */}
              <Link
                to="/products"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "4px 10px", borderRadius: 20,
                  border: "1px solid rgba(22,52,88,0.2)",
                  background: "white", color: "#163458",
                  fontSize: 12, fontWeight: 600, textDecoration: "none",
                  marginRight: 8, transition: "all 0.15s"
                }}
              >
                <ArrowLeft style={{ width: 12, height: 12 }} />
                Back
              </Link>
              <Link to="/" style={{ color: "rgba(22,52,88,0.7)" }}>Home</Link>
              <ChevronRight style={{ width: 12, height: 12 }} />
              <Link to="/products" style={{ color: "rgba(22,52,88,0.7)" }}>Our Products</Link>
              <ChevronRight style={{ width: 12, height: 12 }} />
              <Link to="/products" search={{ cat: product.cat }} style={{ color: "rgba(22,52,88,0.7)" }}>{product.cat}</Link>
              <ChevronRight style={{ width: 12, height: 12 }} />
              <span style={{ color: "#163458", fontWeight: 700 }}>{product.title}</span>
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 16px" }}>

          {/* Top section: image + specs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-start" }}>

            {/* Left: image */}
            <div style={{ flex: "0 0 auto", width: "min(100%, 420px)" }}>

              {/* Main image box */}
              <div style={{
                border: "1px solid rgba(22,52,88,0.12)",
                borderRadius: 16,
                padding: 8,
                background: "#f8f9fb",
                position: "relative"
              }}>
                {/* Image container — fixed height, white background */}
                <div style={{
                  width: "100%",
                  height: 300,
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative"
                }}>
                  <ProductImage
                    src={currentImg}
                    alt={product.title}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />

                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    style={{
                      position: "absolute", top: 8, right: 8,
                      padding: 8, borderRadius: "50%",
                      background: "rgba(22,52,88,0.8)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "var(--gold)", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}
                    aria-label="Share"
                  >
                    <Share2 style={{ width: 16, height: 16 }} />
                  </button>
                  {copied && (
                    <div style={{
                      position: "absolute", top: 8, right: 48,
                      background: "rgba(22,52,88,0.85)", color: "white",
                      fontSize: 11, padding: "4px 8px", borderRadius: 6
                    }}>
                      Copied!
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail */}
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button
                  onClick={() => setActiveImage(product.img)}
                  style={{
                    width: 60, height: 44, borderRadius: 6, overflow: "hidden",
                    border: `2px solid ${currentImg === product.img ? "var(--gold)" : "rgba(22,52,88,0.2)"}`,
                    padding: 2, cursor: "pointer", background: "white"
                  }}
                >
                  <img src={product.img} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              </div>

              {/* Action buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
                <button
                  onClick={() => handleCallbackClick(`Hello, I want to send an inquiry about ${product.title}.`)}
                  className="led-glow-gold"
                  style={{
                    background: "var(--gold)", color: "#163458",
                    border: "none", borderRadius: 12, padding: "10px 8px",
                    fontWeight: 700, fontSize: 13, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    transition: "filter 0.15s"
                  }}
                >
                  <Mail style={{ width: 15, height: 15 }} />
                  Send Inquiry
                </button>
                <button
                  onClick={() => handleCallbackClick(`Please call me back regarding ${product.title}.`)}
                  style={{
                    background: "transparent", color: "#163458",
                    border: "1px solid rgba(22,52,88,0.3)", borderRadius: 12, padding: "10px 8px",
                    fontWeight: 700, fontSize: 13, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    transition: "background 0.15s"
                  }}
                >
                  <Phone style={{ width: 15, height: 15 }} />
                  Call Back
                </button>
              </div>
            </div>

            {/* Right: specs */}
            <div style={{ flex: "1 1 320px", minWidth: 0 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#163458", margin: "0 0 16px 0", lineHeight: 1.2 }}>
                {product.title}
              </h1>

              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 16, color: "rgba(22,52,88,0.8)" }}>
                  Price: <strong style={{ color: "var(--gold)" }}>{product.price}</strong>
                </span>
                <button
                  onClick={() => handleCallbackClick(`Please provide a custom quote for ${product.title}.`)}
                  style={{
                    border: "1px solid rgba(var(--gold),0.5)", color: "var(--gold)",
                    fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 8,
                    background: "transparent", cursor: "pointer",
                    borderColor: "oklch(0.82 0.16 88 / 50%)"
                  }}
                >
                  Get a Price Quote
                </button>
              </div>

              <div style={{ fontSize: 14, color: "rgba(22,52,88,0.7)", marginBottom: 24 }}>
                MOQ: <strong style={{ color: "#163458" }}>{getMoq(product)}</strong>
              </div>

              {/* Specs table */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    fontWeight: 700, color: "#163458",
                    borderBottom: "2px solid var(--gold)",
                    paddingBottom: 8, marginBottom: 16,
                    width: "fit-content"
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)" }} />
                    {product.title} Specification
                  </div>
                  <div style={{ border: "1px solid rgba(22,52,88,0.12)", borderRadius: 12, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <tbody>
                        {Object.entries(product.specs).map(([key, value], idx) => (
                          <tr key={idx} style={{ borderBottom: idx < Object.keys(product.specs!).length - 1 ? "1px solid rgba(22,52,88,0.08)" : "none" }}>
                            <td style={{ width: "40%", background: "rgba(22,52,88,0.03)", padding: "10px 14px", color: "rgba(22,52,88,0.75)", borderRight: "1px solid rgba(22,52,88,0.08)", fontWeight: 500 }}>{key}</td>
                            <td style={{ padding: "10px 14px", color: "#163458" }}>{value as string}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Trade info table */}
              {product.trade && Object.keys(product.trade).length > 0 && (
                <div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    fontWeight: 700, color: "#163458",
                    borderBottom: "2px solid var(--gold)",
                    paddingBottom: 8, marginBottom: 16,
                    width: "fit-content"
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)" }} />
                    {product.title} Trade Information
                  </div>
                  <div style={{ border: "1px solid rgba(22,52,88,0.12)", borderRadius: 12, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <tbody>
                        {Object.entries(product.trade).map(([key, value], idx) => (
                          <tr key={idx} style={{ borderBottom: idx < Object.keys(product.trade!).length - 1 ? "1px solid rgba(22,52,88,0.08)" : "none" }}>
                            <td style={{ width: "40%", background: "rgba(22,52,88,0.03)", padding: "10px 14px", color: "rgba(22,52,88,0.75)", borderRight: "1px solid rgba(22,52,88,0.08)", fontWeight: 500 }}>{key}</td>
                            <td style={{ padding: "10px 14px", color: "#163458" }}>{value as string}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── About ── */}
          <div style={{ marginTop: 56, borderTop: "1px solid rgba(22,52,88,0.10)", paddingTop: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#163458", marginBottom: 20 }}>About {product.title}</h2>
            <div style={{ fontSize: 14, color: "rgba(22,52,88,0.75)", lineHeight: 1.8, maxWidth: 860, textAlign: "justify" }}>
              <p>{aboutContent.intro}</p>
              {aboutContent.sections.map((s, idx) => (
                <div key={idx} style={{ marginTop: 16 }}>
                  <h4 style={{ fontWeight: 700, color: "#163458", marginBottom: 6, fontSize: 14 }}>{s.heading}</h4>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── FAQs ── */}
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#163458", marginBottom: 20 }}>FAQs of {product.title}:</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 860 }}>
              {faqsContent.map((faq, idx) => (
                <div key={idx} style={{ fontSize: 13 }}>
                  <div style={{ fontWeight: 700, color: "#163458" }}>Q: {faq.q}</div>
                  <div style={{ color: "rgba(22,52,88,0.7)", marginTop: 4 }}>A: {faq.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Large product image ── */}
          <div style={{
            marginTop: 40,
            border: "1px solid rgba(22,52,88,0.10)",
            borderRadius: 20,
            padding: 16,
            maxWidth: 720,
            background: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200
          }}>
            <ProductImage
              src={product.img}
              alt={`${product.title} detailed view`}
              style={{ maxHeight: "384px", objectFit: "contain", width: "100%" }}
            />
          </div>

          {/* ── Lead form ── */}
          <div
            ref={formRef}
            style={{
              marginTop: 40,
              border: "1px solid rgba(22,52,88,0.10)",
              borderRadius: 20,
              padding: "32px 24px",
              maxWidth: 720,
              background: "rgba(22,52,88,0.025)"
            }}
          >
            {submitted ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <CheckCircle2 style={{ width: 48, height: 48, color: "var(--gold)", margin: "0 auto 16px" }} />
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "#163458", marginBottom: 8 }}>Requirement Submitted</h3>
                <p style={{ color: "rgba(22,52,88,0.7)", fontSize: 13 }}>Our sales team will contact you at {mobile} shortly.</p>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#163458", textAlign: "center", marginBottom: 24 }}>Tell us about your requirement</h3>
                <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 10, color: "rgba(22,52,88,0.6)", fontWeight: 600, display: "block", marginBottom: 4 }}>Quantity</label>
                      <input type="number" min="1" required value={quantity} onChange={e => setQuantity(e.target.value)}
                        style={{ width: "100%", border: "1px solid rgba(22,52,88,0.2)", background: "white", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#163458", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 10, color: "rgba(22,52,88,0.6)", fontWeight: 600, display: "block", marginBottom: 4 }}>Unit</label>
                      <select value={unit} onChange={e => setUnit(e.target.value)}
                        style={{ width: "100%", border: "1px solid rgba(22,52,88,0.2)", background: "white", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#163458", outline: "none", boxSizing: "border-box" }}>
                        <option value="Foot">Foot</option>
                        <option value="Piece">Piece</option>
                        <option value="Sq. Ft.">Sq. Ft.</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["50","100","200","500"].map(v => (
                      <button type="button" key={v} onClick={() => setQuantity(v)}
                        style={{ border: "1px solid rgba(22,52,88,0.2)", color: "rgba(22,52,88,0.7)", fontSize: 10, padding: "4px 8px", borderRadius: 6, background: "transparent", cursor: "pointer", transition: "all 0.15s" }}>
                        {v}
                      </button>
                    ))}
                  </div>
                  <textarea
                    ref={detailTextareaRef}
                    rows={3}
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                    placeholder="Additional details..."
                    style={{ width: "100%", border: "1px solid rgba(22,52,88,0.2)", background: "white", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#163458", outline: "none", resize: "none", boxSizing: "border-box" }}
                  />
                  <div style={{ display: "flex", border: "1px solid rgba(22,52,88,0.2)", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ background: "#f8f9fb", borderRight: "1px solid rgba(22,52,88,0.2)", padding: "0 12px", display: "flex", alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(22,52,88,0.6)" }}>🇮🇳 +91</span>
                    </div>
                    <input type="tel" required pattern="[0-9]{10}" value={mobile} onChange={e => setMobile(e.target.value)}
                      placeholder="Mobile number"
                      style={{ flex: 1, padding: "8px 12px", fontSize: 13, color: "#163458", outline: "none", border: "none", background: "transparent" }} />
                  </div>
                  <button
                    type="submit"
                    className="led-glow-gold"
                    style={{
                      width: "100%", background: "var(--gold)", color: "#163458",
                      border: "none", borderRadius: 12, padding: "11px 0",
                      fontWeight: 700, fontSize: 13, cursor: "pointer",
                      transition: "filter 0.15s"
                    }}
                  >
                    Submit Requirement
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* ── Related products ── */}
          {relatedProducts.length > 0 && (
            <div style={{ marginTop: 56, borderTop: "1px solid rgba(22,52,88,0.10)", paddingTop: 32 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#163458", marginBottom: 20 }}>More Products in {product.cat} Category</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20, maxWidth: 620 }}>
                {relatedProducts.map(related => (
                  <div key={related.id} style={{
                    border: "1px solid rgba(22,52,88,0.12)",
                    borderRadius: 16, padding: 16,
                    background: "white",
                    boxShadow: "0 2px 8px rgba(22,52,88,0.06)",
                    display: "flex", flexDirection: "column",
                    transition: "border-color 0.2s"
                  }}>
                    {/* Related product image — fixed height, white bg */}
                    <div style={{
                      width: "100%", height: 180,
                      borderRadius: 10, overflow: "hidden",
                      background: "white",
                      marginBottom: 12,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "1px solid rgba(22,52,88,0.06)"
                    }}>
                      <ProductImage
                        src={related.img}
                        alt={related.title}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10 }}>
                      <div>
                        <h3 style={{ fontWeight: 700, color: "#163458", fontSize: 13, lineHeight: 1.4, marginBottom: 6 }}>
                          <Link to="/products/$productId" params={{ productId: related.id }}>{related.title}</Link>
                        </h3>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--gold)" }}>Price: {related.price}</div>
                        <div style={{ fontSize: 11, color: "rgba(22,52,88,0.6)", marginTop: 2 }}>MOQ: {getMoq(related)}</div>
                      </div>
                      <Link
                        to="/products/$productId"
                        params={{ productId: related.id }}
                        style={{
                          display: "block", textAlign: "center",
                          border: "1px solid rgba(22,52,88,0.25)", color: "#163458",
                          fontSize: 11, fontWeight: 700, padding: "8px 0", borderRadius: 10,
                          textDecoration: "none", transition: "all 0.15s"
                        }}
                      >
                        Get a Price / Quote
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
