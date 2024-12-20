'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler, UseFormReturn } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

const settingsSchema = z.object({
  airdropWalletAddress: z.string().min(1, "Airdrop wallet address is required"),
  minClaimAmount: z.coerce.number().positive("Minimum claim amount must be a positive number"),
  maxClaimAmount: z.coerce.number().positive("Maximum claim amount must be a positive number"),
  enableClaims: z.boolean(),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

async function getSettings(): Promise<SettingsFormValues> {
  const response = await fetch('/api/admin/settings')
  if (!response.ok) {
    throw new Error('Failed to fetch settings')
  }
  return response.json()
}

async function updateSettings(values: SettingsFormValues): Promise<void> {
  const response = await fetch('/api/admin/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })
  if (!response.ok) {
    throw new Error('Failed to update settings')
  }
}

export function AdminSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      airdropWalletAddress: "",
      minClaimAmount: 0,
      maxClaimAmount: 0,
      enableClaims: false,
    },
  })

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getSettings()
        form.reset(settings)
      } catch (error) {
        toast.error("Failed to load settings")
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [form.reset])

  const onSubmit: SubmitHandler<SettingsFormValues> = async (values: { airdropWalletAddress: string; minClaimAmount: number; maxClaimAmount: number; enableClaims: boolean }) => {
    try {
      setIsSubmitting(true)
      await updateSettings(values)
      toast.success("Settings updated successfully")
    } catch (error) {
      toast.error("Failed to update settings")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Settings</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="airdropWalletAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Airdrop Wallet Address</FormLabel>
                <FormControl>
                  <Input placeholder="Solana wallet address" {...field} />
                </FormControl>
                <FormDescription>
                  The wallet address used for airdrop distributions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minClaimAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Claim Amount</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormDescription>
                  The minimum amount of BARK tokens that can be claimed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxClaimAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Claim Amount</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormDescription>
                  The maximum amount of BARK tokens that can be claimed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="enableClaims"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Enable Claims</FormLabel>
                  <FormDescription>
                    Allow users to claim their BARK tokens
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

