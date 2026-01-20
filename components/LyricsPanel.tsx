
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
  isDarkTheme?: boolean; // 新增属性，用于适配背景
}

const LyricsPanel: React.FC<LyricsPanelProps> = ({ 
  lyrics, 
  currentTime, 
  title, 
  artist, 
  album, 
  source, 
  onSeek,
  isDarkTheme = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLyricRef = useRef<HTMLDivElement>(null);
  const titleWrapperRef = useRef<HTMLDivElement>(null);
  const titleContentRef = useRef<HTMLHeadingElement>(null);
  
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [shouldMarquee, setShouldMarquee] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeIndex = lyrics.findIndex((l, i) => {
    const nextTime = lyrics[i + 1]?.time ?? Infinity;
    return currentTime >= l.time && currentTime < nextTime;
  });

  useEffect(() => {
    const checkOverflow = () => {
      if (titleWrapperRef.current && titleContentRef.current) {
        const isOverflow = titleContentRef.current.offsetWidth > titleWrapperRef.current.offsetWidth;
        setShouldMarquee(isOverflow && window.innerWidth < 768);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [title]);

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

  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkTheme ? 'text-gray-300' : 'text-gray-500';
  const inactiveLyricColor = isDarkTheme ? 'text-white/40' : 'text-gray-400';

  return (
    <div className="h-full flex flex-col items-center md:items-start text-center md:text-left overflow-hidden md:pt-32 lg:pt-40 transition-all duration-500">
      {/* Header Info */}
      <div className="mb-4 md:mb-10 flex-shrink-0 w-full px-4 md:px-0">
        <div 
          ref={titleWrapperRef}
          className={`marquee-wrapper mb-2 ${shouldMarquee ? 'is-overflowing' : ''}`}
        >
            <div className={`marquee-content ${shouldMarquee ? 'marquee-active' : 'w-full text-center md:text-left'}`}>
                <h1 
                  ref={titleContentRef}
                  className={`text-xl md:text-3xl lg:text-4xl font-bold inline-block md:max-w-lg transition-colors ${textColor}`}
                  title={title}
                >
                  {title}
                </h1>
                {shouldMarquee && (
                  <h1 className={`text-xl md:text-3xl lg:text-4xl font-bold inline-block ${textColor}`}>
                    {title}
                  </h1>
                )}
            </div>
        </div>
        <div className={`flex flex-wrap justify-center md:justify-start items-center gap-x-4 md:gap-x-6 gap-y-1 text-xs md:text-sm ${subTextColor}`}>
            <p>专辑：<span className="text-blue-400 font-medium">{album}</span></p>
            <p>歌手：<span className="text-blue-400 font-medium">{artist}</span></p>
            <p className="hidden md:block opacity-70">来源：<span>{source}</span></p>
        </div>
      </div>

      {/* Lyrics Container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full flex-1 md:max-w-md md:h-[40dvh] overflow-y-auto overflow-x-hidden custom-scrollbar mask-fade-edges relative px-2"
      >
        <div className="py-12 md:py-16 lg:py-20 space-y-4 md:space-y-8">
            {lyrics.length > 0 ? (
              lyrics.map((lyric, index) => (
                <div 
                    key={index}
                    ref={index === activeIndex ? activeLyricRef : null}
                    onClick={() => onSeek?.(lyric.time)}
                    className={`transition-all duration-700 cursor-pointer whitespace-normal py-1 px-4 md:px-0 ${
                        index === activeIndex 
                        ? `${textColor} text-lg md:text-2xl font-bold scale-105` 
                        : `${inactiveLyricColor} text-base md:text-lg font-medium hover:text-white/80`
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
