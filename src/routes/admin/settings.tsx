import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "../../components/AdminLayout";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/apiFetch";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

type Setting = { id: number; setting_key: string; setting_value: string; };

const SETTING_LABELS: Record<string, string> = {
  site_name: "Site Name",
  site_tagline: "Site Tagline",
  contact_phone: "Contact Phone",
  contact_email: "Contact Email",
  contact_address: "Contact Address",
};

function SettingsPage() {
  const [data, setData] = useState<Setting[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/admin/api/settings.php")
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) {
          setData(d);
          const map: Record<string, string> = {};
          d.forEach((s: Setting) => { map[s.setting_key] = s.setting_value ?? ""; });
          setValues(map);
        } else if (d && d.error) {
          setError(d.error);
        }
      })
      .catch((err) => {
        setError("Failed to load settings.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await apiFetch("/admin/api/settings.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: values }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess("Settings saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(json.error || "Failed to save settings.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Global Settings">
      {success && (
        <div className="fixed top-6 right-6 z-50 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold px-5 py-3 rounded-xl shadow-lg">
          ✓ {success}
        </div>
      )}

      <div className="max-w-2xl">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-space font-bold text-gray-900 text-lg">Site Configuration</h2>
              <p className="text-[13px] text-gray-900/40 mt-1">Changes are applied site-wide instantly.</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0d1b2a] text-[13px] font-bold px-5 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? (
                <><div className="w-4 h-4 border-2 border-[#0d1b2a]/30 border-t-[#0d1b2a] rounded-full animate-spin"></div>Saving…</>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-[13px] px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-2 border-white/20 border-t-[#c9a84c] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {data.map((s) => (
                <div key={s.id}>
                  <label className="block text-[11px] font-semibold text-gray-900/40 uppercase tracking-widest mb-2">
                    {SETTING_LABELS[s.setting_key] ?? s.setting_key.replace(/_/g, " ")}
                  </label>
                  <input
                    type="text"
                    value={values[s.setting_key] ?? ""}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [s.setting_key]: e.target.value }))
                    }
                    className="w-full bg-black/20 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-[14px] focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30 transition-all"
                  />
                </div>
              ))}

              {data.length === 0 && (
                <p className="text-gray-900/40 text-sm text-center py-6">
                  No settings found. Make sure the database is seeded.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Change Password Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-6">
          <h2 className="font-space font-bold text-gray-900 text-lg mb-6">Security</h2>
          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-[11px] font-semibold text-gray-900/40 uppercase tracking-widest mb-2">Current Password</label>
              <input type="password" placeholder="••••••••"
                className="w-full bg-black/20 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-[14px] focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-900/40 uppercase tracking-widest mb-2">New Password</label>
              <input type="password" placeholder="••••••••"
                className="w-full bg-black/20 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-[14px] focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-900/40 uppercase tracking-widest mb-2">Confirm New Password</label>
              <input type="password" placeholder="••••••••"
                className="w-full bg-black/20 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-[14px] focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30 transition-all" />
            </div>
            <div>
              <button className="bg-white border border-gray-200 text-gray-900 text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

