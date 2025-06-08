import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db/prisma';

const projectSubmissionSchema = z.object({
  ssrID: z.string(),
  report: z.string().url('Invalid report URL'),
  presentation: z.string().url('Invalid presentation URL'),
  video: z.string().url('Invalid video URL'),
  poster: z.string().url('Invalid poster URL'),
  photos: z.array(z.string().url('Invalid photo URL')),
  projectTitle: z.string().min(5, 'Title must be at least 5 characters'),
  projectDescription: z.string().min(100, 'Description must be at least 100 characters'),
  projectLocation: z.object({
    type: z.enum(['online', 'offline']),
    location: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
  }),
  projectCategory: z.string(),
  otherCategory: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = projectSubmissionSchema.parse(body);
    const teamCode = validatedData.ssrID.replace(/[\s\-_]/g, '');

    // Check if team exists
    const team = await prisma.team.findUnique({
      where: { id: teamCode },
      include: { project: true },
    });

    if (!team) {
      return NextResponse.json({ 
        success: false,
        error: 'Team not found' 
      }, { status: 404 });
    }

    if (team.project) {
      return NextResponse.json({ 
        success: false,
        error: 'Project already submitted for this team' 
      }, { status: 400 });
    }

    // Handle theme creation/connection
    let theme;
    if (validatedData.projectCategory === 'Other' && validatedData.otherCategory) {
      theme = await prisma.theme.create({
        data: { name: validatedData.otherCategory }
      });
    } else {
      const existingTheme = await prisma.theme.findFirst({
        where: { name: validatedData.projectCategory }
      });

      theme = existingTheme || await prisma.theme.create({
        data: { name: validatedData.projectCategory }
      });
    }

    // Create project
    const project = await prisma.project.create({
          data: {
            name: validatedData.projectTitle,
            description: validatedData.projectDescription,
            poster: validatedData.poster,
            link: validatedData.ssrID,
            video: validatedData.video,
            meta: JSON.stringify(validatedData.projectLocation),
            gallery: validatedData.photos.join(','),
            presentation: validatedData.presentation,
            report: validatedData.report,
            theme: {
              connectOrCreate: {
                where: { id: 0 },  // This will always create a new theme since id 0 won't exist
                create: { name: validatedData.projectCategory }
              }
            },
            Team: {
              connect: { id: teamCode }
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
      data: {
        id: project.id,
        name: project.name,
        code: project.code,
        themeId: project.themeId,
        themeName: project.description
      }
    });

  } catch (error) {
    console.error('Project submission error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid submission data',
        details: error.format()
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to submit project'
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const teamCode = searchParams.get('team');

  if(!teamCode) {
    return new Response(JSON.stringify({
      error: 'Missing team code',
    }), { status: 400 });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { code: teamCode },
      select: {
        id: true,
        name: true,
        description: true,
        poster: true,
        video: true,
        meta: true,
        isAccepted: true,
        Team: {
          select: {
            id: true,
            members: true,
            mentor: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if(!project) {
      return new Response(JSON.stringify({
        error: 'Project not found',
      }), { status: 404 });
    }

    return NextResponse.json(project);

  } catch (error) {
    console.error('Error fetching project:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch project',
    }), { status: 500 });
  }
}