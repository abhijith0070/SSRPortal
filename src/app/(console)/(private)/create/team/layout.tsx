import React from 'react';
import { notFound } from 'next/navigation';

import { auth } from '@auth';
import { getMentors } from '@/lib/actions/adminActions';
import CreateTeamPage from '@/app/(console)/(private)/create/team/page';

const CreateTeamLayout = async ({ children: _ }: { children: React.ReactNode }) => {

  const session = await auth();
  const user = session?.user;
  
  if(!user?.isAdmin) notFound();

  const mentors = await getMentors();
  
  return <CreateTeamPage mentors={mentors} />;
};

export default CreateTeamLayout;