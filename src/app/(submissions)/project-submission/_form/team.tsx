import React, { useState } from 'react';
import { Book, UserIcon } from 'lucide-react';
import toast from "react-hot-toast";
import Image from 'next/image';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormSection, { IFormSection } from '@/app/(submissions)/project-submission/_form/_section';
import FormItem from '@/app/(submissions)/project-submission/_form/_item';

type TeamFieldsSectionProps = {
  teamIDs: string[],
  team: any,
  setTeam: any,
  onTeamSelect: any,
} & IFormSection;


const TeamFieldsSection = ({ control, teamIDs, team, setTeam, onTeamSelect, errors }: TeamFieldsSectionProps) => {
    
  const [loading, setLoading] = useState(false);

  const getTeamDetails = async (code) => {
    const res = await fetch(`/api/get/team/${code.replace(/[\s\-_]/g, '')}`);
    if(!res.ok) {
      toast('Failed to fetch team details');
      setLoading(false);
    }
    const data = await res.json();
    setLoading(false);
    onTeamSelect(data);
  };

  return (
      <FormSection
          control={control}
          Icon={Book}
          title="Team Information"
          description="Please select your team ID from the list below. If your team doesn't exist, contact your mentor."
          items={[
            {
              name: 'teamId',
              renderer: ({ field }) => (
                  <FormItem title="Team ID" error={errors?.teamId}>
                      <Select 
                          onValueChange={(e) => {
                            setLoading(true);
                            setTeam(null);
                            field.onChange(e);
                            getTeamDetails(e);
                          }} 
                          value={field.value}
                      >
                          <SelectTrigger>
                              <SelectValue placeholder="Select your team ID" />
                          </SelectTrigger>
                          <SelectContent>
                              {teamIDs.map(id => (
                                  <SelectItem key={id} value={id}>{id}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  </FormItem>
              ),
            },
          ]}
          customFooterRender={() => (
              <div className="w-full">
                  {loading && (
                      <div>
                          <div className="bg-background h-[200px] flex items-center justify-center w-full">
                              <div
                                  className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                  role="status"
                              />
                              <div className="uppercase font-light ml-4 text-primary text-xl">
                                  Loading
                              </div>
                          </div>
                      </div>
                  )}
                  {team && (
                      <div className="grid md:grid-cols-3 gap-3 w-full">
                          <div className="bg-gradient-to-br from-primary to-blue-800 w-full rounded-lg p-4">
                              <div className="text-white text-sm">Team ID</div>
                              <div className="font-bold text-2xl text-white flex items-center gap-2">
                                  {team?.code.slice(0, -3) + '-' + team?.code?.slice(-3)}
                              </div>
                          </div>
                          {team?.mentor && (
                              <>
                                  <div className="bg-slate-100 rounded-lg p-4 flex items-center justify-between gap-4">
                                      <div className="text-gray-900 flex flex-col w-full">
                                          <div className="flex items-center gap-4">
                                              <div
                                                  className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-full">
                                                  {/*<Image*/}
                                                  {/*    src="/assets/avatar.svg"*/}
                                                  {/*    alt="User"*/}
                                                  {/*    width={100}*/}
                                                  {/*    height={100}*/}
                                                  {/*    className="rounded-full aspect-square"*/}
                                                  {/*/>*/}
                                                  <UserIcon className="opacity-30"/>
                                              </div>
                                              <div className="text-left">
                                                  <div className="text-gray-700 font-bold text-lg">{team?.mentor?.firstName + " " + team?.mentor?.lastName}</div>
                                                  <div className="text-gray-500 text-sm">Mentor</div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </>
                          )}
                          {team?.members?.map((member, index) => (
                              <div className="bg-slate-100 rounded-lg p-4 flex items-center justify-between gap-4"
                                   key={index}>
                                  <div className="text-gray-900 flex flex-col w-full">
                                      <div className="flex items-center gap-4">
                                          <div
                                              className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-full">
                                              {/*<Image*/}
                                              {/*    src="/assets/avatar.svg"*/}
                                              {/*    alt="User"*/}
                                              {/*    width={100}*/}
                                              {/*    height={100}*/}
                                              {/*    className="rounded-full aspect-square"*/}
                                              {/*/>*/}
                                              <UserIcon className="opacity-30"/>
                                          </div>
                                          <div className="text-left">
                                              <div className="text-gray-700 font-bold text-lg">{member?.name}</div>
                                              <div className="text-gray-500 text-sm">{member?.id}</div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          )}
      />
  );
};


export default TeamFieldsSection;