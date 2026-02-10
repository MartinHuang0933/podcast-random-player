# 🚀 Zeabur 一键部署指南

## ⚠️ 重要提示

此项目是 **Monorepo** 结构，包含前端和后端两个独立服务。

**你需要创建 3 个独立的服务**：
1. PostgreSQL（数据库）
2. Backend（后端 API）
3. Frontend（前端界面）

---

## 📋 部署步骤

### 1️⃣ 创建 PostgreSQL 数据库

1. 在 Zeabur Dashboard 点击 **"Add Service"**
2. 选择 **"Prebuilt"** → **"PostgreSQL"**
3. 点击 **"Deploy"**
4. 等待部署完成（约 1-2 分钟）
5. 点击 PostgreSQL 服务，进入 **"Variables"** 页签
6. **复制 `DATABASE_URL` 的值**（稍后会用到）

---

### 2️⃣ 部署后端服务

1. 点击 **"Add Service"**
2. 选择 **"Git"**
3. 选择 repository：`MartinHuang0933/podcast-random-player`
4. Zeabur 会自动开始部署

#### 🔧 配置后端服务

部署后，进入服务设置：

**Settings（设置）**：
- **Root Directory**: `backend` ← **必须设置！**
- **Branch**: `main`

**Environment（环境变量）**：
点击 **"Add Variable"** 添加以下变量：

```
DATABASE_URL=<从 PostgreSQL 服务复制的值>
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend-url.zeabur.app
```

> **注意**：`FRONTEND_URL` 需要等前端部署完成后再填入

**Build & Start（可选，通常自动识别）**：
- Build Command: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
- Start Command: `npm start`

**保存并重新部署**

#### ⚡ 初始化数据库

后端部署成功后：
1. 点击后端服务
2. 点击 **"Console"** 标签
3. 执行命令：
   ```bash
   npm run seed
   ```
4. 看到 "🎉 测试资料填充完成！" 表示成功

---

### 3️⃣ 部署前端服务

1. 返回项目页面，点击 **"Add Service"**
2. 选择 **"Git"**
3. 选择同一个 repository：`MartinHuang0933/podcast-random-player`

#### 🔧 配置前端服务

**Settings（设置）**：
- **Root Directory**: `frontend` ← **必须设置！**
- **Branch**: `main`

**Environment（环境变量）**：
```
VITE_API_URL=https://your-backend-url.zeabur.app/api
```

> **重要**：把 `your-backend-url` 替换为后端服务的实际 URL

**Build & Start（可选）**：
- Build Command: `npm install && npm run build`
- Start Command: `npm run preview -- --port 4173`

**保存并重新部署**

---

### 4️⃣ 更新后端 CORS 设置

前端部署完成后：
1. 返回**后端服务**
2. 进入 **"Variables"**
3. 更新 `FRONTEND_URL` 为前端的实际 URL：
   ```
   FRONTEND_URL=https://your-actual-frontend-url.zeabur.app
   ```
4. 点击 **"Redeploy"** 重新部署后端

---

## ✅ 验证部署

### 检查后端

访问：`https://your-backend-url.zeabur.app/api/health`

应该看到：
```json
{
  "status": "healthy",
  "timestamp": "...",
  "services": {
    "database": "connected"
  }
}
```

### 检查前端

访问：`https://your-frontend-url.zeabur.app/`

应该看到漂亮的紫粉色渐变界面，点击 **"🎲 随机播放"** 测试功能。

---

## 🎯 最终服务列表

部署完成后，你应该有 3 个服务：

| 服务 | 类型 | Root Directory | Port |
|------|------|----------------|------|
| PostgreSQL | Prebuilt | - | 5432 |
| Backend | Git | `backend` | 3000 |
| Frontend | Git | `frontend` | 4173 |

---

## ❌ 常见问题

### 问题 1：前端显示 404

**原因**：Root Directory 没有设置为 `frontend`

**解决**：
1. 进入前端服务 Settings
2. 设置 Root Directory 为 `frontend`
3. Redeploy

### 问题 2：后端 API 调用失败（CORS 错误）

**原因**：后端的 `FRONTEND_URL` 环境变量没有设置或设置错误

**解决**：
1. 进入后端服务 Variables
2. 检查 `FRONTEND_URL` 是否正确
3. 确保包含 `https://` 协议
4. Redeploy 后端

### 问题 3：数据库连接失败

**原因**：`DATABASE_URL` 环境变量错误

**解决**：
1. 进入 PostgreSQL 服务
2. 复制正确的 `DATABASE_URL`
3. 更新后端服务的环境变量
4. Redeploy 后端

### 问题 4：随机播放返回"没有可用的 episode"

**原因**：忘记执行 `npm run seed`

**解决**：
1. 进入后端服务 Console
2. 执行 `npm run seed`

---

## 🎊 完成！

现在你可以：
- ✅ 访问前端 URL 使用应用
- ✅ 点击"随机播放"发现新内容
- ✅ 收藏和追踪喜欢的 Podcast
- ✅ 分享给朋友使用

**前端 URL**：`https://your-frontend-url.zeabur.app`

---

## 📞 需要帮助？

查看完整文档：
- [README.md](./README.md)
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- [API.md](./API.md)

或在 GitHub 提 Issue：
https://github.com/MartinHuang0933/podcast-random-player/issues
