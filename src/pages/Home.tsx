import React from 'react';
import { Link } from 'react-router-dom';
import WelcomeHero from '../components/home/WelcomeHero';
import LiveBetting from '../components/home/LiveBetting';
import TopEvents from '../components/home/TopEvents';
import CTASection from '../components/home/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <WelcomeHero />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Live Betting Section */}
        <LiveBetting />

        {/* Top Events Section */}
        <TopEvents />
      </div>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}