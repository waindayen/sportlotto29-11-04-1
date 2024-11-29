import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Shield, 
  Database,
  AlertTriangle,
  FileText,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './layout/Logo';

export default function AdminSidebar() {
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/admin' },
    { icon: Users, label: 'Utilisateurs', path: '/dashboard/admin/users' },
    { icon: Shield, label: 'Permissions', path: '/dashboard/admin/permissions' },
    { icon: Database, label: 'Base de données', path: '/dashboard/admin/database' },
    { icon: AlertTriangle, label: 'Alertes', path: '/dashboard/admin/alerts' },
    { icon: FileText, label: 'Logs', path: '/dashboard/admin/logs' },
    { icon: Settings, label: 'Configuration', path: '/dashboard/admin/settings' },
  ];

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