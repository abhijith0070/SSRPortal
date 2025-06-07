import { ColumnDef } from '@tanstack/react-table';

import { TUser } from '@/types/user';
import ManageUserActions from '@/app/(console)/(private)/manage/users/action';

export const columns: ColumnDef<TUser, TUser>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    cell: (data) => <ManageUserActions user={data.getValue()} />,
    header: 'Actions',
  },
];

export default columns;
