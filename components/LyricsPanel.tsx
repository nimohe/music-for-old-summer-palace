
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
      
      // 移动端由于高度固定为 3 行，我们将当前行始终置中
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
    <div className="h-full flex flex-col p-2 md:p-0 overflow-hidden">
      {/* Header Info - 移动端精简字号 */}
      <div className="mb-3 md:mb-8 flex-shrink-0">
        <div className="marquee-wrapper mb-1 md:mb-2">
            <div className="marquee-content">
                <h1 className="text-lg md:text-3xl font-bold text-gray-900 inline-block pr-12 truncate md:max-w-xl" title={title}>{title}</h1>
                <h1 className="text-lg md:text-3xl font-bold text-gray-900 inline-block pr-12 md:hidden" title={title}>{title}</h1>
            </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 md:gap-x-6 gap-y-0.5 text-[10px] md:text-sm text-gray-500">
            <p>专辑：<span className="text-blue-500">{album}</span></p>
            <p>歌手：<span className="text-blue-500">{artist}</span></p>
            <p className="hidden md:block text-gray-400">来源：<span>{source}</span></p>
        </div>
      </div>

      {/* Lyrics Container - 移动端固定高度以显示约 3 行 */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 md:flex-initial h-24 md:h-auto overflow-y-auto overflow-x-hidden custom-scrollbar mask-fade-edges relative px-1"
      >
        {/* PC 端 py-[25vh]，移动端 py-10 确保初始和结束位置平衡 */}
        <div className="py-8 md:py-[25vh] space-y-3 md:space-y-8">
            {lyrics.length > 0 ? (
              lyrics.map((lyric, index) => (
                <div 
                    key={index}
                    ref={index === activeIndex ? activeLyricRef : null}
                    onClick={() => onSeek?.(lyric.time)}
                    className={`transition-all duration-700 cursor-pointer whitespace-normal py-0.5 text-center md:text-left ${
                        index === activeIndex 
                        ? 'text-gray-900 text-base md:text-2xl font-bold scale-105 origin-center md:origin-left' 
                        : 'text-gray-400 text-sm md:text-lg font-medium hover:text-gray-600'
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
