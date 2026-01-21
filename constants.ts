
import { Song, LyricLine } from './types';

/**
 * Parses a standard LRC format string into an array of LyricLine objects.
 */
export const parseLRC = (lrc: string): LyricLine[] => {
  const lines = lrc.split('\n');
  const result: LyricLine[] = [];
  const timeRegex = /\[(\d{2}):(\d{2})(?:[.:](\d{2,3}))?\](.*)/;

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;
    
    const match = timeRegex.exec(trimmedLine);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const millisecondsPart = match[3] || "0";
      const text = match[4].trim();
      
      if (text.startsWith('[') || text.startsWith('[:')) return;
      if (text.includes('|') && text.length < 20) return;
      if (!text || text === '(前奏)') return;

      const divider = millisecondsPart.length === 3 ? 1000 : 100;
      const time = minutes * 60 + seconds + parseInt(millisecondsPart, 10) / divider;
      
      result.push({ time, text });
    }
  });

  return result.sort((a, b) => a.time - b.time);
};
