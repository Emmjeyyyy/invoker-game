import React from 'react';
import { useGameStore } from '../../store/gameStore';

interface MainMenuProps {
  showDifficultySelect: boolean;
  setShowDifficultySelect: (show: boolean) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ showDifficultySelect, setShowDifficultySelect }) => {
  const { startGame } = useGameStore();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full flex-1 mt-8">
      <h1 className="text-5xl lg:text-7xl font-serif text-textGold mb-12 tracking-widest text-shadow-glow">INVOKER GAME</h1>
      {!showDifficultySelect ? (
        <div className="flex flex-col gap-6 w-full max-w-md">
          <button
            onClick={() => startGame('Practice', 'Beginner')}
            className="px-8 py-6 border border-panelBorder rounded-xl hover:bg-panelBorder/30 transition-all group flex flex-col items-center"
          >
            <span className="text-2xl tracking-wider group-hover:text-white transition-colors">Practice Mode</span>
          </button>
          <button
            onClick={() => setShowDifficultySelect(true)}
            className="px-8 py-6 border border-red-900/50 rounded-xl hover:bg-red-900/20 transition-all group flex flex-col items-center"
          >
            <span className="text-2xl tracking-wider text-red-400 group-hover:text-red-300 transition-colors">Challenge Mode</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 w-full max-w-5xl px-4">
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
