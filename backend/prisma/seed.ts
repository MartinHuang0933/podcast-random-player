import { PrismaClient } from '@prisma/client';
import Parser from 'rss-parser';

const prisma = new PrismaClient();
const parser = new Parser();

const PODCAST_FEEDS = [
  // === 原有 30 個 ===
  { feedUrl: 'https://feeds.soundon.fm/podcasts/954689a5-3096-43a4-a80b-7810b219cef3.xml', language: 'zh-TW', applePodcastId: '1500839292' }, // 股癌
  { feedUrl: 'https://feeds.buzzsprout.com/1974862.rss', language: 'zh-TW', applePodcastId: '1106847606' }, // 百靈果NEWS
  { feedUrl: 'https://open.firstory.me/rss/user/cknfhjuuqv2zr0821wzrxep3p', language: 'zh-TW', applePodcastId: '1510554676' }, // 台灣通勤第一品牌
  { feedUrl: 'https://feeds.soundon.fm/podcasts/44833083-490d-4f97-a782-fd5e34c0abef.xml', language: 'zh-TW', applePodcastId: '1475418379' }, // 敏迪選讀
  { feedUrl: 'https://feed.firstory.me/rss/user/cltmj9b0x12b201xh5pincmny', language: 'zh-TW', applePodcastId: '1735265144' }, // 志祺七七-Podcast
  { feedUrl: 'https://feed.firstory.me/rss/user/ckga7ibs77fgl0875bxwgl0y0', language: 'zh-TW', applePodcastId: '1536374746' }, // 唐陽雞酒屋
  { feedUrl: 'https://feeds.soundon.fm/podcasts/adf29720-e93b-4856-a09e-b73544147ec4.xml', language: 'zh-TW', applePodcastId: '1522773953' }, // 好味小姐開束縛我還你原形
  { feedUrl: 'https://feeds.soundon.fm/podcasts/6731d283-54f0-49ec-a040-e5a641c3125f.xml', language: 'zh-TW', applePodcastId: '1452688611' }, // 大人的Small Talk
  { feedUrl: 'https://feed.firstory.me/rss/user/cl39lz2ky01co01ugaba7gr9y', language: 'zh-TW', applePodcastId: '1532820533' }, // 下一本讀什麼？
  { feedUrl: 'https://feeds.soundon.fm/podcasts/c1f1f3c9-8d28-42ad-9f1c-908018b8d9fc.xml', language: 'zh-TW', applePodcastId: '1525816185' }, // The Real Story By 報導者
  { feedUrl: 'https://feeds.soundon.fm/podcasts/4f4a009b-d95b-4590-85cf-d5e050ead84e.xml', language: 'zh-TW', applePodcastId: '1469553043' }, // 轉角國際新聞 Daily Podcast
  { feedUrl: 'https://feeds.soundon.fm/podcasts/8ca4bd3e-35b5-470e-9d0c-6b70905797f1.xml', language: 'zh-TW', applePodcastId: '1202558455' }, // 轉角國際・重磅廣播
  { feedUrl: 'https://feed.firstory.me/rss/user/ckudnw7fn4tqg0870axzgirva', language: 'zh-TW', applePodcastId: '1482463498' }, // 法客電台 BY 法律白話文運動
  { feedUrl: 'https://feed.firstory.me/rss/user/ck7ok68zmhxjx0873f2jqjut6', language: 'zh-TW', applePodcastId: '1500778610' }, // 雷蒙三十
  { feedUrl: 'https://anchor.fm/s/98a6fac/podcast/rss', language: 'zh-TW', applePodcastId: '1474007441' }, // 馬克信箱 (Dear Marcy)
  { feedUrl: 'https://feeds.soundon.fm/podcasts/73930beb-4136-4b36-a910-39984335b7bb.xml', language: 'zh-TW', applePodcastId: '1536242998' }, // 吳淡如人生實用商學院
  { feedUrl: 'https://feeds.soundon.fm/podcasts/cc98e53c-2827-4bb7-ac15-171a630760c2.xml', language: 'zh-TW', applePodcastId: '1544980529' }, // 鄧惠文 不想說
  { feedUrl: 'https://feeds.soundon.fm/podcasts/ecd31076-d12d-46dc-ba11-32d24b41cca5.xml', language: 'zh-TW', applePodcastId: '1477164549' }, // 呱吉
  { feedUrl: 'https://feeds.soundon.fm/podcasts/ce0ead8f-d4e1-4e97-b25e-dc8c88b1a56d.xml', language: 'zh-TW', applePodcastId: '1475701538' }, // 那些學校沒教的事
  { feedUrl: 'https://feeds.soundon.fm/podcasts/45edd1fd-3ad0-4e95-aaa8-b229856181c4.xml', language: 'zh-TW', applePodcastId: '1500190593' }, // 寶島少年兄
  { feedUrl: 'https://feed.firstory.me/rss/user/ckg2mhkljssl708756xu1zvcy', language: 'zh-TW', applePodcastId: '1535319502' }, // 從前從前 (童話阿姨)
  { feedUrl: 'https://feeds.soundcloud.com/users/soundcloud:users:322164009/sounds.rss', language: 'zh-TW', applePodcastId: '1264391007' }, // 科技島讀
  { feedUrl: 'https://feeds.soundon.fm/podcasts/da58250f-84f2-445e-b3c5-6175af478fa9.xml', language: 'zh-TW', applePodcastId: '1488718553' }, // 啟點文化一天聽一點
  { feedUrl: 'https://feeds.soundon.fm/podcasts/8632047c-dd18-4bde-a86c-f6c44df60b16.xml', language: 'zh-TW', applePodcastId: '1549521834' }, // 時間的女兒：八卦歷史
  { feedUrl: 'https://feeds.soundon.fm/podcasts/e0baca98-490d-4f44-83c9-32f8ec8eec45.xml', language: 'zh-TW', applePodcastId: '1486227803' }, // 聽天下：天下雜誌Podcast
  { feedUrl: 'https://feed.firstory.me/rss/user/ckjmox9tvwrzk0b38nplfr5by', language: 'zh-TW', applePodcastId: '1504424352' }, // 矽谷為什麼？
  { feedUrl: 'https://feed.firstory.me/rss/user/ck7t2fz77qu7g0873ln5hz5cl', language: 'zh-TW', applePodcastId: '1500162537' }, // 哇賽心理學
  { feedUrl: 'https://feed.firstory.me/rss/user/ckks5eepbgcwl0815tfre8q3s', language: 'zh-TW', applePodcastId: '1552655948' }, // 強者我朋友 by 志祺七七
  { feedUrl: 'https://feeds.soundon.fm/podcasts/17e025f5-3a87-41b5-8cff-af804ad195f3.xml', language: 'zh-TW', applePodcastId: '1547950387' }, // 劉軒的How to人生學
  { feedUrl: 'https://feed.firstory.me/rss/user/clvknrxxl0p8701x65wnig3yw', language: 'zh-TW', applePodcastId: '1625222138' }, // 曾寶儀的人生藏寶圖

  // === 新增 70 個（新聞、財經、科技、投資、職場、創業、英文、心理、健康、運動、電影、閱讀、歷史、旅遊、美食、育兒等） ===
  // 新聞類
  { feedUrl: 'https://feeds.soundon.fm/podcasts/5122cf56-9e52-4fef-8258-e168e1e2694b.xml', language: 'zh-TW', applePodcastId: '1812343530' }, // 10分鐘早報
  { feedUrl: 'https://anchor.fm/s/27b2c13c/podcast/rss', language: 'zh-TW', applePodcastId: '1519821634' }, // 公視每日新聞 Daily News
  { feedUrl: 'https://feeds.soundon.fm/podcasts/07593470-9f99-4b05-b8d2-98a6350a2891.xml', language: 'zh-TW', applePodcastId: '1740431670' }, // TVBS新聞
  { feedUrl: 'https://feeds.soundon.fm/podcasts/37ad7105-4ec9-4f8d-a4dd-95ab40c91708.xml', language: 'zh-TW', applePodcastId: '1646175218' }, // TVBS《Focus全球新聞》
  { feedUrl: 'https://feeds.soundon.fm/podcasts/968a601e-b2fa-4795-b857-602d8a73064e.xml', language: 'zh-TW', applePodcastId: '1534702773' }, // 台視新聞 每日頭條
  { feedUrl: 'https://feeds.soundon.fm/podcasts/68ee2738-dec6-4737-b952-6716c6d68051.xml', language: 'zh-TW', applePodcastId: '1526620065' }, // 中廣新聞網

  // 財經投資類
  { feedUrl: 'https://feeds.soundcloud.com/users/soundcloud:users:735679489/sounds.rss', language: 'zh-TW', applePodcastId: '1488295306' }, // 游庭皓的財經皓角
  { feedUrl: 'https://feeds.soundon.fm/podcasts/d2aab16c-3a70-4023-b52b-e50f07852ecd.xml', language: 'zh-TW', applePodcastId: '1522682178' }, // MacroMicro 財經M平方
  { feedUrl: 'https://feeds.soundon.fm/podcasts/91817f42-fe15-4068-a750-dd7ec48dfa68.xml', language: 'zh-TW', applePodcastId: '1538551455' }, // 股魚_財經不正經
  { feedUrl: 'https://feeds.soundon.fm/podcasts/c1ea3c9f-9b5b-47f6-ad17-188819ab91cf.xml', language: 'zh-TW', applePodcastId: '1565900831' }, // 理財太太 - 財經漫遊世界
  { feedUrl: 'https://feeds.soundon.fm/podcasts/489a6945-a341-40ca-88ab-73c174057634.xml', language: 'zh-TW', applePodcastId: '1531443831' }, // MoneyDJ財經新聞
  { feedUrl: 'https://feed.firstory.me/rss/user/clcftm46z000201z45w1c47fi', language: 'zh-TW', applePodcastId: '1513810531' }, // 財報狗
  { feedUrl: 'https://feeds.soundon.fm/podcasts/4a8660a0-e0d0-490b-8d46-c28219606f47.xml', language: 'zh-TW', applePodcastId: '1546879892' }, // 美股投資學-財女珍妮
  { feedUrl: 'https://feeds.soundon.fm/podcasts/686ddd56-9b4d-4585-8e9d-31e722f989cf.xml', language: 'zh-TW', applePodcastId: '1518952450' }, // 投資癮
  { feedUrl: 'https://feeds.soundon.fm/podcasts/b8f5a471-f4f7-4763-9678-65887beda63a.xml', language: 'zh-TW', applePodcastId: '1487378625' }, // M觀點 | 科技X商業X投資
  { feedUrl: 'https://feeds.soundon.fm/podcasts/d86b8cbf-70b1-4b61-a073-3d54367c2904.xml', language: 'zh-TW', applePodcastId: '1490748040' }, // 理財學伴 | MoneyMate

  // 科技類
  { feedUrl: 'https://feeds.soundon.fm/podcasts/ead686e9-4513-4217-beb5-5fa4d215860d.xml', language: 'zh-TW', applePodcastId: '1473264362' }, // 科技報橘
  { feedUrl: 'https://feeds.soundon.fm/podcasts/d5f6f588-d93a-4876-9943-255c48cc16da.xml', language: 'zh-TW', applePodcastId: '1609585395' }, // 果仁聊科技
  { feedUrl: 'https://feeds.soundon.fm/podcasts/3067c238-9028-48fa-be16-ae37578ed148.xml', language: 'zh-TW', applePodcastId: '1531742702' }, // 曲博科技教室

  // 職場類
  { feedUrl: 'https://feeds.soundon.fm/podcasts/8974604f-f946-4094-9fa6-c5debecea64b.xml', language: 'zh-TW', applePodcastId: '1808843707' }, // 職場的那些鳥事
  { feedUrl: 'https://feed.podbean.com/expivotal/feed.xml', language: 'zh-TW', applePodcastId: '1543869907' }, // Expivotal 職場心理學
  { feedUrl: 'https://feeds.soundon.fm/podcasts/3809d680-485f-4e45-82c8-cc58179a7f21.xml', language: 'zh-TW', applePodcastId: '1538133820' }, // 職場求生指南
  { feedUrl: 'https://feeds.soundon.fm/podcasts/b1234273-bf61-454e-945b-7a3d3089ce84.xml', language: 'zh-TW', applePodcastId: '1665424988' }, // 好想離職喔
  { feedUrl: 'https://feeds.soundon.fm/podcasts/8af3cb29-473b-4396-bcb9-ccadf0be8508.xml', language: 'zh-TW', applePodcastId: '1496107421' }, // 欸我問你喔

  // 創業類
  { feedUrl: 'https://feed.firstory.me/rss/user/cklq6bohs2jgw0892t64hqy72', language: 'zh-TW', applePodcastId: '1557162789' }, // 聽說你想創業
  { feedUrl: 'https://feed.firstory.me/rss/user/ckq0m5nxz1i530832p5t5pa0d', language: 'zh-TW', applePodcastId: '1572935042' }, // 一人創業
  { feedUrl: 'https://feed.firstory.me/rss/user/ckiytzu3u2sjn08541m216to0', language: 'zh-TW', applePodcastId: '1546031373' }, // 早知道就不創業了
  { feedUrl: 'https://feeds.soundon.fm/podcasts/5a0d4484-e83a-4011-b211-c5a5ced5a0e0.xml', language: 'zh-TW', applePodcastId: '1524163122' }, // 獨角人物誌 | 每天創業十分鐘

  // 英文學習類
  { feedUrl: 'https://feeds.soundon.fm/podcasts/dbbc3da5-7c8b-4445-8078-f1daf84dcd14.xml', language: 'zh-TW', applePodcastId: '1732918254' }, // 一小時聽英文
  { feedUrl: 'https://feeds.soundon.fm/podcasts/5be5e908-cd92-4aad-9828-36ec49030eb1.xml', language: 'zh-TW', applePodcastId: '1518397087' }, // 零基礎溜英文
  { feedUrl: 'https://feeds.soundon.fm/podcasts/0cb16276-249c-4d9d-834a-bbbaf7a51cc7.xml', language: 'zh-TW', applePodcastId: '1528196420' }, // 聽故事學英文
  { feedUrl: 'https://feeds.soundon.fm/podcasts/5c3172bb-4d57-43c4-8793-1513f8aebb99.xml', language: 'zh-TW', applePodcastId: '1462457142' }, // Kevin 英文不難
  { feedUrl: 'https://feeds.soundon.fm/podcasts/97dadd7a-3960-4e4e-a028-27fac7a57386.xml', language: 'zh-TW', applePodcastId: '1692140089' }, // 看新聞學英文
  { feedUrl: 'https://feeds.soundon.fm/podcasts/4fe3b80b-a5a9-415a-a42c-207d849778aa.xml', language: 'zh-TW', applePodcastId: '1609990073' }, // 隨口說英文

  // 心理健康類
  { feedUrl: 'https://feeds.soundon.fm/podcasts/fcc56708-5394-4544-9d1e-5ad98f28b16c.xml', language: 'zh-TW', applePodcastId: '1687913763' }, // 蘇予昕心理諮商所 下班後
  { feedUrl: 'https://feeds.soundon.fm/podcasts/cef82d25-62c2-4563-bab4-8c713a0a2126.xml', language: 'zh-TW', applePodcastId: '1722724044' }, // 哇賽讀心書
  { feedUrl: 'https://feed.firstory.me/rss/user/cl7jfrduu029601wmdwgh3zoc', language: 'zh-TW', applePodcastId: '1645333495' }, // Sherry's Notes 雪力的心理學筆記
  { feedUrl: 'https://feed.firstory.me/rss/user/ckcfjl5bn49ev0918vym3ig9f', language: 'zh-TW', applePodcastId: '1519196193' }, // 心理師想跟你說
  { feedUrl: 'https://feeds.soundon.fm/podcasts/9227fc4c-c954-46dd-b392-1ab7f3c43c33.xml', language: 'zh-TW', applePodcastId: '1489443149' }, // 海苔熊的心理話
  { feedUrl: 'https://feed.firstory.me/rss/user/ckc9t84o4ekj609180unpjro3', language: 'zh-TW', applePodcastId: '1523001462' }, // 心理高蛋白

  // 健康運動類
  { feedUrl: 'https://feeds.soundon.fm/podcasts/9ca660b2-9004-4f3c-a4cd-a868ca0de085.xml', language: 'zh-TW', applePodcastId: '1709234515' }, // 健康問良醫
  { feedUrl: 'https://feeds.soundon.fm/podcasts/b4c7ce12-b392-4364-8d44-08bdd33bf0aa.xml', language: 'zh-TW', applePodcastId: '1740668200' }, // 健康2.0
  { feedUrl: 'https://feeds.soundon.fm/podcasts/a36ab90f-f547-48fd-8649-e98afb0b2700.xml', language: 'zh-TW', applePodcastId: '1612751706' }, // 早安健康Podcast
  { feedUrl: 'https://feeds.soundon.fm/podcasts/32055d1d-241d-46f2-80d2-b6d3a7a955fb.xml', language: 'zh-TW', applePodcastId: '1609589996' }, // 陳月卿 健康4.0
  { feedUrl: 'https://feeds.soundon.fm/podcasts/d4b00dee-c184-4148-8adc-e3533157b632.xml', language: 'zh-TW', applePodcastId: '1558958876' }, // 運動人的 Pain Cave
  { feedUrl: 'https://www.omnycontent.com/d/playlist/a4cc0a4a-642d-45d7-ac5d-ac5600c620b0/b16c991b-61c5-48db-a349-ac5b0086e920/9298e3e1-d141-4f27-86de-ac5b0086e929/podcast.rss', language: 'zh-TW', applePodcastId: '1489263450' }, // 運動視界啪
  { feedUrl: 'https://feeds.soundon.fm/podcasts/6cf7decf-76dc-4bd7-8a71-b6b2285041b6.xml', language: 'zh-TW', applePodcastId: '1539844062' }, // NOW聽運動

  // 電影閱讀類
  { feedUrl: 'https://feeds.soundcloud.com/users/soundcloud:users:366689468/sounds.rss', language: 'zh-TW', applePodcastId: '1519378369' }, // 那些電影教我的事
  { feedUrl: 'https://feed.firstory.me/rss/user/ckj7zhqmectd00984anxpaypq', language: 'zh-TW', applePodcastId: '1546589315' }, // 下班看電影
  { feedUrl: 'https://feeds.soundon.fm/podcasts/34592a4e-95f8-45cc-8097-3599abf07a53.xml', language: 'zh-TW', applePodcastId: '1566680691' }, // 電影說書人
  { feedUrl: 'https://anchor.fm/s/c8c1944/podcast/rss', language: 'zh-TW', applePodcastId: '1471935494' }, // Openbook．閱讀隨身聽
  { feedUrl: 'https://feeds.soundon.fm/podcasts/09b4ce0b-2690-4649-b08f-0678f94b306b.xml', language: 'zh-TW', applePodcastId: '1553436127' }, // 衣櫥裡的讀者
  { feedUrl: 'https://feed.firstory.me/rss/user/ckisg2rhv5d3h0822wojrdcqs', language: 'zh-TW', applePodcastId: '1545511347' }, // 天下文化‧相信閱讀

  // 歷史類
  { feedUrl: 'https://feed.firstory.me/rss/user/ck3zoh6u345oy0877onts4sum', language: 'zh-TW', applePodcastId: '1495138646' }, // 歷史下酒菜
  { feedUrl: 'https://feeds.soundon.fm/podcasts/28976fc6-7f5f-4abd-9b58-1471394cebcd.xml', language: 'zh-TW', applePodcastId: '1585467941' }, // 說給孩子聽的歷史故事
  { feedUrl: 'https://feeds.soundon.fm/podcasts/d2c6a5bd-e504-4c5a-aa79-0d4af6aa9feb.xml', language: 'zh-TW', applePodcastId: '1771214837' }, // 歷史學柑仔店
  { feedUrl: 'https://feed.firstory.me/rss/user/ckrd5gb22gild0806s9pthc6f', language: 'zh-TW', applePodcastId: '1578213878' }, // 台灣歷史故事

  // 旅遊美食類
  { feedUrl: 'https://feed.firstory.me/rss/user/ckew5rpt65x5t0839phacarf1', language: 'zh-TW', applePodcastId: '1537360741' }, // 跟著耳朵遊日本
  { feedUrl: 'https://feed.firstory.me/rss/user/ckl04p1mph62u08050jtub8rf', language: 'zh-TW', applePodcastId: '1567737350' }, // 林氏璧孔醫師的日本旅遊情報站
  { feedUrl: 'https://feeds.soundon.fm/podcasts/0406ab95-900b-496f-a1fe-e7e978f81432.xml', language: 'zh-TW', applePodcastId: '1564369241' }, // 一直飛旅遊 Podcast
  { feedUrl: 'https://anchor.fm/s/1f1776a8/podcast/rss', language: 'zh-TW', applePodcastId: '1513313483' }, // 美食關鍵詞
  { feedUrl: 'https://feeds.soundon.fm/podcasts/ef2612a4-6c0f-41ae-8e96-d92cb07f843e.xml', language: 'zh-TW', applePodcastId: '1514420753' }, // 美食加幹話
  { feedUrl: 'https://feed.firstory.me/rss/user/ckfwvhhyji16w08009ekw6sz3', language: 'zh-TW', applePodcastId: '1531919768' }, // 路易食堂 Louis food talks

  // 育兒親子類
  { feedUrl: 'https://feeds.soundon.fm/podcasts/76324450-d427-444a-a830-9ad726b6a188.xml', language: 'zh-TW', applePodcastId: '1543151341' }, // 媽很想聊
  { feedUrl: 'https://feed.firstory.me/rss/user/ckjs5n209kt9f0b38rm4m057k', language: 'zh-TW', applePodcastId: '1562108618' }, // 活著就好-不焦慮媽媽的育兒日記
  { feedUrl: 'https://feed.firstory.me/rss/user/ckfnaujal6zke08365x63o035', language: 'zh-TW', applePodcastId: '1534520208' }, // 歡迎來到育兒地獄
  { feedUrl: 'https://feeds.soundon.fm/podcasts/fbecd247-264d-443c-8809-a9649d8b3d48.xml', language: 'zh-TW', applePodcastId: '1738612637' }, // 信誼好好育兒
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

      // 每個 podcast 只取最新的前 2 集
      const items = (feed.items || [])
        .filter(item => item.enclosure?.url)
        .slice(0, 2);

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
