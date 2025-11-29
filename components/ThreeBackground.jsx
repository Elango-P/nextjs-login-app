"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Text3D, Center, PerspectiveCamera, Stars, Sparkles, Environment } from '@react-three/drei';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// Professional Animated geometric shapes (Optimized)
function AnimatedShapes() {
  const groupRef = useRef();
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.04), 60);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <group ref={groupRef}>
      {/* Enhanced Floating Cube with energy field */}
      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={2}>
        <group position={[-4, 2, 0]}>
          <mesh rotation={[0.4, 0.4, time * 0.3]}>
            <boxGeometry args={[1.6, 1.6, 1.6]} />
            <meshStandardMaterial 
              color="#3b82f6" 
              metalness={0.8} 
              roughness={0.2}
              envMapIntensity={1.8}
              emissive="#3b82f6"
              emissiveIntensity={0.15}
            />
          </mesh>
          {/* Energy field */}
          <mesh scale={[1.3, 1.3, 1.3]} rotation={[0, 0, time * 0.5]}>
            <boxGeometry args={[1.8, 1.8, 1.8]} />
            <meshBasicMaterial 
              color="#3b82f6" 
              transparent 
              opacity={0.2}
              wireframe
            />
          </mesh>
        </group>
      </Float>

      {/* Enhanced Rotating Torus with orbit */}
      <Float speed={2} rotationIntensity={2} floatIntensity={1.5}>
        <group position={[4, -1, 0]} rotation={[Math.PI / 4, time * 0.2, 0]}>
          <mesh>
            <torusGeometry args={[1.1, 0.45, 24, 32]} />
            <meshStandardMaterial 
              color="#8b5cf6" 
              metalness={0.75} 
              roughness={0.25}
              envMapIntensity={1.8}
              emissive="#8b5cf6"
              emissiveIntensity={0.12}
            />
          </mesh>
          {/* Orbiting ring */}
          <mesh rotation={[Math.PI / 2, 0, time * 0.8]}>
            <torusGeometry args={[1.6, 0.08, 16, 24]} />
            <meshBasicMaterial 
              color="#ffffff" 
              opacity={0.6} 
              transparent 
            />
          </mesh>
        </group>
      </Float>

      {/* Enhanced Pulsating Sphere with particles */}
      <Float speed={3} rotationIntensity={0.6} floatIntensity={2.5}>
        <group position={[0, 3, -2]}>
          <mesh scale={[1 + Math.sin(time * 1.8) * 0.12, 1 + Math.sin(time * 1.8) * 0.12, 1 + Math.sin(time * 1.8) * 0.12]}>
            <sphereGeometry args={[1.3, 32, 32]} />
            <meshStandardMaterial 
              color="#10b981" 
              metalness={0.7} 
              roughness={0.25}
              envMapIntensity={1.8}
              emissive="#10b981"
              emissiveIntensity={0.18}
            />
          </mesh>
          {/* Orbiting particles */}
          {Array.from({ length: 5 }, (_, i) => {
            const angle = (i / 5) * Math.PI * 2 + time * 1.2;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * 2,
                  Math.sin(angle * 2) * 0.4,
                  Math.sin(angle) * 2
                ]}
              >
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshBasicMaterial color="#10b981" opacity={0.8} transparent />
              </mesh>
            );
          })}
        </group>
      </Float>

      {/* Enhanced Spinning Cone with energy beam */}
      <Float speed={2.5} rotationIntensity={3} floatIntensity={2}>
        <group position={[-3, -2, 1]} rotation={[0, Math.PI / 4, time * 0.4]}>
          <mesh>
            <coneGeometry args={[0.9, 1.8, 24]} />
            <meshStandardMaterial 
              color="#f59e0b" 
              metalness={0.8} 
              roughness={0.2}
              envMapIntensity={1.8}
              emissive="#f59e0b"
              emissiveIntensity={0.15}
            />
          </mesh>
          {/* Energy beam */}
          <mesh position={[0, 1.2, 0]} scale={[0.3, 0.8, 0.3]}>
            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <meshBasicMaterial 
              color="#f59e0b" 
              transparent 
              opacity={0.4}
            />
          </mesh>
        </group>
      </Float>

      {/* Enhanced Floating Dodecahedron with crystal effect */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2.5}>
        <group position={[3, 2, -1]} rotation={[time * 0.2, time * 0.3, 0]}>
          <mesh>
            <dodecahedronGeometry args={[1.1]} />
            <meshStandardMaterial 
              color="#ef4444" 
              metalness={0.6} 
              roughness={0.3}
              envMapIntensity={1.8}
              emissive="#ef4444"
              emissiveIntensity={0.12}
            />
          </mesh>
          {/* Crystal shards */}
          {Array.from({ length: 4 }, (_, i) => {
            const angle = (i / 4) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * 1.6,
                  Math.sin(angle) * 1.6,
                  Math.cos(angle * 2) * 0.4
                ]}
                rotation={[angle, angle * 0.5, 0]}
              >
                <tetrahedronGeometry args={[0.15]} />
                <meshBasicMaterial 
                  color="#ef4444" 
                  opacity={0.6} 
                  transparent 
                />
              </mesh>
            );
          })}
        </group>
      </Float>
    </group>
  );
}

// Optimized Particle field with enhanced colors
function ParticleField() {
  const particlesCount = 100;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  const sizes = new Float32Array(particlesCount);
  
  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 14;
    positions[i + 1] = (Math.random() - 0.5) * 9;
    positions[i + 2] = (Math.random() - 0.5) * 9;
    
    // Enhanced color distribution
    const colorChoice = Math.random();
    if (colorChoice < 0.25) {
      colors[i] = 0.23; colors[i + 1] = 0.51; colors[i + 2] = 0.96; // blue
    } else if (colorChoice < 0.5) {
      colors[i] = 0.53; colors[i + 1] = 0.33; colors[i + 2] = 0.96; // purple
    } else if (colorChoice < 0.75) {
      colors[i] = 0.06; colors[i + 1] = 0.71; colors[i + 2] = 0.65; // cyan
    } else {
      colors[i] = 0.06; colors[i + 1] = 0.63; colors[i + 2] = 0.43; // green
    }
    
    sizes[i / 3] = Math.random() * 0.04 + 0.02;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particlesCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particlesCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} sizeAttenuation transparent opacity={0.7} vertexColors />
    </points>
  );
}

export default function ThreeBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 13]} />
        
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-10, -10, -5]} intensity={0.7} color="#3b82f6" />
        <pointLight position={[10, -10, 5]} intensity={0.5} color="#8b5cf6" />
        
        <AnimatedShapes />
        <ParticleField />
        
        {/* Enhanced particle system */}
        <Sparkles 
          count={120} 
          scale={[16, 10, 12]} 
          size={2.5} 
          speed={0.6} 
          opacity={0.7} 
          color="#ffffff"
        />
        
        {/* Floating crystal particles */}
        {Array.from({ length: 12 }, (_, i) => (
          <Float key={i} speed={Math.random() * 2 + 0.8} rotationIntensity={1.2} floatIntensity={1.8}>
            <mesh
              position={[
                (Math.random() - 0.5) * 18,
                Math.random() * 8 - 2,
                (Math.random() - 0.5) * 14
              ]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
            >
              {[<octahedronGeometry args={[Math.random() * 0.12 + 0.06]} />, <tetrahedronGeometry args={[Math.random() * 0.1 + 0.04]} />, <icosahedronGeometry args={[Math.random() * 0.08 + 0.03]} />][Math.floor(Math.random() * 3)]}
              <meshStandardMaterial 
                color="#ffffff" 
                metalness={0.8} 
                roughness={0.2}
                opacity={0.8}
                transparent
                emissive="#ffffff"
                emissiveIntensity={0.1}
              />
            </mesh>
          </Float>
        ))}
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.25}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
