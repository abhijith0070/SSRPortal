import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

// Update schema to match Prisma model
const proposalSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(100, 'Description must be at least 100 characters'),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  attachment: z.string().url('Invalid attachment URL').optional(),
  link: z.string().url('Invalid link URL').optional(),
  teamCode: z.string().min(1, 'Team code is required')
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const body = await req.json();
    const validation = proposalSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
      }, { status: 400 });
    }

    const data = validation.data;

    // Use transaction for atomic operations
    const result = await prisma.$transaction(async (tx) => {
      // Check if team exists and user is member
      const team = await tx.team.findFirst({
        where: {
          id: data.teamCode,
          OR: [
            { leadId: session.user.id },
            { members: { some: { userId: session.user.id } } }
          ]
        }
      });

      if (!team) {
        throw new Error('TEAM_NOT_FOUND');
      }

      // Check for existing active proposals
      const existingProposal = await tx.proposal.findFirst({
        where: {
          teamCode: data.teamCode,
          state: {
            in: ['PENDING', 'APPROVED']
          }
        }
      });

      if (existingProposal) {
        throw new Error('ACTIVE_PROPOSAL_EXISTS');
      }

      // Create proposal
      const proposal = await tx.proposal.create({
        data: {
          title: data.title,
          description: data.description,
          content: data.content,
          attachment: data.attachment,
          link: data.link,
          state: 'PENDING',
          authorId: session.user.id,
          teamCode: data.teamCode,
          created_at: new Date(),
          updated_at: new Date()
        },
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          Team: {
            include: {
              mentor: {
                select: { email: true }
              }
            }
          }
        }
      });

      // Update team status
      await tx.team.update({
        where: { id: data.teamCode },
        data: { status: 'PROPOSAL_SUBMITTED' }
      });

      return proposal;
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Proposal creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.format()
      }, { status: 400 });
    }

    if (error instanceof Error) {
      switch (error.message) {
        case 'TEAM_NOT_FOUND':
          return NextResponse.json({
            success: false,
            error: 'Team not found or user not authorized'
          }, { status: 404 });

        case 'ACTIVE_PROPOSAL_EXISTS':
          return NextResponse.json({
            success: false,
            error: 'Team already has an active proposal'
          }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}