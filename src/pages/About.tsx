import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">À propos de BetSport</h1>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-600 mb-4">
            BetSport est votre plateforme de paris sportifs de confiance. Notre mission est de vous offrir une expérience de paris exceptionnelle, sécurisée et responsable.
          </p>
          <p className="text-gray-600 mb-4">
            Nous proposons une large sélection de sports et d'événements, avec des cotes compétitives et une interface utilisateur intuitive.
          </p>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">Nos valeurs</h2>
            <ul className="space-y-2">
              <li className="flex items-center text-blue-700">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Transparence
              </li>
              <li className="flex items-center text-blue-700">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Sécurité
              </li>
              <li className="flex items-center text-blue-700">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Innovation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}