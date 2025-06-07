
export const TEAM_PHASES = {
  'PROPOSAL_SUBMISSION': {
    label: 'Proposals Submission',
    description: 'During proposal submission phase, your web-team can submit multiple proposals for different project ideas.',
  },
  'PROPOSAL_ACCEPTED': {
    label: 'Proposal Accepted',
    description: 'Once your proposal is accepted, your web-team must create a project inorder to start working on it.',
  },
  'PROJECT_IN_PROGRESS': {
    label: 'Project In-progress',
    description: 'During project in progress phase, your web-team will be working on the selected project.',
  },
  'PROJECT_REVIEW': {
    label: 'Project Review',
    description: 'During project submission phase, your web-team will submit the project for evaluation.',
  },
  'PROJECT_COMPLETED': {
    label: 'Project Completed',
    description: 'Thank you for being a part of the program. Your web-team has successfully completed the project.',
  },
};

type TStatusBar = {
  status: keyof typeof TEAM_PHASES;
  subtext: string;
  actionRenderer: React.ReactNode;
};

const TeamStatusBar = ({ status, subtext, actionRenderer }: TStatusBar) => (
    <div className="flex justify-between w-full border rounded-lg p-4">
        <div className="text-gray-900">
            <div className="font-medium text-gray-500">Team status</div>
            <div className="text-2xl font-bold">
                {TEAM_PHASES[status].label}
            </div>
            <div className="text-gray-500 text-sm">
                {subtext}
            </div>
            <div className="text-gray-400 text-xs max-w-[400px] mt-2">
                {TEAM_PHASES[status].description}
            </div>
        </div>
        <div className="p-8">
            {actionRenderer}
        </div>
    </div>
);

export default TeamStatusBar;