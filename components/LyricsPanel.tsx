
import React, { useRef, useEffect, useState } from 'react';
import { LyricLine } from '../types';

interface LyricsPanelProps {
  lyrics: LyricLine[];
  currentTime: number;
  title: string;
  artist: string;
  album: string;
  source: string;
  onSeek?: (time: number) => void;
}

const LyricsPanel: React.FC<LyricsPanelProps> = ({ 
  lyrics, 
  currentTime, 
  title, 
  artist, 
  album, 
  source, 
  onSeek 
}) => {
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
    <div className="h-full flex flex-col items-center md:items-start text-center md:text-left overflow-hidden">
      {/* Header Info */}
      <div className="mb-4 md:mb-8 flex-shrink-0 w-full">
        <div className="marquee-wrapper mb-2">
            <div className="marquee-content">
                <h1 className="text-xl md:text-3xl font-bold text-gray-900 inline-block pr-12 truncate md:max-w-xl" title={title}>{title}</h1>
                <h1 className="text-xl md:text-3xl font-bold text-gray-900 inline-block pr-12 md:hidden" title={title}>{title}</h1>
            </div>
        </div>
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 md:gap-x-6 gap-y-1 text-xs md:text-sm text-gray-500">
            <p>专辑：<span className="text-blue-500">{album}</span></p>
            <p>歌手：<span className="text-blue-500">{artist}</span></p>
            <p className="hidden md:block text-gray-400">来源：<span>{source}</span></p>
        </div>
      </div>

      {/* Lyrics Container - 移动端高度限制为 3 行 (约 100px - 120px) */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full flex-1 md:flex-initial h-28 md:h-auto overflow-y-auto overflow-x-hidden custom-scrollbar mask-fade-edges relative px-2"
      >
        <div className="py-12 md:py-[25vh] space-y-4 md:space-y-8">
            {lyrics.length > 0 ? (
              lyrics.map((lyric, index) => (
                <div 
                    key={index}
                    ref={index === activeIndex ? activeLyricRef : null}
                    onClick={() => onSeek?.(lyric.time)}
                    className={`transition-all duration-700 cursor-pointer whitespace-normal py-1 ${
                        index === activeIndex 
                        ? 'text-gray-900 text-lg md:text-2xl font-bold scale-105' 
                        : 'text-gray-400 text-base md:text-lg font-medium hover:text-gray-600'
                    }`}
                >
                    {lyric.text}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-10">暂无歌词</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LyricsPanel;
