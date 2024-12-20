import { NextResponse } from 'next/server';
import { endpoints } from '@/api/endpoints';

export async function GET() {
  try {
    return NextResponse.json(endpoints, { status: 200 });
  } catch (error) {
    console.error('Error fetching API endpoints:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
