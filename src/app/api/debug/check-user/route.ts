import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isRegistered: true,
        canLogin: true,
        emailVerified: true,
        password: true // Including password hash for verification
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'User found',
      user: {
        ...user,
        password: user.password ? 'Password hash exists' : 'No password set'
      }
    });
  } catch (error) {
    console.error('Debug check user error:', error);
    return NextResponse.json({ error: 'Failed to check user' }, { status: 500 });
  }
} 