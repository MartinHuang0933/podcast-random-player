# 專案摘要總覽

## 🎯 專案目標

創建一個創新的網頁應用，讓用戶像「隨機收聽廣播」一樣發現新的 Podcast 內容。

## 💡 核心價值主張

- **驚喜感**：隨機跳轉到任意內容，帶來探索的樂趣
- **低門檻**：無需選擇，一鍵開始，降低決策疲勞
- **發現新內容**：打破推薦算法的資訊繭房，接觸更多元的內容

## 🎯 核心功能（MVP）

| 功能 | 描述 | 優先級 |
|------|------|--------|
| 🎲 隨機播放 | 隨機選擇 Podcast episode 並從隨機時間點開始播放 | P0 |
| ⭐ 收藏功能 | 將喜歡的內容加入收藏，記錄播放進度 | P0 |
| 📻 追蹤節目 | 追蹤整個 Podcast 節目，瀏覽所有 episodes | P0 |
| 🔄 連續隨機 | 一鍵切換到下一個隨機內容 | P1 |

## 🏗️ 技術架構

```
前端: React 18 + TypeScript + Vite + TailwindCSS
  ↓ REST API (HTTPS)
後端: Node.js + Express + TypeScript
  ↓ Prisma ORM
資料庫: PostgreSQL
  ↓ 部署於
平台: Zeabur
```

## 📊 資料模型

```
User (可選)
  ├─→ Bookmarks (收藏)
  └─→ Subscriptions (追蹤)

Podcast (節目)
  ├─→ Episodes (單集)
  └─→ Subscriptions (被追蹤)

Episode (單集)
  └─→ Bookmarks (被收藏)
```

## 🔑 核心演算法

### 隨機播放邏輯

```typescript
1. 從資料庫隨機選擇一個 Podcast
2. 從該 Podcast 隨機選擇一個 Episode
3. 生成隨機起始時間（保留至少 5 分鐘可播放時間）
4. 記錄到「最近播放」列表（避免短期重複）
5. 返回播放資訊
```

**特點**：
- O(1) 時間複雜度（使用隨機 skip）
- 避免短期重複（記憶最近 50 個）
- 保證有足夠播放時間

## 📈 開發時程

| 週次 | 任務 | 可交付成果 |
|------|------|-----------|
| Week 1 | 基礎架構 | 專案設置、資料庫 schema、基礎 API |
| Week 2 | 核心功能 | 音訊播放器、收藏、追蹤功能 |
| Week 3 | 測試與部署 | 完整測試套件、部署到 Zeabur |

## 🧪 測試策略

### 測試金字塔

```
        E2E 測試 (10%)
       /            \
    整合測試 (30%)
   /                  \
  單元測試 (60%)
```

### 測試覆蓋率目標

- 整體專案：≥ 80%
- 核心業務邏輯：≥ 90%
- API 路由：≥ 85%

### 關鍵測試案例

1. **隨機播放**：驗證隨機選擇邏輯、音訊載入、播放控制
2. **收藏功能**：驗證新增、查詢、刪除、更新
3. **追蹤功能**：驗證追蹤、取消、列表顯示

## 🚀 部署流程

```
開發 → 測試 → 構建 → 部署 → 驗證
  │      │      │      │      │
  └──────┴──────┴──────┴──────┘
         CI/CD Pipeline
```

### Zeabur 部署步驟

1. 推送代碼到 GitHub
2. 連接 Zeabur 與 repository
3. 創建 PostgreSQL 服務
4. 配置環境變數
5. 執行 migration
6. 部署服務
7. 驗證功能

## 📁 專案文檔結構

```
podcast-random-player/
├── README.md           # 專案概述、快速開始
├── PROJECT_PLAN.md     # 詳細規劃（37KB 完整文檔）
├── ARCHITECTURE.md     # 系統架構、資料流程、演算法
├── CHECKLIST.md        # 開發檢查清單
├── SUMMARY.md          # 本文檔（快速總覽）
└── API.md              # API 文檔（待建立）
```

## 📊 關鍵指標（KPI）

### 技術指標
- API 回應時間：< 200ms (P95)
- 首頁載入時間：< 2s
- 音訊開始播放：< 2s
- 錯誤率：< 0.1%

### 業務指標（未來）
- 每日活躍用戶 (DAU)
- 平均播放時長
- 收藏/追蹤轉化率
- 用戶留存率

## 💰 成本估算

### 初期（MVP）
- **Zeabur 託管**：$5-10/月
- **PostgreSQL**：包含在 Zeabur 方案中
- **域名**：$10-15/年（可選）
- **SSL 憑證**：免費（Let's Encrypt）

**總計**：約 $5-10/月

### 擴展後
- **進階託管**：$20-50/月
- **Redis 快取**：$5-10/月
- **監控服務**：$10-20/月
- **CDN**：$10-30/月

**總計**：約 $45-110/月

## 🎯 成功標準

### MVP 階段
- [ ] 用戶可以點擊按鈕開始隨機播放
- [ ] 音訊可以正常播放、暫停、跳轉
- [ ] 用戶可以收藏和追蹤內容
- [ ] 應用已部署到 Zeabur 並可公開訪問
- [ ] 測試覆蓋率達到 80%

### 產品化階段
- [ ] 至少有 50 個以上的 Podcast 資料
- [ ] 有 10 個真實用戶進行測試並給予反饋
- [ ] 首頁載入時間 < 2 秒
- [ ] 無重大 bug
- [ ] 基本的錯誤監控和日誌系統

## 🔮 未來擴展方向

### Phase 2（1-3 個月後）
- 用戶系統（註冊、登入）
- 個人化推薦
- 社交功能（分享、評論）
- 行動 App（React Native）

### Phase 3（3-6 個月後）
- AI 內容摘要
- 智能推薦引擎
- 播放清單功能
- 離線下載

### Phase 4（6+ 個月後）
- 創作者平台
- 付費訂閱
- 廣告系統
- 多語言支援

## 🛡️ 風險評估

| 風險 | 嚴重性 | 機率 | 應對策略 |
|------|--------|------|---------|
| Podcast 資料來源不穩定 | 高 | 中 | 使用多個資料來源、實作快取 |
| 音訊載入速度慢 | 中 | 中 | CDN、預載、壓縮 |
| 版權問題 | 高 | 低 | 只連結不存儲、遵循 RSS 規範 |
| 伺服器成本過高 | 中 | 低 | 優化查詢、實作快取、擴展計畫 |
| 用戶增長緩慢 | 中 | 中 | 市場推廣、產品優化、用戶反饋 |

## 📞 資源清單

### 文檔
- [完整專案規劃](./PROJECT_PLAN.md) - 37KB 詳細文檔
- [系統架構](./ARCHITECTURE.md) - 架構圖與演算法
- [開發檢查清單](./CHECKLIST.md) - 逐步檢查項目

### 外部資源
- [Podcast Index API](https://podcastindex.org/)
- [Prisma 文檔](https://www.prisma.io/docs)
- [React 文檔](https://react.dev/)
- [Zeabur 文檔](https://zeabur.com/docs)

### 社群
- GitHub Issues（問題回報）
- GitHub Discussions（討論區）
- Discord（即時溝通，待建立）

## 🎬 立即開始

### 3 分鐘快速開始

```bash
# 1. 克隆專案
git clone <repository-url>
cd podcast-random-player

# 2. 安裝後端
cd backend
npm install
cp .env.example .env
# 編輯 .env 設置 DATABASE_URL

# 3. 初始化資料庫
npx prisma migrate dev
npm run dev &

# 4. 安裝前端
cd ../frontend
npm install
npm run dev

# 5. 訪問
open http://localhost:5173
```

### 下一步？

1. **學習階段**：閱讀 [PROJECT_PLAN.md](./PROJECT_PLAN.md) 了解詳細設計
2. **開發階段**：使用 [CHECKLIST.md](./CHECKLIST.md) 追蹤進度
3. **部署階段**：參考 [PROJECT_PLAN.md 第四章](./PROJECT_PLAN.md#四部署到-zeabur)

## 🙋 常見問題

**Q: 需要申請 Podcast API 金鑰嗎？**  
A: 是的，建議註冊 [Podcast Index](https://podcastindex.org/) 獲取免費 API 金鑰。

**Q: 可以在本地開發嗎？**  
A: 當然！使用 SQLite 作為開發資料庫即可，不需要安裝 PostgreSQL。

**Q: 需要多久可以完成 MVP？**  
A: 全職開發約 2-3 週，兼職開發約 4-6 週。

**Q: 部署成本是多少？**  
A: Zeabur 基礎方案約 $5-10/月，已足夠 MVP 使用。

**Q: 需要什麼技能？**  
A: TypeScript、React、Node.js 基礎，願意學習新技術的態度。

## 📝 版本歷史

- **v0.1.0** (2024-02-10)：初始規劃文檔
  - 完成專案結構設計
  - 完成技術棧選擇
  - 完成測試策略
  - 完成部署規劃

---

**專案狀態**：📝 規劃階段  
**預計 MVP 完成**：3 週後  
**目標發布日期**：待定

**準備好了嗎？讓我們開始打造這個有趣的專案吧！** 🚀
