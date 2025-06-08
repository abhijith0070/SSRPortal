// import { NextResponse } from 'next/server';
// import { auth } from '@/lib/auth';
// import prisma from '@/lib/db/prisma';

// export async function POST(req: Request) {
//   try {
//     const session = await auth();
//     if (!session?.user?.id) {
//       return new NextResponse(JSON.stringify({
//         error: 'Unauthorized',
//         message: 'Please sign in to update project'
//       }), { 
//         status: 401,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     const body = await req.json();
    
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

//     // Find existing project
//     const existingProject = await prisma.project.findFirst({
//       where: { teamId: user.team.id }
//     });

//     if (!existingProject) {
//       // Create new project if none exists
//       const project = await prisma.project.create({
//         data: {
//           name: body.title,
//           theme: body.theme,
//           mentorName: body.mentorName,
//           mentorEmail: body.mentorEmail,
//           targetBeneficiaries: body.targetBeneficiaries,
//           socialImpact: body.socialImpact,
//           implementationApproach: body.implementationApproach,
//           status: body.status,
//           currentMilestone: body.currentMilestone,
//           nextMilestone: body.nextMilestone,
//           challenges: body.challenges,
//           achievements: body.achievements,
//           location: body.location,
//           teamId: user.team.id
//         }
//       });
//       return NextResponse.json(project);
//     }

//     // Update existing project
//     const project = await prisma.project.update({
//       where: { 
//         id: existingProject.id,
//         teamId: user.team.id // Ensure project belongs to user's team
//       },
//       data: {
//         name: body.title,
//         theme: body.theme,
//         mentorName: body.mentorName,
//         mentorEmail: body.mentorEmail,
//         targetBeneficiaries: body.targetBeneficiaries,
//         socialImpact: body.socialImpact,
//         implementationApproach: body.implementationApproach,
//         status: body.status,
//         currentMilestone: body.currentMilestone,
//         nextMilestone: body.nextMilestone,
//         challenges: body.challenges,
//         achievements: body.achievements,
//         location: body.location,
//         updatedAt: new Date()
//       }
//     });

//     return NextResponse.json(project);
//   } catch (error) {
//     console.error('Error updating project:', error);
//     return new NextResponse(JSON.stringify({
//       error: 'Internal Server Error',
//       message: 'Failed to update project'
//     }), { 
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// } 