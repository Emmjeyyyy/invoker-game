import React from 'react';
import { useGameStore } from '../../store/gameStore';

interface MainMenuProps {
  showDifficultySelect: boolean;
  setShowDifficultySelect: (show: boolean) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ showDifficultySelect, setShowDifficultySelect }) => {
  const { startGame, isModelLoaded } = useGameStore();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full flex-1 mt-8">
      {!showDifficultySelect && (
        <h1 
          className={`text-5xl lg:text-7xl font-victory mb-12 pt-4 pb-2 leading-normal tracking-widest bg-linear-to-b from-[#ffffe6] via-[#ffd700] to-[#b8860b] text-transparent bg-clip-text ${isModelLoaded ? 'animate-fade-in-down' : 'opacity-0'}`}
          style={{
            filter: 'drop-shadow(0px 1px 0px #996b00) drop-shadow(0px 2px 0px #7a5500) drop-shadow(0px 3px 0px #5c4000) drop-shadow(0px 4px 0px #3d2b00) drop-shadow(0px 10px 20px rgba(0,0,0,0.9))',
            WebkitTextStroke: '1px rgba(255,255,255,0.2)'
          }}
        >
          INVOKER GAME
        </h1>
      )}
      {!showDifficultySelect ? (
        <div className={`flex flex-col gap-6 w-full max-w-md ${isModelLoaded ? 'opacity-0 animate-fade-in-up' : 'opacity-0'}`}>
          <button
            onClick={() => startGame('Practice', 'Beginner')}
            className="relative px-8 py-5 rounded-2xl transition-all duration-200 group flex flex-col items-center justify-center bg-linear-to-b from-yellow-600 via-yellow-700 to-yellow-900 border border-yellow-400/50 border-b-[6px] border-b-yellow-950 shadow-[inset_0_2px_10px_rgba(255,255,255,0.3),0_10px_20px_rgba(0,0,0,0.6)] hover:brightness-110 hover:shadow-[inset_0_2px_10px_rgba(255,255,255,0.5),0_15px_30px_rgba(202,138,4,0.4)] active:translate-y-[4px] active:border-b-2 active:mb-[4px] active:shadow-[inset_0_4px_10px_rgba(0,0,0,0.4),0_2px_5px_rgba(0,0,0,0.6)]"
          >
            <span className="text-2xl font-bold tracking-widest text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">PRACTICE MODE</span>
          </button>
          <button
            onClick={() => setShowDifficultySelect(true)}
            className="relative px-8 py-5 rounded-2xl transition-all duration-200 group flex flex-col items-center justify-center bg-linear-to-b from-red-700 via-red-800 to-red-950 border border-red-400/40 border-b-[6px] border-b-[rgb(60,0,0)] shadow-[inset_0_2px_10px_rgba(255,255,255,0.2),0_10px_20px_rgba(0,0,0,0.6)] hover:brightness-110 hover:shadow-[inset_0_2px_10px_rgba(255,255,255,0.3),0_15px_30px_rgba(220,38,38,0.4)] active:translate-y-[4px] active:border-b-2 active:mb-[4px] active:shadow-[inset_0_4px_10px_rgba(0,0,0,0.4),0_2px_5px_rgba(0,0,0,0.6)]"
          >
            <span className="text-2xl font-bold tracking-widest text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">CHALLENGE MODE</span>
          </button>
        </div>
      ) : (
        <div className={`flex flex-col items-center gap-8 w-full max-w-5xl px-4 ${isModelLoaded ? 'opacity-0 animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl text-center text-white tracking-widest text-shadow-glow">Select Difficulty</h2>

          <div className="flex flex-row justify-center gap-4 sm:gap-6 lg:gap-8 w-full">
            {/* Easy */}
            <button
              onClick={() => { setShowDifficultySelect(false); startGame('Challenge', 'Beginner'); }}
              className="relative flex-1 aspect-square max-h-[280px] rounded-2xl overflow-hidden border-2 border-green-900/50 hover:border-green-400 hover:scale-105 transition-all duration-300 group shadow-lg hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]"
            >
              <img src="/asset/bgs/kidvoker3.png" alt="Easy Mode" className="absolute inset-0 w-full h-full object-cover object-[center_bottom] scale-[1.15] transition-transform duration-500 group-hover:scale-[1.25]" />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 lg:pb-8">
                <span className="text-2xl sm:text-3xl tracking-widest text-green-400 font-bold text-shadow-glow drop-shadow-[0_4px_6px_rgba(0,0,0,1)] mb-2">EASY</span>
              </div>
            </button>

            {/* Normal */}
            <button
              onClick={() => { setShowDifficultySelect(false); startGame('Challenge', 'Intermediate'); }}
              className="relative flex-1 aspect-square max-h-[280px] rounded-2xl overflow-hidden border-2 border-yellow-900/50 hover:border-yellow-400 hover:scale-105 transition-all duration-300 group shadow-lg hover:shadow-[0_0_20px_rgba(250,204,21,0.3)]"
            >
              <img src="/asset/bgs/invoker.jpg" alt="Normal Mode" className="absolute inset-0 w-full h-full object-cover object-[15%_center] transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 lg:pb-8">
                <span className="text-2xl sm:text-3xl tracking-widest text-yellow-400 font-bold text-shadow-glow drop-shadow-[0_4px_6px_rgba(0,0,0,1)] mb-2">NORMAL</span>
              </div>
            </button>

            {/* Hard */}
            <button
              onClick={() => { setShowDifficultySelect(false); startGame('Challenge', 'Advanced'); }}
              className="relative flex-1 aspect-square max-h-[280px] rounded-2xl overflow-hidden border-2 border-red-900/50 hover:border-red-400 hover:scale-105 transition-all duration-300 group shadow-lg hover:shadow-[0_0_20px_rgba(248,113,113,0.3)]"
            >
              <img src="/asset/bgs/invoker4.jpg" alt="Hard Mode" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 lg:pb-8">
                <span className="text-2xl sm:text-3xl tracking-widest text-red-400 font-bold text-shadow-glow drop-shadow-[0_4px_6px_rgba(0,0,0,1)] mb-2">HARD</span>
              </div>
            </button>
          </div>

          <button
            onClick={() => setShowDifficultySelect(false)}
            className="mt-4 px-8 py-4 border-2 border-panelBorder rounded-xl hover:bg-panelBorder/30 transition-all text-xl tracking-wider text-textMuted hover:text-white hover:scale-105"
          >
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );
};
