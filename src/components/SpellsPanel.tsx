import React from 'react';
import { SPELLS } from '../lib/constants';

export const SpellsPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-panel border border-panelBorder rounded-xl p-6 shadow-2xl overflow-hidden">
      <h2 className="text-center text-sm tracking-[0.2em] uppercase font-bold text-textGold mb-8">
        Spells
      </h2>
      
      <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {SPELLS.map((spell) => (
          <div key={spell.id} className="flex items-center gap-4 group cursor-pointer hover:bg-panelBorder/30 p-2 rounded transition-colors">
            <div className="w-12 h-12 bg-black/50 border border-panelBorder rounded flex items-center justify-center overflow-hidden shrink-0">
               <img src={spell.iconPath} alt={spell.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/asset/icons/invoke skills/default skills/no-spell.png'; }} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-sans text-white group-hover:text-textGold transition-colors">{spell.name}</span>
              <div className="flex gap-1 mt-1 text-xs font-sans tracking-widest">
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
