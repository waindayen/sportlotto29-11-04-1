import React, { useState, useRef, useEffect } from 'react';
import { Settings, HelpCircle, LogOut, User } from 'lucide-react';
import ProfileIcon from './ProfileIcon';
import { useAuth } from '../contexts/AuthContext';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const menuItems = [
    { icon: User, label: 'Profile', action: () => console.log('Profile clicked') },
    { icon: Settings, label: 'Paramètres', action: () => console.log('Settings clicked') },
    { icon: HelpCircle, label: 'Aide', action: () => console.log('Help clicked') },
    { icon: LogOut, label: 'Déconnexion', action: handleLogout },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ProfileIcon />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="font-medium text-sm text-gray-900">
              {currentUser?.email || 'Utilisateur'}
            </div>
            <div className="text-sm text-gray-500">{currentUser?.email}</div>
          </div>
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.action();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <item.icon className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}