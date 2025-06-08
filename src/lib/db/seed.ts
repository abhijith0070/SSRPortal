// import { PrismaClient } from '@prisma/client';
// import { hash } from 'bcryptjs';

// const prisma = new PrismaClient();

// // Define themes data
// const THEMES = [
//   { id: 1, name: 'Drug Awareness', description: 'Projects focused on drug awareness and prevention' },
//   { id: 2, name: 'Cybersecurity', description: 'Projects related to cybersecurity awareness' },
//   { id: 3, name: 'Health & Wellbeing', description: 'Projects promoting health and wellness' },
//   { id: 4, name: 'Indian Culture', description: 'Projects celebrating Indian culture and heritage' },
//   { id: 5, name: 'Skill Building', description: 'Projects focused on skill development' },
//   { id: 6, name: 'Environment', description: 'Environmental awareness and conservation projects' },
//   { id: 7, name: 'Women Empowerment', description: 'Projects supporting women empowerment' },
//   { id: 8, name: 'Peer Mentorship', description: 'Peer-to-peer mentoring initiatives' },
//   { id: 9, name: 'Technical Projects', description: 'Technology and innovation projects' },
//   { id: 10, name: 'Financial Literacy', description: 'Projects promoting financial education' },
// ];

// async function main() {
//   try {
//     console.log('Starting database seed...');

//     // Clear existing data
//     await prisma.project.deleteMany();
//     await prisma.proposal.deleteMany();
//     await prisma.teamMember.deleteMany();
//     await prisma.team.deleteMany();
//     await prisma.theme.deleteMany();
//     await prisma.user.deleteMany();
//     console.log('Cleared existing data');

//     // Create themes
//     await Promise.all(
//       THEMES.map((theme) => 
//         prisma.theme.create({
//           data: theme,
//         })
//       )
//     );
//     console.log('Created themes');

//     // Create admin user
//     const adminPassword = await hash('admin123', 12);
//     const admin = await prisma.user.create({
//       data: {
//         firstName: 'Admin',
//         lastName: 'User',
//         email: 'admin@ssr.com',
//         password: adminPassword,
//         isAdmin: true,
//         isStaff: true,
//         canLogin: true,
//         role: 'ADMIN',
//         emailVerified: new Date(),
//       },
//     });
//     console.log('Created admin user');

//     // Create mentor user
//     const mentorPassword = await hash('mentor123', 12);
//     const mentor = await prisma.user.create({
//       data: {
//         firstName: 'Mentor',
//         lastName: 'User',
//         email: 'mentor@ssr.com',
//         password: mentorPassword,
//         isStaff: true,
//         canLogin: true,
//         role: 'MENTOR',
//         emailVerified: new Date(),
//       },
//     });
//     console.log('Created mentor user');

//     // Create a team with members
//     const team = await prisma.team.create({
//       data: {
//         id: 'SSR2024001',
//         projectTitle: 'Sample Project',
//         projectPillar: 'TECHNICAL_PROJECTS',
//         teamNumber: 'SSR2024001',
//         batch: '2024',
//         status: 'PENDING',
//         mentorId: mentor.id,
//         members: {
//           create: [
//             {
//               name: 'John Doe',
//               email: 'john@example.com',
//               rollNumber: '20CS001',
//               role: 'LEADER',
//               userId: admin.id,
//             },
//             {
//               name: 'Jane Smith',
//               email: 'jane@example.com',
//               rollNumber: '20CS002',
//               role: 'MEMBER',
//               userId: mentor.id,
//             },
//           ],
//         },
//       },
//     });
//     console.log('Created team with members');

//     // Create a project for the team
//     await prisma.project.create({
//       data: {
//         name: 'Sample Technical Project',
//         description: 'A sample project description',
//         code: team.id,
//         gallery: '[]',
//         themeId: 9, // Technical Projects theme
//         meta: JSON.stringify({
//           status: 'IN_PROGRESS',
//           location: {
//             type: 'OFFLINE',
//             city: 'Sample City',
//             state: 'Sample State',
//           },
//         }),
//       },
//     });
//     console.log('Created project');

//     // Create a proposal
//     await prisma.proposal.create({
//       data: {
//         title: 'Sample Proposal',
//         description: 'A sample proposal description',
//         content: 'Detailed proposal content goes here...',
//         state: 'PENDING',
//         authorId: admin.id,
//         teamCode: team.id,
//         updated_at: new Date(),
//       },
//     });
//     console.log('Created proposal');

//     console.log('Database seeding completed successfully');
//   } catch (error) {
//     console.error('Error seeding database:', error);
//     process.exit(1);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// main()
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });