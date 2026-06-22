import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SettingsPanel } from './components/SettingsPanel';
import { MainPanel } from './components/MainPanel';
import { SpellsPanel } from './components/SpellsPanel';
import { PoseConfig } from './components/PoseConfig';
import { useHotkeys } from 'react-hotkeys-hook';
import { useGameStore } from './store/gameStore';
import { playSound, Howler } from './lib/audio';
import { ModelBackground } from './components/ModelBackground';

function ConfigPage() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 flex">
      {/* Left side: Simulated Screen */}
      <div className="flex-1 h-full p-8 flex items-center justify-center relative">
        <div className="absolute top-8 left-8 flex flex-col gap-1 pointer-events-none">
          <h1 className="text-2xl font-black text-white/10 uppercase tracking-widest">Invoker Lab</h1>
          <p className="text-sm font-medium text-white/5 uppercase tracking-widest">Simulation Environment</p>
        </div>

        <div className="relative w-full max-w-5xl aspect-video bg-black/40 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 ring-1 ring-white/10 backdrop-blur-3xl">
          <ModelBackground />
        </div>
      </div>

      {/* Right side: Configurator */}
      <div className="w-[450px] h-full p-8 pl-0 pb-8 shrink-0">
        <PoseConfig alwaysOpen />
      </div>
    </div>
  );
}

function App() {
  const { addOrb, invoke, cast, isStarted, gameOver, keybinds, volume } = useGameStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  if (window.location.pathname === '/config') {
    return <ConfigPage />;
  }

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
