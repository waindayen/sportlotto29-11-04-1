import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  BarChart,
  Ticket,
  List
} from 'lucide-react';
import Logo from './Logo';

export default function DashboardSidebar() {
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
          { icon: Ticket, label: 'Setup Lotto', path: '/dashboard/admin/setup-lotto' },
          { icon: List, label: 'Lottos soumis', path: '/dashboard/admin/lotto-list' },
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

  return (
    <div className="hidden lg:flex flex-col w-64 bg-gray-900 min-h-screen fixed left-0 top-0">
      <div className="p-4">
        <Logo />
      </div>

      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
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

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-400 hover:bg-gray-800 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}