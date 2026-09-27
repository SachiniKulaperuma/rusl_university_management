"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { name: "Dashboard", icon: "fas fa-chart-pie", path: "/admin" },
    { name: "Students", icon: "fas fa-user-graduate", path: "/admin/students" },
    { name: "Subjects", icon: "fas fa-book", path: "/admin/subjects" },
    { name: "Registrations", icon: "fas fa-clipboard-list", path: "/admin/registrations" },
    { name: "Exams", icon: "fas fa-file-signature", path: "/admin/exams" },
    { name: "Facilities", icon: "fas fa-building", path: "/admin/facilities" },
    { name: "Settings", icon: "fas fa-cog", path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex font-sans">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-[2px_0_12px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col z-10 sticky top-0 h-screen`}
      >
        <div className="h-[76px] flex items-center justify-between px-5 border-b border-[#edf1f5]">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-[#2c3e50] tracking-tight">
              Admin<span className="text-[#7C0A02]">Panel</span>
            </h1>
          ) : (
            <h1 className="text-xl font-bold text-[#7C0A02] w-full text-center">A</h1>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-[#7C0A02] text-white shadow-md shadow-red-900/20"
                    : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#7C0A02]"
                }`}
                title={!sidebarOpen ? item.name : ""}
              >
                <i className={`${item.icon} text-[1.1rem] ${!sidebarOpen && "mx-auto"}`}></i>
                {sidebarOpen && <span className="font-semibold text-[0.95rem]">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#edf1f5]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center py-2 text-[#94a3b8] hover:text-[#7C0A02] transition-colors"
          >
            <i className={`fas ${sidebarOpen ? "fa-chevron-left" : "fa-chevron-right"}`}></i>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-[76px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] border-b border-[#edf1f5] flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center bg-[#f1f5f9] px-4 py-2 rounded-full w-96">
            <i className="fas fa-search text-[#94a3b8] mr-3"></i>
            <input
              type="text"
              placeholder="Search students, subjects, or IDs..."
              className="bg-transparent border-none outline-none w-full text-[0.95rem] text-[#334155] placeholder-[#94a3b8]"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-[#64748b] hover:text-[#7C0A02] transition-colors">
              <i className="fas fa-bell text-xl"></i>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ef4444] rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-[#e2e8f0] pl-6 cursor-pointer">
              <div className="text-right hidden md:block">
                <p className="text-[0.9rem] font-bold text-[#1e293b] m-0 leading-tight">Admin User</p>
                <p className="text-[0.75rem] font-medium text-[#64748b] m-0">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#7C0A02] text-white flex items-center justify-center font-bold shadow-md">
                AU
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f4f7fb] p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
