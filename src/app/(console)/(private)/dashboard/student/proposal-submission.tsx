import Image from 'next/image';
import { ChevronRightIcon, EditIcon, FileTextIcon, LinkIcon, PlusIcon, Share2Icon } from 'lucide-react';
import Link from 'next/link';
import { formatDistance } from 'date-fns';

import TeamStatusBar from './status-bar';

import { ITeam } from '@/app/(console)/types';
import handleShare from '@/lib/handle-share';

const ProposalSubmission = ({ team }: { team:ITeam }) => {
  return team?.stats?.proposals === 0 ? (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
          <Image src="/assets/blog.svg" alt="Submit Proposal" width={700} height={700} />
          <div className="bg-gradient-to-br from-primary to-blue-700 rounded-lg p-6 max-w-[400px]">
              <div className="font-bold text-3xl text-white mb-2 flex items-center gap-2">
                  <FileTextIcon size={30} />
                  <span>Submit a proposal</span>
              </div>
              <div className="text-gray-200 text-left text-xs">
                  Your team has not submitted any proposals yet. Get started by submitting your first proposal.
              </div>
              <Link href="/dashboard/proposals/create">
                  <div className="mt-4 flex justify-between bg-white hover:bg-white/90 text-primary rounded-lg py-3 px-4 font-bold cursor-pointer">
                      <div>Create proposal</div>
                      <ChevronRightIcon size={22} />
                  </div>
              </Link>
          </div>
      </div>
  ) : (
      <div className="flex flex-col p-4">
          <TeamStatusBar 
              status={team?.stats?.status}
              subtext={`Your team has submitted ${team?.stats?.proposals} proposals`}
              actionRenderer={(
                  <Link href="/dashboard/proposals/create" className="bg-primary/90 w-max hover:bg-primary rounded-lg px-4 py-3 text-white font-bold text-xl flex justify-between items-center gap-8">
                      <div>Create proposal</div>
                      <PlusIcon size={22} />
                  </Link>
              )}
          />
          <div>
              <div className="text-gray-500 text-lg font-bold mt-4 mb-2">
                  Our Proposals
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-[42rem] overflow-auto">
                  {team?.proposals?.map((proposal, index) => (
                      <Link
                          className="w-full min-h-56 relative group bg-slate-50 hover:bg-blue-50 rounded-lg duration-100 flex p-4 hover:border-primary border border-transparent"
                          href={`/dashboard/proposals/${proposal.id}`}
                          key={index}
                      >
                          <div>
                              <div className="text-xl flex gap-2 text-ellipsis font-medium text-gray-900 items-center">
                                  <div>{proposal.title}</div>
                                  {' '}
                                  <LinkIcon className="text-gray-300" size={16} />
                              </div>
                              <div className="text-gray-500 text-sm">
                                  {proposal.description}
                              </div>
                              <div className="text-gray-400 text-xs mt-4">
                                  {proposal?.timestamp && formatDistance(new Date(proposal.timestamp), new Date(), { addSuffix: true })}
                              </div>
                          </div>
                          <div className="group-hover:flex flex-col justify-evenly items-end hidden">
                              <Link
                                  href="#"
                                  onClick={(e) => handleShare(e, proposal, `/dashboard/proposals/${proposal.id}`)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2"
                              >
                                  <Share2Icon size={20} />
                              </Link>
                              <Link
                                  href={`/dashboard/proposals/${proposal.id}/edit`}
                                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2"
                              >
                                  <EditIcon size={20} />
                              </Link>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      </div>
  );
};

export default ProposalSubmission;