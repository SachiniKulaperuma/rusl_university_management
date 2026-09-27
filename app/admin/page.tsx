"use client";

import React, { useState, useEffect } from "react";

interface Registration {
  student_id: string;
  name_with_initials: string;
  course_of_study: string;
  status: string;
  registration_date: string;
}

interface GroupedRegistration {
  id: string;
  name: string;
  course: string;
  status: string;
  date: Date;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    newRegistrations: 0,
    pendingApprovals: 0,
    activeDepartments: 3
  });
  
  const [recentRegistrations, setRecentRegistrations] = useState<GroupedRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [studentsRes, regRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/students"),
          fetch("http://localhost:5000/api/admin/registrations")
        ]);
        
        const studentsData = await studentsRes.json();
        const regData = await regRes.json();
        
        if (studentsData.success) {
          const studentsList = studentsData.students;
          
          // Count pending students
          const pendingCount = studentsList.filter((s: any) => s.status === 'Pending').length;
          
          setStats({
            totalStudents: studentsList.length,
            newRegistrations: studentsList.length, // Or filter by date if we have created_at
            pendingApprovals: pendingCount,
            activeDepartments: 3
          });
          
          // Sort to show newest first if we assume later ID or something, but we can just reverse
          const recentStudents = [...studentsList].reverse().slice(0, 5);
          
          const mappedForTable: GroupedRegistration[] = recentStudents.map((s: any) => ({
            id: s.student_id,
            name: s.name_with_initials,
            course: s.course_of_study,
            status: s.status || 'Pending',
            date: new Date() // Fallback since students table might not have date
          }));
          
          setRecentRegistrations(mappedForTable);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight mb-2">Dashboard Overview</h1>
        <p className="text-[#64748b] font-medium">Welcome back, Admin. Here is what&apos;s happening today.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard 
          title="Total Students" 
          value={loading ? "..." : stats.totalStudents.toString()} 
          trend="Total enrolled" 
          icon="fas fa-users" 
          color="bg-[#e0e7ff] text-[#4f46e5]" 
        />
        <SummaryCard 
          title="Total Registrations" 
          value={loading ? "..." : stats.newRegistrations.toString()} 
          trend="All time" 
          icon="fas fa-user-plus" 
          color="bg-[#dcfce7] text-[#16a34a]" 
        />
        <SummaryCard 
          title="Pending Approvals" 
          value={loading ? "..." : stats.pendingApprovals.toString()} 
          trend="Requires attention" 
          icon="fas fa-clock" 
          color="bg-[#fef3c7] text-[#d97706]" 
        />
        <SummaryCard 
          title="Active Departments" 
          value={stats.activeDepartments.toString()} 
          trend="B.ICT, B.ET, B.BST" 
          icon="fas fa-building-columns" 
          color="bg-[#fce7f3] text-[#db2777]" 
        />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Registrations Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1e293b]">Recent Registrations</h2>
            <button className="text-[#7C0A02] text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e2e8f0]">
                  <th className="pb-3 text-sm font-semibold text-[#64748b]">Student ID</th>
                  <th className="pb-3 text-sm font-semibold text-[#64748b]">Name</th>
                  <th className="pb-3 text-sm font-semibold text-[#64748b]">Course</th>
                  <th className="pb-3 text-sm font-semibold text-[#64748b]">Status</th>
                  <th className="pb-3 text-sm font-semibold text-[#64748b]">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr><td colSpan={5} className="py-4 text-center text-gray-500">Loading...</td></tr>
                ) : recentRegistrations.length === 0 ? (
                  <tr><td colSpan={5} className="py-4 text-center text-gray-500">No registrations found</td></tr>
                ) : (
                  recentRegistrations.map((student, idx) => (
                    <tr key={idx} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                      <td className="py-4 font-semibold text-[#334155]">{student.id}</td>
                      <td className="py-4 text-[#475569]">{student.name}</td>
                      <td className="py-4 text-[#475569]">{student.course}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          student.status === "Approved" ? "bg-green-100 text-green-700" :
                          student.status === "Pending" ? "bg-amber-100 text-amber-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <button className="text-[#94a3b8] hover:text-[#7C0A02] transition-colors"><i className="fas fa-ellipsis-v"></i></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="flex flex-col gap-8">
          <div className="bg-gradient-to-br from-[#7C0A02] to-[#5a0602] rounded-xl shadow-md p-6 text-white">
            <h3 className="text-lg font-bold mb-2">University System Status</h3>
            <p className="text-white/80 text-sm mb-6">All systems are running smoothly. Database connections are stable.</p>
            <button className="w-full bg-white/20 hover:bg-white/30 transition-colors py-2.5 rounded-lg text-sm font-semibold backdrop-blur-sm">
              Generate Full Report
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6">
            <h3 className="text-lg font-bold text-[#1e293b] mb-4">Registration Analytics</h3>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-[#475569]">B.ICT</span>
                  <span className="text-[#64748b]">45%</span>
                </div>
                <div className="w-full bg-[#f1f5f9] rounded-full h-2">
                  <div className="bg-[#3b82f6] h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-[#475569]">B.ET</span>
                  <span className="text-[#64748b]">35%</span>
                </div>
                <div className="w-full bg-[#f1f5f9] rounded-full h-2">
                  <div className="bg-[#10b981] h-2 rounded-full" style={{ width: "35%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-[#475569]">B.BST</span>
                  <span className="text-[#64748b]">20%</span>
                </div>
                <div className="w-full bg-[#f1f5f9] rounded-full h-2">
                  <div className="bg-[#f59e0b] h-2 rounded-full" style={{ width: "20%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Reusable component
function SummaryCard({ title, value, trend, icon, color }: { title: string, value: string, trend: string, icon: string, color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[#64748b] text-sm font-semibold mb-1">{title}</p>
          <h3 className="text-2xl font-extrabold text-[#1e293b]">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${color}`}>
          <i className={icon}></i>
        </div>
      </div>
      <p className="text-xs font-semibold text-[#94a3b8] flex items-center gap-1">
        <i className="fas fa-arrow-up text-green-500"></i> {trend}
      </p>
    </div>
  );
}
