"use client";

import React from 'react';
import { Countdown } from '@/components/ui/countdown';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from 'lucide-react';

// Airdrop data (replace with actual data when available)
const AIRDROP_DATE = new Date('2025-02-15T00:00:00');
const TOTAL_SUPPLY = '18,446,744,073';
const AIRDROP_ALLOCATION = '500,000,000';
const ELIGIBLE_WALLETS = '15,000';

export function AirdropData() {
  return (
    <Card className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-md border-[#D0C8B9] border-opacity-20">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-white text-center">BARK Token Airdrop</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Countdown targetDate={AIRDROP_DATE} />
          <div className="grid grid-cols-2 gap-6">
            <InfoItem 
              label="Total Supply" 
              value={TOTAL_SUPPLY} 
              tooltip="The total number of BARK tokens that will ever exist"
            />
            <InfoItem 
              label="Airdrop Allocation" 
              value={AIRDROP_ALLOCATION} 
              tooltip="The number of BARK tokens allocated for this airdrop"
            />
            <InfoItem 
              label="Eligible Wallets" 
              value={ELIGIBLE_WALLETS} 
              tooltip="The estimated number of wallets eligible for the airdrop"
            />
            <InfoItem 
              label="Airdrop Date" 
              value={AIRDROP_DATE.toLocaleDateString()} 
              tooltip="The date when the BARK token airdrop will occur"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({ label, value, tooltip }: { label: string; value: string; tooltip: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-center cursor-help">
            <p className="text-sm text-gray-400 flex items-center justify-center">
              {label}
              <InfoIcon className="ml-1 h-4 w-4 text-gray-500" />
            </p>
            <p className="text-lg font-semibold text-[#D0C8B9]">{value}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

