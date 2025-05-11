export interface Episode {
  _id: string;
  name: string;
  isExclusive: boolean;
  likesNumber: number;
  reviewed: boolean;
  videoLink: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEpisodeRequest {
  name: string;
  isExclusive: boolean;
  likesNumber: number;
  reviewed: boolean;
  videoLink: string;
}

export interface UpdateEpisodeRequest {
  name?: string;
  isExclusive?: boolean;
  likesNumber?: number;
  reviewed?: boolean;
  videoLink?: string;
}
