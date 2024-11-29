import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { X } from 'lucide-react';
import { 
  LayoutDashboard, 
  Dices, 
  Wallet, 
  History, 
  Users, 
  Gift, 
  Lock, 
  UserCircle, 
  LogOut,
  Settings,
  Shield,
  Database,
  AlertTriangle,
  FileText,
  BarChart
} from 'lucide-react';
import Logo from './Logo';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { logout, userData } = useAuth();

  // Définir les menus en fonction du rôle
  const getMenuItems = () => {
    switch (userData?.role) {
      case 'adminuser':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/admin' },
          { icon: Users, label: 'Utilisateurs', path: '/dashboard/admin/users' },
          { icon: Shield, label: 'Permissions', path: '/dashboard/admin/permissions' },
          { icon: Database, label: 'Base de données', path: '/dashboard/admin/database' },
          { icon: AlertTriangle, label: 'Alertes', path: '/dashboard/admin/alerts' },
          { icon: FileText, label: 'Logs', path: '/dashboard/admin/logs' },
          { icon: Settings, label: 'Configuration', path: '/dashboard/admin/settings' },
        ];
      case 'apiuser':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/api' },
          { icon: BarChart, label: 'Configuration Odds', path: '/dashboard/api/odds-config' },
          { icon: Settings, label: 'Paramètres', path: '/dashboard/api/settings' },
        ];
      case 'externaluser':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/external' },
          { icon: Dices, label: 'Mes Paris', path: '/dashboard/external/bets' },
          { icon: Wallet, label: 'Portefeuille', path: '/dashboard/external/wallet' },
          { icon: History, label: 'Historique', path: '/dashboard/external/history' },
          { icon: Gift, label: 'Bonus', path: '/dashboard/external/bonus' },
          { icon: UserCircle, label: 'Profil', path: '/dashboard/external/profile' },
        ];
      default:
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: `/dashboard/${userData?.role?.replace('user', '')}` },
          { icon: Users, label: 'Clients', path: `/dashboard/${userData?.role?.replace('user', '')}/clients` },
          { icon: History, label: 'Historique', path: `/dashboard/${userData?.role?.replace('user', '')}/history` },
          { icon: Settings, label: 'Paramètres', path: `/dashboard/${userData?.role?.replace('user', '')}/settings` },
        ];
    }
  };

  const menuItems = getMenuItems();

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-50">
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 shadow-lg transform transition-transform duration-200 ease-in-out">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <Logo />
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="px-4 py-6">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-400 hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
}