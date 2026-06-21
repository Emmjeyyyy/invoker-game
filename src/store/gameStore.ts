import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Orb, Spell } from '../lib/constants';
import { SPELLS, getCombinationId, getRandomSpell } from '../lib/constants';

type GameMode = 'Classic' | 'Timed' | 'Endless' | 'Practice';
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';

interface GameState {
  currentOrbs: Orb[];
  targetSpell: Spell | null;
  mode: GameMode;
  difficulty: Difficulty;
  isStarted: boolean;
  
  // Stats for the current session
  correctCount: number;
  incorrectCount: number;
  streak: number;
  timeRemaining: number;
  lastReactionTime: number | null; // in seconds
  
  // Actions
  addOrb: (orb: Orb) => void;
  invoke: () => { success: boolean, invokedSpell: Spell | null, time: number };
  startGame: (mode: GameMode, difficulty: Difficulty) => void;
  endGame: () => void;
  resetOrbs: () => void;
  setTargetSpell: (spell: Spell) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentOrbs: [],
      targetSpell: null,
      mode: 'Classic',
      difficulty: 'Beginner',
      isStarted: false,
      
      correctCount: 0,
      incorrectCount: 0,
      streak: 0,
      timeRemaining: 60,
      lastReactionTime: null,
  
  addOrb: (orb) => set((state) => {
    const newOrbs = [...state.currentOrbs, orb];
    if (newOrbs.length > 3) {
      newOrbs.shift();
    }
    return { currentOrbs: newOrbs };
  }),
  
  invoke: () => {
    const { currentOrbs, targetSpell } = get();
    if (!targetSpell) return { success: false, invokedSpell: null, time: 0 };
    
    const invokedId = getCombinationId(currentOrbs);
    const invokedSpell = SPELLS.find(s => s.id === invokedId) || null;
    
    const isCorrect = invokedId === targetSpell.id;
    const timeTaken = 0; // Will be calculated based on timestamp from component

    set((state) => ({
      correctCount: isCorrect ? state.correctCount + 1 : state.correctCount,
      incorrectCount: !isCorrect ? state.incorrectCount + 1 : state.incorrectCount,
      streak: isCorrect ? state.streak + 1 : 0,
      targetSpell: isCorrect ? getRandomSpell(targetSpell.name) : state.targetSpell,
    }));

    return { success: isCorrect, invokedSpell, time: timeTaken };
  },
  
  startGame: (mode, difficulty) => set({
    isStarted: true,
    mode,
    difficulty,
    targetSpell: getRandomSpell(),
    currentOrbs: [],
    correctCount: 0,
    incorrectCount: 0,
    streak: 0,
    timeRemaining: mode === 'Timed' ? 60 : 0,
  }),
  
  endGame: () => set({ isStarted: false, targetSpell: null, currentOrbs: [] }),
  resetOrbs: () => set({ currentOrbs: [] }),
  setTargetSpell: (spell) => set({ targetSpell: spell }),
}),
{
  name: 'invoker-game-storage',
  partialize: (state) => ({ 
    correctCount: state.correctCount, 
    incorrectCount: state.incorrectCount,
    streak: state.streak 
  })
}));
