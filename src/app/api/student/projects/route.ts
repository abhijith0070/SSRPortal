// import { NextResponse } from 'next/server';
// import { auth } from '@/lib/auth';
// import prisma from '@/lib/db/prisma';
// import { z } from 'zod';

// const projectSchema = z.object({
//   title: z.string().min(5, 'Title must be at least 5 characters'),
//   theme: z.string().min(3, 'Theme is required'),
//   mentorName: z.string().min(3, 'Mentor name must be at least 3 characters'),
//   mentorEmail: z.string().email('Invalid mentor email'),
//   targetBeneficiaries: z.string().min(50, 'Target beneficiaries description must be at least 50 characters'),
//   socialImpact: z.string().min(100, 'Social impact description must be at least 100 characters'),
//   implementationApproach: z.string().min(100, 'Implementation approach must be at least 100 characters'),
//   status: z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED']),
//   currentMilestone: z.string().min(5, 'Current milestone must be at least 5 characters'),
//   nextMilestone: z.string().min(5, 'Next milestone must be at least 5 characters'),
//   challenges: z.string().optional(),
//   achievements: z.string().optional(),
//   location: z.object({
//     type: z.enum(['ONLINE', 'OFFLINE']),
//     address: z.string().optional(),
//     city: z.string().optional(),
//     state: z.string().optional()
//   })
// });

// // GET - List all projects for the team
// export async function GET() {
//   try {
//     const session = await auth();
//     if (!session?.user?.id) {
//       return new NextResponse(JSON.stringify({
//         error: 'Unauthorized',
//         message: 'Please sign in to view projects'
//       }), { 
//         status: 401,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     // Get user's team
//     const user = await prisma.user.findUnique({
//       where: { id: session.user.id },
//       include: { team: true },
//     });

//     if (!user?.team) {
//       return new NextResponse(JSON.stringify({
//         error: 'Not Found',
//         message: 'No team found'
//       }), { 
//         status: 404,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     // Get team's projects
//     const projects = await prisma.project.findMany({
//       where: { teamId: user.team.id },
//       orderBy: { updatedAt: 'desc' },
//     });

//     return NextResponse.json(projects);
//   } catch (error) {
//     console.error('Error fetching projects:', error);
//     return new NextResponse(JSON.stringify({
//       error: 'Internal Server Error',
//       message: 'Failed to fetch projects'
//     }), { 
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }

// // POST - Create a new project
// export async function POST(req: Request) {
//   try {
//     const session = await auth();
//     if (!session?.user?.id) {
//       return new NextResponse(JSON.stringify({
//         error: 'Unauthorized',
//         message: 'Please sign in to create a project'
//       }), { 
//         status: 401,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     const body = await req.json();
    
//     // Validate request body
//     const validationResult = projectSchema.safeParse(body);
//     if (!validationResult.success) {
//       return new NextResponse(JSON.stringify({
//         error: 'Validation Error',
//         message: 'Invalid project data',
//         details: validationResult.error.errors
//       }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     // Get user's team
//     const user = await prisma.user.findUnique({
//       where: { id: session.user.id },
//       include: { team: true },
//     });

//     if (!user?.team) {
//       return new NextResponse(JSON.stringify({
//         error: 'Not Found',
//         message: 'You must be part of a team to create a project'
//       }), { 
//         status: 404,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     // Check if team already has a project
//     const existingProject = await prisma.project.findFirst({
//       where: { teamId: user.team.id }
//     });

//     if (existingProject) {
//       return new NextResponse(JSON.stringify({
//         error: 'Conflict',
//         message: 'Your team already has a project'
//       }), {
//         status: 409,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     // Create new project
//     const project = await prisma.project.create({
//       data: {
//         name: body.title,
//         code: user.team.code, // Use team code as project code
//         description: `${body.targetBeneficiaries}\n\nSocial Impact:\n${body.socialImpact}\n\nImplementation:\n${body.implementationApproach}`,
//         meta: JSON.stringify({
//           mentorName: body.mentorName,
//           mentorEmail: body.mentorEmail,
//           status: body.status,
//           currentMilestone: body.currentMilestone,
//           nextMilestone: body.nextMilestone,
//           challenges: body.challenges || '',
//           achievements: body.achievements || '',
//           location: body.location
//         }),
//         // Find or create theme
//         theme: {
//           connectOrCreate: {
//             where: { name: body.theme },
//             create: { name: body.theme }
//           }
//         },
//         Team: {
//           connect: { code: user.team.code }
//         }
//       }
//     });

//     return new NextResponse(JSON.stringify({
//       message: 'Project created successfully',
//       project
//     }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   } catch (error) {
//     console.error('Error creating project:', error);
//     if (error instanceof prisma.PrismaClientKnownRequestError) {
//       if (error.code === 'P2002') {
//         return new NextResponse(JSON.stringify({
//           error: 'Conflict',
//           message: 'A project with this name already exists'
//         }), {
//           status: 409,
//           headers: { 'Content-Type': 'application/json' }
//         });
//       }
//     }
//     return new NextResponse(JSON.stringify({
//       error: 'Internal Server Error',
//       message: 'Failed to create project'
//     }), { 
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// } 