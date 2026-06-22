import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

const MODEL_URL = '/asset/icons/3d%20model/invoker_dota_2.glb';

function Orb({ color, initialPos, speed, phase, intensity = 5 }: { color: string, initialPos: [number, number, number], speed: number, phase: number, intensity?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(1);
  const prevColor = useRef(color);

  useEffect(() => {
    if (prevColor.current !== color) {
      scaleRef.current = 1.6; // Instant scale up for pop effect
      prevColor.current = color;
    }
  }, [color]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Independent vertical bobbing
      meshRef.current.position.y = initialPos[1] + Math.sin(state.clock.elapsedTime * speed + phase) * 0.2;
      // Slight independent horizontal wobble to break the perfect circle
      meshRef.current.position.x = initialPos[0] + Math.cos(state.clock.elapsedTime * (speed * 0.8) + phase) * 0.05;
      meshRef.current.position.z = initialPos[2] + Math.sin(state.clock.elapsedTime * (speed * 0.9) + phase) * 0.05;
      
      // Smoothly lerp scale back down to 1
      scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 1, delta * 15);
      meshRef.current.scale.set(scaleRef.current, scaleRef.current, scaleRef.current);
    }
  });

  return (
    <mesh ref={meshRef} position={initialPos}>
      <sphereGeometry args={[0.08, 32, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} />
      <pointLight color={color} intensity={15} distance={4} decay={2} />
    </mesh>
  );
}

function FloatingOrbs() {
  const orbsRef = useRef<THREE.Group>(null);
  const currentOrbs = useGameStore(state => state.currentOrbs);

  useFrame((state) => {
    if (orbsRef.current) {
      // Slowly orbit the entire group around the Y axis
      orbsRef.current.rotation.y = state.clock.elapsedTime * 0.8;
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
  const displayOrbs = currentOrbs.length === 0 ? ['Q', 'W', 'E'] : currentOrbs;

  return (
    <group ref={orbsRef} position={[0, 1.8, 0]}>
      {displayOrbs.map((orb, idx) => (
        <Orb 
          key={idx} 
          color={getOrbColor(orb)} 
          initialPos={positions[idx]} 
          speed={2.5 + idx * 0.2} 
          phase={idx * 2.4} 
          intensity={orb === 'W' ? 12 : 5} 
        />
      ))}
    </group>
  );
}

function Model() {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  const setModelLoaded = useGameStore((state) => state.setModelLoaded);
  const timeRef = useRef(0);

  useEffect(() => {
    setModelLoaded(true);
  }, [setModelLoaded]);

  // Continuously lerp towards the floating target position for a seamless entrance and float
  useFrame((_, delta) => {
    // Accumulate time locally so it starts at 0 exactly when the model mounts
    timeRef.current += delta;
    
    if (groupRef.current) {
      const targetY = -7.5 + Math.sin(timeRef.current) * 0.15;
      
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
  });

  return (
    <group ref={groupRef} position={[0, -25, 0]} rotation={[0, 0, 0]} scale={[4.5, 4.5, 4.5]}>
      <primitive object={scene} />
      <FloatingOrbs />
    </group>
  );
}

useGLTF.preload(MODEL_URL);

export const ModelBackground: React.FC = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden rounded-xl pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]} // Limit pixel ratio to 1.5 to save massive GPU overhead on phones
        performance={{ min: 0.5 }} // Allow R3F to downgrade resolution if framerate drops
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, 10, -5]} intensity={0.5} color="#4facfe" />
        <directionalLight position={[10, -10, -5]} intensity={0.5} color="#ff8c00" />
        <Suspense fallback={null}>
          <Model />
          {/* Post-processing (Bloom) is notoriously laggy on mobile GPUs, so we turn it off for phones */}
          {!isMobile && (
            <EffectComposer>
              <Bloom luminanceThreshold={1} mipmapBlur intensity={1.2} radius={0.5} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
