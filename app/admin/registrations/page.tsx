"use client";

import { useState, useEffect } from "react";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/registrations");
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.registrations);
      } else {
        setError(data.error || "Failed to fetch registrations");
      }
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleApprove = async (studentId: string) => {
    if (!confirm(`Approve all subject registrations for student ${studentId}?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/registrations/approve/${encodeURIComponent(studentId)}`, { method: "PUT" });
      const data = await res.json();
      if (data.success) {
        alert("Registrations approved successfully!");
        fetchRegistrations();
      } else {
        alert(data.error || "Failed to approve");
      }
    } catch {
      alert("Network error");
    }
  };

  // Group by student
  const grouped = registrations.reduce((acc: any, curr: any) => {
    if (!acc[curr.student_id]) {
      acc[curr.student_id] = {
        student_id: curr.student_id,
        name: curr.name_with_initials,
        course: curr.course_of_study,
        academic_year: curr.academic_year,
        date: curr.registration_date,
        status: curr.status,
        subjects: [],
        total_credits: 0
      };
    }
    acc[curr.student_id].subjects.push({
      code: curr.subject_code,
      name: curr.subject_name,
      credits: curr.credit_value
    });
    acc[curr.student_id].total_credits += curr.credit_value;
    return acc;
  }, {});

  const studentsList = Object.values(grouped) as any[];

  const filteredStudents = studentsList.filter((s) =>
    s.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight mb-2">Subject Registrations</h1>
          <p className="text-[#64748b] font-medium">Manage student subject registrations and approvals.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[#fef2f2] border border-[#f87171] text-[#b91c1c] rounded-lg shadow-sm flex items-center gap-3">
          <i className="fas fa-exclamation-circle text-lg"></i>
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-[#e2e8f0] bg-[#f8fafc] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            Total Submissions: <span className="text-[#1e293b]">{filteredStudents.length}</span>
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
                <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Subjects</th>
                <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf1f5]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#94a3b8]">
                    <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-[#7C0A02] rounded-full mb-2"></div>
                    <p>Loading registrations...</p>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#94a3b8]">
                    <i className="fas fa-folder-open text-4xl mb-3 text-[#cbd5e1]"></i>
                    <p>No registrations found.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.student_id} className="hover:bg-[#f8fafc] transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#334155]">{s.student_id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-[#1e293b]">{s.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-[#64748b]">{s.course}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-sm font-medium">
                        <span className="text-[#334155]">{s.subjects.length} Subjects</span>
                        <span className="text-xs text-[#94a3b8]">{s.total_credits} Credits Total</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#e0f2fe] text-[#0284c7] border border-[#bae6fd]">
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedStudent(selectedStudent === s.student_id ? null : s.student_id)}
                        className="p-2 text-[#94a3b8] hover:text-[#7C0A02] hover:bg-red-50 rounded-lg transition-colors focus:outline-none"
                        title="View Details"
                      >
                        <i className={`fas fa-chevron-${selectedStudent === s.student_id ? 'up' : 'down'}`}></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Student Details Panel */}
      {selectedStudent && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6 animate-in fade-in slide-in-from-top-4 duration-300">
          {(() => {
            const student = filteredStudents.find(s => s.student_id === selectedStudent);
            if (!student) return null;
            return (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#1e293b]">Selected Subjects</h3>
                    <p className="text-sm text-[#64748b]">{student.name} ({student.student_id})</p>
                  </div>
                  <button 
                    onClick={() => handleApprove(student.student_id)}
                    className="px-4 py-2 bg-[#16a34a] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#15803d] transition-colors"
                  >
                    <i className="fas fa-check mr-2"></i> Approve Registration
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {student.subjects.map((sub: any, idx: number) => (
                    <div key={idx} className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4">
                      <div className="text-xs font-bold text-[#94a3b8] mb-1">{sub.code}</div>
                      <div className="font-semibold text-[#334155] text-sm leading-tight mb-2">{sub.name}</div>
                      <div className="text-xs font-bold text-[#7C0A02] bg-red-50 inline-block px-2 py-0.5 rounded border border-red-100">
                        {sub.credits} Credits
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
