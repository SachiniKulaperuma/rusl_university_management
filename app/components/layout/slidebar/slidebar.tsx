'use client';

import { useState } from 'react';
import SidebarMenu from './slidebarMenu';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-red-900 text-yellow-300 rounded-full shadow-2xl hover:bg-red-800 transition active:scale-95 flex items-center justify-center"
        aria-label="Toggle Side-bar navigation"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
      </button>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={toggleMobileSidebar}
          className="lg:hidden fixed inset-0 z-40 bg-black/55 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed bottom-0 left-0 z-40 w-80 bg-[#6b6363] flex flex-col border-r border-gray-700/30 transition-transform duration-300 lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ top: '146px' }}
      >
        {/* Top maroon border matching university headers */}
        <div className="h-1.5 bg-red-950 w-full shrink-0" />

        {/* Scrollable list menu */}
        <SidebarMenu />

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 text-center shrink-0 bg-black/10">
          <p className="text-[10px] text-white/50 leading-relaxed font-mono">
            Rajarata University of Sri Lanka<br />
            © {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>
      </aside>
    </>
  );
}
