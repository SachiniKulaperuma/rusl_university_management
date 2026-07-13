'use client';

export default function HeaderInfo() {
  return (
    <div
      id="info-bar"
      style={{
        width: '100%',
        background: '#ffffff',
        borderTop: '1px solid #e2e2e2',
        borderBottom: '1px solid #e2e2e2',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          height: 38,
          width: '100%',
        }}
      >
        {/* ── LEFT: fills all remaining space ── */}
        <div style={{ display: 'flex', alignItems: 'stretch', flex: 1 }}>

          {/* Email cell */}
          <a
            href="mailto:info@rjt.ac.lk"
            id="info-email"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 24px',
              color: '#222',
              textDecoration: 'none',
              fontSize: '0.77rem',
              borderRight: '1px solid #d8d8d8',
              whiteSpace: 'nowrap',
              letterSpacing: '0.01em',
              transition: 'color 0.18s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#7C0A02')}
            onMouseLeave={e => (e.currentTarget.style.color = '#222')}
          >
            info@rjt.ac.lk
          </a>

          {/* Phone cell */}
          <a
            href="tel:+94252266643"
            id="info-phone"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 24px',
              color: '#1155cc',
              textDecoration: 'underline',
              fontSize: '0.77rem',
              fontWeight: 600,
              borderRight: '1px solid #d8d8d8',
              whiteSpace: 'nowrap',
              letterSpacing: '0.01em',
              transition: 'color 0.18s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#7C0A02')}
            onMouseLeave={e => (e.currentTarget.style.color = '#1155cc')}
          >
            +94 (25) 2266643
          </a>

          {/* Address cell — stretches to fill remaining space */}
          <div
            id="info-address"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '0 24px',
              color: '#222',
              fontSize: '0.77rem',
              whiteSpace: 'nowrap',
              letterSpacing: '0.01em',
              flex: 1,                          /* fills remaining space */
              borderRight: '1px solid #d8d8d8',
            }}
          >
            <i className="fas fa-map-marker-alt" style={{ color: '#7C0A02', fontSize: '0.72rem', flexShrink: 0 }} />
            Rajarata University of Sri Lanka, Mihintale - 50300, Sri Lanka
          </div>
        </div>

        {/* ── RIGHT: social icon cells ── */}
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          {[
            { id: 'is-fb', icon: 'fab fa-facebook-f',  label: 'Facebook' },
            { id: 'is-tw', icon: 'fab fa-twitter',     label: 'Twitter'  },
            { id: 'is-li', icon: 'fab fa-linkedin-in', label: 'LinkedIn' },
            { id: 'is-yt', icon: 'fab fa-youtube',     label: 'YouTube'  },
          ].map(({ id, icon, label }) => (
            <a
              key={id}
              href="#"
              id={id}
              aria-label={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 42,
                color: '#555',
                borderLeft: '1px solid #d8d8d8',
                fontSize: '0.80rem',
                textDecoration: 'none',
                transition: 'color 0.18s, background 0.18s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#7C0A02';
                e.currentTarget.style.background = '#f7f0ef';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#555';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <i className={icon} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}