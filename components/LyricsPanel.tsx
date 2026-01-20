
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
    <div className="h-full flex flex-col p-4 md:p-0 overflow-hidden">
      {/* Header Info - 动态化并支持标题滚动 */}
      <div className="mb-8 flex-shrink-0 max-w-full">
        <div className="mb-2 marquee-wrapper">
            <div className="marquee-content">
                <h1 className="text-3xl font-bold text-gray-900 inline-block pr-12" title={title}>{title}</h1>
                <h1 className="text-3xl font-bold text-gray-900 inline-block pr-12" title={title}>{title}</h1>
            </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-500">
            <p>专辑：<span className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer transition-colors">{album}</span></p>
            <p>歌手：<span className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer transition-colors">{artist}</span></p>
            <p className="text-gray-400">来源：<span>{source}</span></p>
        </div>
      </div>

      {/* Lyrics Container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar mask-fade-edges relative px-2"
      >
        <div className="py-[30vh] space-y-8">
            {lyrics.length > 0 ? (
              lyrics.map((lyric, index) => (
                <div 
                    key={index}
                    ref={index === activeIndex ? activeLyricRef : null}
                    onClick={() => onSeek?.(lyric.time)}
                    className={`transition-all duration-700 cursor-pointer truncate whitespace-nowrap py-1 ${
                        index === activeIndex 
                        ? 'text-gray-900 text-2xl font-bold scale-105 origin-left' 
                        : 'text-gray-400 text-lg font-medium hover:text-gray-600'
                    }`}
                >
                    {lyric.text}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-20">暂无歌词</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LyricsPanel;