import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function AdminLayout({ children, title }: { children: React.ReactNode, title: string }) {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate({ to: "/admin" });
    }
    setAdminName(localStorage.getItem("admin_name") || "Administrator");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    navigate({ to: "/admin" });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900 font-inter">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 bottom-0 z-50">
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#c9a84c] to-[#a07830] rounded-xl flex items-center justify-center font-space text-[15px] font-bold text-white shrink-0">
            BI
          </div>
          <div>
            <h2 className="font-space text-sm font-bold text-gray-900 leading-tight">Brand Illumination</h2>
            <p className="text-[10px] text-gray-600 tracking-widest uppercase mt-0.5">Admin Studio</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-1">
          <Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all [&.active]:bg-[#c9a84c]/10 [&.active]:text-[#c9a84c]">
            <span className="text-base w-5 text-center">⊞</span> Dashboard
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all [&.active]:bg-[#c9a84c]/10 [&.active]:text-[#c9a84c]">
            <span className="text-base w-5 text-center">◈</span> Products
          </Link>
          <Link to="/admin/portfolio" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all [&.active]:bg-[#c9a84c]/10 [&.active]:text-[#c9a84c]">
            <span className="text-base w-5 text-center">◉</span> Portfolio
          </Link>
          <Link to="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all [&.active]:bg-[#c9a84c]/10 [&.active]:text-[#c9a84c]">
            <span className="text-base w-5 text-center">◎</span> Settings
          </Link>
        </nav>

        <div className="p-5 border-t border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-gray-900">{adminName}</p>
            <span className="text-[11px] text-gray-600">Administrator</span>
          </div>
          <button onClick={handleLogout} className="text-[11px] text-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg hover:bg-red-100 transition-all font-medium cursor-pointer">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen relative">
        <div className="px-8 py-5 border-b border-gray-200 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-40">
          <h1 className="font-space text-xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-[11px] font-semibold text-green-700">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
              System Online
            </span>
          </div>
        </div>
        
        <div className="p-6 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

