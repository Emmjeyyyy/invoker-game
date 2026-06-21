import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const GameOver: React.FC = () => {
  const { correctCount, startGame, endGame, difficulty } = useGameStore();

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center w-full h-full bg-black/80 backdrop-blur-sm rounded-xl">
      <h2 className="text-4xl sm:text-6xl text-red-500 font-bold mb-4 tracking-widest drop-shadow-[0_0_5px_rgba(239,68,68,0.4)]">GAME OVER</h2>
      <p className="text-xl sm:text-3xl text-textMuted mb-12">Spells Cast: <span className="text-white font-bold">{correctCount}</span></p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => startGame('Challenge', difficulty)}
          className="px-8 py-4 border border-red-900/50 rounded-xl hover:bg-red-900/20 transition-all text-xl sm:text-2xl tracking-wider text-red-400 hover:text-red-300"
        >
          Play Again
        </button>
        <button
          onClick={endGame}
          className="px-8 py-4 border border-panelBorder rounded-xl hover:bg-panelBorder/30 transition-all text-xl sm:text-2xl tracking-wider hover:text-white"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};
