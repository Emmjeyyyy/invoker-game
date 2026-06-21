import React from 'react';
import { useGameStore } from '../store/gameStore';
import { OrbTracker } from './OrbTracker';
import { motion } from 'framer-motion';

export const GameArena: React.FC = () => {
  const { targetSpell, isStarted, startGame } = useGameStore();

  if (!isStarted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">Ready to Train?</h1>
        <button 
          onClick={() => startGame('Classic', 'Beginner')}
          className="px-8 py-4 bg-primary hover:bg-primaryHighlight rounded-lg text-xl font-bold transition-all box-shadow-glow"
        >
          Start Classic Mode
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      {/* Spell Challenge Display */}
      <div className="mb-12 text-center">
        <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest">Invoke</div>
        <motion.h2 
          key={targetSpell?.name}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-shadow-glow"
        >
          {targetSpell?.name}
        </motion.h2>
        
        {/* Combo hint for beginner mode */}
        <div className="flex gap-2 justify-center mt-4 text-gray-400 text-lg">
          {targetSpell?.combination.map((orb, i) => (
            <span key={i} className={`
              ${orb === 'Q' ? 'text-quas' : ''}
              ${orb === 'W' ? 'text-wex' : ''}
              ${orb === 'E' ? 'text-exort' : ''}
            `}>{orb}</span>
          ))}
          <span className="text-white">+ R</span>
        </div>
      </div>

      <OrbTracker />

      {/* Input feedback or status could go here */}
      <div className="h-12 flex items-center justify-center text-xl font-medium">
         {/* Feedback text will go here */}
      </div>
    </div>
  );
};
