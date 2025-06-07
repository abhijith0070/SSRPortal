import React from 'react';
import { EyeOffIcon, UserIcon } from 'lucide-react';

import AcceptButton from '@/app/p/[slug]/accept-button';

const ReviewerPanel = ({ team }) => {

  return (
      <div className="bg-background border rounded-lg mb-8 p-4">
          <div className="text-sm font-semibold opacity-40 flex gap-2 items-center">
              <EyeOffIcon size="16" />
              This section is only visible to you. The project is currently under review and will be published once
              accepted.
          </div>
          <div className="mt-4 flex justify-between items-end">
              <div
                  className="bg-slate-100 rounded-lg p-4 flex items-center justify-between gap-4 max-w-[240px] w-full"
              >
                  <div className="text-gray-900 flex flex-col w-full">
                      <div className="gap-4">
                          <div className="w-12 h-12 hidden bg-gray-50 flex items-center justify-center rounded-full">
                              {/*<Image*/}
                              {/*    src="/assets/avatar.svg"*/}
                              {/*    alt="User"*/}
                              {/*    width={100}*/}
                              {/*    height={100}*/}
                              {/*    className="rounded-full aspect-square"*/}
                              {/*/>*/}
                              <UserIcon className="opacity-30" />
                          </div>
                          <div className="text-left">
                              <div className="text-gray-700 line-clamp-1 font-bold text-lg">
                                  {team?.mentor ? (team?.mentor?.firstName + ' ' + team?.mentor?.lastName) : (
                                      <span className="text-red-500">Not Assigned</span>)}
                              </div>
                              <div className="text-gray-500 text-sm">Reviewer / Mentor</div>
                          </div>
                      </div>
                  </div>
              </div>
              <AcceptButton team={team} />
          </div>
      </div>

  );
};

export default ReviewerPanel;