import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Howler } from '../lib/audio';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface MainPanelProps {
  onOpenSettings: () => void;
}

export const MainPanel: React.FC<MainPanelProps> = ({ onOpenSettings }) => {
  const { isStarted, startGame, endGame, targetSpells, currentOrbs, slotD, slotF, keybinds, mode, lives, gameOver, failSpell, correctCount, difficulty, comboId, currentComboSize } = useGameStore();
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Base timer per spell decreases by 150ms every 10 points
  const baseTimePerSpell = Math.max(1000, 3000 - Math.floor(correctCount / 10) * 150);
  
  // Total time for the combo. Multi-spell combos get a slightly tighter timer to maintain the challenge.
  const maxTime = Math.floor(baseTimePerSpell * currentComboSize * (currentComboSize > 1 ? 0.9 : 1));
  
  const [timer, setTimer] = useState(maxTime);

  useEffect(() => {
    if (isStarted && mode === 'Challenge' && !gameOver) {
      setTimer(maxTime);
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 50) return 0;
          return prev - 50;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isStarted, mode, gameOver, comboId, maxTime]);

  useEffect(() => {
    if (timer === 0 && isStarted && mode === 'Challenge' && !gameOver) {
      failSpell();
    }
  }, [timer, isStarted, mode, gameOver, failSpell]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    Howler.mute(nextMuted);
    setIsMuted(nextMuted);
  };

  const getOrbImage = (orb: string) => {
    switch (orb) {
      case 'Q': return '/asset/icons/QWE/normal orbs/invoker_quas.png';
      case 'W': return '/asset/icons/QWE/normal orbs/invoker_wex.png';
      case 'E': return '/asset/icons/QWE/normal orbs/invoker_exort.png';
      default: return '';
    }
  };

  const displayOrbs: Array<'Q' | 'W' | 'E' | ''> = [...currentOrbs];
  while (displayOrbs.length < 3) displayOrbs.push('');

  return (
    <div className="flex flex-col flex-1 min-h-0 justify-center bg-panel border border-panelBorder rounded-xl p-4 sm:p-8 shadow-2xl items-center relative w-full overflow-y-auto custom-scrollbar">
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-2 sm:gap-3 z-10 bg-panel/80 p-2 rounded-xl backdrop-blur-sm">
        {isStarted && (
          <button
            onClick={endGame}
            className="text-textMuted hover:text-white transition-colors focus:outline-none"
            title="Restart Game"
          >
            <RotateCcw size={20} />
          </button>
        )}
        <button
          onClick={toggleMute}
          className="text-textMuted hover:text-white transition-colors focus:outline-none"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button
          onClick={onOpenSettings}
          className="text-textMuted hover:text-white transition-colors focus:outline-none"
          title="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
          </svg>
        </button>
      </div>

      {gameOver ? (
        <div className="flex flex-col items-center justify-center w-full h-full flex-1">
          <h2 className="text-4xl sm:text-6xl text-red-500 font-bold mb-4 tracking-widest drop-shadow-[0_0_5px_rgba(239,68,68,0.4)]">GAME OVER</h2>
          <p className="text-xl sm:text-3xl text-textMuted mb-12">Spells Cast: <span className="text-white font-bold">{correctCount}</span></p>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <button
              onClick={() => startGame('Challenge', difficulty)}
              className="px-8 py-4 border border-red-900/50 rounded-xl hover:bg-red-900/20 transition-all text-xl sm:text-2xl tracking-wider text-red-400 hover:text-red-300"
            >
              Play Again
            </button>
            <button
              onClick={endGame}
              className="px-8 py-4 border border-panelBorder rounded-xl hover:bg-panelBorder/30 transition-all text-xl sm:text-2xl tracking-wider hover:text-white"
            >
              Back to Menu
            </button>
          </div>
        </div>
      ) : !isStarted ? (
        <div className="flex flex-col items-center justify-center w-full h-full flex-1 mt-8">
          <h1 className="text-5xl lg:text-7xl font-serif text-textGold mb-12 tracking-widest text-shadow-glow">INVOKER GAME</h1>
          <div className="flex flex-col gap-6 w-full max-w-md">
            <button
              onClick={() => startGame('Practice', 'Beginner')}
              className="px-8 py-6 border border-panelBorder rounded-xl hover:bg-panelBorder/30 transition-all group flex flex-col items-center"
            >
              <span className="text-2xl tracking-wider group-hover:text-white transition-colors">Practice Mode</span>
            </button>
            <button
              onClick={() => startGame('Challenge', 'Beginner')}
              className="px-8 py-6 border border-red-900/50 rounded-xl hover:bg-red-900/20 transition-all group flex flex-col items-center"
            >
              <span className="text-2xl tracking-wider text-red-400 group-hover:text-red-300 transition-colors">Challenge Mode</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {mode === 'Challenge' && (
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex items-center gap-4 z-10 bg-black/40 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-panelBorder backdrop-blur-sm">
              <div className="flex gap-1 sm:gap-2">
                {[...Array(3)].map((_, i) => (
                  <img
                    key={i}
                    src="/asset/icons/Invoker_minimap_icon.webp"
                    alt="Life"
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-panelBorder transition-all duration-300 ${i < lives ? 'opacity-100 shadow-[0_0_8px_rgba(255,0,0,0.5)]' : 'opacity-20 grayscale brightness-50'}`}
                  />
                ))}
              </div>
              <div className="h-6 sm:h-8 w-px bg-panelBorder/50"></div>
              <div className="text-sm sm:text-xl font-serif text-textMuted font-bold tracking-wider">
                SCORE: <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{correctCount}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center justify-center w-full mb-6 sm:mb-12 mt-8 sm:mt-0">
            <div className="flex flex-col items-center w-full justify-center">
              {/* Active Spell Challenge */}
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
            </div>
          </div>

          {/* Orb Tracker */}
          <div className="flex gap-4 sm:gap-6 lg:gap-8 2xl:gap-12 mt-2 mb-6 sm:mb-8 2xl:mb-16">
            {displayOrbs.map((orb, idx) => (
              <div key={idx} className={`w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 2xl:w-32 2xl:h-32 rounded-full border-2 bg-black/30 flex items-center justify-center relative overflow-hidden shrink-0 ${orb ? 'border-transparent' : 'border-panelBorder'}`}>
                <AnimatePresence mode="popLayout">
                  {orb && (
                    <motion.img
                      key={`${orb}-${idx}`}
                      src={getOrbImage(orb)}
                      alt={orb}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute inset-0 w-full h-full object-cover rounded-full shadow-lg shadow-black/50"
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Action Bar */}
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

        </>
      )}
    </div>
  );
};
