'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
<<<<<<< HEAD:frontend/components/admin/airdrop-wallet-balance.tsx

async function fetchAirdropWalletBalance() {
  try {
    // Assuming you have a backend endpoint that fetches the balance data
    const response = await fetch('/api/airdrop-wallet-balance')
    if (!response.ok) {
      throw new Error('Failed to fetch wallet balance')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching airdrop wallet balance:', error)
    return null
  }
}
=======
import { getAirdropWalletBalance } from '@/app/database/db'
>>>>>>> 942a7b7 (updated):components/admin/airdrop-wallet-balance.tsx

export function AirdropWalletBalance() {
  const [balance, setBalance] = useState<{
    totalBalance: string
    usedBalance: string
    availableBalance: string
  } | null>(null)

  useEffect(() => {
    async function fetchBalance() {
      const walletBalance = await fetchAirdropWalletBalance()
      if (walletBalance) {
        setBalance({
          totalBalance: walletBalance.totalBalance.toString(),
          usedBalance: walletBalance.usedBalance.toString(),
          availableBalance: walletBalance.availableBalance.toString(),
        })
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
