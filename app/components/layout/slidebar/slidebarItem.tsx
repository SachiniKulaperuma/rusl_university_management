'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface SidebarItemProps {
  title: string;
  path: string;
  number?: number;
  icon?: string;
  onClick?: () => void;
}

export default function SidebarItem({ title, path, number, icon, onClick }: SidebarItemProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine if this item is currently active
  const isActive = () => {
    if (path === '/') {
      return pathname === '/' && !searchParams.get('section');
    }

    // If the path contains the section query param
    if (path.includes('?section=')) {
      const parts = path.split('?');
      const basePath = parts[0];
      const sectionQuery = parts[1] || '';
      
      const targetSection = sectionQuery.split('section=')[1]?.split('&')[0];
      const currentSection = searchParams.get('section');

      return pathname === basePath && currentSection === targetSection;
    }

    return pathname === path;
  };

  const active = isActive();

  return (
    <li>
      <Link
        href={path}
        onClick={onClick}
        className={`flex items-start gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative
          ${
            active
              ? 'bg-red-900 text-yellow-300 font-semibold shadow-md border-l-4 border-yellow-300'
              : 'text-gray-100 hover:bg-gray-700/50 hover:text-white'
          }`}
      >
        {icon && (
          <i className={`${icon} text-base mt-0.5 flex-shrink-0 ${active ? 'text-yellow-300' : 'text-gray-300 group-hover:text-white'}`}></i>
        )}
        
        {number !== undefined && (
          <span className={`font-semibold flex-shrink-0 min-w-[20px] ${active ? 'text-yellow-300' : 'text-gray-300 group-hover:text-white'}`}>
            {number}.
          </span>
        )}

        <span className="leading-snug">{title}</span>
      </Link>
    </li>
  );
}
