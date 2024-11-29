import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Trophy, TrendingUp } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 sm:hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-around items-center">
          <NavLink to="/" className={({ isActive }) => 
            `flex flex-col items-center p-2 ${isActive ? 'text-blue-600' : 'text-gray-600'}`
          }>
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Accueil</span>
          </NavLink>
          
          <NavLink to="/matches" className={({ isActive }) => 
            `flex flex-col items-center p-2 ${isActive ? 'text-blue-600' : 'text-gray-600'}`
          }>
            <Trophy className="w-6 h-6" />
            <span className="text-xs mt-1">Matches</span>
          </NavLink>
          
          <NavLink to="/stats" className={({ isActive }) => 
            `flex flex-col items-center p-2 ${isActive ? 'text-blue-600' : 'text-gray-600'}`
          }>
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs mt-1">Stats</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}