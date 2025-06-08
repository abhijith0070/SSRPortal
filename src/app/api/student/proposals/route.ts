// import { NextResponse } from 'next/server';
// import { auth } from '@/lib/auth';
// import prisma from '@/lib/db/prisma';
// import { z } from 'zod';

// const proposalSchema = z.object({
//   title: z.string().min(5, 'Title must be at least 5 characters'),
//   description: z.string().min(100, 'Description must be at least 100 characters'),
//   content: z.string().min(100, 'Content must be at least 100 characters'),
//   attachment: z.string().url('Invalid URL').optional(),
//   link: z.string().url('Invalid URL').optional(),
// });

// export async function POST(req: Request) {
//   try {
//     const session = await auth();
//     if (!session?.user?.id) {
//       return NextResponse.json({ 
//         success: false,
//         error: 'Unauthorized',
//         message: 'Please sign in to submit a proposal'
//       }, { status: 401 });
//     }

//     const body = await req.json();
//     const validation = proposalSchema.safeParse(body);
    
//     if (!validation.success) {
//       return NextResponse.json({
//         success: false,
//         error: 'Validation failed',
//         details: validation.error.format()
//       }, { status: 400 });
//     }

//     const data = validation.data;

//     // Get user's team
//     const user = await prisma.user.findUnique({
//       where: { id: session.user.id },
//       include: { team: true },
//     });

//     if (!user?.team) {
//       return NextResponse.json({
//         success: false,
//         error: 'Team not found',
//         message: 'You must be part of a team to submit a proposal'
//       }, { status: 404 });
//     }

//     // Create proposal
//     const proposal = await prisma.proposal.create({
//       data: {
//         title: data.title,
//         description: data.description,
//         content: data.content,
//         attachment: data.attachment,
//         link: data.link,
//         state: 'DRAFT',
//         teamId: user.team.id,
//         authorId: session.user.id,
//         updated_at: new Date(),
//       },
//       include: {
//         author: {
//           select: {
//             firstName: true,
//             lastName: true,
//             email: true
//           }
//         },
//         team: {
//           include: {
//             mentor: {
//               select: { email: true }
//             }
//           }
//         }
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       data: proposal
//     });

//   } catch (error) {
//     console.error('Error creating proposal:', error);
//     return NextResponse.json({
//       success: false,
//       error: 'Internal server error',
//       message: error instanceof Error ? error.message : 'Failed to create proposal'
//     }, { status: 500 });
//   }
// }

// export async function GET() {
//   try {
//     const session = await auth();
//     if (!session?.user?.id) {
//       return NextResponse.json({
//         success: false,
//         error: 'Unauthorized'
//       }, { status: 401 });
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: session.user.id },
//       include: { team: true },
//     });

//     if (!user?.team) {
//       return NextResponse.json({
//         success: false,
//         error: 'Team not found'
//       }, { status: 404 });
//     }

//     const proposals = await prisma.proposal.findMany({
//       where: {
//         team: {
//           id: user.team.id
//         },
//       },
//       orderBy: {
//         updated_at: 'desc',
//       },
//       include: {
//         author: {
//           select: {
//             firstName: true,
//             lastName: true,
//             email: true
//           }
//         }
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       data: proposals
//     });

//   } catch (error) {
//     console.error('Error fetching proposals:', error);
//     return NextResponse.json({
//       success: false,
//       error: 'Internal server error'
//     }, { status: 500 });
//   }
// }