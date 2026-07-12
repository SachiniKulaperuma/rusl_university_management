"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"

export default function HeaderTop() {
    const pathname = usePathname()
    const hideLogin = pathname?.includes("forgot-password")

    return (
        <header className="bg-red-900 shadow-lg" id="site-header">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="relative flex items-center justify-center">
                    {/* Logo + Text — centered */}
                    <a href="#" className="flex items-center gap-4 group" id="header-logo">
                        {/* Emblem / Logo */}
                        <div className="flex-shrink-0">
                            <div className="relative w-32 h-32 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                                <Image src="/logo.png" alt="Rajarata University logo" width={128} height={128} />
                            </div>
                        </div>

                        {/* Text Block */}
                        <div className="flex flex-col gap-1 items-start group-hover:text-yellow-100 transition-colors duration-300">
                            <span className="text-sm font-semibold text-yellow-300 leading-tight block">
                                ශ්‍රී ලංකා රජරට විශ්ව විද්‍යාලය
                            </span>
                            <span className="text-sm font-semibold text-yellow-300 leading-tight block">
                                இலங்கை இராஜரட பல்கலைக்கழகம்
                            </span>
                            <span className="text-base font-bold text-yellow-300 leading-tight">
                                Rajarata University of Sri Lanka
                            </span>
                        </div>
                    </a>

                    {/* Auth Area — absolute right */}
                    <div className="absolute right-0">
                        {hideLogin ? (
                            <div aria-hidden="true" className="inline-flex items-center gap-2 px-6 py-2.5 opacity-0" id="header-login-btn-placeholder">
                                <i className="fas fa-user text-base"></i>
                                <span>Login</span>
                            </div>
                        ) : (
                            <a
                                href="/signin"
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-red-900 font-semibold rounded-lg hover:bg-yellow-100 hover:text-red-900 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                                id="header-login-btn"
                            >
                                <i className="fas fa-user text-base"></i>
                                <span>Login</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}