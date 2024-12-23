import { NextResponse } from 'next/server';
import { fetchData } from '@/utils/fetch-data';

// API endpoint to fetch transactions or any other data.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const filter = searchParams.get('filter');
  const search = searchParams.get('search') || '';

  const skip = (page - 1) * limit;

  try {
    let whereClause: {
      status?: string;
      OR?: Array<{ [key: string]: { contains: string; mode: 'insensitive' } }>;
    } = {};

    if (filter && filter !== 'all') {
      whereClause.status = filter.toUpperCase();
    }
    if (search) {
      whereClause.OR = [
        { recipientAddress: { contains: search, mode: 'insensitive' } },
        { transactionSignature: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Adjust the fetchData function according to your API structure
    const transactionsData = await fetchData(
      'https://api.barkprotocol.net/v0.1/transactions', // Change this URL according to your API structure
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-token-here',
        },
      }
    );

    const transactions = transactionsData.transactions.map((tx: any) => ({
      ...tx,
      amount: tx.amount.toString(), // Convert BigInt to string
      createdAt: tx.createdAt.toISOString(), // Convert Date to ISO string
    }));

    return NextResponse.json({ transactions, total: transactionsData.total });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
