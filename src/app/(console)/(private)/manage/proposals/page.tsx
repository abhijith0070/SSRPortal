
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import ManageWrapper from '@/components/manage-page';
// import ManageUserTable from '@/app/(console)/(private)/manage/users/table';

const BREADCRUMBS = [
  {
    title: 'Dashboard',
    route: '/dashboard',
  },
  {
    title: 'Manage',
    route: '/manage',
  },
  {
    title: 'Users',
    route: '/manage/users',
  },
];

const getUsers = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/manage/users/`, {
    credentials: 'include',
    headers: { 
      'Content-Type': 'application/json',
      Cookie: cookies().toString(), 
    },
  });

  if(!res.ok) throw new Error('Failed to fetch data');
  return res.json();
};

const ManageUserPage = async () => {

  const users = await getUsers();
  notFound();  
  
  return (
      <ManageWrapper breadcrumbs={BREADCRUMBS} title="Manage Users" className="flex">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 my-10 p-4 bg-white rounded-lg shadow-xl shadow-gray-200 min-h-[36rem] w-full">
              <div className="col-span-2 md:col-span-3 flex overflow-hidden">
                  {/*<ManageUserTable data={users} />*/}
              </div>
              <div>
                  <div className="border border-dashed border-gray-400 h-full rounded-lg"></div>
              </div>
          </div>
      </ManageWrapper>
  );
};

export default ManageUserPage;