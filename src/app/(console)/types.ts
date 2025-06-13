// eslint-disable-next-line import/no-unused-modules
export interface IPaginatedData<Type> {
  results: Type[];
  count: number;
  next: string | null;
  previous: string | null;
}

// eslint-disable-next-line import/no-unused-modules
export interface IUser {
  id: number;
  uid: string;
  email: string;
  name: string;
  avatarURL?: string | null;
  avatarID?: string | null;
}

// eslint-disable-next-line import/no-unused-modules
export enum PROPOSAL_STATUS {
  SUBMITTED = 'SUBMITTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  FROZEN = 'FROZEN',
}

// eslint-disable-next-line import/no-unused-modules
export interface IProposal {
  id: number;
  title: string;
  description: string;
  proposalURL: string;
  status: PROPOSAL_STATUS;
  timestamp: string;
}

// eslint-disable-next-line import/no-unused-modules
export interface IProject {
  id: number;
  title: string;
  description: string;
  team: ITeam;
    
}

// eslint-disable-next-line import/no-unused-modules
export enum TEAM_STATUS {
  PROPOSAL_SUBMISSION = 'PROPOSAL_SUBMISSION',
  PROPOSAL_ACCEPTED = 'PROPOSAL_ACCEPTED',
  PROJECT_IN_PROGRESS = 'PROJECT_IN_PROGRESS',
  PROJECT_REVIEW = 'PROJECT_REVIEW',
  PROJECT_COMPLETED = 'PROJECT_COMPLETED',
}

// eslint-disable-next-line import/no-unused-modules
export interface ITeam {
  id: string;
  teamNumber: string;
  code: string;
  mentor: IUser;
  members: Array<{
  id: string;
  name: string;
  email: string;
  rollno?: string;
  role?: 'LEADER' | 'MEMBER';
}>;
  proposals: Omit<IProposal, 'proposalURL'>[];
  project: IProject | null;
  stats: {
    proposals: number;
    teamNumber: string;
    members: number;
    status: TEAM_STATUS;
  }
}