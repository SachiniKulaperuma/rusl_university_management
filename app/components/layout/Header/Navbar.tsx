'use client';

import { useState } from 'react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="bg-white shadow-md" id="main-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
            id="nav-hamburger"
            aria-label="Menu"
            onClick={toggleMobileMenu}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>

          <ul className="hidden md:flex gap-8 items-center flex-1 ml-8" id="nav-links">
            <li><a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 active:text-blue-700" id="nl-home">Home</a></li>
            <li><a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200" id="nl-about">About Us</a></li>
            <li><a href="/register" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200" id="nl-register">Register</a></li>
            <li><a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200" id="nl-staff">Staff</a></li>
            <li><a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200" id="nl-profile">Profile</a></li>
          </ul>

          <span className="text-gray-700 hover:text-blue-600 transition cursor-pointer">
            <i className="fas fa-user-circle text-2xl"></i>
          </span>
        </div>
      </nav>

      <div
        className={`md:hidden bg-white border-t border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-64' : 'max-h-0'
          }`}
        id="mobile-nav"
      >
        <div className="flex flex-col space-y-2 p-4">
          <a href="#" className="text-gray-700 hover:text-blue-600 py-2 px-3 rounded-md hover:bg-gray-50 transition" id="mn-home">Home</a>
          <a href="#about" className="text-gray-700 hover:text-blue-600 py-2 px-3 rounded-md hover:bg-gray-50 transition" id="mn-about">About Us</a>
          <a href="/register" className="text-gray-700 hover:text-blue-600 py-2 px-3 rounded-md hover:bg-gray-50 transition" id="mn-register">Register</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 py-2 px-3 rounded-md hover:bg-gray-50 transition" id="mn-staff">Staff</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 py-2 px-3 rounded-md hover:bg-gray-50 transition" id="mn-profile">Profile</a>
        </div>
      </div>
    </>
  )
}

export default Navbar;