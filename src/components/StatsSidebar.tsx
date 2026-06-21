import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Target, Zap, Flame, Trophy } from 'lucide-react';

export const StatsSidebar: React.FC = () => {
  const { correctCount, incorrectCount, streak } = useGameStore();

  const total = correctCount + incorrectCount;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div className="w-80 border-l border-surfaceHighlight/50 bg-surface/30 backdrop-blur-sm p-6 flex flex-col gap-6">
      <h3 className="text-xl font-bold text-gray-200">Current Session</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surfaceHighlight/30 p-4 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Target className="w-4 h-4" />
            <span className="text-sm">Accuracy</span>
          </div>
          <div className="text-2xl font-bold">{accuracy}%</div>
        </div>

        <div className="bg-surfaceHighlight/30 p-4 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm">Streak</span>
          </div>
          <div className="text-2xl font-bold">{streak}</div>
        </div>

        <div className="bg-surfaceHighlight/30 p-4 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">Avg Speed</span>
          </div>
          <div className="text-2xl font-bold">--s</div>
        </div>

        <div className="bg-surfaceHighlight/30 p-4 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-sm">Score</span>
          </div>
          <div className="text-2xl font-bold">{correctCount}</div>
        </div>
      </div>
      
      <div className="mt-8">
        <h4 className="text-sm text-gray-400 uppercase tracking-widest mb-4">Detailed Stats</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Total Invoked</span>
            <span className="font-mono">{total}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Correct</span>
            <span className="text-green-400 font-mono">{correctCount}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Incorrect</span>
            <span className="text-red-400 font-mono">{incorrectCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
