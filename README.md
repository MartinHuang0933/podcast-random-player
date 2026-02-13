# 🎙️ Podcast Radio - 随机 Podcast 播放器

> 像拨动收音机频道一样，随机发现新的 Podcast 内容

## ✨ 特色功能

- 🎲 **随机播放** - 随机选择 Podcast episode 并从随机时间点开始播放
- 🎵 **Apple Podcast 集成** - 一键跳转到 Apple Podcast 应用继续收听
- 🎨 **现代化 UI** - Spotify 风格的界面设计，亮色青蓝配色
- ⚡ **即时体验** - 无需注册，点击即可开始探索

## 🎯 核心理念

传统的 Podcast 应用让你选择困难？试试 **Podcast Radio**！

就像拨动收音机频道一样，每次点击都会带你进入一个全新的音频世界。从随机时间点开始听起，如果喜欢，可以一键跳转到 Apple Podcast 从头收听完整内容。

## 🛠️ 技术栈

**前端：**
- React 18 + TypeScript
- Vite（构建工具）
- TailwindCSS（样式）
- Zustand（状态管理）

**后端：**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Helmet + CORS + Rate Limiting

**部署：**
- Zeabur（推荐）
- 支持任何 Node.js 托管平台

## 🚀 快速开始

### 本地开发

#### 1. 安装依赖

```bash
# 后端
cd backend
npm install

# 前端（新终端）
cd frontend
npm install
```

#### 2. 设置环境变量

```bash
# backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/podcast_radio"
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

#### 3. 初始化数据库

```bash
cd backend
npx prisma generate
npx prisma migrate dev
npm run seed
```

#### 4. 启动服务

```bash
# 后端
cd backend
npm run dev

# 前端（新终端）
cd frontend
npm run dev
```

#### 5. 访问应用

打开浏览器访问：`http://localhost:5173`

## 📦 部署到 Zeabur

详细步骤请查看 [ZEABUR_DEPLOY.md](./ZEABUR_DEPLOY.md)

### 快速部署

1. **创建 PostgreSQL 服务**
2. **创建后端服务**（Root Directory: `backend`）
3. **创建前端服务**（Root Directory: `frontend`）
4. **设置环境变量**
5. **执行数据填充**：在后端 Console 运行 `npm run seed`

## 🎨 UI 设计

界面采用 Spotify 风格的卡片设计，配以亮丽的青蓝渐变色系：

- **主色调**：Teal (青色) → Cyan (蓝绿) → Blue (蓝色)
- **设计语言**：毛玻璃效果 + 圆角卡片 + 柔和阴影
- **响应式**：完美适配手机、平板、桌面

## 📡 API 端点

### 核心 API

```
GET  /api/random        # 获取随机 episode
GET  /api/random/next   # 下一个随机 episode
GET  /api/podcasts      # 获取 podcast 列表
GET  /api/podcasts/:id  # 获取 podcast 详情
GET  /api/health        # 健康检查
```

## 🔗 Apple Podcast 深链接

应用支持直接跳转到 Apple Podcast：

- 如果数据中有 `applePodcastId` 和 `appleEpisodeId`，将直接打开该集
- 如果只有 `applePodcastId`，将打开该 Podcast 主页
- 否则将在 Apple Podcast 中搜索该节目名称

## 📊 数据模型

```
Podcast (节目)
├── id
├── title
├── author
├── coverImage
├── applePodcastId  ← 新增：Apple Podcast 链接
└── episodes[]

Episode (单集)
├── id
├── title
├── audioUrl
├── duration
├── appleEpisodeId  ← 新增：Apple Podcast 链接
└── podcast
```

## 🎯 项目结构

```
podcast-random-player/
├── backend/               # Node.js + Express API
│   ├── src/
│   │   ├── controllers/   # 2 个控制器
│   │   ├── services/      # 2 个服务
│   │   └── routes/        # API 路由
│   ├── prisma/
│   │   ├── schema.prisma  # 数据模型
│   │   └── seed.ts        # 测试数据
│   └── package.json
│
├── frontend/              # React 前端
│   ├── src/
│   │   ├── App.tsx        # 主应用
│   │   ├── services/      # API 客户端
│   │   └── store/         # 状态管理
│   └── package.json
│
└── docs/                  # 文档
    ├── ZEABUR_DEPLOY.md
    └── ...
```

## 🔄 v2.0 更新内容

### ✅ 新增功能

- 🎵 Apple Podcast 集成
- 🎨 全新 UI 设计（Spotify 风格）
- 🌈 亮色青蓝配色方案

### 🗑️ 移除功能

- ❌ 收藏功能（简化用户体验）
- ❌ 追踪功能（专注随机发现）
- ❌ 用户系统（无需注册）

### 🎯 设计理念

**从"管理"到"发现"** - 不再让用户管理收藏和订阅，而是专注于随机发现的乐趣。喜欢的内容可以一键跳转到 Apple Podcast 继续收听和订阅。

## 📄 授权

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

- GitHub: [MartinHuang0933/podcast-random-player](https://github.com/MartinHuang0933/podcast-random-player)
- Issues: [提交问题](https://github.com/MartinHuang0933/podcast-random-player/issues)

---

**🎉 开始你的随机 Podcast 之旅！** 🎧
