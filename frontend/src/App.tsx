import { useState, useEffect, useRef } from 'react';
import { usePlayerStore } from './store/playerStore';
import { getRandomEpisode } from './services/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applePodcastId, setApplePodcastId] = useState<string | null>(null);
  const [appleEpisodeId, setAppleEpisodeId] = useState<string | null>(null);

  const {
    isPlaying,
    currentTime,
    duration,
    audioUrl,
    episodeTitle,
    podcastTitle,
    coverImage,
    setPlaying,
    setCurrentTime,
    setDuration,
    loadAudio,
  } = usePlayerStore();

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleRandomPlay = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRandomEpisode();
      setApplePodcastId(data.podcast.applePodcastId || null);
      setAppleEpisodeId(data.episode.appleEpisodeId || null);

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
      setError(err.response?.data?.error?.message || '載入失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const appleUrl = applePodcastId
    ? appleEpisodeId
      ? `https://podcasts.apple.com/podcast/id${applePodcastId}?i=${appleEpisodeId}`
      : `https://podcasts.apple.com/podcast/id${applePodcastId}`
    : null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.play() : audioRef.current.pause();
  }, [isPlaying]);

  const fmt = (s: number) => {
    if (!s || !isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    if (audioRef.current) { audioRef.current.currentTime = t; setCurrentTime(t); }
  };

  const skip = (sec: number) => {
    if (!audioRef.current) return;
    const t = Math.max(0, Math.min(audioRef.current.currentTime + sec, duration));
    audioRef.current.currentTime = t;
    setCurrentTime(t);
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <audio ref={audioRef} src={audioUrl || undefined} />

      {/* Top bar */}
      <header className="px-5 pt-4 pb-1">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-stone-800">隨機 Podcast</span>
          </div>
          {appleUrl && (
            <a
              href={appleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              在 Apple Podcasts 開啟
            </a>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-2">
        <div className="max-w-lg w-full">

          {/* Cover art */}
          <div className="mb-4 flex justify-center">
            {coverImage ? (
              <img
                src={coverImage}
                alt={podcastTitle || ''}
                className="w-3/5 max-w-[240px] aspect-square object-cover rounded-2xl shadow-lg"
              />
            ) : (
              <div className="w-3/5 max-w-[240px] aspect-square rounded-2xl bg-gradient-to-br from-brand-200 via-brand-100 to-orange-100 flex items-center justify-center">
                <svg className="w-16 h-16 text-brand-400" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".6" />
                  <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".3" />
                </svg>
              </div>
            )}
          </div>

          {/* Episode info */}
          <div className="mb-3 min-h-[52px] text-center">
            {episodeTitle ? (
              <>
                <h2 className="text-xl font-bold text-stone-900 line-clamp-2 leading-tight">
                  {episodeTitle}
                </h2>
                <p className="text-sm text-stone-500 mt-1 font-medium">{podcastTitle}</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-stone-900">探索隨機 Podcast</h2>
                <p className="text-sm text-stone-500 mt-1">按下播放，發現你的下一個最愛</p>
              </>
            )}
          </div>

          {/* Progress */}
          {audioUrl && (
            <div className="mb-3">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={seek}
                className="range-brand w-full"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-1 font-medium tabular-nums">
                <span>{fmt(currentTime)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mb-4">
            {audioUrl && (
              <button
                onClick={() => skip(-15)}
                className="w-11 h-11 flex items-center justify-center text-stone-500 hover:text-stone-800 rounded-full hover:bg-surface-200 transition-all active:scale-90"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                <span className="absolute text-[8px] font-bold mt-0.5">15</span>
              </button>
            )}

            <button
              onClick={audioUrl ? () => setPlaying(!isPlaying) : handleRandomPlay}
              disabled={loading}
              className="w-16 h-16 bg-brand-500 hover:bg-brand-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
              ) : isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {audioUrl && (
              <button
                onClick={() => skip(30)}
                className="w-11 h-11 flex items-center justify-center text-stone-500 hover:text-stone-800 rounded-full hover:bg-surface-200 transition-all active:scale-90"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                <span className="absolute text-[8px] font-bold mt-0.5">30</span>
              </button>
            )}
          </div>

          {/* Next random */}
          {audioUrl && (
            <button
              onClick={handleRandomPlay}
              disabled={loading}
              className="w-full py-3 rounded-xl border-2 border-brand-500 text-brand-600 font-semibold hover:bg-brand-50 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
              </svg>
              下一個隨機
            </button>
          )}


          {/* Error */}
          {error && (
            <div className="mt-5 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium text-center">
              {error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
