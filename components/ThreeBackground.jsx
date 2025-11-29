"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Text3D, Center, PerspectiveCamera, Stars, Sparkles, Environment } from '@react-three/drei';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// Professional Animated geometric shapes
function AnimatedShapes() {
  const groupRef = useRef();
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.02), 50);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <group ref={groupRef}>
      {/* Floating Cube with enhanced materials */}
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2.5}>
        <mesh position={[-4, 2, 0]} rotation={[0.4, 0.4, time * 0.5]}>
          <boxGeometry args={[1.8, 1.8, 1.8]} />
          <meshPhysicalMaterial 
            color="#3b82f6" 
            metalness={0.9} 
            roughness={0.1}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            envMapIntensity={2}
            emissive="#3b82f6"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>

      {/* Rotating Torus with glow */}
      <Float speed={2} rotationIntensity={2.5} floatIntensity={1.5}>
        <group position={[4, -1, 0]} rotation={[Math.PI / 4, time * 0.3, 0]}>
          <mesh>
            <torusGeometry args={[1.2, 0.5, 32, 64]} />
            <meshPhysicalMaterial 
              color="#8b5cf6" 
              metalness={0.8} 
              roughness={0.15}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
              envMapIntensity={2}
              emissive="#8b5cf6"
              emissiveIntensity={0.15}
            />
          </mesh>
          {/* Orbiting ring */}
          <mesh rotation={[Math.PI / 2, 0, time]}>
            <torusGeometry args={[1.8, 0.05, 16, 32]} />
            <meshPhysicalMaterial 
              color="#ffffff" 
              metalness={1} 
              roughness={0}
              transmission={0.8}
              thickness={0.1}
              envMapIntensity={3}
            />
          </mesh>
        </group>
      </Float>

      {/* Pulsating Sphere with particles */}
      <Float speed={3.5} rotationIntensity={0.8} floatIntensity={3.5}>
        <group position={[0, 3, -2]}>
          <mesh scale={[1 + Math.sin(time * 2) * 0.1, 1 + Math.sin(time * 2) * 0.1, 1 + Math.sin(time * 2) * 0.1]}>
            <sphereGeometry args={[1.5, 64, 64]} />
            <meshPhysicalMaterial 
              color="#10b981" 
              metalness={0.7} 
              roughness={0.2}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
              envMapIntensity={2}
              emissive="#10b981"
              emissiveIntensity={0.25}
            />
          </mesh>
          {/* Orbiting particles */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2 + time * 1.5;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * 2.2,
                  Math.sin(angle * 2) * 0.5,
                  Math.sin(angle) * 2.2
                ]}
              >
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshPhysicalMaterial 
                  color="#10b981" 
                  metalness={0.9} 
                  roughness={0.1}
                  emissive="#10b981"
                  emissiveIntensity={0.5}
                />
              </mesh>
            );
          })}
        </group>
      </Float>

      {/* Spinning Cone with energy field */}
      <Float speed={3} rotationIntensity={3.5} floatIntensity={2}>
        <group position={[-3, -2, 1]} rotation={[0, Math.PI / 4, time * 0.8]}>
          <mesh>
            <coneGeometry args={[1, 2, 32]} />
            <meshPhysicalMaterial 
              color="#f59e0b" 
              metalness={0.85} 
              roughness={0.12}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
              envMapIntensity={2}
              emissive="#f59e0b"
              emissiveIntensity={0.2}
            />
          </mesh>
          {/* Energy field */}
          <mesh scale={[1.5, 1.5, 1.5]}>
            <coneGeometry args={[1.2, 2.4, 16]} />
            <meshBasicMaterial 
              color="#f59e0b" 
              transparent 
              opacity={0.3}
              side={THREE.BackSide}
            />
          </mesh>
        </group>
      </Float>

      {/* Floating Dodecahedron with crystal effect */}
      <Float speed={2.3} rotationIntensity={2} floatIntensity={3}>
        <group position={[3, 2, -1]} rotation={[time * 0.3, time * 0.5, 0]}>
          <mesh>
            <dodecahedronGeometry args={[1.2]} />
            <meshPhysicalMaterial 
              color="#ef4444" 
              metalness={0.6} 
              roughness={0.25}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
              transmission={0.3}
              thickness={0.5}
              envMapIntensity={2}
              emissive="#ef4444"
              emissiveIntensity={0.15}
            />
          </mesh>
          {/* Crystal shards */}
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * 1.8,
                  Math.sin(angle) * 1.8,
                  Math.cos(angle * 2) * 0.5
                ]}
                rotation={[angle, angle * 0.5, 0]}
              >
                <tetrahedronGeometry args={[0.2]} />
                <meshPhysicalMaterial 
                  color="#ffffff" 
                  metalness={0.9} 
                  roughness={0.1}
                  transmission={0.7}
                  envMapIntensity={3}
                />
              </mesh>
            );
          })}
        </group>
      </Float>
      
      {/* Additional floating geometric shapes */}
      <Float speed={1.8} rotationIntensity={1} floatIntensity={2.5}>
        <mesh position={[-6, 0, 2]} rotation={[time * 0.4, time * 0.6, 0]}>
          <octahedronGeometry args={[0.8]} />
          <meshPhysicalMaterial 
            color="#06b6d4" 
            metalness={0.8} 
            roughness={0.15}
            clearcoat={1.0}
            envMapIntensity={2}
            emissive="#06b6d4"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>
      
      <Float speed={2.8} rotationIntensity={2.2} floatIntensity={1.8}>
        <mesh position={[6, 1, -3]} rotation={[time * 0.3, time * 0.7, time * 0.5]}>
          <icosahedronGeometry args={[0.7]} />
          <meshPhysicalMaterial 
            color="#a855f7" 
            metalness={0.75} 
            roughness={0.18}
            clearcoat={1.0}
            envMapIntensity={2}
            emissive="#a855f7"
            emissiveIntensity={0.18}
          />
        </mesh>
      </Float>
    </group>
  );
}

// Professional Particle field with multiple layers
function ParticleField() {
  const particlesCount = 200;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 15;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 10;
    
    // Random colors for particles
    const colorChoice = Math.random();
    if (colorChoice < 0.2) {
      colors[i] = 0.23; colors[i + 1] = 0.51; colors[i + 2] = 0.96; // blue
    } else if (colorChoice < 0.4) {
      colors[i] = 0.06; colors[i + 1] = 0.71; colors[i + 2] = 0.65; // cyan
    } else if (colorChoice < 0.6) {
      colors[i] = 0.53; colors[i + 1] = 0.33; colors[i + 2] = 0.96; // purple
    } else if (colorChoice < 0.8) {
      colors[i] = 0.06; colors[i + 1] = 0.63; colors[i + 2] = 0.43; // green
    } else {
      colors[i] = 0.96; colors[i + 1] = 0.33; colors[i + 2] = 0.27; // red
    }
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
      </bufferGeometry>
      <pointsMaterial size={0.03} sizeAttenuation transparent opacity={0.8} vertexColors />
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
        <PerspectiveCamera makeDefault position={[0, 0, 15]} />
        
        {/* Professional lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#3b82f6" />
        <pointLight position={[10, -10, 5]} intensity={0.6} color="#8b5cf6" />
        <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} />
        
        {/* Environment and effects */}
        <Environment preset="city" background={false} />
        <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
        
        <AnimatedShapes />
        <ParticleField />
        
        {/* Professional particle system */}
        <Sparkles 
          count={200} 
          scale={[20, 12, 15]} 
          size={3} 
          speed={0.7} 
          opacity={0.6} 
          color="#ffffff"
        />
        
        {/* Floating crystal particles */}
        {Array.from({ length: 15 }, (_, i) => (
          <Float key={i} speed={Math.random() * 2 + 0.5} rotationIntensity={1} floatIntensity={2}>
            <mesh
              position={[
                (Math.random() - 0.5) * 20,
                Math.random() * 8 - 2,
                (Math.random() - 0.5) * 15
              ]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
            >
              {[<octahedronGeometry args={[Math.random() * 0.15 + 0.05]} />, <tetrahedronGeometry args={[Math.random() * 0.12 + 0.04]} />, <icosahedronGeometry args={[Math.random() * 0.1 + 0.03]} />][Math.floor(Math.random() * 3)]}
              <meshPhysicalMaterial 
                color="#ffffff" 
                metalness={0.9} 
                roughness={0.1}
                transmission={0.7}
                envMapIntensity={3}
              />
            </mesh>
          </Float>
        ))}
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
