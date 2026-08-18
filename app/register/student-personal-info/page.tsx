"use client";

import React, { useState, useEffect } from 'react';

export default function StudentRegistration() {
	// --- State Variables ---
	const [showToast, setShowToast] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// --- Form Controlled Inputs for Declaration Sync ---
	const [fullName, setFullName] = useState('');
	const [guardianName, setGuardianName] = useState('');

	// --- Date Initialization for Declaration ---
	const now = new Date();
	const months = [
		'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
		'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
	];
	const [signDay, setSignDay] = useState(now.getDate().toString());
	const [signMonth, setSignMonth] = useState(months[now.getMonth()]);
	const [signYear, setSignYear] = useState(now.getFullYear().toString());

	const handleClear = () => {
		if (window.confirm('Are you sure you want to clear all fields?')) {
			const form = document.getElementById('reg-form') as HTMLFormElement;
			if (form) form.reset();
			setFullName('');
			setGuardianName('');
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		setTimeout(() => {
			setIsSubmitting(false);
			setShowToast(true);
			setTimeout(() => setShowToast(false), 4000);
		}, 1500);
	};

	const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md font-sans text-sm text-gray-800 bg-[#faf9f7] outline-none transition-all focus:border-[#7C0A02] focus:ring-3 focus:ring-[#7C0A02]/10 focus:bg-white";
	const labelClass = "text-xs font-semibold text-gray-700 flex items-center";

	return (
		<div className="min-h-screen bg-[#f0ebe3] font-sans text-gray-900 antialiased py-6 md:py-12 px-4">

			{/* Centered Form Wrapper Container */}
			<div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">

				{/* Card Title Header */}
				<div className="bg-[#7C0A02] text-white px-6 py-4 flex items-center gap-2.5">
					<i className="fas fa-file-pen text-base"></i>
					<h2 className="text-sm md:text-base font-bold tracking-wide">Student Personal Information</h2>
				</div>

				{/* Informational Alert Banner */}
				<div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 text-xs text-amber-800 flex items-center gap-2 font-medium">
					<i className="fas fa-circle-info text-amber-600"></i>
					Note: Use English block capital letters to fill this application.
				</div>

				<form id="reg-form" onSubmit={handleSubmit} className="p-6 space-y-6">

					{/* ─── Section 1: Basic Information ─── */}
					<div>
						<div className="text-xs font-extrabold text-[#7C0A02] tracking-wider uppercase border-b-2 border-[#7C0A02] pb-1.5 mb-4 flex items-center gap-2">
							<i className="fas fa-circle-dot text-[10px]"></i> Basic Information
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="reg-no"><span className="font-bold text-[#7C0A02] mr-1">1.</span> Registration No</label>
								<input type="text" id="reg-no" className={inputClass} placeholder="e.g. 2026/ICT/001" />
							</div>
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="nic-no"><span className="font-bold text-[#7C0A02] mr-1">2.</span> National Identity Card or Passport No</label>
								<input type="text" id="nic-no" className={inputClass} placeholder="e.g. 200012345678" required />
							</div>
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="al-index"><span className="font-bold text-[#7C0A02] mr-1">3.</span> Index No of G.C.E. (A/L) Examination &amp; Year</label>
								<input type="text" id="al-index" className={inputClass} placeholder="e.g. 1234567 / 2024" required />
							</div>
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="course"><span className="font-bold text-[#7C0A02] mr-1">4.</span> Selected Course of Study</label>
								<select id="course" className={`${inputClass} cursor-pointer`} required>
									<option value="">-- Select Course --</option>
									<option>B.Sc. in Information &amp; Communication Technology</option>
									<option>B.Sc. in Agricultural Technology &amp; Management</option>
									<option>B.Sc. in Agriculture</option>
									<option>B.Sc. in Food Science &amp; Technology</option>
									<option>B.Sc. in Nursing</option>
									<option>B.A. in Social Sciences</option>
									<option>B.A. in Management</option>
									<option>LLB (Bachelor of Laws)</option>
									<option>MBBS</option>
									<option>B.Sc. in Engineering Technology</option>
								</select>
							</div>
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="name-initials"><span className="font-bold text-[#7C0A02] mr-1">5. I.</span> Name with Initials</label>
								<input type="text" id="name-initials" className={inputClass} placeholder="e.g. S. K. PERERA" required />
							</div>
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="full-name"><span className="font-bold text-[#7C0A02] mr-1">5. II.</span> Full Name</label>
								<input
									type="text"
									id="full-name"
									className={inputClass}
									placeholder="e.g. SACHINI KULAPERUMA PERERA"
									value={fullName}
									onChange={(e) => setFullName(e.target.value.toUpperCase())}
									required
								/>
							</div>
						</div>
					</div>

					{/* ─── Section 2: Contact Details ─── */}
					<div>
						<div className="text-xs font-extrabold text-[#7C0A02] tracking-wider uppercase border-b-2 border-[#7C0A02] pb-1.5 mb-4 flex items-center gap-2">
							<i className="fas fa-address-book text-[10px]"></i> Contact Details
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="tel-no"><span className="font-bold text-[#7C0A02] mr-1">6. I.</span> Telephone No</label>
								<input type="tel" id="tel-no" className={inputClass} placeholder="e.g. 0712345678" required />
							</div>
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="email-addr"><span className="font-bold text-[#7C0A02] mr-1">6. II.</span> E-mail</label>
								<input type="email" id="email-addr" className={inputClass} placeholder="e.g. student@rjt.ac.lk" required />
							</div>
						</div>
						<div className="space-y-4">
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="perm-addr"><span className="font-bold text-[#7C0A02] mr-1">6. III.</span> Permanent Address</label>
								<textarea id="perm-addr" className={`${inputClass} resize-vertical min-h-[70px]`} placeholder="House No, Street, City" rows={2} required></textarea>
							</div>
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="contact-addr"><span className="font-bold text-[#7C0A02] mr-1">6. IV.</span> Contact Address (If different from permanent address)</label>
								<textarea id="contact-addr" className={`${inputClass} resize-vertical min-h-[70px]`} placeholder="Leave blank if same as permanent address" rows={2}></textarea>
							</div>
						</div>
					</div>

					{/* ─── Section 3: Personal Details ─── */}
					<div>
						<div className="text-xs font-extrabold text-[#7C0A02] tracking-wider uppercase border-b-2 border-[#7C0A02] pb-1.5 mb-4 flex items-center gap-2">
							<i className="fas fa-person text-[10px]"></i> Personal Details
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="grama"><span className="font-bold text-[#7C0A02] mr-1">7.</span> Grama Niladhari Division</label>
								<input type="text" id="grama" className={inputClass} placeholder="Division name" />
							</div>
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="district"><span className="font-bold text-[#7C0A02] mr-1">8.</span> District</label>
								<select id="district" className={`${inputClass} cursor-pointer`} required>
									<option value="">-- Select District --</option>
									{['Anuradhapura', 'Ampara', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Moneragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'].map(d => (
										<option key={d}>{d}</option>
									))}
								</select>
							</div>
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="race"><span className="font-bold text-[#7C0A02] mr-1">9.</span> Race</label>
								<select id="race" className={`${inputClass} cursor-pointer`}>
									<option value="">-- Select --</option>
									<option>Sinhalese</option><option>Tamil</option><option>Muslim</option>
									<option>Burgher</option><option>Malay</option><option>Other</option>
								</select>
							</div>
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="religion"><span className="font-bold text-[#7C0A02] mr-1">10.</span> Religion</label>
								<select id="religion" className={`${inputClass} cursor-pointer`}>
									<option value="">-- Select --</option>
									<option>Buddhism</option><option>Hinduism</option><option>Islam</option>
									<option>Christianity</option><option>Other</option>
								</select>
							</div>
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="gender"><span className="font-bold text-[#7C0A02] mr-1">11.</span> Gender</label>
								<select id="gender" className={`${inputClass} cursor-pointer`} required>
									<option value="">-- Select --</option>
									<option>Male</option><option>Female</option><option>Other</option>
								</select>
							</div>
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="civil-status"><span className="font-bold text-[#7C0A02] mr-1">12.</span> Civil Status</label>
								<select id="civil-status" className={`${inputClass} cursor-pointer`}>
									<option value="">-- Select --</option>
									<option>Single</option><option>Married</option><option>Widowed</option><option>Divorced</option>
								</select>
							</div>
							<div className="flex flex-col gap-1.5 md:col-span-2">
								<label className={labelClass} htmlFor="citizenship"><span className="font-bold text-[#7C0A02] mr-1">13.</span> Citizenship (By Descent / By Registration)</label>
								<select id="citizenship" className={`${inputClass} cursor-pointer`}>
									<option value="">-- Select --</option>
									<option>By Descent</option><option>By Registration</option>
								</select>
							</div>
						</div>
					</div>

					{/* ─── Section 4: Guardian Details ─── */}
					<div>
						<div className="text-xs font-extrabold text-[#7C0A02] tracking-wider uppercase border-b-2 border-[#7C0A02] pb-1.5 mb-4 flex items-center gap-2">
							<i className="fas fa-users text-[10px]"></i> Guardian Details
						</div>

						<div className="space-y-4">
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="guardian-name"><span className="font-bold text-[#7C0A02] mr-1">14.</span> Full Name of Guardian</label>
								<input
									type="text"
									id="guardian-name"
									className={inputClass}
									placeholder="Full name of parent/guardian"
									value={guardianName}
									onChange={(e) => setGuardianName(e.target.value.toUpperCase())}
									required
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="guardian-occ"><span className="font-bold text-[#7C0A02] mr-1">15. I.</span> Occupation</label>
								<input type="text" id="guardian-occ" className={inputClass} placeholder="e.g. Teacher, Farmer, Government Servant" />
							</div>
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="guardian-work"><span className="font-bold text-[#7C0A02] mr-1">15. II.</span> Address of Place of Work</label>
								<textarea id="guardian-work" className={`${inputClass} resize-vertical min-h-[70px]`} placeholder="Work address" rows={2}></textarea>
							</div>
							<div className="flex flex-col gap-1.5 max-w-sm">
								<label className={labelClass} htmlFor="guardian-tel"><span className="font-bold text-[#7C0A02] mr-1">15. III.</span> Guardian Telephone Number</label>
								<input type="tel" id="guardian-tel" className={inputClass} placeholder="e.g. 0712345678" />
							</div>
						</div>
					</div>

					{/* ─── Section 5: Emergency Contact ─── */}
					<div>
						<div className="text-xs font-extrabold text-[#7C0A02] tracking-wider uppercase border-b-2 border-[#7C0A02] pb-1.5 mb-1 flex items-center gap-2">
							<i className="fas fa-phone-volume text-[10px]"></i> Emergency Contact
						</div>
						<p className="text-xs text-gray-500 mb-4">Name and Telephone Number of the person to be informed in case of an Emergency</p>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="emg-name"><span className="font-bold text-[#7C0A02] mr-1">16. I.</span> Name</label>
								<input type="text" id="emg-name" className={inputClass} placeholder="Emergency contact name" required />
							</div>
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="emg-tel"><span className="font-bold text-[#7C0A02] mr-1">16. II.</span> Telephone</label>
								<input type="tel" id="emg-tel" className={inputClass} placeholder="e.g. 0712345678" required />
							</div>
						</div>
					</div>

					{/* ─── Section 6: Declaration of Student ─── */}
					<div>
						<div className="text-xs font-extrabold text-[#7C0A02] tracking-wider uppercase border-b-2 border-[#7C0A02] pb-1.5 mb-4 flex items-center gap-2">
							<i className="fas fa-file-signature text-[10px]"></i> Declaration of the Student / Applicant
						</div>

						<div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-xs text-gray-700 leading-relaxed space-y-3.5">
							<p>
								<strong>1.</strong> I,
								<span className="inline-block px-2 font-semibold text-gray-900 border-b border-gray-600 min-w-[200px] mx-1 text-center bg-gray-100/50">
									{fullName || "_______________________"}
								</span>
								have read and understood the law prohibiting ragging referred in the <strong>Prohibition of Ragging and Other Forms of Violence in Educational Institutions Act, No. 20 of 1998</strong>.
							</p>
							<p><strong>2.</strong> I hereby undertake that;</p>
							<p className="pl-5"><strong>2.1</strong> I will not indulge in any behavior or act that may come under the definition of ragging.</p>
							<p className="pl-5"><strong>2.2</strong> I will not participate in or abet or propagate ragging in any form.</p>
							<p className="pl-5"><strong>2.3</strong> I will not hurt anyone physically or psychologically or cause any other harm.</p>
							<p><strong>3.</strong> I hereby agree that if I am found guilty of any form of ragging, I may be punished as per the law enforced and by-laws of the University.</p>
							<p><strong>4.</strong> I do hereby affirm that, during the period of my stay in the university, I will not engage in or encourage any form of anti-social behavior including ragging (torture) and that I will pay due respect to the teachers and officials and that I will not engage in any act that will harm the goodwill of the university.</p>
							<p>I am fully aware that I am liable for suspension from the university and for any other disciplinary action if I am unable to abide by the by-laws of this act.</p>

							<div className="flex flex-wrap gap-4 pt-3">
								<div className="flex flex-col w-20">
									<label className="text-[10px] font-medium text-gray-500 mb-0.5">Signed Day</label>
									<input type="number" value={signDay} onChange={(e) => setSignDay(e.target.value)} className="px-2 py-1 border border-gray-300 rounded text-center bg-white" placeholder="DD" min={1} max={31} />
								</div>
								<div className="flex flex-col w-32">
									<label className="text-[10px] font-medium text-gray-500 mb-0.5">Month</label>
									<input type="text" value={signMonth} onChange={(e) => setSignMonth(e.target.value)} className="px-2 py-1 border border-gray-300 rounded text-center bg-white" placeholder="JULY" />
								</div>
								<div className="flex flex-col w-24">
									<label className="text-[10px] font-medium text-gray-500 mb-0.5">Year</label>
									<input type="number" value={signYear} onChange={(e) => setSignYear(e.target.value)} className="px-2 py-1 border border-gray-300 rounded text-center bg-white" placeholder="2026" min={2000} max={2099} />
								</div>
							</div>

							<div className="flex flex-wrap gap-8 pt-4 items-end">
								<div className="flex flex-col w-60">
									<div className="border-b border-gray-500 h-10 w-full bg-[#faf9f7] rounded-t"></div>
									<div className="text-[10px] text-gray-500 text-center mt-1 font-medium">Signature of the Student / Applicant</div>
								</div>
							</div>
						</div>
					</div>

					{/* ─── Section 7: Guardian Undertaking ─── */}
					<div>
						<div className="text-xs font-extrabold text-[#7C0A02] tracking-wider uppercase border-b-2 border-[#7C0A02] pb-1.5 mb-4 flex items-center gap-2">
							<i className="fas fa-handshake text-[10px]"></i> Undertaking by the Parent / Guardian
						</div>

						<div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-xs text-gray-700 leading-relaxed space-y-4">
							<p>
								<strong>I.</strong> I,
								<span className="inline-block px-2 font-semibold text-gray-900 border-b border-gray-600 min-w-[200px] mx-1 text-center bg-gray-100/50">
									{guardianName || "_______________________"}
								</span>
								have carefully read and fully understood the law prohibiting ragging in the <strong>Prohibition of Ragging and Other Forms of Violence in Educational Institutions Act, No. 20 of 1998</strong>.
							</p>
							<p><strong>II.</strong> I assure you that my son / daughter / ward will not indulge in any form of ragging.</p>
							<p><strong>III.</strong> I hereby agree that if he / she is found guilty of any form of ragging he / she may be punished as per the law enforced and by-laws of the University.</p>

							<div className="flex flex-wrap gap-8 pt-2 items-end">
								<div className="flex flex-col w-60">
									<div className="border-b border-gray-500 h-10 w-full bg-[#faf9f7] rounded-t"></div>
									<div className="text-[10px] text-gray-500 text-center mt-1 font-medium">Signature of Mother / Father / Guardian</div>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
								<div className="flex flex-col gap-1.5">
									<label className={labelClass}>Name</label>
									<input type="text" className={inputClass} placeholder="Guardian's full name" />
								</div>
								<div className="flex flex-col gap-1.5">
									<label className={labelClass}>Relationship to the Student</label>
									<select className={`${inputClass} cursor-pointer`}>
										<option value="">-- Select --</option>
										<option>Mother</option><option>Father</option><option>Guardian</option>
										<option>Sibling</option><option>Other</option>
									</select>
								</div>
								<div className="flex flex-col gap-1.5 md:col-span-2">
									<label className={labelClass}>Address</label>
									<textarea className={`${inputClass} resize-vertical min-h-[70px]`} rows={2} placeholder="Guardian's permanent address"></textarea>
								</div>
							</div>
						</div>
					</div>

					{/* ─── Action Buttons ─── */}
					<div className="flex justify-end gap-3 pt-4 border-t border-gray-100 flex-wrap">
						<button
							type="button"
							onClick={handleClear}
							className="px-6 py-2 bg-white border border-gray-300 rounded-lg font-sans text-sm font-semibold text-gray-600 cursor-pointer transition-colors hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 flex items-center gap-1.5"
						>
							<i className="fas fa-rotate-left"></i> Clear
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="px-7 py-2 bg-[#7C0A02] rounded-lg font-sans text-sm font-bold text-white cursor-pointer transition-all hover:bg-[#5a0602] disabled:opacity-70 flex items-center gap-1.5"
						>
							{isSubmitting ? (
								<>
									<i className="fas fa-spinner fa-spin"></i> Submitting...
								</>
							) : (
								<>
									<i className="fas fa-paper-plane"></i> Submit Application
								</>
							)}
						</button>
					</div>
				</form>
			</div>

			{/* Toast Alert */}
			<div className={`fixed bottom-7 right-7 bg-green-700 text-white px-5 py-3.5 rounded-lg text-sm font-semibold shadow-xl z-50 transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
				}`}>
				<i className="fas fa-circle-check mr-1"></i> Application submitted successfully!
			</div>
		</div>
	);
}