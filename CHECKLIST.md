# 開發檢查清單

## 📋 專案啟動檢查清單

### 環境設置
- [ ] 安裝 Node.js 18+ 
- [ ] 安裝 PostgreSQL 15+
- [ ] 安裝 Git
- [ ] 選擇編輯器（推薦 VS Code）
- [ ] 安裝必要的編輯器擴充套件
  - [ ] ESLint
  - [ ] Prettier
  - [ ] Prisma
  - [ ] TypeScript

### 專案初始化
- [ ] 克隆或創建專案 repository
- [ ] 創建 `.gitignore` 檔案
- [ ] 設置 `.env.example` 範本
- [ ] 複製 `.env.example` 為 `.env` 並填入配置

### 後端設置
- [ ] 在 `backend/` 目錄執行 `npm install`
- [ ] 配置 `DATABASE_URL` 環境變數
- [ ] 執行 `npx prisma generate`
- [ ] 執行 `npx prisma migrate dev`
- [ ] 執行 `npx prisma db seed`（可選）
- [ ] 測試後端啟動：`npm run dev`
- [ ] 驗證 API 可訪問：`http://localhost:3000/api/health`

### 前端設置
- [ ] 在 `frontend/` 目錄執行 `npm install`
- [ ] 配置 `VITE_API_URL` 環境變數
- [ ] 測試前端啟動：`npm run dev`
- [ ] 驗證前端可訪問：`http://localhost:5173`
- [ ] 測試前後端連接

---

## 🏗️ 功能開發檢查清單

### Phase 1: 基礎架構（第 1 週）

#### Day 1-2: 專案設置與資料庫
- [ ] 創建專案目錄結構
- [ ] 設置 TypeScript 配置
- [ ] 設置 ESLint + Prettier
- [ ] 定義 Prisma schema
  - [ ] User 模型
  - [ ] Podcast 模型
  - [ ] Episode 模型
  - [ ] Bookmark 模型
  - [ ] Subscription 模型
- [ ] 創建初始 migration
- [ ] 撰寫 seed script

#### Day 3-4: 核心邏輯
- [ ] 實作 RandomizerService
  - [ ] getRandomEpisode() 方法
  - [ ] 避免重複邏輯
  - [ ] 隨機時間點計算
- [ ] 實作 RSS Parser Service
  - [ ] 解析 RSS feed
  - [ ] 提取 episode 資訊
  - [ ] 處理錯誤
- [ ] 實作 Podcast Service
  - [ ] 從外部 API 抓取資料
  - [ ] 儲存到資料庫
  - [ ] 更新現有資料

#### Day 5-7: 基礎 API
- [ ] 設置 Express 應用
- [ ] 實作 Random API
  - [ ] GET /api/random
  - [ ] GET /api/random/next
- [ ] 實作 Podcast API
  - [ ] GET /api/podcasts
  - [ ] GET /api/podcasts/:id
  - [ ] GET /api/podcasts/:id/episodes
- [ ] 添加錯誤處理中介軟體
- [ ] 添加 CORS 設定
- [ ] 撰寫 API 測試

### Phase 2: 核心功能（第 2 週）

#### Day 1-3: 音訊播放器
- [ ] 創建 AudioPlayer 元件
  - [ ] 播放/暫停按鈕
  - [ ] 進度條
  - [ ] 時間顯示
  - [ ] 音量控制
- [ ] 實作 useAudioPlayer Hook
  - [ ] 播放控制邏輯
  - [ ] 進度追蹤
  - [ ] 錯誤處理
- [ ] 實作 playerStore (Zustand)
  - [ ] 播放狀態
  - [ ] 當前時間
  - [ ] 音量設定
- [ ] 測試音訊播放功能
- [ ] 處理載入狀態
- [ ] 處理播放錯誤

#### Day 4-5: 收藏與追蹤
- [ ] 實作 Bookmark API
  - [ ] POST /api/bookmarks
  - [ ] GET /api/bookmarks
  - [ ] DELETE /api/bookmarks/:id
  - [ ] PUT /api/bookmarks/:id
- [ ] 實作 Subscription API
  - [ ] POST /api/subscriptions
  - [ ] GET /api/subscriptions
  - [ ] DELETE /api/subscriptions/:id
- [ ] 創建收藏 UI
  - [ ] 收藏按鈕
  - [ ] 收藏列表頁面
  - [ ] 取消收藏功能
- [ ] 創建追蹤 UI
  - [ ] 追蹤按鈕
  - [ ] 追蹤列表頁面
  - [ ] 取消追蹤功能

#### Day 6-7: UI/UX 優化
- [ ] 設計並實作主頁面佈局
- [ ] 設計播放器介面
- [ ] 添加載入動畫
- [ ] 添加錯誤提示
- [ ] 添加成功提示（Toast）
- [ ] 優化響應式設計
- [ ] 添加深色模式（可選）
- [ ] 優化音訊載入體驗

### Phase 3: 測試與部署（第 3 週）

#### Day 1-3: 測試
- [ ] 撰寫單元測試
  - [ ] RandomizerService 測試
  - [ ] RSS Parser 測試
  - [ ] 時間格式化工具測試
  - [ ] useAudioPlayer Hook 測試
- [ ] 撰寫整合測試
  - [ ] Random API 測試
  - [ ] Bookmark API 測試
  - [ ] Subscription API 測試
- [ ] 撰寫 E2E 測試
  - [ ] 隨機播放流程
  - [ ] 收藏流程
  - [ ] 追蹤流程
- [ ] 執行測試覆蓋率檢查
- [ ] 修復發現的 bug

#### Day 4-5: 效能優化
- [ ] 添加資料庫索引
- [ ] 實作快取策略（Redis）
- [ ] 優化前端打包
  - [ ] 程式碼分割
  - [ ] 圖片優化
  - [ ] Lazy Loading
- [ ] 優化 API 回應時間
- [ ] 添加 Rate Limiting
- [ ] 添加錯誤監控（Sentry）

#### Day 6-7: 部署
- [ ] 準備 Zeabur 配置
  - [ ] 創建 zeabur.yaml
  - [ ] 設置環境變數
- [ ] 創建 PostgreSQL 資料庫
- [ ] 執行 production migration
- [ ] 部署後端服務
- [ ] 部署前端服務
- [ ] 設置自訂域名（可選）
- [ ] 配置 SSL 憑證
- [ ] 測試 production 環境
- [ ] 設置監控和警報

---

## 🧪 測試檢查清單

### 單元測試
- [ ] RandomizerService
  - [ ] 測試隨機選擇邏輯
  - [ ] 測試避免重複機制
  - [ ] 測試邊界條件（無資料、單一資料）
- [ ] RSS Parser
  - [ ] 測試正常 RSS 解析
  - [ ] 測試錯誤格式處理
  - [ ] 測試空內容處理
- [ ] 工具函數
  - [ ] 時間格式化
  - [ ] 隨機數生成
  - [ ] 驗證邏輯

### 整合測試
- [ ] API 端點測試
  - [ ] 200 成功回應
  - [ ] 400 錯誤請求
  - [ ] 404 資源不存在
  - [ ] 500 伺服器錯誤
- [ ] 資料庫操作
  - [ ] CRUD 操作
  - [ ] 交易處理
  - [ ] 並發控制

### E2E 測試
- [ ] 隨機播放流程
  - [ ] 點擊按鈕
  - [ ] 音訊載入
  - [ ] 開始播放
  - [ ] 顯示資訊
- [ ] 收藏流程
  - [ ] 添加收藏
  - [ ] 查看收藏列表
  - [ ] 取消收藏
- [ ] 追蹤流程
  - [ ] 追蹤節目
  - [ ] 查看追蹤列表
  - [ ] 取消追蹤

### 效能測試
- [ ] 首頁載入時間 < 2s
- [ ] API 回應時間 < 200ms (P95)
- [ ] 音訊開始播放 < 2s
- [ ] 並發測試（100 用戶）

---

## 🚀 部署檢查清單

### 部署前
- [ ] 所有測試通過
- [ ] 程式碼已審查
- [ ] 環境變數已準備
- [ ] 資料庫備份已完成
- [ ] 部署文檔已更新

### Zeabur 設置
- [ ] 創建 Zeabur 專案
- [ ] 連接 GitHub repository
- [ ] 配置構建設定
- [ ] 設置環境變數
  - [ ] DATABASE_URL
  - [ ] API_BASE_URL
  - [ ] FRONTEND_URL
  - [ ] SESSION_SECRET
- [ ] 創建 PostgreSQL 服務
- [ ] 連接資料庫

### 部署後驗證
- [ ] 後端 health check 正常
- [ ] 前端可以訪問
- [ ] API 可以正常呼叫
- [ ] 資料庫連接正常
- [ ] 隨機播放功能正常
- [ ] 收藏功能正常
- [ ] 追蹤功能正常
- [ ] 錯誤處理正常
- [ ] 日誌記錄正常

### 監控設置
- [ ] 設置 Uptime 監控
- [ ] 設置錯誤追蹤（Sentry）
- [ ] 設置效能監控
- [ ] 設置警報通知
- [ ] 設置日誌聚合

---

## 🔒 安全檢查清單

### API 安全
- [ ] 啟用 CORS 限制
- [ ] 實作 Rate Limiting
- [ ] 輸入驗證
- [ ] SQL Injection 防護
- [ ] XSS 防護
- [ ] CSRF 防護（如有用戶系統）

### 資料安全
- [ ] 資料庫連接加密
- [ ] 敏感資料加密
- [ ] 定期備份
- [ ] 存取控制

### 基礎設施安全
- [ ] HTTPS 啟用
- [ ] 環境變數隔離
- [ ] 最小權限原則
- [ ] 依賴套件更新

---

## 📊 程式碼品質檢查清單

### 程式碼風格
- [ ] 通過 ESLint 檢查
- [ ] 通過 Prettier 格式化
- [ ] 遵循 TypeScript 最佳實踐
- [ ] 命名清晰一致

### 文檔
- [ ] README 完整
- [ ] API 文檔完整
- [ ] 重要函數有註解
- [ ] 複雜邏輯有說明

### 效能
- [ ] 無 N+1 查詢
- [ ] 適當的索引
- [ ] 合理的快取策略
- [ ] 無記憶體洩漏

---

## ✅ 發布檢查清單

### 功能完整性
- [ ] 所有核心功能已實作
- [ ] 所有已知 bug 已修復
- [ ] 使用者體驗流暢
- [ ] 錯誤處理完善

### 文檔
- [ ] README.md 完整
- [ ] API.md 完整
- [ ] DEPLOYMENT.md 完整
- [ ] CHANGELOG.md 更新

### 測試
- [ ] 測試覆蓋率 > 80%
- [ ] 所有測試通過
- [ ] E2E 測試通過
- [ ] 效能測試通過

### 部署
- [ ] Production 環境正常運行
- [ ] 監控正常運作
- [ ] 備份機制運作
- [ ] 錯誤追蹤設置完成

### 營運準備
- [ ] 用戶反饋機制
- [ ] 錯誤回報流程
- [ ] 緊急聯絡方式
- [ ] 維護計畫

---

## 📝 日常開發檢查清單

每天開始前：
- [ ] 拉取最新程式碼 `git pull`
- [ ] 檢查並安裝新依賴 `npm install`
- [ ] 執行測試確保一切正常 `npm test`

開發過程中：
- [ ] 遵循程式碼風格指南
- [ ] 撰寫清晰的 commit 訊息
- [ ] 為新功能撰寫測試
- [ ] 更新相關文檔

提交前：
- [ ] 執行所有測試 `npm test`
- [ ] 執行 lint 檢查 `npm run lint`
- [ ] 檢查程式碼覆蓋率
- [ ] 審查自己的變更

---

**提示**: 使用 `[x]` 標記已完成的項目，定期檢視進度！
