import React, { useState } from 'react';
import { SlidersHorizontal, X, RotateCcw, Plus, Minus } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const BONES = [
  { id: 'Spine_1_011', label: 'Spine' },
  { id: 'Head_0_026', label: 'Head' },
  { id: 'bicep_L_029', label: 'Left Arm' },
  { id: 'elbow_L_030', label: 'Left Forearm' },
  { id: 'wrist_L_031', label: 'Left Wrist' },
  { id: 'bicep_R_013', label: 'Right Arm' },
  { id: 'elbow_R_014', label: 'Right Forearm' },
  { id: 'wrist_R_015', label: 'Right Wrist' },
];

const AXES = ['x', 'y', 'z'] as const;

export const PoseConfig: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const boneRotations = useGameStore((state) => state.boneRotations);
  const setBoneRotation = useGameStore((state) => state.setBoneRotation);
  const resetBoneRotations = useGameStore((state) => state.resetBoneRotations);

  return (
    <div className="absolute top-20 right-4 z-50 flex flex-col items-end">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-slate-900/80 border border-slate-700 rounded-full hover:bg-slate-800 transition-colors shadow-lg backdrop-blur-sm"
      >
        {isOpen ? <X className="text-slate-300" size={24} /> : <SlidersHorizontal className="text-slate-300" size={24} />}
      </button>

      {isOpen && (
        <div className="mt-4 w-96 max-h-[80vh] overflow-y-auto bg-slate-900/95 border border-slate-700 rounded-xl p-4 shadow-2xl backdrop-blur-md custom-scrollbar">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-slate-200">Pose Configurator</h2>
            <button
              onClick={resetBoneRotations}
              className="p-2 bg-red-900/40 text-red-400 hover:bg-red-800/60 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          <div className="space-y-6">
            {BONES.map((bone) => (
              <div key={bone.id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">{bone.label}</h3>
                <div className="space-y-3">
                  {AXES.map((axis) => {
                    const val = boneRotations[bone.id]?.[axis] || 0;
                    return (
                      <div key={`${bone.id}-${axis}`} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase w-4">{axis}</span>
                        <button
                          onClick={() => setBoneRotation(bone.id, axis, Math.max(-3.14, val - 0.01))}
                          className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="range"
                          min="-3.14"
                          max="3.14"
                          step="0.01"
                          value={val}
                          onChange={(e) => setBoneRotation(bone.id, axis, parseFloat(e.target.value))}
                          className="flex-1 accent-indigo-500"
                        />
                        <button
                          onClick={() => setBoneRotation(bone.id, axis, Math.min(3.14, val + 0.01))}
                          className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                        <input
                          type="number"
                          step="0.01"
                          value={Number(val.toFixed(2))}
                          onChange={(e) => {
                            const newVal = parseFloat(e.target.value);
                            if (!isNaN(newVal)) {
                              setBoneRotation(bone.id, axis, newVal);
                            }
                          }}
                          className="w-14 text-xs bg-slate-900/50 border border-slate-700 rounded px-1 py-0.5 text-slate-300 tabular-nums text-right outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
