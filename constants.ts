
import { Song, LyricLine } from './types';

/**
 * Parses a standard LRC format string into an array of LyricLine objects.
 * Format: [mm:ss.xx] Text
 */
const parseLRC = (lrc: string): LyricLine[] => {
  const lines = lrc.split('\n');
  const result: LyricLine[] = [];
  const timeRegex = /\[(\d{2}):(\d{2})[.:](\d{2,3})\](.*)/;

  lines.forEach(line => {
    const match = timeRegex.exec(line.trim());
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const centiseconds = parseInt(match[3], 10);
      const text = match[4].trim();
      
      // Calculate time in seconds
      // Centiseconds are usually 1/100th of a second, but sometimes 1/1000th (milliseconds)
      const divider = match[3].length === 3 ? 1000 : 100;
      const time = minutes * 60 + seconds + centiseconds / divider;
      
      result.push({ time, text });
    }
  });

  return result.sort((a, b) => a.time - b.time);
};

const rawLrc = `[00:00.00] 找爱找
[00:05.00] 我的手心
[00:10.00] 要留给你喔
[00:15.00] 你总说得很少
[00:20.00] 做得很多
[00:25.00] 关于相信
[00:30.00] 爱是无条件的
[00:35.00] 我爱你
[00:40.00] 只要你好好活着
[00:45.00] 该怎么形容好呢
[00:50.00] 每一个瞬间
[00:55.00] 都值得被纪念
[01:00.00] 心跳的声音
[01:05.00] 在寂静中回荡
[01:10.00] 我们的故事
[01:15.00] 还未完待续
[01:20.00] 握紧你的手
[01:25.00] 直到世界尽头
[01:30.00] 感谢有你
[01:35.00] 出现在我的生命里
[01:40.00] 永远不变的约定`;

export const MOCK_SONG: Song = {
  id: '1',
  title: '我爱我',
  artist: '李奕遐',
  album: '我爱我',
  coverUrl: 'https://picsum.photos/seed/music/600/600',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  source: '我喜欢的音乐',
  lyrics: parseLRC(rawLrc)
};
