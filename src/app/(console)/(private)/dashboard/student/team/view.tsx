import Link from 'next/link';

export default function TeamView({ team }: { team: any }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{team.name}</h2>
        <span className={`px-3 py-1 rounded-full text-sm ${
          team.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
          team.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {team.status}
        </span>
      </div>

      {team.statusMessage && (
        <div className={`mb-4 p-4 rounded ${
          team.status === 'REJECTED' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
        }`}>
          <p>{team.statusMessage}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Team details */}
        <div>
          <h3 className="font-medium mb-2">Project Details</h3>
          <p><strong>Title:</strong> {team.projectTitle}</p>
          <p><strong>Pillar:</strong> {team.projectPillar}</p>
          <p><strong>Mentor:</strong> {team.mentor?.firstName} {team.mentor?.lastName}</p>
        </div>

        {/* Team members */}
        <div>
          <h3 className="font-medium mb-2">Team Members</h3>
          <ul className="space-y-1">
            {team.members.map((member: any) => (
              <li key={member.id}>
                {member.user.firstName} {member.user.lastName} - {member.user.email}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {team.status === 'REJECTED' && (
        <div className="mt-6">
          <Link 
            href="/dashboard/student/team/edit"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Edit and Resubmit
          </Link>
        </div>
      )}
    </div>
  );
}