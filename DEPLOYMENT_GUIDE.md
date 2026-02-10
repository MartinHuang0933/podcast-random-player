# 🚀 Zeabur 部署完整指南

## 目錄
1. [準備工作](#準備工作)
2. [本地測試](#本地測試)
3. [部署到 Zeabur](#部署到-zeabur)
4. [配置資料庫](#配置資料庫)
5. [設置環境變數](#設置環境變數)
6. [驗證部署](#驗證部署)
7. [常見問題](#常見問題)

---

## 準備工作

### 1. 確認本地環境

確保已安裝：
- Node.js 18+ (`node --version`)
- npm 或 pnpm
- Git

### 2. 創建 GitHub Repository

```bash
cd /home/node/.openclaw/workspace/podcast-random-player

# 初始化 Git
git init
git add .
git commit -m "Initial commit: Podcast Random Player"

# 創建 GitHub repo 並推送
# 在 GitHub 創建新 repository，然後：
git remote add origin https://github.com/YOUR_USERNAME/podcast-random-player.git
git branch -M main
git push -u origin main
```

---

## 本地測試

### 步驟 1：後端設置

```bash
cd backend

# 1. 安裝依賴
npm install

# 2. 設置環境變數
cp .env.example .env

# 3. 編輯 .env 文件
# DATABASE_URL="postgresql://user:password@localhost:5432/podcast_player"
# PORT=3000
# FRONTEND_URL="http://localhost:5173"

# 4. 生成 Prisma Client
npx prisma generate

# 5. 執行 Migration（創建資料庫表）
npx prisma migrate dev --name init

# 6. 填充測試資料
npm run seed

# 7. 啟動後端
npm run dev
```

後端應該運行在 `http://localhost:3000`

### 步驟 2：前端設置

**開啟新終端：**

```bash
cd frontend

# 1. 安裝依賴
npm install

# 2. 啟動前端
npm run dev
```

前端應該運行在 `http://localhost:5173`

### 步驟 3：測試功能

1. 訪問 `http://localhost:5173`
2. 點擊「🎲 隨機播放」按鈕
3. 應該會看到一個隨機的 Podcast episode 並開始播放
4. 測試收藏和追蹤功能

---

## 部署到 Zeabur

### 方法一：透過 Zeabur Dashboard（推薦）

#### 1. 註冊/登入 Zeabur

訪問 [https://zeabur.com](https://zeabur.com) 並登入

#### 2. 創建新專案

1. 點擊「Create Project」
2. 輸入專案名稱（例如：`podcast-player`）
3. 點擊「Create」

#### 3. 部署 PostgreSQL 資料庫

1. 在專案頁面，點擊「Add Service」
2. 選擇「Prebuilt」→「PostgreSQL」
3. 選擇版本（推薦 15）
4. 點擊「Deploy」
5. 等待部署完成（約 1-2 分鐘）
6. 點擊 PostgreSQL 服務，進入「Variables」頁籤
7. 複製 `DATABASE_URL` 的值（稍後會用到）

#### 4. 部署後端服務

1. 返回專案頁面，點擊「Add Service」
2. 選擇「Git」→ 連接你的 GitHub repository
3. 選擇 `podcast-random-player` repository
4. Zeabur 會自動偵測到這是個 Node.js 專案
5. 在「Settings」中配置：
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
   - **Start Command**: `npm start`
   - **Port**: `3000`

6. 進入「Variables」頁籤，添加環境變數：

```
DATABASE_URL=<從 PostgreSQL 服務複製的值>
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend-url.zeabur.app
```

> **注意**：FRONTEND_URL 需要等前端部署後再填入

7. 點擊「Deploy」

#### 5. 執行資料庫初始化（重要！）

部署完成後，需要執行 seed 來填充測試資料：

1. 在 Zeabur 的後端服務頁面，點擊「Console」
2. 執行以下命令：

```bash
npm run seed
```

#### 6. 部署前端服務

1. 返回專案頁面，點擊「Add Service」
2. 選擇「Git」→ 選擇同一個 repository
3. 在「Settings」中配置：
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview`
   - **Port**: `5173`

4. 進入「Variables」頁籤，添加環境變數：

```
VITE_API_URL=https://your-backend-url.zeabur.app/api
```

> **注意**：需要填入後端服務的 URL

5. 點擊「Deploy」

#### 7. 設置自訂域名（可選）

1. 在前端服務頁面，點擊「Domains」
2. 點擊「Generate Domain」獲取免費的 `.zeabur.app` 域名
3. 或者綁定自己的域名

對後端服務重複此步驟。

#### 8. 更新環境變數

現在你有了前後端的 URL，更新環境變數：

**後端服務**（Variables）：
```
FRONTEND_URL=https://your-frontend-domain.zeabur.app
```

**前端服務**（Variables）：
```
VITE_API_URL=https://your-backend-domain.zeabur.app/api
```

#### 9. 重新部署

在 Zeabur 中，修改環境變數後會自動觸發重新部署。等待部署完成。

---

### 方法二：使用 Zeabur CLI（進階）

```bash
# 1. 安裝 Zeabur CLI
npm install -g @zeabur/cli

# 2. 登入
zeabur login

# 3. 初始化專案
zeabur init

# 4. 部署
zeabur deploy
```

---

## 配置資料庫

### 自動執行 Migration

在 Zeabur 中，資料庫 migration 會在構建時自動執行（已包含在 Build Command 中）：

```bash
npx prisma migrate deploy
```

### 手動執行 Migration（如果需要）

1. 在 Zeabur 後端服務頁面，點擊「Console」
2. 執行：

```bash
npx prisma migrate deploy
```

### 查看資料庫內容

1. 在 Zeabur 後端服務頁面，點擊「Console」
2. 執行：

```bash
npx prisma studio
```

3. Zeabur 會提供一個臨時的 URL 來訪問 Prisma Studio

---

## 設置環境變數

### 後端環境變數完整清單

| 變數名稱 | 說明 | 範例 |
|---------|------|------|
| `DATABASE_URL` | PostgreSQL 連接字串 | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV` | 環境模式 | `production` |
| `PORT` | 服務端口 | `3000` |
| `FRONTEND_URL` | 前端 URL（CORS） | `https://your-app.zeabur.app` |

### 前端環境變數完整清單

| 變數名稱 | 說明 | 範例 |
|---------|------|------|
| `VITE_API_URL` | 後端 API URL | `https://api.your-app.zeabur.app/api` |

---

## 驗證部署

### 1. 檢查後端健康狀態

訪問：`https://your-backend-url.zeabur.app/api/health`

應該看到：
```json
{
  "status": "healthy",
  "timestamp": "2024-02-10T10:00:00Z",
  "services": {
    "database": "connected"
  }
}
```

### 2. 測試隨機播放 API

```bash
curl https://your-backend-url.zeabur.app/api/random
```

應該返回 Podcast 資料。

### 3. 測試前端

1. 訪問前端 URL：`https://your-frontend-url.zeabur.app`
2. 點擊「🎲 隨機播放」
3. 應該能正常播放音訊

### 4. 檢查日誌

在 Zeabur 服務頁面：
1. 點擊「Logs」查看實時日誌
2. 檢查是否有錯誤訊息

---

## 常見問題

### ❌ 問題 1：前端無法連接後端（CORS 錯誤）

**症狀**：瀏覽器控制台顯示 CORS 錯誤

**解決方案**：
1. 確認後端環境變數 `FRONTEND_URL` 設置正確
2. 檢查是否包含協議（`https://`）
3. 重新部署後端服務

### ❌ 問題 2：資料庫連接失敗

**症狀**：後端日誌顯示 `P1001: Can't reach database server`

**解決方案**：
1. 確認 `DATABASE_URL` 環境變數正確
2. 確認 PostgreSQL 服務正在運行
3. 在 Zeabur 中，確認後端和資料庫在同一個專案中

### ❌ 問題 3：沒有測試資料

**症狀**：隨機播放返回「沒有可用的 episode」

**解決方案**：
1. 在後端服務的 Console 中執行：
```bash
npm run seed
```

### ❌ 問題 4：音訊無法播放

**症狀**：點擊播放按鈕後沒有聲音

**解決方案**：
1. 確認瀏覽器允許自動播放音訊
2. 確認音訊 URL 可訪問
3. 檢查瀏覽器控制台是否有錯誤

### ❌ 問題 5：部署後修改不生效

**症狀**：推送代碼後 Zeabur 沒有更新

**解決方案**：
1. 確認 GitHub webhook 已連接
2. 在 Zeabur 服務頁面手動點擊「Redeploy」
3. 檢查「Deployments」頁籤查看部署狀態

### ❌ 問題 6：Build 失敗

**症狀**：部署時顯示 build error

**解決方案**：
1. 檢查 `package.json` 中的 scripts 是否正確
2. 確認 `Root Directory` 設置正確
3. 查看 build logs 找出具體錯誤
4. 本地執行 `npm run build` 測試

---

## 進階配置

### 自訂域名

1. 在 Zeabur 服務頁面，點擊「Domains」
2. 點擊「Add Domain」
3. 輸入你的域名（例如：`podcast.example.com`）
4. 在你的 DNS 提供商添加 CNAME 記錄：
   ```
   CNAME podcast YOUR-APP.zeabur.app
   ```
5. 等待 DNS 傳播（可能需要幾分鐘到幾小時）

### 啟用 HTTPS（自動）

Zeabur 會自動為所有域名配置 Let's Encrypt SSL 憑證。

### 設置 CDN（可選）

如果需要加速靜態資源：
1. 使用 Cloudflare 或其他 CDN
2. 將前端部署到 CDN
3. 更新後端的 CORS 設置

### 自動部署

Zeabur 預設連接 GitHub 後會自動部署。如果需要手動控制：
1. 在 repository 的 Settings → Webhooks 中管理
2. 或在 Zeabur 專案設置中選擇手動部署

---

## 監控與維護

### 查看使用量

在 Zeabur Dashboard：
1. 選擇專案
2. 查看「Usage」頁籤
3. 監控 CPU、記憶體、流量使用

### 查看日誌

實時查看應用日誌：
1. 進入服務頁面
2. 點擊「Logs」
3. 可以按時間篩選和搜尋

### 備份資料庫

1. 在 PostgreSQL 服務頁面，點擊「Backups」
2. 點擊「Create Backup」手動備份
3. 或設置自動備份計畫

---

## 成本估算

### Zeabur 免費方案
- ✅ 3 個服務（前端 + 後端 + 資料庫）
- ✅ 100GB 流量/月
- ✅ 基本運算資源

### 付費方案（如需擴展）
- **Developer**: $5/月
  - 更多流量和資源
- **Team**: $20/月
  - 多人協作
  - 進階功能

---

## 下一步

部署成功後，你可以：

1. ✅ 添加更多 Podcast 資料（修改 seed.ts）
2. ✅ 實作用戶系統
3. ✅ 添加推薦演算法
4. ✅ 優化 UI/UX
5. ✅ 添加更多功能（播放清單、分享等）

---

## 技術支援

- **Zeabur 文檔**: https://zeabur.com/docs
- **Discord 社群**: https://discord.gg/zeabur
- **GitHub Issues**: https://github.com/YOUR_USERNAME/podcast-random-player/issues

---

## 檢查清單

部署前確認：

- [ ] 代碼已推送到 GitHub
- [ ] 本地測試通過
- [ ] 環境變數已準備好
- [ ] PostgreSQL 服務已創建

部署後確認：

- [ ] 後端 health check 正常
- [ ] 資料庫已填充測試資料
- [ ] 前端可以訪問
- [ ] 隨機播放功能正常
- [ ] CORS 設置正確
- [ ] 自訂域名已設置（如果需要）

---

**🎉 恭喜！你的 Podcast 隨機播放器已成功部署到 Zeabur！**

如有問題，請查看「常見問題」章節或聯絡技術支援。
