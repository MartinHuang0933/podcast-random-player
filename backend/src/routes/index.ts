import { Router } from 'express';
import { randomController } from '../controllers/randomController';
import { podcastController } from '../controllers/podcastController';

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

export default router;
