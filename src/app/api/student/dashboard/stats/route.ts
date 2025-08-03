import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Fetch team data including members
    const team = await prisma.team.findFirst({
      where: {
        OR: [
          { leadId: session.user.id },
          { members: { some: { userId: session.user.id } } }
        ]
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                mID: true
              }
            }
          }
        },
        mentor: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!team) {
      return NextResponse.json(null);
    }

    // Transform the data to match ProjectStats interface
    const projectStats = {
      teamName: team.teamNumber,
      projectTitle: team.projectTitle,
      status: team.status,
      completedMilestones: 0, // Add your milestone logic here
      totalMilestones: 5,
      nextDeadline: 'TBD',
      mentorName: team.mentor ? `${team.mentor.firstName} ${team.mentor.lastName}` : 'Not Assigned',
      lastUpdate: new Date(team.updatedAt).toLocaleDateString(),
      members: team.members.map(member => ({
        name: member.user ? `${member.user.firstName} ${member.user.lastName}` : 'Unknown User', // Don't fallback to member.name
        email: member.user?.email || 'No email',
        rollNumber: member.user?.mID || 'No roll',
        isLeader: member.userId === team.leadId
      })),
      recentActivities: [] // Add your activities logic here
    };

    console.log('Returning project stats:', projectStats); // Debug log
    return NextResponse.json(projectStats);

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

// export async function GET() {
//   try {
//     const session = await auth();
//     if (!session?.user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const team = await prisma.team.findFirst({
//       where: {
//         OR: [
//           { leadId: session.user.id },
//           { members: { some: { userId: session.user.id } } }
//         ]
//       },
//       include: {
//         members: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 firstName: true,
//                 lastName: true,
//                 email: true,
//                 rollno: true, // Note: your schema uses 'rollno', not 'rollNumber'
//                 mID: true
//               }
//             }
//           }
//         },
//         lead: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
//             rollno: true,
//             mID: true
//           }
//         },
//         mentor: {
//           select: {
//             firstName: true,
//             lastName: true
//           }
//         }
//       }
//     });

//     if (!team) {
//       return NextResponse.json(null);
//     }

//     // Since leader is stored in both places, just use TeamMember data
//     // and mark the leader based on the leadId
//     const members = team.members.map(member => ({
//       name: member.user ? 
//         `${member.user.firstName} ${member.user.lastName}` : 
//         member.name,
//       email: member.user?.email || member.email,
//       rollNumber: member.user?.rollno || member.user?.mID || member.rollNumber,
//       isLeader: member.userId === team.leadId // Check if this member is the leader
//     }));

//     const projectStats = {
//       teamName: team.teamNumber,
//       projectTitle: team.projectTitle,
//       status: team.status,
//       completedMilestones: 0,
//       totalMilestones: 10,
//       nextDeadline: 'TBD',
//       mentorName: team.mentor ? 
//         `${team.mentor.firstName} ${team.mentor.lastName}` : 
//         'Not assigned',
//       lastUpdate: 'Recently',
//       members: members, // This should now show exactly 4 members (including leader)
//       recentActivities: []
//     };

//     console.log('Team data:', team);
//     console.log('Team members count:', team.members?.length);
//     console.log('Team leader ID:', team.leadId);
//     console.log('Final members array:', members);
//     console.log('Final members count:', members.length);

//     return NextResponse.json(projectStats);
//   } catch (error) {
//     console.error('Error fetching dashboard stats:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }