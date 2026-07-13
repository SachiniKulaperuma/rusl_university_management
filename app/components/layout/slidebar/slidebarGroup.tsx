'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SidebarItem from './slidebarItem';
import { SidebarSubItem } from './slidebarData';

interface SidebarGroupProps {
  title: string;
  icon?: string;
  subItems: SidebarSubItem[];
}

export default function SidebarGroup({ title, icon, subItems }: SidebarGroupProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true); // Open by default for easier visibility

  // Automatically open the dropdown if one of its sub-items is active
  useEffect(() => {
    const hasActiveChild = subItems.some((item) => pathname === item.path || pathname.startsWith(`${item.path}/`));

    if (hasActiveChild) {
      setIsOpen(true);
    }
  }, [pathname, subItems]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="space-y-1">
      {/* Group Title Button */}
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 text-gray-100 hover:bg-gray-700/50 hover:text-white"
      >
        <span className="flex items-center gap-3">
          {icon && <i className={`${icon} text-base text-gray-300`}></i>}
          <span>{title}</span>
        </span>
        <i
          className={`fas fa-chevron-down text-xs transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        ></i>
      </button>

      {/* Nested Items */}
      {isOpen && (
        <ul className="pl-4 mt-1 space-y-1 border-l border-gray-700/60 ml-6">
          {subItems.map((subItem) => (
            <SidebarItem
              key={subItem.id}
              title={subItem.title}
              path={subItem.path}
              number={subItem.number}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
