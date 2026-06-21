import React from 'react';
import { SPELLS } from '../lib/constants';

export const SpellsPanel: React.FC = () => {
  return (
    <div className="flex flex-col lg:h-full bg-panel border border-panelBorder rounded-xl p-2 sm:p-3 lg:p-6 2xl:p-8 shadow-2xl overflow-hidden shrink-0 lg:shrink">
      <h2 className="hidden lg:block text-center text-sm lg:text-base 2xl:text-xl tracking-[0.2em] uppercase font-bold text-textGold mb-4 lg:mb-6 2xl:mb-8 shrink-0">
        Spells
      </h2>
      
      <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto pb-2 lg:pb-0 pr-0 lg:pr-2 2xl:pr-4 gap-2 lg:gap-1 2xl:gap-3 custom-scrollbar items-start lg:items-stretch">
        {SPELLS.map((spell) => (
          <div key={spell.id} className="flex flex-col lg:flex-row items-center gap-1 lg:gap-3 2xl:gap-4 group cursor-pointer hover:bg-panelBorder/30 p-2 lg:p-1.5 2xl:p-2 rounded transition-colors min-w-[70px] lg:min-w-0 shrink-0">
            <div className="w-10 h-10 lg:w-10 lg:h-10 2xl:w-14 2xl:h-14 bg-black/50 border border-panelBorder rounded flex items-center justify-center overflow-hidden shrink-0">
               <img src={spell.iconPath} alt={spell.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/asset/icons/invoke skills/default skills/no-spell.png'; }} />
            </div>
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <span className="text-[10px] sm:text-xs lg:text-sm 2xl:text-base font-sans text-white group-hover:text-textGold transition-colors leading-tight whitespace-nowrap">{spell.name}</span>
              <div className="flex gap-0.5 lg:gap-1 2xl:gap-1.5 mt-0.5 2xl:mt-1 text-[9px] sm:text-[10px] lg:text-xs 2xl:text-sm font-sans tracking-widest">
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
