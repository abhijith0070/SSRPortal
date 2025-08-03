// import { redirect } from 'next/navigation';
// import { auth } from '@/lib/auth';
// import prisma from '@/lib/db/prisma';
// import UpdateTeamForm from '../updateteamform';
// import Link from 'next/link';
// import { Edit } from 'lucide-react';

// async function getTeamDetails(id: string) {
//   const session = await auth();
//   if (!session?.user) redirect('/auth/signin');

//   const team = await prisma.team.findFirst({
//     where: {
//       id: id,
//       mentorId: session.user.id
//     },
//     include: {
//       members: {
//         include: {
//           user: {
//             select: {
//               firstName: true,
//               lastName: true,
//               email: true,
//               role: true
//             }
//           }
//         }
//       },
//       lead: {
//         select: {
//           firstName: true,
//           lastName: true,
//           email: true
//         }
//       },
//       project: {
//         include: {
//           theme: true
//         }
//       },
//       proposals: true
//     }
//   });

//   if (!team) redirect('/dashboard/mentor/teams');
//   return team;
// }

// type TeamLead = {
//   firstName: string;
//   lastName: string;
//   email: string;
// };

// type TeamMember = {
//   id: string;
//   user: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     role: string;
//   };
// };

// type ProjectTheme = {
//   name: string;
// };

// type Project = {
//   title: string;
//   description: string;
//   theme?: ProjectTheme;
// };

// type Proposal = {
//   id: string;
//   title: string;
//   status: string;
//   description: string;
// };

// // Update Team type to match database schema
// type Team = {
//   id: string;
//   teamNumber: string;
//   projectTitle: string;
//   projectPillar: string;
//   status: 'PENDING' | 'APPROVED' | 'REJECTED';
//   mentorId: string;
//   leadId: string;
//   createdAt: Date;
//   updatedAt: Date;
//   lead: TeamLead;
//   members: TeamMember[];
//   project?: Project;
//   proposals: Proposal[];
// };

// export default async function TeamDetailPage({ params }: { params: { id: string } }) {
//   const team = await getTeamDetails(params.id);

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Team Details</h1>
      
//       <div className="grid gap-6">
//         {/* Team Info */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex justify-between items-start mb-4">
//             <div>
//               <h2 className="text-xl font-semibold">Team {team.teamNumber}</h2>
//               <p className="text-gray-600">{team.projectTitle}</p>
//               <p className="text-sm text-gray-500">Project Pillar: {team.projectPillar}</p>
//             </div>
//             <span className={`px-3 py-1 text-sm rounded-full ${
//               team.status === 'APPROVED' 
//                 ? 'bg-green-100 text-green-800'
//                 : team.status === 'REJECTED'
//                 ? 'bg-red-100 text-red-800'
//                 : 'bg-yellow-100 text-yellow-800'
//             }`}>
//               {team.status}
//             </span>
//           </div>
//         </div>
        
//         {/* Update Team Form */}
//         <Link
//         href={`/dashboard/mentor/teams/edit/${team.id}`}
//         className="bg-blue-500 rounded-md w-fit px-4 py-2 flex items-center gap-2 hover:bg-blue-600 transition-colors text-white"
//         title="Edit Team"
//             >


//         <Edit  className='text-white'/>
              
       
//          <span className='text-white'>Edit Team</span>
        
//             </Link>
   

//         {/* Team Members */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Team Members</h2>
          
//           {/* Team Leader */}
//           <div className="mb-6">
//             <h3 className="text-lg font-medium mb-3">Team Leader</h3>
//             <div className="p-4 bg-gray-50 rounded-lg">
//               <p className="font-medium">{team.lead.firstName} {team.lead.lastName}</p>
//               <p className="text-sm text-gray-600">{team.lead.email}</p>
//             </div>
//           </div>

//           {/* Other Members */}
//           <div>
//             <h3 className="text-lg font-medium mb-3">Members</h3>
//             <div className="grid gap-4">
//               {team.members
//                 .filter(member => !member.user.role.includes('LEADER'))
//                 .map((member) => (
//                   <div 
//                     key={member.id} 
//                     className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
//                   >
//                     <p className="font-medium">
//                       {member.user.firstName} {member.user.lastName}
//                     </p>
//                     <p className="text-sm text-gray-600">{member.user.email}</p>
//                   </div>
//                 ))
//               }
//             </div>
//           </div>
//         </div>

//         {/* Project Details */}
//         {team.project && (
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-xl font-semibold mb-4">Project Details</h2>
//             <p><span className="font-medium">Title:</span> {team.project.name}</p>
//             <p><span className="font-medium">Theme:</span> {team.project.theme?.name}</p>
//             <div className="mt-4">
//               <h3 className="font-medium mb-2">Description</h3>
//               <p className="text-gray-700">{team.project.description}</p>
//             </div>
//           </div>
//         )}

//         {/* Proposals */}
//         {team.proposals.length > 0 && (
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-xl font-semibold mb-4">Project Proposals</h2>
//             <div className="grid gap-4">
//               {team.proposals.map((proposal) => (
//                 <div key={proposal.id} className="p-4 border rounded-lg">
//                   <p><span className="font-medium">Title:</span> {proposal.title}</p>
//                   <p><span className="font-medium">Description:</span> {proposal.content}</p>
//                   <p className="mt-2 text-gray-700">{proposal.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { Edit } from 'lucide-react';

// type TeamLead = {
//   firstName: string;
//   lastName: string;
//   email: string;
// };

// type TeamMember = {
//   id: string;
//   user: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     role: string;
//   };
// };

// type ProjectTheme = {
//   name: string;
// };

// type Project = {
//   code: string;
//   title: string;
//   description: string;
//   theme?: ProjectTheme;
// };

// type Proposal = {
//   id: string;
//   title: string;
//   status: string;
//   description: string;
//   content?: string;
// };

// type Team = {
//   id: string;
//   teamNumber: string;
//   projectTitle: string;
//   projectPillar: string;
//   status: 'PENDING' | 'APPROVED' | 'REJECTED';
//   mentorId: string;
//   leadId: string;
//   createdAt: Date;
//   updatedAt: Date;
//   lead: TeamLead;
//   members: TeamMember[];
//   project?: Project;
//   proposals: Proposal[];
// };

// export default function TeamDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const [team, setTeam] = useState<Team | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchTeamDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`/api/mentor/teams/${params.id}`);
      
//       if (!response.ok) {
//         if (response.status === 401) {
//           router.push('/auth/signin');
//           return;
//         }
//         if (response.status === 404) {
//           router.push('/dashboard/mentor/teams');
//           return;
//         }
//         throw new Error('Failed to fetch team details');
//       }

//       const data = await response.json();
      
//       // Transform API response to match component expectations
//       const transformedTeam: Team = {
//         id: params.id as string,
//         teamNumber: data.name,
//         projectTitle: data.project?.title || '',
//         projectPillar: data.project?.pillar || '',
//         status: data.status,
//         mentorId: '',
//         leadId: '',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         lead: data.members.find((m: any) => m.role.includes('LEADER')) || { firstName: '', lastName: '', email: '' },
//         members: data.members.map((member: any) => ({
//           id: member.email, // Using email as id since it's unique
//           user: {
//             firstName: member.name.split(' ')[0] || '',
//             lastName: member.name.split(' ').slice(1).join(' ') || '',
//             email: member.email,
//             role: member.role
//           }
//         })),
//         project: data.project,
//         proposals: data.proposals
//       };

//       setTeam(transformedTeam);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (params.id) {
//       fetchTeamDetails();
//     }
//   }, [params.id]);

//   // Auto-refresh every 30 seconds to get latest data
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (params.id && !loading) {
//         fetchTeamDetails();
//       }
//     }, 30000);

//     return () => clearInterval(interval);
//   }, [params.id, loading]);

//   if (loading) {
//     return (
//       <div className="container mx-auto p-6">
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto p-6">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           <p>Error: {error}</p>
//           <button 
//             onClick={fetchTeamDetails}
//             className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!team) {
//     return (
//       <div className="container mx-auto p-6">
//         <p>Team not found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Team Details</h1>
//         <button 
//           onClick={fetchTeamDetails}
//           className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
//         >
//           Refresh
//         </button>
//       </div>
      
//       <div className="grid gap-6">
//         {/* Team Info */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex justify-between items-start mb-4">
//             <div>
//               <h2 className="text-xl font-semibold">Team {team.teamNumber}</h2>
//               <p className="text-gray-600">{team.projectTitle}</p>
//               <p className="text-sm text-gray-500">Project Pillar: {team.projectPillar}</p>
//             </div>
//             <span className={`px-3 py-1 text-sm rounded-full ${
//               team.status === 'APPROVED' 
//                 ? 'bg-green-100 text-green-800'
//                 : team.status === 'REJECTED'
//                 ? 'bg-red-100 text-red-800'
//                 : 'bg-yellow-100 text-yellow-800'
//             }`}>
//               {team.status}
//             </span>
//           </div>
//         </div>
        
//         {/* Update Team Form */}
//         <Link
//           href={`/dashboard/mentor/teams/edit/${team.id}`}
//           className="bg-blue-500 rounded-md w-fit px-4 py-2 flex items-center gap-2 hover:bg-blue-600 transition-colors text-white"
//           title="Edit Team"
//         >
//           <Edit className='text-white'/>
//           <span className='text-white'>Edit Team</span>
//         </Link>

//         {/* Team Members */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Team Members</h2>
          
//           {/* Team Leader */}
//           <div className="mb-6">
//             <h3 className="text-lg font-medium mb-3">Team Leader</h3>
//             {team.lead?.firstName ? (
//               <div className="p-4 bg-gray-50 rounded-lg">
//                 <p className="font-medium">{team.lead.firstName} {team.lead.lastName}</p>
//                 <p className="text-sm text-gray-600">{team.lead.email}</p>
//               </div>
//             ) : (
//               <div className="p-4 bg-gray-50 rounded-lg">
//                 <p className="text-gray-500">No team leader assigned</p>
//               </div>
//             )}
//           </div>

//           {/* Other Members */}
//           <div>
//             <h3 className="text-lg font-medium mb-3">Members</h3>
//             <div className="grid gap-4">
//               {team.members
//                 .filter(member => !member.user.role.includes('LEADER'))
//                 .map((member) => (
//                   <div 
//                     key={member.id} 
//                     className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
//                   >
//                     <p className="font-medium">
//                       {member.user.firstName} {member.user.lastName}
//                     </p>
//                     <p className="text-sm text-gray-600">{member.user.email}</p>
//                     <p className="text-xs text-gray-500">{member.user.role}</p>
//                   </div>
//                 ))
//               }
//               {team.members.filter(member => !member.user.role.includes('LEADER')).length === 0 && (
//                 <p className="text-gray-500">No other members found</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Project Details */}
//         {team.project && (
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-xl font-semibold mb-4">Project Details</h2>
//             <p><span className="font-medium">Code:</span> {team.project.code}</p>
//             <p><span className="font-medium">Title:</span> {team.project.title}</p>
//             {team.project.theme && (
//               <p><span className="font-medium">Theme:</span> {team.project.theme.name}</p>
//             )}
//             <div className="mt-4">
//               <h3 className="font-medium mb-2">Description</h3>
//               <p className="text-gray-700">{team.project.description}</p>
//             </div>
//           </div>
//         )}

//         {/* Proposals */}
//         {team.proposals.length > 0 && (
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-xl font-semibold mb-4">Project Proposals</h2>
//             <div className="grid gap-4">
//               {team.proposals.map((proposal) => (
//                 <div key={proposal.id} className="p-4 border rounded-lg">
//                   <p><span className="font-medium">Title:</span> {proposal.title}</p>
//                   {proposal.content && (
//                     <p><span className="font-medium">Content:</span> {proposal.content}</p>
//                   )}
//                   <p className="mt-2 text-gray-700">{proposal.description}</p>
//                   <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
//                     proposal.status === 'APPROVED' 
//                       ? 'bg-green-100 text-green-800'
//                       : proposal.status === 'REJECTED'
//                       ? 'bg-red-100 text-red-800'
//                       : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {proposal.status}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit } from 'lucide-react';

type TeamLead = {
  firstName: string;
  lastName: string;
  email: string;
};

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type ProjectTheme = {
  name: string;
};

type Project = {
  code: string;
  title: string;
  description: string;
  theme?: ProjectTheme;
};

type Proposal = {
  id: string;
  title: string;
  status: string;
  description: string;
  content?: string;
};

type Team = {
  id: string;
  teamNumber: string;
  projectTitle: string;
  projectPillar: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  mentorId: string;
  leadId: string;
  createdAt: Date;
  updatedAt: Date;
  lead: TeamLead | null;
  members: TeamMember[];
  project?: Project;
  proposals: Proposal[];
};

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/mentor/teams/${params.id}`);

      if (!response.ok) {
        const errorData = await response.text();

        if (response.status === 401) {
          router.push('/auth/signin');
          return;
        }
        if (response.status === 404) {
          router.push('/dashboard/mentor/teams');
          return;
        }
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const data = await response.json();

      const transformedTeam: Team = {
        id: data.id,
        teamNumber: data.name || '',
        projectTitle: data.projectTitle || '',
        projectPillar: data.projectPillar || '',
        status: data.status || 'PENDING',
        mentorId: '',
        leadId: '',
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        lead: data.lead || null,
        members: data.members || [],
        project: data.project,
        proposals: data.proposals || []
      };

      setTeam(transformedTeam);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchTeamDetails();
    }
  }, [params.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (params.id && !loading) {
        fetchTeamDetails();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [params.id, loading]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
          <button
            onClick={fetchTeamDetails}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="container mx-auto p-6">
        <p>Team not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Details</h1>
        {/* <button
          onClick={fetchTeamDetails}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
        >
          Refresh
        </button> */}
      </div>

      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">Team {team.teamNumber}</h2>
              <p className="text-gray-600">{team.projectTitle}</p>
              <p className="text-sm text-gray-500">Project Pillar: {team.projectPillar}</p>
            </div>
            <span className={`px-3 py-1 text-sm rounded-full ${
              team.status === 'APPROVED'
                ? 'bg-green-100 text-green-800'
                : team.status === 'REJECTED'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {team.status}
            </span>
          </div>
        </div>

        <Link
          href={`/dashboard/mentor/teams/edit/${team.id}`}
          className="bg-blue-500 rounded-md w-fit px-4 py-2 flex items-center gap-2 hover:bg-blue-600 transition-colors text-white"
        >
          <Edit className="text-white" />
          <span className="text-white">Edit Team</span>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Team Members</h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Team Leader</h3>
            {team.lead ? (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">{team.lead.firstName} {team.lead.lastName}</p>
                <p className="text-sm text-gray-600">{team.lead.email}</p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No team leader assigned</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Members</h3>
            <div className="grid gap-4">
              {team.members
                .filter(member => !member.role.includes('LEADER'))
                .map((member) => (
                  <div
                    key={member.id}
                    className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                ))}
              {team.members.filter(member => !member.role.includes('LEADER')).length === 0 && (
                <p className="text-gray-500">No other members found</p>
              )}
            </div>
          </div>
        </div>

        {team.project && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <p><span className="font-medium">Code:</span> {team.project.code}</p>
            <p><span className="font-medium">Title:</span> {team.project.title}</p>
            {team.project.theme && (
              <p><span className="font-medium">Theme:</span> {team.project.theme.name}</p>
            )}
            <div className="mt-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-700">{team.project.description}</p>
            </div>
          </div>
        )}

        {team.proposals.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Project Proposals</h2>
            <div className="grid gap-4">
              {team.proposals.map((proposal) => (
                <div key={proposal.id} className="p-4 border rounded-lg">
                  <p><span className="font-medium">Title:</span> {proposal.title}</p>
                  {proposal.content && (
                    <p><span className="font-medium">Content:</span> {proposal.content}</p>
                  )}
                  <p className="mt-2 text-gray-700">{proposal.description}</p>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    proposal.status === 'APPROVED'
                      ? 'bg-green-100 text-green-800'
                      : proposal.status === 'REJECTED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {proposal.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


