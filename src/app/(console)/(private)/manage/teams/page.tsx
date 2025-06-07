


import React from 'react';

import ManageWrapper from '@/components/manage-page';
import prisma from '@/lib/db/prisma';
import ManageTeamTable from '@/app/(console)/(private)/manage/teams/table';

const BREADCRUMBS = [
  {
    title: 'Dashboard',
    route: '/dashboard',
  },
  {
    title: 'Manage',
    route: '/manage',
  },
  {
    title: 'Teams',
    route: '/manage/teams',
  },
];

const getTeams = async () => {
  const teams = await prisma.team.findMany();
  return teams || [];
};

const ManageTeamsPage = async () => {

  const teams = await getTeams() as any[];

  return (
      <ManageWrapper breadcrumbs={BREADCRUMBS} title="Manage Users" className="flex">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 my-10 p-4 bg-white rounded-lg shadow-xl shadow-gray-200 min-h-[36rem] w-full">
              <div className="col-span-2 md:col-span-3 flex overflow-hidden">
                  <ManageTeamTable data={teams} />
              </div>
              <div>
                  <div className="border border-dashed border-gray-400 h-full rounded-lg"></div>
              </div>
          </div>
      </ManageWrapper>
  );
};

export default ManageTeamsPage;