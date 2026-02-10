# 隨機 Podcast 播放器 - 完整專案規劃

## 專案概述
一個讓用戶隨機發現和收聽 Podcast 內容的網頁應用，類似「隨機收聽廣播」的體驗。

## 技術棧建議

### 前端
- **React 18 + TypeScript** - 主要框架
- **Vite** - 構建工具（快速開發體驗）
- **TailwindCSS** - 樣式框架
- **React Query (TanStack Query)** - 資料狀態管理
- **Zustand** - 輕量級狀態管理（播放器狀態）
- **Axios** - HTTP 請求

### 後端
- **Node.js + Express** 或 **Next.js API Routes**
- **TypeScript**
- **Podcast Index API** 或 **iTunes RSS API** - Podcast 資料來源
- **RSS Parser** - 解析 Podcast feed

### 資料庫
- **PostgreSQL** (Zeabur 支援) 或 **SQLite**（開發階段）
- **Prisma ORM** - 資料庫操作

### 部署
- **Zeabur** - 主要部署平台
- **GitHub Actions** - CI/CD（可選）

---

## 一、功能流程

### 1.1 主要用戶流程

```
[首頁載入]
    ↓
[顯示隨機按鈕]
    ↓
[用戶點擊「隨機播放」] ←─────────┐
    ↓                            │
[系統隨機選擇 Podcast]           │
    ↓                            │
[隨機選擇時間點]                 │
    ↓                            │
[載入音訊並開始播放]             │
    ↓                            │
[顯示節目資訊 + 控制器]          │
    ↓                            │
[用戶選擇操作]                   │
    │                            │
    ├─→ [繼續播放] ──────────────┤
    ├─→ [收藏此集] → [存入資料庫] │
    ├─→ [追蹤節目] → [存入追蹤清單]│
    └─→ [下一個隨機] ─────────────┘
```

### 1.2 詳細功能流程

#### A. 隨機播放流程
```typescript
1. 用戶觸發隨機播放
2. 後端從 Podcast 資料池中隨機選擇一個節目
3. 從該節目的 episodes 中隨機選擇一集
4. 取得該集的總長度（duration）
5. 隨機生成起始時間點（0 ~ duration-300秒）
6. 返回播放資訊：
   {
     podcastId: string,
     podcastTitle: string,
     episodeId: string,
     episodeTitle: string,
     audioUrl: string,
     startTime: number,
     duration: number,
     coverImage: string,
     description: string
   }
7. 前端載入音訊並跳轉到指定時間點
8. 開始播放
```

#### B. 收藏功能流程
```typescript
1. 用戶點擊「收藏」按鈕
2. 驗證用戶登入狀態（若需要）
3. 儲存到資料庫：
   - episode_id
   - podcast_id
   - bookmarked_at（時間點）
   - current_time（當前播放進度）
4. 更新 UI 狀態（收藏按鈕變色）
5. 顯示成功提示
```

#### C. 追蹤節目流程
```typescript
1. 用戶點擊「追蹤節目」
2. 檢查是否已追蹤
3. 若未追蹤：
   - 儲存 podcast_id 到 subscriptions 表
   - 抓取最新 episodes 列表
   - 顯示「已追蹤」狀態
4. 若已追蹤：
   - 跳轉到「我的追蹤」頁面
```

---

## 二、程式結構

### 2.1 專案目錄結構

```
podcast-random-player/
├── frontend/                    # 前端應用
│   ├── public/
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/          # React 元件
│   │   │   ├── Player/
│   │   │   │   ├── AudioPlayer.tsx      # 音訊播放器元件
│   │   │   │   ├── PlayerControls.tsx   # 播放控制按鈕
│   │   │   │   ├── ProgressBar.tsx      # 進度條
│   │   │   │   └── VolumeControl.tsx    # 音量控制
│   │   │   ├── PodcastCard/
│   │   │   │   ├── PodcastCard.tsx      # 節目資訊卡片
│   │   │   │   ├── ActionButtons.tsx    # 收藏/追蹤按鈕
│   │   │   │   └── EpisodeInfo.tsx      # 單集資訊
│   │   │   ├── Layout/
│   │   │   │   ├── Header.tsx           # 頁首
│   │   │   │   ├── Sidebar.tsx          # 側邊欄
│   │   │   │   └── Footer.tsx           # 頁尾
│   │   │   └── common/
│   │   │       ├── Button.tsx           # 通用按鈕
│   │   │       ├── Loading.tsx          # 載入動畫
│   │   │       └── ErrorBoundary.tsx    # 錯誤邊界
│   │   ├── pages/               # 頁面元件
│   │   │   ├── HomePage.tsx             # 首頁（隨機播放）
│   │   │   ├── MyLibraryPage.tsx        # 我的收藏
│   │   │   ├── SubscriptionsPage.tsx    # 追蹤清單
│   │   │   └── EpisodeDetailPage.tsx    # 單集詳情
│   │   ├── hooks/               # 自訂 Hooks
│   │   │   ├── useAudioPlayer.ts        # 音訊播放邏輯
│   │   │   ├── useRandomPodcast.ts      # 隨機選擇邏輯
│   │   │   ├── useBookmark.ts           # 收藏功能
│   │   │   └── useSubscription.ts       # 追蹤功能
│   │   ├── services/            # API 服務
│   │   │   ├── api.ts                   # API 基礎配置
│   │   │   ├── podcastService.ts        # Podcast 相關 API
│   │   │   ├── userService.ts           # 用戶相關 API
│   │   │   └── types.ts                 # TypeScript 類型定義
│   │   ├── store/               # 狀態管理
│   │   │   ├── playerStore.ts           # 播放器狀態
│   │   │   └── userStore.ts             # 用戶狀態
│   │   ├── utils/               # 工具函數
│   │   │   ├── timeFormat.ts            # 時間格式化
│   │   │   ├── random.ts                # 隨機數生成
│   │   │   └── storage.ts               # LocalStorage 操作
│   │   ├── App.tsx              # 主應用元件
│   │   ├── main.tsx             # 應用入口
│   │   └── index.css            # 全局樣式
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                     # 後端 API
│   ├── src/
│   │   ├── controllers/         # 控制器
│   │   │   ├── podcastController.ts    # Podcast 相關控制器
│   │   │   ├── userController.ts       # 用戶控制器
│   │   │   └── randomController.ts     # 隨機播放控制器
│   │   ├── services/            # 業務邏輯
│   │   │   ├── podcastService.ts       # Podcast 資料抓取
│   │   │   ├── rssParser.ts            # RSS 解析
│   │   │   ├── randomizer.ts           # 隨機選擇邏輯
│   │   │   └── cacheService.ts         # 快取服務
│   │   ├── models/              # 資料模型（Prisma）
│   │   │   └── schema.prisma            # 資料庫 schema
│   │   ├── routes/              # 路由定義
│   │   │   ├── index.ts
│   │   │   ├── podcast.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   └── random.routes.ts
│   │   ├── middleware/          # 中介軟體
│   │   │   ├── errorHandler.ts         # 錯誤處理
│   │   │   ├── cors.ts                 # CORS 設定
│   │   │   └── rateLimit.ts            # 速率限制
│   │   ├── utils/               # 工具函數
│   │   │   ├── logger.ts               # 日誌工具
│   │   │   └── validator.ts            # 驗證工具
│   │   ├── types/               # TypeScript 類型
│   │   │   └── index.ts
│   │   ├── config/              # 配置文件
│   │   │   └── index.ts
│   │   └── index.ts             # 應用入口
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts              # 資料庫種子資料
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                        # 文檔
│   ├── API.md                   # API 文檔
│   ├── DEPLOYMENT.md            # 部署指南
│   └── CONTRIBUTING.md          # 貢獻指南
│
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD 配置
│
├── docker-compose.yml           # Docker 配置（開發環境）
├── .gitignore
├── README.md
└── PROJECT_PLAN.md              # 本文檔
```

### 2.2 核心資料模型（Prisma Schema）

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 用戶表（可選，若需要用戶系統）
model User {
  id            String         @id @default(cuid())
  email         String?        @unique
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  bookmarks     Bookmark[]
  subscriptions Subscription[]
  
  @@map("users")
}

// Podcast 節目表
model Podcast {
  id              String         @id @default(cuid())
  externalId      String         @unique  // 來自 Podcast Index 的 ID
  title           String
  author          String?
  description     String?
  coverImage      String?
  feedUrl         String         @unique
  website         String?
  categories      String[]       // JSON array of categories
  language        String?
  lastFetchedAt   DateTime       @default(now())
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  episodes        Episode[]
  subscriptions   Subscription[]
  
  @@index([externalId])
  @@map("podcasts")
}

// Podcast 單集表
model Episode {
  id          String     @id @default(cuid())
  externalId  String     @unique  // 來自 RSS 的 GUID
  podcastId   String
  title       String
  description String?
  audioUrl    String
  duration    Int        // 秒數
  pubDate     DateTime
  seasonNumber Int?
  episodeNumber Int?
  coverImage  String?    // 單集封面（若有）
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  podcast     Podcast    @relation(fields: [podcastId], references: [id], onDelete: Cascade)
  bookmarks   Bookmark[]
  
  @@index([podcastId])
  @@index([pubDate])
  @@map("episodes")
}

// 收藏表
model Bookmark {
  id          String   @id @default(cuid())
  userId      String?  // 可選，若無用戶系統可用 sessionId
  episodeId   String
  podcastId   String   // 冗餘但方便查詢
  currentTime Int      @default(0)  // 收藏時的播放進度（秒）
  note        String?  // 用戶備註
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  episode     Episode  @relation(fields: [episodeId], references: [id], onDelete: Cascade)
  
  @@unique([userId, episodeId])
  @@index([userId])
  @@index([episodeId])
  @@map("bookmarks")
}

// 追蹤節目表
model Subscription {
  id          String   @id @default(cuid())
  userId      String?
  podcastId   String
  createdAt   DateTime @default(now())
  user        User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  podcast     Podcast  @relation(fields: [podcastId], references: [id], onDelete: Cascade)
  
  @@unique([userId, podcastId])
  @@index([userId])
  @@map("subscriptions")
}

// 播放歷史表（可選）
model PlayHistory {
  id          String   @id @default(cuid())
  userId      String?
  episodeId   String
  startTime   Int      // 開始播放的時間點
  duration    Int      // 播放時長（秒）
  createdAt   DateTime @default(now())
  
  @@index([userId])
  @@index([createdAt])
  @@map("play_history")
}
```

### 2.3 核心 API 端點

```typescript
// backend/src/routes/random.routes.ts

GET  /api/random              // 隨機獲取一個 Podcast episode + 隨機時間點
GET  /api/random/next         // 獲取下一個隨機內容（排除最近播放的）

// backend/src/routes/podcast.routes.ts

GET  /api/podcasts            // 獲取 Podcast 列表（分頁）
GET  /api/podcasts/:id        // 獲取單個 Podcast 詳情
GET  /api/podcasts/:id/episodes  // 獲取 Podcast 的所有 episodes
GET  /api/episodes/:id        // 獲取單集詳情

// backend/src/routes/user.routes.ts

POST /api/bookmarks           // 新增收藏
GET  /api/bookmarks           // 獲取用戶收藏列表
DELETE /api/bookmarks/:id     // 刪除收藏
PUT  /api/bookmarks/:id       // 更新收藏（進度、備註）

POST /api/subscriptions       // 追蹤節目
GET  /api/subscriptions       // 獲取追蹤列表
DELETE /api/subscriptions/:id // 取消追蹤

POST /api/play-history        // 記錄播放歷史
GET  /api/play-history        // 獲取播放歷史
```

### 2.4 核心功能實作範例

#### A. 隨機播放邏輯

```typescript
// backend/src/services/randomizer.ts

interface RandomResult {
  podcast: {
    id: string;
    title: string;
    author: string;
    coverImage: string;
  };
  episode: {
    id: string;
    title: string;
    description: string;
    audioUrl: string;
    duration: number;
  };
  startTime: number;
}

export class RandomizerService {
  private recentEpisodeIds: Set<string> = new Set();
  private maxRecentSize = 50; // 避免短期內重複

  async getRandomEpisode(excludeRecent: boolean = true): Promise<RandomResult> {
    // 1. 從資料庫隨機選擇一個 Podcast
    const randomPodcast = await prisma.podcast.findMany({
      take: 1,
      skip: Math.floor(Math.random() * await prisma.podcast.count()),
      include: {
        episodes: {
          where: excludeRecent ? {
            id: { notIn: Array.from(this.recentEpisodeIds) }
          } : {},
          orderBy: { pubDate: 'desc' },
          take: 20 // 只取最近 20 集
        }
      }
    });

    if (!randomPodcast[0] || randomPodcast[0].episodes.length === 0) {
      throw new Error('No episodes available');
    }

    const podcast = randomPodcast[0];
    
    // 2. 從該 Podcast 隨機選擇一集
    const randomEpisodeIndex = Math.floor(Math.random() * podcast.episodes.length);
    const episode = podcast.episodes[randomEpisodeIndex];

    // 3. 生成隨機起始時間（避免太接近結尾）
    const maxStartTime = Math.max(0, episode.duration - 300); // 至少保留 5 分鐘
    const startTime = Math.floor(Math.random() * maxStartTime);

    // 4. 記錄到最近播放列表
    this.recentEpisodeIds.add(episode.id);
    if (this.recentEpisodeIds.size > this.maxRecentSize) {
      const firstId = this.recentEpisodeIds.values().next().value;
      this.recentEpisodeIds.delete(firstId);
    }

    return {
      podcast: {
        id: podcast.id,
        title: podcast.title,
        author: podcast.author || 'Unknown',
        coverImage: podcast.coverImage || ''
      },
      episode: {
        id: episode.id,
        title: episode.title,
        description: episode.description || '',
        audioUrl: episode.audioUrl,
        duration: episode.duration
      },
      startTime
    };
  }
}
```

#### B. 前端播放器 Hook

```typescript
// frontend/src/hooks/useAudioPlayer.ts

import { useRef, useState, useEffect } from 'react';
import { create } from 'zustand';

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  audioUrl: string | null;
  episodeId: string | null;
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  loadAudio: (url: string, episodeId: string, startTime?: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  audioUrl: null,
  episodeId: null,
  setPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  loadAudio: (audioUrl, episodeId, startTime = 0) => 
    set({ audioUrl, episodeId, currentTime: startTime, isPlaying: false }),
}));

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    audioUrl,
    episodeId,
    setPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    loadAudio
  } = usePlayerStore();

  // 初始化 audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current!.duration);
      });

      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current!.currentTime);
      });

      audioRef.current.addEventListener('ended', () => {
        setPlaying(false);
      });

      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setPlaying(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // 載入新音訊
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.currentTime = currentTime;
    }
  }, [audioUrl]);

  // 控制播放/暫停
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // 控制音量
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    setPlaying(!isPlaying);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      seek(newTime);
    }
  };

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    episodeId,
    togglePlay,
    seek,
    skip,
    setVolume,
    loadAudio
  };
}
```

#### C. 隨機播放 Hook

```typescript
// frontend/src/hooks/useRandomPodcast.ts

import { useMutation } from '@tanstack/react-query';
import { podcastService } from '../services/podcastService';
import { usePlayerStore } from './useAudioPlayer';

export function useRandomPodcast() {
  const { loadAudio } = usePlayerStore();

  const randomMutation = useMutation({
    mutationFn: () => podcastService.getRandomEpisode(),
    onSuccess: (data) => {
      // 載入音訊並跳到隨機時間點
      loadAudio(data.episode.audioUrl, data.episode.id, data.startTime);
    }
  });

  const playRandom = () => {
    randomMutation.mutate();
  };

  return {
    playRandom,
    isLoading: randomMutation.isPending,
    currentEpisode: randomMutation.data,
    error: randomMutation.error
  };
}
```

---

## 三、完整測試流程與測試案例

### 3.1 測試架構

```
tests/
├── unit/                    # 單元測試
│   ├── utils/
│   │   ├── timeFormat.test.ts
│   │   └── random.test.ts
│   ├── services/
│   │   ├── randomizer.test.ts
│   │   ├── rssParser.test.ts
│   │   └── podcastService.test.ts
│   └── hooks/
│       ├── useAudioPlayer.test.tsx
│       └── useRandomPodcast.test.tsx
│
├── integration/             # 整合測試
│   ├── api/
│   │   ├── random.api.test.ts
│   │   ├── podcast.api.test.ts
│   │   └── user.api.test.ts
│   └── database/
│       └── prisma.test.ts
│
├── e2e/                     # 端對端測試
│   ├── randomPlay.e2e.test.ts
│   ├── bookmark.e2e.test.ts
│   └── subscription.e2e.test.ts
│
└── setup/
    ├── jest.setup.ts
    ├── testDatabase.ts
    └── mockData.ts
```

### 3.2 測試工具配置

```json
// package.json (backend)
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "jest --config jest.e2e.config.js"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "supertest": "^6.3.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "playwright": "^1.40.0"
  }
}
```

### 3.3 單元測試案例

#### A. 隨機數生成測試

```typescript
// tests/unit/services/randomizer.test.ts

import { RandomizerService } from '../../../src/services/randomizer';
import { prismaMock } from '../../setup/prismaMock';

describe('RandomizerService', () => {
  let randomizer: RandomizerService;

  beforeEach(() => {
    randomizer = new RandomizerService();
  });

  describe('getRandomEpisode', () => {
    it('應該返回隨機的 episode 和起始時間', async () => {
      // Arrange
      const mockPodcast = {
        id: 'podcast-1',
        title: 'Test Podcast',
        author: 'Test Author',
        coverImage: 'http://example.com/cover.jpg',
        episodes: [
          {
            id: 'episode-1',
            title: 'Episode 1',
            description: 'Test description',
            audioUrl: 'http://example.com/audio.mp3',
            duration: 3600 // 60 minutes
          }
        ]
      };

      prismaMock.podcast.findMany.mockResolvedValue([mockPodcast]);
      prismaMock.podcast.count.mockResolvedValue(1);

      // Act
      const result = await randomizer.getRandomEpisode();

      // Assert
      expect(result).toHaveProperty('podcast');
      expect(result).toHaveProperty('episode');
      expect(result).toHaveProperty('startTime');
      expect(result.startTime).toBeGreaterThanOrEqual(0);
      expect(result.startTime).toBeLessThan(3300); // duration - 300
      expect(result.episode.id).toBe('episode-1');
    });

    it('應該避免返回最近播放的 episode', async () => {
      // Arrange
      const mockPodcasts = [
        {
          id: 'podcast-1',
          episodes: [
            { id: 'episode-1', duration: 3600, title: 'Ep 1', audioUrl: '', description: '' },
            { id: 'episode-2', duration: 3600, title: 'Ep 2', audioUrl: '', description: '' }
          ]
        }
      ];

      prismaMock.podcast.findMany.mockResolvedValue(mockPodcasts);
      prismaMock.podcast.count.mockResolvedValue(1);

      // 先播放 episode-1
      const first = await randomizer.getRandomEpisode(false);
      
      // Act - 再次隨機播放，應排除 episode-1
      const second = await randomizer.getRandomEpisode(true);

      // Assert
      expect(second.episode.id).not.toBe(first.episode.id);
    });

    it('當沒有可用 episode 時應拋出錯誤', async () => {
      // Arrange
      prismaMock.podcast.findMany.mockResolvedValue([]);

      // Act & Assert
      await expect(randomizer.getRandomEpisode()).rejects.toThrow('No episodes available');
    });

    it('起始時間應至少保留 5 分鐘的播放時間', async () => {
      // Arrange
      const mockPodcast = {
        id: 'podcast-1',
        episodes: [
          {
            id: 'episode-1',
            duration: 600, // 10 minutes
            title: 'Short episode',
            audioUrl: '',
            description: ''
          }
        ]
      };

      prismaMock.podcast.findMany.mockResolvedValue([mockPodcast]);
      prismaMock.podcast.count.mockResolvedValue(1);

      // Act
      const result = await randomizer.getRandomEpisode();

      // Assert
      expect(result.startTime).toBeLessThanOrEqual(300); // 10min - 5min = 5min
    });
  });
});
```

#### B. 時間格式化測試

```typescript
// tests/unit/utils/timeFormat.test.ts

import { formatTime, formatDuration } from '../../../src/utils/timeFormat';

describe('timeFormat utils', () => {
  describe('formatTime', () => {
    it('應該正確格式化秒數為 MM:SS', () => {
      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(30)).toBe('0:30');
      expect(formatTime(90)).toBe('1:30');
      expect(formatTime(3661)).toBe('61:01');
    });

    it('應該正確格式化長時間為 HH:MM:SS', () => {
      expect(formatTime(3600, true)).toBe('1:00:00');
      expect(formatTime(3661, true)).toBe('1:01:01');
      expect(formatTime(7322, true)).toBe('2:02:02');
    });
  });

  describe('formatDuration', () => {
    it('應該將秒數轉換為人類可讀格式', () => {
      expect(formatDuration(30)).toBe('30 秒');
      expect(formatDuration(90)).toBe('1 分 30 秒');
      expect(formatDuration(3600)).toBe('1 小時');
      expect(formatDuration(3661)).toBe('1 小時 1 分');
      expect(formatDuration(7322)).toBe('2 小時 2 分');
    });
  });
});
```

### 3.4 整合測試案例

#### A. API 端點測試

```typescript
// tests/integration/api/random.api.test.ts

import request from 'supertest';
import { app } from '../../../src/index';
import { prisma } from '../../../src/lib/prisma';
import { seedTestData } from '../../setup/mockData';

describe('Random API', () => {
  beforeAll(async () => {
    await seedTestData(); // 填充測試資料
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/random', () => {
    it('應該返回 200 和隨機 episode 資料', async () => {
      const response = await request(app)
        .get('/api/random')
        .expect(200);

      expect(response.body).toHaveProperty('podcast');
      expect(response.body).toHaveProperty('episode');
      expect(response.body).toHaveProperty('startTime');
      expect(response.body.episode).toHaveProperty('audioUrl');
      expect(response.body.startTime).toBeGreaterThanOrEqual(0);
    });

    it('返回的 audioUrl 應該是有效的 URL', async () => {
      const response = await request(app)
        .get('/api/random')
        .expect(200);

      const audioUrl = response.body.episode.audioUrl;
      expect(() => new URL(audioUrl)).not.toThrow();
    });

    it('應該在 3 秒內返回結果', async () => {
      const start = Date.now();
      await request(app).get('/api/random').expect(200);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(3000);
    });
  });

  describe('GET /api/random/next', () => {
    it('應該返回不同的 episode（在多次請求中）', async () => {
      const episodes = new Set();

      for (let i = 0; i < 5; i++) {
        const response = await request(app)
          .get('/api/random/next')
          .expect(200);
        
        episodes.add(response.body.episode.id);
      }

      // 至少應該有 2 個不同的 episode（假設資料庫有足夠內容）
      expect(episodes.size).toBeGreaterThan(1);
    });
  });
});
```

#### B. 收藏功能測試

```typescript
// tests/integration/api/bookmark.api.test.ts

import request from 'supertest';
import { app } from '../../../src/index';
import { prisma } from '../../../src/lib/prisma';

describe('Bookmark API', () => {
  let testEpisodeId: string;
  let testUserId: string;

  beforeAll(async () => {
    // 創建測試用戶和 episode
    const user = await prisma.user.create({
      data: { email: 'test@example.com' }
    });
    testUserId = user.id;

    const episode = await prisma.episode.findFirst();
    testEpisodeId = episode!.id;
  });

  afterAll(async () => {
    await prisma.bookmark.deleteMany({ where: { userId: testUserId } });
    await prisma.user.delete({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  describe('POST /api/bookmarks', () => {
    it('應該成功創建收藏', async () => {
      const response = await request(app)
        .post('/api/bookmarks')
        .send({
          userId: testUserId,
          episodeId: testEpisodeId,
          currentTime: 120
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.episodeId).toBe(testEpisodeId);
      expect(response.body.currentTime).toBe(120);
    });

    it('不應該重複收藏同一個 episode', async () => {
      // 第一次收藏
      await request(app)
        .post('/api/bookmarks')
        .send({
          userId: testUserId,
          episodeId: testEpisodeId,
          currentTime: 120
        })
        .expect(201);

      // 第二次收藏應該失敗
      await request(app)
        .post('/api/bookmarks')
        .send({
          userId: testUserId,
          episodeId: testEpisodeId,
          currentTime: 150
        })
        .expect(409); // Conflict
    });

    it('缺少必要欄位時應返回 400', async () => {
      await request(app)
        .post('/api/bookmarks')
        .send({
          userId: testUserId
          // 缺少 episodeId
        })
        .expect(400);
    });
  });

  describe('GET /api/bookmarks', () => {
    it('應該返回用戶的所有收藏', async () => {
      const response = await request(app)
        .get(`/api/bookmarks?userId=${testUserId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('episode');
      expect(response.body[0]).toHaveProperty('currentTime');
    });
  });

  describe('DELETE /api/bookmarks/:id', () => {
    it('應該成功刪除收藏', async () => {
      // 先創建一個收藏
      const createResponse = await request(app)
        .post('/api/bookmarks')
        .send({
          userId: testUserId,
          episodeId: testEpisodeId,
          currentTime: 200
        })
        .expect(201);

      const bookmarkId = createResponse.body.id;

      // 刪除
      await request(app)
        .delete(`/api/bookmarks/${bookmarkId}`)
        .expect(204);

      // 驗證已刪除
      const bookmark = await prisma.bookmark.findUnique({
        where: { id: bookmarkId }
      });
      expect(bookmark).toBeNull();
    });
  });
});
```

### 3.5 端對端測試案例

#### A. 隨機播放完整流程

```typescript
// tests/e2e/randomPlay.e2e.test.ts

import { test, expect } from '@playwright/test';

test.describe('隨機播放功能', () => {
  test('用戶可以點擊隨機播放並聽到音訊', async ({ page }) => {
    // 1. 訪問首頁
    await page.goto('http://localhost:5173');

    // 2. 等待頁面載入
    await expect(page.locator('h1')).toContainText('隨機 Podcast');

    // 3. 點擊「隨機播放」按鈕
    const randomButton = page.locator('button:has-text("隨機播放")');
    await randomButton.click();

    // 4. 等待載入動畫消失
    await expect(page.locator('[data-testid="loading"]')).toBeHidden({ timeout: 5000 });

    // 5. 驗證播放器出現
    const player = page.locator('[data-testid="audio-player"]');
    await expect(player).toBeVisible();

    // 6. 驗證顯示 Podcast 資訊
    await expect(page.locator('[data-testid="podcast-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="episode-title"]')).toBeVisible();

    // 7. 驗證音訊正在播放
    const playButton = page.locator('[data-testid="play-button"]');
    await expect(playButton).toHaveAttribute('aria-label', '暫停');

    // 8. 驗證進度條在移動
    const progressBar = page.locator('[data-testid="progress-bar"]');
    const initialValue = await progressBar.getAttribute('value');
    await page.waitForTimeout(2000); // 等待 2 秒
    const newValue = await progressBar.getAttribute('value');
    expect(Number(newValue)).toBeGreaterThan(Number(initialValue));
  });

  test('用戶可以點擊「下一個隨機」切換內容', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // 第一次隨機播放
    await page.locator('button:has-text("隨機播放")').click();
    await page.waitForSelector('[data-testid="episode-title"]');
    const firstTitle = await page.locator('[data-testid="episode-title"]').textContent();

    // 點擊「下一個隨機」
    await page.locator('button:has-text("下一個隨機")').click();
    await page.waitForTimeout(1000);
    const secondTitle = await page.locator('[data-testid="episode-title"]').textContent();

    // 驗證內容已改變
    expect(secondTitle).not.toBe(firstTitle);
  });

  test('音訊播放失敗時應顯示錯誤訊息', async ({ page }) => {
    // 模擬網路錯誤
    await page.route('**/api/random', route => route.abort('failed'));

    await page.goto('http://localhost:5173');
    await page.locator('button:has-text("隨機播放")').click();

    // 驗證顯示錯誤訊息
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('載入失敗');
  });
});
```

#### B. 收藏功能流程

```typescript
// tests/e2e/bookmark.e2e.test.ts

import { test, expect } from '@playwright/test';

test.describe('收藏功能', () => {
  test('用戶可以收藏正在播放的 episode', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // 開始隨機播放
    await page.locator('button:has-text("隨機播放")').click();
    await page.waitForSelector('[data-testid="audio-player"]');

    // 點擊收藏按鈕
    const bookmarkButton = page.locator('[data-testid="bookmark-button"]');
    await expect(bookmarkButton).toHaveAttribute('aria-pressed', 'false');
    await bookmarkButton.click();

    // 驗證按鈕狀態改變
    await expect(bookmarkButton).toHaveAttribute('aria-pressed', 'true');

    // 驗證顯示成功提示
    await expect(page.locator('text=已收藏')).toBeVisible();
  });

  test('收藏後可以在「我的收藏」中找到', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // 隨機播放並收藏
    await page.locator('button:has-text("隨機播放")').click();
    await page.waitForSelector('[data-testid="episode-title"]');
    const episodeTitle = await page.locator('[data-testid="episode-title"]').textContent();
    await page.locator('[data-testid="bookmark-button"]').click();

    // 前往「我的收藏」頁面
    await page.locator('a:has-text("我的收藏")').click();
    await expect(page).toHaveURL(/\/library/);

    // 驗證收藏列表中有該 episode
    await expect(page.locator(`text=${episodeTitle}`)).toBeVisible();
  });

  test('可以取消收藏', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // 隨機播放並收藏
    await page.locator('button:has-text("隨機播放")').click();
    await page.waitForSelector('[data-testid="audio-player"]');
    const bookmarkButton = page.locator('[data-testid="bookmark-button"]');
    await bookmarkButton.click();
    await expect(bookmarkButton).toHaveAttribute('aria-pressed', 'true');

    // 再次點擊取消收藏
    await bookmarkButton.click();
    await expect(bookmarkButton).toHaveAttribute('aria-pressed', 'false');

    // 驗證顯示提示
    await expect(page.locator('text=已取消收藏')).toBeVisible();
  });
});
```

#### C. 追蹤節目流程

```typescript
// tests/e2e/subscription.e2e.test.ts

import { test, expect } from '@playwright/test';

test.describe('追蹤節目功能', () => {
  test('用戶可以追蹤正在播放的 Podcast', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // 開始隨機播放
    await page.locator('button:has-text("隨機播放")').click();
    await page.waitForSelector('[data-testid="audio-player"]');

    // 點擊追蹤按鈕
    const subscribeButton = page.locator('[data-testid="subscribe-button"]');
    await subscribeButton.click();

    // 驗證按鈕變為「已追蹤」
    await expect(subscribeButton).toContainText('已追蹤');

    // 驗證顯示成功提示
    await expect(page.locator('text=已追蹤此節目')).toBeVisible();
  });

  test('追蹤後可以在「追蹤清單」中找到', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // 隨機播放並追蹤
    await page.locator('button:has-text("隨機播放")').click();
    await page.waitForSelector('[data-testid="podcast-title"]');
    const podcastTitle = await page.locator('[data-testid="podcast-title"]').textContent();
    await page.locator('[data-testid="subscribe-button"]').click();

    // 前往「追蹤清單」頁面
    await page.locator('a:has-text("追蹤清單")').click();
    await expect(page).toHaveURL(/\/subscriptions/);

    // 驗證追蹤列表中有該節目
    await expect(page.locator(`text=${podcastTitle}`)).toBeVisible();
  });

  test('點擊已追蹤的節目可以查看所有 episodes', async ({ page }) => {
    await page.goto('http://localhost:5173/subscriptions');
    
    // 假設已有追蹤的節目
    const firstPodcast = page.locator('[data-testid="podcast-card"]').first();
    await firstPodcast.click();

    // 驗證跳轉到 episodes 列表
    await expect(page).toHaveURL(/\/podcasts\/[\w-]+/);
    await expect(page.locator('[data-testid="episode-list"]')).toBeVisible();
    
    // 驗證至少有一個 episode
    const episodes = page.locator('[data-testid="episode-item"]');
    await expect(episodes).not.toHaveCount(0);
  });
});
```

### 3.6 效能測試

```typescript
// tests/performance/load.test.ts

import { test, expect } from '@playwright/test';

test.describe('效能測試', () => {
  test('首頁載入時間應小於 2 秒', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(2000);
  });

  test('隨機播放 API 回應時間應小於 1 秒', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const startTime = Date.now();
    await page.locator('button:has-text("隨機播放")').click();
    await page.waitForSelector('[data-testid="audio-player"]');
    const responseTime = Date.now() - startTime;

    expect(responseTime).toBeLessThan(1000);
  });

  test('音訊播放應無明顯延遲', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.locator('button:has-text("隨機播放")').click();
    await page.waitForSelector('[data-testid="audio-player"]');

    // 點擊播放後，進度應立即開始更新
    const playButton = page.locator('[data-testid="play-button"]');
    await playButton.click();

    await page.waitForTimeout(100); // 等待 100ms
    const progressBar = page.locator('[data-testid="progress-bar"]');
    const value = await progressBar.getAttribute('value');
    expect(Number(value)).toBeGreaterThan(0);
  });
});
```

### 3.7 測試執行流程

```bash
# 1. 設置測試環境
npm run test:setup

# 2. 執行單元測試
npm run test:unit

# 3. 執行整合測試
npm run test:integration

# 4. 執行 E2E 測試
npm run test:e2e

# 5. 生成測試覆蓋率報告
npm run test:coverage

# 6. 執行所有測試
npm run test:all

# 7. 持續測試（開發模式）
npm run test:watch
```

### 3.8 測試覆蓋率目標

| 類別 | 目標覆蓋率 |
|------|-----------|
| 核心業務邏輯（services） | ≥ 90% |
| API 路由 | ≥ 85% |
| React Hooks | ≥ 80% |
| UI 元件 | ≥ 70% |
| 工具函數 | ≥ 95% |
| 整體專案 | ≥ 80% |

---

## 四、部署到 Zeabur

### 4.1 專案配置

```yaml
# zeabur.yaml
version: "1"
services:
  frontend:
    type: nodejs
    buildCommand: cd frontend && npm install && npm run build
    startCommand: cd frontend && npm run preview
    ports:
      - 5173
    env:
      VITE_API_URL: ${BACKEND_URL}

  backend:
    type: nodejs
    buildCommand: cd backend && npm install && npx prisma generate
    startCommand: cd backend && npm run start
    ports:
      - 3000
    env:
      DATABASE_URL: ${DATABASE_URL}
      NODE_ENV: production
      CORS_ORIGIN: ${FRONTEND_URL}

  postgres:
    type: postgres
    version: "15"
```

### 4.2 環境變數

```env
# .env.production

# Database
DATABASE_URL=postgresql://user:password@host:5432/podcast_player

# API
API_BASE_URL=https://api.yourapp.com
FRONTEND_URL=https://yourapp.com

# Podcast Data Source
PODCAST_INDEX_KEY=your_podcast_index_key
PODCAST_INDEX_SECRET=your_podcast_index_secret

# Cache (Redis - optional)
REDIS_URL=redis://localhost:6379

# Session (if needed)
SESSION_SECRET=your_session_secret
```

### 4.3 部署步驟

1. **準備專案**
```bash
git add .
git commit -m "準備部署"
git push origin main
```

2. **連接 Zeabur**
- 登入 Zeabur Dashboard
- 創建新專案
- 連接 GitHub repository

3. **配置資料庫**
- 在 Zeabur 創建 PostgreSQL 服務
- 複製 DATABASE_URL

4. **執行 Migration**
```bash
npx prisma migrate deploy
```

5. **填充初始資料**
```bash
npm run seed
```

6. **啟動服務**
- 部署後端服務
- 部署前端服務

### 4.4 部署檢查清單

- [ ] 環境變數已設置
- [ ] 資料庫已創建並執行 migration
- [ ] CORS 設定正確
- [ ] API 端點可訪問
- [ ] 前端可以連接到後端
- [ ] 音訊播放功能正常
- [ ] SSL 憑證已配置
- [ ] 錯誤監控已設置（如 Sentry）
- [ ] 日誌系統已配置

---

## 五、開發時程建議

### 第一週：基礎架構
- Day 1-2: 設置專案結構、資料庫 schema、基礎 API
- Day 3-4: 實作隨機選擇邏輯、RSS parser
- Day 5-7: 前端基礎架構、播放器元件

### 第二週：核心功能
- Day 1-3: 完成音訊播放功能
- Day 4-5: 收藏與追蹤功能
- Day 6-7: UI/UX 優化

### 第三週：測試與優化
- Day 1-3: 撰寫測試案例
- Day 4-5: 效能優化、錯誤處理
- Day 6-7: 部署到 Zeabur、最終測試

---

## 六、未來擴展功能

1. **用戶系統**
   - 註冊/登入
   - 個人化推薦

2. **社交功能**
   - 分享收藏
   - 評論與評分

3. **高級播放功能**
   - 播放速度調整
   - 睡眠定時器
   - 跨設備同步進度

4. **發現功能**
   - 分類瀏覽
   - 搜尋功能
   - 熱門排行榜

5. **AI 功能**
   - 智能推薦
   - 內容摘要
   - 自動生成 Podcast 介紹

---

## 附錄

### A. 技術決策說明

**為什麼選擇 React + TypeScript？**
- 類型安全，減少執行時錯誤
- 豐富的生態系統
- 良好的開發體驗

**為什麼使用 Prisma ORM？**
- 類型安全的資料庫查詢
- 自動生成 migration
- 優秀的開發者體驗

**為什麼選擇 PostgreSQL？**
- Zeabur 原生支援
- 強大的查詢能力
- 可靠性高

### B. 參考資源

- [Podcast Index API](https://podcastindex.org/developers)
- [iTunes RSS Feed](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zeabur Documentation](https://zeabur.com/docs)

### C. 聯絡資訊

專案維護者：[Your Name]  
Email: [your.email@example.com]  
GitHub: [github.com/yourusername/podcast-random-player]
