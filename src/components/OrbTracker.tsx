import React from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

export const getOrbGlow = (orb: 'Q' | 'W' | 'E') => {
  switch (orb) {
    case 'Q': return '0 0 12px rgba(0, 191, 255, 0.5)';
    case 'W': return '0 0 12px rgba(218, 112, 214, 0.5)';
    case 'E': return '0 0 12px rgba(255, 140, 0, 0.5)';
    default: return undefined;
  }
};

export const OrbTracker: React.FC = () => {
  const currentOrbs = useGameStore(state => state.currentOrbs);

  const getOrbColor = (orb: string) => {
    switch (orb) {
      case 'Q': return 'bg-quas shadow-[0_0_15px_rgba(59,130,246,0.6)]';
      case 'W': return 'bg-wex shadow-[0_0_15px_rgba(168,85,247,0.6)]';
      case 'E': return 'bg-exort shadow-[0_0_15px_rgba(239,68,68,0.6)]';
      default: return 'bg-gray-600';
    }
  };

  // Fill empty slots so there are always 3 slots displayed
  const displayOrbs: (string | null)[] = [...currentOrbs];
  while (displayOrbs.length < 3) displayOrbs.push(null);

  return (
    <div className="flex gap-4 my-8">
      {displayOrbs.map((orb, idx) => (
        <div 
          key={idx} 
          className="w-16 h-16 rounded-full bg-surfaceHighlight flex items-center justify-center relative border transition-all duration-300"
          style={{ 
            boxShadow: (orb === 'Q' || orb === 'W' || orb === 'E') ? getOrbGlow(orb) : undefined,
            borderColor: orb === 'Q' ? 'rgba(0,191,255,0.4)' : orb === 'W' ? 'rgba(218,112,214,0.4)' : orb === 'E' ? 'rgba(255,140,0,0.4)' : 'rgba(75,85,99,0.5)'
          }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <AnimatePresence mode="popLayout">
            {orb && (
              <motion.div
                key={`${orb}-${idx}-${Date.now()}`} // force re-animation if needed, or better id
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`absolute inset-1 rounded-full ${getOrbColor(orb)}`}
              />
            )}
          </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
};
