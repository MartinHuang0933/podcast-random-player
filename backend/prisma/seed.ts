import { PrismaClient } from '@prisma/client';
import Parser from 'rss-parser';

const prisma = new PrismaClient();
const parser = new Parser();

const PODCAST_FEEDS = [
  // 股癌
  { feedUrl: 'https://feeds.soundon.fm/podcasts/954689a5-3096-43a4-a80b-7810b219cef3.xml', language: 'zh-TW', applePodcastId: '1500839292' },
  // 百靈果NEWS
  { feedUrl: 'https://feeds.buzzsprout.com/1974862.rss', language: 'zh-TW', applePodcastId: '1106847606' },
  // 台灣通勤第一品牌
  { feedUrl: 'https://open.firstory.me/rss/user/cknfhjuuqv2zr0821wzrxep3p', language: 'zh-TW', applePodcastId: '1510554676' },
  // 敏迪選讀
  { feedUrl: 'https://feeds.soundon.fm/podcasts/44833083-490d-4f97-a782-fd5e34c0abef.xml', language: 'zh-TW', applePodcastId: '1475418379' },
  // 志祺七七-Podcast
  { feedUrl: 'https://feed.firstory.me/rss/user/cltmj9b0x12b201xh5pincmny', language: 'zh-TW', applePodcastId: '1735265144' },
  // 唐陽雞酒屋
  { feedUrl: 'https://feed.firstory.me/rss/user/ckga7ibs77fgl0875bxwgl0y0', language: 'zh-TW', applePodcastId: '1536374746' },
  // 好味小姐開束縛我還你原形
  { feedUrl: 'https://feeds.soundon.fm/podcasts/adf29720-e93b-4856-a09e-b73544147ec4.xml', language: 'zh-TW', applePodcastId: '1522773953' },
  // 大人的Small Talk
  { feedUrl: 'https://feeds.soundon.fm/podcasts/6731d283-54f0-49ec-a040-e5a641c3125f.xml', language: 'zh-TW', applePodcastId: '1452688611' },
  // 下一本讀什麼？
  { feedUrl: 'https://feed.firstory.me/rss/user/cl39lz2ky01co01ugaba7gr9y', language: 'zh-TW', applePodcastId: '1532820533' },
  // The Real Story By 報導者
  { feedUrl: 'https://feeds.soundon.fm/podcasts/c1f1f3c9-8d28-42ad-9f1c-908018b8d9fc.xml', language: 'zh-TW', applePodcastId: '1525816185' },
  // 轉角國際新聞 Daily Podcast
  { feedUrl: 'https://feeds.soundon.fm/podcasts/4f4a009b-d95b-4590-85cf-d5e050ead84e.xml', language: 'zh-TW', applePodcastId: '1469553043' },
  // 轉角國際・重磅廣播
  { feedUrl: 'https://feeds.soundon.fm/podcasts/8ca4bd3e-35b5-470e-9d0c-6b70905797f1.xml', language: 'zh-TW', applePodcastId: '1202558455' },
  // 法客電台 BY 法律白話文運動
  { feedUrl: 'https://feed.firstory.me/rss/user/ckudnw7fn4tqg0870axzgirva', language: 'zh-TW', applePodcastId: '1482463498' },
  // 雷蒙三十
  { feedUrl: 'https://feed.firstory.me/rss/user/ck7ok68zmhxjx0873f2jqjut6', language: 'zh-TW', applePodcastId: '1500778610' },
  // 馬克信箱 (Dear Marcy)
  { feedUrl: 'https://anchor.fm/s/98a6fac/podcast/rss', language: 'zh-TW', applePodcastId: '1474007441' },
  // 吳淡如人生實用商學院
  { feedUrl: 'https://feeds.soundon.fm/podcasts/73930beb-4136-4b36-a910-39984335b7bb.xml', language: 'zh-TW', applePodcastId: '1536242998' },
  // 鄧惠文 不想說
  { feedUrl: 'https://feeds.soundon.fm/podcasts/cc98e53c-2827-4bb7-ac15-171a630760c2.xml', language: 'zh-TW', applePodcastId: '1544980529' },
  // 呱吉
  { feedUrl: 'https://feeds.soundon.fm/podcasts/ecd31076-d12d-46dc-ba11-32d24b41cca5.xml', language: 'zh-TW', applePodcastId: '1477164549' },
  // 那些學校沒教的事
  { feedUrl: 'https://feeds.soundon.fm/podcasts/ce0ead8f-d4e1-4e97-b25e-dc8c88b1a56d.xml', language: 'zh-TW', applePodcastId: '1475701538' },
  // 寶島少年兄
  { feedUrl: 'https://feeds.soundon.fm/podcasts/45edd1fd-3ad0-4e95-aaa8-b229856181c4.xml', language: 'zh-TW', applePodcastId: '1500190593' },
  // 從前從前 (童話阿姨)
  { feedUrl: 'https://feed.firstory.me/rss/user/ckg2mhkljssl708756xu1zvcy', language: 'zh-TW', applePodcastId: '1535319502' },
  // 科技島讀
  { feedUrl: 'https://feeds.soundcloud.com/users/soundcloud:users:322164009/sounds.rss', language: 'zh-TW', applePodcastId: '1264391007' },
  // 啟點文化一天聽一點
  { feedUrl: 'https://feeds.soundon.fm/podcasts/da58250f-84f2-445e-b3c5-6175af478fa9.xml', language: 'zh-TW', applePodcastId: '1488718553' },
  // 時間的女兒：八卦歷史
  { feedUrl: 'https://feeds.soundon.fm/podcasts/8632047c-dd18-4bde-a86c-f6c44df60b16.xml', language: 'zh-TW', applePodcastId: '1549521834' },
  // 聽天下：天下雜誌Podcast
  { feedUrl: 'https://feeds.soundon.fm/podcasts/e0baca98-490d-4f44-83c9-32f8ec8eec45.xml', language: 'zh-TW', applePodcastId: '1486227803' },
  // 矽谷為什麼？
  { feedUrl: 'https://feed.firstory.me/rss/user/ckjmox9tvwrzk0b38nplfr5by', language: 'zh-TW', applePodcastId: '1504424352' },
  // 哇賽心理學
  { feedUrl: 'https://feed.firstory.me/rss/user/ck7t2fz77qu7g0873ln5hz5cl', language: 'zh-TW', applePodcastId: '1500162537' },
  // 強者我朋友 by 志祺七七
  { feedUrl: 'https://feed.firstory.me/rss/user/ckks5eepbgcwl0815tfre8q3s', language: 'zh-TW', applePodcastId: '1552655948' },
  // 劉軒的How to人生學
  { feedUrl: 'https://feeds.soundon.fm/podcasts/17e025f5-3a87-41b5-8cff-af804ad195f3.xml', language: 'zh-TW', applePodcastId: '1547950387' },
  // 曾寶儀的人生藏寶圖
  { feedUrl: 'https://feed.firstory.me/rss/user/clvknrxxl0p8701x65wnig3yw', language: 'zh-TW', applePodcastId: '1625222138' },
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
  console.log('🗑️  清除舊資料...');
  await prisma.episode.deleteMany();
  await prisma.podcast.deleteMany();

  console.log(`🌱 開始從 ${PODCAST_FEEDS.length} 個 RSS Feed 抓取台灣 Podcast 資料...`);

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

      // 每個 podcast 只取最新的前 3 集
      const items = (feed.items || [])
        .filter(item => item.enclosure?.url)
        .slice(0, 3);

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
