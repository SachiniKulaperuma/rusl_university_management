'use client';

import { useState } from 'react';
import Link from 'next/link';

const compulsorySubjects = [
    { code: 'ICT 3201', title: 'Rapid Application Development', credits: 3 },
    { code: 'ICT 3202', title: 'Advanced Database Management Systems', credits: 3 },
    { code: 'ICT 3203', title: 'Data Mining & Knowledge Analytics', credits: 2 },
];

const optionalSubjects = [
    { id: 'opt1', code: 'ICT 3305', title: 'Advanced Computer Networks Architecture', credits: 3 },
    { id: 'opt2', code: 'ICT 3206', title: 'Human-Computer Interaction Frameworks', credits: 2 },
];

const COMP_CREDITS = compulsorySubjects.reduce((s, c) => s + c.credits, 0);

const sidebarLinks = [
    { id: 'subjects', label: 'Subject Registration', href: '/signin/current-student/subject-registration', active: true, d: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z' },
    { id: 'exam', label: 'Exam Admission', href: '#', active: false, d: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' },
    { id: 'notices', label: 'Notices', href: '#', active: false, d: 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z' },
    { id: 'help', label: 'Help Center', href: '#', active: false, d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 11.9 12 12.5 12 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z' },
];

type View = 'selection' | 'pending' | 'confirmed';

function Tick({ color = 'white' }: { color?: string }) {
    return (
        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

export default function SubjectRegistrationPage() {
    const [view, setView] = useState<View>('selection');
    const [selected, setSelected] = useState<Record<string, boolean>>({});
    const [declared, setDeclared] = useState(false);

    const optCredits = optionalSubjects.filter(s => selected[s.id]).reduce((sum, s) => sum + s.credits, 0);
    const optCount = Object.values(selected).filter(Boolean).length;
    const totalCredits = COMP_CREDITS + optCredits;

    const toggle = (id: string) => setSelected(p => ({ ...p, [id]: !p[id] }));

    const tabLabels: { key: View; label: string }[] = [
        { key: 'selection', label: '1. Subject Selection' },
        { key: 'pending', label: '2. Processing State' },
        { key: 'confirmed', label: '3. Approval' },
    ];

    return (
        <div className="flex min-h-[calc(100vh-77px)] bg-slate-50">

            {/* SIDEBAR */}
            <aside className="w-60 shrink-0 hidden lg:flex flex-col bg-white border-r border-slate-200 p-5 gap-6">
                <div className="flex flex-col items-center gap-3 bg-slate-50 rounded-xl border border-slate-200 p-4 text-center">
                    <div className="w-14 h-14 rounded-full bg-rose-50 border-2 border-rose-100 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-9 h-9 fill-[#7A0016]">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800">W. M. K. S. Bandara</p>
                        <p className="text-xs text-slate-500">ICT/2021/2022/048</p>
                    </div>
                    <span className="text-xs font-bold text-[#7A0016] border border-[#7A0016] bg-rose-50 rounded-full px-3 py-0.5">Active Student</span>
                </div>

                <nav className="flex flex-col gap-1">
                    {sidebarLinks.map(link => (
                        <Link key={link.id} href={link.href}
                            className={['flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                                link.active ? 'bg-[#7A0016] text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-[#7A0016]',
                            ].join(' ')}>
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0"><path d={link.d} /></svg>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-[#7A0016] transition-all">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" /></svg>
                        Log Out
                    </button>
                </div>
            </aside>

            {/* CONTENT */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Tab bar */}
                <div className="bg-white border-b border-slate-200 px-6 py-3 flex gap-2 flex-wrap">
                    {tabLabels.map(t => (
                        <button key={t.key} onClick={() => setView(t.key)}
                            className={['px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200',
                                view === t.key ? 'bg-[#7A0016] text-white border-[#7A0016]' : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-[#7A0016] hover:border-[#7A0016]',
                            ].join(' ')}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ── VIEW 1: SELECTION ── */}
                {view === 'selection' && (
                    <main className="flex-1 p-6 lg:p-8 flex flex-col gap-6">
                        <div>
                            <h1 className="text-2xl font-extrabold text-[#7A0016]">Subject Registration</h1>
                            <p className="text-sm text-slate-500 mt-1">Select your optional courses for the active academic semester.</p>
                        </div>

                        {/* Info ribbon */}
                        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex flex-wrap gap-6 items-center shadow-sm">
                            {[
                                { label: 'Academic Year', value: '2025/2026' },
                                { label: 'Semester', value: 'Year 3 Semester II' },
                                { label: 'Period', value: '01 Jul – 14 Jul 2025' },
                            ].map(i => (
                                <div key={i.label} className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{i.label}</span>
                                    <span className="text-sm font-bold text-slate-800">{i.value}</span>
                                </div>
                            ))}
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Status</span>
                                <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5">Registration Open</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Days Left</span>
                                <span className="text-sm font-bold text-orange-600">7 Days</span>
                            </div>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr] items-start">
                            <div className="flex flex-col gap-6">

                                {/* Compulsory table */}
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                        <span className="text-sm font-bold text-slate-800">Compulsory Course Units</span>
                                        <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-0.5">Auto-Selected</span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-100">
                                                    {['Select', 'Code', 'Course Title', 'Credits', 'Status'].map((h, i) => (
                                                        <th key={h} className={['px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide', i === 0 || i === 3 ? 'text-center' : ''].join(' ')}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {compulsorySubjects.map(s => (
                                                    <tr key={s.code} className="hover:bg-slate-50/60">
                                                        <td className="px-4 py-4 text-center">
                                                            <div className="inline-flex items-center justify-center w-5 h-5 rounded bg-green-100 border border-green-300 text-green-600"><Tick color="#16a34a" /></div>
                                                        </td>
                                                        <td className="px-4 py-4 text-sm font-bold text-[#7A0016]">{s.code}</td>
                                                        <td className="px-4 py-4 text-sm text-slate-700">{s.title}</td>
                                                        <td className="px-4 py-4 text-sm font-semibold text-slate-700 text-center">{s.credits}</td>
                                                        <td className="px-4 py-4"><span className="text-xs font-bold text-green-700 bg-green-50 rounded px-2 py-0.5">Compulsory</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="px-6 py-3 bg-green-50 border-t border-slate-100 text-xs font-semibold text-green-700">
                                        All compulsory subjects are automatically selected.
                                    </div>
                                </div>

                                {/* Optional table */}
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                        <span className="text-sm font-bold text-slate-800">Optional Course Units</span>
                                        <span className="text-xs font-medium text-slate-400">{optCount} selected</span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-100">
                                                    {['Select', 'Code', 'Course Title', 'Credits', 'Status'].map((h, i) => (
                                                        <th key={h} className={['px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide', i === 0 || i === 3 ? 'text-center' : ''].join(' ')}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {optionalSubjects.map(s => (
                                                    <tr key={s.id} className="hover:bg-slate-50/60 cursor-pointer" onClick={() => toggle(s.id)}>
                                                        <td className="px-4 py-4 text-center">
                                                            <span className={['inline-flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200',
                                                                selected[s.id] ? 'bg-[#7A0016] border-[#7A0016]' : 'bg-white border-slate-300 hover:border-[#7A0016]',
                                                            ].join(' ')}>
                                                                {selected[s.id] && <Tick />}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-sm font-bold text-[#7A0016]">{s.code}</td>
                                                        <td className="px-4 py-4 text-sm text-slate-700">{s.title}</td>
                                                        <td className="px-4 py-4 text-sm font-semibold text-slate-700 text-center">{s.credits}</td>
                                                        <td className="px-4 py-4 text-sm">
                                                            <span className={selected[s.id] ? 'font-bold text-[#7A0016]' : 'text-slate-400'}>
                                                                {selected[s.id] ? 'Selected' : 'Optional'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="px-6 py-3 bg-blue-50 border-t border-slate-100 text-xs font-semibold text-blue-600">
                                        Click a row to select or deselect optional subjects.
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT PANEL */}
                            <div className="flex flex-col gap-5 lg:sticky lg:top-6">

                                {/* Summary */}
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
                                    <h2 className="text-sm font-bold text-[#7A0016]">Registration Summary</h2>
                                    <div className="flex flex-col gap-2 text-sm">
                                        <div className="flex justify-between py-2 border-b border-dashed border-slate-100">
                                            <span className="text-slate-500">Compulsory ({compulsorySubjects.length})</span>
                                            <span className="font-bold text-slate-800">{COMP_CREDITS} Credits</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-dashed border-slate-100">
                                            <span className="text-slate-500">Optional ({optCount})</span>
                                            <span className="font-bold text-orange-500">{optCredits} Credits</span>
                                        </div>
                                        <div className="flex justify-between pt-3 font-bold text-base text-slate-800">
                                            <span>Total Credits</span>
                                            <span className="text-[#7A0016]">{totalCredits} / 15 Max</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-xs font-semibold text-green-700">
                                        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Registration requirements satisfied.
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                                    <h3 className="text-sm font-bold text-orange-500 mb-3">Important Notes</h3>
                                    <ul className="flex flex-col gap-2">
                                        {['Registration can only be submitted once.', 'Drop/add optional subjects before the deadline.', 'Minimum credit requirements must be met.', 'Late registrations will not be accepted.'].map(n => (
                                            <li key={n} className="flex items-start gap-2 text-xs text-slate-500 leading-snug">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-1.5" />
                                                {n}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Declaration + Submit */}
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
                                    <h3 className="text-sm font-bold text-slate-800">Declaration</h3>
                                    <label className="flex items-start gap-3 cursor-pointer group" onClick={() => setDeclared(v => !v)}>
                                        <span className={['mt-0.5 shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200',
                                            declared ? 'bg-[#7A0016] border-[#7A0016]' : 'bg-white border-slate-300 group-hover:border-[#7A0016]',
                                        ].join(' ')}>
                                            {declared && <Tick />}
                                        </span>
                                        <span className="text-xs text-slate-500 leading-snug">
                                            I confirm that the above information is correct and I agree to register for the selected course units.
                                        </span>
                                    </label>
                                    <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-3 leading-snug">
                                        By submitting, you acknowledge the registration guidelines.
                                    </p>
                                    <button
                                        disabled={!declared}
                                        onClick={() => { if (declared) setView('pending'); }}
                                        className={['w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200',
                                            declared ? 'bg-[#7A0016] text-white hover:bg-[#5c0010] hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' : 'bg-[#7A0016]/40 text-white cursor-not-allowed',
                                        ].join(' ')}>
                                        Submit Registration
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                )}

                {/* ── VIEW 2: PENDING ── */}
                {view === 'pending' && (
                    <main className="flex-1 p-6 lg:p-8 max-w-4xl mx-auto w-full">
                        <div className="flex flex-col items-center gap-4 text-center my-8">
                            <div className="w-20 h-20 rounded-full bg-green-500 border-8 border-green-200 flex items-center justify-center text-white text-3xl font-bold">✓</div>
                            <h2 className="text-2xl font-extrabold text-[#7A0016]">Submission Successfully Transmitted</h2>
                            <p className="text-slate-500 max-w-md text-sm">Your course selection has been uploaded to the university server for internal validation.</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 bg-white border border-slate-200 rounded-xl shadow-sm mb-6 divide-x divide-slate-200">
                            {[
                                { label: 'Academic Year', value: '2025/2026' },
                                { label: 'Current Term', value: 'Year 3 Sem. II' },
                                { label: 'Submission Date', value: '13-07-2026' },
                                { label: 'Status', value: 'Pending Review', cls: 'text-orange-500' },
                                { label: 'Receipt Code', value: '#RUSL-83921', cls: 'font-mono' },
                            ].map((item, i) => (
                                <div key={i} className="p-5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">{item.label}</p>
                                    <p className={['text-sm font-bold text-slate-800', item.cls ?? ''].join(' ')}>{item.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
                            <h4 className="text-base font-bold text-slate-800 mb-2">Need to alter your selections?</h4>
                            <p className="text-sm text-slate-500 mb-6">Modifications remain available until the registration deadline.</p>
                            <button onClick={() => setView('selection')}
                                className="px-8 py-3 border border-[#7A0016] text-[#7A0016] font-bold rounded-xl hover:bg-rose-50 transition-all duration-200">
                                Re-open Registration
                            </button>
                        </div>
                    </main>
                )}

                {/* ── VIEW 3: CONFIRMED ── */}
                {view === 'confirmed' && (
                    <main className="flex-1 p-6 lg:p-8 max-w-5xl mx-auto w-full">
                        <div className="flex flex-col items-center gap-4 text-center my-8">
                            <div className="w-20 h-20 rounded-full bg-green-500 border-8 border-green-200 flex items-center justify-center text-white text-3xl font-bold">✓</div>
                            <h2 className="text-2xl font-extrabold text-[#7A0016]">Enrollment Verification Complete</h2>
                            <p className="text-slate-500 max-w-xl text-sm">The Faculty Dean has formally certified your module allocations for this semester.</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 bg-white border border-slate-200 rounded-xl shadow-sm mb-6 divide-x divide-slate-200">
                            {[
                                { label: 'Type', value: 'Regular Student' },
                                { label: 'Group', value: 'ICT-A Batch' },
                                { label: 'Subjects', value: '5 Modules' },
                                { label: 'Total Credits', value: '13 Credits', cls: 'text-green-700' },
                                { label: 'Authorization', value: 'Approved by Dean', cls: 'text-green-700 uppercase' },
                            ].map((item, i) => (
                                <div key={i} className="p-5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">{item.label}</p>
                                    <p className={['text-sm font-bold text-slate-800', item.cls ?? ''].join(' ')}>{item.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
                            <div className="bg-green-50 px-6 py-4 border-b border-green-200">
                                <h3 className="font-bold text-green-800">Official Active Semester Schedule</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            {['Module ID', 'Course Title', 'Credits', 'Assessment'].map((h, i) => (
                                                <th key={h} className={['px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide', i === 2 ? 'text-center' : ''].join(' ')}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {[
                                            { code: 'ICT 3201', title: 'Rapid Application Development', credits: 3, assessment: 'Exam + Project Portfolio' },
                                            { code: 'ICT 3202', title: 'Advanced Database Management Systems', credits: 3, assessment: 'Written Exam' },
                                            { code: 'ICT 3203', title: 'Data Mining & Knowledge Analytics', credits: 2, assessment: 'Continuous Assessment' },
                                            { code: 'ICT 3305', title: 'Advanced Computer Networks Architecture', credits: 3, assessment: 'Lab Practicals + Exam' },
                                            { code: 'ICT 3206', title: 'Human-Computer Interaction Frameworks', credits: 2, assessment: 'Interface Presentation' },
                                        ].map(s => (
                                            <tr key={s.code} className="hover:bg-slate-50/60">
                                                <td className="px-4 py-4 text-sm font-bold text-[#7A0016]">{s.code}</td>
                                                <td className="px-4 py-4 text-sm text-slate-700">{s.title}</td>
                                                <td className="px-4 py-4 text-sm font-semibold text-slate-700 text-center">{s.credits}</td>
                                                <td className="px-4 py-4 text-sm text-slate-500">{s.assessment}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-[#7A0016] to-[#4a000d] text-white rounded-2xl p-8 flex items-center justify-between gap-6">
                            <div>
                                <h3 className="text-lg font-bold mb-1">Need Administrative Support?</h3>
                                <p className="text-sm opacity-80">Contact the department counselor if there are discrepancies in your schedule.</p>
                            </div>
                            <button className="shrink-0 px-6 py-3 bg-[#FFC72C] text-[#7A0016] font-bold rounded-xl hover:opacity-90 transition-all">
                                Contact Support
                            </button>
                        </div>
                    </main>
                )}
            </div>
        </div>
    );
}