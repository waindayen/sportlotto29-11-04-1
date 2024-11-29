import React from 'react';
import { Trophy, TrendingUp, Shield, Users } from 'lucide-react';

const features = [
  {
    icon: Trophy,
    title: "Paris en direct",
    description: "Pariez en temps réel sur vos équipes favorites"
  },
  {
    icon: TrendingUp,
    title: "Meilleures cotes",
    description: "Profitez des meilleures cotes du marché"
  },
  {
    icon: Shield,
    title: "100% sécurisé",
    description: "Vos transactions sont protégées et sécurisées"
  },
  {
    icon: Users,
    title: "Communauté",
    description: "Rejoignez une communauté de parieurs passionnés"
  }
];

export default function FeaturesSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}