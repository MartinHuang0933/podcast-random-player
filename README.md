# 🎙️ 隨機 Podcast 播放器

> 像隨機收聽廣播一樣發現新的 Podcast 內容

## 專案概述

一個創新的網頁應用，讓用戶可以：
- 🎲 隨機跳轉到任意 Podcast 的任意時間點
- ⭐ 收藏喜歡的內容
- 📻 追蹤感興趣的節目
- 🔄 無限探索新內容

## 技術棧

- **前端**: React 18 + TypeScript + Vite + TailwindCSS
- **後端**: Node.js + Express + TypeScript
- **資料庫**: PostgreSQL + Prisma ORM
- **部署**: Zeabur

## 快速開始

### 前置需求
- Node.js 18+
- PostgreSQL 15+
- npm 或 pnpm

### 安裝步驟

1. **克隆專案**
```bash
git clone <repository-url>
cd podcast-random-player
```

2. **安裝後端依賴**
```bash
cd backend
npm install
```

3. **設置環境變數**
```bash
cp .env.example .env
# 編輯 .env 填入必要資訊
```

4. **執行資料庫 Migration**
```bash
npx prisma migrate dev
npx prisma db seed
```

5. **啟動後端**
```bash
npm run dev
```

6. **安裝前端依賴（新終端）**
```bash
cd ../frontend
npm install
```

7. **啟動前端**
```bash
npm run dev
```

8. **訪問應用**
```
http://localhost:5173
```

## 專案結構

```
podcast-random-player/
├── frontend/          # React 前端
├── backend/           # Node.js API
├── docs/              # 文檔
└── tests/             # 測試
```

## 核心功能

### 1️⃣ 隨機播放
點擊「隨機播放」按鈕，系統會：
- 隨機選擇一個 Podcast
- 隨機選擇其中一集
- 跳到隨機時間點開始播放

### 2️⃣ 收藏功能
- 喜歡正在聽的內容？立即收藏
- 記錄當前播放進度
- 稍後繼續收聽

### 3️⃣ 追蹤節目
- 追蹤整個 Podcast 節目
- 瀏覽所有 episodes
- 持續關注新內容

## 測試

```bash
# 單元測試
npm run test:unit

# 整合測試
npm run test:integration

# E2E 測試
npm run test:e2e

# 所有測試 + 覆蓋率
npm run test:all
```

## 部署到 Zeabur

1. 推送代碼到 GitHub
2. 登入 Zeabur Dashboard
3. 連接 repository
4. 配置環境變數
5. 部署！

詳細步驟見 [PROJECT_PLAN.md](./PROJECT_PLAN.md) 第四章。

## API 文檔

### 主要端點

```
GET  /api/random              # 獲取隨機 episode
GET  /api/random/next         # 下一個隨機
POST /api/bookmarks           # 新增收藏
GET  /api/bookmarks           # 獲取收藏列表
POST /api/subscriptions       # 追蹤節目
GET  /api/subscriptions       # 獲取追蹤列表
```

完整 API 文檔見 [docs/API.md](./docs/API.md)

## 開發指南

### 添加新功能

1. 在 `backend/src/services/` 創建業務邏輯
2. 在 `backend/src/controllers/` 創建控制器
3. 在 `backend/src/routes/` 註冊路由
4. 在 `frontend/src/services/` 創建 API 客戶端
5. 在 `frontend/src/components/` 創建 UI 元件
6. 撰寫測試

### 代碼風格

```bash
# 檢查代碼風格
npm run lint

# 自動修復
npm run lint:fix

# 格式化代碼
npm run format
```

## 貢獻

歡迎貢獻！請先閱讀 [CONTRIBUTING.md](./CONTRIBUTING.md)

## 授權

MIT License

## 聯絡方式

- Issues: [GitHub Issues](https://github.com/yourusername/podcast-random-player/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/podcast-random-player/discussions)

---

## 📚 完整文檔

| 文檔 | 內容 | 適合對象 |
|------|------|---------|
| 📖 [INDEX.md](./INDEX.md) | 文檔索引（快速查找） | 所有人 |
| 📋 [SUMMARY.md](./SUMMARY.md) | 專案摘要總覽 | 專案經理、決策者 |
| 📘 [PROJECT_PLAN.md](./PROJECT_PLAN.md) | 完整規劃（37KB）| 開發團隊 |
| 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md) | 系統架構、演算法 | 架構師、後端 |
| 🔌 [API.md](./API.md) | API 介面文檔 | 前後端開發 |
| ✅ [CHECKLIST.md](./CHECKLIST.md) | 開發檢查清單 | 開發團隊 |

**💡 提示**：不知道從哪開始？查看 [INDEX.md](./INDEX.md) 快速找到你需要的文檔！
