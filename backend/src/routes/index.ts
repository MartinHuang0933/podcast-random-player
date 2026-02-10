import { Router } from 'express';
import { randomController } from '../controllers/randomController';
import { podcastController } from '../controllers/podcastController';
import { bookmarkController } from '../controllers/bookmarkController';
import { subscriptionController } from '../controllers/subscriptionController';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
    }
  });
});

// Random routes
router.get('/random', randomController.getRandom.bind(randomController));
router.get('/random/next', randomController.getNext.bind(randomController));

// Podcast routes
router.get('/podcasts', podcastController.getPodcasts.bind(podcastController));
router.get('/podcasts/:id', podcastController.getPodcastById.bind(podcastController));
router.get('/podcasts/:id/episodes', podcastController.getEpisodes.bind(podcastController));
router.get('/episodes/:id', podcastController.getEpisodeById.bind(podcastController));

// Bookmark routes
router.post('/bookmarks', bookmarkController.createBookmark.bind(bookmarkController));
router.get('/bookmarks', bookmarkController.getBookmarks.bind(bookmarkController));
router.put('/bookmarks/:id', bookmarkController.updateBookmark.bind(bookmarkController));
router.delete('/bookmarks/:id', bookmarkController.deleteBookmark.bind(bookmarkController));

// Subscription routes
router.post('/subscriptions', subscriptionController.createSubscription.bind(subscriptionController));
router.get('/subscriptions', subscriptionController.getSubscriptions.bind(subscriptionController));
router.delete('/subscriptions/:id', subscriptionController.deleteSubscription.bind(subscriptionController));

export default router;
