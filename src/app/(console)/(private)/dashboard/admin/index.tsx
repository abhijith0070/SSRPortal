import Link from 'next/link';
import { PackageIcon, UserIcon, UsersIcon } from 'lucide-react';
import React from 'react';

import Index from './quick-actions';



const ACTIONS = [
  {
    title: 'Manage Projects',
    icon: <PackageIcon />,
    link: '/manage/projects',
  },
  // {
  //   title: 'Manage Proposals',
  //   icon: <FileTextIcon />,
  //   // link: '/manage/proposals',
  //   link: '#',
  // },
  {
    title: 'Manage Teams',
    icon: <UsersIcon />,
    link: '/manage/teams',
  },
  {
    title: 'Manage Users',
    icon: <UserIcon />,
    link: '/manage/users',
  },
  // create project
  // import students
  // import mentors
  // import teams
  // import proposals
  // import projects
];

const AdminDashboard = () => {
  return (
      <div className="py-8 flex-grow container mx-auto px-4 flex flex-col gap-4">
          {/*<div className="mt-4">*/}
          {/*    <SSREventCard />*/}
          {/*</div>*/}
          <div className="mt-4">
              <div className="text-xl text-gray-500 font-semibold mb-2">Quick Actions</div>
              <Index />
          </div>
          <div className="mt-8">
              <div className="text-xl text-gray-500 font-semibold mb-2">Portals</div>
              <div className="grid grid-cols-4 gap-4">
                  {ACTIONS.map((action, index) => (
                      <Link href={action.link} className="bg-white border hover:border-primary hover:text-primary transform flex justify-between duration-300 rounded-md p-5" key={index}>
                          <div className="text-xl font-bold">{action.title}</div>
                          <div>{action.icon}</div>
                      </Link>
                  ))}
              </div>
          </div>
          <div className="mt-8">
              <div className="text-xl text-gray-500 font-semibold mb-2">Import</div>
              <div className="grid grid-cols-4 gap-4">
                  <Link href="/import/team" className="bg-white border hover:border-primary hover:text-primary transform flex justify-between duration-300 rounded-md p-5">
                      <div className="text-xl font-bold">Team & Members</div>
                      <div><PackageIcon /></div>
                  </Link>
                  <Link href="/import/team-mentor" className="bg-white border hover:border-primary hover:text-primary transform flex justify-between duration-300 rounded-md p-5">
                      <div className="text-xl font-bold">Mentor -to- Team</div>
                      <div><PackageIcon /></div>
                  </Link>
              </div>
          </div>
      </div>
  );
};

export default AdminDashboard;