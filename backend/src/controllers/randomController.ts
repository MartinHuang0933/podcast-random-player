import { Request, Response } from 'express';
import { randomizerService } from '../services/randomizer';

export class RandomController {
  async getRandom(req: Request, res: Response) {
    try {
      const result = await randomizerService.getRandomEpisode();
      
      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      if (error.message === 'NO_EPISODES_AVAILABLE') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NO_EPISODES_AVAILABLE',
            message: '目前沒有可用的 episode'
          }
        });
      }

      console.error('Random error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '伺服器錯誤'
        }
      });
    }
  }

  async getNext(req: Request, res: Response) {
    try {
      const result = await randomizerService.getRandomEpisode(true);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      if (error.message === 'NO_EPISODES_AVAILABLE') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NO_EPISODES_AVAILABLE',
            message: '目前沒有可用的 episode'
          }
        });
      }

      console.error('Next error:', error);
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

export const randomController = new RandomController();
