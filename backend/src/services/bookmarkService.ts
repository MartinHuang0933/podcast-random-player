import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BookmarkService {
  async createBookmark(sessionId: string, episodeId: string, currentTime: number = 0, note?: string) {
    // 檢查是否已收藏
    const existing = await prisma.bookmark.findUnique({
      where: {
        sessionId_episodeId: { sessionId, episodeId }
      }
    });

    if (existing) {
      throw new Error('ALREADY_BOOKMARKED');
    }

    // 驗證 episode 存在
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId }
    });

    if (!episode) {
      throw new Error('EPISODE_NOT_FOUND');
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        sessionId,
        episodeId,
        currentTime,
        note,
      },
      include: {
        episode: {
          include: {
            podcast: {
              select: {
                id: true,
                title: true,
                coverImage: true,
              }
            }
          }
        }
      }
    });

    return bookmark;
  }

  async getBookmarks(sessionId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { sessionId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          episode: {
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
          }
        }
      }),
      prisma.bookmark.count({ where: { sessionId } })
    ]);

    return {
      bookmarks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  async updateBookmark(id: string, sessionId: string, data: { currentTime?: number; note?: string }) {
    const bookmark = await prisma.bookmark.findUnique({
      where: { id }
    });

    if (!bookmark) {
      throw new Error('BOOKMARK_NOT_FOUND');
    }

    if (bookmark.sessionId !== sessionId) {
      throw new Error('UNAUTHORIZED');
    }

    const updated = await prisma.bookmark.update({
      where: { id },
      data,
    });

    return updated;
  }

  async deleteBookmark(id: string, sessionId: string) {
    const bookmark = await prisma.bookmark.findUnique({
      where: { id }
    });

    if (!bookmark) {
      throw new Error('BOOKMARK_NOT_FOUND');
    }

    if (bookmark.sessionId !== sessionId) {
      throw new Error('UNAUTHORIZED');
    }

    await prisma.bookmark.delete({
      where: { id }
    });
  }
}

export const bookmarkService = new BookmarkService();
