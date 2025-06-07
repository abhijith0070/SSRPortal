'use client';
import React, { useState } from 'react';
import { ChevronRightIcon, MenuIcon } from 'lucide-react';
import { SwipeableDrawer } from '@mui/material';
import Link from 'next/link';

import { MENU_ITEMS } from '@/app/(landing)/_appview/header';


const MobileNavBar = () => {
    
  const [isOpen, setOpen] = useState(false);
  
  return (
      <div>
          <button onClick={() => setOpen(p => !p)}>
              <MenuIcon />
          </button>
          <SwipeableDrawer
              open={isOpen}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              anchor="right"
          >
              <div className="w-[calc(100vw-100px)] p-6 h-full flex flex-col justify-between">
                  <div className="w-full h-full flex flex-col gap-4">
                      {MENU_ITEMS.map(i => (
                          <Link
                              className="inline-flex items-center justify-between transition-colors text-black text-xl border-0 py-3 px-4 hover:bg-gray-200 rounded-lg font-semibold"
                              key={i.name}
                              href={i.href}
                          >
                              {i.name}
                          </Link>
                      ))}
                  </div>
                  <Link
                      href="/portal"
                      className="inline-flex items-center justify-between bg-primary/90 transition-colors text-white border-0 py-3 px-4 hover:bg-primary rounded-lg text-base font-semibold"
                  >
                      <div>Member Portal</div>
                      <ChevronRightIcon className="ml-2" size={20} />
                  </Link>
              </div>
          </SwipeableDrawer>
      </div>
  );
};

export default MobileNavBar;