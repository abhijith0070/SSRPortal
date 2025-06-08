import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse(JSON.stringify({
        error: 'Unauthorized',
        message: 'Please sign in to update project'
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await req.json();
    
    // Get user's team
 // Get user's team
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { team: true },
    });

    if (!user?.team) {
      return new NextResponse(JSON.stringify({
        error: 'Not Found',
        message: 'No team found'
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update project
    const project = await prisma.project.update({
      where: { 
      id: parseInt(user.team.id)
      },
      data: {
        name: body.title,
        
      }
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return new NextResponse(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Failed to update project'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 