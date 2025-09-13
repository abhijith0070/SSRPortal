import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized',
        message: 'No authenticated session found'
      }, { status: 401 });
    }

    // Get basic user info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        teamMembers: {
          select: {
            id: true,
            teamId: true,
            role: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found',
        message: 'Authenticated user not found in database' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        session: {
          userId: session.user.id,
          email: session.user.email,
        },
        user: {
          ...user,
          // Don't send the full user object back
          password: undefined
        },
        hasTeam: user.teamMembers && user.teamMembers.length > 0,
        timestamp: new Date().toISOString()
      }
    });
  } catch (e: any) {
    console.error('Test auth API error:', e);
    return NextResponse.json({ 
      success: false, 
      error: 'Server error',
      message: e?.message || 'Unknown error occurred'
    }, { status: 500 });
  }
}
