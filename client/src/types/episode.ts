export interface Episode {
  _id: string;
  name: string;
  isExclusive: boolean;
  likesNumber: number;
  reviewed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEpisodeRequest {
  name: string;
  isExclusive: boolean;
  likesNumber: number;
  reviewed: boolean;
}

export interface UpdateEpisodeRequest {
  name?: string;
  isExclusive?: boolean;
  likesNumber?: number;
  reviewed?: boolean;
}
