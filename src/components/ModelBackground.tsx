import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Move, RotateCcw } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const MODEL_URL = '/asset/icons/3d%20model/invoker_dota_2.glb';

const ModelRotationWidget = () => {
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - lastPos.current.x;
      const deltaY = e.clientY - lastPos.current.y;
      
      const currentRot = useGameStore.getState().modelRotation;
      useGameStore.getState().setModelRotation({
        x: currentRot.x + deltaY * 0.01,
        y: currentRot.y + deltaX * 0.01,
      });
      
      lastPos.current = { x: e.clientX, y: e.clientY };
    };
    
    const handlePointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = 'default';
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      
      const zoomSpeed = 0.005;
      const currentScale = useGameStore.getState().modelScale;
      // Scroll up -> Zoom in, Scroll down -> Zoom out
      const newScale = Math.max(1, Math.min(15, currentScale - e.deltaY * zoomSpeed));
      useGameStore.getState().setModelScale(newScale);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="absolute top-1/2 left-8 -translate-y-1/2 flex flex-col gap-3 z-50">
      <div 
        className="bg-black/50 border border-white/20 w-12 h-12 flex items-center justify-center rounded-full cursor-move pointer-events-auto hover:bg-white/10 transition-colors text-white/50 hover:text-white backdrop-blur-md"
        onPointerDown={(e) => {
          isDragging.current = true;
          lastPos.current = { x: e.clientX, y: e.clientY };
          document.body.style.cursor = 'move';
          e.preventDefault();
        }}
        title="Drag to rotate, scroll to zoom"
      >
        <Move size={22} />
      </div>
      
      <button 
        onClick={() => {
          useGameStore.getState().setModelRotation({ x: 0, y: 0 });
          useGameStore.getState().setModelScale(4.5);
        }}
        className="bg-black/50 border border-white/20 w-12 h-12 flex items-center justify-center rounded-full pointer-events-auto hover:bg-white/10 transition-colors text-white/50 hover:text-white backdrop-blur-md"
        title="Reset Camera & Zoom"
      >
        <RotateCcw size={20} />
      </button>
    </div>
  );
};

function Orb({ color, initialPos, speed, phase, intensity = 5, isVisible = true }: { color: string, initialPos: [number, number, number], speed: number, phase: number, intensity?: number, isVisible?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(isVisible ? 1 : 0);
  const prevColor = useRef(color);

  useEffect(() => {
    if (isVisible && prevColor.current !== color && color !== '#000000') {
      scaleRef.current = 1.6; // Instant scale up for pop effect
      prevColor.current = color;
    }
  }, [color, isVisible]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const isFloating = useGameStore.getState().isOrbFloatingEnabled;
      // Independent vertical bobbing
      meshRef.current.position.y = initialPos[1] + (isFloating ? Math.sin(state.clock.elapsedTime * speed + phase) * 0.2 : 0);
      // Slight independent horizontal wobble to break the perfect circle
      meshRef.current.position.x = initialPos[0] + (isFloating ? Math.cos(state.clock.elapsedTime * (speed * 0.8) + phase) * 0.05 : 0);
      meshRef.current.position.z = initialPos[2] + (isFloating ? Math.sin(state.clock.elapsedTime * (speed * 0.9) + phase) * 0.05 : 0);

      // Smoothly lerp scale towards target (1 if visible, 0 if hidden)
      const targetScale = isVisible ? 1 : 0;
      scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, delta * 15);
      meshRef.current.scale.set(scaleRef.current, scaleRef.current, scaleRef.current);
    }
  });

  return (
    <mesh ref={meshRef} position={initialPos}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} transparent opacity={isVisible ? 1 : 0} />
      {/* NEVER unmount point lights dynamically in Three.js or it causes severe shader recompilation lag */}
      <pointLight color={color} intensity={isVisible ? intensity : 0} distance={4} decay={2} />
    </mesh>
  );
}

function FloatingOrbs() {
  const orbsRef = useRef<THREE.Group>(null);
  const { currentOrbs, areOrbsEnabled, orbGroupPosition, orbMovementPreset, orbRadius, orbSpeed } = useGameStore();

  useFrame((state) => {
    if (orbsRef.current) {
      if (orbMovementPreset === 'orbit_horizontal') {
        orbsRef.current.rotation.set(0, state.clock.elapsedTime * 0.8 * orbSpeed, 0);
      } else if (orbMovementPreset === 'spin_vertical_behind') {
        // Tilt 90 degrees on X to stand the ring up vertically, then spin on local Y
        orbsRef.current.rotation.set(Math.PI / 2, state.clock.elapsedTime * -1.2 * orbSpeed, 0);
      }
    }
  });

  const getOrbColor = (orb: string) => {
    switch (orb) {
      case 'Q': return '#4facfe';
      case 'W': return '#d53e90';
      case 'E': return '#ff8c00';
      default: return '#ffffff';
    }
  };

  const positions: [number, number, number][] = [
    [0.85, 0, 0],
    [-0.425, 0, 0.736],
    [-0.425, 0, -0.736],
  ];

  // If no orbs are pressed, show a default set for aesthetics
  const isIdle = currentOrbs.length === 0;
  const displayOrbs = isIdle ? ['Q', 'W', 'E'] : currentOrbs;

  if (!areOrbsEnabled) return null;

  // Apply a base offset so the vertical halo is automatically pushed behind him
  const posZ = orbMovementPreset === 'spin_vertical_behind' 
    ? orbGroupPosition.z - 1.5 
    : orbGroupPosition.z;

  return (
    <group ref={orbsRef} position={[orbGroupPosition.x, orbGroupPosition.y, posZ]}>
      {[0, 1, 2].map((idx) => {
        const orb = displayOrbs[idx];
        const isVisible = isIdle || idx < currentOrbs.length;
        const pos = positions[idx];
        const scaledPos: [number, number, number] = [
          pos[0] * orbRadius,
          pos[1] * orbRadius,
          pos[2] * orbRadius
        ];
        return (
          <Orb
            key={idx}
            color={orb ? getOrbColor(orb) : '#000000'}
            initialPos={scaledPos}
            speed={2.5 + idx * 0.2}
            phase={idx * 2.4}
            intensity={orb === 'W' ? 12 : 5}
            isVisible={isVisible}
          />
        );
      })}
    </group>
  );
}

const globalInitialRotations: Record<string, THREE.Euler> = {};

function Model() {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  const setModelLoaded = useGameStore((state) => state.setModelLoaded);
  const timeRef = useRef(0);

  // Continuously lerp towards the floating target position for a seamless entrance and float
  const boneRefs = useRef<Record<string, THREE.Object3D>>({});
  
  useEffect(() => {
    setModelLoaded(true);
  }, [setModelLoaded]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isActiveRef = useRef(true);

  const currentOrbs = useGameStore((state) => state.currentOrbs);
  const isModelVisible = useGameStore((state) => state.isModelVisible);
  const modelRotation = useGameStore((state) => state.modelRotation);
  const modelScale = useGameStore((state) => state.modelScale);
  const armAnim = useRef({ arm: 'none', time: 0 });

  useEffect(() => {
    if (currentOrbs.length === 0) return;
    armAnim.current.arm = Math.random() > 0.5 ? 'L' : 'R';
    armAnim.current.time = 0;
  }, [currentOrbs]);

  const fingerBones = [
    'mid_0_R_016', 'mid_1_R_017', 'thumb_0_R_018', 'thumb_1_R_019', 
    'pinky_0_R_020', 'pinky_1_R_021', 'index_0_R_022', 'index_1_R_023', 
    'ring_0_R_024', 'ring_1_R_025',
    'ring_0_L_032', 'ring_1_L_033', 'pinky_0_L_034', 'pinky_1_L_035', 
    'index_0_L_036', 'index_1_L_037', 'thumb_0_L_038', 'thumb_1_L_039', 
    'mid_0_L_040', 'mid_1_L_041'
  ];
  const configurableBones = [
    'Spine_1_011', 'Head_0_026', 
    'bicep_L_029', 'elbow_L_030', 'wrist_L_031', 
    'bicep_R_013', 'elbow_R_014', 'wrist_R_015',
    ...fingerBones
  ];

  const activeConfigurableBones = useRef<{ boneName: string, bone: THREE.Object3D, initialRot: THREE.Euler }[]>([]);
  const capePhysicsBones = useRef<{ bone: THREE.Bone, initialRot: THREE.Euler, rowIdx: number }[]>([]);

  useEffect(() => {
    activeConfigurableBones.current = [];
    configurableBones.forEach(boneName => {
      const bone = scene.getObjectByName(boneName);
      if (bone) {
        boneRefs.current[boneName] = bone;
        if (!globalInitialRotations[boneName]) {
          globalInitialRotations[boneName] = bone.rotation.clone();
        }
        activeConfigurableBones.current.push({ boneName, bone, initialRot: globalInitialRotations[boneName] });
      }
    });

    // Extract cape bones for programmatic inertia animations
    capePhysicsBones.current = [];
    scene.traverse((obj) => {
      if (obj.type === 'Bone' && obj.name.startsWith('invoker_cape_')) {
        boneRefs.current[obj.name] = obj as THREE.Bone;
        if (!globalInitialRotations[obj.name]) {
          globalInitialRotations[obj.name] = obj.rotation.clone();
        }
        
        const match = obj.name.match(/_R(\d)C/);
        if (match) {
          capePhysicsBones.current.push({
            bone: obj as THREE.Bone,
            initialRot: globalInitialRotations[obj.name],
            rowIdx: parseInt(match[1])
          });
        }
      }
    });
  }, [scene, JSON.stringify(configurableBones)]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize to -1 to 1
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleMouseLeave = () => { isActiveRef.current = false; };
    const handleMouseEnter = () => { isActiveRef.current = true; };
    const handleBlur = () => { isActiveRef.current = false; };
    const handleFocus = () => { isActiveRef.current = true; };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useFrame((_state, delta) => {
    // Accumulate time locally so it starts at 0 exactly when the model mounts
    timeRef.current += delta;

    if (groupRef.current) {
      const isFloating = useGameStore.getState().isFloatingEnabled;
      const targetY = -7.5 + (isFloating ? Math.sin(timeRef.current) * 0.15 : 0);

      // Wait for the UI entrance animations (1.2s) before rising up
      if (timeRef.current > 1.2) {
        // Smooth lerp factor for a majestic entrance, clamped to 1 to prevent alt-tab overshooting
        groupRef.current.position.y = THREE.MathUtils.lerp(
          groupRef.current.position.y,
          targetY,
          Math.min(delta * 2.0, 1)
        );
      }
    }

    const lerpFactor = Math.min(delta * 5, 1);
    const boneRots = useGameStore.getState().boneRotations;

    // Head tracking the mouse cursor
    const head = boneRefs.current['Head_0_026'];
    const initialHead = globalInitialRotations['Head_0_026'];

    if (head && initialHead) {
      // The default model pose has his head turned. We add an offset to face him forward.
      const forwardOffsetX = 0; // Fine-tuned to center his head perfectly
      const forwardOffsetY = 0.15; // Fine-tuned to tilt his head
      const configRot = boneRots['Head_0_026'] || { x: 0, y: 0, z: 0 };

      let targetRotX = initialHead.x + forwardOffsetX + configRot.x;
      let targetRotY = initialHead.y + forwardOffsetY + configRot.y;
      let targetRotZ = initialHead.z + configRot.z; // keep Z fixed to avoid head tilt

      if (isActiveRef.current && useGameStore.getState().isHeadTrackingEnabled) {
        // The local axes for this specific Dota 2 rig are swapped!
        // Local X axis controls left/right (yaw).
        // Local Y axis controls up/down (pitch).
        // Offset the origin vertically so his "look straight" point is on his face
        const faceOffsetY = 0.4; // His face is in the upper half of the screen
        targetRotX += mouseRef.current.x * 0.6;
        targetRotY -= (mouseRef.current.y - faceOffsetY) * 0.4;
      }

      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, targetRotX, lerpFactor);
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, targetRotY, lerpFactor);
      head.rotation.z = THREE.MathUtils.lerp(head.rotation.z, targetRotZ, lerpFactor);
    }

    // Apply other bone configurations
    for (let i = 0; i < activeConfigurableBones.current.length; i++) {
      const { boneName, bone, initialRot } = activeConfigurableBones.current[i];
      if (boneName === 'Head_0_026') continue; // Handled above
      
      if (bone && initialRot) {
        let defaultOffsetX = 0;
        let defaultOffsetY = 0;
        let defaultOffsetZ = 0;
        let currentLerp = lerpFactor;

        // Apply custom default pose adjustments requested by the user
        if (boneName === 'bicep_L_029' || boneName === 'bicep_R_013') {
          defaultOffsetX = -0.65;

          // Add floating inertia to arms: opposite of body's vertical sine wave
          // The body height is driven by Math.sin(timeRef.current)
          // We add +Math.sin(timeRef.current) because a positive X rotation lowers the arms on this rig
          if (useGameStore.getState().isFloatingEnabled) {
            defaultOffsetX += Math.sin(timeRef.current) * 0.15;
          }

          // Add lifting animation on orb cast
          if (armAnim.current.arm !== 'none') {
            const isLeft = boneName === 'bicep_L_029' && armAnim.current.arm === 'L';
            const isRight = boneName === 'bicep_R_013' && armAnim.current.arm === 'R';

            if (isLeft || isRight) {
              const t = armAnim.current.time;
              const duration = 0.12; // 120ms lift
              if (t <= duration) {
                // Math.sin(0 to PI) goes 0 -> 1 -> 0
                // Negative offset lifts the arm
                const bump = -Math.sin((t / duration) * Math.PI) * 0.3;
                defaultOffsetX += bump;
                currentLerp = Math.min(delta * 25, 1);
              }
            }
          }
        }

        // Add a relaxed bend to the wrists by default
        if (boneName === 'wrist_L_031' || boneName === 'wrist_R_015') {
          defaultOffsetX = -0.4; // Bend wrist slightly down
          
          // Add wrist flick animation on orb cast
          if (armAnim.current.arm !== 'none') {
            const isLeftWrist = boneName === 'wrist_L_031' && armAnim.current.arm === 'L';
            const isRightWrist = boneName === 'wrist_R_015' && armAnim.current.arm === 'R';

            if (isLeftWrist || isRightWrist) {
              const t = armAnim.current.time;
              const duration = 0.12; // 120ms flick
              if (t <= duration) {
                // Negative Z bends the wrist outward away from the body
                const bump = -Math.sin((t / duration) * Math.PI) * 0.6;
                defaultOffsetZ += bump;
                currentLerp = Math.min(delta * 25, 1);
              }
            }
          }
        }

        // Add finger opening animation on orb cast
        const isFinger = boneName.includes('_0_L_') || boneName.includes('_0_R_');
        if (isFinger && armAnim.current.arm !== 'none') {
          const isLeftFinger = boneName.includes('_L_') && armAnim.current.arm === 'L';
          const isRightFinger = boneName.includes('_R_') && armAnim.current.arm === 'R';
          
          if (isLeftFinger || isRightFinger) {
            const t = armAnim.current.time;
            const duration = 0.12; // 120ms flick
            if (t <= duration) {
               // Negative Z axis generally uncurls the fingers outwards on this rig
               const bump = -Math.sin((t / duration) * Math.PI) * 0.8; 
               defaultOffsetZ += bump; 
               currentLerp = Math.min(delta * 25, 1);
            }
          }
        }

        const configRot = boneRots[boneName] || { x: 0, y: 0, z: 0 };
        bone.rotation.x = THREE.MathUtils.lerp(bone.rotation.x, initialRot.x + defaultOffsetX + configRot.x, currentLerp);
        bone.rotation.y = THREE.MathUtils.lerp(bone.rotation.y, initialRot.y + defaultOffsetY + configRot.y, currentLerp);
        bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, initialRot.z + defaultOffsetZ + configRot.z, currentLerp);
      }
    }

    // Apply Cape Inertia
    for (let i = 0; i < capePhysicsBones.current.length; i++) {
      const { bone, initialRot, rowIdx } = capePhysicsBones.current[i];
      // The body floats with Math.sin(timeRef.current)
      // We add a delay phase based on the row (further down the cape = more delay)
      const delay = rowIdx * 0.3;
      // Further down the cape = larger swinging amplitude
      const amplitude = (rowIdx + 1) * 0.04;
      
      // X axis is typically the swing axis for the cape
      const inertiaX = useGameStore.getState().isFloatingEnabled ? -Math.sin(timeRef.current - delay) * amplitude : 0;
      
      bone.rotation.x = THREE.MathUtils.lerp(bone.rotation.x, initialRot.x + inertiaX, lerpFactor);
    }

    if (armAnim.current.arm !== 'none') {
      armAnim.current.time += delta;
      if (armAnim.current.time > 0.12) {
        armAnim.current.arm = 'none';
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -25, 0]} rotation={[modelRotation.x, modelRotation.y, 0]} scale={[modelScale, modelScale, modelScale]}>
      {isModelVisible && <primitive object={scene} />}
      <FloatingOrbs />
    </group>
  );
}

useGLTF.preload(MODEL_URL);

export const ModelBackground: React.FC = () => {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const setModelLoaded = useGameStore((state) => state.setModelLoaded);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setModelLoaded(true);
    }
  }, [isMobile, setModelLoaded]);

  if (isMobile) {
    return <div className="absolute inset-0 -z-10 overflow-hidden rounded-xl pointer-events-none bg-transparent" />;
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden rounded-xl pointer-events-none">
      <ModelRotationWidget />
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]} // Limit pixel ratio to 1.5 to save massive GPU overhead on phones
        performance={{ min: 0.5 }} // Allow R3F to downgrade resolution if framerate drops
        gl={{ powerPreference: "high-performance", antialias: false, stencil: false }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, 10, -5]} intensity={0.5} color="#4facfe" />
        <directionalLight position={[10, -10, -5]} intensity={0.5} color="#ff8c00" />
        <Suspense fallback={null}>
          <Model />
          {/* Post-processing (Bloom) is notoriously laggy on mobile GPUs, so we turn it off for phones */}
          {!isMobile && (
            <EffectComposer multisampling={0}>
              <Bloom luminanceThreshold={1} mipmapBlur intensity={1.2} radius={0.5} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
