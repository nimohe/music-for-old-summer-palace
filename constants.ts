
import { Song, LyricLine } from './types';

/**
 * Parses a standard LRC format string into an array of LyricLine objects.
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
      
      const divider = match[3].length === 3 ? 1000 : 100;
      const time = minutes * 60 + seconds + centiseconds / divider;
      
      result.push({ time, text });
    }
  });

  return result.sort((a, b) => a.time - b.time);
};

const rawLrc = `[00:00.00] 🎵 正在播放：我爱我
[00:04.00] 每一段旋律 都是成长的印记
[00:08.00] 每一句歌词 都是内心的独白
[00:12.00] 我爱我 无论完美还是破碎
[00:16.00] 胶片转动 记忆在旋律中复苏
[00:20.00] 感受极简设计的纯粹
[00:24.00] 在音乐的世界里 寻找真实的自我
[00:28.00] 歌词正在同步滚动...
[00:32.00] 感谢聆听 李奕遐 的心情
[00:36.00] 此时此刻 只有你和这首歌
[00:40.00] 享受这段纯粹的时光
[00:44.00] 愿你的世界充满律动
[00:48.00] 永不落幕的自我告白
[01:00.00] 音乐是灵魂的呼吸
[01:10.00] (间奏中...)
[01:30.00] 回到最初的悸动
[01:40.00] 永远不变的约定`;

export const MOCK_SONG: Song = {
  id: 'zenith-001',
  title: '我爱我',
  artist: '李奕遐',
  album: '我爱我',
  coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  source: '来自本地歌单：我喜欢的音乐',
  lyrics: parseLRC(rawLrc)
};
