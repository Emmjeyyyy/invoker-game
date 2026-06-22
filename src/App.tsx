import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SettingsPanel } from './components/SettingsPanel';
import { MainPanel } from './components/MainPanel';
import { SpellsPanel } from './components/SpellsPanel';
import { useHotkeys } from 'react-hotkeys-hook';
import { useGameStore } from './store/gameStore';
import { playSound, playClick, Howler } from './lib/audio';

function App() {
  const { addOrb, invoke, cast, isStarted, gameOver, startGame, keybinds, volume } = useGameStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const isGameActive = isStarted && !gameOver && !isSettingsOpen;

  useEffect(() => {
    Howler.volume(volume);
  }, [volume]);

  const handleOrb = (orb: 'Q' | 'W' | 'E') => {
    playSound(orb.toLowerCase() as any);
    addOrb(orb);
  };

  const handleCast = (slot: 'D' | 'F') => {
    const result = cast(slot);
    
    if (result.success) {
      playSound('success');
    } else {
      playSound('error');
    }
  };

  const canPressOrbs = !isSettingsOpen;

  useHotkeys(keybinds.Q, () => handleOrb('Q'), { enabled: canPressOrbs }, [canPressOrbs, addOrb, keybinds.Q]);
  useHotkeys(keybinds.W, () => handleOrb('W'), { enabled: canPressOrbs }, [canPressOrbs, addOrb, keybinds.W]);
  useHotkeys(keybinds.E, () => handleOrb('E'), { enabled: canPressOrbs }, [canPressOrbs, addOrb, keybinds.E]);
  
  useHotkeys(keybinds.D, () => handleCast('D'), { enabled: isGameActive }, [isGameActive, cast, keybinds.D]);
  useHotkeys(keybinds.F, () => handleCast('F'), { enabled: isGameActive }, [isGameActive, cast, keybinds.F]);
  
  useHotkeys(keybinds.R, () => {
    playSound('invoke');
    invoke();
  }, { enabled: isGameActive }, [isGameActive, invoke, keybinds.R]);

  return (
    <Layout isMenu={!isStarted && !gameOver}>
      {isStarted && <SpellsPanel />}
      <div className="relative h-full flex-1 flex flex-col justify-center min-w-0">
        <MainPanel onOpenSettings={() => setIsSettingsOpen(true)} />
      </div>
      {isSettingsOpen && <SettingsPanel onClose={() => setIsSettingsOpen(false)} />}
    </Layout>
  );
}

export default App;
