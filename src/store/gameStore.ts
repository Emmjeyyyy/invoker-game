import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Orb, Spell } from '../lib/constants';
import { SPELLS, getCombinationId, getRandomSpell } from '../lib/constants';
import { playSound } from '../lib/audio';

type GameMode = 'Classic' | 'Timed' | 'Endless' | 'Practice' | 'Challenge' | 'Sprint' | 'Speedrun';
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
  targetSpells: Spell[];
  slotD: Spell | null;
  slotF: Spell | null;
  mode: GameMode;
  difficulty: Difficulty;
  isStarted: boolean;
  isModelLoaded: boolean;
  keybinds: Keybinds;
  volume: number;
  
  // Stats for the current session
  correctCount: number;
  incorrectCount: number;
  streak: number;
  timeRemaining: number;
  timeElapsed: number; // For Speedrun
  lastReactionTime: number | null; // in seconds
  lives: number;
  gameOver: boolean;
  comboId: number;
  currentComboSize: number;
  
  // Actions
  addOrb: (orb: Orb) => void;
  invoke: () => void;
  cast: (slot: 'D' | 'F') => { success: boolean, castedSpell: Spell | null, time: number };
  failSpell: (changeSpell?: boolean) => void;
  startGame: (mode: GameMode, difficulty: Difficulty) => void;
  endGame: () => void;
  resetOrbs: () => void;
  setTargetSpells: (spells: Spell[]) => void;
  setTimeRemaining: (time: number) => void;
  setTimeElapsed: (time: number) => void;
  setGameOver: (isOver: boolean) => void;
  setKeybind: (key: keyof Keybinds, value: string) => void;
  setKeybinds: (newKeybinds: Keybinds) => void;
  resetKeybinds: () => void;
  setVolume: (volume: number) => void;
  setModelLoaded: (loaded: boolean) => void;
  
  // Custom 3D Model Pose Config
  isHeadTrackingEnabled: boolean;
  setHeadTrackingEnabled: (enabled: boolean) => void;
  boneRotations: Record<string, { x: number, y: number, z: number }>;
  setBoneRotation: (bone: string, axis: 'x' | 'y' | 'z', value: number) => void;
  resetBoneRotations: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentOrbs: [],
      targetSpells: [getRandomSpell()],
      slotD: null,
      slotF: null,
      mode: 'Classic',
      difficulty: 'Beginner',
      isStarted: false,
      isModelLoaded: false,
      keybinds: defaultKeybinds,
      volume: 0.5,
      
      correctCount: 0,
      incorrectCount: 0,
      streak: 0,
      timeRemaining: 0,
      timeElapsed: 0,
      lastReactionTime: null,
      lives: 3,
      gameOver: false,
      comboId: 0,
      currentComboSize: 1,
      isHeadTrackingEnabled: true,
      boneRotations: {},
  
  addOrb: (orb) => set((state) => {
    const newOrbs = [...state.currentOrbs, orb];
    if (newOrbs.length > 3) {
      newOrbs.shift();
    }
    return { currentOrbs: newOrbs };
  }),

  setBoneRotation: (bone, axis, value) => set((state) => ({
    boneRotations: {
      ...state.boneRotations,
      [bone]: {
        ...(state.boneRotations[bone] || { x: 0, y: 0, z: 0 }),
        [axis]: value
      }
    }
  })),

  setHeadTrackingEnabled: (enabled) => set({ isHeadTrackingEnabled: enabled }),

  resetBoneRotations: () => set({ boneRotations: {} }),
  
  invoke: () => {
    const { currentOrbs } = get();
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
    const { slotD, slotF, targetSpells, isStarted } = get();
    if (targetSpells.length === 0) return { success: false, castedSpell: null, time: 0 };
    
    const currentTarget = targetSpells[0];
    const castedSpell = slot === 'D' ? slotD : slotF;
    if (!castedSpell) return { success: false, castedSpell: null, time: 0 };
    
    const isCorrect = castedSpell.id === currentTarget.id;
    const timeTaken = 0;

    if (isStarted) {
      if (isCorrect) {
        const newCount = get().correctCount + 1;
        let newSpells = targetSpells.slice(1);
        
        if (newSpells.length === 0) {
          const comboSize = newCount >= 30 ? (Math.random() > 0.5 ? 3 : 2) : 1;
          let prevName = currentTarget.name;
          for (let i = 0; i < comboSize; i++) {
            const spell = getRandomSpell(prevName);
            newSpells.push(spell);
            prevName = spell.name;
          }
          set((state) => ({
            correctCount: state.correctCount + 1,
            streak: state.streak + 1,
            targetSpells: newSpells,
            comboId: state.comboId + 1,
            currentComboSize: comboSize,
          }));
        } else {
          set((state) => ({
            correctCount: state.correctCount + 1,
            streak: state.streak + 1,
            targetSpells: newSpells,
          }));
        }
        
        // Speedrun win condition
        if (get().mode === 'Speedrun' && get().correctCount === 10) {
          set({ gameOver: true });
        }
      } else {
        set((state) => ({
          incorrectCount: state.incorrectCount + 1,
          streak: 0,
        }));
        if (get().mode === 'Challenge') {
          get().failSpell(false);
        }
      }
    } else if (isCorrect) {
      set(() => ({
        targetSpells: [getRandomSpell(currentTarget.name)],
      }));
    }

    return { success: isCorrect, castedSpell, time: timeTaken };
  },
  
  startGame: (mode, difficulty) => set({
    isStarted: true,
    gameOver: false,
    mode,
    difficulty,
    targetSpells: [getRandomSpell()],
    currentOrbs: [],
    slotD: null,
    slotF: null,
    correctCount: 0,
    incorrectCount: 0,
    streak: 0,
    timeRemaining: mode === 'Sprint' ? 10000 : (mode === 'Timed' ? 60000 : 0),
    timeElapsed: 0,
    lives: mode === 'Challenge' ? 3 : 0,
    comboId: 0,
    currentComboSize: 1,
  }),
  
  endGame: () => set({ isStarted: false, gameOver: false, targetSpells: [getRandomSpell()], currentOrbs: [], slotD: null, slotF: null }),
  
  failSpell: (changeSpell = true) => {
    playSound('lifeLost');
    const { mode, lives, targetSpells, correctCount } = get();
    if (mode === 'Challenge') {
      const newLives = lives - 1;
      if (newLives <= 0) {
        set({ lives: 0, gameOver: true, isStarted: false });
      } else {
        if (changeSpell) {
          let newSpells = targetSpells.slice(1);
          if (newSpells.length === 0) {
            const comboSize = correctCount >= 30 ? (Math.random() > 0.5 ? 3 : 2) : 1;
            let prevName = targetSpells[0]?.name;
            for (let i = 0; i < comboSize; i++) {
              const spell = getRandomSpell(prevName);
              newSpells.push(spell);
              prevName = spell.name;
            }
            set((state) => ({ 
              lives: newLives, 
              targetSpells: newSpells,
              comboId: state.comboId + 1,
              currentComboSize: comboSize
            }));
          } else {
            set({ 
              lives: newLives, 
              targetSpells: newSpells
            });
          }
        } else {
          set({ lives: newLives });
        }
      }
    }
  },
  resetOrbs: () => set({ currentOrbs: [] }),
  setTargetSpells: (spells) => set({ targetSpells: spells }),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setTimeElapsed: (time) => set({ timeElapsed: time }),
  setGameOver: (isOver) => set({ gameOver: isOver }),
  setKeybind: (key, value) => set((state) => ({ keybinds: { ...state.keybinds, [key]: value } })),
  setKeybinds: (newKeybinds) => set({ keybinds: newKeybinds }),
  resetKeybinds: () => set({ keybinds: defaultKeybinds }),
  setVolume: (volume) => set({ volume }),
  setModelLoaded: (loaded) => set({ isModelLoaded: loaded }),
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
