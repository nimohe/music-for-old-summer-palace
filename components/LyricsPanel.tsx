
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
  // Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout to fix the missing namespace error in browser environments.
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
    }, 3000); // Resume auto-scroll after 3s of inactivity
  };

  return (
    <div className="h-full flex flex-col px-4 md:px-8">
      {/* Header Info */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">我爱我</h1>
            <span className="px-2 py-0.5 bg-red-50 text-red-500 text-xs font-medium border border-red-200 rounded">本地</span>
        </div>
        <div className="flex items-center space-x-6 text-sm text-gray-500">
            <p>专辑：<span className="text-blue-600 hover:underline cursor-pointer">我爱我</span></p>
            <p>歌手：<span className="text-blue-600 hover:underline cursor-pointer">李奕遐</span></p>
            <p>来源：<span className="text-blue-600 hover:underline cursor-pointer">我喜欢的音乐</span></p>
        </div>
      </div>

      {/* Lyrics Container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto hide-scrollbar space-y-6 mask-fade-edges relative"
      >
        <div className="py-[40%] space-y-8">
            {lyrics.map((lyric, index) => (
                <div 
                    key={index}
                    ref={index === activeIndex ? activeLyricRef : null}
                    onClick={() => onSeek?.(lyric.time)}
                    className={`transition-all duration-500 cursor-pointer ${
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
      
      {/* Side tools visible in the image */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col space-y-4">
        <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
        </button>
        <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        </button>
      </div>
      <div className="absolute right-8 bottom-8">
        <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </button>
      </div>
    </div>
  );
};

export default LyricsPanel;
