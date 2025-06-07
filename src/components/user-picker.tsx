'use client';

import { XIcon } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

import Drawer from './Drawer';

const UserPicker = ({ open, setOpen }: { open?: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) => {

  const handleClose = () => setOpen(false);

  return (
      <Drawer
          isOpen={!!open}
          onClose={handleClose}
      >
          <div className="min-w-56 h-full flex flex-col items-center justify-center relative">
              <div className="absolute top-0 right-0 mt-4 mr-4 cursor-pointer" onClick={handleClose}>
                  <XIcon />
              </div>
              <div className="w-[300px] md:w-[500px] h-full p-4 md:p-8">
                  <div />
                  asd
              </div>
          </div>
      </Drawer>
  );
};

export default UserPicker;