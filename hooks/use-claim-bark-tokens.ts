import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { claim } from '@/lib/claim'
import { toast } from 'react-hot-toast'

export function useClaimBArkTokens() {
  const [isLoading, setIsLoading] = useState(false)
  const { publicKey, signMessage } = useWallet()

  const claimTokens = async (): Promise<string | undefined> => {
    if (!publicKey || !signMessage) {
      const error = new Error('Wallet not connected')
      toast.error(error.message)
      throw error
    }

    setIsLoading(true)

    try {
      const message = `Claim BARK tokens for ${publicKey.toBase58()}`
      const encodedMessage = new TextEncoder().encode(message)
      const signedMessage = await signMessage(encodedMessage)
      const signature = Buffer.from(signedMessage).toString('base64')

      const result = await claim(publicKey.toBase58(), signature)

      if (result.success) {
        toast.success(result.message)
        return result.txSignature
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error claiming tokens:', error)
      toast.error(error instanceof Error ? error.message : 'An error occurred while claiming tokens')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { claimTokens, isLoading }
}

