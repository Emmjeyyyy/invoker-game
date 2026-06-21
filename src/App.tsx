import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SettingsPanel } from './components/SettingsPanel';
import { MainPanel } from './components/MainPanel';
import { SpellsPanel } from './components/SpellsPanel';
import { useHotkeys } from 'react-hotkeys-hook';
import { useGameStore } from './store/gameStore';
import { playSound, Howler } from './lib/audio';

function App() {
  const { addOrb, invoke, cast, isStarted, startGame, keybinds, volume } = useGameStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  useHotkeys(keybinds.Q, () => handleOrb('Q'), { enabled: !isSettingsOpen }, [isStarted, addOrb, keybinds.Q, isSettingsOpen]);
  useHotkeys(keybinds.W, () => handleOrb('W'), { enabled: !isSettingsOpen }, [isStarted, addOrb, keybinds.W, isSettingsOpen]);
  useHotkeys(keybinds.E, () => handleOrb('E'), { enabled: !isSettingsOpen }, [isStarted, addOrb, keybinds.E, isSettingsOpen]);
  
  useHotkeys(keybinds.D, () => handleCast('D'), { enabled: !isSettingsOpen }, [isStarted, cast, keybinds.D, isSettingsOpen]);
  useHotkeys(keybinds.F, () => handleCast('F'), { enabled: !isSettingsOpen }, [isStarted, cast, keybinds.F, isSettingsOpen]);
  
  useHotkeys(keybinds.R, () => {
    playSound('invoke');
    invoke();
  }, { enabled: !isSettingsOpen }, [isStarted, invoke, keybinds.R, isSettingsOpen]);

  return (
    <Layout>
      <SpellsPanel />
      <div className="relative h-full flex flex-col justify-center">
        <MainPanel onOpenSettings={() => setIsSettingsOpen(true)} />
      </div>
      {isSettingsOpen && <SettingsPanel onClose={() => setIsSettingsOpen(false)} />}
    </Layout>
  );
}

export default App;
