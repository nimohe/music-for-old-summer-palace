
export interface LyricLine {
  time: number;
  text: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  audioUrl: string;
  lrcUrl: string; // 新增：歌词文件路径
  source: string;
  lyrics?: LyricLine[]; // 改为可选，因为将从外部加载
}

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}
