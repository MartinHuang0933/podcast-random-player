import { useState, useEffect, useRef } from 'react';
import { usePlayerStore } from './store/playerStore';
import { getRandomEpisode } from './services/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [podcastData, setPodcastData] = useState<any>(null);
  
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    audioUrl,
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

  // 处理随机播放
  const handleRandomPlay = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getRandomEpisode();
      setPodcastData(data); // 保存完整数据供 Apple Podcast 链接使用
      
      loadAudio({
        audioUrl: data.episode.audioUrl,
        episodeId: data.episode.id,
        episodeTitle: data.episode.title,
        podcastTitle: data.podcast.title,
        coverImage: data.podcast.coverImage,
        startTime: data.startTime,
      });
      
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.currentTime = data.startTime;
          audioRef.current.play();
          setPlaying(true);
        }
      }, 100);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || '载入失败');
    } finally {
      setLoading(false);
    }
  };

  // 在 Apple Podcast 打开
  const handleOpenInApple = () => {
    if (!podcastData) return;
    
    const applePodcastId = podcastData.podcast.applePodcastId;
    const appleEpisodeId = podcastData.episode.appleEpisodeId;
    
    if (applePodcastId && appleEpisodeId) {
      // 使用 Apple Podcast 深链接
      window.open(`https://podcasts.apple.com/podcast/id${applePodcastId}?i=${appleEpisodeId}`, '_blank');
    } else if (applePodcastId) {
      // 只有 podcast ID，打开 podcast 主页
      window.open(`https://podcasts.apple.com/podcast/id${applePodcastId}`, '_blank');
    } else {
      // 搜索 podcast 名称
      const searchQuery = encodeURIComponent(podcastTitle || '');
      window.open(`https://podcasts.apple.com/search?term=${searchQuery}`, '_blank');
    }
  };

  // 音频事件处理
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

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

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 flex flex-col">
      <audio ref={audioRef} src={audioUrl || undefined} />
      
      {/* Header */}
      <header className="p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🎙️</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Podcast Radio</h1>
          </div>
          
          {audioUrl && (
            <button
              onClick={handleOpenInApple}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full transition-all font-medium"
            >
              <span className="text-lg">🎵</span>
              在 Apple Podcast 打开
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          
          {/* Album Art & Info */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            
            {coverImage ? (
              <div className="mb-8">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900">
                  <img
                    src={coverImage}
                    alt={podcastTitle || 'Podcast'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="mb-8 aspect-square rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center shadow-2xl">
                <span className="text-9xl">🎙️</span>
              </div>
            )}

            {/* Episode Info */}
            {episodeTitle ? (
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                  {episodeTitle}
                </h2>
                <p className="text-white/80 text-lg font-medium">{podcastTitle}</p>
              </div>
            ) : (
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-3">
                  Discover Random Podcasts
                </h2>
                <p className="text-white/80 text-lg">
                  点击下方按钮开始随机收听！
                </p>
              </div>
            )}

            {/* Progress Bar */}
            {audioUrl && (
              <div className="mb-6">
                <div className="relative h-2 bg-white/20 rounded-full overflow-hidden mb-2">
                  <div
                    className="absolute left-0 top-0 h-full bg-white rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-sm text-white/70 font-medium">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-6 mb-6">
              {audioUrl && (
                <>
                  <button
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = Math.max(0, currentTime - 15);
                      }
                    }}
                    className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-all"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                    </svg>
                    <span className="text-xs absolute mt-12">-15s</span>
                  </button>
                </>
              )}

              <button
                onClick={audioUrl ? () => setPlaying(!isPlaying) : handleRandomPlay}
                disabled={loading}
                className="w-20 h-20 bg-white hover:scale-105 text-teal-600 rounded-full flex items-center justify-center text-3xl shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  '⏸'
                ) : (
                  '▶️'
                )}
              </button>

              {audioUrl && (
                <button
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = Math.min(duration, currentTime + 30);
                    }
                  }}
                  className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-all"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2 14.5l-6-4.5 6-4.5v9z"/>
                  </svg>
                  <span className="text-xs absolute mt-12">+30s</span>
                </button>
              )}
            </div>

            {/* Next Random Button */}
            {audioUrl && (
              <button
                onClick={handleRandomPlay}
                disabled={loading}
                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-4 rounded-2xl transition-all transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span className="text-xl">🎲</span>
                下一个随机
              </button>
            )}

            {/* Volume Control */}
            {audioUrl && (
              <div className="mt-6 flex items-center gap-4">
                <span className="text-white text-xl">🔊</span>
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${volume * 100}%` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-white/70 text-sm font-medium min-w-[3ch]">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-2xl text-center font-medium shadow-lg">
              ❌ {error}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-white/60 text-sm">
        <p>Discover podcasts like flipping radio stations 📻</p>
      </footer>
    </div>
  );
}

export default App;
