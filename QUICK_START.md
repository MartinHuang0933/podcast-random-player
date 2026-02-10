# ⚡ 快速開始指南

## 5 分鐘本地運行

### 1. 後端

```bash
cd backend
npm install
cp .env.example .env
# 編輯 .env 設置 DATABASE_URL
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

### 2. 前端（新終端）

```bash
cd frontend
npm install
npm run dev
```

### 3. 測試

訪問 `http://localhost:5173` 點擊「隨機播放」

---

## 10 分鐘部署到 Zeabur

### 1. 推送到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/podcast-random-player.git
git push -u origin main
```

### 2. 在 Zeabur 創建服務

1. **PostgreSQL**
   - Add Service → Prebuilt → PostgreSQL
   - 複製 DATABASE_URL

2. **後端**
   - Add Service → Git → 選擇 repository
   - Root Directory: `backend`
   - Build: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
   - Start: `npm start`
   - 環境變數：
     ```
     DATABASE_URL=<從 PostgreSQL 複製>
     NODE_ENV=production
     PORT=3000
     ```
   - 部署後在 Console 執行 `npm run seed`

3. **前端**
   - Add Service → Git → 選擇同一個 repository
   - Root Directory: `frontend`
   - Build: `npm install && npm run build`
   - Start: `npm run preview`
   - 環境變數：
     ```
     VITE_API_URL=https://your-backend-url.zeabur.app/api
     ```

### 3. 更新 CORS

在後端服務的環境變數中添加：
```
FRONTEND_URL=https://your-frontend-url.zeabur.app
```

### 4. 完成！

訪問你的前端 URL 開始使用！

---

## 檢查清單

本地開發：
- [ ] Node.js 18+ 已安裝
- [ ] PostgreSQL 已安裝或使用 Docker
- [ ] 後端運行在 3000 端口
- [ ] 前端運行在 5173 端口
- [ ] 可以成功隨機播放

部署：
- [ ] 代碼已推送到 GitHub
- [ ] PostgreSQL 服務已創建
- [ ] 後端服務已部署
- [ ] 前端服務已部署
- [ ] 環境變數已設置
- [ ] `npm run seed` 已執行
- [ ] Health check 返回 healthy

---

## 常用命令

```bash
# 後端開發
cd backend
npm run dev              # 啟動開發伺服器
npm run build            # 構建生產版本
npm run seed             # 填充測試資料
npx prisma studio        # 打開資料庫管理介面
npx prisma migrate dev   # 創建新 migration

# 前端開發
cd frontend
npm run dev              # 啟動開發伺服器
npm run build            # 構建生產版本
npm run preview          # 預覽生產構建

# Git
git add .
git commit -m "Update"
git push
```

---

## 需要幫助？

- 📖 [完整部署指南](./DEPLOYMENT_GUIDE.md)
- 📋 [專案規劃](./PROJECT_PLAN.md)
- 🏗️ [系統架構](./ARCHITECTURE.md)
- 🔌 [API 文檔](./API.md)
