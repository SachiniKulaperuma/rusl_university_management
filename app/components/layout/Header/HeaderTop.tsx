'use client';

import { usePathname } from 'next/navigation';

export default function HeaderTop() {
    const pathname = usePathname();
    const isSignInPage = pathname === '/signin';

    return (
        <header className="bg-red-900 shadow-lg" id="site-header">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between gap-6">
                    {/* Logo Section */}
                    <a href="#" className="flex items-center gap-4 group" id="header-logo">
                        {/* Emblem Circle */}
                        <div className="flex-shrink-0">
                            <div className="relative w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                                <div className="absolute inset-1 border-2 border-red-900 rounded-full opacity-30"></div>
                                <i className="fas fa-dharmachakra text-3xl text-red-900"></i>
                            </div>
                        </div>

                        {/* Text Block */}
                        <div className="flex flex-col gap-1 group-hover:text-yellow-100 transition-colors duration-300">
                            <span className="text-sm font-semibold text-yellow-300 leading-tight block">
                                ශ්‍රී ලංකා රජරට විශ්ව විද්‍යාලය
                            </span>
                            <span className="text-sm font-semibold text-yellow-300 leading-tight block">
                                இலங்கை இராஜரட பல்கலைக்கழகம்
                            </span>
                            <span className="text-base font-bold text-white leading-tight">
                                Rajarata University of Sri Lanka
                            </span>
                        </div>
                    </a>

                    {/* Auth Area - Hide on signin page */}
                    {!isSignInPage && (
                        <div className="flex-shrink-0">
                            <a
                                href="/signin"
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-red-900 font-semibold rounded-lg hover:bg-yellow-100 hover:text-red-900 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                                id="header-login-btn"
                            >
                                <i className="fas fa-user text-base"></i>
                                <span>Login</span>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}