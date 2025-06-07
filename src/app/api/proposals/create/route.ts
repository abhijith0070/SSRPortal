import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

const proposalSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(100, 'Description must be at least 100 characters'),
  objectives: z.string().min(50, 'Objectives must be at least 50 characters'),
  methodology: z.string().min(100, 'Methodology must be at least 100 characters'),
  expectedOutcomes: z.string().min(50, 'Expected outcomes must be at least 50 characters'),
  timeline: z.string().min(50, 'Timeline must be at least 50 characters'),
  references: z.string().optional(),
  attachments: z.array(z.object({
    url: z.string().url(),
    filename: z.string(),
    type: z.string(),
  })).optional(),
  teamId: z.string().uuid(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = proposalSchema.parse(body);

    // Check if team exists and user is part of it
    const team = await prisma.team.findFirst({
      where: {
        id: validatedData.teamId,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found or user not in team' },
        { status: 404 }
      );
    }

    // Check if team already has an active proposal
    const existingProposal = await prisma.proposal.findFirst({
      where: {
        teamId: validatedData.teamId,
        status: {
          in: ['PENDING', 'APPROVED'],
        },
      },
    });

    if (existingProposal) {
      return NextResponse.json(
        { error: 'Team already has an active proposal' },
        { status: 400 }
      );
    }

    // Create proposal
    const proposal = await prisma.proposal.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        objectives: validatedData.objectives,
        methodology: validatedData.methodology,
        expectedOutcomes: validatedData.expectedOutcomes,
        timeline: validatedData.timeline,
        references: validatedData.references,
        status: 'PENDING',
        teamId: validatedData.teamId,
        submittedById: session.user.id,
        attachments: {
          create: validatedData.attachments?.map(attachment => ({
            url: attachment.url,
            filename: attachment.filename,
            type: attachment.type,
          })) || [],
        },
      },
      include: {
        attachments: true,
      },
    });

    // Update team status
    await prisma.team.update({
      where: { id: validatedData.teamId },
      data: { status: 'PROPOSAL_SUBMITTED' },
    });

    return NextResponse.json(proposal);
  } catch (error) {
    console.error('Proposal creation error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create proposal' },
      { status: 500 }
    );
  }
} 