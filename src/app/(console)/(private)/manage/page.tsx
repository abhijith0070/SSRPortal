import { FileTextIcon, PackageIcon, UserIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';

import ManageWrapper from '@/components/manage-page';

const BREADCRUMBS = [
  {
    title: 'Dashboard',
    route: '/dashboard',
  },
  {
    title: 'Manage',
    route: '/manage',
  },
];

const ACTIONS = [
  {
    title: 'Projects',
    icon: <PackageIcon size={40} />,
    link: '/manage/projects',
  },
  {
    title: 'Proposals',
    icon: <FileTextIcon size={40} />,
    link: '/manage/proposals',
  },
  {
    title: 'Teams',
    icon: <UsersIcon size={40} />,
    link: '/manage/teams',
  },
  {
    title: 'Users',
    icon: <UserIcon size={40} />,
    link: '/manage/users',
  },
];

//   @todo: create layout page and allow only admin-7903 type users to access this layout


const ManagePage = () => {
  return (
      <ManageWrapper breadcrumbs={BREADCRUMBS} title="Manage">
          <div className="flex">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-20">
                  {ACTIONS.map((action, index) => (
                      <Link
                          className="flex flex-col items-center justify-center p-4 w-32 h-32 sm:w-44 sm:h-44 md:w-64 md:h-64 border rounded-lg cursor-pointer bg-white hover:bg-primary hover:text-primaryTextColor transition-colors"
                          key={index}
                          href={action.link}
                      >
                          <div>{action.icon}</div>
                          <div className="text-2xl mt-2 font-medium">{action.title}</div>
                      </Link>
                  ))}
              </div>
          </div>
      </ManageWrapper>
  );
};

export default ManagePage;