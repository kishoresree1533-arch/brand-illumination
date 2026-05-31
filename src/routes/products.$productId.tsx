import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { ArrowLeft, Mail, Share2, ChevronRight, CheckCircle2 } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { PRODUCTS, type Product } from "@/lib/products-data";
import hero from "@/assets/hero-signage.jpg";

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
        <h1 className="text-3xl font-bold text-white">Product Not Found</h1>
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

function ProductDetailPage() {
  const { productId } = Route.useParams();

  // Derive product directly — no async, no state, no fetch needed
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

  // Reset image and scroll when navigating between products
  useEffect(() => {
    setActiveImage(null);
    setSubmitted(false);
    window.scrollTo(0, 0);
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
  const moq = product.trade?.["Minimum Order Quantity"] || "10 Units";

  const handleShare = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleCallbackClick = (msg: string) => { setDetails(msg); formRef.current?.scrollIntoView({ behavior: "smooth" }); setTimeout(() => detailTextareaRef.current?.focus(), 800); };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.trim().length < 10) { alert("Please enter a valid 10-digit mobile number."); return; }
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setMobile(""); setDetails(""); }, 4000);
  };

  return (
    <SiteShell>
      <div className="min-h-screen">

        {/* Breadcrumb */}
        <div className="border-b border-[#163458]/10 py-3 bg-foreground/[0.04]">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-wrap items-center gap-1.5 text-xs md:text-sm text-[#163458]/60 font-medium">
              <Link to="/" className="text-[#163458]/70 hover:text-[var(--gold)] transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/about" className="text-[#163458]/70 hover:text-[var(--gold)] transition-colors">Company Profile</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/products" className="text-[#163458]/70 hover:text-[var(--gold)] transition-colors">Our Products</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/products" search={{ cat: product.cat }} className="text-[#163458]/70 hover:text-[var(--gold)] transition-colors">{product.cat}</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#163458]/95 font-bold truncate max-w-[200px] md:max-w-none">{product.title}</span>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Left: image + buttons */}
            <div className="w-full lg:w-[40%] flex flex-col gap-4">
              <div className="border border-[#163458]/10 rounded-xl p-1 bg-slate-50 relative">
                <div className="aspect-[4/3] flex items-center justify-center bg-black/20 relative overflow-hidden rounded-lg">
                  <img src={currentImg} alt={product.title} className="w-full h-full object-contain" />
                  <button onClick={handleShare}
                    className="absolute top-2 right-2 p-2 rounded-full bg-black/60 border border-white/10 text-[var(--gold)] hover:bg-black/80 transition-colors"
                    aria-label="Share"
                  ><Share2 className="h-4 w-4" /></button>
                  {copied && <div className="absolute top-2 right-12 bg-black/80 text-white text-[10px] px-2 py-1 rounded">Copied!</div>}
                </div>
              </div>

              {/* Thumbnail */}
              <div className="flex gap-2">
                <button onClick={() => setActiveImage(product.img)}
                  className={`w-16 h-12 border rounded p-0.5 ${currentImg === product.img ? "border-[var(--gold)]" : "border-[#163458]/20"}`}
                >
                  <img src={product.img} alt="Thumbnail" className="w-full h-full object-cover rounded" />
                </button>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button onClick={() => handleCallbackClick(`Hello, I want to send an inquiry about ${product.title}.`)}
                  className="w-full bg-[var(--gold)] hover:brightness-110 text-[var(--navy)] font-bold py-2.5 px-2 rounded-xl flex items-center justify-center gap-2 transition-all text-sm led-glow-gold"
                >
                  <Mail className="h-4 w-4" /> Send Inquiry
                </button>
                <button onClick={() => handleCallbackClick(`Please call me back regarding ${product.title}.`)}
                  className="w-full bg-transparent hover:bg-[#163458]/5 text-[#163458] border border-[#163458]/30 font-bold py-2.5 px-2 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                >
                  <span className="hidden sm:inline">Request To Call Back</span>
                  <span className="sm:hidden">Call Back</span>
                </button>
              </div>
            </div>

            {/* Right: specs */}
            <div className="w-full lg:w-[60%] flex flex-col">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#163458] mb-4">{product.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="text-lg text-[#163458]/80">Price: <span className="text-[var(--gold)] font-bold">{product.price}</span></div>
                <button onClick={() => handleCallbackClick(`Please provide a custom quote for ${product.title}.`)}
                  className="border border-[var(--gold)]/50 text-[var(--gold)] text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[var(--gold)]/10 transition-colors"
                >Get a Price Quote</button>
              </div>

              <div className="text-[#163458]/70 font-medium mb-6">MOQ: <span className="font-bold text-[#163458]">{moq}</span></div>

              {/* Specs table */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <>
                  <div className="flex items-center gap-2 font-bold text-[#163458] border-b-2 border-[var(--gold)] pb-2 mb-4 w-max">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                    {product.title} Specification
                  </div>
                  <div className="border border-[#163458]/10 rounded-xl overflow-hidden mb-6">
                    <table className="w-full text-sm text-left">
                      <tbody>
                        {Object.entries(product.specs).map(([key, value], idx) => (
                          <tr key={idx} className="border-b border-[#163458]/10 last:border-0">
                            <td className="w-2/5 bg-[#163458]/[0.03] px-4 py-3 text-[#163458]/75 border-r border-[#163458]/10 font-medium">{key}</td>
                            <td className="w-3/5 px-4 py-3 text-[#163458]">{value as string}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Trade table */}
              {product.trade && Object.keys(product.trade).length > 0 && (
                <>
                  <div className="flex items-center gap-2 font-bold text-[#163458] border-b-2 border-[var(--gold)] pb-2 mb-4 w-max mt-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                    {product.title} Trade Information
                  </div>
                  <div className="border border-[#163458]/10 rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <tbody>
                        {Object.entries(product.trade).map(([key, value], idx) => (
                          <tr key={idx} className="border-b border-[#163458]/10 last:border-0">
                            <td className="w-2/5 bg-[#163458]/[0.03] px-4 py-3 text-[#163458]/75 border-r border-[#163458]/10 font-medium">{key}</td>
                            <td className="w-3/5 px-4 py-3 text-[#163458]">{value as string}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* About */}
          <div className="mt-14 border-t border-[#163458]/10 pt-12">
            <h2 className="text-xl font-bold text-[#163458] mb-6">About {product.title}</h2>
            <div className="space-y-4 text-sm text-[#163458]/75 leading-relaxed max-w-5xl text-justify">
              <p>{aboutContent.intro}</p>
              {aboutContent.sections.map((s, idx) => (
                <div key={idx} className="pt-2">
                  <h4 className="font-bold text-[#163458] mb-1">{s.heading}</h4>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-[#163458] mb-6">FAQs of {product.title}:</h2>
            <div className="space-y-6 max-w-5xl">
              {faqsContent.map((faq, idx) => (
                <div key={idx} className="text-sm">
                  <div className="font-bold text-[#163458]">Q: {faq.q}</div>
                  <div className="text-[#163458]/70 mt-1">A: {faq.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Large image */}
          <div className="mt-12 border border-[#163458]/10 rounded-2xl p-4 max-w-3xl flex justify-center bg-slate-50">
            <img src={product.img} alt={`${product.title} detailed view`} className="max-h-[400px] object-contain" />
          </div>

          {/* Lead form */}
          <div ref={formRef} className="mt-12 border border-[#163458]/10 rounded-2xl p-5 md:p-8 max-w-3xl bg-[#163458]/5">
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="h-12 w-12 text-[var(--gold)] mx-auto" />
                <h3 className="text-2xl font-bold text-[#163458]">Requirement Submitted</h3>
                <p className="text-[#163458]/70 text-sm">Our sales team will contact you at {mobile} shortly.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-[#163458] text-center">Tell us about your requirement</h3>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="text-[10px] text-[#163458]/60 font-semibold mb-1 block">Quantity</label>
                      <input type="number" min="1" required value={quantity} onChange={e => setQuantity(e.target.value)}
                        className="w-full border border-[#163458]/20 bg-white rounded-lg px-3 py-2 text-sm text-[#163458] focus:border-[var(--gold)] outline-none" />
                    </div>
                    <div className="w-1/2">
                      <label className="text-[10px] text-[#163458]/60 font-semibold mb-1 block">Unit</label>
                      <select value={unit} onChange={e => setUnit(e.target.value)}
                        className="w-full border border-[#163458]/20 bg-white rounded-lg px-3 py-2 text-sm text-[#163458] focus:border-[var(--gold)] outline-none"
                      >
                        <option value="Foot">Foot</option>
                        <option value="Piece">Piece</option>
                        <option value="Sq. Ft.">Sq. Ft.</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {["50","100","200","500"].map(v => (
                      <button type="button" key={v} onClick={() => setQuantity(v)}
                        className="border border-[#163458]/20 text-[#163458]/70 text-[10px] px-2 py-1 rounded hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
                      >{v}</button>
                    ))}
                  </div>
                  <textarea ref={detailTextareaRef} rows={3} value={details} onChange={e => setDetails(e.target.value)}
                    placeholder="Additional details..."
                    className="w-full border border-[#163458]/20 bg-white rounded-lg px-3 py-2 text-sm text-[#163458] focus:border-[var(--gold)] outline-none resize-none"
                  />
                  <div className="flex border border-[#163458]/20 rounded-lg overflow-hidden focus-within:border-[var(--gold)]">
                    <div className="bg-slate-50 border-r border-[#163458]/20 px-3 flex items-center">
                      <span className="text-xs font-semibold text-[#163458]/60">🇮🇳 +91</span>
                    </div>
                    <input type="tel" required pattern="[0-9]{10}" value={mobile} onChange={e => setMobile(e.target.value)}
                      placeholder="Mobile number" className="w-full px-3 py-2 text-sm bg-transparent text-[#163458] outline-none" />
                  </div>
                  <button type="submit"
                    className="w-full bg-[var(--gold)] hover:brightness-110 text-[var(--navy)] font-bold py-2.5 rounded-xl transition-all text-sm led-glow-gold"
                  >Submit Requirement</button>
                </form>
              </div>
            )}
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 border-t border-[#163458]/10 pt-8">
              <h2 className="text-lg font-bold text-[#163458] mb-6">More Products in {product.cat} Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedProducts.map(related => (
                  <div key={related.id} className="border border-[#163458]/10 rounded-2xl p-4 bg-white shadow-sm border border-[#163458]/10 hover:border-[var(--gold)]/40 transition-all flex flex-col h-full">
                    <div className="aspect-[4/3] bg-black/20 mb-4 flex items-center justify-center overflow-hidden rounded-xl">
                      <img src={related.img} alt={related.title} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-bold text-[#163458] text-sm leading-tight hover:text-[var(--gold)] transition-colors">
                          <Link to="/products/$productId" params={{ productId: related.id }}>{related.title}</Link>
                        </h3>
                        <div className="text-sm font-bold text-[var(--gold)] mt-2">Price: {related.price}</div>
                        <div className="text-xs text-[#163458]/60 mt-1">Minimum Order Quantity: {moq}</div>
                      </div>
                      <Link to="/products/$productId" params={{ productId: related.id }}
                        className="w-full border border-[var(--gold)]/40 text-[var(--gold)] hover:bg-[var(--gold)]/10 text-xs font-bold py-2 rounded-xl text-center transition-colors block"
                      >Get a Price/Quote</Link>
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
