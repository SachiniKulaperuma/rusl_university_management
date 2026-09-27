"use client";

import React from "react";

export default function AdminFacilitiesPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight mb-2">University Facilities</h1>
        <p className="text-[#64748b] font-medium">Manage hostels, sports facilities, and other student amenities.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 text-blue-500 mb-4">
          <i className="fas fa-building text-3xl"></i>
        </div>
        <h2 className="text-xl font-bold text-[#1e293b] mb-2">Facilities Module</h2>
        <p className="text-[#64748b] max-w-md mx-auto">
          This module is part of the next phase. It will allow you to allocate hostels, approve sports registrations, and manage bursary lists.
        </p>
      </div>
    </div>
  );
}
