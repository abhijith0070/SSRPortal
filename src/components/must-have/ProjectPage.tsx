import Link from 'next/link';
import {
  ArrowRightIcon,
  ExternalLinkIcon,
  HomeIcon,
  Share2Icon,
  UserIcon,
} from 'lucide-react';
import React from 'react';
import clsx from 'clsx';

import ProjectFileItem from '@/app/p/[slug]/project-item';
import Gallery from '@/app/p/[slug]/gallery';
import ReviewerPanel from '@/app/p/[slug]/reviewer-panel';


const ProjectPage = ({ project }: { project :any }) => {

  const { Team: team } = project;
  const PROJECT_ITEMS = [
    {
      name: 'Poster',
      url: project.poster,
      type: 'IMAGE',
    },
    {
      name: 'Video',
      url: project.video,
      type: 'VIDEO',
    },
    {
      name: 'Presentation',
      url: project.presentation,
      type: project?.presentation?.includes('pdf') ? 'PDF' : 'PPT',
    },
    {
      name: 'Report',
      url: project.report,
      type: 'PDF',
    },
  ];

  return (
      <div className="bg-gray/40">
          <div className="px-4 py-6 container mx-auto flex-grow flex flex-col">
              <div className="flex justify-between mt-4">
                  <div className="flex items-center gap-2 opacity-50">
                      <Link href="/">
                          <HomeIcon size="18" />
                      </Link>
                      <span>/</span>
                      <Link href="/projects">
                          Projects
                      </Link>
                      <span>/</span>
                      <Link href={`/p/${project?.code}`}>
                          <span className="font-semibold uppercase">{project.code}</span>
                      </Link>
                  </div>
                  <div className="flex gap-2">
                      <Link
                          href="/projects"
                          className="text-primary border duration-100 hover:border-primary/40 group bg-blue-50 px-4 flex items-center justify-center rounded-lg gap-1"
                      >
                          All Projects
                          {' '}
                          <ArrowRightIcon size="18" className="opacity-70 group-hover:opacity-100" />
                      </Link>
                      <button className="text-primary bg-blue-50 hover:bg-blue-100 h-12 w-12 flex items-center justify-center rounded-lg">
                          <Share2Icon />
                      </button>
                  </div>
              </div>
              <div className="bg-white rounded-lg mt-6 h-full">
                  <div className="relative rounded-lg">
                      <div className="flex items-center justify-center flex-col rounded-lg min-h-[30rem] h-full w-full object-cover border py-12 px-4 xl:px-0">
                          <div className="w-full max-w-full xl:max-w-[900px]">
                              {!project?.isAccepted && <ReviewerPanel team={team} />}
                              <div className="bg-background border rounded-lg grid grid-cols-4">
                                  <div
                                      className={clsx('flex flex-col gap-2 p-6 items-start justify-start mb-2', project?.link ? 'col-span-3' : 'col-span-4')}
                                  >
                                      <div className="text-left text-3xl font-bold mb-2">{project.name}</div>
                                      <div className="flex justify-center items-center text-sm">
                                          Team
                                          {' '}
                                          {project?.code}
                                          {' | '}
                                          {project?.theme?.name}
                                      </div>
                                  </div>
                                  {project?.link && (
                                      <Link
                                          href={project?.link}
                                          className="flex flex-col text-white font-bold justify-center items-center text-lg gap-2 rounded-r-lg bg-primary backdrop-blur ml-5"
                                      >
                                          Open
                                          <ExternalLinkIcon size="20" />
                                      </Link>
                                  )}
                              </div>
                              <div className="grid md:grid-cols-3 xl:grid-cols-3 gap-4 mt-8">
                                  <div
                                      className="max-w-[300px] bg-gradient-to-br from-primary to-primary/80 w-full rounded-lg p-4"
                                  >
                                      <div className="text-white text-sm">Team ID</div>
                                      <div className="font-bold text-2xl text-white flex items-center gap-2">
                                          {team?.code}
                                      </div>
                                  </div>
                                  {team?.mentor && (
                                      <div className="bg-slate-100 rounded-lg flex items-center justify-between gap-4 max-w-[300px] w-full p-4">
                                          <div className="flex items-center gap-4">
                                              {/*<div className="w-16 h-16 rounded-full aspect-square">*/}
                                              {/*    <Image*/}
                                              {/*        src="/assets/avatar.svg"*/}
                                              {/*        alt="User"*/}
                                              {/*        width={100}*/}
                                              {/*        height={100}*/}
                                              {/*        className="rounded-full aspect-square"*/}
                                              {/*    />*/}
                                              {/*</div>*/}
                                              <div className="text-left">
                                                  <div className="text-gray-700 font-bold text-lg">{team?.mentor?.firstName + ' ' + team?.mentor?.lastName}</div>
                                                  <div className="text-sm text-gray-500">
                                                      <span className="mr-2">Mentor</span>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  )}
                                  {team?.members?.map((member: any, index: string) => (
                                      <div
                                          className="bg-slate-100 rounded-lg p-4 flex items-center justify-between gap-4 max-w-[300px]"
                                          key={index}
                                      >
                                          <div className="text-gray-900 flex flex-col w-full">
                                              <div className="gap-4">
                                                  <div
                                                      className="w-12 h-12 hidden bg-gray-50 flex items-center justify-center rounded-full"
                                                  >
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
                                                      <div title={member[1]} className="text-gray-700 line-clamp-1 font-bold text-lg">{member.name}</div>
                                                      <div className="text-gray-500 text-sm">{member.id}</div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                              {PROJECT_ITEMS.filter(i => i?.url).map((item) => (
                                  <ProjectFileItem
                                      key={item.name}
                                      type={item.type}
                                      label={item.name}
                                      url={item.url}
                                      code={project.code}
                                  />
                              ))}
                              <Gallery images={project.gallery} />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default ProjectPage;