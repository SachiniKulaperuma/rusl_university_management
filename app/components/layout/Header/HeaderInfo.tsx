'use client';

export default function HeaderInfo() {
  return (
    <div className="bg-white text-slate-900 border-b border-slate-200" id="info-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 py-3 text-sm">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-slate-700">
            <a
              href="mailto:info@rjt.ac.lk"
              className="flex items-center gap-2 hover:text-sky-600 transition"
              id="info-email"
            >
              <i className="fas fa-envelope"></i>
              <span>info@rjt.ac.lk</span>
            </a>

            <span className="hidden sm:inline text-slate-300">|</span>

            <a
              href="tel:+94252266643"
              className="flex items-center gap-2 hover:text-sky-600 transition"
              id="info-phone"
            >
              <i className="fas fa-phone"></i>
              <span>+94 (25) 2266643</span>
            </a>

            <span className="hidden lg:inline text-slate-300">|</span>

            <div className="flex items-center gap-2 text-slate-700 hover:text-sky-600 transition" id="info-address">
              <i className="fas fa-location-dot"></i>
              <span>Rajarata University of Sri Lanka, Mihintale - 50300, Sri Lanka</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-700">
            <a href="#" aria-label="Facebook" className="hover:text-sky-600 transition" id="is-fb">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-sky-600 transition" id="is-tw">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-sky-600 transition" id="is-li">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-sky-600 transition" id="is-yt">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}