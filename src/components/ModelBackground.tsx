import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

const MODEL_URL = '/asset/icons/3d%20model/invoker_dota_2.glb';

function Orb({ color, initialPos, speed, phase, intensity = 5 }: { color: string, initialPos: [number, number, number], speed: number, phase: number, intensity?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Independent vertical bobbing
      meshRef.current.position.y = initialPos[1] + Math.sin(state.clock.elapsedTime * speed + phase) * 0.2;
      // Slight independent horizontal wobble to break the perfect circle
      meshRef.current.position.x = initialPos[0] + Math.cos(state.clock.elapsedTime * (speed * 0.8) + phase) * 0.05;
      meshRef.current.position.z = initialPos[2] + Math.sin(state.clock.elapsedTime * (speed * 0.9) + phase) * 0.05;
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

  useFrame((state) => {
    if (orbsRef.current) {
      // Slowly orbit the entire group around the Y axis
      orbsRef.current.rotation.y = state.clock.elapsedTime * 0.8;
    }
  });

  return (
    <group ref={orbsRef} position={[0, 1.8, 0]}>
      <Orb color="#4facfe" initialPos={[0.85, 0, 0]} speed={2.5} phase={0} />
      <Orb color="#d53e90" initialPos={[-0.425, 0, 0.736]} speed={2.1} phase={2.4} intensity={12} />
      <Orb color="#ff8c00" initialPos={[-0.425, 0, -0.736]} speed={3.0} phase={5.1} />
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
        // Smooth lerp factor for a majestic entrance
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 2.0);
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
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden rounded-xl pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, 10, -5]} intensity={0.5} color="#4facfe" />
        <directionalLight position={[10, -10, -5]} intensity={0.5} color="#ff8c00" />
        <Suspense fallback={null}>
          <Model />
          <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.2} radius={0.5} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};
