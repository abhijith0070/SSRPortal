'use client';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { signIn, signOut } from 'next-auth/react';
import React from 'react';
import { LogOutIcon, UserIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { User } from '@prisma/client';


const UserDropdown = ({ user } : { user: User | undefined }) => {

  if(user) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <button>
                    <div className="flex items-center">
                        <div className="mr-2">
                            {user?.image ? (
                                <Image
                                    src={user?.image}
                                    alt="avatar"
                                    width={24}
                                    height={24}
                                    className="w-10 h-10 rounded-full"
                                />
                            ) : (
                                <UserIcon className="w-10 h-10 p-2.5 rounded-full bg-primary text-white" />
                            )}
                        </div>
                        <div className="flex flex-col items-start">
                            <div className="text-sm">
                                {user?.firstName}
                                {' '}
                                {user?.lastName}
                            </div>
                            <div className="text-xs text-gray-400/90">
                                {user?.email.split('@')[0]}
                            </div>
                        </div>
                    </div>
                </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-white mt-2 border p-2 rounded shadow-lg min-w-[200px] gap-2 flex flex-col">
                <Link href="/profile">
                    <DropdownMenu.Item className="p-2 cursor-pointer border border-transparent hoverborder-primary rounded hover:text-primary hover:bg-gray-100 transition-all transform">
                        My Profile
                    </DropdownMenu.Item>
                </Link>
                <DropdownMenu.Separator className="border-b border-primary border-opacity-20" />
                <DropdownMenu.Item className="p-2 cursor-pointer items-center flex gap-1.5 border border-transparent hoverborder-danger rounded hover:text-danger hover:bg-gray-100 transition-all transform" onClick={() => signOut()}>
                    <LogOutIcon className="rotate-180" size="16" />
                    Logout
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
  }
  return (
      <button onClick={() => signIn()} className="text-green-600 ml-auto">
          Sign In
      </button>
  );
};

export default UserDropdown;