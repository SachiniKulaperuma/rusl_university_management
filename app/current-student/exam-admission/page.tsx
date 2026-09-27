/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function ExamAdmissionPage() {
    const [studentData, setStudentData] = useState<any>(null);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [repeatSubjects, setRepeatSubjects] = useState<any[]>([]);
    
    // Form state
    const [addingRepeat, setAddingRepeat] = useState(false);
    const [newRepeatCode, setNewRepeatCode] = useState("");
    const [newRepeatName, setNewRepeatName] = useState("");
    
    const [submitting, setSubmitting] = useState(false);
    
    // Application state
    const [applicationStatus, setApplicationStatus] = useState<string | null>(null);

    useEffect(() => {
        const studentStr = localStorage.getItem("student");
        let currentStudentId = "RJT/TEC/2023/001";
        const fetchStudentSubjects = async (id: string) => {
            try {
                const res = await fetch(`http://localhost:5000/api/registrations/student/${encodeURIComponent(id)}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Map backend data to frontend format
                    const formattedSubjects = data
                        .filter((sub: any) => sub.status === 'Approved')
                        .map((sub: any) => ({
                            id: sub.registration_id || Date.now(),
                            code: sub.subject_code,
                            name: sub.subject_name,
                            type: "Compulsory", // Backend doesn't have type currently, assume compulsory for now
                            credits: sub.credit_value || 0
                        }));
                    setSubjects(formattedSubjects);
                }
            } catch (err) {
                console.error("Failed to fetch registered subjects", err);
            }
        };

        if (studentStr) {
            const data = JSON.parse(studentStr);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStudentData(data);
            currentStudentId = data.student_id;
        }

        const existingAppsStr = localStorage.getItem("exam_applications");
        let hasApp = false;
        
        if (existingAppsStr) {
            const apps = JSON.parse(existingAppsStr);
            const myApp = apps.find((a: any) => a.studentId === currentStudentId);
            if (myApp) {
                hasApp = true;
                setApplicationStatus(myApp.status);
                if (myApp.repeatSubjects) {
                    setRepeatSubjects(myApp.repeatSubjects);
                }
                if (myApp.subjects) {
                    setSubjects(myApp.subjects);
                }
            }
        }
        
        if (!hasApp) {
            fetchStudentSubjects(currentStudentId);
        }
    }, []);

    const handleAddRepeat = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRepeatCode && newRepeatName) {
            setRepeatSubjects([...repeatSubjects, { 
                id: Date.now(), 
                code: newRepeatCode, 
                name: newRepeatName, 
                type: "Repeat", 
                credits: 2 
            }]);
            setNewRepeatCode("");
            setNewRepeatName("");
            setAddingRepeat(false);
        }
    };

    const removeRepeat = (id: number) => {
        setRepeatSubjects(repeatSubjects.filter(s => s.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        setTimeout(() => {
            const currentStudentId = studentData?.student_id || "RJT/TEC/2023/001";
            const appData = {
                id: `APP-${Date.now()}`,
                studentId: currentStudentId,
                name: studentData?.name_with_initials || studentData?.full_name || "Unknown",
                course: studentData?.course_of_study || "B.ICT",
                exam: "End Semester - Sem 1",
                date: new Date().toLocaleDateString(),
                status: "Pending",
                subjects: subjects,
                repeatSubjects: repeatSubjects
            };

            const existingAppsStr = localStorage.getItem("exam_applications");
            let apps = existingAppsStr ? JSON.parse(existingAppsStr) : [];
            
            // Remove old application if exists
            apps = apps.filter((a: any) => a.studentId !== currentStudentId);
            apps.push(appData);
            
            localStorage.setItem("exam_applications", JSON.stringify(apps));
            
            setSubmitting(false);
            setApplicationStatus("Pending");
        }, 1500);
    };

    if (applicationStatus) {
        return (
            <div className="min-h-[calc(100vh-77px)] flex flex-col items-center justify-center bg-[#f4f7fb] p-6">
                
                {/* Screen View */}
                <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-[0_8px_30px_rgba(0,0,0,0.08)] animate-in zoom-in-95 duration-500 print:hidden mb-6">
                    {applicationStatus === "Approved" ? (
                        <>
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="fas fa-check-circle text-4xl"></i>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Admission Approved!</h2>
                            <p className="text-slate-500 mb-8">
                                The exam department has validated your subjects. You can now download your digitally signed admission card.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button onClick={() => window.print()} className="w-full py-3 bg-[#7C0A02] text-white rounded-lg font-bold shadow-md hover:bg-[#5a0602] transition-colors flex items-center justify-center gap-2">
                                    <i className="fas fa-download"></i> Download Admission Card
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="fas fa-clock text-4xl"></i>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Application Pending</h2>
                            <p className="text-slate-500 mb-8">
                                Your application has been sent to the Exam Department for validation. Please check back later.
                            </p>
                        </>
                    )}
                    
                    <Link href="/current-student" className="inline-block w-full py-3 mt-4 bg-slate-100 text-slate-600 rounded-lg font-bold shadow-sm hover:bg-slate-200 transition-colors">
                        Return to Dashboard
                    </Link>
                </div>

                {/* Print Only View (Only visible when printing and Approved) */}
                {applicationStatus === "Approved" && (
                    <div className="hidden print:block w-full max-w-2xl bg-white p-8 border-2 border-black m-auto text-black">
                        <div className="text-center border-b-2 border-black pb-4 mb-6">
                            <h1 className="text-2xl font-black uppercase tracking-wider">Rajarata University of Sri Lanka</h1>
                            <h2 className="text-lg font-bold mt-1">Examination Admission Card</h2>
                            <p className="text-sm mt-1">End Semester Examinations - Semester 1</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                            <div>
                                <p><span className="font-bold">Name:</span> {studentData?.name_with_initials || studentData?.full_name}</p>
                                <p className="mt-2"><span className="font-bold">Student ID:</span> {studentData?.student_id || "RJT/TEC/2023/001"}</p>
                            </div>
                            <div className="text-right">
                                <p><span className="font-bold">Course:</span> {studentData?.course_of_study}</p>
                                <p className="mt-2"><span className="font-bold">Date Issued:</span> {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        <table className="w-full text-left border-collapse border border-black mb-12 text-sm">
                            <thead>
                                <tr className="border-b border-black bg-gray-100">
                                    <th className="p-2 border-r border-black font-bold">Code</th>
                                    <th className="p-2 border-r border-black font-bold">Subject Name</th>
                                    <th className="p-2 border-r border-black font-bold">Type</th>
                                    <th className="p-2 font-bold text-center">Invigilator Sign</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...subjects, ...repeatSubjects].map(sub => (
                                    <tr key={sub.id} className="border-b border-black">
                                        <td className="p-2 border-r border-black font-bold">{sub.code}</td>
                                        <td className="p-2 border-r border-black">{sub.name}</td>
                                        <td className="p-2 border-r border-black">{sub.type}</td>
                                        <td className="p-2 text-center text-gray-300">...........</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-between mt-16 pt-8 text-sm relative">
                            <div className="text-center">
                                <div className="border-t border-black w-40 pt-1">Student Signature</div>
                            </div>
                            
                            {/* Digital Signatures */}
                            <div className="text-center absolute left-1/2 -translate-x-1/2 -top-8">
                                <div className="font-[cursive] text-2xl text-blue-800 opacity-80 -rotate-6">D.H. Perera</div>
                                <div className="border-t border-black w-40 pt-1 mt-2">Head of Department (HOD)</div>
                                <div className="text-[10px] text-gray-500">Digitally Signed</div>
                            </div>

                            <div className="text-center relative -top-8">
                                <div className="font-[cursive] text-2xl text-blue-800 opacity-80 -rotate-3">A.R. Silva</div>
                                <div className="border-t border-black w-40 pt-1 mt-2">Asst. Registrar (AR)</div>
                                <div className="text-[10px] text-gray-500">Digitally Signed</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-77px)] bg-[#f4f7fb] py-10 px-4 antialiased">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Link href="/current-student" className="text-sm font-semibold text-[#64748b] hover:text-[#7C0A02] transition-colors flex items-center gap-2 mb-2">
                            <i className="fas fa-arrow-left"></i> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight">Exam Admission</h1>
                        <p className="text-[#64748b]">Apply for End Semester Examinations - Semester 1</p>
                    </div>
                    <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-bold border border-amber-200 shadow-sm flex items-center gap-2">
                        {/* eslint-disable-next-line react-hooks/purity */}
                        <i className="fas fa-bell animate-pulse"></i> Deadline: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                    <div className="p-6 md:p-8">
                        
                        <div className="mb-8">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Current Semester Subjects</h3>
                            <p className="text-sm text-slate-500 mb-4">These are the compulsory and optional subjects you registered for at the beginning of the semester.</p>
                            
                            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Code</th>
                                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Subject Name</th>
                                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {subjects.map(sub => (
                                            <tr key={sub.id} className="bg-white">
                                                <td className="px-6 py-4 font-bold text-slate-800">{sub.code}</td>
                                                <td className="px-6 py-4 font-medium text-slate-600">{sub.name}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${sub.type === 'Compulsory' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-purple-50 text-purple-600 border-purple-200'}`}>
                                                        {sub.type}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mb-8 pb-8 border-b border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Repeat Subjects</h3>
                                {!addingRepeat && (
                                    <button onClick={() => setAddingRepeat(true)} className="text-sm font-bold text-[#7C0A02] hover:underline flex items-center gap-1">
                                        <i className="fas fa-plus"></i> Add Repeat Subject
                                    </button>
                                )}
                            </div>
                            
                            {addingRepeat && (
                                <form onSubmit={handleAddRepeat} className="bg-red-50 p-4 rounded-xl border border-red-100 flex flex-col md:flex-row gap-4 items-end mb-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex-1 w-full">
                                        <label className="block text-xs font-bold text-red-900 mb-1">Subject Code</label>
                                        <input required value={newRepeatCode} onChange={e => setNewRepeatCode(e.target.value)} type="text" placeholder="e.g. ICT 1113" className="w-full px-3 py-2 rounded-lg border-red-200 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500" />
                                    </div>
                                    <div className="flex-[2] w-full">
                                        <label className="block text-xs font-bold text-red-900 mb-1">Subject Name</label>
                                        <input required value={newRepeatName} onChange={e => setNewRepeatName(e.target.value)} type="text" placeholder="e.g. IT Fundamentals" className="w-full px-3 py-2 rounded-lg border-red-200 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500" />
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <button type="button" onClick={() => setAddingRepeat(false)} className="px-4 py-2 bg-white text-slate-600 font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-[#7C0A02] text-white font-bold rounded-lg shadow-sm hover:bg-[#5a0602] transition-colors">Add</button>
                                    </div>
                                </form>
                            )}

                            {repeatSubjects.length === 0 ? (
                                <p className="text-sm text-slate-500 italic">No repeat subjects added.</p>
                            ) : (
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                    <ul className="divide-y divide-slate-200">
                                        {repeatSubjects.map(sub => (
                                            <li key={sub.id} className="p-4 flex justify-between items-center">
                                                <div>
                                                    <span className="font-bold text-slate-800 mr-3">{sub.code}</span>
                                                    <span className="text-slate-600">{sub.name}</span>
                                                </div>
                                                <button onClick={() => removeRepeat(sub.id)} className="text-red-500 hover:text-red-700 w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors">
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="flex items-start gap-3 mb-8">
                                <input required type="checkbox" id="declaration" className="mt-1 w-4 h-4 text-[#7C0A02] rounded border-slate-300 focus:ring-[#7C0A02]" />
                                <label htmlFor="declaration" className="text-sm text-slate-600 leading-relaxed cursor-pointer font-medium">
                                    I hereby declare that the selected subjects (including repeat subjects) are correct. I understand that this application will be verified by the Exam Department, and the Head of Department (HOD) and Assistant Registrar (AR) will issue the final admission card.
                                </label>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="px-8 py-3 bg-[#7C0A02] text-white rounded-lg font-bold shadow-lg shadow-red-900/20 hover:bg-[#5a0602] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center gap-2"
                                >
                                    {submitting ? (
                                        <><i className="fas fa-circle-notch fa-spin"></i> Sending to Exam Dept...</>
                                    ) : (
                                        <><i className="fas fa-paper-plane"></i> Send to Verification</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
