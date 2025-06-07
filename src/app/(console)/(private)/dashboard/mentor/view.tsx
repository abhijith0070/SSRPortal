'use client';
import Link from 'next/link';
import {ExternalLinkIcon} from 'lucide-react';

import {Card} from '@/components/ui/card';


const MentorDashboardView = ({ data, stats }) => {


    const STATS = [
        {
            label: 'Total SSR Projects',
            value: stats.totalProjects,
        },
        {
            label: 'Total Projects Mentored',
            value: stats.totalMyProjects,
        },

        {
            label: 'Current Completed Projects',
            value: stats.completedMyProjects,
        },
        {
            label: 'Pending Project Reviews',
            value: stats.pendingMyProjects,
        },
    ];
    
    return (
        <div className="p-5 flex-grow w-full flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-4 mt-4">
                {STATS.map((stat, index) => (
                    <div className="w-full min-h-56 bg-white border rounded-lg flex p-4" key={index}>
                        <div>
                            <div className="mb-2 text-base font-medium text-gray-400">
                                {stat.label}
                            </div>
                            <div className="text-3xl font-semibold text-gray-700">
                                {stat.value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-4 rounded-lg border mt-8">
                <div className="text-xl text-gray-500 font-semibold mb-8">Pending Reviews</div>
                {data?.length === 0 ? (
                    <Card className="border max-w-[500px] rounded-md mx-auto duration-200 mb-5 p-5 flex items-center justify-center">
                        <div className="text-xl text-gray-500 font-semibold py-24 text-center">
                            <div className="text-2xl font-bold text-primary">
                                Great job! No pending reviews.
                            </div>
                            <div className="text-primary opacity-40">
                                You're all caught up.
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-4">
                        {data?.map((project, index) => (
                            <Link href={`/p/${project.code}`} key={index} className="group">
                                <Card className="bg-blue-50 border rounded-md duration-200 group-hover:bg-primary p-5">
                                    <div className="flex justify-between">
                                        <div className="text-2xl font-bold flex gap-2 group-hover:text-white items-center">
                                            {project.name}
                                            <span className="group-hover:block hidden"><ExternalLinkIcon /></span>
                                        </div>
                                    </div>
                                    <div className="mt-2 mb-4 font-bold text-primary group-hover:text-white">
                                        {project.code}
                                    </div>
                                    <div className="opacity-80 mt-4 mb-1 group-hover:text-white">Team Members</div>
                                    <div className="flex flex-wrap gap-4">
                                        {project.Team.members && project.Team.members.map((member, index) => (
                                            <div key={index} className="bg-white rounded-md p-3 w-[200px]">
                                                <div className="font-bold line-clamp-1 overflow-hidden">{member.name}</div>
                                                <div className="text-xs">{member.id}</div>
                                            </div>
                                ))}
                                    </div>
                                </Card>
                            </Link>
                    ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentorDashboardView;