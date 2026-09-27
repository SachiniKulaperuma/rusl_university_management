/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";

interface Student {
  student_id: string;
  name_with_initials: string;
  course_of_study: string;
  email: string;
  district: string;
  status: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/students");
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
      } else {
        setError(data.error || "Failed to fetch students");
      }
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleApprove = async (id: string) => {
    if (!confirm(`Are you sure you want to approve student ${id}?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/students/${encodeURIComponent(id)}/approve`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        setStudents(students.map(s => s.student_id === id ? { ...s, status: 'Approved' } : s));
      } else {
        alert(data.error || 'Failed to approve');
      }
    } catch {
      alert('Network error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`WARNING: Are you sure you want to permanently delete student ${id}?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/students/${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setStudents(students.filter(s => s.student_id !== id));
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch {
      alert('Network error');
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name_with_initials.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course_of_study.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight mb-2">Student Management</h1>
          <p className="text-[#64748b] font-medium">View and manage all registered students.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-[#e2e8f0] text-[#475569] font-semibold rounded-lg hover:bg-[#f8fafc] shadow-sm transition-all">
            <i className="fas fa-filter mr-2"></i> Filter
          </button>
          <button className="px-4 py-2 bg-[#7C0A02] text-white font-semibold rounded-lg shadow-md hover:bg-[#5a0602] hover:shadow-lg transition-all">
            <i className="fas fa-file-export mr-2"></i> Export Data
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
          <div className="relative w-72">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"></i>
            <input
              type="text"
              placeholder="Search by ID, Name or Course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#cbd5e1] rounded-lg text-sm outline-none focus:border-[#7C0A02] focus:ring-1 focus:ring-[#7C0A02] transition-all"
            />
          </div>
          <div className="text-sm font-semibold text-[#64748b]">
            Total Records: <span className="text-[#1e293b]">{filteredStudents.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-[#e2e8f0]">
                <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Registration No</th>
                <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#64748b]">
                    <i className="fas fa-circle-notch fa-spin text-2xl mb-2 text-[#7C0A02]"></i>
                    <p>Loading students...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-red-500">
                    <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
                    <p>{error}</p>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#64748b]">
                    <i className="fas fa-folder-open text-3xl mb-3 text-[#cbd5e1]"></i>
                    <p>No students found matching your search.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => (
                  <tr key={idx} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                    <td className="px-6 py-4 font-bold text-[#334155]">{student.student_id}</td>
                    <td className="px-6 py-4 font-medium text-[#475569]">{student.name_with_initials}</td>
                    <td className="px-6 py-4">
                      <span className="bg-[#eef2ff] text-[#4f46e5] px-2.5 py-1 rounded-md text-xs font-bold">
                        {student.course_of_study}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#64748b]">{student.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        student.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {student.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="w-8 h-8 rounded-md bg-white border border-[#e2e8f0] text-[#3b82f6] hover:bg-[#eff6ff] hover:border-[#bfdbfe] transition-all flex items-center justify-center" title="View Details">
                          <i className="fas fa-eye"></i>
                        </button>
                        {student.status !== 'Approved' && (
                          <button onClick={() => handleApprove(student.student_id)} className="w-8 h-8 rounded-md bg-white border border-[#e2e8f0] text-[#10b981] hover:bg-[#ecfdf5] hover:border-[#a7f3d0] transition-all flex items-center justify-center" title="Approve">
                            <i className="fas fa-check"></i>
                          </button>
                        )}
                        <button onClick={() => handleDelete(student.student_id)} className="w-8 h-8 rounded-md bg-white border border-[#e2e8f0] text-[#ef4444] hover:bg-[#fef2f2] hover:border-[#fecaca] transition-all flex items-center justify-center" title="Delete">
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
