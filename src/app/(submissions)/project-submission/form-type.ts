export type TProjectSubmissionForm = {
  teamId: string
  projectTitle: string,
  projectDescription: string,
  projectCategory: string | null,
  otherCategory: string | null,
  projectLocation: {
    type: 'online' | 'offline',
    location: '',
    city: '',
    state: '',
  },
  photos: string[],
  report: string | null,
  video: string | null,
  poster: string | null,
  presentation: string | null
};