'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAirdropWalletBalance } from '@/lib/db'

export function AirdropWalletBalance() {
  const [balance, setBalance] = useState<{
    totalBalance: string;
    usedBalance: string;
    availableBalance: string;
  } | null>(null)

  useEffect(() => {
    async function fetchBalance() {
      try {
        const walletBalance = await getAirdropWalletBalance()
        setBalance({
          totalBalance: walletBalance.totalBalance.toString(),
          usedBalance: walletBalance.usedBalance.toString(),
          availableBalance: walletBalance.availableBalance.toString()
        })
      } catch (error) {
        console.error('Error fetching airdrop wallet balance:', error)
      }
    }

    fetchBalance()
  }, [])

  if (!balance) {
    return <div>Loading balance...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Airdrop Wallet Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium">Total Balance</p>
            <p className="text-2xl font-bold">{balance.totalBalance} BARK</p>
          </div>
          <div>
            <p className="text-sm font-medium">Used Balance</p>
            <p className="text-2xl font-bold">{balance.usedBalance} BARK</p>
          </div>
          <div>
            <p className="text-sm font-medium">Available Balance</p>
            <p className="text-2xl font-bold">{balance.availableBalance} BARK</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

