import React from 'react';
import { Shield, Zap, Users, Gift, Coins, BarChartIcon as ChartBar } from 'lucide-react';

interface FeatureCardsProps {
  backgroundImage?: string;
  backgroundColor?: string;
}

const features = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Secure",
    description: "Built on Solana's robust blockchain, ensuring top-notch security for all transactions."
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Fast",
    description: "Lightning-fast transactions and minimal fees, powered by Solana's high-performance network."
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Community-Driven",
    description: "Governed by the community, ensuring fair distribution and collective decision-making."
  }
];

const benefits = [
  {
    icon: <Gift className="w-8 h-8" />,
    title: "Exclusive Rewards",
    description: "Access to special airdrops, events, and early project participation opportunities."
  },
  {
    icon: <Coins className="w-8 h-8" />,
    title: "Staking Incentives",
    description: "Earn additional rewards by staking your BARK tokens in the protocol."
  },
  {
    icon: <ChartBar className="w-8 h-8" />,
    title: "Governance Power",
    description: "Participate in shaping the future of BARK Protocol through voting rights."
  }
];

export function FeatureCards({ backgroundImage, backgroundColor = 'black' }: FeatureCardsProps) {
  const backgroundStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor };

  return (
    <div className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" style={backgroundStyle}>
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Why Choose BARK
          </h2>
          <p className="text-xl text-[#D0C8B9]">
            Discover the unique features that set BARK Token apart
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3 mb-24">
          {features.map((feature, index) => (
            <div key={index} className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-xl p-8 border border-[#D0C8B9] border-opacity-20 transition-transform duration-300 ease-in-out transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#D0C8B9] text-black mb-6 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white text-center">{feature.title}</h3>
              <p className="text-[#D0C8B9] text-center">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Benefits to Join BARK Protocol
          </h2>
          <p className="text-xl text-[#D0C8B9]">
            Unlock these exclusive advantages by becoming part of our community
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-xl p-8 border border-[#D0C8B9] border-opacity-20 transition-transform duration-300 ease-in-out transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#D0C8B9] text-black mb-6 mx-auto">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white text-center">{benefit.title}</h3>
              <p className="text-[#D0C8B9] text-center">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

