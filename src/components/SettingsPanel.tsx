import React, { useState, useEffect, useRef } from 'react';
import { useGameStore, defaultKeybinds } from '../store/gameStore';
import type { Keybinds } from '../store/gameStore';
import { playSound, Howler } from '../lib/audio';

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const { keybinds, setKeybinds, volume, setVolume } = useGameStore();
  const [listeningFor, setListeningFor] = useState<keyof Keybinds | null>(null);
  const [pendingKeybind, setPendingKeybind] = useState<string | null>(null);
  const [localKeybinds, setLocalKeybinds] = useState<Keybinds>(keybinds);
  const [localVolume, setLocalVolume] = useState<number>(volume);
  
  // Keep track of the real global volume to revert to if cancelled
  const globalVolumeRef = useRef(volume);
  useEffect(() => {
    globalVolumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    return () => {
      // Always ensure Howler's volume matches the real global volume when unmounting
      Howler.volume(globalVolumeRef.current);
    };
  }, []);

  useEffect(() => {
    if (!listeningFor) {
      setPendingKeybind(null);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === 'Escape') {
        setListeningFor(null);
        return;
      }
      setPendingKeybind(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [listeningFor]);

  const controls: { key: keyof Keybinds; name: string; color: string; img: string }[] = [
    { key: 'Q', name: 'Quas', color: 'text-quas', img: '/asset/icons/QWE/normal orbs/invoker_quas.png' },
    { key: 'W', name: 'Wex', color: 'text-wex', img: '/asset/icons/QWE/normal orbs/invoker_wex.png' },
    { key: 'E', name: 'Exort', color: 'text-exort', img: '/asset/icons/QWE/normal orbs/invoker_exort.png' },
    { key: 'D', name: 'Spell 1', color: 'text-gray-400', img: '/asset/icons/invoke skills/default skills/no-spell.png' },
    { key: 'F', name: 'Spell 2', color: 'text-gray-400', img: '/asset/icons/invoke skills/default skills/no-spell.png' },
    { key: 'R', name: 'Invoke', color: 'text-textGold', img: '/asset/icons/QWE/Invoke_icon.png' },
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="flex flex-col w-[650px] max-w-[95vw] max-h-[95dvh] bg-panel border border-panelBorder rounded-xl p-4 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 overflow-y-auto custom-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative mb-8 mt-2 flex items-center justify-center w-full">
          <h2 className="text-sm tracking-[0.2em] uppercase font-bold font-serif text-textGold">
            Settings
          </h2>
          <div className="absolute right-0 flex items-center gap-3">
            {!(localKeybinds.Q === 'q' && localKeybinds.W === 'w' && localKeybinds.E === 'e' && localKeybinds.D === 'd' && localKeybinds.F === 'f' && localKeybinds.R === 'r') && (
              <button 
                onClick={() => setLocalKeybinds(defaultKeybinds)} 
                className="text-xs uppercase tracking-widest text-textMuted hover:text-red-500 transition-colors font-bold mt-0.5"
                title="Reset to default keybinds"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        
        <div className="flex flex-row flex-wrap justify-center gap-2 sm:gap-4 flex-1">
          {controls.map((ctrl) => (
            <div 
              key={ctrl.key} 
              className="flex flex-col items-center gap-2 sm:gap-3 transition-all duration-200 cursor-pointer hover:bg-white/5 p-2 sm:p-3 rounded-lg"
              onClick={() => setListeningFor(ctrl.key)}
            >
              <div className="w-14 h-14 border border-panelBorder bg-black relative shadow-lg rounded overflow-hidden hover:ring-2 hover:ring-textGold hover:ring-offset-2 hover:ring-offset-panel transition-all">
                <img src={ctrl.img} alt={ctrl.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col items-center gap-1.5 text-sm font-sans tracking-wide">
                <span className="text-white font-bold bg-black/50 px-2.5 py-0.5 rounded border border-panelBorder uppercase inline-block min-w-[32px] text-center">
                  {localKeybinds[ctrl.key]}
                </span> 
                <span className={`text-xs font-bold ${ctrl.color}`}>{ctrl.name}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-panelBorder flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs tracking-widest text-textMuted uppercase font-bold">
              <span>Volume</span>
              <span>{Math.round(localVolume * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="1" step="0.05" 
              value={localVolume} 
              onChange={(e) => {
                const newVol = parseFloat(e.target.value);
                setLocalVolume(newVol);
                Howler.volume(newVol);
              }}
              onPointerUp={() => playSound('invoke')}
              onKeyUp={() => playSound('invoke')}
              className="w-full h-1 bg-black rounded-lg appearance-none cursor-pointer accent-textGold"
            />
          </div>
          
          {(() => {
            const hasChanges = 
              localVolume !== volume ||
              localKeybinds.Q !== keybinds.Q ||
              localKeybinds.W !== keybinds.W ||
              localKeybinds.E !== keybinds.E ||
              localKeybinds.D !== keybinds.D ||
              localKeybinds.F !== keybinds.F ||
              localKeybinds.R !== keybinds.R;

            return (
              <div className="flex gap-4">
                <button 
                  onClick={onClose}
                  className="flex-1 py-2 border border-panelBorder rounded text-xs tracking-wider uppercase font-bold text-textMuted hover:text-white hover:border-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (!hasChanges) return;
                    setKeybinds(localKeybinds);
                    setVolume(localVolume);
                    onClose();
                  }}
                  disabled={!hasChanges}
                  className={`flex-1 py-2 border rounded text-xs tracking-wider uppercase font-bold transition-colors ${hasChanges ? 'bg-textGold text-black border-textGold hover:bg-yellow-500' : 'border-panelBorder/30 text-textMuted/50 cursor-not-allowed'}`}
                >
                  Save
                </button>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Keybind Modal overlay */}
      {listeningFor && (() => {
        const targetCtrl = controls.find(c => c.key === listeningFor);
        const conflictCtrl = controls.find(c => localKeybinds[c.key] === pendingKeybind);
        const hasConflict = conflictCtrl && conflictCtrl.key !== listeningFor;
        const isSame = pendingKeybind === localKeybinds[listeningFor];
        const canApply = pendingKeybind && !isSame;

        const applyKeybind = () => {
          if (canApply && pendingKeybind) {
            setLocalKeybinds({ ...localKeybinds, [listeningFor]: pendingKeybind });
            setListeningFor(null);
          }
        };

        const cancelKeybind = () => {
          setListeningFor(null);
        };

        return (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-panel border border-textGold rounded-xl p-8 flex flex-col items-center shadow-[0_0_50px_rgba(255,215,0,0.15)] animate-in fade-in zoom-in duration-200 min-w-[300px]">
              <h3 className="text-2xl text-white mb-2 font-serif font-bold tracking-wide">Bind Key</h3>
              <p className="text-textMuted mb-6">for <span className="text-textGold font-bold font-serif">{targetCtrl?.name}</span></p>
              
              <div className={`w-16 h-16 flex items-center justify-center border-2 rounded mb-4 text-2xl font-bold uppercase transition-colors ${pendingKeybind ? (hasConflict ? 'border-red-500 text-red-500' : 'border-textGold text-textGold') : 'border-panelBorder text-textMuted bg-black/50'}`}>
                {pendingKeybind || '?'}
              </div>

              <div className="h-6 mb-6 flex items-center justify-center">
                {hasConflict && pendingKeybind && (
                  <span className="text-red-500 text-sm font-bold">Already assigned to {conflictCtrl.name}</span>
                )}
                {!pendingKeybind && (
                  <span className="text-textMuted text-sm animate-pulse">Press any key...</span>
                )}
                {isSame && pendingKeybind && (
                  <span className="text-textMuted text-sm">Same as current keybind</span>
                )}
              </div>

              <div className="flex gap-4 w-full">
                <button 
                  onClick={cancelKeybind}
                  className="flex-1 py-2 border border-panelBorder rounded text-xs tracking-wider uppercase font-bold text-textMuted hover:text-white hover:border-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={applyKeybind}
                  disabled={!canApply}
                  className={`flex-1 py-2 border rounded text-xs tracking-wider uppercase font-bold transition-colors ${canApply ? 'bg-textGold text-black border-textGold hover:bg-yellow-500' : 'border-panelBorder/30 text-textMuted/50 cursor-not-allowed'}`}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
