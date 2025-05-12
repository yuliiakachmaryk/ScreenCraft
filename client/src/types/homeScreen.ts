import { ContentItem } from './contentItem';

export interface Section {
  name: string;
  order: number;
  items: any[];
}

export interface HomeScreen {
  _id: string;
  sections: Section[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type HomeScreenConfig = HomeScreen;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateHomeScreenRequest {
  isActive: boolean;
  recomendaciones: string[];
  topCharts: string[];
  mostTrending: string[];
  mostPopular: string[];
}

export interface UpdateHomeScreenRequest extends Partial<CreateHomeScreenRequest> {}
