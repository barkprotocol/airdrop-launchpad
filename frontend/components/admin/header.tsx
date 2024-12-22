'use client'

import { WalletButton } from '@/components/ui/wallet-button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useWallet } from '@solana/wallet-adapter-react'

export function AdminHeader() {
  const { publicKey } = useWallet()

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <WalletButton />
          {publicKey && (
            <span className="text-sm text-muted-foreground">
              Connected: {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}

