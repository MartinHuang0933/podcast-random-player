# Zeabur 部署配置

## 自动部署说明

本项目已配置 `zeabur.yaml`，可以自动部署。

## 服务结构

此项目包含 3 个服务：

1. **PostgreSQL** - 数据库
2. **Backend** - API 服务（位于 `/backend` 目录）
3. **Frontend** - Web 界面（位于 `/frontend` 目录）

## 部署步骤

### 方法 1：使用 zeabur.yaml（推荐）

1. 在 Zeabur 创建新项目
2. 连接此 GitHub repository
3. Zeabur 会自动读取 `zeabur.yaml` 并创建所有服务

### 方法 2：手动创建服务

#### PostgreSQL
- Type: Prebuilt
- Template: PostgreSQL

#### Backend
- Type: Git
- Repository: 此 repo
- Root Directory: `backend`
- Build Command: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
- Start Command: `npm start`
- Port: 3000
- Environment Variables:
  ```
  DATABASE_URL=<从 PostgreSQL 服务获取>
  NODE_ENV=production
  PORT=3000
  FRONTEND_URL=<前端服务 URL>
  ```

#### Frontend
- Type: Git
- Repository: 此 repo
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Start Command: `npm run preview -- --port 4173`
- Port: 4173
- Environment Variables:
  ```
  VITE_API_URL=<后端服务 URL>/api
  ```

## 部署后

在 Backend 服务的 Console 执行：
```bash
npm run seed
```

这会填充测试数据。
