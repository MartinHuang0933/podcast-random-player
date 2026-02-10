import { Request, Response } from 'express';
import { podcastService } from '../services/podcastService';

export class PodcastController {
  async getPodcasts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

      const result = await podcastService.getPodcasts(page, limit);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get podcasts error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '伺服器錯誤'
        }
      });
    }
  }

  async getPodcastById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const podcast = await podcastService.getPodcastById(id);
      
      res.json({
        success: true,
        data: podcast
      });
    } catch (error: any) {
      if (error.message === 'PODCAST_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Podcast 不存在'
          }
        });
      }

      console.error('Get podcast error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '伺服器錯誤'
        }
      });
    }
  }

  async getEpisodes(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);

      const result = await podcastService.getEpisodesByPodcastId(id, page, limit);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get episodes error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '伺服器錯誤'
        }
      });
    }
  }

  async getEpisodeById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const episode = await podcastService.getEpisodeById(id);
      
      res.json({
        success: true,
        data: episode
      });
    } catch (error: any) {
      if (error.message === 'EPISODE_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Episode 不存在'
          }
        });
      }

      console.error('Get episode error:', error);
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

export const podcastController = new PodcastController();
