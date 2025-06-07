import { NextResponse } from 'next/server';
import { auth } from '@auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const proposalSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(100, 'Description must be at least 100 characters'),
  content: z.string().min(100, 'Content must be at least 100 characters').default(''),
  attachment: z.string().optional(),
  link: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    console.log('Starting proposal creation...');
    
    const session = await auth();
    if (!session?.user?.id) {
      console.error('Authentication failed: No user session');
      return new NextResponse(JSON.stringify({ 
        error: 'Unauthorized',
        message: 'Please sign in to submit a proposal'
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('User authenticated:', session.user.id);

    let body;
    try {
      body = await req.json();
      console.log('Received proposal data:', body);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new NextResponse(JSON.stringify({
        error: 'Invalid request',
        message: 'Failed to parse request body'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate request body against schema
    const result = proposalSchema.safeParse(body);
    if (!result.success) {
      console.error('Validation failed:', result.error.errors);
      return new NextResponse(JSON.stringify({ 
        error: 'Validation failed', 
        details: result.error.errors,
        message: 'Please check all required fields'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Proposal data validated successfully');

    // Get user's team
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { team: true },
      });

      if (!user?.team) {
        console.error('No team found for user:', session.user.id);
        return new NextResponse(JSON.stringify({
          error: 'Team not found',
          message: 'You must be part of a team to submit a proposal'
        }), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      console.log('Found user team:', user.team.code);

      // Create proposal with all fields
      const proposal = await prisma.proposal.create({
        data: {
          title: body.title,
          description: body.description,
          content: body.content || body.objectives + '\n\n' + body.methodology + '\n\n' + body.expectedOutcomes + '\n\n' + body.timeline + (body.references ? '\n\nReferences:\n' + body.references : ''),
          attachment: body.attachment,
          link: body.link,
          state: 'DRAFT',
          teamCode: user.team.code,
          authorId: session.user.id,
          updated_at: new Date(),
        },
      });

      console.log('Proposal created successfully:', proposal.id);
      return NextResponse.json({
        message: 'Proposal created successfully',
        proposal
      });

    } catch (dbError: any) {
      console.error('Database error:', dbError);
      return new NextResponse(JSON.stringify({
        error: 'Database error',
        message: dbError.message || 'Failed to create proposal'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return new NextResponse(JSON.stringify({
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user's team
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { team: true },
    });

    if (!user?.team) {
      return new NextResponse('No team found', { status: 404 });
    }

    // Get all proposals for the team
    const proposals = await prisma.proposal.findMany({
      where: {
        teamCode: user.team.code,
      },
      orderBy: {
        updated_at: 'desc',
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 