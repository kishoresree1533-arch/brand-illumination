import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "../../components/AdminLayout";
import { useEffect, useState, useRef } from "react";
import { apiFetch } from "../../lib/apiFetch";
import { resolveImagePath } from "../../lib/resolveImagePath";

export const Route = createFileRoute("/admin/products")({
  component: ProductsPage,
});

const CATEGORIES = [
  "CNC & LASER CUTTING",
  "LED & ILLUMINATION",
  "CORPORATE BRANDING",
  "PRINTING & SIGNBOARDS",
];

type FaqRow = { q: string; a: string };

type Product = {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  price: string;
  image_path: string;
  is_active: number;
  created_at: string;
};

const EMPTY_FORM = {
  title: "",
  slug: "",
  category: "",
  description: "",
  price: "",
  // Specs
  spec_material: "",
  spec_cutting_accuracy: "",
  spec_thickness: "",
  spec_finish: "",
  spec_extra_key: "",
  spec_extra_val: "",
  // Trade
  moq: "",
  delivery_time: "",
  // About
  about_intro: "",
  // FAQs handled separately
};

function inputCls(extra = "") {
  return `w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-[13px] placeholder-gray-400 focus:outline-none focus:border-[#c9a84c]/60 focus:ring-1 focus:ring-[#c9a84c]/30 transition-all ${extra}`;
}

function labelCls() {
  return "block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5";
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <div className="h-px flex-1 bg-gray-100" />
      <span className="text-[10px] font-black uppercase tracking-widest text-[#c9a84c]">{children}</span>
      <div className="h-px flex-1 bg-gray-100" />
    </div>
  );
}

function ProductsPage() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [faqs, setFaqs] = useState<FaqRow[]>([{ q: "", a: "" }]);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    apiFetch("/admin/api/products.php")
      .then((res) => res.json())
      .then((resData) => {
        if (!resData.error) setData(resData);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title"
        ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }
        : {}),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const updateFaq = (idx: number, field: "q" | "a", value: string) => {
    setFaqs((prev) => prev.map((f, i) => i === idx ? { ...f, [field]: value } : f));
  };
  const addFaq = () => setFaqs((prev) => [...prev, { q: "", a: "" }]);
  const removeFaq = (idx: number) => setFaqs((prev) => prev.filter((_, i) => i !== idx));

  const openModal = () => {
    setForm({ ...EMPTY_FORM });
    setFaqs([{ q: "", a: "" }]);
    setPreview(null);
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.category) {
      setError("Title and Category are required.");
      return;
    }
    setSubmitting(true);

    // Build specs JSON
    const specs: Record<string, string> = {};
    if (form.spec_material)         specs["Material"]            = form.spec_material;
    if (form.spec_cutting_accuracy) specs["Cutting Accuracy"]    = form.spec_cutting_accuracy;
    if (form.spec_thickness)        specs["Thickness Supported"] = form.spec_thickness;
    if (form.spec_finish)           specs["Finish"]              = form.spec_finish;
    if (form.spec_extra_key && form.spec_extra_val)
      specs[form.spec_extra_key] = form.spec_extra_val;

    // Build trade JSON
    const trade: Record<string, string> = {};
    if (form.moq)           trade["Minimum Order Quantity"] = form.moq;
    if (form.delivery_time) trade["Delivery Time"]          = form.delivery_time;

    // Build about JSON
    const about = form.about_intro
      ? { intro: form.about_intro, sections: [] as { heading: string; text: string }[] }
      : null;

    // Build faqs JSON — filter empty rows
    const faqsClean = faqs.filter((f) => f.q.trim() && f.a.trim());

    const fd = new FormData();
    fd.append("title",       form.title);
    fd.append("slug",        form.slug);
    fd.append("category",    form.category);
    fd.append("description", form.description);
    fd.append("price",       form.price);
    fd.append("specs",       JSON.stringify(specs));
    fd.append("trade",       JSON.stringify(trade));
    fd.append("about",       JSON.stringify(about));
    fd.append("faqs",        JSON.stringify(faqsClean));
    if (fileRef.current?.files?.[0]) fd.append("image", fileRef.current.files[0]);

    try {
      const res = await apiFetch("/admin/api/products.php", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok && json.success) {
        setSuccess("Product added successfully!");
        setShowModal(false);
        if (fileRef.current) fileRef.current.value = "";
        fetchProducts();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(json.error || `Server error: ${res.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: number, title: string) => {
    setDeleteTarget({ id, title });
  };

  return (
    <AdminLayout title="Products Management">
      {success && (
        <div className="fixed top-6 right-6 z-50 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold px-5 py-3 rounded-xl shadow-lg">
          ✓ {success}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl p-4 max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-space font-bold text-gray-900 text-lg">All Products</h2>
          <button
            onClick={openModal}
            className="bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0d1b2a] text-[13px] font-bold px-4 py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            + Add Product
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-[#c9a84c] rounded-full animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4 opacity-30">◈</div>
            <p className="text-gray-900/40 text-sm">No products found. Add your first product!</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-10" />
              <col className="w-40" />
              <col className="w-36" />
              <col className="w-20" />
              <col className="w-20" />
            </colgroup>
            <thead>
              <tr>
                <th className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-200">Img</th>
                <th className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-200">Title</th>
                <th className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-200">Category</th>
                <th className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-200">Price</th>
                <th className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 border-b border-gray-100 pr-2">
                    {p.image_path ? (
                      <img src={resolveImagePath(p.image_path)} alt={p.title} className="w-9 h-9 rounded-md object-cover bg-gray-100" />
                    ) : (
                      <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center text-sm text-gray-300">◈</div>
                    )}
                  </td>
                  <td className="py-2.5 border-b border-gray-100 pr-3">
                    <div className="font-medium text-[13px] text-gray-900 truncate">{p.title}</div>
                    <div className="text-[10px] text-gray-400 truncate">/{p.slug}</div>
                  </td>
                  <td className="py-2.5 border-b border-gray-100 pr-3">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 truncate max-w-full">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-2.5 border-b border-gray-100 text-[12px] text-gray-600 truncate">{p.price || "—"}</td>
                  <td className="py-2.5 border-b border-gray-100 text-right">
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      className="text-red-500 hover:text-red-700 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Add Product Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="font-space font-bold text-gray-900 text-base">Add New Product</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded-lg transition-all cursor-pointer text-xl"
              >×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* ── BASIC INFO ── */}
              <SectionHeading>Basic Info</SectionHeading>

              {/* Image */}
              <div>
                <label className={labelCls()}>Product Image</label>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#c9a84c] transition-colors"
                  onClick={() => fileRef.current?.click()}
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="max-h-36 rounded-lg object-cover" />
                  ) : (
                    <>
                      <div className="text-3xl text-gray-300">↑</div>
                      <p className="text-[13px] text-gray-400">Click to upload image</p>
                      <p className="text-[11px] text-gray-300">PNG, JPG, WEBP up to 5MB</p>
                    </>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>
              </div>

              {/* Title + Slug */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls()}>Product Title <span className="text-red-400">*</span></label>
                  <input name="title" value={form.title} onChange={handleInput} placeholder="e.g. LED Glow Sign Board" className={inputCls()} />
                </div>
                <div>
                  <label className={labelCls()}>URL Slug</label>
                  <input name="slug" value={form.slug} onChange={handleInput} placeholder="auto-generated" className={inputCls("font-mono text-[12px]")} />
                </div>
              </div>

              {/* Category + Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls()}>Category <span className="text-red-400">*</span></label>
                  <select name="category" value={form.category} onChange={handleInput} className={inputCls("cursor-pointer")}>
                    <option value="">Select a category…</option>
                    {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls()}>Price</label>
                  <input name="price" value={form.price} onChange={handleInput} placeholder="e.g. Price on Request" className={inputCls()} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelCls()}>Description</label>
                <textarea name="description" value={form.description} onChange={handleInput} rows={3} placeholder="Short product description…" className={inputCls("resize-none")} />
              </div>

              {/* ── SPECIFICATIONS ── */}
              <SectionHeading>Specifications</SectionHeading>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls()}>Material</label>
                  <input name="spec_material" value={form.spec_material} onChange={handleInput} placeholder="e.g. Aluminium Sheets" className={inputCls()} />
                </div>
                <div>
                  <label className={labelCls()}>Cutting Accuracy</label>
                  <input name="spec_cutting_accuracy" value={form.spec_cutting_accuracy} onChange={handleInput} placeholder="e.g. ±0.1 mm" className={inputCls()} />
                </div>
                <div>
                  <label className={labelCls()}>Thickness Supported</label>
                  <input name="spec_thickness" value={form.spec_thickness} onChange={handleInput} placeholder="e.g. 3mm – 25mm" className={inputCls()} />
                </div>
                <div>
                  <label className={labelCls()}>Finish</label>
                  <input name="spec_finish" value={form.spec_finish} onChange={handleInput} placeholder="e.g. Matte / Gloss / Mirror" className={inputCls()} />
                </div>
              </div>

              {/* Extra spec row */}
              <div>
                <label className={labelCls()}>Extra Spec (optional)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input name="spec_extra_key" value={form.spec_extra_key} onChange={handleInput} placeholder="Label (e.g. IP Rating)" className={inputCls()} />
                  <input name="spec_extra_val" value={form.spec_extra_val} onChange={handleInput} placeholder="Value (e.g. IP65)" className={inputCls()} />
                </div>
              </div>

              {/* ── TRADE INFO ── */}
              <SectionHeading>Trade Information</SectionHeading>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls()}>Minimum Order Quantity (MOQ)</label>
                  <input name="moq" value={form.moq} onChange={handleInput} placeholder="e.g. 1 Sheet" className={inputCls()} />
                </div>
                <div>
                  <label className={labelCls()}>Delivery Time</label>
                  <input name="delivery_time" value={form.delivery_time} onChange={handleInput} placeholder="e.g. 3–5 Working Days" className={inputCls()} />
                </div>
              </div>

              {/* ── ABOUT ── */}
              <SectionHeading>About / Introduction</SectionHeading>

              <div>
                <label className={labelCls()}>About Intro Paragraph</label>
                <textarea
                  name="about_intro"
                  value={form.about_intro}
                  onChange={handleInput}
                  rows={4}
                  placeholder="Write a detailed introduction about this product that appears on the product detail page…"
                  className={inputCls("resize-none")}
                />
              </div>

              {/* ── FAQs ── */}
              <SectionHeading>FAQs</SectionHeading>

              <div className="flex flex-col gap-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-2 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">FAQ {idx + 1}</span>
                      {faqs.length > 1 && (
                        <button type="button" onClick={() => removeFaq(idx)} className="text-red-400 hover:text-red-600 text-[11px] font-semibold cursor-pointer">Remove</button>
                      )}
                    </div>
                    <input
                      value={faq.q}
                      onChange={(e) => updateFaq(idx, "q", e.target.value)}
                      placeholder="Question…"
                      className={inputCls()}
                    />
                    <textarea
                      value={faq.a}
                      onChange={(e) => updateFaq(idx, "a", e.target.value)}
                      rows={2}
                      placeholder="Answer…"
                      className={inputCls("resize-none")}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFaq}
                  className="self-start text-[12px] font-semibold text-[#c9a84c] hover:text-[#a07830] transition-colors cursor-pointer"
                >
                  + Add another FAQ
                </button>
              </div>

              {/* Footer */}
              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-white border border-gray-200 text-gray-600 text-[13px] font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0d1b2a] text-[13px] font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><div className="w-4 h-4 border-2 border-[#0d1b2a]/30 border-t-[#0d1b2a] rounded-full animate-spin" />Saving…</>
                  ) : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white border border-gray-200 rounded-2xl w-full max-w-sm shadow-2xl p-6 flex flex-col gap-4 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-red-500 text-3xl font-light">⚠️</div>
            <div>
              <h3 className="font-space font-bold text-gray-900 text-base">Delete Product?</h3>
              <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
                Are you sure you want to delete <strong className="text-gray-800">"{deleteTarget.title}"</strong>? This will permanently remove it from the catalogue database.
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 bg-gray-50 border border-gray-200 text-gray-600 text-[13px] font-semibold py-2.5 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const target = deleteTarget;
                  setDeleteTarget(null);
                  await apiFetch(`/admin/api/products.php?id=${target.id}`, { method: "DELETE" });
                  fetchProducts();
                }}
                className="flex-1 bg-red-600 text-white text-[13px] font-bold py-2.5 rounded-xl hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
