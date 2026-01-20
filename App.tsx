
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
  const audioRef = useRef<HTMLAudioElement>(null);

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

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-white overflow-hidden text-gray-900 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gray-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-50 rounded-full blur-3xl -z-10 opacity-50 -translate-x-1/2 translate-y-1/2"></div>

      {/* Main Content: 移动端胶片在上，歌词在下 */}
      <main className="flex-1 flex flex-col md:flex-row items-stretch w-full overflow-hidden">
        
        {/* Top Section: Vinyl Record - 移动端占据约 2/3 高度 */}
        <div className="h-[60%] md:h-auto md:flex-1 flex flex-col items-center justify-center overflow-hidden p-4 md:p-12">
          <div onClick={togglePlay} className="cursor-pointer active:scale-95 transition-transform duration-300 w-full flex justify-center">
            <VinylRecord 
              isPlaying={isPlaying} 
              coverUrl={MOCK_SONG.coverUrl} 
            />
          </div>
        </div>

        {/* Bottom Section: Lyrics Panel - 移动端占据剩余空间，且内部居中 */}
        <div className="flex-1 md:flex-1 flex flex-col justify-center overflow-hidden w-full max-w-2xl mx-auto md:mx-0 px-6 md:px-0">
          <LyricsPanel 
            lyrics={MOCK_SONG.lyrics} 
            currentTime={currentTime} 
            title={MOCK_SONG.title}
            artist={MOCK_SONG.artist}
            album={MOCK_SONG.album}
            source={MOCK_SONG.source}
            onSeek={handleSeek}
          />
        </div>
      </main>

      {/* Footer Controls: 确保在移动端底部安全区之上且不被遮挡 */}
      <footer className="w-full bg-white/95 backdrop-blur-md border-t border-gray-100 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-12 flex-shrink-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-1 md:gap-4">
          
          <div className="hidden md:flex items-center space-x-4 w-64">
             <img src={MOCK_SONG.coverUrl} alt="Cover" className="w-12 h-12 rounded shadow-sm" />
             <div className="overflow-hidden">
                <p className="font-semibold text-sm truncate">{MOCK_SONG.title}</p>
                <p className="text-gray-500 text-xs truncate">{MOCK_SONG.artist}</p>
             </div>
          </div>

          <div className="flex-1 flex flex-col items-center w-full max-w-2xl mx-auto">
            {/* Playback Buttons */}
            <div className="flex items-center space-x-8 md:space-x-12 mb-1">
                <button className="text-gray-300 hover:text-gray-900 transition-colors">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-gray-900 active:scale-90 transition-transform">
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.445 14.832A1 1 0 0010 14V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                    <path d="M16.445 14.832A1 1 0 0018 14V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                  </svg>
                </button>
                <button 
                  onClick={togglePlay}
                  className="w-10 h-10 md:w-12 md:h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
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
                <button className="text-gray-400 hover:text-gray-900 active:scale-90 transition-transform">
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4z" />
                    <path d="M12.555 5.168A1 1 0 0011 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setShowMobileVolume(!showMobileVolume)}
                  className={`md:hidden p-1.5 rounded-full ${showMobileVolume ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
                >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                   </svg>
                </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full flex items-center space-x-3 md:space-x-4 px-4">
                <span className="text-[10px] text-gray-400 font-medium tabular-nums w-8 text-right">{formatTime(currentTime)}</span>
                <input 
                  type="range" min="0" max={duration || 0} step="0.1" value={currentTime}
                  onChange={handleProgressChange}
                  className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-gray-900"
                />
                <span className="text-[10px] text-gray-400 font-medium tabular-nums w-8">{formatTime(duration)}</span>
            </div>

            {/* Mobile Volume (Overlay style) */}
            {showMobileVolume && (
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-48 bg-white/95 shadow-xl border border-gray-100 rounded-full px-4 py-2 flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <input 
                  type="range" min="0" max="1" step="0.01" value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-gray-600"
                />
              </div>
            )}
          </div>

          {/* Desktop Right Panel */}
          <div className="hidden md:flex items-center justify-end space-x-4 w-64">
            <button className="text-gray-400 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
            <input 
              type="range" min="0" max="1" step="0.01" value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-gray-400"
            />
            <button className="text-gray-400 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
            </button>
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
