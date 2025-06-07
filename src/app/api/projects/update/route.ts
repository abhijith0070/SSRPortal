import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  mentorName: z.string().min(3, 'Mentor name must be at least 3 characters'),
  mentorEmail: z.string().email('Invalid mentor email'),
  theme: z.enum([
    'Health and Wellbeing',
    'Awareness Campaigns',
    'Indian History and Heritage',
    'Amrita Talks',
    'Financial Literacy',
    '21st Century Values',
    'Student Mentorship',
    'Student Clubs',
    'Women Empowerment'
  ]),
  targetBeneficiaries: z.string().min(50, 'Target beneficiaries description must be at least 50 characters'),
  socialImpact: z.string().min(100, 'Social impact description must be at least 100 characters'),
  implementationApproach: z.string().min(100, 'Implementation approach must be at least 100 characters'),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED']),
  currentMilestone: z.string().min(5, 'Current milestone must be at least 5 characters'),
  nextMilestone: z.string().min(5, 'Next milestone must be at least 5 characters'),
  challenges: z.string().optional(),
  achievements: z.string().optional(),
  location: z.object({
    type: z.enum(['ONLINE', 'OFFLINE']),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional()
  }),
  teamId: z.string().uuid()
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse(JSON.stringify({
        error: 'Unauthorized',
        message: 'Please sign in to update project details'
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await req.json();
    
    // Validate request body
    const result = projectSchema.safeParse(body);
    if (!result.success) {
      return new NextResponse(JSON.stringify({ 
        error: 'Validation failed', 
        details: result.success === false ? result.error.errors : [] 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if user has permission to update this project
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { team: true },
    });

    if (!user?.team || user.team.id !== body.teamId) {
      return new NextResponse(JSON.stringify({
        error: 'Forbidden',
        message: 'You do not have permission to update this project'
      }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update project
    const project = await prisma.project.update({
      where: { teamId: body.teamId },
      data: {
        name: body.title,
        mentorName: body.mentorName,
        mentorEmail: body.mentorEmail,
        theme: body.theme,
        targetBeneficiaries: body.targetBeneficiaries,
        socialImpact: body.socialImpact,
        implementationApproach: body.implementationApproach,
        status: body.status,
        currentMilestone: body.currentMilestone,
        nextMilestone: body.nextMilestone,
        challenges: body.challenges,
        achievements: body.achievements,
        location: body.location,
        updatedAt: new Date()
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