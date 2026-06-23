import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Orb, Spell } from '../lib/constants';
import { SPELLS, getCombinationId, getRandomSpell } from '../lib/constants';
import { playSound } from '../lib/audio';

const getComboSize = (score: number, mode: string) => {
  if (mode === 'Challenge') {
    if (score >= 50) return Math.random() > 0.5 ? 4 : 5;
    if (score >= 35) return Math.random() > 0.5 ? 3 : 4;
    if (score >= 20) return Math.random() > 0.5 ? 2 : 3;
    if (score >= 10) return Math.random() > 0.5 ? 1 : 2;
    return 1;
  }
  return score >= 30 ? (Math.random() > 0.5 ? 3 : 2) : 1;
};

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
  
  isHeadTrackingEnabled: boolean;
  setHeadTrackingEnabled: (enabled: boolean) => void;
  boneRotations: Record<string, { x: number, y: number, z: number }>;
  pastBoneRotations: Record<string, { x: number, y: number, z: number }>[];
  futureBoneRotations: Record<string, { x: number, y: number, z: number }>[];
  setBoneRotation: (bone: string, axis: 'x' | 'y' | 'z', value: number) => void;
  commitBoneRotations: () => void;
  undoBoneRotations: () => void;
  redoBoneRotations: () => void;
  resetBoneRotations: () => void;
  applyBoneRotations: (rotations: Record<string, { x: number, y: number, z: number }>) => void;

  // Environment & Orb Config
  isFloatingEnabled: boolean;
  setFloatingEnabled: (enabled: boolean) => void;
  isOrbFloatingEnabled: boolean;
  setOrbFloatingEnabled: (enabled: boolean) => void;
  areOrbsEnabled: boolean;
  setOrbsEnabled: (enabled: boolean) => void;
  isModelVisible: boolean;
  setModelVisible: (visible: boolean) => void;
  orbGroupPosition: { x: number, y: number, z: number };
  setOrbGroupPosition: (axis: 'x' | 'y' | 'z', value: number) => void;
  orbMovementPreset: string;
  setOrbMovementPreset: (preset: string) => void;
  orbRadius: number;
  setOrbRadius: (radius: number) => void;
  orbSpeed: number;
  setOrbSpeed: (speed: number) => void;
  modelRotation: { x: number, y: number };
  setModelRotation: (rotation: { x: number, y: number }) => void;
  modelScale: number;
  setModelScale: (scale: number) => void;
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
      pastBoneRotations: [],
      futureBoneRotations: [],
      isFloatingEnabled: true,
      isOrbFloatingEnabled: true,
      areOrbsEnabled: true,
      isModelVisible: true,
      orbGroupPosition: { x: 0, y: 1.8, z: 0 },
      orbMovementPreset: 'orbit_horizontal',
      orbRadius: 1,
      orbSpeed: 1,
      modelRotation: { x: 0, y: 0 },
      modelScale: 4.5,
  
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

  commitBoneRotations: () => set((state) => ({
    pastBoneRotations: [...state.pastBoneRotations, state.boneRotations].slice(-50),
    futureBoneRotations: []
  })),

  undoBoneRotations: () => set((state) => {
    if (state.pastBoneRotations.length === 0) return state;
    const previous = state.pastBoneRotations[state.pastBoneRotations.length - 1];
    const newPast = state.pastBoneRotations.slice(0, -1);
    return {
      pastBoneRotations: newPast,
      futureBoneRotations: [state.boneRotations, ...state.futureBoneRotations],
      boneRotations: previous,
    };
  }),

  redoBoneRotations: () => set((state) => {
    if (state.futureBoneRotations.length === 0) return state;
    const next = state.futureBoneRotations[0];
    const newFuture = state.futureBoneRotations.slice(1);
    return {
      pastBoneRotations: [...state.pastBoneRotations, state.boneRotations],
      futureBoneRotations: newFuture,
      boneRotations: next,
    };
  }),

  resetBoneRotations: () => set((state) => ({
    pastBoneRotations: [...state.pastBoneRotations, state.boneRotations].slice(-50),
    futureBoneRotations: [],
    boneRotations: {}
  })),
  
  applyBoneRotations: (rotations) => set((state) => ({
    pastBoneRotations: [...state.pastBoneRotations, state.boneRotations].slice(-50),
    futureBoneRotations: [],
    boneRotations: rotations
  })),

  setFloatingEnabled: (enabled) => set({ isFloatingEnabled: enabled }),
  setOrbFloatingEnabled: (enabled) => set({ isOrbFloatingEnabled: enabled }),
  setOrbsEnabled: (enabled) => set({ areOrbsEnabled: enabled }),
  setModelVisible: (visible) => set({ isModelVisible: visible }),
  setOrbGroupPosition: (axis, value) => set((state) => ({
    orbGroupPosition: { ...state.orbGroupPosition, [axis]: value }
  })),
  setOrbMovementPreset: (preset) => set({ orbMovementPreset: preset }),
  setOrbRadius: (radius) => set({ orbRadius: radius }),
  setOrbSpeed: (speed) => set({ orbSpeed: speed }),
  setModelRotation: (rotation) => set({ modelRotation: rotation }),
  setModelScale: (scale) => set({ modelScale: scale }),
  
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
          const comboSize = getComboSize(newCount, get().mode);
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
            const comboSize = getComboSize(correctCount, mode);
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
    volume: state.volume,
    isFloatingEnabled: state.isFloatingEnabled,
    isOrbFloatingEnabled: state.isOrbFloatingEnabled,
    areOrbsEnabled: state.areOrbsEnabled,
    isModelVisible: state.isModelVisible,
    orbGroupPosition: state.orbGroupPosition,
    orbMovementPreset: state.orbMovementPreset,
    orbRadius: state.orbRadius,
    orbSpeed: state.orbSpeed,
  })
}));
