
import prisma from '@/lib/db/prisma';

export async function GET(req: Request) {
  const code = req?.url?.split('/').pop();
  
  if(!code)
    return new Response(JSON.stringify({ error: 'Team code is required' }), { status: 400 });
  
  const team = await prisma.team.findUnique({
    where: { code },
    include: { project: { select: { id: true } }, mentor: true },
  });

  if(!team)
    return new Response(JSON.stringify({ error: 'Team not found' }), { status: 404 });
  
  return new Response(JSON.stringify(team), { status: 200 });
}