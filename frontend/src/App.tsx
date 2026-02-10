import { useState, useEffect, useRef } from 'react';
import { usePlayerStore } from './store/playerStore';
import { getRandomEpisode, createBookmark, createSubscription } from './services/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    audioUrl,
    episodeId,
    episodeTitle,
    podcastTitle,
    coverImage,
    setPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    loadAudio,
  } = usePlayerStore();

  const audioRef = useRef<HTMLAudioElement>(null);

  // 處理隨機播放
  const handleRandomPlay = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getRandomEpisode();
      
      loadAudio({
        audioUrl: data.episode.audioUrl,
        episodeId: data.episode.id,
        episodeTitle: data.episode.title,
        podcastTitle: data.podcast.title,
        coverImage: data.podcast.coverImage,
        startTime: data.startTime,
      });
      
      // 等待音訊元素更新
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.currentTime = data.startTime;
          audioRef.current.play();
          setPlaying(true);
        }
      }, 100);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || '載入失敗');
    } finally {
      setLoading(false);
    }
  };

  // 處理收藏
  const handleBookmark = async () => {
    if (!episodeId) return;
    
    try {
      await createBookmark(episodeId, Math.floor(currentTime));
      showSuccess('已收藏！');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || '收藏失敗');
    }
  };

  // 處理追蹤
  const handleSubscribe = async (podcastId: string) => {
    try {
      await createSubscription(podcastId);
      showSuccess('已追蹤節目！');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || '追蹤失敗');
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // 音訊事件處理
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // 控制播放/暫停
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // 控制音量
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <audio ref={audioRef} src={audioUrl || undefined} />
      
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🎙️ 隨機 Podcast
        </h1>

        {/* 封面圖 */}
        {coverImage && (
          <div className="mb-6">
            <img
              src={coverImage}
              alt={podcastTitle || 'Podcast'}
              className="w-full h-64 object-cover rounded-2xl shadow-lg"
            />
          </div>
        )}

        {/* Podcast 資訊 */}
        {episodeTitle && (
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {episodeTitle}
            </h2>
            <p className="text-gray-600">{podcastTitle}</p>
          </div>
        )}

        {/* 進度條 */}
        {audioUrl && (
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* 播放控制 */}
        {audioUrl && (
          <div className="flex justify-center items-center gap-4 mb-6">
            <button
              onClick={() => setPlaying(!isPlaying)}
              className="w-16 h-16 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center text-2xl transition-colors"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
          </div>
        )}

        {/* 音量控制 */}
        {audioUrl && (
          <div className="mb-6 flex items-center gap-3">
            <span className="text-gray-600">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}

        {/* 動作按鈕 */}
        <div className="space-y-3">
          <button
            onClick={handleRandomPlay}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '載入中...' : audioUrl ? '🔄 下一個隨機' : '🎲 隨機播放'}
          </button>

          {episodeId && (
            <div className="flex gap-3">
              <button
                onClick={handleBookmark}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                ⭐ 收藏
              </button>
              <button
                onClick={() => handleSubscribe('podcast-id')}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                📻 追蹤
              </button>
            </div>
          )}
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* 成功訊息 */}
        {successMessage && (
          <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* 說明文字 */}
        {!audioUrl && (
          <p className="mt-6 text-center text-gray-600 text-sm">
            點擊「隨機播放」開始探索新的 Podcast 內容！
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
