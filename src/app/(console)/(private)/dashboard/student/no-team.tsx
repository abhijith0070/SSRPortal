import { Users2Icon } from 'lucide-react';
import Image from 'next/image';

const NoTeam = () => (
    <div className="flex flex-col justify-center items-center rounded-xl bg-white h-full p-5">
        <Image src="/assets/community.svg" alt="Team" width={600} height={600} />
        <div className="bg-gradient-to-br from-primary to-blue-700 rounded-lg p-8">
            <div className="font-bold text-4xl text-white mb-2 flex items-center gap-2">
                <Users2Icon size={40} /> 
                {' '}
                <span>Join a team</span>
            </div>
            <div className="text-gray-200 text-left text-xs">You are not added to any team yet. Please contact your mentor for more information</div>
        </div>
    </div>
);

export default NoTeam;