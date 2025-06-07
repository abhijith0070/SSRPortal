import Link from 'next/link';
import { PlusIcon } from 'lucide-react';

import TeamStatusBar from './status-bar';

import { ITeam, PROPOSAL_STATUS } from '@/app/(console)/types';

const ProposalAccepted = ({ team } : { team: ITeam }) => {
    
  const proposal = team?.proposals.filter(item => item.status === PROPOSAL_STATUS.ACCEPTED)[0];
    
  return (
      <div className="flex flex-col h-full p-4">
          <TeamStatusBar
              status={team?.stats?.status}
              subtext={`Your proposal - ${proposal.title} - has been accepted`}
              actionRenderer={(
                  <Link href="/create/project" className="bg-primary/90 w-max hover:bg-primary rounded-lg px-4 py-3 text-white font-semibold text-xl flex justify-between items-center gap-8">
                      <div>Create Project</div>
                      <PlusIcon size={22} />
                  </Link>
              )}
          />
          <div className="flex flex-col flex-grow justify-center items-center mt-4">
              <Link
                  href={`/proposal/${proposal.id}`}
                  className="border flex justify-center flex-col items-center p-5 rounded-lg"
              >
                  <div className="text-gray-900 text-2xl font-bold mb-2">
                      {proposal.title}
                  </div>
                  <div className="text-gray-500 text-sm max-w-[350px] text-center">
                      {proposal.description}
                  </div>
              </Link>
              <div className="text-gray-400 text-xs my-4">
                  This proposal was accepted. You can now create a project.
              </div>
              <Link href="/create/project" className="bg-primary/90 w-max hover:bg-primary rounded-lg px-4 py-2 text-white font-semibold flex justify-between items-center gap-4">
                  Create Project
                  <PlusIcon size={20} />
              </Link>
          </div>
      </div>
  );
};

export default ProposalAccepted;