import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const ActionBar: React.FC = () => {
  const { keybinds, slotD, slotF } = useGameStore();

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 2xl:gap-6 px-2">
      {[
        { key: 'Q', displayKey: keybinds.Q.toUpperCase(), img: '/asset/icons/QWE/normal orbs/invoker_quas.png' },
        { key: 'W', displayKey: keybinds.W.toUpperCase(), img: '/asset/icons/QWE/normal orbs/invoker_wex.png' },
        { key: 'E', displayKey: keybinds.E.toUpperCase(), img: '/asset/icons/QWE/normal orbs/invoker_exort.png' },
        { key: 'D', displayKey: keybinds.D.toUpperCase(), img: slotD?.iconPath || '/asset/icons/invoke skills/default skills/no-spell.png' },
        { key: 'F', displayKey: keybinds.F.toUpperCase(), img: slotF?.iconPath || '/asset/icons/invoke skills/default skills/no-spell.png' },
        { key: 'R', displayKey: keybinds.R.toUpperCase(), img: '/asset/icons/QWE/Invoke_icon.png' },
      ].map((btn) => (
        <div key={btn.key} className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 2xl:w-24 2xl:h-24 shrink-0 bg-black relative shadow-xl border-2 border-t-gray-400 border-l-gray-400 border-b-gray-800 border-r-gray-800 ring-1 ring-black">
          <img src={btn.img} alt={btn.key} className="w-full h-full object-cover" />
          <span className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-6 lg:h-6 2xl:w-8 2xl:h-8 flex items-center justify-center bg-black border border-panelBorder rounded-sm text-[9px] sm:text-[11px] lg:text-sm 2xl:text-base font-serif text-white font-bold text-shadow-glow z-10">{btn.displayKey}</span>
        </div>
      ))}
    </div>
  );
};
