'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createNewAirdrop } from '@/app/actions/create-airdrop'
import { isValidSolanaAddress } from '@/lib/utils'
import { getAirdropWalletBalance } from '@/app/database/db'

const formSchema = z.object({
  recipientAddress: z.string().refine(val => isValidSolanaAddress(val), {
    message: 'Invalid Solana address',
  }),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be a positive number',
  }),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
})

const categories = [
  { id: 'early-supporter', name: 'Early Supporter' },
  { id: 'community-contributor', name: 'Community Contributor' },
  { id: 'developer', name: 'Developer' },
  { id: 'partner', name: 'Partner' },
]

export function CreateAirdropForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [walletBalance, setWalletBalance] = useState<{
    totalBalance: bigint;
    usedBalance: bigint;
    availableBalance: bigint;
  } | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientAddress: '',
      amount: '',
      category: '',
      description: '',
    },
  })

  useEffect(() => {
    async function fetchWalletBalance() {
      try {
        const balance = await getAirdropWalletBalance()
        setWalletBalance({
          totalBalance: BigInt(balance.totalBalance),
          usedBalance: BigInt(balance.usedBalance),
          availableBalance: BigInt(balance.availableBalance)
        })
      } catch (error) {
        console.error('Error fetching wallet balance:', error)
        toast.error('Failed to fetch wallet balance')
      }
    }

    fetchWalletBalance()
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      
      if (!walletBalance) {
        toast.error('Wallet balance not available')
        return
      }

      const amountBigInt = BigInt(values.amount)
      if (amountBigInt > walletBalance.availableBalance) {
        toast.error('Insufficient funds in airdrop wallet')
        return
      }

      const result = await createNewAirdrop(values)
      
      if (result.success) {
        toast.success(result.message)
        form.reset()
        // Refresh wallet balance after successful airdrop
        const updatedBalance = await getAirdropWalletBalance()
        setWalletBalance(updatedBalance)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error creating airdrop:', error)
      toast.error('Failed to create airdrop')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {walletBalance && (
          <div className="bg-muted p-4 rounded-md mb-6">
            <h3 className="text-lg font-semibold mb-2">Airdrop Wallet Balance</h3>
            <p>Total Balance: {walletBalance.totalBalance.toString()} BARK</p>
            <p>Used Balance: {walletBalance.usedBalance.toString()} BARK</p>
            <p>Available Balance: {walletBalance.availableBalance.toString()} BARK</p>
          </div>
        )}

        <FormField
          control={form.control}
          name="recipientAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient Address</FormLabel>
              <FormControl>
                <Input placeholder="Solana wallet address" {...field} />
              </FormControl>
              <FormDescription>
                The Solana wallet address that will receive the airdrop
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Amount of BARK tokens"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The amount of BARK tokens to airdrop
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The category this airdrop belongs to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional details about this airdrop"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Any additional information about this airdrop
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting || !walletBalance || walletBalance.availableBalance <= BigInt(0)}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Airdrop
        </Button>
      </form>
    </Form>
  )
}

