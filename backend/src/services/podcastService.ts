import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PodcastService {
  async getPodcasts(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const [podcasts, total] = await Promise.all([
      prisma.podcast.findMany({
        skip,
        take: limit,
        include: {
          _count: {
            select: { episodes: true }
          },
          episodes: {
            orderBy: { pubDate: 'desc' },
            take: 1,
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.podcast.count()
    ]);

    return {
      podcasts: podcasts.map(p => ({
        id: p.id,
        title: p.title,
        author: p.author,
        description: p.description,
        coverImage: p.coverImage,
        applePodcastId: p.applePodcastId,
        episodeCount: p._count.episodes,
        latestEpisode: p.episodes[0]?.pubDate || null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  async getPodcastById(id: string) {
    const podcast = await prisma.podcast.findUnique({
      where: { id },
      include: {
        _count: {
          select: { episodes: true }
        }
      }
    });

    if (!podcast) {
      throw new Error('PODCAST_NOT_FOUND');
    }

    return {
      id: podcast.id,
      title: podcast.title,
      author: podcast.author,
      description: podcast.description,
      coverImage: podcast.coverImage,
      website: podcast.website,
      language: podcast.language,
      applePodcastId: podcast.applePodcastId,
      episodeCount: podcast._count.episodes,
    };
  }

  async getEpisodesByPodcastId(podcastId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [episodes, total] = await Promise.all([
      prisma.episode.findMany({
        where: { podcastId },
        skip,
        take: limit,
        orderBy: { pubDate: 'desc' }
      }),
      prisma.episode.count({ where: { podcastId } })
    ]);

    return {
      episodes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  async getEpisodeById(id: string) {
    const episode = await prisma.episode.findUnique({
      where: { id },
      include: {
        podcast: {
          select: {
            id: true,
            title: true,
            author: true,
            coverImage: true,
          }
        }
      }
    });

    if (!episode) {
      throw new Error('EPISODE_NOT_FOUND');
    }

    return episode;
  }
}

export const podcastService = new PodcastService();
