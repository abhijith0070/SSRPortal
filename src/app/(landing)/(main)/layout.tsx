import React from 'react';

import AppView from '../_appview';

const LayoutLanding = ({ children }: { children: React.ReactNode }) => {
  return (
      <AppView className="bg-gradient-to-br from-[#f6faff] to-[#f2f6fc] min-h-screen flex flex-col">
          {children}
      </AppView>
  );
};

export default LayoutLanding;