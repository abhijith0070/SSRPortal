import { redirect } from 'next/navigation';

import { auth } from '@auth';

const PrivateLayout = async ({ children }: { children: React.ReactNode }) => {
    
  const session = await auth();
  if(!session?.user) redirect('/login?callback=/dashboard');

  return (
      // eslint-disable-next-line react/jsx-no-useless-fragment
      <> 
          { children }
      </>
  );
};

export default PrivateLayout;