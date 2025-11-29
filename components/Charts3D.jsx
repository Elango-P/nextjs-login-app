"use client";

import { Canvas } from '@react-three/fiber';
import { Box, Cylinder, Cone, Text as Text3DComponent, Float, Sparkles, Environment, Stars } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

// Enhanced 3D Bar Chart Component
function Bar3D({ value, color, position, label, height = 2, index }) {
  const [hovered, setHovered] = useState(false);
  const [time, setTime] = useState(0);
  const [pulseScale, setPulseScale] = useState(1);
  const actualHeight = (value / 100) * height;
  
  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.04), 60);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseScale(1 + Math.sin(Date.now() * 0.004) * 0.08);
    }, 40);
    return () => clearInterval(pulseInterval);
  }, []);
  
  return (
    <group position={position}>
      {/* Enhanced glow effect with pulse */}
      <mesh
        position={[0, actualHeight / 2, 0]}
        scale={hovered ? [1.5, 1.3, 1.5] : [1.3, 1.1, 1.3]}
      >
        <cylinderGeometry args={[0.6, 0.6, 0.12, 20]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={hovered ? 0.4 : 0.2}
        />
      </mesh>
      
      {/* Energy ring */}
      <mesh
        position={[0, actualHeight / 2, 0]}
        rotation={[0, 0, time * 0.6]}
        scale={hovered ? [1.2, 1.2, 1.2] : [1, 1, 1]}
      >
        <ringGeometry args={[0.5, 0.7, 20]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={hovered ? 0.5 : 0.3}
        />
      </mesh>
      
      {/* Enhanced Bar */}
      <Float speed={hovered ? 2.5 : 1} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh
          position={[0, actualHeight / 2, 0]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? [1.15, 1.1, 1.15] : [pulseScale, 1, pulseScale]}
          rotation={[0, time * 0.4, 0]}
        >
          <boxGeometry args={[0.9, actualHeight, 0.9]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.7} 
            roughness={0.25}
            envMapIntensity={1.8}
            emissive={hovered ? color : '#000000'}
            emissiveIntensity={hovered ? 0.4 : 0.15}
          />
        </mesh>
      </Float>
      
      {/* Enhanced Base */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.18, 20]} />
        <meshStandardMaterial 
          color="#1e293b" 
          metalness={0.6} 
          roughness={0.4}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Enhanced floating particles with trails */}
      {Array.from({ length: 3 }, (_, i) => {
        const angle = (i / 3) * Math.PI * 2 + time * 2;
        const radius = 0.6;
        return (
          <group key={i}>
            {/* Particle trail */}
            <mesh
              position={[
                Math.cos(angle - 0.3) * radius * 0.7,
                actualHeight * (0.2 + i * 0.25),
                Math.sin(angle - 0.3) * radius * 0.7
              ]}
            >
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshBasicMaterial color={color} opacity={0.3} transparent />
            </mesh>
            {/* Main particle */}
            <mesh
              position={[
                Math.cos(angle) * radius,
                actualHeight * (0.3 + i * 0.3),
                Math.sin(angle) * radius
              ]}
              scale={hovered ? [1.4, 1.4, 1.4] : [1, 1, 1]}
            >
              <sphereGeometry args={[0.025, 10, 10]} />
              <meshBasicMaterial 
                color={hovered ? '#ffffff' : color} 
                opacity={hovered ? 0.9 : 0.8} 
                transparent 
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Enhanced Label */}
      <group position={[0, -0.7, 0]}>
        {/* Label background */}
        <mesh position={[0, 0.18, -0.1]}>
          <planeGeometry args={[1.2, 0.35]} />
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
          fontSize={hovered ? 0.18 : 0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text3DComponent>
      </group>
      
      {/* Enhanced Value on hover */}
      {hovered && (
        <group position={[0, actualHeight + 0.8, 0]}>
          <mesh position={[0, 0, -0.1]}>
            <planeGeometry args={[0.9, 0.35]} />
            <meshStandardMaterial 
              color="#fbbf24" 
              metalness={0.5}
              roughness={0.3}
              envMapIntensity={1.5}
              opacity={0.9} 
              transparent 
            />
          </mesh>
          <Text3DComponent
            fontSize={0.2}
            color="#000000"
            anchorX="center"
            anchorY="middle"
          >
            {value}%
          </Text3DComponent>
        </group>
      )}
    </group>
  );
}

// Enhanced 3D Line Chart Points
function LinePoint3D({ position, value, color, label, index }) {
  const [hovered, setHovered] = useState(false);
  const [time, setTime] = useState(0);
  const [pulseScale, setPulseScale] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.04), 60);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseScale(1 + Math.sin(Date.now() * 0.005 + index) * 0.1);
    }, 40);
    return () => clearInterval(pulseInterval);
  }, [index]);
  
  return (
    <group position={position}>
      {/* Enhanced glow effect with pulse */}
      <mesh scale={hovered ? [1.8, 1.8, 1.8] : [1.5, 1.5, 1.5]}>
        <sphereGeometry args={[0.15, 20, 20]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={hovered ? 0.4 : 0.2}
        />
      </mesh>
      
      {/* Energy ring */}
      <mesh 
        rotation={[0, 0, time * 0.8]}
        scale={hovered ? [1.3, 1.3, 1.3] : [1.1, 1.1, 1.1]}
      >
        <ringGeometry args={[0.2, 0.3, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={hovered ? 0.6 : 0.3}
        />
      </mesh>
      
      {/* Enhanced Point */}
      <Float speed={2} rotationIntensity={1} floatIntensity={0.6}>
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.6 : pulseScale}
          rotation={[time * 0.3, time * 0.4, 0]}
        >
          <octahedronGeometry args={[0.12]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.75} 
            roughness={0.25}
            envMapIntensity={1.8}
            emissive={color}
            emissiveIntensity={hovered ? 0.5 : 0.25}
          />
        </mesh>
      </Float>
      
      {/* Enhanced orbiting particles with trails */}
      {Array.from({ length: 3 }, (_, i) => {
        const angle = (i / 3) * Math.PI * 2 + time * 2.5;
        const radius = 0.3;
        return (
          <group key={i}>
            {/* Particle trail */}
            <mesh
              position={[
                Math.cos(angle - 0.2) * radius * 0.7,
                Math.sin(angle - 0.2) * radius * 0.7,
                0
              ]}
            >
              <sphereGeometry args={[0.01, 6, 6]} />
              <meshBasicMaterial color={color} opacity={0.3} transparent />
            </mesh>
            {/* Main particle */}
            <mesh
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0
              ]}
              scale={hovered ? [1.5, 1.5, 1.5] : [1, 1, 1]}
            >
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshBasicMaterial 
                color={hovered ? '#ffffff' : color} 
                opacity={hovered ? 0.9 : 0.8} 
                transparent 
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Enhanced Label on hover */}
      {hovered && (
        <group position={[0, 0.8, 0]}>
          <mesh position={[0, 0, -0.1]}>
            <planeGeometry args={[1.4, 0.35]} />
            <meshStandardMaterial 
              color="#ffffff" 
              metalness={0.3}
              roughness={0.3}
              envMapIntensity={1.5}
              opacity={0.95} 
              transparent 
            />
          </mesh>
          <Text3DComponent
            fontSize={0.14}
            color="#000000"
            anchorX="center"
            anchorY="middle"
          >
            {label}: {value}
          </Text3DComponent>
        </group>
      )}
    </group>
  );
}

// Enhanced 3D Chart Container
export default function Charts3D({ projects }) {
  const [globalTime, setGlobalTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => setGlobalTime(t => t + 0.03), 50);
    return () => clearInterval(interval);
  }, []);
  
  // Generate sample data based on projects
  const barData = projects.slice(0, 5).map((project, index) => ({
    label: project.title?.substring(0, 8) || `P${index + 1}`,
    value: Math.floor(Math.random() * 60) + 40,
    color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index]
  }));
  
  const lineData = projects.slice(0, 6).map((project, index) => ({
    label: project.title?.substring(0, 6) || `P${index + 1}`,
    value: Math.floor(Math.random() * 50) + 30,
    position: [(index - 2.5) * 1.6, (Math.random() * 2) - 1, 0]
  }));

  return (
    <div className="w-full h-80 relative">
      <Canvas camera={{ position: [0, 3, 12], fov: 60 }}>
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.4} />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#3b82f6" />
        <pointLight position={[10, -10, 5]} intensity={0.6} color="#10b981" />
        
        {/* Enhanced base platform with grid */}
        <group>
          {/* Main platform */}
          <mesh position={[0, -0.5, -2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[24, 14]} />
            <meshStandardMaterial 
              color="#1f2937" 
              metalness={0.3} 
              roughness={0.7}
              envMapIntensity={0.5}
            />
          </mesh>
          
          {/* Grid lines */}
          {Array.from({ length: 7 }, (_, i) => (
            <mesh
              key={`h-${i}`}
              position={[0, -0.48, -6 + i * 2]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[24, 0.04]} />
              <meshBasicMaterial color="#374151" opacity={0.4} transparent />
            </mesh>
          ))}
        </group>
        
        {/* Enhanced 3D Bar Chart */}
        <group position={[-4.5, 0, 0]}>
          {barData.map((data, index) => (
            <Bar3D
              key={index}
              value={data.value}
              color={data.color}
              position={[(index - 2) * 1.6, 0, 0]}
              label={data.label}
              height={3.8}
              index={index}
            />
          ))}
          
          {/* Enhanced Chart title */}
          <group position={[0, 4.5, 0]}>
            <mesh position={[0, 0, -0.1]}>
              <planeGeometry args={[2.8, 0.7]} />
              <meshStandardMaterial 
                color="#3b82f6" 
                metalness={0.3}
                roughness={0.4}
                envMapIntensity={1.5}
                opacity={0.3} 
                transparent 
              />
            </mesh>
            <Text3DComponent
              fontSize={0.35}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              Project Metrics
            </Text3DComponent>
          </group>
        </group>
        
        {/* Enhanced 3D Line Chart */}
        <group position={[4.5, 0, 0]}>
          {/* Enhanced connecting lines */}
          {lineData.slice(0, -1).map((point, index) => {
            const nextPoint = lineData[index + 1];
            return (
              <line key={index}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([
                      point.position[0], point.position[1], point.position[2],
                      nextPoint.position[0], nextPoint.position[1], nextPoint.position[2]
                    ])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#10b981" linewidth={3} />
              </line>
            );
          })}
          
          {/* Enhanced line points */}
          {lineData.map((point, index) => (
            <LinePoint3D
              key={index}
              position={point.position}
              value={point.value}
              color="#10b981"
              label={point.label}
              index={index}
            />
          ))}
          
          {/* Enhanced Chart title */}
          <group position={[0, 4.5, 0]}>
            <mesh position={[0, 0, -0.1]}>
              <planeGeometry args={[2.8, 0.7]} />
              <meshStandardMaterial 
                color="#10b981" 
                metalness={0.3}
                roughness={0.4}
                envMapIntensity={1.5}
                opacity={0.3} 
                transparent 
              />
            </mesh>
            <Text3DComponent
              fontSize={0.35}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              Activity Trend
            </Text3DComponent>
          </group>
        </group>
        
        {/* Enhanced particle system */}
        <Sparkles 
          count={120} 
          scale={[20, 10, 14]} 
          size={2.5} 
          speed={0.7} 
          opacity={0.7} 
          color="#ffffff"
        />
        
        {/* Enhanced floating particles */}
        {Array.from({ length: 18 }, (_, i) => (
          <Float key={i} speed={Math.random() * 2 + 0.8} rotationIntensity={1} floatIntensity={1.8}>
            <mesh
              position={[
                (Math.random() - 0.5) * 18,
                Math.random() * 6,
                (Math.random() - 0.5) * 12
              ]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
            >
              {[<octahedronGeometry args={[0.08]} />, <tetrahedronGeometry args={[0.06]} />, <icosahedronGeometry args={[0.05]} />][Math.floor(Math.random() * 3)]}
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
