'use client';
import { useState } from 'react';
import { EllipsisIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown';

const ManageUserActions = ({ user: TUser }) => {
  
  const [view, setView] = useState<'UPDATE' | 'RESET' | 'VIEW'>(null);
  return (
      <div>
          <DropdownMenu>
              <DropdownMenuTrigger>
                  <EllipsisIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setView('VIEW')}>View Profile</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setView('UPDATE')}>Update Profile</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setView('RESET')}>Reset Password</DropdownMenuItem>
              </DropdownMenuContent>
          </DropdownMenu>
          {/*<ActionDrawer user={user} view={view} />*/}
      </div>
  );
};

export default ManageUserActions;