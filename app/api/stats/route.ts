import { NextResponse } from 'next/server';
import { getAirdropStatistics, getTotalParticipants } from '@/lib/db';

export async function GET() {
  try {
    const [stats, totalParticipants] = await Promise.all([
      getAirdropStatistics(),
      getTotalParticipants()
    ]);

    return NextResponse.json({
      totalDistributed: stats.totalDistributed.toString(),
      totalClaimed: stats.totalClaimed.toString(),
      remainingToClaim: stats.remainingToClaim.toString(),
      totalParticipants,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching airdrop statistics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

