import { create } from 'zustand';

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  audioUrl: string | null;
  episodeId: string | null;
  episodeTitle: string | null;
  podcastTitle: string | null;
  coverImage: string | null;
  
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  loadAudio: (data: {
    audioUrl: string;
    episodeId: string;
    episodeTitle: string;
    podcastTitle: string;
    coverImage: string | null;
    startTime?: number;
  }) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  audioUrl: null,
  episodeId: null,
  episodeTitle: null,
  podcastTitle: null,
  coverImage: null,

  setPlaying: (isPlaying) => set({ isPlaying }),
  
  setCurrentTime: (currentTime) => set({ currentTime }),
  
  setDuration: (duration) => set({ duration }),
  
  setVolume: (volume) => {
    localStorage.setItem('volume', volume.toString());
    set({ volume });
  },
  
  loadAudio: (data) => {
    set({
      audioUrl: data.audioUrl,
      episodeId: data.episodeId,
      episodeTitle: data.episodeTitle,
      podcastTitle: data.podcastTitle,
      coverImage: data.coverImage,
      currentTime: data.startTime || 0,
      isPlaying: false,
    });
  },
  
  reset: () => set({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    audioUrl: null,
    episodeId: null,
    episodeTitle: null,
    podcastTitle: null,
    coverImage: null,
  }),
}));

// 初始化音量
const savedVolume = localStorage.getItem('volume');
if (savedVolume) {
  usePlayerStore.setState({ volume: parseFloat(savedVolume) });
}
