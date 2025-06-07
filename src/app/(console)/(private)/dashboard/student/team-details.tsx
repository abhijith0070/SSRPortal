import Image from 'next/image';
import Link from 'next/link';

import { TEAM_PHASES } from './status-bar';

import { ITeam } from '@/app/(console)/types';

const TeamDetails = ({ team }: { team: ITeam }) => {
  return (
      <div className="w-full h-full bg-white rounded-xl p-4 flex flex-col items-center justify-start gap-4">
          <div className="bg-gradient-to-br from-primary to-blue-800 w-full rounded-lg p-6">
              <div className="text-white">Team ID</div>
              <div className="font-bold text-3xl text-white flex items-center gap-2">
                  23SSR024
              </div>
          </div>
          <div className="text-gray-900 flex flex-col w-full">
              <div className="font-bold text-gray-500 text-lg">Mentor</div>
              <div className="bg-slate-100 rounded-lg p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full">
                          <Image
                              src="/assets/avatar.svg"
                              alt="User"
                              width={100}
                              height={100}
                              className="rounded-full aspect-square"
                          />
                      </div>
                      <div className="text-left">
                          <div className="text-gray-700 font-bold text-lg">{team?.mentor?.name}</div>
                          <Link
                              href={`mailto:${team?.mentor?.email}`}
                              className="text-gray-700 text-sm underline"
                          >
                              {team?.mentor?.email}
                          </Link>
                      </div>
                  </div>
                  <div className="bg-white aspect-square border h-full flex justify-center items-center font-bold rounded-lg">
                      {team?.mentor?.uid}
                  </div>
              </div>
          </div>
          <div className="text-gray-900 grid grid-cols-4 gap-4 w-full">
              <div className="flex flex-col items-center text-4xl justify-center overflow-hidden bg-slate-100 rounded-lg p-4">
                  <div className="font-bold">{team?.stats?.proposals}</div>
                  <div className="text-gray-500 text-sm">Proposals</div>
              </div>
              <div className="flex flex-col items-center text-4xl justify-center overflow-hidden bg-slate-100 rounded-lg p-4">
                  <div className="font-bold">{team?.stats?.members}</div>
                  <div className="text-gray-500 text-sm">Members</div>
              </div>
              <div className="flex flex-col items-center text-center justify-center overflow-hidden bg-slate-100 rounded-lg p-4 col-span-2">
                  <div className="font-bold">{TEAM_PHASES[team?.stats?.status].label}</div>
                  <div className="text-gray-500 text-sm">Status</div>
              </div>
          </div>
          <div className="text-gray-900 flex flex-col mt-8 w-full flex-grow overflow-auto">
              <div className="font-bold text-gray-500 text-lg">Members</div>
              <div className="flex-grow overflow-auto">
                  <div className="flex flex-col max-h-[400px] gap-4">
                      {team?.members?.map((member, index) => (
                          <div className="bg-slate-100 rounded-lg p-4 flex items-center justify-between gap-4" key={index}>
                              <div className="flex items-center gap-4">
                                  <div className="w-16 h-16 rounded-full">
                                      <Image
                                          src="/assets/avatar.svg"
                                          alt="User"
                                          width={100}
                                          height={100}
                                          className="rounded-full aspect-square"
                                      />
                                  </div>
                                  <div className="text-left">
                                      <div className="text-gray-700 font-bold text-lg">{member[0]}</div>
                                      <div className="text-gray-500 text-sm">{member[1]}</div>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  );
};

export default TeamDetails;