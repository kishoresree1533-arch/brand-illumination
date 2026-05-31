import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "../../components/AdminLayout";
import { useEffect, useState, useRef } from "react";
import { apiFetch } from "../../lib/apiFetch";

export const Route = createFileRoute("/admin/portfolio")({
  component: PortfolioAdminPage,
});

// Must match the categories used on the frontend portfolio page
const CATEGORIES = [
  "Retail",
  "Hospitality",
  "Corporate",
  "Outdoor",
  "LED & Neon",
  "Printing",
  "Other",
];

type PortfolioItem = {
  id: number;
  title: string;
  category: string;
  client: string;
  description: string;
  image_path: string;
  created_at: string;
};

function inputCls(extra = "") {
  return `w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-[13px] placeholder-gray-400 focus:outline-none focus:border-[#c9a84c]/60 focus:ring-1 focus:ring-[#c9a84c]/30 transition-all ${extra}`;
}

function labelCls() {
  return "block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5";
}

function PortfolioAdminPage() {
  const [data, setData] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ title: "", category: "", client: "", description: "" });

  const fetchData = () => {
    setLoading(true);
    apiFetch("/admin/api/portfolio.php")
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const openModal = () => {
    setForm({ title: "", category: "", client: "", description: "" });
    setPreview(null);
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.title) { setError("Title is required."); return; }
    setSubmitting(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (fileRef.current?.files?.[0]) fd.append("image", fileRef.current.files[0]);

    try {
      const res = await apiFetch("/admin/api/portfolio.php", { method: "POST", body: fd });
      const json = await res.json();
      if (json.success) {
        setSuccess("Portfolio item added!");
        setShowModal(false);
        if (fileRef.current) fileRef.current.value = "";
        fetchData();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(json.error || "Failed to add item.");
      }
    } catch { setError("Network error."); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await apiFetch(`/admin/api/portfolio.php?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  // Build full image URL for display
  const imgUrl = (path: string) =>
    path ? `http://localhost/brand-illumination${path}` : "";

  return (
    <AdminLayout title="Portfolio Management">
      {success && (
        <div className="fixed top-6 right-6 z-50 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold px-5 py-3 rounded-xl shadow-lg">
          ✓ {success}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-space font-bold text-gray-900 text-base">Portfolio Works</h2>
          <button
            onClick={openModal}
            className="bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0d1b2a] text-[13px] font-bold px-4 py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            + Add Work
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-[#c9a84c] rounded-full animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3 opacity-20">◉</div>
            <p className="text-gray-400 text-sm">No portfolio items yet. Add your first work!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.map((item) => (
              <div key={item.id} className="border border-gray-100 rounded-xl overflow-hidden group bg-gray-50">
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {item.image_path ? (
                    <img
                      src={imgUrl(item.image_path)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">◉</div>
                  )}
                  {item.category && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c9a84c] text-[#0d1b2a]">
                      {item.category}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-[13px] truncate">{item.title}</h3>
                  {item.client && (
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">Client: {item.client}</p>
                  )}
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="text-red-400 hover:text-red-600 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Work Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="font-space font-bold text-gray-900 text-base">Add Portfolio Work</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded-lg transition-all cursor-pointer text-xl"
              >×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label className={labelCls()}>Project Image</label>
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

              {/* Title */}
              <div>
                <label className={labelCls()}>Project Title <span className="text-red-400">*</span></label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleInput}
                  placeholder="e.g. Mall Branding Campaign"
                  className={inputCls()}
                />
              </div>

              {/* Category + Client */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls()}>Category</label>
                  <select name="category" value={form.category} onChange={handleInput} className={inputCls("cursor-pointer")}>
                    <option value="">Select…</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls()}>Client Name</label>
                  <input
                    name="client"
                    value={form.client}
                    onChange={handleInput}
                    placeholder="e.g. Reliance"
                    className={inputCls()}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelCls()}>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInput}
                  rows={3}
                  placeholder="Brief description of the project…"
                  className={inputCls("resize-none")}
                />
              </div>

              {/* Footer */}
              <div className="flex gap-3 pt-2 border-t border-gray-100">
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
                  className="flex-1 bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0d1b2a] text-[13px] font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><div className="w-4 h-4 border-2 border-[#0d1b2a]/30 border-t-[#0d1b2a] rounded-full animate-spin" />Saving…</>
                  ) : "Save Work"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
