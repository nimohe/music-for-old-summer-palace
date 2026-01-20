
import React from 'react';

interface VinylRecordProps {
  isPlaying: boolean;
  coverUrl: string;
}

const VinylRecord: React.FC<VinylRecordProps> = ({ isPlaying, coverUrl }) => {
  return (
    <div className="relative flex flex-col items-center justify-center pt-8 md:pt-0">
      {/* Tonearm - 参考图中为纯白色简约风格 */}
      <div 
        className={`absolute -top-10 md:-top-16 right-[15%] md:right-1/4 z-30 transition-transform duration-1000 ease-in-out origin-top-right`}
        style={{ transform: isPlaying ? 'rotate(18deg)' : 'rotate(-12deg)' }}
      >
        <div className="relative flex flex-col items-center">
            {/* Base Pivot */}
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
            {/* Arm Shaft */}
            <div className="w-1 md:w-1.5 h-24 md:h-36 bg-white shadow-sm rounded-full -mt-1 origin-top transform rotate-[5deg]">
                {/* Head Shell */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 md:w-6 h-6 md:h-8 bg-white rounded-sm shadow-md flex items-center justify-center">
                   <div className="w-full h-0.5 bg-gray-200"></div>
                </div>
            </div>
        </div>
      </div>

      {/* Main Vinyl Container - 调整黑圈与封面的比例 */}
      <div className={`relative w-[85vw] h-[85vw] md:w-96 md:h-96 max-w-full rounded-full bg-[#111] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center vinyl-grooves overflow-hidden ${isPlaying ? 'animate-[spin_20s_linear_infinite]' : ''}`}>
        
        {/* Subtle Inner Highlight for Depth */}
        <div className="absolute inset-0 rounded-full border-[10px] border-white/5 pointer-events-none"></div>

        {/* Album Cover Circle - 扩大比例至约 68% */}
        <div className="w-[68%] h-[68%] rounded-full overflow-hidden border-2 md:border-4 border-zinc-800 shadow-2xl relative z-10">
          <img 
            src={coverUrl} 
            alt="Album Cover" 
            className="w-full h-full object-cover"
          />
          {/* Subtle reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
        </div>
        
        {/* Vinyl Surface Grooves Texture (handled via CSS class vinyl-grooves in index.html) */}
      </div>
      
      {/* Decorative Interactive Controls */}
      <div className="mt-12 md:mt-16 flex items-center space-x-6 md:space-x-8">
        {[
          'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
          'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
          'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
          'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
        ].map((d, i) => (
          <button key={i} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all hover:scale-110 group border border-white/5">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white/40 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VinylRecord;
