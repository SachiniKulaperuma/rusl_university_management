"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const router = useRouter();

    // Step 1: email, Step 2: otp, Step 3: reset
    const [step, setStep] = useState<"email" | "otp" | "reset">("email");

    // State
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // OTP Timer
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes

    useEffect(() => {
        let timer: any;
        if (step === "otp" && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [step, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m} : ${s}`;
    };

    // --- Handlers ---

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            // Mock API call to send OTP
            const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok || data.success) {
                alert(`[TESTING ONLY] Your OTP is: ${data.otp}`);
                setStep("otp");
                setTimeLeft(120);
            } else {
                setError(data.error || "Email not found");
            }
        } catch (err) {
            setError("Failed to connect to server.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join("");
        if (code.length < 4) {
            setError("Please enter complete OTP.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            // Mock API call to verify OTP
            const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: code })
            });
            const data = await res.json();
            if (res.ok || data.success) {
                setStep("reset");
            } else {
                setError(data.error || "Invalid OTP.");
            }
        } catch (err) {
            setError("Failed to connect to server.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword })
            });
            const data = await res.json();
            if (res.ok || data.success) {
                alert("Password changed successfully!");
                router.push("/signin");
            } else {
                setError(data.error || "Failed to reset password.");
            }
        } catch (err) {
            setError("Failed to connect to server.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next
        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
            {/* Header */}
            <header className="bg-[#7C0A02] w-full py-4 px-6 flex items-center justify-center border-b-4 border-blue-500 shadow-md">
                <div className="flex items-center gap-4">
                    <img src="/logo.png" alt="Logo" className="h-16 w-16 object-contain drop-shadow-md" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    <div className="text-[#F1C40F] text-center font-serif leading-tight">
                        <div className="text-xl font-bold">ශ්‍රී ලංකා රජරට විශ්වවිද්‍යාලය</div>
                        <div className="text-md">இலங்கை ரஜரட்ட பல்கலைக்கழகம்</div>
                        <div className="text-xl font-bold">Rajarata University of Sri Lanka</div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="bg-[#EBE3DC] p-10 shadow-lg w-full max-w-[450px] flex flex-col items-center">

                    {step === "email" && (
                        <div className="w-full animate-in fade-in zoom-in-95 duration-300">
                            <div className="bg-[#8C8279] text-[#2d2a26] font-bold text-xl py-2 px-8 mb-8 inline-block mx-auto rounded-tl-xl rounded-br-xl rounded-tr-md rounded-bl-md relative left-1/2 -translate-x-1/2 text-center" style={{ clipPath: "polygon(5% 0, 100% 0%, 95% 100%, 0% 100%)" }}>
                                <span className="text-[#EBE3DC]">FORGOT PASSWORD</span>
                            </div>

                            <p className="text-sm text-[#7a4f4f] text-center mb-6 font-medium">
                                Please enter your registered email address to receive an OTP.
                            </p>

                            {error && <div className="text-red-600 text-sm font-bold text-center mb-4">{error}</div>}

                            <form onSubmit={handleSendOTP} className="flex flex-col gap-6">
                                <div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email Address"
                                        className="w-full bg-[#D8C7BC] border-none text-[#5c3a21] placeholder-[#8a6850] p-3 font-semibold focus:ring-2 focus:ring-[#7C0A02] outline-none"
                                    />
                                </div>
                                <div className="flex justify-center gap-6 mt-2">
                                    <button type="button" onClick={() => router.back()} className="bg-[#7C0A02] text-white font-bold py-2 px-8 shadow hover:bg-[#5a0602] transition-colors">
                                        Back
                                    </button>
                                    <button type="submit" disabled={loading} className="bg-[#7C0A02] text-white font-bold py-2 px-8 shadow hover:bg-[#5a0602] transition-colors disabled:opacity-70">
                                        {loading ? "Sending..." : "Send OTP"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {step === "otp" && (
                        <div className="w-full animate-in fade-in zoom-in-95 duration-300 text-center">
                            <div className="bg-[#8C8279] text-[#2d2a26] font-bold text-xl py-2 px-10 mb-6 inline-block mx-auto" style={{ clipPath: "polygon(5% 0, 100% 0%, 95% 100%, 0% 100%)" }}>
                                <span className="text-[#EBE3DC]">OTP VERIFICATION</span>
                            </div>

                            <p className="text-sm text-[#7a4f4f] mb-8 font-medium">
                                You&apos;ll receive a One Time Password to your email address.
                            </p>

                            {error && <div className="text-red-600 text-sm font-bold text-center mb-4">{error}</div>}

                            <form onSubmit={handleVerifyOTP}>
                                <div className="flex justify-center gap-4 mb-8">
                                    {otp.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            id={`otp-${idx}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                            className="w-14 h-14 bg-[#D8C7BC] text-center text-2xl font-bold text-[#5c3a21] border-none focus:ring-2 focus:ring-[#7C0A02] outline-none"
                                        />
                                    ))}
                                </div>

                                <div className="flex justify-center gap-8 mb-8">
                                    <button type="button" onClick={() => setStep("email")} className="bg-[#7C0A02] text-white font-bold py-2 w-28 shadow hover:bg-[#5a0602] transition-colors">
                                        Back
                                    </button>
                                    <button type="submit" disabled={loading} className="bg-[#7C0A02] text-white font-bold py-2 w-28 shadow hover:bg-[#5a0602] transition-colors disabled:opacity-70">
                                        {loading ? "..." : "Verify"}
                                    </button>
                                </div>
                            </form>

                            <div className="text-[#7a4f4f] text-sm font-bold">
                                OTP expires in <span className="text-[#e63946]">{formatTime(timeLeft)}</span> Minutes
                            </div>
                            <div className="text-[#7a4f4f] text-sm font-bold mt-2">
                                Didn&apos;t receive OTP? <button onClick={handleSendOTP} type="button" className="text-[#e63946] hover:underline cursor-pointer">Resend Now</button>
                            </div>
                        </div>
                    )}

                    {step === "reset" && (
                        <div className="w-full animate-in fade-in zoom-in-95 duration-300">
                            <div className="bg-[#8C8279] text-[#2d2a26] font-bold text-xl py-2 px-8 mb-8 inline-block mx-auto relative left-1/2 -translate-x-1/2 text-center" style={{ clipPath: "polygon(5% 0, 100% 0%, 95% 100%, 0% 100%)" }}>
                                <span className="text-[#EBE3DC]">RESET PASSWORD</span>
                            </div>

                            {error && <div className="text-red-600 text-sm font-bold text-center mb-4">{error}</div>}

                            <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
                                <div>
                                    <label className="block text-[#7a4f4f] text-sm font-bold mb-2">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-[#D8C7BC] border-none text-[#5c3a21] placeholder-[#8a6850] p-3 font-semibold focus:ring-2 focus:ring-[#7C0A02] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#7a4f4f] text-sm font-bold mb-2">Confirm Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-[#D8C7BC] border-none text-[#5c3a21] placeholder-[#8a6850] p-3 font-semibold focus:ring-2 focus:ring-[#7C0A02] outline-none"
                                    />
                                </div>
                                <div className="flex justify-center gap-6 mt-4">
                                    <button type="submit" disabled={loading} className="bg-[#7C0A02] text-white font-bold py-2 px-8 shadow hover:bg-[#5a0602] transition-colors disabled:opacity-70">
                                        {loading ? "Resetting..." : "Reset Password"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}