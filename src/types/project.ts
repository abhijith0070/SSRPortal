export type TProjectBase = {
  id: string,
  name: string,
  slug: string
  description?: string,
  link?: string;
  code: string,
  cover?: string,
  location?: string
};

type TMetaObject = {
  category?: string
  location?: {
    type: 'offline',
    location: string,
    city: string,
    state: string
  } | {
    type: 'online',
    location: null,
    city: null,
    state: null
  }
};

export type TProject = {
  name: string
  code: string
  description: string
  isAccepted: boolean
  link?: string
  meta: TMetaObject

  video: string
  report: string
  poster: string
  gallery: string[]
  presentation: string

  theme: null | { name: string }
  team: { members: object, mentor: object }
};