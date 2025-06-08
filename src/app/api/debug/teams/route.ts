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
          mentor: true,
          members: {
            include: {
              user: true
            }
          }
        }
      });
      return NextResponse.json({ teams });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { 
        status: 404 
      });
    }

    // Find teams where user is leader or member
    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { leadId: user.id },
          { 
            members: {
              some: {
                userId: user.id
              }
            }
          }
        ]
      },
      include: {
        lead: true,
        mentor: true,
        members: {
          include: {
            user: true
          }
        }
      }
    });

    return NextResponse.json({
      user,
      teams,
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ 
      error: 'Debug endpoint error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500 
    });
  }
}