import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useWallet } from '@/hooks/use-wallet'

// Define the shape of the claim function result
interface ClaimResult {
  success: boolean
  message: string
  txSignature?: string
}

// Import the claim function
import { claim } from '@/lib/claim'

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
      const message = `Claim BARK tokens for ${publicKey.toString()}`
      const signature = await signMessage(message)

      if (!signature) {
        throw new Error('Failed to sign message')
      }

      const result: ClaimResult = await claim(publicKey.toString(), signature)

      if (result.success) {
        toast.success(result.message)
        return result.txSignature
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error claiming BARK tokens:', error)
      toast.error(error instanceof Error ? error.message : 'An error occurred while claiming BARK tokens')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { claimTokens, isLoading }
}