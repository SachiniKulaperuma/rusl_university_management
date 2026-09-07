'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function HeaderTop() {
    const pathname = usePathname();
    const isSignInPage = pathname === '/signin';

    return (
        <header
            id="site-header"
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                background: '#6b0000',           /* deep maroon matching screenshot */
                boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
                width: '100%',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 72,
                    padding: '0 28px',
                    position: 'relative',
                }}
            >
                {/* ── invisible spacer so logo stays centred ── */}
                <div style={{ width: 110, flexShrink: 0 }} />

                {/* ── CENTRE: logo + text ── */}
                <a
                    href="/"
                    id="header-logo"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        textDecoration: 'none',
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}
                >
                    {/* Emblem */}
                    <Image
                        src="/logo.png"
                        alt="RUSL Emblem"
                        width={100}
                        height={100}
                        style={{ objectFit: 'contain', flexShrink: 0 }}
                        priority
                        unoptimized
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />

                    {/* University name lines */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'center' }}>
                        <span style={{
                            fontSize: '0.70rem',
                            fontWeight: 600,
                            color: '#f5d76e',
                            lineHeight: 1.3,
                            letterSpacing: '0.01em',
                        }}>
                            ශ්‍රී ලංකා රජරට විශ්ව විද්‍යාලය
                        </span>
                        <span style={{
                            fontSize: '0.70rem',
                            fontWeight: 600,
                            color: '#f5d76e',
                            lineHeight: 1.3,
                            letterSpacing: '0.01em',
                        }}>
                            இலங்கை இராஜரட பல்கலைக்கழகம்
                        </span>
                        <span style={{
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: '#f5d76e',
                            lineHeight: 1.3,
                            letterSpacing: '0.02em',
                        }}>
                            Rajarata University of Sri Lanka
                        </span>
                    </div>
                </a>

                {/* ── RIGHT: Login button ── */}
                {!isSignInPage && (
                    <div style={{ flexShrink: 0 }}>
                        <a
                            href="/signin"
                            id="header-login-btn"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 7,
                                padding: '7px 22px',
                                background: 'transparent',
                                border: '1.5px solid rgba(255,255,255,0.7)',
                                borderRadius: 5,
                                color: '#fff',
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                letterSpacing: '0.03em',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                                e.currentTarget.style.borderColor = '#fff';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
                            }}
                        >
                            <i className="fas fa-user" style={{ fontSize: '0.78rem' }} />
                            Login
                        </a>
                    </div>
                )}
            </div>
        </header>
    );
}