import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, Dices, Trophy, LogIn, UserPlus, Home, Calculator, Wallet, UserCircle, History, Ticket } from 'lucide-react';
import Logo from './Logo';
import DashboardMenu from '../DashboardMenu';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onToggleBetSlip: () => void;
  showBetSlip: boolean;
}

export default function Header({ onToggleBetSlip, showBetSlip }: HeaderProps) {
  const { bets } = useBetSlip();
  const navigate = useNavigate();
  const { currentUser, logout, userData } = useAuth();

  const handleBetSlipClick = () => {
    if (window.innerWidth < 768) {
      navigate('/betslip');
    } else {
      onToggleBetSlip();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const getMobileMenuItems = () => {
    switch (userData?.role) {
      case 'externaluser':
        return [
          { icon: Home, label: 'Accueil', path: '/dashboard/external' },
          { icon: Wallet, label: 'Portefeuille', path: '/dashboard/external/wallet' },
          { icon: Calculator, label: 'Paris', path: '/dashboard/external/bets' },
          { icon: History, label: 'Historique', path: '/dashboard/external/history' },
          { icon: UserCircle, label: 'Profil', path: '/dashboard/external/profile' },
        ];
      case 'agentuser':
        return [
          { icon: Home, label: 'Accueil', path: '/dashboard/agent' },
          { icon: Trophy, label: 'Paris', path: '/dashboard/agent/bets' },
          { icon: UserCircle, label: 'Clients', path: '/dashboard/agent/clients' },
          { icon: History, label: 'Historique', path: '/dashboard/agent/history' },
          { icon: UserCircle, label: 'Profil', path: '/dashboard/agent/profile' },
        ];
      default:
        return null;
    }
  };

  const mobileMenuItems = getMobileMenuItems();

  return (
    <>
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo et Nom */}
            <Link to="/" className="flex items-center gap-2">
              <Logo />
            </Link>

            {/* Menu Principal - Caché sur Mobile */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Accueil</span>
              </Link>
              <Link
                to="/football"
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Gamepad2 className="w-5 h-5" />
                <span className="font-medium">Football</span>
              </Link>
              <Link
                to="/lotto"
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Ticket className="w-5 h-5" />
                <span className="font-medium">Lotto</span>
              </Link>
              <Link
                to="/sports"
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Trophy className="w-5 h-5" />
                <span className="font-medium">Sports</span>
              </Link>
            </nav>

            {/* Authentification */}
            <div className="flex items-center gap-4">
              {currentUser ? (
                <>
                  <DashboardMenu />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <LogIn className="w-5 h-5" />
                    <span className="hidden sm:inline font-medium">Déconnexion</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <LogIn className="w-5 h-5" />
                    <span className="hidden sm:inline font-medium">Connexion</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span className="hidden sm:inline font-medium">Inscription</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Menu Mobile en bas - Uniquement pour la page d'accueil ou les utilisateurs externes/agents */}
      {(showBetSlip || mobileMenuItems) && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="grid grid-cols-5 h-16">
            {showBetSlip ? (
              // Menu pour la page d'accueil
              <>
                <Link
                  to="/"
                  className="flex flex-col items-center justify-center gap-1 text-gray-700 hover:text-blue-600"
                >
                  <Home className="w-6 h-6" />
                  <span className="text-xs">Accueil</span>
                </Link>
                <Link
                  to="/football"
                  className="flex flex-col items-center justify-center gap-1 text-gray-700 hover:text-blue-600"
                >
                  <Gamepad2 className="w-6 h-6" />
                  <span className="text-xs">Football</span>
                </Link>
                <Link
                  to="/lotto"
                  className="flex flex-col items-center justify-center gap-1 text-gray-700 hover:text-blue-600"
                >
                  <Ticket className="w-6 h-6" />
                  <span className="text-xs">Lotto</span>
                </Link>
                <button
                  onClick={handleBetSlipClick}
                  className="flex flex-col items-center justify-center gap-1 text-gray-700 hover:text-blue-600 relative"
                >
                  <Calculator className="w-6 h-6" />
                  {bets.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {bets.length}
                    </span>
                  )}
                  <span className="text-xs">Panier</span>
                </button>
                <Link
                  to="/sports"
                  className="flex flex-col items-center justify-center gap-1 text-gray-700 hover:text-blue-600"
                >
                  <Trophy className="w-6 h-6" />
                  <span className="text-xs">Sports</span>
                </Link>
              </>
            ) : (
              // Menu pour les utilisateurs externes et agents
              mobileMenuItems?.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex flex-col items-center justify-center gap-1 text-gray-700 hover:text-blue-600"
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              ))
            )}
          </div>
        </nav>
      )}
    </>
  );
}