import { PrismaClient } from '@prisma/client';
import Parser from 'rss-parser';

const prisma = new PrismaClient();
const parser = new Parser();

// 中文 Podcast RSS Feeds（已驗證可用）
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

async function main() {
  // 清除舊資料，確保重新 seed
  console.log('🗑️  清除舊資料...');
  await prisma.episode.deleteMany();
  await prisma.podcast.deleteMany();

  console.log('🌱 開始從 RSS Feed 抓取中文 Podcast 資料...');

  let totalPodcasts = 0;
  let totalEpisodes = 0;

  for (const feedInfo of PODCAST_FEEDS) {
    try {
      console.log(`\n📡 正在抓取: ${feedInfo.feedUrl}`);
      const feed = await parser.parseURL(feedInfo.feedUrl);

      const podcast = await prisma.podcast.create({
        data: {
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

      console.log(`  ✅ Podcast: ${podcast.title}`);
      totalPodcasts++;

      // 取前 15 集有音檔的 episodes
      const items = (feed.items || [])
        .filter(item => item.enclosure?.url)
        .slice(0, 15);

      for (const item of items) {
        await prisma.episode.create({
          data: {
            externalId: item.guid || item.link || `${feedInfo.feedUrl}-${item.title}`,
            podcastId: podcast.id,
            title: item.title || 'Untitled Episode',
            description: item.contentSnippet || item.content || null,
            audioUrl: item.enclosure!.url,
            duration: parseDuration(item.itunes?.duration),
            pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
            coverImage: item.itunes?.image || null,
          },
        });
        totalEpisodes++;
      }

      console.log(`  ✅ ${items.length} episodes 已匯入`);
    } catch (error) {
      console.error(`  ❌ 抓取失敗: ${feedInfo.feedUrl}`, error);
    }
  }

  console.log('\n🎉 Seed 完成！');
  console.log(`📊 統計：`);
  console.log(`   - Podcasts: ${totalPodcasts}`);
  console.log(`   - Episodes: ${totalEpisodes}`);
}

main()
  .catch((e) => {
    console.error('❌ 錯誤:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
