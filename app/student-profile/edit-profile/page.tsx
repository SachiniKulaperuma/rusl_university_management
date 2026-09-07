"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import Link from "next/link";

export default function EditProfilePage() {
  const [activeMenu, setActiveMenu] = useState("edit-profile");
  const [avatarSrc, setAvatarSrc] = useState("/images/current_student.png");
  const [firstName, setFirstName] = useState("Heshan");
  const [lastName, setLastName] = useState("Priyantha");
  const [email, setEmail] = useState("optimaspriyantha@gmail.com");
  const [contact, setContact] = useState("0701234567");
  const [address, setAddress] = useState("rotaveva, seeppukulama");
  const [city, setCity] = useState("Mihinthalaya");
  const [state, setState] = useState("rotaveva road");
  const [password, setPassword] = useState("1234567");
  const [confirmPassword, setConfirmPassword] = useState("1234567");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarSrc(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setFirstName("Heshan");
    setLastName("Priyantha");
    setEmail("optimaspriyantha@gmail.com");
    setContact("0701234567");
    setAddress("rotaveva, seeppukulama");
    setCity("Mihinthalaya");
    setState("rotaveva road");
    setPassword("1234567");
    setConfirmPassword("1234567");
  };

  const wideMenuItems = [
    { id: "edit-profile", icon: "fas fa-user-pen", label: "Edit profile" },
    { id: "notifications", icon: "fas fa-bell", label: "Notification" },
    { id: "security", icon: "fas fa-lock", label: "Security" },
    { id: "appearance", icon: "fas fa-gear", label: "Appearance" },
    { id: "help", icon: "fas fa-circle-question", label: "Help" },
  ];

  const slimNavIcons = [
    { id: "home", icon: "fas fa-house", label: "Home", href: "/" },
    { id: "notifications", icon: "fas fa-bell", label: "Notifications" },
    { id: "calendar", icon: "far fa-calendar-alt", label: "Calendar" },
    { id: "performance", icon: "fas fa-chart-line", label: "Performance" },
    { id: "profile", icon: "fas fa-user", label: "Profile" },
  ];

  const avatarFallback = "https://i.pravatar.cc/200?img=60";

  return (
    <div className="flex min-h-[calc(100vh-77px)] bg-[#f5f5f5]">
      <div className="flex w-full h-[calc(100vh-77px)]">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="flex h-full shrink-0">
          {/* Wide menu panel */}
          <div className="w-60 bg-white border-r border-[#ddd] flex flex-col overflow-y-auto shrink-0">
            {/* Back button */}
            <div className="p-4 border-b border-[#eee] bg-[#f9f9f9]">
              <Link
                href="/student-profile"
                className="flex items-center gap-2 text-[#7C0A02] font-semibold text-[0.95rem] no-underline transition-all duration-250 hover:opacity-80"
              >
                <i className="fas fa-angle-left"></i> Back
              </Link>
            </div>

            {/* Menu items */}
            <ul className="list-none p-0 m-0 py-2">
              {wideMenuItems.map((item) => (
                <li
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={[
                    "border-l-[3px] transition-all duration-250 cursor-pointer",
                    activeMenu === item.id
                      ? "bg-[#f0f0f0] border-l-[#7C0A02]"
                      : "border-l-transparent hover:bg-[#f5f5f5] hover:border-l-[#7C0A02]",
                  ].join(" ")}
                >
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className={[
                      "flex items-center gap-3 px-4 py-3 text-[0.9rem] no-underline transition-all duration-250",
                      activeMenu === item.id
                        ? "text-[#7C0A02] font-bold"
                        : "text-[#555] hover:text-[#7C0A02] hover:font-semibold",
                    ].join(" ")}
                  >
                    <i className={`${item.icon} text-base w-5 text-center`}></i>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Results widget */}
            <div className="mt-auto p-4 border-t border-[#eee] bg-[#f9f9f9]">
              <div className="flex items-center gap-2 text-[#7C0A02] font-bold text-[0.85rem] mb-3 uppercase">
                <i className="fas fa-list-check"></i> Results
              </div>
              <div className="bg-white p-3 rounded-md border-l-[3px] border-l-[#7C0A02]">
                <div className="text-[0.7rem] text-[#888] font-bold uppercase mb-1">Overall GPA</div>
                <div className="text-[1.6rem] text-[#7C0A02] font-extrabold mb-1">3.50</div>
                <div className="text-[0.75rem] text-[#555] font-semibold mb-3">Second Class (Upper)</div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[0.75rem] text-[#666]">
                    <span className="font-semibold">Total Credits</span>
                    <span className="font-bold text-[#7C0A02]">35 / 120</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#e0e0e0] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#7C0A02] to-[#9b0d03] transition-all duration-300" style={{ width: "29.1%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Top toolbar */}
          <div className="bg-white px-6 py-4 border-b border-[#ddd] flex items-center justify-end gap-5">
            <button
              aria-label="Notifications"
              className="w-10 h-10 rounded-full bg-[#f5f5f5] border-none text-[#555] text-[1.1rem] cursor-pointer flex items-center justify-center transition-all duration-250 hover:bg-[#e0e0e0] hover:text-[#7C0A02]"
            >
              <i className="fas fa-bell"></i>
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#ddd] shrink-0">
              <img
                src={avatarSrc}
                alt="User Portrait"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = avatarFallback; }}
              />
            </div>
          </div>

          {/* Content body */}
          <div className="flex-1 p-8 overflow-y-auto">
            <h1 className="text-[1.6rem] text-[#222] mb-6 font-bold">Edit Profile Picture</h1>

            <div className="grid gap-6" style={{ gridTemplateColumns: "280px 1fr" }}>
              {/* Summary card */}
              <div className="bg-white rounded-lg p-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)] flex flex-col items-center text-center h-fit sticky top-4">
                {/* Avatar */}
                <div className="mb-4">
                  <div className="relative w-[140px] h-[140px] mx-auto">
                    <img
                      src={avatarSrc}
                      id="edit-profile-avatar-large"
                      alt="Student Profile Picture"
                      className="w-full h-full rounded-lg object-cover shadow-[0_4px_12px_rgba(124,10,2,0.2)]"
                      onError={(e) => { (e.target as HTMLImageElement).src = avatarFallback; }}
                    />
                    <label
                      htmlFor="edit-avatar-file-input"
                      title="Change Avatar"
                      className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#7C0A02] text-white flex items-center justify-center cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-all duration-250 hover:bg-[#5a0602] hover:scale-105"
                    >
                      <i className="fas fa-camera text-sm"></i>
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="edit-avatar-file-input"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>

                {/* Summary info */}
                <div className="w-full">
                  <h3 className="text-[1.1rem] text-[#222] mb-1 font-bold capitalize">
                    {firstName} {lastName}
                  </h3>
                  <p className="text-[0.85rem] text-[#888] mb-3">{email}</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e8f5e9] text-[#2e7d32] rounded-full text-[0.8rem] font-semibold mb-4">
                    <span className="w-1.5 h-1.5 bg-[#2e7d32] rounded-full animate-pulse"></span>
                    Active Student
                  </span>
                  <div className="flex flex-col gap-3 text-left mt-2">
                    <div className="flex items-start gap-2.5 text-[0.85rem] text-[#555]">
                      <i className="fas fa-id-card text-[#7C0A02] mt-0.5 shrink-0"></i>
                      <span><strong>Student ID:</strong> RJT/TEC/2023/048</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-[0.85rem] text-[#555]">
                      <i className="fas fa-graduation-cap text-[#7C0A02] mt-0.5 shrink-0"></i>
                      <span><strong>Faculty:</strong> Faculty of Technology</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-[0.85rem] text-[#555]">
                      <i className="fas fa-building-columns text-[#7C0A02] mt-0.5 shrink-0"></i>
                      <span><strong>Department:</strong> Information Technology</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form card */}
              <div className="bg-white rounded-lg p-7 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                <form
                  id="edit-profile-edit-form"
                  className="flex flex-col gap-5"
                  onSubmit={handleSave}
                >
                  {/* Row 1: First & Last Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormGroup label="First Name" htmlFor="edit-pf-first-name">
                      <input
                        type="text"
                        id="edit-pf-first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter first name"
                        required
                        className={inputCls}
                      />
                    </FormGroup>
                    <FormGroup label="Last Name" htmlFor="edit-pf-last-name">
                      <input
                        type="text"
                        id="edit-pf-last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter last name"
                        required
                        className={inputCls}
                      />
                    </FormGroup>
                  </div>

                  {/* Row 2: Email & Contact */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormGroup label="Email" htmlFor="edit-pf-email">
                      <div className="relative flex items-center">
                        <input
                          type="email"
                          id="edit-pf-email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter email address"
                          required
                          className={`${inputCls} pr-9 border-[#4caf50]`}
                        />
                        <span className="absolute right-3 text-[#4caf50] pointer-events-none">
                          <i className="fas fa-circle-check"></i>
                        </span>
                      </div>
                    </FormGroup>
                    <FormGroup label="Contact Number" htmlFor="edit-pf-contact">
                      <input
                        type="text"
                        id="edit-pf-contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Enter contact number"
                        required
                        className={inputCls}
                      />
                    </FormGroup>
                  </div>

                  {/* Row 3: Address & City */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormGroup label="Address" htmlFor="edit-pf-address">
                      <input
                        type="text"
                        id="edit-pf-address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter local address"
                        required
                        className={inputCls}
                      />
                    </FormGroup>
                    <FormGroup label="City" htmlFor="edit-pf-city">
                      <div className="relative">
                        <select
                          id="edit-pf-city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className={`${inputCls} appearance-none pr-9 cursor-pointer`}
                        >
                          <option value="Mihinthalaya">Mihinthalaya</option>
                          <option value="Anuradhapura">Anuradhapura</option>
                          <option value="Colombo">Colombo</option>
                          <option value="Kandy">Kandy</option>
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#888] text-[0.8rem]">
                          <i className="fas fa-chevron-down"></i>
                        </span>
                      </div>
                    </FormGroup>
                  </div>

                  {/* Row 4: State & Password */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormGroup label="State" htmlFor="edit-pf-state">
                      <div className="relative">
                        <select
                          id="edit-pf-state"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className={`${inputCls} appearance-none pr-9 cursor-pointer`}
                        >
                          <option value="rotaveva road">rotaveva road</option>
                          <option value="stage ii">Stage II</option>
                          <option value="western">Western Province</option>
                          <option value="central">Central Province</option>
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#888] text-[0.8rem]">
                          <i className="fas fa-chevron-down"></i>
                        </span>
                      </div>
                    </FormGroup>
                    <FormGroup label="Password" htmlFor="edit-pf-password">
                      <div className="relative flex items-center">
                        <input
                          type="password"
                          id="edit-pf-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                          required
                          className={`${inputCls} pr-9 border-[#4caf50]`}
                        />
                        <span className="absolute right-3 text-[#4caf50] pointer-events-none">
                          <i className="fas fa-circle-check"></i>
                        </span>
                      </div>
                    </FormGroup>
                  </div>

                  {/* Row 5: Confirm Password */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormGroup label="Confirm Password" htmlFor="edit-pf-confirm-password">
                      <div className="relative flex items-center">
                        <input
                          type="password"
                          id="edit-pf-confirm-password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm password"
                          required
                          className={`${inputCls} pr-9 border-[#4caf50]`}
                        />
                        <span className="absolute right-3 text-[#4caf50] pointer-events-none">
                          <i className="fas fa-circle-check"></i>
                        </span>
                      </div>
                    </FormGroup>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 justify-end pt-3 border-t border-[#eee] mt-3">
                    <button
                      type="button"
                      id="edit-pf-btn-cancel"
                      onClick={handleCancel}
                      className="px-6 py-[10px] bg-[#e0e0e0] text-[#333] rounded-md text-[0.9rem] font-semibold cursor-pointer transition-all duration-250 hover:bg-[#d0d0d0] border-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      id="edit-pf-btn-save"
                      className="px-6 py-[10px] bg-[#ff9500] text-white rounded-md text-[0.9rem] font-semibold cursor-pointer transition-all duration-250 hover:bg-[#e68900] border-none"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ── Shared input class ── */
const inputCls =
  "w-full px-3 py-[10px] border border-[#ddd] rounded-md font-[inherit] text-[0.9rem] text-[#333] transition-all duration-250 outline-none focus:border-[#7C0A02] focus:shadow-[0_0_0_3px_rgba(124,10,2,0.1)]";

/* ── FormGroup sub-component ── */
function FormGroup({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[0.9rem] text-[#333] font-semibold">
        {label}
      </label>
      {children}
    </div>
  );
}