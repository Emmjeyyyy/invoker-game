import { useState } from 'react';
import { Layout } from './components/Layout';
import { ControlsPanel } from './components/ControlsPanel';
import { MainPanel } from './components/MainPanel';
import { SpellsPanel } from './components/SpellsPanel';
import { useHotkeys } from 'react-hotkeys-hook';
import { useGameStore } from './store/gameStore';
import { playSound } from './lib/audio';

function App() {
  const { addOrb, invoke, isStarted, startGame } = useGameStore();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', time: number } | null>(null);

  const handleOrb = (orb: 'Q' | 'W' | 'E') => {
    if (!isStarted) return;
    playSound(orb.toLowerCase() as any);
    addOrb(orb);
  };

  useHotkeys('enter', () => { if(!isStarted) startGame('Classic', 'Beginner'); }, [isStarted, startGame]);
  useHotkeys('q', () => handleOrb('Q'), [isStarted, addOrb]);
  useHotkeys('w', () => handleOrb('W'), [isStarted, addOrb]);
  useHotkeys('e', () => handleOrb('E'), [isStarted, addOrb]);
  
  useHotkeys('r', () => {
    if(isStarted) {
      playSound('invoke');
      const result = invoke();
      
      if (result.success) {
        playSound('success');
        setFeedback({ type: 'success', time: result.time });
      } else {
        playSound('error');
        setFeedback({ type: 'error', time: result.time });
      }
      
      setTimeout(() => setFeedback(null), 500);
    }
  }, [isStarted, invoke]);

  return (
    <Layout>
      <ControlsPanel />
      <div className="relative">
        <MainPanel />
        {feedback && (
          <div className={`absolute bottom-[20%] left-1/2 transform -translate-x-1/2 text-2xl font-bold px-8 py-4 rounded-xl backdrop-blur-md border z-50
            ${feedback.type === 'success' ? 'text-green-400 bg-green-900/40 border-green-500/50' : 'text-red-400 bg-red-900/40 border-red-500/50'}
          `}>
            {feedback.type === 'success' ? 'Perfect!' : 'Miss!'}
          </div>
        )}
      </div>
      <SpellsPanel />
    </Layout>
  );
}

export default App;
