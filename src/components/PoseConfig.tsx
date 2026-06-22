import React, { useState } from 'react';
import { SlidersHorizontal, X, RotateCcw, Plus, Minus, Copy, Check } from 'lucide-react';
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

const BASE_OFFSETS: Record<string, { x: number, y: number, z: number }> = {
  'Head_0_026': { x: -0.05, y: 0.15, z: 0 },
  'bicep_L_029': { x: -0.65, y: 0, z: 0 },
  'bicep_R_013': { x: -0.65, y: 0, z: 0 },
  'wrist_L_031': { x: -0.4, y: 0, z: 0 },
  'wrist_R_015': { x: -0.4, y: 0, z: 0 },
};

const AXES = ['x', 'y', 'z'] as const;

export const PoseConfig: React.FC<{ alwaysOpen?: boolean }> = ({ alwaysOpen = false }) => {
  const { boneRotations, setBoneRotation, resetBoneRotations } = useGameStore();
  const [isOpen, setIsOpen] = useState(alwaysOpen);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    let output = '';
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
                className="p-2 bg-blue-900/40 text-blue-400 hover:bg-blue-800/60 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />} 
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={resetBoneRotations}
                className="p-2 bg-red-900/40 text-red-400 hover:bg-red-800/60 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="space-y-6">
              {BONES.map((bone) => (
              <div key={bone.id} className="bg-white/5 p-3 rounded-lg border border-white/5 shadow-inner">
                <h3 className="text-sm font-semibold text-slate-200 mb-3 drop-shadow-sm">{bone.label}</h3>
                <div className="space-y-3">
                  {AXES.map((axis) => {
                    const baseOffset = BASE_OFFSETS[bone.id]?.[axis] || 0;
                    const configVal = boneRotations[bone.id]?.[axis] || 0;
                    const displayVal = configVal + baseOffset;
                    
                    return (
                      <div key={`${bone.id}-${axis}`} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase w-4">{axis}</span>
                        <button
                          onClick={() => setBoneRotation(bone.id, axis, Math.max(-3.14 - baseOffset, configVal - 0.01))}
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
                          onChange={(e) => setBoneRotation(bone.id, axis, parseFloat(e.target.value) - baseOffset)}
                          className="flex-1 accent-indigo-400 opacity-80 hover:opacity-100 transition-opacity"
                        />
                        <button
                          onClick={() => setBoneRotation(bone.id, axis, Math.min(3.14 - baseOffset, configVal + 0.01))}
                          className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                        <input
                          type="number"
                          step="0.01"
                          value={Number(displayVal.toFixed(2))}
                          onChange={(e) => {
                            const newVal = parseFloat(e.target.value);
                            if (!isNaN(newVal)) {
                              setBoneRotation(bone.id, axis, newVal - baseOffset);
                            }
                          }}
                          className="w-14 text-xs bg-black/20 border border-white/10 rounded px-1 py-0.5 text-slate-200 tabular-nums text-right outline-none focus:border-indigo-400 transition-colors shadow-inner"
                        />
                        <button
                          onClick={() => setBoneRotation(bone.id, axis, 0)}
                          className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-red-400 transition-colors"
                          title={`Reset ${axis.toUpperCase()} to default`}
                        >
                          <RotateCcw size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
