import React from 'react';
import clsx from 'clsx';

import Header from './header';
import Footer from './footer';

type AppViewProps = {
  children: React.ReactNode;
  className?: string;
  scrollEffect?: boolean;
  variant?: 'shadow' | 'line';
};


const AppView = ({ children, className, scrollEffect = true, variant = 'shadow' }: AppViewProps) => {
  return (
      <div className="min-h-screen flex flex-col justify-between text-color">
          <div className={className}>
              <Header scrollEffect={scrollEffect} variant={variant} />
              <main className={clsx(['w-full h-full', !scrollEffect && 'pt-[80px]'])}>{children}</main>
          </div>
          <Footer />
      </div>
  );
};

export default AppView;