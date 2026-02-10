import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 開始填充測試資料...');

  // 創建測試 Podcast
  const podcast1 = await prisma.podcast.create({
    data: {
      externalId: 'test-podcast-1',
      title: '科技島讀',
      author: '周欽華',
      description: '深度科技評論，每週更新',
      coverImage: 'https://picsum.photos/300/300?random=1',
      feedUrl: 'https://example.com/feed1.xml',
      website: 'https://daodu.tech',
      language: 'zh-TW',
    },
  });

  const podcast2 = await prisma.podcast.create({
    data: {
      externalId: 'test-podcast-2',
      title: '股癌',
      author: '謝孟恭',
      description: '財經趨勢分析',
      coverImage: 'https://picsum.photos/300/300?random=2',
      feedUrl: 'https://example.com/feed2.xml',
      website: 'https://gooaye.com',
      language: 'zh-TW',
    },
  });

  const podcast3 = await prisma.podcast.create({
    data: {
      externalId: 'test-podcast-3',
      title: 'The Daily',
      author: 'The New York Times',
      description: 'This is what the news should sound like.',
      coverImage: 'https://picsum.photos/300/300?random=3',
      feedUrl: 'https://example.com/feed3.xml',
      website: 'https://nytimes.com/thedaily',
      language: 'en-US',
    },
  });

  console.log('✅ 已創建 3 個 Podcast');

  // 為每個 Podcast 創建 episodes
  const episodes1 = [];
  for (let i = 1; i <= 10; i++) {
    const episode = await prisma.episode.create({
      data: {
        externalId: `episode-1-${i}`,
        podcastId: podcast1.id,
        title: `第 ${i} 集 - AI 的第 ${i} 個應用`,
        description: `本集討論 AI 技術在第 ${i} 個領域的應用...`,
        audioUrl: `https://example.com/audio/ep1-${i}.mp3`,
        duration: 1800 + Math.floor(Math.random() * 1800), // 30-60 分鐘
        pubDate: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000), // 每週一集
      },
    });
    episodes1.push(episode);
  }

  const episodes2 = [];
  for (let i = 1; i <= 10; i++) {
    const episode = await prisma.episode.create({
      data: {
        externalId: `episode-2-${i}`,
        podcastId: podcast2.id,
        title: `EP${i} - 市場分析 ${i}`,
        description: `這週的市場走勢分析...`,
        audioUrl: `https://example.com/audio/ep2-${i}.mp3`,
        duration: 2400 + Math.floor(Math.random() * 1200),
        pubDate: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000),
      },
    });
    episodes2.push(episode);
  }

  const episodes3 = [];
  for (let i = 1; i <= 10; i++) {
    const episode = await prisma.episode.create({
      data: {
        externalId: `episode-3-${i}`,
        podcastId: podcast3.id,
        title: `Episode ${i}: Breaking News`,
        description: `Today's top stories...`,
        audioUrl: `https://example.com/audio/ep3-${i}.mp3`,
        duration: 1200 + Math.floor(Math.random() * 600),
        pubDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // 每天一集
      },
    });
    episodes3.push(episode);
  }

  console.log('✅ 已創建 30 個 Episodes');

  console.log('');
  console.log('🎉 測試資料填充完成！');
  console.log('');
  console.log('📊 統計：');
  console.log(`   - Podcasts: 3`);
  console.log(`   - Episodes: 30`);
}

main()
  .catch((e) => {
    console.error('❌ 錯誤:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
