import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Orb, Spell } from '../lib/constants';
import { SPELLS, getCombinationId, getRandomSpell } from '../lib/constants';

type GameMode = 'Classic' | 'Timed' | 'Endless' | 'Practice';
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';

export type Keybinds = {
  Q: string;
  W: string;
  E: string;
  D: string;
  F: string;
  R: string;
};

export const defaultKeybinds: Keybinds = { Q: 'q', W: 'w', E: 'e', D: 'd', F: 'f', R: 'r' };

interface GameState {
  currentOrbs: Orb[];
  targetSpell: Spell | null;
  slotD: Spell | null;
  slotF: Spell | null;
  mode: GameMode;
  difficulty: Difficulty;
  isStarted: boolean;
  keybinds: Keybinds;
  volume: number;
  
  // Stats for the current session
  correctCount: number;
  incorrectCount: number;
  streak: number;
  timeRemaining: number;
  lastReactionTime: number | null; // in seconds
  
  // Actions
  addOrb: (orb: Orb) => void;
  invoke: () => void;
  cast: (slot: 'D' | 'F') => { success: boolean, castedSpell: Spell | null, time: number };
  startGame: (mode: GameMode, difficulty: Difficulty) => void;
  endGame: () => void;
  resetOrbs: () => void;
  setTargetSpell: (spell: Spell) => void;
  setKeybind: (key: keyof Keybinds, value: string) => void;
  setKeybinds: (newKeybinds: Keybinds) => void;
  resetKeybinds: () => void;
  setVolume: (volume: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentOrbs: [],
      targetSpell: getRandomSpell(),
      slotD: null,
      slotF: null,
      mode: 'Classic',
      difficulty: 'Beginner',
      isStarted: false,
      keybinds: defaultKeybinds,
      volume: 0.5,
      
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
    const { currentOrbs, slotD, slotF } = get();
    if (currentOrbs.length < 3) return; // Need 3 orbs to invoke
    
    const invokedId = getCombinationId(currentOrbs);
    const invokedSpell = SPELLS.find(s => s.id === invokedId) || null;
    
    if (invokedSpell) {
      set((state) => {
        if (state.slotD?.id === invokedSpell.id) {
          return {};
        } else if (state.slotF?.id === invokedSpell.id) {
          return { slotD: state.slotF, slotF: state.slotD };
        } else {
          return { slotD: invokedSpell, slotF: state.slotD };
        }
      });
    }
  },

  cast: (slot) => {
    const { slotD, slotF, targetSpell, isStarted } = get();
    if (!targetSpell) return { success: false, castedSpell: null, time: 0 };
    
    const castedSpell = slot === 'D' ? slotD : slotF;
    if (!castedSpell) return { success: false, castedSpell: null, time: 0 };
    
    const isCorrect = castedSpell.id === targetSpell.id;
    const timeTaken = 0; // Placeholder for actual time calculation

    if (isStarted) {
      set((state) => ({
        correctCount: isCorrect ? state.correctCount + 1 : state.correctCount,
        incorrectCount: !isCorrect ? state.incorrectCount + 1 : state.incorrectCount,
        streak: isCorrect ? state.streak + 1 : 0,
        targetSpell: isCorrect ? getRandomSpell(targetSpell.name) : state.targetSpell,
      }));
    } else if (isCorrect) {
      // In practice mode, just load the next spell if they get it right, no stats
      set((state) => ({
        targetSpell: getRandomSpell(targetSpell.name),
      }));
    }

    return { success: isCorrect, castedSpell, time: timeTaken };
  },
  
  startGame: (mode, difficulty) => set({
    isStarted: true,
    mode,
    difficulty,
    targetSpell: getRandomSpell(),
    currentOrbs: [],
    slotD: null,
    slotF: null,
    correctCount: 0,
    incorrectCount: 0,
    streak: 0,
    timeRemaining: mode === 'Timed' ? 60 : 0,
  }),
  
  endGame: () => set({ isStarted: false, targetSpell: getRandomSpell(), currentOrbs: [], slotD: null, slotF: null }),
  resetOrbs: () => set({ currentOrbs: [] }),
  setTargetSpell: (spell) => set({ targetSpell: spell }),
  setKeybind: (key, value) => set((state) => ({ keybinds: { ...state.keybinds, [key]: value } })),
  setKeybinds: (newKeybinds) => set({ keybinds: newKeybinds }),
  resetKeybinds: () => set({ keybinds: defaultKeybinds }),
  setVolume: (volume) => set({ volume }),
}),
{
  name: 'invoker-game-storage',
  partialize: (state) => ({ 
    correctCount: state.correctCount, 
    incorrectCount: state.incorrectCount,
    streak: state.streak,
    keybinds: state.keybinds,
    volume: state.volume
  })
}));
