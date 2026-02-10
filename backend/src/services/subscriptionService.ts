import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SubscriptionService {
  async createSubscription(sessionId: string, podcastId: string) {
    // 檢查是否已追蹤
    const existing = await prisma.subscription.findUnique({
      where: {
        sessionId_podcastId: { sessionId, podcastId }
      }
    });

    if (existing) {
      throw new Error('ALREADY_SUBSCRIBED');
    }

    // 驗證 podcast 存在
    const podcast = await prisma.podcast.findUnique({
      where: { id: podcastId }
    });

    if (!podcast) {
      throw new Error('PODCAST_NOT_FOUND');
    }

    const subscription = await prisma.subscription.create({
      data: {
        sessionId,
        podcastId,
      },
      include: {
        podcast: {
          include: {
            _count: {
              select: { episodes: true }
            }
          }
        }
      }
    });

    return subscription;
  }

  async getSubscriptions(sessionId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where: { sessionId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          podcast: {
            include: {
              _count: {
                select: { episodes: true }
              },
              episodes: {
                orderBy: { pubDate: 'desc' },
                take: 1,
              }
            }
          }
        }
      }),
      prisma.subscription.count({ where: { sessionId } })
    ]);

    return {
      subscriptions: subscriptions.map(s => ({
        id: s.id,
        createdAt: s.createdAt,
        podcast: {
          id: s.podcast.id,
          title: s.podcast.title,
          author: s.podcast.author,
          coverImage: s.podcast.coverImage,
          episodeCount: s.podcast._count.episodes,
          latestEpisode: s.podcast.episodes[0]?.pubDate || null,
        }
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  async deleteSubscription(id: string, sessionId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { id }
    });

    if (!subscription) {
      throw new Error('SUBSCRIPTION_NOT_FOUND');
    }

    if (subscription.sessionId !== sessionId) {
      throw new Error('UNAUTHORIZED');
    }

    await prisma.subscription.delete({
      where: { id }
    });
  }
}

export const subscriptionService = new SubscriptionService();
