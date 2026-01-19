
import React, { useRef, useEffect, useState } from 'react';
import { LyricLine } from '../types';

interface LyricsPanelProps {
  lyrics: LyricLine[];
  currentTime: number;
  onSeek?: (time: number) => void;
}

const LyricsPanel: React.FC<LyricsPanelProps> = ({ lyrics, currentTime, onSeek }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLyricRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeIndex = lyrics.findIndex((l, i) => {
    const nextTime = lyrics[i + 1]?.time ?? Infinity;
    return currentTime >= l.time && currentTime < nextTime;
  });

  useEffect(() => {
    if (!isUserScrolling && activeLyricRef.current && containerRef.current) {
      const containerHeight = containerRef.current.offsetHeight;
      const itemTop = activeLyricRef.current.offsetTop;
      const itemHeight = activeLyricRef.current.offsetHeight;
      
      containerRef.current.scrollTo({
        top: itemTop - containerHeight / 2 + itemHeight / 2,
        behavior: 'smooth'
      });
    }
  }, [activeIndex, isUserScrolling]);

  const handleScroll = () => {
    setIsUserScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 3000); 
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-0 overflow-hidden">
      {/* Header Info - Fixed at top of lyrics panel */}
      <div className="mb-8 flex-shrink-0">
        <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 truncate">我爱我</h1>
            <span className="flex-shrink-0 px-2 py-0.5 bg-red-50 text-red-500 text-xs font-medium border border-red-200 rounded">本地</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-500">
            <p>专辑：<span className="text-blue-600 hover:underline cursor-pointer">我爱我</span></p>
            <p>歌手：<span className="text-blue-600 hover:underline cursor-pointer">李奕遐</span></p>
            <p>来源：<span className="text-blue-600 hover:underline cursor-pointer">我喜欢的音乐</span></p>
        </div>
      </div>

      {/* Lyrics Container - Independent scrollable area */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar mask-fade-edges relative px-2"
      >
        <div className="py-[30vh] space-y-8">
            {lyrics.map((lyric, index) => (
                <div 
                    key={index}
                    ref={index === activeIndex ? activeLyricRef : null}
                    onClick={() => onSeek?.(lyric.time)}
                    className={`transition-all duration-700 cursor-pointer truncate whitespace-nowrap ${
                        index === activeIndex 
                        ? 'text-gray-900 text-2xl font-bold scale-105 origin-left' 
                        : 'text-gray-400 text-lg font-medium hover:text-gray-600'
                    }`}
                >
                    {lyric.text}
                </div>
            ))}
        </div>
      </div>
      
      {/* Side tools */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col space-y-4 z-10">
        <button className="p-2 bg-gray-100/50 rounded-full hover:bg-gray-200 transition-colors shadow-sm">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
        </button>
        <button className="p-2 bg-gray-100/50 rounded-full hover:bg-gray-200 transition-colors shadow-sm">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        </button>
      </div>

      <div className="absolute right-0 bottom-4 z-10">
        <button className="p-3 bg-gray-100/50 rounded-full hover:bg-gray-200 transition-colors shadow-sm">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </button>
      </div>
    </div>
  );
};

export default LyricsPanel;
