import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Transaction {
  id: string;
  amount: bigint;
  recipientAddress: string;
  status: string;
  transactionSignature: string | null;
  createdAt: Date;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const filter = searchParams.get('filter')
  const search = searchParams.get('search') || ''

  const skip = (page - 1) * limit

  try {
    let whereClause: {
      status?: string;
      OR?: Array<{ [key: string]: { contains: string; mode: 'insensitive' } }>;
    } = {}

    if (filter && filter !== 'all') {
      whereClause.status = filter.toUpperCase()
    }
    if (search) {
      whereClause.OR = [
        { recipientAddress: { contains: search, mode: 'insensitive' } },
        { transactionSignature: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          amount: true,
          recipientAddress: true,
          status: true,
          transactionSignature: true,
          createdAt: true,
        },
      }),
      prisma.transaction.count({ where: whereClause }),
    ])

    return NextResponse.json({ 
      transactions: transactions.map((tx: Transaction) => ({
        ...tx,
        amount: tx.amount.toString(), // Convert BigInt to string
        createdAt: tx.createdAt.toISOString(), // Convert Date to ISO string
      })),
      total 
    })
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

