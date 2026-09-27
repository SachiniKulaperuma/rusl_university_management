/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

export default function StudentProfilePage() {
  const [activeNav, setActiveNav] = useState("profile");

  const [student, setStudent] = useState<any>({
    full_name: "Sachini Kulaperuma",
    student_id: "RJT2024001",
    gender: "Female",
    citizenship: "Sri Lankan",
    nic_no: "200315021234V",
    telephone_no: "+94 77 123 4567",
    email: "sachini@rjt.ac.lk",
    permanent_address: "123 Main Street, Colombo 7, Sri Lanka",
    district: "Colombo",
    guardian_name: "Ravi Kulaperuma",
    guardian_relationship: "Father",
    guardian_telephone: "+94 71 234 5678",
    guardian_work_address: "123 Main Street, Colombo 7, Sri Lanka",
    guardian_occupation: "Engineer"
  });

  useEffect(() => {
    const studentStr = localStorage.getItem("student");
    if (studentStr) {
      try {
        const studentData = JSON.parse(studentStr);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStudent((prev: any) => ({ ...prev, ...studentData }));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const navItems = [
    { id: "profile", icon: "fas fa-user", label: "Profile" },
    { id: "edit", icon: "fas fa-edit", label: "Edit profile", href: "student-profile/edit-profile" },
    { id: "notifications", icon: "fas fa-bell", label: "Notifications" },
    { id: "security", icon: "fas fa-lock", label: "Security" },
    { id: "appearance", icon: "fas fa-palette", label: "Appearance" },
    { id: "help", icon: "fas fa-question-circle", label: "Help" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-77px)] bg-[#e8e4dc]">
      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-40 shrink-0 bg-gradient-to-b from-[#7C0A02] to-[#5a0602] sticky top-[77px] h-[calc(100vh-77px)] overflow-y-auto">
        <ul className="list-none p-0 m-0 py-3">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.href ?? "#"}
                onClick={(e) => {
                  if (!item.href) e.preventDefault();
                  setActiveNav(item.id);
                }}
                className={[
                  "flex items-center gap-3 px-4 py-[14px] text-[0.9rem] font-medium transition-all duration-250",
                  "border-l-[3px]",
                  activeNav === item.id
                    ? "bg-white/15 text-white border-l-white font-semibold"
                    : "text-white/85 border-l-transparent hover:bg-white/15 hover:text-white hover:border-l-white",
                ].join(" ")}
              >
                <i className={`${item.icon} text-[1.1rem] w-5`}></i>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto px-8 py-7">
        {/* PROFILE HEADER CARD */}
        <div className="bg-white rounded-lg p-7 shadow-[0_2px_8px_rgba(0,0,0,0.08)] mb-7 flex items-start gap-7 flex-wrap">
          {/* Avatar */}
          <div className="shrink-0">
            <div className="w-[140px] h-[140px] rounded-lg bg-gradient-to-br from-[#7C0A02] to-[#5a0602] flex items-center justify-center text-white text-5xl shadow-[0_4px_12px_rgba(124,10,2,0.2)] overflow-hidden">
              {student.full_name ? student.full_name.charAt(0).toUpperCase() : <i className="fas fa-user"></i>}
            </div>
          </div>
          {/* Info */}
          <div className="flex-1 pt-2">
            <h1 className="text-[1.9rem] text-[#222] m-0 mb-2 font-bold">
              {student.full_name || student.name_with_initials}
            </h1>
            <p className="text-[#888] text-[0.95rem] m-0">
              Student ID: {student.student_id}
            </p>
            <div className="flex gap-3 mt-4">
              <button className="px-5 py-[10px] bg-[#7C0A02] text-white rounded-md text-[0.9rem] font-semibold cursor-pointer transition-all duration-250 hover:bg-[#5a0602] hover:shadow-[0_2px_8px_rgba(124,10,2,0.3)] border-none">
                <i className="fas fa-edit mr-1"></i> Edit
              </button>
              <button className="px-5 py-[10px] bg-[#e0e0e0] text-[#222] rounded-md text-[0.9rem] font-semibold cursor-pointer transition-all duration-250 hover:bg-[#d0d0d0] border-none">
                <i className="fas fa-download mr-1"></i> Download
              </button>
            </div>
          </div>
        </div>

        {/* INFO SECTIONS */}
        <div className="grid gap-6">
          {/* PERSONAL INFORMATION */}
          <InfoSection title="Personal Information" icon="fas fa-id-card">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Full Name" value={student.full_name || student.name_with_initials} />
              <InfoItem label="Date of Birth" value="N/A" />
              <InfoItem label="Gender" value={student.gender} />
              <InfoItem label="Nationality" value={student.citizenship || student.race} />
              <InfoItem label="NIC Number" value={student.nic_no} />
              <InfoItem label="Passport Number" value="N/A" />
            </div>
          </InfoSection>

          {/* CONTACT INFORMATION */}
          <InfoSection title="Contact Information" icon="fas fa-address-card">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Mobile Number" value={student.telephone_no} />
              <InfoItem label="Email Address" value={student.email} />
              <InfoItem label="Permanent Address" value={student.permanent_address} />
              <InfoItem label="Postal Code" value="N/A" />
              <InfoItem label="City" value={student.district} />
              <InfoItem label="District" value={student.district} />
            </div>
          </InfoSection>

          {/* GUARDIAN INFORMATION */}
          <InfoSection title="Guardian Information" icon="fas fa-users">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Guardian Name" value={student.guardian_name} />
              <InfoItem label="Relationship" value={student.guardian_relationship} />
              <InfoItem label="Guardian Contact" value={student.guardian_telephone} />
              <InfoItem label="Guardian Email" value="N/A" />
              <InfoItem label="Guardian Address" value={student.guardian_work_address} />
              <InfoItem label="Guardian Occupation" value={student.guardian_occupation} />
            </div>
          </InfoSection>
        </div>
      </main>
    </div>
  );
}

/* ── Sub-components ── */

function InfoSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="bg-[#7C0A02] text-white px-5 py-[14px] text-[0.95rem] font-bold flex items-center gap-2.5">
        <i className={`${icon} text-base`}></i>
        {title}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  const isEmpty = !value || value.trim() === "";
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[0.8rem] text-[#888] font-semibold uppercase tracking-[0.5px]">
        {label}
      </span>
      <span
        className={`text-[0.95rem] font-medium ${
          isEmpty ? "text-[#bbb] italic" : "text-[#222]"
        }`}
      >
        {isEmpty ? "—" : value}
      </span>
    </div>
  );
}