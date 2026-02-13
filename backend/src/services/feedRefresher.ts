import { PrismaClient } from '@prisma/client';
import Parser from 'rss-parser';
import cron from 'node-cron';

const prisma = new PrismaClient();
const parser = new Parser();

const PODCAST_FEEDS = [
  {
    feedUrl: 'https://feeds.soundon.fm/podcasts/954689a5-3096-43a4-a80b-7810b219cef3.xml',
    language: 'zh-TW',
    applePodcastId: '1500839292',
  },
  {
    feedUrl: 'https://feeds.buzzsprout.com/1974862.rss',
    language: 'zh-TW',
    applePodcastId: '1106847606',
  },
  {
    feedUrl: 'https://open.firstory.me/rss/user/cknfhjuuqv2zr0821wzrxep3p',
    language: 'zh-TW',
    applePodcastId: '1510554676',
  },
];

function parseDuration(d: string | number | undefined): number {
  if (!d) return 1800;
  if (typeof d === 'string' && d.includes(':')) {
    const parts = d.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
  }
  return parseInt(String(d), 10) || 1800;
}

/**
 * 透過 iTunes Lookup API 取得 episode 的 Apple ID，
 * 用 episodeGuid 與資料庫的 externalId 比對。
 */
async function fetchAppleEpisodeIds(applePodcastId: string): Promise<Map<string, number>> {
  const guidToTrackId = new Map<string, number>();
  try {
    const url = `https://itunes.apple.com/lookup?id=${applePodcastId}&media=podcast&entity=podcastEpisode&limit=200`;
    const res = await fetch(url);
    const data = await res.json();
    for (const item of data.results || []) {
      if (item.kind === 'podcast-episode' && item.episodeGuid && item.trackId) {
        guidToTrackId.set(item.episodeGuid, item.trackId);
      }
    }
  } catch (err) {
    console.error(`  ⚠️ iTunes Lookup 失敗 (id=${applePodcastId}):`, err);
  }
  return guidToTrackId;
}

export async function refreshFeeds(): Promise<void> {
  console.log('🔄 開始更新 Podcast feeds...');

  let newEpisodes = 0;

  for (const feedInfo of PODCAST_FEEDS) {
    try {
      const feed = await parser.parseURL(feedInfo.feedUrl);

      const podcast = await prisma.podcast.upsert({
        where: { feedUrl: feedInfo.feedUrl },
        update: {
          title: feed.title || undefined,
          author: feed.itunes?.author || feed.creator || undefined,
          description: feed.description || undefined,
          coverImage: feed.itunes?.image || feed.image?.url || undefined,
          website: feed.link || undefined,
          applePodcastId: feedInfo.applePodcastId,
          lastFetchedAt: new Date(),
        },
        create: {
          externalId: feedInfo.feedUrl,
          title: feed.title || 'Unknown Podcast',
          author: feed.itunes?.author || feed.creator || null,
          description: feed.description || null,
          coverImage: feed.itunes?.image || feed.image?.url || null,
          feedUrl: feedInfo.feedUrl,
          website: feed.link || null,
          language: feed.language || feedInfo.language,
          applePodcastId: feedInfo.applePodcastId,
        },
      });

      // 取得 Apple episode ID 對照表
      const appleIds = await fetchAppleEpisodeIds(feedInfo.applePodcastId);

      const items = (feed.items || [])
        .filter(item => item.enclosure?.url)
        .slice(0, 30);

      for (const item of items) {
        const externalId = item.guid || item.link || `${feedInfo.feedUrl}-${item.title}`;
        const appleEpisodeId = appleIds.get(externalId)?.toString() || null;

        const existing = await prisma.episode.findUnique({
          where: { externalId },
          select: { id: true, appleEpisodeId: true },
        });

        if (!existing) {
          await prisma.episode.create({
            data: {
              externalId,
              podcastId: podcast.id,
              title: item.title || 'Untitled Episode',
              description: item.contentSnippet || item.content || null,
              audioUrl: item.enclosure!.url,
              duration: parseDuration(item.itunes?.duration),
              pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
              coverImage: item.itunes?.image || null,
              appleEpisodeId,
            },
          });
          newEpisodes++;
        } else if (!existing.appleEpisodeId && appleEpisodeId) {
          // 補填之前缺少的 Apple episode ID
          await prisma.episode.update({
            where: { externalId },
            data: { appleEpisodeId },
          });
        }
      }

      console.log(`  ✅ ${podcast.title} - 更新完成 (Apple IDs: ${appleIds.size})`);
    } catch (error) {
      console.error(`  ❌ 更新失敗: ${feedInfo.feedUrl}`, error);
    }
  }

  console.log(`🔄 Feed 更新完成，新增 ${newEpisodes} 集 episode`);
}

export function startFeedScheduler(): void {
  cron.schedule('0 3 * * *', () => {
    console.log('⏰ 排程觸發：開始每日 feed 更新');
    refreshFeeds().catch(err => console.error('排程更新失敗:', err));
  });

  console.log('📅 Feed 排程已啟動（每天 03:00 更新）');
}
