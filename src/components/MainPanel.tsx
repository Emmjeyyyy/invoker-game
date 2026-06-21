import React from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

interface MainPanelProps {
  onOpenSettings: () => void;
}

export const MainPanel: React.FC<MainPanelProps> = ({ onOpenSettings }) => {
  const { isStarted, startGame, targetSpell, currentOrbs, slotD, slotF, keybinds } = useGameStore();

  const getOrbImage = (orb: string) => {
    switch (orb) {
      case 'Q': return '/asset/icons/QWE/normal orbs/invoker_quas.png';
      case 'W': return '/asset/icons/QWE/normal orbs/invoker_wex.png';
      case 'E': return '/asset/icons/QWE/normal orbs/invoker_exort.png';
      default: return '';
    }
  };

  const displayOrbs: Array<'Q' | 'W' | 'E' | ''> = [...currentOrbs];
  while (displayOrbs.length < 3) displayOrbs.push('');

  return (
    <div className="flex flex-col h-full justify-center bg-panel border border-panelBorder rounded-xl p-8 shadow-2xl items-center relative w-full">
      <button 
        onClick={onOpenSettings}
        className="absolute top-4 right-4 text-textMuted hover:text-white transition-colors"
        title="Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
          <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
        </svg>
      </button>

      <div className="flex flex-col items-center justify-center w-full mb-12">
        <div className="flex flex-col items-center w-full justify-center">
          {/* Active Spell Challenge */}
          <motion.div
            key={targetSpell?.name}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="w-32 h-32 mx-auto bg-black/50 border border-panelBorder rounded mb-4 shadow-2xl flex items-center justify-center overflow-hidden">
              <img src={targetSpell?.iconPath} alt={targetSpell?.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/asset/icons/invoke skills/default skills/no-spell.png'; }} />
            </div>
            <h2 className="text-4xl text-white tracking-wider">{targetSpell?.name}</h2>
          </motion.div>

          {!isStarted && (
            <button
              onClick={() => startGame('Classic', 'Beginner')}
              className="mt-8 px-8 py-4 border border-panelBorder rounded-xl hover:bg-panelBorder/30 transition-all group flex flex-col items-center"
            >
              <span className="text-xl tracking-wider group-hover:text-white transition-colors">Start Game</span>
            </button>
          )}
        </div>
      </div>

      {/* Orb Tracker */}
      <div className="flex gap-6 mt-2 mb-8">
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
      <div className="flex gap-3">
        {[
          { key: 'Q', displayKey: keybinds.Q.toUpperCase(), img: '/asset/icons/QWE/normal orbs/invoker_quas.png' },
          { key: 'W', displayKey: keybinds.W.toUpperCase(), img: '/asset/icons/QWE/normal orbs/invoker_wex.png' },
          { key: 'E', displayKey: keybinds.E.toUpperCase(), img: '/asset/icons/QWE/normal orbs/invoker_exort.png' },
          { key: 'D', displayKey: keybinds.D.toUpperCase(), img: slotD?.iconPath || '/asset/icons/invoke skills/default skills/no-spell.png' },
          { key: 'F', displayKey: keybinds.F.toUpperCase(), img: slotF?.iconPath || '/asset/icons/invoke skills/default skills/no-spell.png' },
          { key: 'R', displayKey: keybinds.R.toUpperCase(), img: '/asset/icons/QWE/Invoke_icon.png' },
        ].map((btn) => (
          <div key={btn.key} className="w-14 h-14 bg-black relative shadow-xl border-2 border-t-gray-400 border-l-gray-400 border-b-gray-800 border-r-gray-800 ring-1 ring-black">
            <img src={btn.img} alt={btn.key} className="w-full h-full object-cover" />
            <span className="absolute -top-1.5 -left-1.5 w-4 h-4 flex items-center justify-center bg-black border border-panelBorder rounded-sm text-[11px] font-serif text-white font-bold text-shadow-glow z-10">{btn.displayKey}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
