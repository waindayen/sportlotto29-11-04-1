import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="relative bg-blue-600 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700"></div>
      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Pariez sur le Sport avec Confiance
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 text-blue-100">
            La meilleure plateforme de paris sportifs en ligne
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 transition-colors"
            >
              Créer un compte
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-lg text-white hover:bg-blue-500 transition-colors"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}