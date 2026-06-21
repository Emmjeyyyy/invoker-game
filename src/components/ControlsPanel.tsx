import React from 'react';

export const ControlsPanel: React.FC = () => {
  const controls = [
    { key: 'Q', name: 'Quas', color: 'text-quas', img: '/asset/icons/QWE/normal orbs/invoker_quas.png' },
    { key: 'W', name: 'Wex', color: 'text-wex', img: '/asset/icons/QWE/normal orbs/invoker_wex.png' },
    { key: 'E', name: 'Exort', color: 'text-exort', img: '/asset/icons/QWE/normal orbs/invoker_exort.png' },
    { key: 'D', name: 'Spell 1', color: 'text-gray-400', img: '/asset/icons/invoke skills/default skills/no-spell.png' },
    { key: 'F', name: 'Spell 2', color: 'text-gray-400', img: '/asset/icons/invoke skills/default skills/no-spell.png' },
    { key: 'R', name: 'Invoke', color: 'text-textGold', img: '/asset/icons/QWE/Invoke_icon.png' },
  ];

  return (
    <div className="flex flex-col h-full bg-panel border border-panelBorder rounded-xl p-6 shadow-2xl">
      <h2 className="text-center text-sm tracking-[0.2em] uppercase font-bold text-textGold mb-8">
        Controls
      </h2>
      
      <div className="flex flex-col gap-6 flex-1">
        {controls.map((ctrl) => (
          <div key={ctrl.key} className="flex items-center gap-4">
            <div className="w-12 h-12 border border-panelBorder bg-black relative shadow-lg rounded overflow-hidden">
              <img src={ctrl.img} alt={ctrl.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-sm font-sans tracking-wide">
              <span className="text-textMuted mr-2">{ctrl.key} —</span> 
              <span className={ctrl.color}>{ctrl.name}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-panelBorder pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs tracking-widest text-textMuted font-sans">KEYBINDS</h3>
          <button className="text-xs text-textMuted border border-panelBorder px-3 py-1 rounded hover:bg-panelBorder/50 transition-colors">
            Reset
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {['Q', 'W', 'E', 'R'].map(k => (
            <div key={k} className="border border-panelBorder bg-black/40 rounded flex items-center justify-center py-2 font-sans text-sm text-textMuted">
              {k}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
