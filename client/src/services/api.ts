import axios, { AxiosError } from 'axios';
import { ContentItem, Episode, HomeScreen } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}
interface CreateHomeScreenRequest {
  isActive: boolean;
  recomendaciones: string[];
  topCharts: string[];
  mostTrending: string[];
  mostPopular: string[];
}

interface UpdateHomeScreenRequest {
  isActive?: boolean;
  recomendaciones?: string[];
  topCharts?: string[];
  mostTrending?: string[];
  mostPopular?: string[];
}

interface CreateContentItemRequest {
  name: string;
  introImage: string;
  isExclusive: boolean;
  category: string;
}

interface UpdateContentItemRequest {
  name?: string;
  introImage?: string;
  isExclusive?: boolean;
  category?: string;
}

interface CreateEpisodeRequest {
  name: string;
  isExclusive: boolean;
  likesNumber: number;
  reviewed: boolean;
}

interface UpdateEpisodeRequest {
  name?: string;
  isExclusive?: boolean;
  likesNumber?: number;
  reviewed?: boolean;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('API Error:', {
      status: error.response?.status,
      message: errorMessage,
      error: error.response?.data?.error,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export const homeScreenApi = {
  getAll: () => api.get<HomeScreen[]>('/home-screen'),
  getActive: () => api.get<HomeScreen>('/home-screen/active'),
  getById: (id: string) => api.get<HomeScreen>(`/home-screen/${id}`),
  create: (data: CreateHomeScreenRequest) =>
    api.post<HomeScreen>('/home-screen', data),
  update: (id: string, data: UpdateHomeScreenRequest) =>
    api.patch<HomeScreen>(`/home-screen/${id}`, data),
  setActive: (id: string) =>
    api.put<HomeScreen>(`/home-screen/${id}/activate`),
  delete: (id: string) =>
    api.delete<HomeScreen>(`/home-screen/${id}`),
  addContentToSection: (id: string, contentItemId: string, section: string) =>
    api.post<HomeScreen>(`/home-screen/${id}/content-items/${contentItemId}`, { section }),
  removeContentFromSection: (id: string, contentItemId: string, section: string) =>
    api.delete<HomeScreen>(`/home-screen/${id}/content-items/${contentItemId}`, { data: { section } }),
};

export const contentItemApi = {
  getAll: () => api.get<ContentItem[]>('/content-items'),
  getById: (id: string) => api.get<ContentItem>(`/content-items/${id}`),
  create: (data: CreateContentItemRequest) =>
    api.post<ContentItem>('/content-items', data),
  update: (id: string, data: UpdateContentItemRequest) =>
    api.patch<ContentItem>(`/content-items/${id}`, data),
  delete: (id: string) =>
    api.delete<ContentItem>(`/content-items/${id}`),
  addEpisode: (id: string, episodeId: string) =>
    api.put<ContentItem>(`/content-items/${id}/episodes/${episodeId}`),
  removeEpisode: (id: string, episodeId: string) =>
    api.delete<ContentItem>(`/content-items/${id}/episodes/${episodeId}`),
};

export const episodeApi = {
  getAll: () => api.get<Episode[]>('/episodes'),
  getById: (id: string) => api.get<Episode>(`/episodes/${id}`),
  create: (data: CreateEpisodeRequest) =>
    api.post<Episode>('/episodes', data),
  update: (id: string, data: UpdateEpisodeRequest) =>
    api.patch<Episode>(`/episodes/${id}`, data),
  delete: (id: string) =>
    api.delete<Episode>(`/episodes/${id}`),
}; 
