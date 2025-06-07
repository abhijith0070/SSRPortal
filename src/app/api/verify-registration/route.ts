import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        error: 'No user email in session',
        session: session 
      }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isRegistered: true,
        canLogin: true
      }
    });

    if (!user) {
      return NextResponse.json({ 
        error: 'User not found in database',
        email: session.user.email,
        session: session
      }, { status: 404 });
    }

    return NextResponse.json({
      message: 'User found',
      user: user,
      session: session
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ 
      error: 'Failed to verify registration',
      details: error
    }, { status: 500 });
  }
} 