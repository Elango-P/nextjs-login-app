"use client";

import { Canvas } from '@react-three/fiber';
import { Text as Text3DComponent, Box, Plane, Float, Sparkles, Environment, Stars, useTexture } from '@react-three/drei';
import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';

// Enhanced 3D Project Card Component
function ProjectCard3D({ project, index, position, onClick }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const [time, setTime] = useState(0);
  const [pulseScale, setPulseScale] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.03), 80);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseScale(1 + Math.sin(Date.now() * 0.002) * 0.05);
    }, 50);
    return () => clearInterval(pulseInterval);
  }, []);
  
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
  const color = colors[index % colors.length];

  return (
    <group position={position}>
      {/* Enhanced glow effect with pulse */}
      <mesh
        position={[0, 0, -0.2]}
        scale={hovered ? [3.5, 2.5, 1.2] : [3.2, 2.2, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={hovered ? 0.4 : 0.2}
        />
      </mesh>
      
      {/* Dynamic energy ring */}
      <mesh
        position={[0, 0, -0.1]}
        rotation={[Math.PI / 2, 0, time * 0.5]}
        scale={hovered ? [2.5, 2.5, 1] : [2.2, 2.2, 1]}
      >
        <ringGeometry args={[1.4, 1.6, 32]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={hovered ? 0.6 : 0.3}
        />
      </mesh>
      
      <Float 
        speed={hovered ? 3 : 1.5} 
        rotationIntensity={hovered ? 1.5 : 0.5} 
        floatIntensity={hovered ? 2.2 : 1.2}
      >
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onClick}
          scale={hovered ? [1.12, 1.12, 1.12] : [pulseScale, pulseScale, pulseScale]}
          rotation={[0, time * 0.2, Math.sin(time) * 0.1]}
        >
          <boxGeometry args={[3, 2, 0.15]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.7} 
            roughness={0.25}
            envMapIntensity={1.8}
            emissive={hovered ? color : '#000000'}
            emissiveIntensity={hovered ? 0.35 : 0.08}
          />
        </mesh>
      </Float>
      
      {/* Enhanced orbiting particles with trails */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2 + time * 2;
        const radius = hovered ? 2.2 : 1.8;
        const trailPhase = (i / 6) * Math.PI * 2;
        return (
          <group key={i}>
            {/* Particle trail */}
            <mesh
              position={[
                Math.cos(angle - 0.3) * radius * 0.8,
                Math.sin((angle - 0.3) * 2) * 0.6,
                Math.sin(angle - 0.3) * radius * 0.3
              ]}
            >
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshBasicMaterial color={color} opacity={0.3} transparent />
            </mesh>
            {/* Main particle */}
            <mesh
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle * 2) * 0.8,
                Math.sin(angle) * radius * 0.4
              ]}
              scale={hovered ? [1.3, 1.3, 1.3] : [1, 1, 1]}
            >
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshBasicMaterial 
                color={hovered ? '#ffffff' : color} 
                opacity={hovered ? 0.9 : 0.8} 
                transparent 
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Enhanced Card content with depth */}
      <group position={[0, 0, 0.08]}>
        {/* Glass overlay effect */}
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[2.9, 1.9, 0.02]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.1} 
            roughness={0.1}
            transmission={0.3}
            thickness={0.1}
            envMapIntensity={2}
            transparent
            opacity={hovered ? 0.4 : 0.2}
          />
        </mesh>
        
        {/* Enhanced Title background */}
        <mesh position={[0, 0.6, 0.01]}>
          <planeGeometry args={[2.8, 0.45]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.5} 
            roughness={0.35}
            envMapIntensity={1.2}
            transparent
            opacity={hovered ? 0.95 : 0.85}
          />
        </mesh>
        
        {/* Title text with shadow */}
        <Text3DComponent
          position={[0, 0.6, 0.02]}
          fontSize={hovered ? 0.17 : 0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.5}
        >
          {project.title || 'Project Title'}
        </Text3DComponent>
        
        {/* Enhanced Description background */}
        <mesh position={[0, -0.1, 0.01]}>
          <planeGeometry args={[2.8, 0.85]} />
          <meshStandardMaterial 
            color="#f8fafc" 
            metalness={0.15} 
            roughness={0.25}
            envMapIntensity={0.7}
            transparent
            opacity={hovered ? 0.95 : 0.9}
          />
        </mesh>
        
        {/* Description text */}
        <Text3DComponent
          position={[0, -0.1, 0.02]}
          fontSize={hovered ? 0.09 : 0.08}
          color="#1e293b"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.5}
        >
          {project.description || 'Project description goes here...'}
        </Text3DComponent>
        
        {/* Enhanced Tech stack badges with 3D effect */}
        {(project.tech_stack || project.skills || []).slice(0, 3).map((skill, idx) => (
          <group key={idx} position={[-1 + idx * 0.9, -0.75, 0.01]}>
            {/* Badge background with depth */}
            <mesh 
              scale={hovered ? [1.1, 1.25, 1] : [1, 1, 1]}
              position={[0, 0, -0.005]}
            >
              <boxGeometry args={[0.85, 0.18, 0.02]} />
              <meshStandardMaterial 
                color={color} 
                metalness={0.4} 
                roughness={0.35}
                envMapIntensity={1.2}
                transparent
                opacity={0.9}
              />
            </mesh>
            {/* Badge highlight */}
            <mesh 
              scale={hovered ? [1.08, 1.2, 1] : [0.95, 0.95, 1]}
              position={[0, 0, 0.011]}
            >
              <boxGeometry args={[0.8, 0.15, 0.01]} />
              <meshStandardMaterial 
                color={hovered ? '#ffffff' : color} 
                metalness={0.6} 
                roughness={0.2}
                envMapIntensity={1.5}
                transparent
                opacity={hovered ? 0.9 : 0.8}
              />
            </mesh>
            {/* Tech text */}
            <Text3DComponent
              position={[0, 0, 0.012]}
              fontSize={hovered ? 0.058 : 0.048}
              color={hovered ? color : '#ffffff'}
              anchorX="center"
              anchorY="middle"
              maxWidth={0.75}
            >
              {typeof skill === 'string' ? skill : skill.name || 'Tech'}
            </Text3DComponent>
          </group>
        ))}
        
        {/* Interactive hint */}
        {hovered && (
          <group position={[0, 0.95, 0.02]}>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[1.5, 0.3]} />
              <meshBasicMaterial 
                color="#ffffff" 
                opacity={0.9} 
                transparent 
              />
            </mesh>
            <Text3DComponent
              fontSize={0.08}
              color="#000000"
              anchorX="center"
              anchorY="middle"
            >
              Click to view details
            </Text3DComponent>
          </group>
        )}
      </group>
    </group>
  );
}

// Enhanced 3D Projects Grid
export default function Projects3D({ projects, onProjectClick }) {
  const [globalTime, setGlobalTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => setGlobalTime(t => t + 0.02), 50);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="w-full h-96 relative">
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#3b82f6" />
        <pointLight position={[10, -10, 5]} intensity={0.6} color="#8b5cf6" />
        
        {/* Enhanced platform with grid */}
        <group>
          {/* Main platform */}
          <mesh position={[0, -2, -1]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[25, 15]} />
            <meshStandardMaterial 
              color="#1f2937" 
              metalness={0.3} 
              roughness={0.7}
              envMapIntensity={0.5}
            />
          </mesh>
          
          {/* Grid lines */}
          {Array.from({ length: 8 }, (_, i) => (
            <mesh
              key={`h-${i}`}
              position={[0, -1.98, -7 + i * 2]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[25, 0.05]} />
              <meshBasicMaterial color="#374151" opacity={0.5} transparent />
            </mesh>
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <mesh
              key={`v-${i}`}
              position={[-11 + i * 2, -1.98, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[0.05, 15]} />
              <meshBasicMaterial color="#374151" opacity={0.5} transparent />
            </mesh>
          ))}
        </group>
        
        {/* Render enhanced project cards */}
        {projects.slice(0, 6).map((project, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;
          const baseX = (col - 1) * 4.5;
          const baseY = (row - 0.5) * 3.5;
          
          // Add subtle wave motion
          const x = baseX + Math.sin(globalTime + index) * 0.1;
          const y = baseY + Math.cos(globalTime * 0.7 + index) * 0.05;
          
          return (
            <ProjectCard3D
              key={project.id}
              project={project}
              index={index}
              position={[x, y, 0]}
              onClick={() => onProjectClick && onProjectClick(project)}
            />
          );
        })}
        
        {/* Enhanced particle effects */}
        <Sparkles 
          count={100} 
          scale={[18, 10, 12]} 
          size={2.5} 
          speed={0.7} 
          opacity={0.6} 
          color="#ffffff"
        />
        
        {/* Floating data visualization elements */}
        {Array.from({ length: 15 }, (_, i) => (
          <Float 
            key={i} 
            speed={Math.random() * 1.5 + 0.5} 
            rotationIntensity={1} 
            floatIntensity={1.5}
          >
            <mesh
              position={[
                (Math.random() - 0.5) * 18,
                Math.random() * 7 - 2,
                (Math.random() - 0.5) * 12
              ]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
            >
              {[
                <octahedronGeometry args={[0.08]} />,
                <tetrahedronGeometry args={[0.06]} />,
                <icosahedronGeometry args={[0.05]} />
              ][Math.floor(Math.random() * 3)]}
              <meshStandardMaterial 
                color={[
                  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'
                ][Math.floor(Math.random() * 5)]} 
                metalness={0.8} 
                roughness={0.2}
                opacity={0.8}
                transparent
                emissive={[
                  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'
                ][Math.floor(Math.random() * 5)]}
                emissiveIntensity={0.2}
              />
            </mesh>
          </Float>
        ))}
        
        {/* Ambient floating particles */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2 + globalTime * 0.5;
          return (
            <mesh
              key={`ambient-${i}`}
              position={[
                Math.cos(angle) * 8,
                Math.sin(globalTime + i) * 2,
                Math.sin(angle) * 8
              ]}
            >
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial 
                color="#ffffff" 
                opacity={0.6} 
                transparent 
              />
            </mesh>
          );
        })}
      </Canvas>
    </div>
  );
}
