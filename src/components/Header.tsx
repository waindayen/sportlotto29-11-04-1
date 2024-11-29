import React, { useState } from 'react';
import Logo from './Logo';
import NotificationBell from './NotificationBell';
import UserMenu from './UserMenu';
import HamburgerMenu from './HamburgerMenu';
import DashboardModal from './DashboardModal';
import { LayoutDashboard } from 'lucide-react';

export default function Header() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10 sm:pl-64">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:hidden">
          <HamburgerMenu />
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDashboardOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors sm:hidden"
            aria-label="Tableau de bord"
          >
            <LayoutDashboard className="w-6 h-6 text-gray-600" />
          </button>
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
      
      <DashboardModal 
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
      />
    </header>
  );
}