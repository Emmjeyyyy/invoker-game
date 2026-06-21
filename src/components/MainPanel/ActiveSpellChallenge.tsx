import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

interface ActiveSpellChallengeProps {
  timer: number;
  maxTime: number;
}

export const ActiveSpellChallenge: React.FC<ActiveSpellChallengeProps> = ({ timer, maxTime }) => {
  const { mode, targetSpells } = useGameStore();

  return (
    <motion.div
      key={targetSpells.map(s => s.name).join('-')}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center w-full"
    >
      <div className="flex justify-center items-center gap-2 sm:gap-4 mb-2 min-h-[120px] sm:min-h-[160px] lg:min-h-[200px] 2xl:min-h-[280px]">
        {targetSpells.map((spell, index) => {
          const isGradientSpell = spell.name === 'Deafening Blast' || spell.name === 'Tornado' || spell.name === 'Ghost Walk';
          const gradientBg = spell.name === 'Deafening Blast'
            ? 'conic-gradient(from 0deg, #00bfff 45deg, #da70d6 90deg, #ff69b4 135deg, #ff8c00 180deg, #ffd700 225deg, #ffd700 310deg, #00bfff 315deg)'
            : spell.name === 'Tornado'
              ? 'linear-gradient(180deg, #00bfff, #8a2be2)'
              : spell.name === 'Ghost Walk'
                ? 'conic-gradient(from 0deg, #1e3a8a 45deg, #ffffff 90deg, #ffffff 135deg, #C63CCD 180deg, #ffffff 225deg, #ffffff 270deg, #1e3a8a 315deg, #1e3a8a 360deg)'
                : undefined;

          return (
            <div key={`${spell.id}-${index}`} className="relative flex items-center justify-center">
              {index === 0 && isGradientSpell && (
                <div
                  className="absolute inset-0 blur-sm scale-110 rounded z-0"
                  style={{ background: isGradientSpell ? gradientBg : undefined, opacity: 0.6 }}
                />
              )}
              <div
                className={`relative w-20 h-20 sm:w-32 sm:h-32 lg:w-44 lg:h-44 2xl:w-60 2xl:h-60 bg-black/50 border-2 rounded flex items-center justify-center transition-all duration-300 z-10 
            ${index === 0 ? 'scale-110' : 'border-panelBorder opacity-50 scale-90'}`}
                style={index === 0 ? {
                  borderColor: isGradientSpell ? 'transparent' : spell.color,
                  boxShadow: isGradientSpell ? undefined : `0 0 10px ${spell.color}99`,
                  backgroundImage: isGradientSpell ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), ${gradientBg}` : undefined,
                  backgroundOrigin: isGradientSpell ? 'padding-box, border-box' : undefined,
                  backgroundClip: isGradientSpell ? 'padding-box, border-box' : undefined,
                } : undefined}
              >
                <img src={spell.iconPath} alt={spell.name} className="w-full h-full object-cover rounded-[inherit] shadow-inner" onError={(e) => { e.currentTarget.src = '/asset/icons/invoke skills/default skills/no-spell.png'; }} />
              </div>
            </div>
          );
        })}
      </div>

      {mode === 'Challenge' && (
        <div className="w-[200px] sm:w-[300px] max-w-[90vw] h-2 bg-gray-800 rounded-full mt-8 mb-4 sm:mb-6 2xl:mb-8 overflow-hidden mx-auto">
          <div
            className={`h-full transition-all duration-75 ease-linear ${timer < maxTime * 0.33 ? 'bg-red-500' : 'bg-textGold'}`}
            style={{ width: `${(timer / maxTime) * 100}%` }}
          />
        </div>
      )}

      <h2 className={`text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl text-white tracking-wider ${mode !== 'Challenge' ? 'mt-4 sm:mt-6 2xl:mt-8' : ''}`}>
        {targetSpells[0]?.name}
        {targetSpells.length > 1 && (
          <span className="text-textMuted text-sm sm:text-xl block mt-3 font-serif">
            Next: <span className="text-gray-300">{targetSpells.slice(1).map(s => s.name).join(', ')}</span>
          </span>
        )}
      </h2>
    </motion.div>
  );
};
