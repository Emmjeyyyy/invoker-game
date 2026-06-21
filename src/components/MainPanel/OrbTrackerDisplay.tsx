import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

export const OrbTrackerDisplay: React.FC = () => {
  const { currentOrbs } = useGameStore();

  const getOrbImage = (orb: string) => {
    switch (orb) {
      case 'Q': return '/asset/icons/QWE/normal orbs/invoker_quas.png';
      case 'W': return '/asset/icons/QWE/normal orbs/invoker_wex.png';
      case 'E': return '/asset/icons/QWE/normal orbs/invoker_exort.png';
      default: return '';
    }
  };

  const getOrbStyles = (orb: string) => {
    switch (orb) {
      case 'Q': return 'border-blue-500 shadow-[0_0_20px_rgba(79,172,254,0.3)]';
      case 'W': return 'border-pink-400 shadow-[0_0_20px_rgba(213,62,144,0.3)]';
      case 'E': return 'border-orange-400 shadow-[0_0_20px_rgba(255,140,0,0.3)]';
      default: return '';
    }
  };


  const displayOrbs: Array<'Q' | 'W' | 'E' | ''> = [...currentOrbs];
  while (displayOrbs.length < 3) displayOrbs.push('');

  return (
    <div className="flex gap-4 sm:gap-6 lg:gap-8 2xl:gap-12 mt-2 mb-6 sm:mb-8 2xl:mb-16">
      {displayOrbs.map((orb, idx) => (
        <div key={idx} className={`w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 2xl:w-32 2xl:h-32 rounded-full border-2 bg-black/30 flex items-center justify-center relative shrink-0 ${orb ? 'border-transparent' : 'border-panelBorder'}`}>
          <AnimatePresence mode="popLayout">
            {orb && (
              <motion.img
                key={`${orb}-${idx}`}
                src={getOrbImage(orb)}
                alt={orb}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={`absolute inset-0 w-full h-full object-cover rounded-full border-2 ${getOrbStyles(orb)}`}
              />
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
