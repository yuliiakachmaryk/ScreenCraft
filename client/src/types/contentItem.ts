import { Episode } from './episode';

export interface ContentItem {
  _id: string;
  name: string;
  introImage: string;
  isExclusive: boolean;
  category: string;
  episodes: Episode[];
}

export interface CreateContentItemRequest {
  name: string;
  introImage: string;
  isExclusive: boolean;
  category: string;
}

export interface UpdateContentItemRequest {
  name?: string;
  introImage?: string;
  isExclusive?: boolean;
  category?: string;
}
