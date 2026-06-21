import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const GameInfo: React.FC = () => {
  const { mode, lives, correctCount } = useGameStore();

  if (mode !== 'Challenge') return null;

  return (
    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex items-center gap-4 z-10 bg-black/40 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-panelBorder backdrop-blur-sm">
      <div className="flex gap-1 sm:gap-2">
        {[...Array(3)].map((_, i) => (
          <img
            key={i}
            src="/asset/icons/Invoker_minimap_icon.webp"
            alt="Life"
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-panelBorder transition-all duration-300 ${i < lives ? 'opacity-100 shadow-[0_0_4px_rgba(250,204,21,0.6)]' : 'opacity-20 grayscale brightness-50'}`}
          />
        ))}
      </div>
      <div className="h-6 sm:h-8 w-px bg-panelBorder/50"></div>
      <div className="text-sm sm:text-xl font-serif text-textMuted font-bold tracking-wider">
        SCORE: <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{correctCount}</span>
      </div>
    </div>
  );
};
