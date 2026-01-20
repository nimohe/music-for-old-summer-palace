
import React from 'react';

interface VinylRecordProps {
  isPlaying: boolean;
  coverUrl: string;
}

const VinylRecord: React.FC<VinylRecordProps> = ({ isPlaying, coverUrl }) => {
  return (
    <div className="relative flex flex-col items-center justify-center p-4 md:p-8">
      {/* Tonearm - 移动端缩小尺寸 */}
      <div 
        className={`absolute top-0 right-1/4 z-20 transition-transform duration-700 ease-in-out origin-top-right`}
        style={{ transform: isPlaying ? 'rotate(15deg)' : 'rotate(-15deg)' }}
      >
        <div className="w-0.5 md:w-1 h-20 md:h-32 bg-gray-200 relative shadow-md rounded-full">
            <div className="absolute top-0 -left-1 md:-left-2 w-3 md:w-5 h-3 md:h-5 bg-white border border-gray-100 rounded-full shadow-sm"></div>
            <div className="absolute bottom-0 -left-2 md:-left-3 w-5 md:w-8 h-3 md:h-4 bg-gray-300 rounded-sm"></div>
        </div>
      </div>

      {/* Main Vinyl Container - 移动端大幅缩小 */}
      <div className={`relative w-56 h-56 md:w-96 md:h-96 rounded-full bg-zinc-900 shadow-2xl flex items-center justify-center vinyl-grooves ${isPlaying ? 'animate-[spin_20s_linear_infinite]' : ''}`}>
        {/* Album Cover Circle */}
        <div className="w-1/2 h-1/2 rounded-full overflow-hidden border-4 md:border-8 border-zinc-800 shadow-inner relative z-10">
          <img 
            src={coverUrl} 
            alt="Album Cover" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
        </div>
        
        {/* Central Spindle Hole */}
        <div className="absolute w-2 md:w-4 h-2 md:h-4 bg-white rounded-full z-20 shadow-inner border border-gray-200"></div>
      </div>
      
      {/* Decorative Interactive Controls - 移动端隐藏或缩小 */}
      <div className="mt-6 md:mt-12 flex items-center space-x-4 md:space-x-8">
        {[
          'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
          'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
          'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
          'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
        ].map((d, i) => (
          <button key={i} className="p-2 md:p-3 bg-gray-100/50 hover:bg-gray-100 rounded-full transition-colors group">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VinylRecord;
