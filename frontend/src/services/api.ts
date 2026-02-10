import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// 生成或獲取 sessionId
const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加 sessionId 到請求頭
api.interceptors.request.use((config) => {
  config.headers['x-session-id'] = getSessionId();
  return config;
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

// Bookmark API
export const createBookmark = async (episodeId: string, currentTime = 0, note?: string) => {
  const response = await api.post('/bookmarks', { episodeId, currentTime, note });
  return response.data.data;
};

export const getBookmarks = async (page = 1, limit = 20) => {
  const response = await api.get('/bookmarks', { params: { page, limit } });
  return response.data.data;
};

export const deleteBookmark = async (id: string) => {
  await api.delete(`/bookmarks/${id}`);
};

// Subscription API
export const createSubscription = async (podcastId: string) => {
  const response = await api.post('/subscriptions', { podcastId });
  return response.data.data;
};

export const getSubscriptions = async (page = 1, limit = 20) => {
  const response = await api.get('/subscriptions', { params: { page, limit } });
  return response.data.data;
};

export const deleteSubscription = async (id: string) => {
  await api.delete(`/subscriptions/${id}`);
};

export default api;
