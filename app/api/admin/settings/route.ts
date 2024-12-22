import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const adminStats = await prisma.$transaction([
      prisma.user.count(),
      prisma.claim.count(),
      prisma.airdrop.count(),
      prisma.transaction.count(),
    ])

    const [totalUsers, totalClaims, totalAirdrops, totalTransactions] = adminStats

    return NextResponse.json({
      totalUsers,
      totalClaims,
      totalAirdrops,
      totalTransactions,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    // Handle admin-specific actions here
    // For example, you could update global settings or perform batch operations

    return NextResponse.json({ message: 'Admin action completed successfully' })
  } catch (error) {
    console.error('Error processing admin action:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

