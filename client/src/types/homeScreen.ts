import { ContentItem } from './contentItem';
export interface HomeScreen {
  _id: string;
  isActive: boolean;
  recomendaciones: ContentItem[];
  topCharts: ContentItem[];
  mostTrending: ContentItem[];
  mostPopular: ContentItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateHomeScreenRequest {
  isActive: boolean;
  recomendaciones: string[];
  topCharts: string[];
  mostTrending: string[];
  mostPopular: string[];
}

export interface UpdateHomeScreenRequest {
  isActive?: boolean;
  recomendaciones?: string[];
  topCharts?: string[];
  mostTrending?: string[];
  mostPopular?: string[];
}
