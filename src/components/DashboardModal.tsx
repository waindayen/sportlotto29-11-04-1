import React from 'react';
import { X, Dices, Wallet, History, LogOut, Users, Gift, Lock, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardModal({ isOpen, onClose }: DashboardModalProps) {
  const { logout } = useAuth();

  const features = [
    { icon: Dices, label: 'Placer un pari', action: () => console.log('Placer un pari') },
    { icon: Wallet, label: 'Faire un dépôt', action: () => console.log('Faire un dépôt') },
    { icon: History, label: 'Transactions', action: () => console.log('Transactions') },
    { icon: Wallet, label: 'Retrait', action: () => console.log('Retrait') },
    { icon: Users, label: 'Parrainage', action: () => console.log('Parrainage') },
    { icon: Gift, label: 'Bonus', action: () => console.log('Bonus') },
    { icon: Lock, label: '2FA Sécurité', action: () => console.log('2FA') },
    { icon: UserCircle, label: 'Profile', action: () => console.log('Profile') },
    { icon: LogOut, label: 'Déconnexion', action: logout }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md m-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Tableau de bord</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => {
                  feature.action();
                  onClose();
                }}
                className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <feature.icon className="w-6 h-6 text-blue-600" />
                <span className="text-sm text-gray-700 text-center">{feature.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}