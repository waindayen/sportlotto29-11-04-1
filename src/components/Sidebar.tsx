import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Dices, 
  Wallet, 
  History, 
  Users, 
  Gift, 
  Lock, 
  UserCircle, 
  LogOut 
} from 'lucide-react';
import Logo from './Logo';

export default function Sidebar() {
  const { logout, userData } = useAuth();

  const features = [
    { icon: LayoutDashboard, label: 'Dashboard', path: `/${userData?.role?.replace('user', '')}` },
    { icon: Dices, label: 'Paris', path: '/bets' },
    { icon: Wallet, label: 'Dépôt', path: '/deposit' },
    { icon: History, label: 'Transactions', path: '/transactions' },
    { icon: Wallet, label: 'Retrait', path: '/withdraw' },
    { icon: Users, label: 'Parrainage', path: '/referral' },
    { icon: Gift, label: 'Bonus', path: '/bonus' },
    { icon: Lock, label: 'Sécurité', path: '/security' },
    { icon: UserCircle, label: 'Profile', path: '/profile' }
  ];

  return (
    <div className="hidden sm:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0">
      <div className="p-4 border-b">
        <Logo />
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {features.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}