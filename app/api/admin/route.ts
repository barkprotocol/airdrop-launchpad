import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const filter = searchParams.get('filter')
  const search = searchParams.get('search') || ''

  const skip = (page - 1) * limit

  try {
    let whereClause: any = {}
    if (filter && filter !== 'all') {
      whereClause.status = filter.toUpperCase()
    }
    if (search) {
      whereClause.OR = [
        { walletAddress: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          walletAddress: true,
          email: true,
          createdAt: true,
          status: true,
        },
      }),
      prisma.user.count({ where: whereClause }),
    ])

    return NextResponse.json({ users, total })
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

