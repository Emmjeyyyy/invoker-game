import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const GameOver: React.FC = () => {
  const { correctCount, startGame, endGame, difficulty, mode, timeElapsed } = useGameStore();

  const isSpeedrun = mode === 'Speedrun';
  const isSprint = mode === 'Sprint';

  const title = isSpeedrun ? 'FINISHED!' : (isSprint ? "TIME'S UP!" : 'GAME OVER');
  const titleColor = isSpeedrun ? 'text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.4)]' : 
                     isSprint ? 'text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.4)]' : 
                     'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.4)]';

  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(2);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center w-full h-full bg-black/80 backdrop-blur-sm rounded-xl">
      <h2 className={`text-4xl sm:text-6xl font-bold mb-4 tracking-widest ${titleColor}`}>{title}</h2>
      
      {isSpeedrun ? (
        <p className="text-xl sm:text-3xl text-textMuted mb-12">Total Time: <span className="text-white font-bold">{formatTime(timeElapsed)}s</span></p>
      ) : (
        <p className="text-xl sm:text-3xl text-textMuted mb-12">Spells Cast: <span className="text-white font-bold">{correctCount}</span></p>
      )}

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => startGame(mode, difficulty)}
          className={`px-8 py-4 border rounded-xl transition-all text-xl sm:text-2xl tracking-wider 
            ${isSpeedrun ? 'border-purple-900/50 hover:bg-purple-900/20 text-purple-400 hover:text-purple-300' : 
              isSprint ? 'border-blue-900/50 hover:bg-blue-900/20 text-blue-400 hover:text-blue-300' : 
              'border-red-900/50 hover:bg-red-900/20 text-red-400 hover:text-red-300'}`}
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
