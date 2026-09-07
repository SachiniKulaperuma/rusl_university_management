'use client';

import { sidebarMenuData } from './slidebarData';
import SidebarItem from './slidebarItem';
import SidebarGroup from './slidebarGroup';

export default function SidebarMenu() {
  return (
    <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-4">
      <ul className="space-y-1">
        {sidebarMenuData.map((item) => {
          if (item.subItems && item.subItems.length > 0) {
            return (
              <li key={item.id}>
                <SidebarGroup
                  title={item.title}
                  icon={item.icon}
                  subItems={item.subItems}
                />
              </li>
            );
          }

          return (
            <SidebarItem
              key={item.id}
              title={item.title}
              path={item.path || '/'}
              icon={item.icon}
            />
          );
        })}
      </ul>
    </nav>
  );
}
