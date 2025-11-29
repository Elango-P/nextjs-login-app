"use client";

import { Canvas } from '@react-three/fiber';
import { Text3D, Center, Float, Box, Sphere, Cylinder, Cone, Text as Text3DComponent, Stars, Sparkles, useTexture, Environment } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

// 3D Stat Card Component with Professional Animations
function StatCard3D({ title, value, color, position, geometry = 'box' }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const groupRef = useRef();
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.05), 50);
    return () => clearInterval(interval);
  }, []);
  
  const getGeometry = () => {
    switch(geometry) {
      case 'sphere':
        return <sphereGeometry args={[0.8, 64, 64]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.6, 0.6, 1.2, 64]} />;
      case 'cone':
        return <coneGeometry args={[0.8, 1.2, 64]} />;
      case 'torus':
        return <torusGeometry args={[0.6, 0.3, 64, 64]} />;
      case 'octahedron':
        return <octahedronGeometry args={[0.8]} />;
      default:
        return <boxGeometry args={[1.2, 1.2, 1.2]} />;
    }
  };

  return (
    <group position={position} ref={groupRef}>
      {/* Animated glow effect */}
      <mesh scale={hovered ? [2, 2, 2] : [1.5, 1.5, 1.5]} position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={hovered ? 0.3 : 0.15}
        />
      </mesh>
      
      <Float 
        speed={hovered ? 4 : 2} 
        rotationIntensity={hovered ? 2 : 0.5} 
        floatIntensity={hovered ? 3 : 2}
      >
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? [1.3, 1.3, 1.3] : [1, 1, 1]}
          rotation={[time * 0.5, time * 0.3, 0]}
        >
          {getGeometry()}
          <meshPhysicalMaterial 
            color={color} 
            metalness={0.9} 
            roughness={0.1}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            envMapIntensity={2}
            emissive={hovered ? color : '#000000'}
            emissiveIntensity={hovered ? 0.5 : 0.1}
          />
        </mesh>
      </Float>
      
      {/* Orbiting particles */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2 + time;
        const radius = 1.5;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 2) * 0.3,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color={color} opacity={0.8} transparent />
          </mesh>
        );
      })}
      
      {/* Enhanced Text label with glow */}
      <group position={[0, -2.5, 0]}>
        <mesh position={[0, 0.3, -0.1]}>
          <planeGeometry args={[2, 0.8]} />
          <meshBasicMaterial 
            color={color} 
            opacity={0.2} 
            transparent 
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

// Professional 3D Stats Dashboard
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
        {/* Professional lighting setup */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#3b82f6" />
        <pointLight position={[10, -10, 5]} intensity={0.6} color="#8b5cf6" />
        <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} />
        
        {/* Environment and effects */}
        <Environment preset="city" background={false} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Enhanced background platform */}
        <mesh position={[0, -1, -2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 10]} />
          <meshPhysicalMaterial 
            color="#0f172a" 
            metalness={0.8} 
            roughness={0.2}
            envMapIntensity={1}
          />
        </mesh>
        
        {/* Glass platform */}
        <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[12, 8]} />
          <meshPhysicalMaterial 
            color="#1e293b" 
            metalness={0.1} 
            roughness={0.1}
            transmission={0.9}
            thickness={0.5}
            envMapIntensity={2}
          />
        </mesh>
        
        {/* Render enhanced stat cards */}
        {stats.map((stat, index) => (
          <StatCard3D key={index} {...stat} />
        ))}
        
        {/* Professional particle system */}
        <Sparkles 
          count={100} 
          scale={[10, 6, 10]} 
          size={2} 
          speed={0.5} 
          opacity={0.8} 
          color="#ffffff"
        />
        
        {/* Floating data particles */}
        {Array.from({ length: 30 }, (_, i) => (
          <Float key={i} speed={Math.random() * 2 + 1} rotationIntensity={0.5} floatIntensity={1}>
            <mesh
              position={[
                (Math.random() - 0.5) * 12,
                Math.random() * 4 - 1,
                (Math.random() - 0.5) * 8
              ]}
            >
              <dodecahedronGeometry args={[Math.random() * 0.1 + 0.05]} />
              <meshPhysicalMaterial 
                color="#ffffff" 
                metalness={0.9} 
                roughness={0.1}
                transmission={0.5}
                envMapIntensity={3}
              />
            </mesh>
          </Float>
        ))}
      </Canvas>
    </div>
  );
}
