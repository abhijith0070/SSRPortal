import Image from 'next/image';

import { TEAM_DATA } from '@/app/(landing)/(other)/web-team/data';

const WebTeamPage = () => {
    
  const data = [
    {
      heading: 'Mentors',
      data: TEAM_DATA.mentors,
    },
    {
      heading: 'Team -- (2022-23)',
      data: TEAM_DATA.members['2223'],
      type: 'members',
    },
    {
      heading: 'Team 24 (2023-24)',
      data: TEAM_DATA.members['2324'],
      type: 'members',
    },
  ];
    
  return (
      <div className="container mx-auto pb-24">
          <div>
              <h1 className="text-4xl font-bold text-left text-primary mt-12 mb-2">Web Team</h1>
              <div className="text-left text-gray-500 text-sm">
                  Meet the team behind SSR Website and Portal
              </div>
          </div>
          <div className="flex flex-col gap-4">
              {data.map((d) => (
                  <div key={d.heading} className="ml-12">
                      <h2 className="text-2xl font-bold mt-12 mb-4 text-primary">{d.heading}</h2>
                      <div className="flex gap-4">
                          {d.data.map((u :{ name: string, image:string }) => (
                              <div key={u?.name} className="flex flex-col items-center justify-center">
                                  <Image src={u?.image} alt={u?.image} width={100} height={100} className="rounded-full aspect-square object-cover object-center bg-background" />
                                  {u?.name}
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );
};

export default WebTeamPage;