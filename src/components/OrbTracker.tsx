import React from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div key={idx} className="w-16 h-16 rounded-full bg-surfaceHighlight flex items-center justify-center relative overflow-hidden border border-gray-700">
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
      ))}
    </div>
  );
};
