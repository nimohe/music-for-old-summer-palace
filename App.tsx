
import React, { useState, useRef, useEffect } from 'react';
import VinylRecord from './components/VinylRecord';
import LyricsPanel from './components/LyricsPanel';
import { MOCK_SONG } from './constants';

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showMobileVolume, setShowMobileVolume] = useState(false);
  const [dominantColor, setDominantColor] = useState('rgb(24, 24, 27)'); // 默认深色
  const audioRef = useRef<HTMLAudioElement>(null);

  // 提取封面主色调的函数
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // 必须处理跨域
    img.src = MOCK_SONG.coverUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = 1;
      canvas.height = 1;
      // 绘制 1x1 像素来获取平均色
      ctx.drawImage(img, 0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      setDominantColor(`rgb(${r}, ${g}, ${b})`);
    };
  }, []);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const safePlay = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (error: any) {
        if (error.name !== 'AbortError') console.error("Playback failed:", error);
      }
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) safePlay();
      else audioRef.current.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      audioRef.current.volume = volume;
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      safePlay();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  return (
    <div 
      className="h-[100dvh] w-full flex flex-col overflow-hidden transition-colors duration-1000 relative"
      style={{ backgroundColor: dominantColor }}
    >
      {/* 动态渐变遮罩，使背景更具层次感 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none"></div>

      {/* 装饰性背景光晕 - 根据主色自动变化 */}
      <div 
        className="absolute top-0 right-0 w-[80vw] h-[80vw] rounded-full blur-[120px] -z-10 opacity-30 translate-x-1/3 -translate-y-1/3 transition-all duration-1000"
        style={{ backgroundColor: dominantColor, filter: 'brightness(1.5) blur(120px)' }}
      ></div>
      <div 
        className="absolute bottom-0 left-0 w-[60vw] h-[60vw] rounded-full blur-[100px] -z-10 opacity-20 -translate-x-1/4 translate-y-1/4 transition-all duration-1000"
        style={{ backgroundColor: dominantColor, filter: 'saturate(2) blur(100px)' }}
      ></div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row items-stretch w-full overflow-hidden z-10">
        
        {/* Vinyl Section */}
        <div className="h-[66dvh] md:h-auto md:flex-1 flex flex-col items-center justify-center overflow-hidden pt-12 pb-4 md:p-12">
          <div onClick={togglePlay} className="cursor-pointer active:scale-95 transition-transform duration-300 w-full flex justify-center">
            <VinylRecord 
              isPlaying={isPlaying} 
              coverUrl={MOCK_SONG.coverUrl} 
            />
          </div>
        </div>

        {/* Lyrics Panel */}
        <div className="flex-1 md:flex-1 flex flex-col justify-center overflow-hidden w-full max-w-2xl mx-auto md:mx-0 px-6 md:px-0">
          <LyricsPanel 
            lyrics={MOCK_SONG.lyrics} 
            currentTime={currentTime} 
            title={MOCK_SONG.title}
            artist={MOCK_SONG.artist}
            album={MOCK_SONG.album}
            source={MOCK_SONG.source}
            onSeek={handleSeek}
            isDarkTheme={true} // 告知歌词组件使用浅色文字
          />
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="w-full bg-black/20 backdrop-blur-xl border-t border-white/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-12 flex-shrink-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-1 md:gap-4">
          
          <div className="hidden md:flex items-center space-x-4 w-64">
             <img src={MOCK_SONG.coverUrl} alt="Cover" className="w-12 h-12 rounded shadow-lg border border-white/10" />
             <div className="overflow-hidden">
                <p className="font-semibold text-sm truncate text-white">{MOCK_SONG.title}</p>
                <p className="text-gray-300 text-xs truncate">{MOCK_SONG.artist}</p>
             </div>
          </div>

          <div className="flex-1 flex flex-col items-center w-full max-w-2xl mx-auto">
            <div className="flex items-center space-x-8 md:space-x-12 mb-1">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
                <button className="text-gray-300 hover:text-white active:scale-90 transition-transform">
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.445 14.832A1 1 0 0010 14V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                    <path d="M16.445 14.832A1 1 0 0018 14V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                  </svg>
                </button>
                <button 
                  onClick={togglePlay}
                  className="w-10 h-10 md:w-12 md:h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                >
                  {isPlaying ? (
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 md:w-6 md:h-6 ml-0.5 md:ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <button className="text-gray-300 hover:text-white active:scale-90 transition-transform">
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4z" />
                    <path d="M12.555 5.168A1 1 0 0011 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setShowMobileVolume(!showMobileVolume)}
                  className={`md:hidden p-1.5 rounded-full transition-colors ${showMobileVolume ? 'bg-white/20 text-white' : 'text-gray-400'}`}
                >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                   </svg>
                </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full flex items-center space-x-3 md:space-x-4 px-4">
                <span className="text-[10px] text-gray-300 font-medium tabular-nums w-8 text-right">{formatTime(currentTime)}</span>
                <input 
                  type="range" min="0" max={duration || 0} step="0.1" value={currentTime}
                  onChange={handleProgressChange}
                  className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <span className="text-[10px] text-gray-300 font-medium tabular-nums w-8">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Desktop Right Panel */}
          <div className="hidden md:flex items-center justify-end space-x-4 w-64">
            <button className="text-gray-300 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
            <input 
              type="range" min="0" max="1" step="0.01" value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>
      </footer>

      <audio 
        ref={audioRef}
        src={MOCK_SONG.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default App;
