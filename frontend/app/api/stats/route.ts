import { NextResponse } from 'next/server';
import { getAirdropStatistics, getTotalParticipants } from '@/lib/db';

export async function GET() {
  try {
    // Fetch airdrop stats and total participants concurrently
    const [stats, totalParticipants] = await Promise.all([
      getAirdropStatistics(),
      getTotalParticipants(),
    ]);

    // Validate statistics
    if (!stats) {
      console.error('Airdrop statistics are missing:', stats);
      return NextResponse.json({ error: 'Airdrop statistics are missing' }, { status: 500 });
    }

    const { totalDistributed, totalClaimed, remainingToClaim } = stats;

    if (typeof totalDistributed !== 'number') {
      console.error('Invalid totalDistributed:', totalDistributed);
      return NextResponse.json({ error: 'Invalid totalDistributed value' }, { status: 500 });
    }
    if (typeof totalClaimed !== 'number') {
      console.error('Invalid totalClaimed:', totalClaimed);
      return NextResponse.json({ error: 'Invalid totalClaimed value' }, { status: 500 });
    }
    if (typeof remainingToClaim !== 'number') {
      console.error('Invalid remainingToClaim:', remainingToClaim);
      return NextResponse.json({ error: 'Invalid remainingToClaim value' }, { status: 500 });
    }

    // Validate totalParticipants
    if (typeof totalParticipants !== 'number' || totalParticipants < 0) {
      console.error('Invalid total participants:', totalParticipants);
      return NextResponse.json({ error: 'Invalid total participants value' }, { status: 500 });
    }

    // Convert numbers to strings for JSON serialization if necessary
    return NextResponse.json({
      totalDistributed: totalDistributed.toString(),
      totalClaimed: totalClaimed.toString(),
      remainingToClaim: remainingToClaim.toString(),
      totalParticipants: totalParticipants.toString(),
    }, { status: 200 });

  } catch (error) {
    // Log detailed error for debugging
    console.error('Error fetching airdrop statistics:', {
      message: error.message,
      stack: error.stack,
    });

    // Respond with a generic error message
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
