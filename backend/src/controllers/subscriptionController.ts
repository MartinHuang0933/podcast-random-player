import { Request, Response } from 'express';
import { subscriptionService } from '../services/subscriptionService';

export class SubscriptionController {
  async createSubscription(req: Request, res: Response) {
    try {
      const { podcastId } = req.body;
      const sessionId = req.headers['x-session-id'] as string || 'default-session';

      if (!podcastId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'podcastId 為必填欄位'
          }
        });
      }

      const subscription = await subscriptionService.createSubscription(sessionId, podcastId);

      res.status(201).json({
        success: true,
        data: subscription
      });
    } catch (error: any) {
      if (error.message === 'ALREADY_SUBSCRIBED') {
        return res.status(409).json({
          success: false,
          error: {
            code: 'ALREADY_SUBSCRIBED',
            message: '已追蹤此 Podcast'
          }
        });
      }

      if (error.message === 'PODCAST_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Podcast 不存在'
          }
        });
      }

      console.error('Create subscription error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '伺服器錯誤'
        }
      });
    }
  }

  async getSubscriptions(req: Request, res: Response) {
    try {
      const sessionId = req.headers['x-session-id'] as string || 'default-session';
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

      const result = await subscriptionService.getSubscriptions(sessionId, page, limit);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get subscriptions error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '伺服器錯誤'
        }
      });
    }
  }

  async deleteSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const sessionId = req.headers['x-session-id'] as string || 'default-session';

      await subscriptionService.deleteSubscription(id, sessionId);

      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'SUBSCRIPTION_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Subscription 不存在'
          }
        });
      }

      if (error.message === 'UNAUTHORIZED') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '無權限操作此追蹤'
          }
        });
      }

      console.error('Delete subscription error:', error);
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

export const subscriptionController = new SubscriptionController();
