import { NextResponse } from 'next/server'
import { updateUserStatus } from '@/lib/db'

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId

  try {
    const { status } = await request.json()

    if (!status || (status !== 'ACTIVE' && status !== 'INACTIVE')) {
      return NextResponse.json(
        { error: 'Invalid status provided' },
        { status: 400 }
      )
    }

    const updatedUser = await updateUserStatus(userId, status)

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'User status updated successfully', user: updatedUser },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating user status:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating user status' },
      { status: 500 }
    )
  }
}