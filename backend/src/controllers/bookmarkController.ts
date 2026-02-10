import { Request, Response } from 'express';
import { bookmarkService } from '../services/bookmarkService';

export class BookmarkController {
  async createBookmark(req: Request, res: Response) {
    try {
      const { episodeId, currentTime, note } = req.body;
      const sessionId = req.headers['x-session-id'] as string || 'default-session';

      if (!episodeId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'episodeId 為必填欄位'
          }
        });
      }

      const bookmark = await bookmarkService.createBookmark(
        sessionId,
        episodeId,
        currentTime || 0,
        note
      );

      res.status(201).json({
        success: true,
        data: bookmark
      });
    } catch (error: any) {
      if (error.message === 'ALREADY_BOOKMARKED') {
        return res.status(409).json({
          success: false,
          error: {
            code: 'ALREADY_BOOKMARKED',
            message: '此 episode 已在收藏中'
          }
        });
      }

      if (error.message === 'EPISODE_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Episode 不存在'
          }
        });
      }

      console.error('Create bookmark error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '伺服器錯誤'
        }
      });
    }
  }

  async getBookmarks(req: Request, res: Response) {
    try {
      const sessionId = req.headers['x-session-id'] as string || 'default-session';
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

      const result = await bookmarkService.getBookmarks(sessionId, page, limit);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get bookmarks error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '伺服器錯誤'
        }
      });
    }
  }

  async updateBookmark(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const sessionId = req.headers['x-session-id'] as string || 'default-session';
      const { currentTime, note } = req.body;

      const bookmark = await bookmarkService.updateBookmark(id, sessionId, {
        currentTime,
        note
      });

      res.json({
        success: true,
        data: bookmark
      });
    } catch (error: any) {
      if (error.message === 'BOOKMARK_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Bookmark 不存在'
          }
        });
      }

      if (error.message === 'UNAUTHORIZED') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '無權限操作此收藏'
          }
        });
      }

      console.error('Update bookmark error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '伺服器錯誤'
        }
      });
    }
  }

  async deleteBookmark(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const sessionId = req.headers['x-session-id'] as string || 'default-session';

      await bookmarkService.deleteBookmark(id, sessionId);

      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'BOOKMARK_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Bookmark 不存在'
          }
        });
      }

      if (error.message === 'UNAUTHORIZED') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '無權限操作此收藏'
          }
        });
      }

      console.error('Delete bookmark error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '伺服器錯誤'
        }
      });
    }
  }
}

export const bookmarkController = new BookmarkController();
