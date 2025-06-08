// import { NextResponse } from 'next/server';
// import { auth } from '@/lib/auth';
// import prisma from '@/lib/db/prisma';

// export async function GET() {
//   try {
//     const session = await auth();
    
//     if (!session?.user?.id) {
//       return NextResponse.json({
//         success: false,
//         error: 'Unauthorized',
//         message: 'Please sign in to view project details'
//       }, { status: 401 });
//     }

//     // Get user's team
//     const user = await prisma.user.findUnique({
//       where: { id: session.user.id },
//       include: { team: true },
//     });

//     if (!user?.team) {
//       return NextResponse.json({
//         success: false,
//         error: 'Team not found',
//         message: 'You must be part of a team to view project details'
//       }, { status: 404 });
//     }

//     // Get active project for the team
//     const project = await prisma.project.findFirst({
//       where: {
//         Team: {
//           id: user.team.id
//         },
//         projectStatus: 'ACTIVE',
//       },
//       include: {
//         Team: {
//           include: {
//             members: {
//               include: {
//                 user: {
//                   select: {
//                     id: true,
//                     firstName: true,
//                     lastName: true,
//                     role: true,
//                   }
//                 }
//               }
//             },
//             lead: {
//               select: {
//                 id: true,
//                 firstName: true,
//                 lastName: true,
//                 email: true,
//               },
//             },
//             mentor: {
//               select: {
//                 id: true,
//                 firstName: true,
//                 lastName: true,
//                 email: true,
//               },
//             },
//           },
//         },
//         resources: {
//           select: {
//             id: true,
//             title: true,
//             type: true,
//             link: true,
//             description: true,
//           },
//         },
//       },
//     });

//     if (!project) {
//       return NextResponse.json({
//         success: false,
//         error: 'Not found',
//         message: 'No active project found for your team'
//       }, { status: 404 });
//     }

//     return NextResponse.json({
//       success: true,
//       data: project
//     });

//   } catch (error) {
//     console.error('Error fetching project:', error);
//     return NextResponse.json({
//       success: false,
//       error: 'Internal server error',
//       message: error instanceof Error ? error.message : 'Failed to fetch project details'
//     }, { status: 500 });
//   }
// }