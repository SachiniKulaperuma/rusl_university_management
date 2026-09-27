/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";

interface Subject {
  subject_code: string;
  subject_name: string;
  credit_value: number;
  semester: string;
  department: string;
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [credit, setCredit] = useState(2);
  const [semester, setSemester] = useState("Semester 1");
  const [department, setDepartment] = useState("B.ICT");
  const [submitting, setSubmitting] = useState(false);

  const fetchSubjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/subjects/all");
      const data = await res.json();
      if (Array.isArray(data)) setSubjects(data);
    } catch {
      console.error("Error fetching subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/subjects/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_code: code,
          subject_name: name,
          credit_value: credit,
          semester,
          department
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSubjects([...subjects, data.subject]);
        setCode("");
        setName("");
        alert("Subject added successfully!");
      } else {
        alert(data.error || "Failed to add subject");
      }
    } catch {
      alert("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight mb-2">Subject Management</h1>
        <p className="text-[#64748b] font-medium">Add new subjects and manage existing curriculum.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6 sticky top-24">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
              <i className="fas fa-plus-circle text-[#7C0A02]"></i> Add New Subject
            </h2>
            <form onSubmit={handleAddSubject} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#334155] mb-1">Subject Code</label>
                <input required type="text" placeholder="e.g. ICT1101" value={code} onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-2 border border-[#cbd5e1] rounded-lg text-sm outline-none focus:border-[#7C0A02] focus:ring-1 focus:ring-[#7C0A02] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#334155] mb-1">Subject Name</label>
                <input required type="text" placeholder="e.g. Programming Fundamentals" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-[#cbd5e1] rounded-lg text-sm outline-none focus:border-[#7C0A02] focus:ring-1 focus:ring-[#7C0A02] transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#334155] mb-1">Credits</label>
                  <input required type="number" min="1" max="10" value={credit} onChange={(e) => setCredit(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-[#cbd5e1] rounded-lg text-sm outline-none focus:border-[#7C0A02] focus:ring-1 focus:ring-[#7C0A02] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#334155] mb-1">Semester</label>
                  <select value={semester} onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-4 py-2 border border-[#cbd5e1] rounded-lg text-sm outline-none focus:border-[#7C0A02] focus:ring-1 focus:ring-[#7C0A02] transition-all">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n}>Semester {n}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#334155] mb-1">Course / Department</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-[#cbd5e1] rounded-lg text-sm outline-none focus:border-[#7C0A02] focus:ring-1 focus:ring-[#7C0A02] transition-all">
                  <option>B.ICT</option>
                  <option>B.ET</option>
                  <option>B.BST</option>
                </select>
              </div>
              <button disabled={submitting} className="mt-4 w-full bg-[#7C0A02] text-white py-2.5 rounded-lg font-bold shadow-md hover:bg-[#5a0602] hover:shadow-lg transition-all disabled:opacity-70">
                {submitting ? 'Adding...' : 'Add Subject'}
              </button>
            </form>
          </div>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
            <div className="p-5 border-b border-[#e2e8f0] bg-[#f8fafc] flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#1e293b]">Current Subjects ({subjects.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-[#e2e8f0]">
                    <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Code</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Credits</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Semester</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Dept.</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {loading ? (
                     <tr><td colSpan={5} className="p-8 text-center text-[#64748b]">Loading...</td></tr>
                  ) : subjects.length === 0 ? (
                     <tr><td colSpan={5} className="p-8 text-center text-[#64748b]">No subjects added yet.</td></tr>
                  ) : (
                    subjects.map((sub, idx) => (
                      <tr key={idx} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                        <td className="px-6 py-4 font-bold text-[#334155]">{sub.subject_code}</td>
                        <td className="px-6 py-4 font-medium text-[#475569]">{sub.subject_name}</td>
                        <td className="px-6 py-4 text-[#64748b] font-semibold">{sub.credit_value}</td>
                        <td className="px-6 py-4 text-[#64748b]">{sub.semester}</td>
                        <td className="px-6 py-4">
                          <span className="bg-[#eef2ff] text-[#4f46e5] px-2 py-1 rounded text-[0.7rem] font-bold">{sub.department}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

