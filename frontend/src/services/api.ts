import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 隨機播放 API
export const getRandomEpisode = async () => {
  const response = await api.get('/random');
  return response.data.data;
};

export const getNextRandom = async () => {
  const response = await api.get('/random/next');
  return response.data.data;
};

// Podcast API
export const getPodcasts = async (page = 1, limit = 20) => {
  const response = await api.get('/podcasts', { params: { page, limit } });
  return response.data.data;
};

export const getPodcastById = async (id: string) => {
  const response = await api.get(`/podcasts/${id}`);
  return response.data.data;
};

export const getEpisodesByPodcastId = async (id: string, page = 1, limit = 50) => {
  const response = await api.get(`/podcasts/${id}/episodes`, { params: { page, limit } });
  return response.data.data;
};

export default api;
