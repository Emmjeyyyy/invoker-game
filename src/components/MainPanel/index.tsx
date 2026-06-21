import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { Howler } from '../../lib/audio';

import { HeaderControls } from './HeaderControls';
import { GameOver } from './GameOver';
import { MainMenu } from './MainMenu';
import { GameInfo } from './GameInfo';
import { ActiveSpellChallenge } from './ActiveSpellChallenge';
import { OrbTrackerDisplay } from './OrbTrackerDisplay';
import { ActionBar } from './ActionBar';
import { ModelBackground } from '../ModelBackground';

interface MainPanelProps {
  onOpenSettings: () => void;
}

export const MainPanel: React.FC<MainPanelProps> = ({ onOpenSettings }) => {
  const { isStarted, mode, gameOver, failSpell, correctCount, difficulty, comboId, currentComboSize, endGame } = useGameStore();
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showDifficultySelect, setShowDifficultySelect] = useState<boolean>(false);

  // Determine timer parameters based on difficulty
  let initialTime = 3000;
  let decreaseRate = 150;
  let minTime = 1000;

  if (difficulty === 'Beginner') { // Easy
    initialTime = 4500;
    decreaseRate = 100;
    minTime = 1500;
  } else if (difficulty === 'Advanced') { // Hard
    initialTime = 2000;
    decreaseRate = 200;
    minTime = 600;
  }

  // Base timer per spell
  const baseTimePerSpell = Math.max(minTime, initialTime - Math.floor(correctCount / 10) * decreaseRate);
  
  // Total time for the combo. Apply a severe percentage reduction for multi-spell combos
  // so each additional spell effectively only adds a fraction (roughly ~1s at start) of the base time.
  const comboMultiplier = currentComboSize === 1 ? 1 : currentComboSize === 2 ? 0.65 : 0.55;
  const maxTime = Math.floor(baseTimePerSpell * currentComboSize * comboMultiplier);
  
  const [timer, setTimer] = useState(maxTime);

  useEffect(() => {
    if (isStarted && mode === 'Challenge' && !gameOver) {
      setTimer(maxTime);
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 50) {
            clearInterval(interval);
            failSpell();
            return 0;
          }
          return prev - 50;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isStarted, mode, gameOver, comboId, maxTime, failSpell]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    Howler.mute(nextMuted);
    setIsMuted(nextMuted);
  };

  return (
    <div className={`flex flex-col flex-1 min-h-0 justify-center items-center relative isolate w-full overflow-y-auto custom-scrollbar ${(!isStarted && !gameOver) ? 'bg-transparent' : 'bg-panel border border-panelBorder rounded-xl p-4 sm:p-8 shadow-2xl'}`}>
      {(!isStarted && !gameOver) && <ModelBackground />}
      <HeaderControls onOpenSettings={onOpenSettings} isMuted={isMuted} toggleMute={toggleMute} />
      
      {!isStarted && !gameOver ? (
        <MainMenu showDifficultySelect={showDifficultySelect} setShowDifficultySelect={setShowDifficultySelect} />
      ) : (
        <>
          <GameInfo />

          <div className="flex flex-col items-center justify-center w-full mb-6 sm:mb-12 mt-8 sm:mt-0">
            <div className="flex flex-col items-center w-full justify-center">
              <ActiveSpellChallenge timer={timer} maxTime={maxTime} />
            </div>
          </div>

          <OrbTrackerDisplay />
          <ActionBar />

          {!gameOver && (
            <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-10">
              <button
                onClick={endGame}
                className="relative flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl transition-all duration-200 bg-linear-to-b from-red-700 via-red-800 to-red-950 border border-red-400/40 border-b-4 border-b-[rgb(60,0,0)] shadow-[inset_0_2px_10px_rgba(255,255,255,0.2),0_5px_10px_rgba(0,0,0,0.6)] hover:brightness-110 hover:shadow-[inset_0_2px_10px_rgba(255,255,255,0.3),0_8px_15px_rgba(220,38,38,0.4)] active:translate-y-[2px] active:border-b-2 active:shadow-[inset_0_4px_10px_rgba(0,0,0,0.4),0_2px_5px_rgba(0,0,0,0.6)]"
                title="Quit Game"
              >
                <LogOut size={18} className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" />
                <span className="text-sm sm:text-base font-bold tracking-wider text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">QUIT GAME</span>
              </button>
            </div>
          )}

          {gameOver && <GameOver />}
        </>
      )}
    </div>
  );
};
