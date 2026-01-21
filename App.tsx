
import React, { useState, useRef, useEffect } from 'react';
import VinylRecord from './components/VinylRecord';
import LyricsPanel from './components/LyricsPanel';
import { parseLRC } from './constants';
import { Song, LyricLine } from './types';

type PlayMode = 'sequence' | 'single' | 'random';

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentLyrics, setCurrentLyrics] = useState<LyricLine[]>([]);
  const [showSongList, setShowSongList] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>('sequence');
  const [isLoading, setIsLoading] = useState(true);
  
  const currentSong = songs[currentSongIndex];

  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('player-volume');
    return savedVolume !== null ? parseFloat(savedVolume) : 1.0;
  });

  const [showMobileVolume, setShowMobileVolume] = useState(false);
  const [dominantColor, setDominantColor] = useState('rgb(13, 17, 23)'); 
  const [isDarkTextNeeded, setIsDarkTextNeeded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 1. 加载歌曲列表
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('/list.json');
        if (!response.ok) throw new Error('Failed to load song list');
        const data = await response.json();
        setSongs(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching song list:', error);
        setIsLoading(false);
      }
    };
    fetchSongs();
  }, []);

  // 2. 加载歌词
  useEffect(() => {
    if (!currentSong) return;
    const loadLyrics = async () => {
      try {
        const response = await fetch(currentSong.lrcUrl);
        if (!response.ok) throw new Error('Failed to fetch lyrics');
        const lrcText = await response.text();
        const parsed = parseLRC(lrcText);
        setCurrentLyrics(parsed);
      } catch (error) {
        console.error('Error loading lyrics:', error);
        setCurrentLyrics([]);
      }
    };
    loadLyrics();
  }, [currentSongIndex, currentSong?.lrcUrl]);

  // 3. 音量同步
  useEffect(() => {
    localStorage.setItem('player-volume', volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // 4. 背景色提取
  useEffect(() => {
    if (!currentSong) return;
    const extractColor = () => {
      const img = new Image();
      img.crossOrigin = "anonymous"; 
      img.src = currentSong.coverUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = 1;
        canvas.height = 1;
        ctx.drawImage(img, 0, 0, 1, 1);
        const data = ctx.getImageData(0, 0, 1, 1).data;
        const [r, g, b] = data;
        setDominantColor(`rgb(${r}, ${g}, ${b})`);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        setIsDarkTextNeeded(brightness > 180);
      };
      img.onerror = () => setDominantColor('rgb(13, 17, 23)');
    };
    extractColor();
  }, [currentSong?.coverUrl]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const safePlay = async () => {
    if (audioRef.current && songs.length > 0) {
      try {
        await audioRef.current.play();
      } catch (error: any) {
        if (error.name !== 'AbortError') {
           console.error("Playback failed message:", error.message);
           setIsPlaying(false);
        }
      }
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) safePlay();
      else audioRef.current.pause();
    }
  };

  const nextSong = () => {
    if (songs.length === 0) return;
    let nextIndex;
    if (playMode === 'random') {
      nextIndex = Math.floor(Math.random() * songs.length);
      while (nextIndex === currentSongIndex && songs.length > 1) {
        nextIndex = Math.floor(Math.random() * songs.length);
      }
    } else {
      nextIndex = (currentSongIndex + 1) % songs.length;
    }
    changeSong(nextIndex);
  };

  const prevSong = () => {
    if (songs.length === 0) return;
    let prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    changeSong(prevIndex);
  };

  const changeSong = (index: number) => {
    setCurrentSongIndex(index);
    setCurrentTime(0);
    if (audioRef.current) {
        audioRef.current.load();
    }
    if (!isPlaying) setIsPlaying(true);
  };

  const selectSong = (index: number) => {
    if (index === currentSongIndex) return;
    changeSong(index);
    setShowSongList(false);
  };

  const handleAudioEnded = () => {
    if (playMode === 'single') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        safePlay();
      }
    } else {
      nextSong();
    }
  };

  const renderPlayModeIcon = () => {
    switch (playMode) {
      case 'single':
        return (
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            <text x="12" y="15" fontSize="8" fill="currentColor" textAnchor="middle" fontWeight="bold">1</text>
          </svg>
        );
      case 'random':
        return (
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4l5 5m4 4l5 5M4 20l5-5m4-4l5-5M15 4h5v5m-5 11h5v-5" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
    }
  };

  useEffect(() => {
    if (isPlaying && !isLoading) safePlay();
  }, [currentSongIndex, isLoading]);

  if (isLoading || !currentSong) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-sm font-medium opacity-50">载入乐库中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden transition-all duration-1000 relative" style={{ backgroundColor: dominantColor }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

      <main className="flex-1 flex flex-col md:flex-row items-stretch w-full overflow-hidden z-10">
        <div className="h-[60dvh] md:h-auto md:flex-1 flex flex-col items-center justify-center overflow-hidden pt-8 md:p-12">
          <div onClick={togglePlay} className="cursor-pointer active:scale-95 transition-transform duration-300 w-full flex justify-center">
            <VinylRecord isPlaying={isPlaying} coverUrl={currentSong.coverUrl} />
          </div>
        </div>
        <div className="flex-1 md:flex-1 flex flex-col justify-center overflow-hidden w-full max-w-2xl mx-auto md:mx-0 px-6 md:px-12">
          <LyricsPanel lyrics={currentLyrics} currentTime={currentTime} title={currentSong.title} artist={currentSong.artist} album={currentSong.album} source={currentSong.source} onSeek={(t) => { if(audioRef.current) audioRef.current.currentTime = t; }} isDarkTheme={!isDarkTextNeeded} />
        </div>
      </main>

      {showMobileVolume && (
        <div className="fixed bottom-24 left-4 right-4 md:hidden z-[100] transition-all duration-300 transform scale-100 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-zinc-900/90 backdrop-blur-2xl p-5 rounded-2xl border border-white/20 flex items-center space-x-4 shadow-2xl">
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <input 
              type="range" min="0" max="1" step="0.01" value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white" 
            />
            <span className="text-[10px] text-white/60 font-medium tabular-nums w-8">{Math.round(volume * 100)}%</span>
          </div>
        </div>
      )}

      <footer className="w-full bg-black/30 backdrop-blur-3xl border-t border-white/5 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-12 flex-shrink-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-1 md:gap-4 relative">
          
          <div className={`absolute bottom-full left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 mb-4 w-[90vw] md:w-80 max-h-[60vh] transition-all duration-300 origin-bottom transform z-[60] ${showSongList ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
            <div className="bg-zinc-900/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
                <div className="p-4 border-bottom border-white/5 flex items-center justify-between bg-white/5">
                  <h3 className="text-white font-semibold text-sm">播放列表</h3>
                  <span className="text-white/40 text-xs">{songs.length} 首歌曲</span>
                </div>
                <div className="overflow-y-auto custom-scrollbar flex-1 max-h-[40vh]">
                  {songs.map((song, index) => (
                    <div key={song.id} onClick={() => selectSong(index)} className={`flex items-center space-x-3 p-3 cursor-pointer transition-colors ${index === currentSongIndex ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                      <img src={song.coverUrl} className="w-10 h-10 rounded object-cover" alt="" />
                      <div className="flex-1 overflow-hidden">
                        <p className={`text-sm truncate font-medium ${index === currentSongIndex ? 'text-white' : 'text-white/70'}`}>{song.title}</p>
                        <p className="text-xs text-white/40 truncate">{song.artist}</p>
                      </div>
                      {index === currentSongIndex && <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>}
                    </div>
                  ))}
                </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 w-64">
             <img src={currentSong.coverUrl} alt="Cover" className="w-12 h-12 rounded shadow-2xl border border-white/10" />
             <div className="overflow-hidden">
                <p className="font-semibold text-sm truncate text-white">{currentSong.title}</p>
                <p className="text-white/60 text-xs truncate">{currentSong.artist}</p>
             </div>
          </div>

          <div className="flex-1 flex flex-col items-center w-full max-w-2xl mx-auto">
            <div className="flex items-center space-x-8 md:space-x-12 mb-1">
                <button onClick={() => {
                  const modes: PlayMode[] = ['sequence', 'single', 'random'];
                  setPlayMode(modes[(modes.indexOf(playMode) + 1) % modes.length]);
                }} className={`transition-colors p-1 ${playMode === 'sequence' ? 'text-white/40' : 'text-white'}`}>
                  {renderPlayModeIcon()}
                </button>
                <button onClick={prevSong} className="text-white/80 hover:text-white active:scale-90 transition-transform p-1">
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6V18zM16 6h2v12h-2V6z" transform="rotate(180 12 12)" />
                  </svg>
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="w-10 h-10 md:w-12 md:h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                >
                  {isPlaying ? (
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 md:w-6 md:h-6 transform translate-x-[1.5px]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <button onClick={nextSong} className="text-white/80 hover:text-white active:scale-90 transition-transform p-1">
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6V18zM16 6h2v12h-2V6z" />
                  </svg>
                </button>
                
                <button 
                  onClick={() => { setShowMobileVolume(!showMobileVolume); setShowSongList(false); }} 
                  className={`md:hidden p-1.5 rounded-full transition-all ${showMobileVolume ? 'bg-white text-black' : 'text-white/40'}`}
                >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                   </svg>
                </button>
                
                <button 
                  onClick={() => { setShowSongList(!showSongList); setShowMobileVolume(false); }} 
                  className={`md:hidden p-1.5 rounded-full transition-all ${showSongList ? 'bg-white text-black' : 'text-white/40'}`}
                >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                   </svg>
                </button>
            </div>
            
            <div className="w-full flex items-center space-x-3 md:space-x-4 px-4">
                <span className="text-[10px] text-white/40 font-medium tabular-nums w-8 text-right">{formatTime(currentTime)}</span>
                <input 
                  type="range" min="0" max={duration || 0} step="0.1" value={currentTime} 
                  onChange={(e) => { if(audioRef.current) audioRef.current.currentTime = parseFloat(e.target.value); }} 
                  className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" 
                />
                <span className="text-[10px] text-white/40 font-medium tabular-nums w-8">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-end space-x-4 w-64">
            <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            <input 
              type="range" min="0" max="1" step="0.01" value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))} 
              className="w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" 
            />
            <button 
              onClick={() => setShowSongList(!showSongList)} 
              className={`p-2 rounded-full transition-all ${showSongList ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:bg-white/5'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </footer>

      <audio 
        ref={audioRef}
        key={currentSong.id}
        src={currentSong.audioUrl}
        preload="auto"
        onTimeUpdate={() => { if(audioRef.current) setCurrentTime(audioRef.current.currentTime); }}
        onLoadedMetadata={() => { if(audioRef.current) { setDuration(audioRef.current.duration); audioRef.current.volume = volume; } }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleAudioEnded}
        onError={(e) => {
          const errorCode = e.currentTarget.error?.code;
          const errorMessage = e.currentTarget.error?.message;
          console.error(`Audio error code: ${errorCode}, message: ${errorMessage}`);
          if (isPlaying) setTimeout(() => safePlay(), 1500);
        }}
      />
    </div>
  );
};

export default App;
