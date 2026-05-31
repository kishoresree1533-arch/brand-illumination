import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "../../components/AdminLayout";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/apiFetch";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/admin/api/dashboard.php")
      .then((res) => res.json())
      .then((resData) => {
        if (!resData.error) {
          setData(resData);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-[#c9a84c] rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Products" value={data?.stats?.products || 0} />
        <StatCard label="Portfolio Items" value={data?.stats?.portfolio || 0} />
        <StatCard label="Active Services" value={data?.stats?.services || 0} />
        <StatCard label="User Settings" value="Active" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-space font-bold text-gray-900">Recently Added Products</h2>
            <button className="text-[12px] font-semibold text-gray-900/60 hover:text-gray-900 bg-white hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer">
              View All
            </button>
          </div>
          {data?.recentProducts?.length === 0 ? (
            <p className="text-sm text-gray-900/40 text-center py-6">No products added yet.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="text-[11px] font-semibold text-gray-900/40 uppercase tracking-widest pb-3 border-b border-gray-200">Image</th>
                  <th className="text-[11px] font-semibold text-gray-900/40 uppercase tracking-widest pb-3 border-b border-gray-200">Title</th>
                  <th className="text-[11px] font-semibold text-gray-900/40 uppercase tracking-widest pb-3 border-b border-gray-200">Category</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentProducts?.map((p: any) => (
                  <tr key={p.id} className="group">
                    <td className="py-3 border-b border-gray-100">
                      {p.image_path ? (
                        <img src={p.image_path} alt={p.title} className="w-10 h-10 rounded-lg object-cover bg-white" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg text-gray-900/40">◈</div>
                      )}
                    </td>
                    <td className="py-3 border-b border-gray-100 text-[13px] font-medium text-gray-900">{p.title}</td>
                    <td className="py-3 border-b border-gray-100">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20">
                        {p.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Portfolio */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-space font-bold text-gray-900">Recent Portfolio Works</h2>
            <button className="text-[12px] font-semibold text-gray-900/60 hover:text-gray-900 bg-white hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer">
              View All
            </button>
          </div>
          {data?.recentPortfolio?.length === 0 ? (
            <p className="text-sm text-gray-900/40 text-center py-6">No portfolio items added yet.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="text-[11px] font-semibold text-gray-900/40 uppercase tracking-widest pb-3 border-b border-gray-200">Image</th>
                  <th className="text-[11px] font-semibold text-gray-900/40 uppercase tracking-widest pb-3 border-b border-gray-200">Client / Work</th>
                  <th className="text-[11px] font-semibold text-gray-900/40 uppercase tracking-widest pb-3 border-b border-gray-200">Category</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentPortfolio?.map((p: any) => (
                  <tr key={p.id} className="group">
                    <td className="py-3 border-b border-gray-100">
                      {p.image_path ? (
                        <img src={p.image_path} alt={p.title} className="w-10 h-10 rounded-lg object-cover bg-white" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg text-gray-900/40">◉</div>
                      )}
                    </td>
                    <td className="py-3 border-b border-gray-100">
                      <div className="text-[13px] font-medium text-gray-900">{p.title}</div>
                      <div className="text-[11px] text-gray-900/45 mt-0.5">Client: {p.client || "N/A"}</div>
                    </td>
                    <td className="py-3 border-b border-gray-100">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20">
                        {p.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <h3 className="text-[11px] font-semibold text-gray-900/40 uppercase tracking-[0.1em] mb-2">{label}</h3>
      <p className="font-space text-3xl font-bold text-[#c9a84c]">{value}</p>
    </div>
  );
}

