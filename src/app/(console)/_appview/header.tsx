import React from 'react';
import Link from 'next/link';

import { auth } from '@auth';
import UserDropdown from '@/app/(console)/_appview/user-dropdown';


const Header = async () => {

  const session = await auth();
  const user = session?.user;
    
  return (
      <header className="transition-all duration-300 ease-in-out fixed w-full z-50 h-[80px] border-b bg-white">
          <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
              <Link href="/dashboard" className="flex title-font font-semibold items-center text-primary mb-4 md:mb-0">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-10 h-10 text-white p-2 bg-primary rounded-full"
                      viewBox="0 0 24 24"
                  >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <span className="ml-3 text-xl">SSR Connect</span>
              </Link>
              <div>
                  <UserDropdown user={user} />
              </div>
          </div>
      </header>
  );
};

export default Header;
