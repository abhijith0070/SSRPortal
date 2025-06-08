import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  theme: z.string().min(3, 'Theme is required'),
  description: z.string().min(100, 'Description must be at least 100 characters'),
  poster: z.string().url('Invalid poster URL').optional(),
  link: z.string().url('Invalid link URL').optional(),
  video: z.string().url('Invalid video URL').optional(),
  meta: z.object({
    mentorName: z.string().min(3, 'Mentor name must be at least 3 characters'),
    mentorEmail: z.string().email('Invalid mentor email'),
    status: z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED']),
    currentMilestone: z.string().min(5),
    nextMilestone: z.string().min(5),
    challenges: z.string().optional(),
    achievements: z.string().optional(),
    location: z.object({
      type: z.enum(['ONLINE', 'OFFLINE']),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional()
    })
  }),
  presentation: z.string().url('Invalid presentation URL').optional(),
  report: z.string().url('Invalid report URL').optional(),
  gallery: z.string().default('[]')
});

// GET - List all projects for the team
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse(JSON.stringify({
        error: 'Unauthorized',
        message: 'Please sign in to view projects'
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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

    // Get team's projects
    const projects = await prisma.project.findMany({
      where: { Team: { id: user.team.id } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return new NextResponse(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Failed to fetch projects'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST - Create a new project
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Please sign in to create a project'
      }, { status: 401 });
    }

    const body = await req.json();
    const validation = projectSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
      }, { status: 400 });
    }

    const data = validation.data;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { team: true },
    });

    if (!user?.team) {
      return NextResponse.json({
        success: false,
        error: 'Team not found',
        message: 'You must be part of a team to create a project'
      }, { status: 404 });
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name: data.title,
        description: data.description,
        poster: data.poster,
        link: data.link,
        video: data.video,
        meta: JSON.stringify(data.meta),
        gallery: data.gallery,
        presentation: data.presentation,
        report: data.report,
        theme: {
          connectOrCreate: {
            where: { id: 0 },  // This will always create a new theme since id 0 won't exist
            create: { name: data.theme }
          }
        },
        Team: {
          connect: { id: user.team.id }
        }
      },
      include: {
        Team: {
          include: {
            mentor: true
          }
        },
        theme: true
      }
    });

    return NextResponse.json({
      success: true,
      data: project
    });

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Failed to create project'
    }, { status: 500 });
  }
}