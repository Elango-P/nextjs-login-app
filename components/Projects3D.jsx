"use client";

import { Canvas } from '@react-three/fiber';
import { Text as Text3DComponent, Box, Plane, Float, Sparkles, Environment, Stars, useTexture } from '@react-three/drei';
import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';

// Professional 3D Project Card Component
function ProjectCard3D({ project, index, position, onClick }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.03), 50);
    return () => clearInterval(interval);
  }, []);
  
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
  const color = colors[index % colors.length];

  return (
    <group position={position}>
      {/* Glow effect */}
      <mesh
        position={[0, 0, -0.2]}
        scale={hovered ? [3.5, 2.5, 1] : [3.2, 2.2, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={hovered ? 0.4 : 0.2}
        />
      </mesh>
      
      <Float 
        speed={hovered ? 3 : 1.5} 
        rotationIntensity={hovered ? 1.5 : 0.3} 
        floatIntensity={hovered ? 2 : 1}
      >
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onClick}
          scale={hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
          rotation={[0, time * 0.2, Math.sin(time) * 0.1]}
        >
          <boxGeometry args={[3, 2, 0.15]} />
          <meshPhysicalMaterial 
            color={color} 
            metalness={0.7} 
            roughness={0.2}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            envMapIntensity={2}
            emissive={hovered ? color : '#000000'}
            emissiveIntensity={hovered ? 0.3 : 0.05}
          />
        </mesh>
      </Float>
      
      {/* Orbiting particles */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2 + time * 2;
        const radius = hovered ? 2 : 1.8;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * 0.8,
              Math.sin(angle) * radius * 0.3
            ]}
          >
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={color} opacity={0.9} transparent />
          </mesh>
        );
      })}
      
      {/* Enhanced Card content */}
      <group position={[0, 0, 0.08]}>
        {/* Glass overlay */}
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[2.9, 1.9, 0.01]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            metalness={0} 
            roughness={0}
            transmission={0.9}
            thickness={0.1}
            envMapIntensity={1}
            transparent
            opacity={0.9}
          />
        </mesh>
        
        {/* Title background */}
        <mesh position={[0, 0.6, 0.02]}>
          <planeGeometry args={[2.8, 0.4]} />
          <meshPhysicalMaterial 
            color={color} 
            metalness={0.5} 
            roughness={0.3}
            envMapIntensity={1}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Title text */}
        <Text3DComponent
          position={[0, 0.6, 0.03]}
          fontSize={hovered ? 0.17 : 0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.5}
        >
          {project.title || 'Project Title'}
        </Text3DComponent>
        
        {/* Description background */}
        <mesh position={[0, -0.1, 0.02]}>
          <planeGeometry args={[2.8, 0.8]} />
          <meshPhysicalMaterial 
            color="#f8fafc" 
            metalness={0.1} 
            roughness={0.2}
            envMapIntensity={0.5}
            transparent
            opacity={0.9}
          />
        </mesh>
        
        {/* Description text */}
        <Text3DComponent
          position={[0, -0.1, 0.03]}
          fontSize={hovered ? 0.09 : 0.08}
          color="#1e293b"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.5}
        >
          {project.description || 'Project description goes here...'}
        </Text3DComponent>
        
        {/* Enhanced Tech stack badges */}
        {(project.tech_stack || project.skills || []).slice(0, 3).map((skill, idx) => (
          <group key={idx} position={[-1 + idx * 0.9, -0.7, 0.02]}>
            <mesh scale={hovered ? [1.1, 1.2, 1] : [1, 1, 1]}>
              <boxGeometry args={[0.8, 0.15, 0.01]} />
              <meshPhysicalMaterial 
                color={color} 
                metalness={0.3} 
                roughness={0.4}
                envMapIntensity={1}
                transparent
                opacity={0.8}
              />
            </mesh>
            <Text3DComponent
              position={[0, 0, 0.011]}
              fontSize={hovered ? 0.06 : 0.05}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              maxWidth={0.7}
            >
              {typeof skill === 'string' ? skill : skill.name || 'Tech'}
            </Text3DComponent>
          </group>
        ))}
      </group>
    </group>
  );
}

// Professional 3D Projects Grid
export default function Projects3D({ projects, onProjectClick }) {
  return (
    <div className="w-full h-96 relative">
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
        {/* Professional lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#3b82f6" />
        <pointLight position={[10, -10, 5]} intensity={0.6} color="#8b5cf6" />
        <spotLight position={[0, 10, 0]} intensity={0.7} angle={0.3} penumbra={1} />
        
        {/* Environment */}
        <Environment preset="sunset" background={false} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        {/* Glass platform */}
        <mesh position={[0, -2, -1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 12]} />
          <meshPhysicalMaterial 
            color="#0f172a" 
            metalness={0.8} 
            roughness={0.2}
            transmission={0.3}
            thickness={1}
            envMapIntensity={2}
          />
        </mesh>
        
        {/* Render project cards in enhanced grid */}
        {projects.slice(0, 6).map((project, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;
          const x = (col - 1) * 4.5;
          const y = (row - 0.5) * 3.5;
          
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
        
        {/* Professional particle effects */}
        <Sparkles 
          count={150} 
          scale={[15, 8, 10]} 
          size={3} 
          speed={0.8} 
          opacity={0.7} 
          color="#ffffff"
        />
        
        {/* Floating geometric particles */}
        {Array.from({ length: 20 }, (_, i) => (
          <Float key={i} speed={Math.random() * 2 + 0.5} rotationIntensity={1} floatIntensity={1.5}>
            <mesh
              position={[
                (Math.random() - 0.5) * 15,
                Math.random() * 6 - 2,
                (Math.random() - 0.5) * 10
              ]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
            >
              {[<octahedronGeometry args={[0.1]} />, <tetrahedronGeometry args={[0.08]} />, <icosahedronGeometry args={[0.06]} />][Math.floor(Math.random() * 3)]}
              <meshPhysicalMaterial 
                color="#ffffff" 
                metalness={0.9} 
                roughness={0.1}
                transmission={0.6}
                envMapIntensity={3}
              />
            </mesh>
          </Float>
        ))}
      </Canvas>
    </div>
  );
}
