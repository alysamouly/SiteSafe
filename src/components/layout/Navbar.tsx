import React from 'react';
import { NavLink } from 'react-router-dom';
import { HardHat } from 'lucide-react';

export function Navbar() {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Inspections', path: '/inspections' },
    { label: 'Safety Reports', path: '/reports' },
    { label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="bg-paper border-b border-dark/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer flex-shrink-0">
            <div className="bg-accent p-1.5 text-paper">
              <HardHat className="w-5 h-5" />
            </div>
            <span className="text-xl font-heading font-black text-dark tracking-tight uppercase">SiteSafe</span>
          </div>

          {/* Navigation Links - Desktop & Tablet */}
          <div className="hidden md:flex items-center space-x-8 h-full">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-data font-bold uppercase tracking-widest h-full transition-colors ${isActive
                    ? 'border-accent text-accent'
                    : 'border-transparent text-dark/70 hover:text-dark hover:border-dark/30'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Placeholder to keep layout balanced if needed, or just let justify-between handle it */}
          <div className="hidden md:block w-20"></div>
        </div>
      </div>

      {/* Mobile Menu - A simple scrollable row for small screens */}
      <div className="md:hidden border-t border-dark/10 overflow-x-auto">
        <div className="flex px-4 space-x-6 h-12 min-w-max">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-data font-bold uppercase tracking-widest h-full transition-colors ${isActive
                  ? 'border-accent text-accent'
                  : 'border-transparent text-dark/70 hover:text-dark'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
