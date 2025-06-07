'use client';

import React, { useState } from 'react';
import { GraduationCapIcon, PackageIcon, UsersIcon, XIcon } from 'lucide-react';
import Link from 'next/link';

import AddMentorForm from './add-mentor';
import AddProjectForm from './add-project';

import Drawer from '@/components/Drawer';

const Index = () => {

  const [open, setOpen] = useState<0 | 1 | 2 | 3 | 4>(0);
  const handleClose = () => setOpen(0);
    
  const QUICK_ACTIONS = [
    // {
    //   title: 'Add Student',
    //   icon: <UserIcon size="30" />,
    //   action: () => setOpen(1),
    // },
    {
      title: 'Add Mentor',
      icon: <GraduationCapIcon size="30" />,
      action: () => setOpen(2),
    },

    {
      title: 'Create Team',
      icon: <UsersIcon size="30" />,
      link: '/create/team/',
    },
      
    {
      title: 'Create Project',
      icon: <PackageIcon size="30" />,
      action: () => setOpen(3),
    },
  ];
  
  const drawerRenderer = () => {
    switch (open) {
      // case 1:
      //   return <AddStudentForm handleClose={handleClose} />;
      case 2:
        return <AddMentorForm handleClose={handleClose} />;
      case 3:
        return <AddProjectForm handleClose={handleClose} />;
      default:
        return <div />;
    }
  };
  
  return (
      <div className="flex flex-col items-start justify-start w-full h-full">
          <div className="justify-evenly w-full h-48 grid grid-cols-4 gap-4">
              {QUICK_ACTIONS.map((action, index) => (
                  <div
                      key={index}
                      className="w-full rounded-lg flex items-center justify-center bg-gray-100/50 border bg-white hover:border-primary hover:text-primary"
                  >
                      {action?.link ? (
                          <Link
                              href={action.link}
                              className="w-full h-full flex flex-col items-center justify-center text-xl gap-4"
                          >
                              {action.icon}
                              {action.title}
                          </Link>
                      ) : (
                          <button
                              className="w-full h-full flex flex-col items-center justify-center text-xl gap-4"
                              onClick={action.action}
                          >
                              {action.icon}
                              {action.title}
                          </button>
                      )}
                  </div>
              ))}
          </div>
          <Drawer
              isOpen={!!open}
              onClose={() => setOpen(0)}
              maxWidth="500px"
          >
              <div className="min-w-56 w-max h-full flex flex-col items-center justify-center relative">
                  <div className="absolute top-0 right-0 mt-4 mr-4 cursor-pointer" onClick={() => setOpen(0)}>
                      <XIcon />
                  </div>
                  <div className="w-[300px] md:w-[500px] h-full p-4 md:p-8">
                      {drawerRenderer()}
                  </div>
              </div>
          </Drawer>
      </div>
  );
};

export default Index;