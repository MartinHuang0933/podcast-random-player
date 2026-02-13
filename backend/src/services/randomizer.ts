import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RandomResult {
  podcast: {
    id: string;
    title: string;
    author: string | null;
    coverImage: string | null;
    applePodcastId: string | null;
  };
  episode: {
    id: string;
    title: string;
    description: string | null;
    audioUrl: string;
    duration: number;
    pubDate: Date;
    appleEpisodeId: string | null;
  };
  startTime: number;
}

export class RandomizerService {
  private recentEpisodeIds: Set<string> = new Set();
  private readonly maxRecentSize = 50;

  async getRandomEpisode(excludeRecent: boolean = true): Promise<RandomResult> {
    // 1. 隨機選擇一個 Podcast
    const totalPodcasts = await prisma.podcast.count();
    
    if (totalPodcasts === 0) {
      throw new Error('NO_EPISODES_AVAILABLE');
    }

    const skip = Math.floor(Math.random() * totalPodcasts);
    
    const podcasts = await prisma.podcast.findMany({
      take: 1,
      skip,
      include: {
        episodes: {
          where: excludeRecent && this.recentEpisodeIds.size > 0 ? {
            id: { notIn: Array.from(this.recentEpisodeIds) }
          } : {},
          orderBy: { pubDate: 'desc' },
          take: 20,
        }
      }
    });

    if (podcasts.length === 0 || podcasts[0].episodes.length === 0) {
      // 如果排除最近的後沒有結果，重試不排除
      if (excludeRecent) {
        return this.getRandomEpisode(false);
      }
      throw new Error('NO_EPISODES_AVAILABLE');
    }

    const podcast = podcasts[0];
    
    // 2. 隨機選擇一個 Episode
    const randomEpisodeIndex = Math.floor(Math.random() * podcast.episodes.length);
    const episode = podcast.episodes[randomEpisodeIndex];

    // 3. 生成隨機起始時間（保留至少 5 分鐘播放時間）
    const minPlayTime = 300; // 5 分鐘
    const maxStartTime = Math.max(0, episode.duration - minPlayTime);
    const startTime = Math.floor(Math.random() * maxStartTime);

    // 4. 記錄到最近播放
    this.recentEpisodeIds.add(episode.id);
    if (this.recentEpisodeIds.size > this.maxRecentSize) {
      const oldest = Array.from(this.recentEpisodeIds)[0];
      this.recentEpisodeIds.delete(oldest);
    }

    return {
      podcast: {
        id: podcast.id,
        title: podcast.title,
        author: podcast.author,
        coverImage: podcast.coverImage,
        applePodcastId: podcast.applePodcastId,
      },
      episode: {
        id: episode.id,
        title: episode.title,
        description: episode.description,
        audioUrl: episode.audioUrl,
        duration: episode.duration,
        pubDate: episode.pubDate,
        appleEpisodeId: episode.appleEpisodeId,
      },
      startTime,
    };
  }
}

export const randomizerService = new RandomizerService();
