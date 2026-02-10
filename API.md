# API 文檔

## 基本資訊

- **基礎 URL**: `https://api.yourapp.com` (production) | `http://localhost:3000` (development)
- **版本**: v1
- **協議**: HTTPS (production) | HTTP (development)
- **內容類型**: `application/json`

## 認證

目前 MVP 階段無需認證。未來版本將支援 JWT 認證。

```http
Authorization: Bearer <token>
```

## 通用回應格式

### 成功回應

```json
{
  "success": true,
  "data": { ... }
}
```

### 錯誤回應

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "錯誤描述",
    "details": { ... }
  }
}
```

### HTTP 狀態碼

| 狀態碼 | 說明 |
|--------|------|
| 200 | 成功 |
| 201 | 創建成功 |
| 204 | 刪除成功（無內容） |
| 400 | 錯誤請求 |
| 404 | 資源不存在 |
| 409 | 衝突（如重複創建） |
| 429 | 請求過於頻繁 |
| 500 | 伺服器錯誤 |

---

## 端點清單

### 隨機播放

#### 獲取隨機 Episode

```http
GET /api/random
```

隨機選擇一個 Podcast episode 並返回隨機起始時間點。

**請求參數**：無

**回應範例**：

```json
{
  "success": true,
  "data": {
    "podcast": {
      "id": "podcast-123",
      "title": "科技島讀",
      "author": "周欽華",
      "coverImage": "https://example.com/cover.jpg"
    },
    "episode": {
      "id": "episode-456",
      "title": "EP. 123 - AI 的未來趨勢",
      "description": "本集討論 AI 技術的最新發展...",
      "audioUrl": "https://example.com/audio.mp3",
      "duration": 3600,
      "pubDate": "2024-02-10T00:00:00Z"
    },
    "startTime": 1234
  }
}
```

**欄位說明**：
- `startTime`: 隨機生成的起始播放時間（秒）
- `duration`: Episode 總長度（秒）
- `pubDate`: 發布日期（ISO 8601 格式）

**錯誤回應**：

```json
{
  "success": false,
  "error": {
    "code": "NO_EPISODES_AVAILABLE",
    "message": "目前沒有可用的 episode"
  }
}
```

---

#### 獲取下一個隨機 Episode

```http
GET /api/random/next
```

獲取下一個隨機 episode，會避免返回最近播放過的內容。

**請求參數**：無

**回應格式**：與 `GET /api/random` 相同

---

### Podcast 管理

#### 獲取 Podcast 列表

```http
GET /api/podcasts
```

獲取所有 Podcast 列表（分頁）。

**查詢參數**：

| 參數 | 類型 | 必填 | 預設值 | 說明 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 頁碼 |
| limit | number | 否 | 20 | 每頁數量 (最大 100) |
| search | string | 否 | - | 搜尋關鍵字 |
| category | string | 否 | - | 分類篩選 |

**請求範例**：

```http
GET /api/podcasts?page=1&limit=20&search=科技
```

**回應範例**：

```json
{
  "success": true,
  "data": {
    "podcasts": [
      {
        "id": "podcast-123",
        "title": "科技島讀",
        "author": "周欽華",
        "description": "深度科技評論...",
        "coverImage": "https://example.com/cover.jpg",
        "episodeCount": 250,
        "latestEpisode": "2024-02-10T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

---

#### 獲取單個 Podcast 詳情

```http
GET /api/podcasts/:id
```

**路徑參數**：
- `id`: Podcast ID

**回應範例**：

```json
{
  "success": true,
  "data": {
    "id": "podcast-123",
    "title": "科技島讀",
    "author": "周欽華",
    "description": "深度科技評論...",
    "coverImage": "https://example.com/cover.jpg",
    "website": "https://daodu.tech",
    "categories": ["Technology", "Business"],
    "language": "zh-TW",
    "episodeCount": 250,
    "subscriberCount": 1523
  }
}
```

---

#### 獲取 Podcast 的所有 Episodes

```http
GET /api/podcasts/:id/episodes
```

**路徑參數**：
- `id`: Podcast ID

**查詢參數**：

| 參數 | 類型 | 必填 | 預設值 | 說明 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 頁碼 |
| limit | number | 否 | 50 | 每頁數量 |
| sort | string | 否 | desc | 排序方式 (asc/desc) |

**回應範例**：

```json
{
  "success": true,
  "data": {
    "episodes": [
      {
        "id": "episode-456",
        "title": "EP. 123 - AI 的未來趨勢",
        "description": "本集討論...",
        "audioUrl": "https://example.com/audio.mp3",
        "duration": 3600,
        "pubDate": "2024-02-10T00:00:00Z",
        "seasonNumber": 1,
        "episodeNumber": 123
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 250,
      "totalPages": 5
    }
  }
}
```

---

### 收藏管理

#### 新增收藏

```http
POST /api/bookmarks
```

將 episode 加入收藏。

**請求 Body**：

```json
{
  "episodeId": "episode-456",
  "currentTime": 150,
  "note": "非常有趣的討論"
}
```

**欄位說明**：
- `episodeId` (必填): Episode ID
- `currentTime` (選填): 當前播放進度（秒），預設 0
- `note` (選填): 備註

**回應範例**：

```json
{
  "success": true,
  "data": {
    "id": "bookmark-789",
    "episodeId": "episode-456",
    "currentTime": 150,
    "note": "非常有趣的討論",
    "createdAt": "2024-02-10T10:00:00Z"
  }
}
```

**錯誤回應**：

```json
{
  "success": false,
  "error": {
    "code": "ALREADY_BOOKMARKED",
    "message": "此 episode 已在收藏中"
  }
}
```

---

#### 獲取收藏列表

```http
GET /api/bookmarks
```

獲取用戶的所有收藏。

**查詢參數**：

| 參數 | 類型 | 必填 | 預設值 | 說明 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 頁碼 |
| limit | number | 否 | 20 | 每頁數量 |
| sort | string | 否 | desc | 排序 (asc/desc) |

**回應範例**：

```json
{
  "success": true,
  "data": {
    "bookmarks": [
      {
        "id": "bookmark-789",
        "currentTime": 150,
        "note": "非常有趣的討論",
        "createdAt": "2024-02-10T10:00:00Z",
        "episode": {
          "id": "episode-456",
          "title": "EP. 123 - AI 的未來趨勢",
          "audioUrl": "https://example.com/audio.mp3",
          "duration": 3600,
          "podcast": {
            "id": "podcast-123",
            "title": "科技島讀",
            "coverImage": "https://example.com/cover.jpg"
          }
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "totalPages": 1
    }
  }
}
```

---

#### 更新收藏

```http
PUT /api/bookmarks/:id
```

更新收藏的播放進度或備註。

**路徑參數**：
- `id`: Bookmark ID

**請求 Body**：

```json
{
  "currentTime": 300,
  "note": "更新後的備註"
}
```

**回應範例**：

```json
{
  "success": true,
  "data": {
    "id": "bookmark-789",
    "episodeId": "episode-456",
    "currentTime": 300,
    "note": "更新後的備註",
    "updatedAt": "2024-02-10T11:00:00Z"
  }
}
```

---

#### 刪除收藏

```http
DELETE /api/bookmarks/:id
```

**路徑參數**：
- `id`: Bookmark ID

**回應**：

```http
HTTP/1.1 204 No Content
```

---

### 追蹤管理

#### 追蹤 Podcast

```http
POST /api/subscriptions
```

追蹤一個 Podcast 節目。

**請求 Body**：

```json
{
  "podcastId": "podcast-123"
}
```

**回應範例**：

```json
{
  "success": true,
  "data": {
    "id": "subscription-999",
    "podcastId": "podcast-123",
    "createdAt": "2024-02-10T10:00:00Z",
    "podcast": {
      "id": "podcast-123",
      "title": "科技島讀",
      "author": "周欽華",
      "coverImage": "https://example.com/cover.jpg",
      "episodeCount": 250
    }
  }
}
```

---

#### 獲取追蹤列表

```http
GET /api/subscriptions
```

獲取用戶追蹤的所有 Podcast。

**查詢參數**：

| 參數 | 類型 | 必填 | 預設值 | 說明 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 頁碼 |
| limit | number | 否 | 20 | 每頁數量 |

**回應範例**：

```json
{
  "success": true,
  "data": {
    "subscriptions": [
      {
        "id": "subscription-999",
        "createdAt": "2024-02-10T10:00:00Z",
        "podcast": {
          "id": "podcast-123",
          "title": "科技島讀",
          "author": "周欽華",
          "coverImage": "https://example.com/cover.jpg",
          "episodeCount": 250,
          "latestEpisode": "2024-02-10T00:00:00Z"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 8,
      "totalPages": 1
    }
  }
}
```

---

#### 取消追蹤

```http
DELETE /api/subscriptions/:id
```

**路徑參數**：
- `id`: Subscription ID

**回應**：

```http
HTTP/1.1 204 No Content
```

---

### 健康檢查

#### 系統健康檢查

```http
GET /api/health
```

檢查 API 服務狀態。

**回應範例**：

```json
{
  "status": "healthy",
  "timestamp": "2024-02-10T10:00:00Z",
  "services": {
    "database": "connected",
    "cache": "connected"
  }
}
```

---

## Rate Limiting

API 實作了速率限制以防止濫用。

**限制**：
- 一般端點：每 15 分鐘 100 個請求
- 隨機播放端點：每分鐘 10 個請求

**回應標頭**：

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1707566400
```

當超過限制時：

```http
HTTP/1.1 429 Too Many Requests
```

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "請求過於頻繁，請稍後再試"
  }
}
```

---

## 錯誤代碼

| 代碼 | HTTP 狀態 | 說明 |
|------|-----------|------|
| `VALIDATION_ERROR` | 400 | 輸入驗證失敗 |
| `NOT_FOUND` | 404 | 資源不存在 |
| `ALREADY_EXISTS` | 409 | 資源已存在 |
| `ALREADY_BOOKMARKED` | 409 | 已經收藏過 |
| `ALREADY_SUBSCRIBED` | 409 | 已經追蹤過 |
| `NO_EPISODES_AVAILABLE` | 404 | 沒有可用的 episode |
| `RATE_LIMIT_EXCEEDED` | 429 | 超過速率限制 |
| `INTERNAL_ERROR` | 500 | 伺服器內部錯誤 |

---

## WebSocket API (未來功能)

```javascript
const ws = new WebSocket('wss://api.yourapp.com/ws');

// 訂閱播放進度同步
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'playback',
  episodeId: 'episode-456'
}));

// 接收播放進度更新
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Current time:', data.currentTime);
};
```

---

## 範例程式碼

### JavaScript/TypeScript

```typescript
// 隨機播放
async function getRandomEpisode() {
  const response = await fetch('http://localhost:3000/api/random');
  const data = await response.json();
  return data.data;
}

// 新增收藏
async function addBookmark(episodeId: string, currentTime: number) {
  const response = await fetch('http://localhost:3000/api/bookmarks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ episodeId, currentTime })
  });
  return await response.json();
}

// 獲取收藏列表
async function getBookmarks(page = 1) {
  const response = await fetch(`http://localhost:3000/api/bookmarks?page=${page}`);
  return await response.json();
}
```

### Python

```python
import requests

# 隨機播放
def get_random_episode():
    response = requests.get('http://localhost:3000/api/random')
    return response.json()['data']

# 新增收藏
def add_bookmark(episode_id, current_time):
    response = requests.post(
        'http://localhost:3000/api/bookmarks',
        json={
            'episodeId': episode_id,
            'currentTime': current_time
        }
    )
    return response.json()
```

### cURL

```bash
# 隨機播放
curl http://localhost:3000/api/random

# 新增收藏
curl -X POST http://localhost:3000/api/bookmarks \
  -H "Content-Type: application/json" \
  -d '{"episodeId":"episode-456","currentTime":150}'

# 獲取收藏列表
curl http://localhost:3000/api/bookmarks?page=1&limit=20
```

---

## 變更日誌

### v1.0.0 (未發布)
- 初始 API 版本
- 隨機播放功能
- 收藏管理
- 追蹤管理

---

## 支援

- **Issues**: [GitHub Issues](https://github.com/yourusername/podcast-random-player/issues)
- **Email**: support@yourapp.com
- **文檔**: [完整文檔](./README.md)

---

最後更新：2024-02-10
