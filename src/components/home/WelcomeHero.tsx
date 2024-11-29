import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ShieldCheck, TrendingUp } from 'lucide-react';

export default function WelcomeHero() {
  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Vivez le Sport Intensément
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Pariez en direct sur plus de 1000 événements sportifs quotidiens
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-green-500 hover:bg-green-600 transition-colors"
            >
              Commencer à Parier
            </Link>
            <Link
              to="/live"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg border-2 border-white hover:bg-white/10 transition-colors"
            >
              Paris en Direct
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            {
              icon: Trophy,
              title: "Meilleures Cotes",
              description: "Profitez des cotes les plus compétitives du marché"
            },
            {
              icon: ShieldCheck,
              title: "Paris Sécurisés",
              description: "Plateforme agréée et transactions sécurisées"
            },
            {
              icon: TrendingUp,
              title: "Stats Avancées",
              description: "Analyses détaillées pour des paris éclairés"
            }
          ].map((feature, index) => (
            <div key={index} className="flex items-start gap-4 p-6 rounded-lg bg-white/5">
              <feature.icon className="w-8 h-8 text-green-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-blue-100">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}