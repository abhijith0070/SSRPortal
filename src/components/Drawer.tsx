import React from 'react';
import clsx from 'clsx';

type DrawerProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  maxWidth?: string | number
};

const Drawer = ({ children, maxWidth = 1000, isOpen, onClose }: DrawerProps) => {
  return (
      <main
          className={clsx([
            'fixed overflow-hidden z-10 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out',
            isOpen ? 'transition-opacity opacity-100' : 'opacity-0 translate-x-full delay-75',
          ])}
      >
          <section
              style={{ maxWidth }}
              className={clsx([
                'w-full right-0 absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform',
                isOpen ? 'translate-x-0' : 'translate-x-full',
              ])}
          >
              <article className="relative w-screen max-w-lg pb-10 flex flex-col space-y-6 overflow-y-scroll h-full">
                  <header className="p-4 font-bold text-lg">Header</header>
                  {children}
              </article>
          </section>
          <section
              className="w-screen h-full cursor-pointer"
              onClick={onClose}
          ></section>
      </main>
  );
};

export default Drawer;