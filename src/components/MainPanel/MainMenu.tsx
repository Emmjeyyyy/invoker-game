import React, { useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';

interface MainMenuProps {
  showDifficultySelect: boolean;
  setShowDifficultySelect: (show: boolean) => void;
  showTimeTrialSelect: boolean;
  setShowTimeTrialSelect: (show: boolean) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  showDifficultySelect,
  setShowDifficultySelect,
  showTimeTrialSelect,
  setShowTimeTrialSelect
}) => {
  const { startGame, isModelLoaded } = useGameStore();

  const gradientStyle = useMemo(() => {
    return `linear-gradient(to right, #4facfe, #d53e90, #ff8c00)`;
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full flex-1 mt-8">
      {!showDifficultySelect && !showTimeTrialSelect && (
        <div className={`relative mb-12 ${isModelLoaded ? 'animate-fade-in-down' : 'opacity-0'}`}>
          {/* Dark duplicate — same gradient but darker, offset down for 3D depth */}
          {[6, 5, 4, 3, 2, 1].map((offset) => (
            <span
              key={offset}
              aria-hidden="true"
              className="absolute top-0 left-0 w-full text-5xl lg:text-7xl font-victory pt-4 pb-2 leading-normal tracking-widest text-transparent bg-clip-text pointer-events-none text-center"
              style={{
                backgroundImage: `linear-gradient(to right, #1a4a6a, #4a1060, #7a3000)`,
                transform: `translateY(${offset}px)`,
              }}
            >
              INVOKER GAME
            </span>
          ))}
          {/* Front text — bright gradient */}
          <h1
            className="text-5xl lg:text-7xl font-victory pt-4 pb-2 leading-normal tracking-widest text-transparent bg-clip-text relative text-center"
            style={{
              backgroundImage: gradientStyle,
              WebkitTextStroke: '1px rgba(255,255,255,0.2)',
              filter: 'drop-shadow(0px 10px 24px rgba(0,0,0,0.95))',
            }}
          >
            INVOKER GAME
          </h1>
        </div>
      )}
      {!showDifficultySelect && !showTimeTrialSelect ? (
        <div key="main-menu" className={`flex flex-col gap-6 w-full max-w-md ${isModelLoaded ? 'opacity-0 animate-fade-in-up' : 'opacity-0'}`}>
          <button
            onClick={() => startGame('Practice', 'Beginner')}
            className="relative mb-[6px] px-8 py-5 rounded-2xl transition-all duration-200 group flex flex-col items-center justify-center bg-linear-to-b from-sky-500 via-sky-600 to-blue-800 border border-blue-300/50 shadow-[0_6px_0_rgb(30,58,138),inset_0_2px_10px_rgba(255,255,255,0.3),0_10px_20px_rgba(0,0,0,0.6)] hover:brightness-110 hover:shadow-[0_4px_0_rgb(30,58,138),inset_0_2px_10px_rgba(255,255,255,0.4),0_8px_15px_rgba(59,130,246,0.6)] hover:translate-y-[2px] active:translate-y-[6px] active:shadow-[0_0px_0_rgb(30,58,138),inset_0_4px_10px_rgba(0,0,0,0.4),0_2px_5px_rgba(0,0,0,0.6)]"
          >
            <span className="text-2xl font-bold tracking-widest text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">PRACTICE MODE</span>
          </button>
          <button
            onClick={() => setShowDifficultySelect(true)}
            className="relative mb-[6px] px-8 py-5 rounded-2xl transition-all duration-200 group flex flex-col items-center justify-center bg-linear-to-b from-pink-600 via-pink-700 to-pink-950 border border-pink-400/40 shadow-[0_6px_0_rgb(80,0,40),inset_0_2px_10px_rgba(255,255,255,0.2),0_10px_20px_rgba(0,0,0,0.6)] hover:brightness-110 hover:shadow-[0_4px_0_rgb(80,0,40),inset_0_2px_10px_rgba(255,255,255,0.3),0_8px_15px_rgba(236,72,153,0.4)] hover:translate-y-[2px] active:translate-y-[6px] active:shadow-[0_0px_0_rgb(80,0,40),inset_0_4px_10px_rgba(0,0,0,0.4),0_2px_5px_rgba(0,0,0,0.6)]"
          >
            <span className="text-2xl font-bold tracking-widest text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">CHALLENGE MODE</span>
          </button>
          <button
            onClick={() => setShowTimeTrialSelect(true)}
            className="relative mb-[6px] px-8 py-5 rounded-2xl transition-all duration-200 group flex flex-col items-center justify-center bg-linear-to-b from-yellow-600 via-yellow-700 to-yellow-900 border border-yellow-400/50 shadow-[0_6px_0_rgb(66,32,6),inset_0_2px_10px_rgba(255,255,255,0.3),0_10px_20px_rgba(0,0,0,0.6)] hover:brightness-110 hover:shadow-[0_4px_0_rgb(66,32,6),inset_0_2px_10px_rgba(255,255,255,0.5),0_8px_15px_rgba(202,138,4,0.4)] hover:translate-y-[2px] active:translate-y-[6px] active:shadow-[0_0px_0_rgb(66,32,6),inset_0_4px_10px_rgba(0,0,0,0.4),0_2px_5px_rgba(0,0,0,0.6)]"
          >
            <span className="text-2xl font-bold tracking-widest text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">TIME TRIAL</span>
          </button>
        </div>
      ) : showDifficultySelect ? (
        <div key="difficulty-menu" className={`flex flex-col items-center gap-8 w-full max-w-5xl px-4 ${isModelLoaded ? 'opacity-0 animate-fade-in-up' : 'opacity-0'}`}>
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
            className="mt-4 relative mb-[4px] px-8 py-4 rounded-xl transition-all duration-200 group flex flex-col items-center justify-center bg-linear-to-b from-slate-600 via-slate-700 to-slate-900 border border-slate-400/40 shadow-[0_4px_0_rgb(2,6,23),inset_0_2px_10px_rgba(255,255,255,0.2),0_8px_15px_rgba(0,0,0,0.6)] hover:brightness-110 hover:shadow-[0_2px_0_rgb(2,6,23),inset_0_2px_10px_rgba(255,255,255,0.3),0_5px_10px_rgba(100,116,139,0.4)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-[0_0px_0_rgb(2,6,23),inset_0_4px_10px_rgba(0,0,0,0.4),0_2px_5px_rgba(0,0,0,0.6)]"
          >
            <span className="text-xl tracking-wider text-slate-100 font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">BACK TO MENU</span>
          </button>
        </div>
      ) : (
        <div key="time-trial-menu" className={`flex flex-col items-center gap-8 w-full max-w-2xl px-4 ${isModelLoaded ? 'opacity-0 animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl text-center text-white tracking-widest text-shadow-glow">Select Time Trial Mode</h2>

          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 lg:gap-8 w-full">
            {/* Sprint */}
            <button
              onClick={() => { setShowTimeTrialSelect(false); startGame('Sprint', 'Intermediate'); }}
              className="relative flex-1 aspect-square max-h-[280px] rounded-2xl overflow-hidden border-2 border-blue-900/50 hover:border-blue-400 hover:scale-105 transition-all duration-300 group shadow-lg hover:shadow-[0_0_20px_rgba(96,165,250,0.3)] bg-slate-900"
            >
              <img src="/asset/bgs/invoker3.png" alt="Sprint Mode" className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 lg:pb-8">
                <span className="text-2xl sm:text-3xl tracking-widest text-blue-400 font-bold text-shadow-glow mb-1 drop-shadow-[0_4px_6px_rgba(0,0,0,1)]">SPRINT</span>
                <span className="text-xs sm:text-sm text-blue-200 text-center font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,1)] px-4">Cast as many spells as possible in 10 seconds</span>
              </div>
            </button>

            {/* Speedrun */}
            <button
              onClick={() => { setShowTimeTrialSelect(false); startGame('Speedrun', 'Intermediate'); }}
              className="relative flex-1 aspect-square max-h-[280px] rounded-2xl overflow-hidden border-2 border-purple-900/50 hover:border-purple-400 hover:scale-105 transition-all duration-300 group shadow-lg hover:shadow-[0_0_20px_rgba(192,132,252,0.3)] bg-slate-900"
            >
              <img src="/asset/bgs/invoker2.png" alt="Speedrun Mode" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 lg:pb-8">
                <span className="text-2xl sm:text-3xl tracking-widest text-purple-400 font-bold text-shadow-glow mb-1 drop-shadow-[0_4px_6px_rgba(0,0,0,1)]">SPEEDRUN</span>
                <span className="text-xs sm:text-sm text-purple-200 text-center font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,1)] px-4">Cast 10 spells as fast as possible</span>
              </div>
            </button>
          </div>

          <button
            onClick={() => setShowTimeTrialSelect(false)}
            className="mt-4 relative mb-[4px] px-8 py-4 rounded-xl transition-all duration-200 group flex flex-col items-center justify-center bg-linear-to-b from-slate-600 via-slate-700 to-slate-900 border border-slate-400/40 shadow-[0_4px_0_rgb(2,6,23),inset_0_2px_10px_rgba(255,255,255,0.2),0_8px_15px_rgba(0,0,0,0.6)] hover:brightness-110 hover:shadow-[0_2px_0_rgb(2,6,23),inset_0_2px_10px_rgba(255,255,255,0.3),0_5px_10px_rgba(100,116,139,0.4)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-[0_0px_0_rgb(2,6,23),inset_0_4px_10px_rgba(0,0,0,0.4),0_2px_5px_rgba(0,0,0,0.6)]"
          >
            <span className="text-xl tracking-wider text-slate-100 font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">BACK TO MENU</span>
          </button>
        </div>
      )}
    </div>
  );
};
