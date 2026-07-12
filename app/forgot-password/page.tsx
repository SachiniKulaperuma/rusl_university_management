"use client"

import { useState } from "react"

function IconEye({ className }: { className?: string }) {
    return (
        <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="#6b6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="#6b6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

function IconEyeOff({ className }: { className?: string }) {
    return (
        <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M2 2l20 20" stroke="#6b6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6 0-10-7-10-7a19.4 19.4 0 0 1 5.06-5.94" stroke="#6b6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.88 9.88A3 3 0 0 0 14.12 14.12" stroke="#6b6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export default function ForgotPasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [show1, setShow1] = useState(false)
    const [show2, setShow2] = useState(false)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        // replace with real submit logic
        if (password !== confirmPassword) {
            alert("Passwords do not match")
            return
        }
        alert("Password updated (demo)")
    }

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fbf5f1",
            padding: 24
        }}>
            <div style={{
                width: 520,
                borderRadius: 12,
                overflow: "hidden",
                background: "transparent"
            }}>

                <div style={{
                    background: "#e9dbd6",
                    color: "#6e0b0b",
                    padding: "36px 20px",
                    textAlign: "center",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12
                }}>
                    <h2 style={{margin: 0, fontSize: 29, fontWeight: 700}}>Forgot Password</h2>
                </div>

                <div style={{
                    background: "#e9dbd6",
                    padding: 30,
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12
                }}>
                    <form onSubmit={handleSubmit}>
                        <label style={{display:"block", color: "#7a4f4f", marginBottom: 8}}>Enter Your New Password</label>
                        <div style={{position: "relative", marginBottom: 18}}>
                            <input
                                type={show1 ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{width: "100%", padding: "5px 35px", borderRadius: 8, border: "none", background: "#fff"}}
                                aria-label="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShow1(s => !s)}
                                aria-label={show1 ? "Hide password" : "Show password"}
                                style={{position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", padding: 4}}
                            >
                                {show1 ? <IconEyeOff /> : <IconEye />}
                            </button>
                        </div>

                        <label style={{display:"block", color: "#7a4f4f", marginBottom: 8}}>Confirm Password</label>
                        <div style={{position: "relative", marginBottom: 28}}>
                            <input
                                type={show2 ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{width: "100%", padding: "5px 35px", borderRadius: 8, border: "none", background: "#fff"}}
                                aria-label="confirm-password"

                            />
                            <button
                                type="button"
                                onClick={() => setShow2(s => !s)}
                                aria-label={show2 ? "Hide confirm password" : "Show confirm password"}
                                style={{position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", padding: 4}}
                            >
                                {show2 ? <IconEyeOff /> : <IconEye />}
                            </button>
                        </div>

                        <div style={{display: "flex", justifyContent: "space-between", gap: 12}}>
                            <button type="button" onClick={() => window.history.back()} style={{background: "#7b2828", color: "#fff", padding: "5px 22px", borderRadius: 6, border: "none"}}>Back</button>
                            <button type="submit" style={{background: "#7b2828", color: "#fff", padding: "5px 22px", borderRadius: 6, border: "none"}}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}