"use client";

import React, { useState, useEffect } from "react";

export default function AdminExamsPage() {
  const [activeTab, setActiveTab] = useState("admissions");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    // Read from localStorage to sync with student portal
    const fetchApps = () => {
        const appsStr = localStorage.getItem("exam_applications");
        if (appsStr) {
            setApplications(JSON.parse(appsStr));
        }
    };
    
    fetchApps();
    
    // Auto refresh every 2 seconds to see new applications without reloading
    const interval = setInterval(fetchApps, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = (id: string) => {
      const updated = applications.map(app => {
          if (app.id === id) {
              return { ...app, status: "Approved" };
          }
          return app;
      });
      setApplications(updated);
      localStorage.setItem("exam_applications", JSON.stringify(updated));
  };
  
  const handleReject = (id: string) => {
      const updated = applications.map(app => {
          if (app.id === id) {
              return { ...app, status: "Rejected" };
          }
          return app;
      });
      setApplications(updated);
      localStorage.setItem("exam_applications", JSON.stringify(updated));
  };

  const filteredApps = applications.filter(app => 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      app.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight mb-2">Examination Department</h1>
          <p className="text-[#64748b] font-medium">Verify student exam applications, manage subjects, and issue signed admissions.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-[#e2e8f0] shadow-sm">
          <button 
            onClick={() => setActiveTab("admissions")}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'admissions' ? 'bg-[#7C0A02] text-white shadow-md' : 'text-[#64748b] hover:bg-[#f1f5f9]'}`}
          >
            Exam Applications
          </button>
          <button 
            onClick={() => setActiveTab("manage")}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'manage' ? 'bg-[#7C0A02] text-white shadow-md' : 'text-[#64748b] hover:bg-[#f1f5f9]'}`}
          >
            Manage Exams
          </button>
        </div>
      </div>

      {activeTab === "admissions" && (
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden animate-in fade-in">
          <div className="p-5 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
            <div className="relative w-72">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"></i>
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[#cbd5e1] rounded-lg text-sm outline-none focus:border-[#7C0A02] focus:ring-1 focus:ring-[#7C0A02] transition-all"
              />
            </div>
            <div className="text-sm font-bold text-slate-500">
                {applications.filter(a => a.status === 'Pending').length} Pending Validation
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-[#e2e8f0]">
                  <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Subjects</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Applied On</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredApps.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-slate-400 font-bold">No applications found. Students need to apply first.</td></tr>
                ) : filteredApps.map((adm, idx) => (
                  <tr key={idx} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                    <td className="px-6 py-4 font-bold text-[#334155]">{adm.studentId}</td>
                    <td className="px-6 py-4 font-medium text-[#475569]">{adm.name}</td>
                    <td className="px-6 py-4 text-[#64748b]">
                        <div className="flex flex-col gap-1">
                            <span className="font-bold text-slate-700">{adm.subjects?.length || 0} Normal</span>
                            <span className="text-xs text-red-600 font-bold">{adm.repeatSubjects?.length || 0} Repeat</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-[#64748b]">{adm.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        adm.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                        adm.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {adm.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {adm.status === 'Pending' && (
                          <>
                            <button onClick={() => handleApprove(adm.id)} className="w-8 h-8 rounded-md bg-white border border-[#e2e8f0] text-[#10b981] hover:bg-[#ecfdf5] hover:border-[#a7f3d0] transition-all flex items-center justify-center" title="Verify & Issue Admission (Add HOD/AR Sign)">
                              <i className="fas fa-check"></i>
                            </button>
                            <button onClick={() => handleReject(adm.id)} className="w-8 h-8 rounded-md bg-white border border-[#e2e8f0] text-[#ef4444] hover:bg-[#fef2f2] hover:border-[#fecaca] transition-all flex items-center justify-center" title="Reject">
                              <i className="fas fa-times"></i>
                            </button>
                          </>
                        )}
                        <button className="w-8 h-8 rounded-md bg-white border border-[#e2e8f0] text-[#3b82f6] hover:bg-[#eff6ff] hover:border-[#bfdbfe] transition-all flex items-center justify-center" title="View Application Details">
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "manage" && (
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden p-10 text-center animate-in fade-in">
           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 text-[#7C0A02] mb-4">
              <i className="fas fa-calendar-alt text-3xl"></i>
           </div>
           <h2 className="text-xl font-bold text-[#1e293b] mb-2">Exam Scheduler</h2>
           <p className="text-[#64748b] max-w-md mx-auto mb-6">
             Create new examinations, set dates, and configure eligibility requirements for students.
           </p>
           <button className="px-6 py-2.5 bg-[#7C0A02] text-white font-bold rounded-lg shadow-md hover:bg-[#5a0602] transition-colors">
             <i className="fas fa-plus mr-2"></i> Create New Exam
           </button>
        </div>
      )}
    </div>
  );
}
