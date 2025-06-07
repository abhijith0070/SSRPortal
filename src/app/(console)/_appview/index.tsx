import React from 'react';

import Header from './header';
import Footer from './footer';

type AppViewProps = {
  children: React.ReactNode;
  className?: string;
};


const AppView = ({ children }: AppViewProps) => {
  return (
      <div className="min-h-screen flex flex-col justify-between text-color">
          <Header />
          <main className="w-full min-h-screen flex flex-col justify-between bg-gray-100 pt-[80px]">
              <div className="w-full h-full flex-grow flex">
                  {children}
              </div>
              <Footer />
          </main>
      </div>
  );
};

export default AppView;