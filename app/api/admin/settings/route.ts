import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const settingsSchema = z.object({
  airdropWalletAddress: z.string().min(1, "Airdrop wallet address is required"),
  minClaimAmount: z.coerce.number().positive("Minimum claim amount must be a positive number"),
  maxClaimAmount: z.coerce.number().positive("Maximum claim amount must be a positive number"),
  enableClaims: z.boolean(),
})

export async function GET() {
  try {
    const settings = await prisma.adminSettings.findFirst()
    
    if (!settings) {
      return NextResponse.json(
        { error: 'Admin settings not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Failed to fetch admin settings:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching admin settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const validationResult = settingsSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid settings data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { airdropWalletAddress, minClaimAmount, maxClaimAmount, enableClaims } = validationResult.data

    const updatedSettings = await prisma.adminSettings.upsert({
      where: { id: 1 }, // Assuming there's only one settings record
      update: {
        airdropWalletAddress,
        minClaimAmount,
        maxClaimAmount,
        enableClaims,
      },
      create: {
        airdropWalletAddress,
        minClaimAmount,
        maxClaimAmount,
        enableClaims,
      },
    })

    return NextResponse.json({
      message: 'Admin settings updated successfully',
      settings: updatedSettings,
    })
  } catch (error) {
    console.error('Failed to update admin settings:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating admin settings' },
      { status: 500 }
    )
  }
}