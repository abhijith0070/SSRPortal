import MentorDashboardView from '@/app/(console)/(private)/dashboard/mentor/view';
import prisma from '@/lib/db/prisma';
import auth from '@auth';

const getDashboardData = async () => {
    const session = await auth();
    const user = session?.user;
    if(!user?.isStaff) return { error: 'Unauthorized', status: 401 };

    // Fetch stats from the API
    const stats = await prisma.project.findMany({
        where: {
            Team: { mentorId: user?.id }
        },
        include: {
            Team: {
                include: {
                    members: true,
                }
            },
            theme: true,
        },
    });

    return {
        projects: stats,
        stats: {
            teams: {
                total: stats.length,
                pending: stats.filter(p => !p.isAccepted).length,
                approved: stats.filter(p => p.isAccepted).length,
            },
            themes: Object.entries(stats.reduce((acc, project) => {
                const themeName = project.theme?.name || 'Uncategorized';
                acc[themeName] = (acc[themeName] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)),
            students: stats.reduce((acc, p) => acc + (p.Team?.members?.length || 0), 0)
        }
    };
};

const MentorDashboard = async () => {
    const data = await getDashboardData();

    return (
        <div className="mx-auto container">
            <MentorDashboardView
                data={data?.projects}
                stats={data?.stats}
            />
        </div>
    );
};

export default MentorDashboard;