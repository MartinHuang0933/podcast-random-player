import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

// 中介軟體
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100, // 最多 100 個請求
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: '請求過於頻繁，請稍後再試'
    }
  }
});

app.use('/api', limiter);

// 路由
app.use('/api', routes);

// 404 處理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: '路由不存在'
    }
  });
});

// 錯誤處理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: '伺服器錯誤'
    }
  });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health`);
});

export default app;
