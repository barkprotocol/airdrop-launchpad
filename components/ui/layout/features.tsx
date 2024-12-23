"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Wallet, Coins, BarChart3 } from "lucide-react";

const features = [
  {
    title: "Exclusive Airdrop",
    description: "Early supporters receive token rewards",
    icon: Gift,
  },
  {
    title: "Initial Wallet Offering",
    description: "Early adopters get priority access",
    icon: Wallet,
  },
  {
    title: "Stake for Passive Income",
    description: "Earn rewards by staking your tokens",
    icon: Coins,
  },
  {
    title: "BARK DeFi Ecosystem",
    description: "Access a wide range of DeFi services",
    icon: BarChart3,
  },
];

export function FeatureCards() {
  return (
    <div className="py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-white dark:text-gray-100">
          Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-transparent border-2 border-[#D0C8B9] dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="flex flex-col items-center">
                <div className="p-2 rounded-full bg-primary/10 mb-4 hover:scale-105 transition-transform duration-300">
                  <feature.icon
                    className="h-6 w-6 text-[#D0C8B9]"
                    aria-label={feature.title}
                  />
                </div>
                <CardTitle className="text-xl font-semibold text-center text-white">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-200 dark:text-gray-200">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
