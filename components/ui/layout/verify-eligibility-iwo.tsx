"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { isValidSolanaAddress } from '@/lib/utils'
import { Countdown } from '@/components/ui/countdown'

const formSchema = z.object({
  walletAddress: z
    .string()
    .min(1, 'Wallet address is required')
    .refine(isValidSolanaAddress, {
      message: 'Invalid Solana wallet address',
    }),
})

const AIRDROP_DATE = '2024-12-31T00:00:00Z'

interface VerifyEligibilityProps {
  saleType: 'airdrop' | 'iwo';
}

export function VerifyEligibility({ saleType }: VerifyEligibilityProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [eligibilityResult, setEligibilityResult] = useState<{
    isEligible: boolean
    amount?: number
  } | null>(null)
  const [claimEnded, setClaimEnded] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walletAddress: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsChecking(true)
    setEligibilityResult(null)

    try {
      const response = await fetch(`/api/check-${saleType}-eligibility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: values.walletAddress }),
      })

      if (!response.ok) {
        throw new Error(`Failed to check ${saleType} eligibility`)
      }

      const data = await response.json()
      setEligibilityResult(data)

      if (data.isEligible) {
        toast.success(`Congratulations! You are eligible for the ${saleType === 'airdrop' ? 'BARK airdrop' : 'BARK IWO'}.`)
      } else {
        toast(`You are not currently eligible for the ${saleType === 'airdrop' ? 'BARK airdrop' : 'BARK IWO'}.`, {
          icon: '🔔',
        })
      }
    } catch (error) {
      console.error(`Error checking ${saleType} eligibility:`, error)
      toast.error(`An error occurred while checking ${saleType} eligibility. Please try again.`)
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {saleType === 'airdrop' && (
        <div className="mb-8">
          <Countdown
            targetDate={AIRDROP_DATE}
            className="bg-[#1a1a1a] text-[#d0c8b9] p-4 rounded-lg shadow-lg"
            onComplete={() => setClaimEnded(true)}
          />
        </div>
      )}
      {claimEnded && saleType === 'airdrop' ? (
        <div className="text-center p-4 bg-[#1a1a1a] text-[#d0c8b9] rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Claim Period Ended</h3>
          <p>The BARK token claim period has ended. Thank you for your participation!</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="walletAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Solana wallet address" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your Solana wallet address to check your eligibility for the BARK {saleType === 'airdrop' ? 'airdrop' : 'IWO'}.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isChecking}
              className="w-full bg-[#d0c8b9] text-black transition-all duration-300 focus:ring-4 focus:ring-[#dcd7cc] focus:ring-opacity-50 hover:bg-[#dcd7cc] relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-full bg-gradient-to-r from-[#c0b8a9] to-[#b0a899] group-hover:translate-x-0 group-hover:scale-102"></span>
              <span className="relative">
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                    Checking...
                  </>
                ) : (
                  `Check ${saleType === 'airdrop' ? 'Airdrop' : 'IWO'} Eligibility`
                )}
              </span>
            </Button>
          </form>
        </Form>
      )}

      {eligibilityResult && (
        <div className="mt-6 p-6 rounded-xl border border-[#d0c8b9] border-opacity-50 shadow-xl transition-all duration-300 hover:shadow-2xl bg-[#1a1a1a]">
          <h3 className="text-xl font-semibold mb-3 text-[#d0c8b9]">
            {eligibilityResult.isEligible ? 'Congratulations!' : 'Not Eligible'}
          </h3>
          <p className="text-[#dcd7cc]">
            {eligibilityResult.isEligible
              ? `You are eligible for the BARK ${saleType === 'airdrop' ? 'airdrop' : 'IWO'}. ${
                  eligibilityResult.amount
                    ? `You can claim ${eligibilityResult.amount} BARK tokens.`
                    : `You can participate in the ${saleType === 'airdrop' ? 'airdrop' : 'IWO'}.`
                }`
              : `You are not currently eligible for the BARK ${saleType === 'airdrop' ? 'airdrop' : 'IWO'}. Keep an eye out for future opportunities!`}
          </p>
        </div>
      )}
    </div>
  )
}

