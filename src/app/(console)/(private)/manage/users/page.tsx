import { TUser } from '@/types/user';
import ManageWrapper from '@/components/manage-page';
import getUsers from '@/app/(console)/(private)/manage/users/fetch';
import ManageUsersView from '@/app/(console)/(private)/manage/users/view';

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

const ManageUserPage = async () => {

  const { users } = await getUsers() as { users: TUser[] };


  return (
      <ManageWrapper breadcrumbs={BREADCRUMBS} title="Manage Users" className="flex">
          <ManageUsersView users={users} />
      </ManageWrapper>
  );
};

export default ManageUserPage;