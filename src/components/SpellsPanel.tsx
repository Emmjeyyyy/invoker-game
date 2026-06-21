import React from 'react';
import { SPELLS } from '../lib/constants';

export const SpellsPanel: React.FC = () => {
  return (
    <div className="flex flex-col lg:h-full bg-panel border border-panelBorder rounded-xl p-2 sm:p-3 lg:p-6 2xl:p-8 shadow-2xl overflow-hidden shrink-0 lg:shrink">
      <h2 className="hidden lg:block text-center text-sm lg:text-base 2xl:text-xl tracking-[0.2em] uppercase font-bold text-textGold mb-4 lg:mb-6 2xl:mb-8 shrink-0">
        Spells
      </h2>
      
      <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-hidden pb-2 lg:pb-0 pr-0 lg:pr-2 2xl:pr-4 gap-2 lg:gap-1 lg:justify-between lg:flex-1 custom-scrollbar items-start lg:items-stretch">
        {SPELLS.map((spell) => (
          <div key={spell.id} className="flex flex-col lg:flex-row items-center lg:justify-center gap-1 lg:gap-4 xl:gap-6 2xl:gap-8 group cursor-pointer hover:bg-panelBorder/30 p-2 lg:py-1 lg:px-2 xl:py-1.5 xl:px-3 2xl:py-2 2xl:px-4 rounded transition-colors min-w-[70px] lg:min-w-0 shrink-0 lg:flex-1 lg:min-h-0">
            <div className="w-10 h-10 lg:w-auto lg:h-full lg:max-h-[64px] 2xl:max-h-[80px] lg:aspect-square bg-black/50 border border-panelBorder rounded flex items-center justify-center overflow-hidden shrink-0">
               <img src={spell.iconPath} alt={spell.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/asset/icons/invoke skills/default skills/no-spell.png'; }} />
            </div>
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:w-32 xl:w-40 2xl:w-48">
              <span className="text-[10px] sm:text-xs lg:text-sm xl:text-lg 2xl:text-xl font-sans text-white group-hover:text-textGold transition-colors leading-tight whitespace-nowrap">{spell.name}</span>
              <div className="flex gap-0.5 lg:gap-1.5 xl:gap-2 2xl:gap-3 mt-0.5 xl:mt-1 2xl:mt-1.5 text-[9px] sm:text-[10px] lg:text-xs xl:text-sm 2xl:text-base font-sans tracking-widest">
                {spell.combination.map((orb, i) => (
                  <span key={i} className={`
                    ${orb === 'Q' ? 'text-quas' : ''}
                    ${orb === 'W' ? 'text-wex' : ''}
                    ${orb === 'E' ? 'text-exort' : ''}
                  `}>{orb}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
