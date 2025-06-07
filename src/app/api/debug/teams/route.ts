import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    // Get all teams if no email provided
    if (!email) {
      const teams = await prisma.team.findMany({
        include: {
          lead: true,
          mentor: true
        }
      });
      return NextResponse.json({ teams });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    console.log('Found user:', user);

    // Find teams where user is leader or member
    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { leadId: user?.id },
          { members: { contains: email } }
        ]
      },
      include: {
        lead: true,
        mentor: true
      }
    });

    return NextResponse.json({
      user,
      teams,
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Debug endpoint error' }, { status: 500 });
  }
} 