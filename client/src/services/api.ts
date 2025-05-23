import axios, { AxiosError } from 'axios';
import { ContentItem, Episode, HomeScreen, PaginatedResponse } from '../types';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
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
  getAll: (page = 1, limit = 10) => 
    api.get<PaginatedResponse<HomeScreen>>('/home-screen', {
      params: { page, limit }
    }),
  getActive: () => api.get<HomeScreen>('/home-screen/active'),
  getById: (id: string) => api.get<HomeScreen>(`/home-screen/${id}`),
  create: (data: Partial<HomeScreen>) => api.post<HomeScreen>('/home-screen', data),
  update: (id: string, data: Partial<HomeScreen>) =>
    api.patch<HomeScreen>(`/home-screen/${id}`, data),
  delete: (id: string) => api.delete<HomeScreen>(`/home-screen/${id}`),
  setActive: (id: string) => api.put<HomeScreen>(`/home-screen/${id}/activate`),
  addContentToSection: (id: string, contentItemId: string, section: string) =>
    api.post<HomeScreen>(`/home-screen/${id}/content-items/${contentItemId}`, { section }),
  removeContentFromSection: (id: string, contentItemId: string, section: string) =>
    api.delete<HomeScreen>(`/home-screen/${id}/content-items/${contentItemId}`, { data: { section } }),
};

export const contentItemApi = {
  getAll: (page = 1, limit = 10) => 
    api.get<{ contentItems: ContentItem[]; total: number }>(`/content-items?page=${page}&limit=${limit}`),
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
  getAll: (page = 1, limit = 10) => 
    api.get<{ episodes: Episode[]; total: number }>(`/episodes?page=${page}&limit=${limit}`),
  getById: (id: string) => api.get<Episode>(`/episodes/${id}`),
  create: (data: CreateEpisodeRequest) =>
    api.post<Episode>('/episodes', data),
  update: (id: string, data: UpdateEpisodeRequest) =>
    api.patch<Episode>(`/episodes/${id}`, data),
  delete: (id: string) =>
    api.delete<Episode>(`/episodes/${id}`),
}; 
