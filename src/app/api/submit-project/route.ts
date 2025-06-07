import { NextResponse } from 'next/server';
import { z } from 'zod';

import prisma from '@/lib/db/prisma';

const projectSubmissionSchema = z.object({
  ssrID: z.string(),

  report: z.string(),
  presentation: z.string(),
  video: z.string(),
  poster: z.string(),
  photos: z.array(z.string()),

  projectTitle: z.string(),
  projectDescription: z.string(),
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

    // Validate the request body
    const validatedData = projectSubmissionSchema.parse(body);

    // Extract the team code from ssrID
    const teamCode = validatedData.ssrID.replace(/[\s\-_]/g, '');

    // Check if team exists
    const team = await prisma.team.findUnique({
      where: { code: teamCode },
      include: { project: true },
    });

    if(!team)
      return new Response(JSON.stringify({ error: 'Team not found' }), { status: 404 });
    
    if(team.project)
      return new Response(JSON.stringify({ error: 'The Project has already been submitted for this team.' }), { status: 400 });

    const meta: { location: any, category: string | null } = {
      location: validatedData.projectLocation, 
      category: null,
    };
    let themeId = null;
    
    if(validatedData.projectCategory === 'Other') {
      meta.category = validatedData.otherCategory;
    }
    
    if(validatedData.projectCategory) {
      const res = await prisma.theme.findFirst({
        where: { name: validatedData.projectCategory },
      }).then(t => t);
      themeId = res?.id;
    }
    
    // Create the project
    const project = await prisma.project.create({
      data: {
        name: validatedData.projectTitle,
        description: validatedData.projectDescription,
        meta: meta,

        code: teamCode,
        video: validatedData.video,
        poster: validatedData.poster,
        report: validatedData.report,
        presentation: validatedData.presentation,
        gallery: validatedData.photos || [],

        themeId,
      },
    }).then(p => p);

    return NextResponse.json({
      message: 'Project submitted successfully',
      project: {
        id: project.id,
        name: project.name,
        code: project.code,
      },
    });

  } catch (error) {
    console.error('Project submission error:', error);

    if(error instanceof z.ZodError) {
      return new Response(JSON.stringify({
        error: 'Invalid submission data',
        details: error.errors,
      }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify({
      error: 'Failed to submit project',
    }), { status: 500 });
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
            code: true,
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