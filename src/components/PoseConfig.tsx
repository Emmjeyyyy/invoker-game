import React, { useState } from 'react';
import { SlidersHorizontal, X, RotateCcw, Plus, Minus, Copy, Check, ChevronDown, ChevronUp, Undo, Redo } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const BONES = [
  { id: 'Spine_1_011', label: 'Spine' },
  { id: 'Head_0_026', label: 'Head' },
  { id: 'bicep_L_029', label: 'Left Arm' },
  { id: 'elbow_L_030', label: 'Left Forearm' },
  { id: 'wrist_L_031', label: 'Left Wrist' },
  { id: 'thumb_0_L_038', label: 'L Thumb 1' },
  { id: 'thumb_1_L_039', label: 'L Thumb 2' },
  { id: 'index_0_L_036', label: 'L Index 1' },
  { id: 'index_1_L_037', label: 'L Index 2' },
  { id: 'mid_0_L_040', label: 'L Middle 1' },
  { id: 'mid_1_L_041', label: 'L Middle 2' },
  { id: 'ring_0_L_032', label: 'L Ring 1' },
  { id: 'ring_1_L_033', label: 'L Ring 2' },
  { id: 'pinky_0_L_034', label: 'L Pinky 1' },
  { id: 'pinky_1_L_035', label: 'L Pinky 2' },
  { id: 'bicep_R_013', label: 'Right Arm' },
  { id: 'elbow_R_014', label: 'Right Forearm' },
  { id: 'wrist_R_015', label: 'Right Wrist' },
  { id: 'thumb_0_R_018', label: 'R Thumb 1' },
  { id: 'thumb_1_R_019', label: 'R Thumb 2' },
  { id: 'index_0_R_022', label: 'R Index 1' },
  { id: 'index_1_R_023', label: 'R Index 2' },
  { id: 'mid_0_R_016', label: 'R Middle 1' },
  { id: 'mid_1_R_017', label: 'R Middle 2' },
  { id: 'ring_0_R_024', label: 'R Ring 1' },
  { id: 'ring_1_R_025', label: 'R Ring 2' },
  { id: 'pinky_0_R_020', label: 'R Pinky 1' },
  { id: 'pinky_1_R_021', label: 'R Pinky 2' },
];

const BONE_GROUPS = [
  { name: 'Core & Head', bones: BONES.slice(0, 2) },
  { name: 'Left Arm & Hand', bones: BONES.slice(2, 5) },
  { name: 'Left Fingers', bones: BONES.slice(5, 15) },
  { name: 'Right Arm & Hand', bones: BONES.slice(15, 18) },
  { name: 'Right Fingers', bones: BONES.slice(18, 28) }
];

const BASE_OFFSETS: Record<string, { x: number, y: number, z: number }> = {
  'Head_0_026': { x: -0.05, y: 0.15, z: 0 },
  'bicep_L_029': { x: -0.65, y: 0, z: 0 },
  'bicep_R_013': { x: -0.65, y: 0, z: 0 },
  'wrist_L_031': { x: -0.4, y: 0, z: 0 },
  'wrist_R_015': { x: -0.4, y: 0, z: 0 },
};

const PRAYING_POSE: Record<string, { x: number, y: number, z: number }> = {
  'bicep_L_029': { x: -0.80, y: -0.30, z: -0.40 },
  'elbow_L_030': { x: -0.50, y: 1.50, z: -0.20 },
  'wrist_L_031': { x: 0.60, y: 0.20, z: -0.30 },
  'bicep_R_013': { x: -0.80, y: 0.30, z: 0.40 },
  'elbow_R_014': { x: -0.50, y: -1.50, z: 0.20 },
  'wrist_R_015': { x: 0.60, y: -0.20, z: 0.30 },
};

const AXES = ['x', 'y', 'z'] as const;

const BoneGroupSection = ({ 
  group, boneRotations, setBoneRotation, setActivePreset, commitBoneRotations 
}: { 
  group: typeof BONE_GROUPS[0], 
  boneRotations: Record<string, { x: number, y: number, z: number }>, 
  setBoneRotation: (bone: string, axis: 'x' | 'y' | 'z', value: number) => void,
  setActivePreset: (preset: string) => void,
  commitBoneRotations: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white/5 rounded-lg border border-white/5 shadow-inner overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-white/10 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-200">{group.name}</span>
        {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      
      {isOpen && (
        <div className="p-3 space-y-6 border-t border-white/5 bg-black/10">
          {group.bones.map((bone) => (
            <div key={bone.id} className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{bone.label}</h3>
              {AXES.map((axis) => {
                const baseOffset = BASE_OFFSETS[bone.id]?.[axis] || 0;
                const configVal = boneRotations[bone.id]?.[axis] || 0;
                const displayVal = configVal + baseOffset;
                
                return (
                  <div key={`${bone.id}-${axis}`} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase w-4">{axis}</span>
                    <button
                      onClick={() => {
                        commitBoneRotations();
                        setBoneRotation(bone.id, axis, Math.max(-3.14 - baseOffset, configVal - 0.01));
                        setActivePreset('custom');
                      }}
                      className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="range"
                      min="-3.14"
                      max="3.14"
                      step="0.01"
                      value={displayVal}
                      onPointerDown={() => commitBoneRotations()}
                      onChange={(e) => {
                        setBoneRotation(bone.id, axis, parseFloat(e.target.value) - baseOffset);
                        setActivePreset('custom');
                      }}
                      className="flex-1 accent-indigo-400 opacity-80 hover:opacity-100 transition-opacity"
                    />
                    <button
                      onClick={() => {
                        commitBoneRotations();
                        setBoneRotation(bone.id, axis, Math.min(3.14 - baseOffset, configVal + 0.01));
                        setActivePreset('custom');
                      }}
                      className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                    <input
                      type="number"
                      step="0.01"
                      value={Number(displayVal.toFixed(2))}
                      onFocus={() => commitBoneRotations()}
                      onChange={(e) => {
                        const newVal = parseFloat(e.target.value);
                        if (!isNaN(newVal)) {
                          setBoneRotation(bone.id, axis, newVal - baseOffset);
                          setActivePreset('custom');
                        }
                      }}
                      className="w-14 text-xs bg-black/20 border border-white/10 rounded px-1 py-0.5 text-slate-200 tabular-nums text-right outline-none focus:border-indigo-400 transition-colors shadow-inner"
                    />
                    <button
                      onClick={() => {
                        commitBoneRotations();
                        setBoneRotation(bone.id, axis, 0);
                        setActivePreset('custom');
                      }}
                      className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-red-400 transition-colors"
                      title={`Reset ${axis.toUpperCase()} to default`}
                    >
                      <RotateCcw size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const PoseConfig: React.FC<{ alwaysOpen?: boolean }> = ({ alwaysOpen = false }) => {
  const { 
    boneRotations, setBoneRotation, resetBoneRotations, applyBoneRotations,
    commitBoneRotations, undoBoneRotations, redoBoneRotations, pastBoneRotations, futureBoneRotations,
    isHeadTrackingEnabled, setHeadTrackingEnabled,
    isFloatingEnabled, setFloatingEnabled,
    isOrbFloatingEnabled, setOrbFloatingEnabled,
    areOrbsEnabled, setOrbsEnabled,
    isModelVisible, setModelVisible,
    orbGroupPosition, setOrbGroupPosition,
    orbMovementPreset, setOrbMovementPreset,
    orbRadius, setOrbRadius,
    orbSpeed, setOrbSpeed
  } = useGameStore();
  const [isOpen, setIsOpen] = useState(alwaysOpen);
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState('default');
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importText, setImportText] = useState('');

  const handleImport = () => {
    try {
      commitBoneRotations();
      
      const newRotations: Record<string, {x: number, y: number, z: number}> = {};
      const lines = importText.split('\n');
      
      const labelToId = BONES.reduce((acc, bone) => {
        acc[bone.label.toLowerCase().replace(/\s+/g, '')] = bone.id;
        return acc;
      }, {} as Record<string, string>);

      lines.forEach(line => {
        const str = line.trim();
        if (!str) return;

        // Parse environment boolean
        if (str.startsWith('Show Invoker:')) setModelVisible(str.includes('true'));
        else if (str.startsWith('Dynamic Head Tracking:')) setHeadTrackingEnabled(str.includes('true'));
        else if (str.startsWith('Invoker Floating:')) setFloatingEnabled(str.includes('true'));
        else if (str.startsWith('Show Orbs:')) setOrbsEnabled(str.includes('true'));
        else if (str.startsWith('Orb Wobble:')) setOrbFloatingEnabled(str.includes('true'));
        // Parse environment string/numbers
        else if (str.startsWith('Orb Preset:')) setOrbMovementPreset(str.split(':')[1].trim());
        else if (str.startsWith('Orb Radius:')) setOrbRadius(parseFloat(str.split(':')[1]));
        else if (str.startsWith('Orb Speed:')) setOrbSpeed(parseFloat(str.split(':')[1]));
        else if (str.startsWith('Orb Offset:')) {
          const match = str.match(/X:\s*(-?\d+\.?\d*),\s*Y:\s*(-?\d+\.?\d*),\s*Z:\s*(-?\d+\.?\d*)/i);
          if (match) {
            setOrbGroupPosition('x', parseFloat(match[1]));
            setOrbGroupPosition('y', parseFloat(match[2]));
            setOrbGroupPosition('z', parseFloat(match[3]));
          }
        } 
        // Parse bones
        else {
          const match = str.match(/([a-z0-9]+)x\s*:\s*(-?\d+\.?\d*),\s*([a-z0-9]+)y\s*:\s*(-?\d+\.?\d*),\s*([a-z0-9]+)z\s*:\s*(-?\d+\.?\d*)/);
          if (match && match[1] === match[3] && match[1] === match[5]) {
            const label = match[1];
            const boneId = labelToId[label];
            if (boneId) {
              const baseX = BASE_OFFSETS[boneId]?.x || 0;
              const baseY = BASE_OFFSETS[boneId]?.y || 0;
              const baseZ = BASE_OFFSETS[boneId]?.z || 0;
              
              newRotations[boneId] = {
                x: parseFloat(match[2]) - baseX,
                y: parseFloat(match[4]) - baseY,
                z: parseFloat(match[6]) - baseZ
              };
            }
          }
        }
      });
      
      if (Object.keys(newRotations).length > 0) {
        applyBoneRotations(newRotations);
      }
      
      setImportText('');
      setIsImportOpen(false);
      setActivePreset('custom');
    } catch (e) {
      alert("Failed to parse configuration.");
    }
  };

  const handlePresetChange = (preset: string) => {
    setActivePreset(preset);
    if (preset === 'default') {
      resetBoneRotations();
    } else if (preset === 'praying') {
      applyBoneRotations(PRAYING_POSE);
    }
  };

  const handleCopy = () => {
    let output = '--- Environment Settings ---\n';
    output += `Show Invoker: ${isModelVisible}\n`;
    output += `Dynamic Head Tracking: ${isHeadTrackingEnabled}\n`;
    output += `Invoker Floating: ${isFloatingEnabled}\n`;
    output += `Show Orbs: ${areOrbsEnabled}\n`;
    if (areOrbsEnabled) {
      output += `Orb Wobble: ${isOrbFloatingEnabled}\n`;
      output += `Orb Preset: ${orbMovementPreset}\n`;
      output += `Orb Radius: ${orbRadius}\n`;
      output += `Orb Speed: ${orbSpeed}\n`;
      output += `Orb Offset: X:${orbGroupPosition.x.toFixed(2)}, Y:${orbGroupPosition.y.toFixed(2)}, Z:${orbGroupPosition.z.toFixed(2)}\n`;
    }
    
    output += '\n--- Bone Rotations ---\n';
    BONES.forEach(bone => {
      const x = (boneRotations[bone.id]?.x || 0) + (BASE_OFFSETS[bone.id]?.x || 0);
      const y = (boneRotations[bone.id]?.y || 0) + (BASE_OFFSETS[bone.id]?.y || 0);
      const z = (boneRotations[bone.id]?.z || 0) + (BASE_OFFSETS[bone.id]?.z || 0);
      
      const label = bone.label.toLowerCase().replace(/\s+/g, '');
      output += `${label}x : ${Number(x.toFixed(3))}, ${label}y : ${Number(y.toFixed(3))}, ${label}z : ${Number(z.toFixed(3))}\n`;
    });
    
    navigator.clipboard.writeText(output.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={alwaysOpen ? "h-full w-full flex flex-col" : "absolute top-20 right-4 z-50 flex flex-col items-end"}>
      {!alwaysOpen && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-slate-900/40 border border-white/10 rounded-full hover:bg-slate-800/60 transition-colors shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-xl"
        >
          {isOpen ? <X className="text-slate-300" size={24} /> : <SlidersHorizontal className="text-slate-300" size={24} />}
        </button>
      )}

      {(isOpen || alwaysOpen) && (
        <div className={`${alwaysOpen ? 'flex-1 h-full w-full' : 'mt-4 w-96 max-h-[80vh]'} flex flex-col bg-slate-950/40 border border-white/10 rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-2xl`}>
          {/* Static Header */}
          <div className="flex-none flex items-center justify-between p-4 border-b border-white/10 bg-slate-950 rounded-t-xl">
            <h2 className="text-lg font-bold text-slate-200">Pose Configurator</h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="p-2 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/40 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <div className="w-px bg-white/10 mx-1"></div>
              <button
                onClick={() => {
                  undoBoneRotations();
                  setActivePreset('custom');
                }}
                disabled={pastBoneRotations.length === 0}
                className="p-2 bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 rounded-lg transition-colors text-slate-300 flex items-center gap-1 text-sm font-medium"
                title="Undo"
              >
                <Undo size={16} />
              </button>
              <button
                onClick={() => {
                  redoBoneRotations();
                  setActivePreset('custom');
                }}
                disabled={futureBoneRotations.length === 0}
                className="p-2 bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 rounded-lg transition-colors text-slate-300 flex items-center gap-1 text-sm font-medium"
                title="Redo"
              >
                <Redo size={16} />
              </button>
              <button
                onClick={() => {
                  resetBoneRotations();
                  setActivePreset('default');
                }}
                className="p-2 bg-red-900/40 text-red-400 hover:bg-red-800/60 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                title="Reset Everything"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="space-y-6">

              {/* Environment & Orbs Config */}
              <div className="bg-white/5 p-3 rounded-lg border border-white/5 shadow-inner">
                <h3 className="text-sm font-semibold text-slate-200 mb-3 drop-shadow-sm">Environment & Orbs</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Show Invoker</span>
                    <input 
                      type="checkbox" 
                      checked={isModelVisible}
                      onChange={(e) => setModelVisible(e.target.checked)}
                      className="accent-indigo-500 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Dynamic Head Tracking</span>
                    <input 
                      type="checkbox" 
                      checked={isHeadTrackingEnabled}
                      onChange={(e) => setHeadTrackingEnabled(e.target.checked)}
                      className="accent-indigo-500 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Invoker Floating</span>
                    <input 
                      type="checkbox" 
                      checked={isFloatingEnabled}
                      onChange={(e) => setFloatingEnabled(e.target.checked)}
                      className="accent-indigo-500 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Show Orbs</span>
                    <input 
                      type="checkbox" 
                      checked={areOrbsEnabled}
                      onChange={(e) => setOrbsEnabled(e.target.checked)}
                      className="accent-indigo-500 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  {areOrbsEnabled && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Orb Wobble Effect</span>
                        <input 
                          type="checkbox" 
                          checked={isOrbFloatingEnabled}
                          onChange={(e) => setOrbFloatingEnabled(e.target.checked)}
                          className="accent-indigo-500 w-4 h-4 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm text-slate-300">Orb Movement Preset</span>
                        <select 
                          value={orbMovementPreset}
                          onChange={(e) => setOrbMovementPreset(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-sm text-slate-200 outline-none focus:border-indigo-400"
                        >
                          <option value="orbit_horizontal">Orbit Horizontal</option>
                          <option value="spin_vertical_behind">Spin Vertical Behind</option>
                        </select>
                      </div>

                      <div className="space-y-3 pt-2">
                        <span className="text-sm text-slate-300 block mb-1">Orb Spread (Radius)</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 uppercase w-4">R</span>
                          <button
                            onClick={() => setOrbRadius(Math.max(0.1, orbRadius - 0.1))}
                            className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="range"
                            min="0.1"
                            max="5.0"
                            step="0.1"
                            value={orbRadius}
                            onChange={(e) => setOrbRadius(parseFloat(e.target.value))}
                            className="flex-1 accent-indigo-400 opacity-80 hover:opacity-100 transition-opacity"
                          />
                          <button
                            onClick={() => setOrbRadius(Math.min(5.0, orbRadius + 0.1))}
                            className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                          <input
                            type="number"
                            step="0.1"
                            value={Number(orbRadius.toFixed(2))}
                            onChange={(e) => {
                              const newVal = parseFloat(e.target.value);
                              if (!isNaN(newVal) && newVal > 0) setOrbRadius(newVal);
                            }}
                            className="w-14 text-xs bg-black/20 border border-white/10 rounded px-1 py-0.5 text-slate-200 tabular-nums text-right outline-none focus:border-indigo-400 transition-colors shadow-inner"
                          />
                          <button
                            onClick={() => setOrbRadius(1)}
                            className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-red-400 transition-colors"
                            title={`Reset Radius to default`}
                          >
                            <RotateCcw size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <span className="text-sm text-slate-300 block mb-1">Orb Speed</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 uppercase w-4">S</span>
                          <button
                            onClick={() => setOrbSpeed(Math.max(0.1, orbSpeed - 0.1))}
                            className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="range"
                            min="0.1"
                            max="5.0"
                            step="0.1"
                            value={orbSpeed}
                            onChange={(e) => setOrbSpeed(parseFloat(e.target.value))}
                            className="flex-1 accent-indigo-400 opacity-80 hover:opacity-100 transition-opacity"
                          />
                          <button
                            onClick={() => setOrbSpeed(Math.min(5.0, orbSpeed + 0.1))}
                            className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                          <input
                            type="number"
                            step="0.1"
                            value={Number(orbSpeed.toFixed(2))}
                            onChange={(e) => {
                              const newVal = parseFloat(e.target.value);
                              if (!isNaN(newVal) && newVal > 0) setOrbSpeed(newVal);
                            }}
                            className="w-14 text-xs bg-black/20 border border-white/10 rounded px-1 py-0.5 text-slate-200 tabular-nums text-right outline-none focus:border-indigo-400 transition-colors shadow-inner"
                          />
                          <button
                            onClick={() => setOrbSpeed(1)}
                            className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-red-400 transition-colors"
                            title={`Reset Speed to default`}
                          >
                            <RotateCcw size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <span className="text-sm text-slate-300 block mb-1">Orb Position Offset</span>
                        {AXES.map((axis) => (
                          <div key={`orb-pos-${axis}`} className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500 uppercase w-4">{axis}</span>
                            <button
                              onClick={() => setOrbGroupPosition(axis, orbGroupPosition[axis] - 0.1)}
                              className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <input
                              type="range"
                              min="-10"
                              max="10"
                              step="0.1"
                              value={orbGroupPosition[axis]}
                              onChange={(e) => setOrbGroupPosition(axis, parseFloat(e.target.value))}
                              className="flex-1 accent-indigo-400 opacity-80 hover:opacity-100 transition-opacity"
                            />
                            <button
                              onClick={() => setOrbGroupPosition(axis, orbGroupPosition[axis] + 0.1)}
                              className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                            <input
                              type="number"
                              step="0.1"
                              value={Number(orbGroupPosition[axis].toFixed(2))}
                              onChange={(e) => {
                                const newVal = parseFloat(e.target.value);
                                if (!isNaN(newVal)) setOrbGroupPosition(axis, newVal);
                              }}
                              className="w-14 text-xs bg-black/20 border border-white/10 rounded px-1 py-0.5 text-slate-200 tabular-nums text-right outline-none focus:border-indigo-400 transition-colors shadow-inner"
                            />
                            <button
                              onClick={() => setOrbGroupPosition(axis, axis === 'y' ? 1.8 : 0)}
                              className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-red-400 transition-colors"
                              title={`Reset ${axis.toUpperCase()} to default`}
                            >
                              <RotateCcw size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Import Configuration */}
              <div className="bg-white/5 p-3 rounded-lg border border-white/5 shadow-inner mb-6 transition-all duration-200">
                <button 
                  onClick={() => setIsImportOpen(!isImportOpen)}
                  className="w-full flex items-center justify-between text-sm text-slate-200 font-semibold mb-1"
                >
                  Import Configuration {isImportOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
                {isImportOpen && (
                  <div className="space-y-3 mt-3">
                    <textarea 
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      placeholder="Paste copied config here..."
                      className="w-full h-32 bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-slate-300 outline-none focus:border-indigo-400 font-mono resize-none shadow-inner"
                    />
                    <button 
                      onClick={handleImport}
                      disabled={!importText.trim()}
                      className="w-full py-2 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
                    >
                      Apply Configuration
                    </button>
                  </div>
                )}
              </div>

              {/* Pose Presets */}
              <div className="bg-white/5 p-3 rounded-lg border border-white/5 shadow-inner mb-6">
                <span className="text-sm text-slate-300 block mb-2 font-semibold">Pose Presets</span>
                <select 
                  value={activePreset}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-sm text-slate-200 outline-none focus:border-indigo-400"
                >
                  <option value="custom">Custom...</option>
                  <option value="default">Default Pose</option>
                  <option value="praying">Praying Pose</option>
                </select>
              </div>

              <div className="space-y-2">
                {BONE_GROUPS.map((group) => (
                  <BoneGroupSection 
                    key={group.name} 
                    group={group} 
                    boneRotations={boneRotations} 
                    setBoneRotation={setBoneRotation} 
                    setActivePreset={setActivePreset} 
                    commitBoneRotations={commitBoneRotations}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
