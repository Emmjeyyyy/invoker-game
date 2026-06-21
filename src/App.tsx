import { useState } from 'react';
import { Layout } from './components/Layout';
import { ControlsPanel } from './components/ControlsPanel';
import { MainPanel } from './components/MainPanel';
import { SpellsPanel } from './components/SpellsPanel';
import { useHotkeys } from 'react-hotkeys-hook';
import { useGameStore } from './store/gameStore';
import { playSound } from './lib/audio';

function App() {
  const { addOrb, invoke, cast, isStarted, startGame } = useGameStore();

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

  useHotkeys('q', () => handleOrb('Q'), [isStarted, addOrb]);
  useHotkeys('w', () => handleOrb('W'), [isStarted, addOrb]);
  useHotkeys('e', () => handleOrb('E'), [isStarted, addOrb]);
  
  useHotkeys('d', () => handleCast('D'), [isStarted, cast]);
  useHotkeys('f', () => handleCast('F'), [isStarted, cast]);
  
  useHotkeys('r', () => {
    playSound('invoke');
    invoke();
  }, [isStarted, invoke]);

  return (
    <Layout>
      <ControlsPanel />
      <div className="relative">
        <MainPanel />
      </div>
      <SpellsPanel />
    </Layout>
  );
}

export default App;
