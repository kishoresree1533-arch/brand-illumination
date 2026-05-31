import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "../../components/AdminLayout";
import { useEffect, useState, useRef } from "react";
import { apiFetch } from "../../lib/apiFetch";

export const Route = createFileRoute("/admin/services")({
  component: ServicesPage,
});

type Service = { id: number; slug: string; title: string; subtitle: string; icon: string; image_path: string; };

function ServicesPage() {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ title: "", slug: "", subtitle: "", description: "", icon: "" });

  const fetchData = () => {
    setLoading(true);
    apiFetch("/admin/api/services.php").then(r => r.json()).then(d => { if (!d.error) setData(d); }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value, ...(name === "title" ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") } : {}) }));
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
      const json = await apiFetch("/admin/api/services.php", { method: "POST", body: fd }).then(r => r.json());
      if (json.success) {
        setSuccess("Service added!"); setShowModal(false);
        setForm({ title: "", slug: "", subtitle: "", description: "", icon: "" }); setPreview(null);
        fetchData(); setTimeout(() => setSuccess(""), 3000);
      } else { setError(json.error || "Failed."); }
    } catch { setError("Network error."); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await apiFetch(`/admin/api/services.php?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <AdminLayout title="Services Management">
      {success && <div className="fixed top-6 right-6 z-50 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold px-5 py-3 rounded-xl shadow-lg">✓ {success}</div>}

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-space font-bold text-gray-900 text-lg">Active Services</h2>
          <button onClick={() => { setShowModal(true); setError(""); }}
            className="bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0d1b2a] text-[13px] font-bold px-4 py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer">
            + Add Service
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-8"><div className="w-8 h-8 border-2 border-white/20 border-t-[#c9a84c] rounded-full animate-spin"></div></div>
        ) : data.length === 0 ? (
          <div className="text-center py-16"><div className="text-5xl mb-4 opacity-30">◫</div><p className="text-gray-900/40 text-sm">No services yet. Add your first service!</p></div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="text-[11px] font-semibold text-gray-900/40 uppercase tracking-widest pb-3 border-b border-gray-200">Icon</th>
                <th className="text-[11px] font-semibold text-gray-900/40 uppercase tracking-widest pb-3 border-b border-gray-200">Service</th>
                <th className="text-[11px] font-semibold text-gray-900/40 uppercase tracking-widest pb-3 border-b border-gray-200">Slug</th>
                <th className="text-[11px] font-semibold text-gray-900/40 uppercase tracking-widest pb-3 border-b border-gray-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(s => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-[#c9a84c]/10 text-[#c9a84c] flex items-center justify-center text-xl">{s.icon || "◫"}</div>
                  </td>
                  <td className="py-4 border-b border-gray-100">
                    <div className="font-medium text-[14px] text-gray-900">{s.title}</div>
                    <div className="text-[12px] text-gray-900/45 mt-0.5 truncate max-w-xs">{s.subtitle}</div>
                  </td>
                  <td className="py-4 border-b border-gray-100 text-[13px] text-gray-900/50 font-mono">/{s.slug}</td>
                  <td className="py-4 border-b border-gray-100 text-right">
                    <button onClick={() => handleDelete(s.id, s.title)}
                      className="text-red-600 hover:text-red-700 text-[12px] font-medium transition-colors cursor-pointer">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="font-space font-bold text-gray-900 text-base">Add New Service</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-900/40 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {error && <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-[13px] px-4 py-3 rounded-xl">{error}</div>}

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-[#c9a84c]/40 transition-colors"
                onClick={() => fileRef.current?.click()}>
                {preview ? <img src={preview} alt="Preview" className="max-h-28 rounded-lg object-cover" /> : <><div className="text-3xl text-gray-900/20">↑</div><p className="text-[13px] text-gray-900/40">Upload service image</p></>}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setPreview(URL.createObjectURL(f)); }} />
              </div>

              {[
                { name: "title", label: "Service Title *", placeholder: "e.g. LED Signage" },
                { name: "slug", label: "URL Slug", placeholder: "auto-generated", mono: true },
                { name: "subtitle", label: "Short Tagline", placeholder: "e.g. Bright, Durable, Energy Efficient" },
                { name: "icon", label: "Icon (Emoji)", placeholder: "e.g. 💡" },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-[11px] font-semibold text-gray-900/40 uppercase tracking-widest mb-2">{f.label}</label>
                  <input name={f.name} value={(form as any)[f.name]} onChange={handleInput} placeholder={f.placeholder}
                    className={`w-full bg-black/20 border border-gray-200 rounded-xl px-4 py-3 text-[14px] placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/60 focus:ring-1 focus:ring-[#c9a84c]/30 transition-all ${f.mono ? "text-gray-900/70 font-mono text-[13px]" : "text-gray-900"}`} />
                </div>
              ))}

              <div>
                <label className="block text-[11px] font-semibold text-gray-900/40 uppercase tracking-widest mb-2">Description</label>
                <textarea name="description" value={form.description} onChange={handleInput} rows={3} placeholder="Describe this service…"
                  className="w-full bg-black/20 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-[14px] placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/60 focus:ring-1 focus:ring-[#c9a84c]/30 transition-all resize-none" />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 bg-white border border-gray-200 text-gray-900/70 text-[13px] font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0d1b2a] text-[13px] font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting ? <><div className="w-4 h-4 border-2 border-[#0d1b2a]/30 border-t-[#0d1b2a] rounded-full animate-spin"></div>Saving…</> : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

