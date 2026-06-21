import React from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

export const MainPanel: React.FC = () => {
  const { isStarted, startGame, targetSpell, currentOrbs } = useGameStore();

  const getOrbImage = (orb: string) => {
    switch (orb) {
      case 'Q': return '/asset/icons/QWE/normal orbs/invoker_quas.png';
      case 'W': return '/asset/icons/QWE/normal orbs/invoker_wex.png';
      case 'E': return '/asset/icons/QWE/normal orbs/invoker_exort.png';
      default: return '';
    }
  };

  const displayOrbs = [...currentOrbs];
  while (displayOrbs.length < 3) displayOrbs.push('');

  return (
    <div className="flex flex-col h-full bg-panel border border-panelBorder rounded-xl p-8 shadow-2xl items-center relative">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {!isStarted ? (
          <>
            {/* Invoker Portrait Placeholder */}
            <div className="w-48 h-48 border border-panelBorder rounded-lg overflow-hidden bg-gradient-to-t from-panelBorder to-black mb-12 shadow-2xl shadow-textGold/10">
               {/* Need actual asset, placeholder for now */}
            </div>

            <button 
              onClick={() => startGame('Classic', 'Beginner')}
              className="px-8 py-4 border border-panelBorder rounded-xl hover:bg-panelBorder/30 transition-all group flex flex-col items-center"
            >
              <span className="text-xl tracking-wider group-hover:text-white transition-colors">Start Game</span>
              <span className="text-xs text-textMuted font-sans mt-1">or press Enter</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center w-full h-full justify-center">
            {/* Active Spell Challenge */}
            <motion.div 
              key={targetSpell?.name}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-16 text-center"
            >
              <div className="w-32 h-32 mx-auto bg-black/50 border border-panelBorder rounded mb-6 shadow-2xl flex items-center justify-center overflow-hidden">
                 <img src={targetSpell?.iconPath} alt={targetSpell?.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/asset/icons/invoke skills/default skills/no-spell.png'; }} />
              </div>
              <h2 className="text-4xl text-white tracking-wider">{targetSpell?.name}</h2>
            </motion.div>
          </div>
        )}
      </div>

      {/* Orb Tracker */}
      <div className="flex gap-6 mt-8 mb-12">
        {displayOrbs.map((orb, idx) => (
          <div key={idx} className={`w-20 h-20 rounded-full border-2 bg-black/30 flex items-center justify-center relative overflow-hidden ${orb ? 'border-transparent' : 'border-panelBorder'}`}>
            <AnimatePresence mode="popLayout">
              {orb && (
                <motion.img
                  key={`${orb}-${idx}`}
                  src={getOrbImage(orb)}
                  alt={orb}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute inset-0 w-full h-full object-cover rounded-full shadow-lg shadow-black/50"
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex gap-1">
        {[
          { key: 'Q', img: '/asset/icons/QWE/normal orbs/invoker_quas.png' },
          { key: 'W', img: '/asset/icons/QWE/normal orbs/invoker_wex.png' },
          { key: 'E', img: '/asset/icons/QWE/normal orbs/invoker_exort.png' },
          { key: 'D', img: '/asset/icons/invoke skills/default skills/no-spell.png' },
          { key: 'F', img: '/asset/icons/invoke skills/default skills/no-spell.png' },
          { key: 'R', img: '/asset/icons/QWE/Invoke_icon.png' },
        ].map((btn) => (
          <div key={btn.key} className="w-14 h-14 border border-panelBorder bg-black relative overflow-hidden shadow-lg">
            <img src={btn.img} alt={btn.key} className="w-full h-full object-cover" />
            <span className="absolute bottom-0.5 right-1.5 text-sm font-serif text-white font-bold text-shadow-glow drop-shadow-[0_1px_2px_rgba(0,0,0,1)] z-10">{btn.key}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
