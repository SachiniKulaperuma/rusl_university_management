"use client";

import React from "react";

export default function AdminSettingsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight mb-2">System Settings</h1>
        <p className="text-[#64748b] font-medium">Configure university portal parameters and admin access.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 text-slate-500 mb-4">
          <i className="fas fa-cog text-3xl"></i>
        </div>
        <h2 className="text-xl font-bold text-[#1e293b] mb-2">Settings Hub</h2>
        <p className="text-[#64748b] max-w-md mx-auto">
          Super Admins can configure global settings, academic years, and manage staff roles here.
        </p>
      </div>
    </div>
  );
}
