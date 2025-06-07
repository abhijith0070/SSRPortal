'use client';

import { useState } from 'react';

import { TUser } from '@/types/user';
import ManageUserTable from '@/app/(console)/(private)/manage/users/data-table';
import UserDetails from '@/app/(console)/(private)/manage/users/details';
import UserColumns from '@/app/(console)/(private)/manage/users/columns';

const ManageUsersView = ({ users } : { users: TUser[] }) => {
    
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
    
  return (
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 my-10 p-4 bg-white rounded-lg shadow-xl shadow-gray-200 min-h-[36rem] w-full">
          <div className="col-span-2 md:col-span-3 flex overflow-hidden">
              <ManageUserTable<TUser, TUser> intialData={users} onSelect={(d) => setSelectedUser(d)} columns={UserColumns} />
          </div>
          <div>
              <div className="border border-dashed border-gray-400 h-full rounded-lg">
                  <UserDetails user={selectedUser} />
              </div>
          </div>
      </div>
  );
};

export default ManageUsersView;