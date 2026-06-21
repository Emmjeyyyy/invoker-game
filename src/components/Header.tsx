import React from 'react';
import { Settings, Trophy, User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-6 border-b border-surfaceHighlight/50 bg-surface/50 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primaryHighlight text-shadow-glow">
          INVOKER
        </div>
        <div className="text-sm text-gray-400 uppercase tracking-widest">Training Arena</div>
      </div>
      
      <div className="flex gap-4">
        <button className="p-2 rounded-full hover:bg-surfaceHighlight transition-colors">
          <Trophy className="w-5 h-5 text-gray-300" />
        </button>
        <button className="p-2 rounded-full hover:bg-surfaceHighlight transition-colors">
          <Settings className="w-5 h-5 text-gray-300" />
        </button>
        <button className="p-2 rounded-full hover:bg-surfaceHighlight transition-colors">
          <User className="w-5 h-5 text-gray-300" />
        </button>
      </div>
    </header>
  );
};
