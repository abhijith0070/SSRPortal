import React from 'react';

import AppView from '../_appview';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
      <AppView scrollEffect={false}>
          {children}
      </AppView>
  );
};

export default Layout;