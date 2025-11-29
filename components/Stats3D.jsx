"use client";

import { Canvas } from '@react-three/fiber';
import { Text3D, Center, Float, Box, Sphere, Cylinder, Cone, Text as Text3DComponent, Stars, Sparkles, useTexture, Environment } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

// Enhanced 3D Stat Card Component
function StatCard3D({ title, value, color, position, geometry = 'box' }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const groupRef = useRef();
  const [time, setTime] = useState(0);
  const [pulseScale, setPulseScale] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.04), 60);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseScale(1 + Math.sin(Date.now() * 0.003) * 0.06);
    }, 40);
    return () => clearInterval(pulseInterval);
  }, []);
  
  const getGeometry = () => {
    switch(geometry) {
      case 'sphere':
        return <sphereGeometry args={[0.9, 36, 36]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.7, 0.7, 1.4, 36]} />;
      case 'cone':
        return <coneGeometry args={[0.9, 1.4, 36]} />;
      case 'torus':
        return <torusGeometry args={[0.7, 0.35, 36, 36]} />;
      default:
        return <boxGeometry args={[1.3, 1.3, 1.3]} />;
    }
  };

  return (
    <group position={position} ref={groupRef}>
      {/* Enhanced glow effect with pulse */}
      <mesh scale={hovered ? [2, 2, 2] : [1.7, 1.7, 1.7]} position={[0, 0, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={hovered ? 0.4 : 0.2}
        />
      </mesh>
      
      {/* Energy ring */}
      <mesh 
        position={[0, 0, 0]} 
        rotation={[Math.PI / 2, 0, time * 0.5]}
        scale={hovered ? [1.5, 1.5, 1.5] : [1.3, 1.3, 1.3]}
      >
        <ringGeometry args={[1.1, 1.3, 24]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={hovered ? 0.5 : 0.3}
        />
      </mesh>
      
      <Float 
        speed={hovered ? 3.5 : 2} 
        rotationIntensity={hovered ? 2 : 0.8} 
        floatIntensity={hovered ? 2.5 : 2}
      >
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? [1.25, 1.25, 1.25] : [pulseScale, pulseScale, pulseScale]}
          rotation={[time * 0.4, time * 0.25, 0]}
        >
          {getGeometry()}
          <meshStandardMaterial 
            color={color} 
            metalness={0.75} 
            roughness={0.25}
            envMapIntensity={1.8}
            emissive={hovered ? color : '#000000'}
            emissiveIntensity={hovered ? 0.4 : 0.15}
          />
        </mesh>
      </Float>
      
      {/* Enhanced orbiting particles with trails */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i / 4) * Math.PI * 2 + time * 1.5;
        const radius = 1.4;
        return (
          <group key={i}>
            {/* Particle trail */}
            <mesh
              position={[
                Math.cos(angle - 0.2) * radius * 0.8,
                Math.sin((angle - 0.2) * 2) * 0.3,
                Math.sin(angle - 0.2) * radius * 0.8
              ]}
            >
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color={color} opacity={0.3} transparent />
            </mesh>
            {/* Main particle */}
            <mesh
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle * 2) * 0.3,
                Math.sin(angle) * radius
              ]}
              scale={hovered ? [1.3, 1.3, 1.3] : [1, 1, 1]}
            >
              <sphereGeometry args={[0.04, 10, 10]} />
              <meshBasicMaterial 
                color={hovered ? '#ffffff' : color} 
                opacity={hovered ? 0.9 : 0.8} 
                transparent 
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Enhanced Text label with background */}
      <group position={[0, -2.2, 0]}>
        {/* Text background panel */}
        <mesh position={[0, 0.3, -0.1]}>
          <planeGeometry args={[2.2, 0.7]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.3} 
            roughness={0.4}
            envMapIntensity={1}
            transparent
            opacity={hovered ? 0.25 : 0.15}
          />
        </mesh>
        <Text3DComponent
          fontSize={hovered ? 0.35 : 0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {value}
        </Text3DComponent>
        <Text3DComponent
          position={[0, -0.6, 0]}
          fontSize={hovered ? 0.18 : 0.15}
          color="#e5e7eb"
          anchorX="center"
          anchorY="middle"
        >
          {title}
        </Text3DComponent>
      </group>
    </group>
  );
}

// Enhanced 3D Stats Dashboard
export default function Stats3D({ projects, experience, education, skills }) {
  const stats = [
    {
      title: "Projects",
      value: projects?.length || 0,
      color: "#3b82f6",
      position: [-4, 1, 0],
      geometry: 'box'
    },
    {
      title: "Experience",
      value: experience?.length || 0,
      color: "#10b981",
      position: [-1.3, 1, 0],
      geometry: 'sphere'
    },
    {
      title: "Education",
      value: education?.length || 0,
      color: "#f59e0b",
      position: [1.3, 1, 0],
      geometry: 'cylinder'
    },
    {
      title: "Skills",
      value: skills?.length || 0,
      color: "#8b5cf6",
      position: [4, 1, 0],
      geometry: 'torus'
    }
  ];

  return (
    <div className="w-full h-64 relative">
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.3} />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#3b82f6" />
        <pointLight position={[10, -10, 5]} intensity={0.6} color="#8b5cf6" />
        
        {/* Enhanced background platform with grid */}
        <group>
          {/* Main platform */}
          <mesh position={[0, -1, -2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[22, 12]} />
            <meshStandardMaterial 
              color="#1f2937" 
              metalness={0.3} 
              roughness={0.7}
              envMapIntensity={0.5}
            />
          </mesh>
          
          {/* Grid lines */}
          {Array.from({ length: 6 }, (_, i) => (
            <mesh
              key={`h-${i}`}
              position={[0, -0.98, -5 + i * 2]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[22, 0.04]} />
              <meshBasicMaterial color="#374151" opacity={0.4} transparent />
            </mesh>
          ))}
        </group>
        
        {/* Render enhanced stat cards */}
        {stats.map((stat, index) => (
          <StatCard3D key={index} {...stat} />
        ))}
        
        {/* Enhanced particle system */}
        <Sparkles 
          count={100} 
          scale={[12, 8, 12]} 
          size={2} 
          speed={0.6} 
          opacity={0.7} 
          color="#ffffff"
        />
        
        {/* Enhanced floating particles */}
        {Array.from({ length: 20 }, (_, i) => (
          <Float key={i} speed={Math.random() * 2 + 0.8} rotationIntensity={0.8} floatIntensity={1.5}>
            <mesh
              position={[
                (Math.random() - 0.5) * 12,
                Math.random() * 4 - 1,
                (Math.random() - 0.5) * 8
              ]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
            >
              <dodecahedronGeometry args={[Math.random() * 0.1 + 0.05]} />
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
      </Canvas>
    </div>
  );
}
