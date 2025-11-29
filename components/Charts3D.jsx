"use client";

import { Canvas } from '@react-three/fiber';
import { Box, Cylinder, Cone, Text as Text3DComponent, Float, Sparkles, Environment, Stars } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

// Professional 3D Bar Chart Component
function Bar3D({ value, color, position, label, height = 2, index }) {
  const [hovered, setHovered] = useState(false);
  const [time, setTime] = useState(0);
  const actualHeight = (value / 100) * height;
  
  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.05), 50);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <group position={position}>
      {/* Glow effect */}
      <mesh
        position={[0, actualHeight / 2, 0]}
        scale={hovered ? [1.5, 1.2, 1.5] : [1.2, 1, 1.2]}
      >
        <cylinderGeometry args={[0.6, 0.6, 0.1, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={hovered ? 0.4 : 0.2}
        />
      </mesh>
      
      {/* Enhanced Bar */}
      <Float speed={hovered ? 3 : 1} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh
          position={[0, actualHeight / 2, 0]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? [1.15, 1.1, 1.15] : [1, 1, 1]}
          rotation={[0, time * 0.5, 0]}
        >
          <boxGeometry args={[0.8, actualHeight, 0.8]} />
          <meshPhysicalMaterial 
            color={color} 
            metalness={0.8} 
            roughness={0.15}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            envMapIntensity={2}
            emissive={hovered ? color : '#000000'}
            emissiveIntensity={hovered ? 0.4 : 0.1}
          />
        </mesh>
      </Float>
      
      {/* Enhanced Base */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.15, 32]} />
        <meshPhysicalMaterial 
          color="#1e293b" 
          metalness={0.7} 
          roughness={0.3}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Floating particles around bar */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i / 4) * Math.PI * 2 + time * 2;
        const radius = 0.6;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              actualHeight * (0.2 + i * 0.2),
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color={color} opacity={0.8} transparent />
          </mesh>
        );
      })}
      
      {/* Enhanced Label */}
      <group position={[0, -0.8, 0]}>
        <mesh position={[0, 0.2, -0.1]}>
          <planeGeometry args={[1.2, 0.4]} />
          <meshBasicMaterial 
            color={color} 
            opacity={0.3} 
            transparent 
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
            <planeGeometry args={[1, 0.4]} />
            <meshBasicMaterial 
              color="#fbbf24" 
              opacity={0.8} 
              transparent 
            />
          </mesh>
          <Text3DComponent
            fontSize={0.22}
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

// Professional 3D Line Chart Points
function LinePoint3D({ position, value, color, label, index }) {
  const [hovered, setHovered] = useState(false);
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.05), 50);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <group position={position}>
      {/* Glow effect */}
      <mesh scale={hovered ? [2, 2, 2] : [1.5, 1.5, 1.5]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={hovered ? 0.3 : 0.15}
        />
      </mesh>
      
      {/* Enhanced Point */}
      <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.8 : 1}
          rotation={[time * 0.3, time * 0.5, 0]}
        >
          <octahedronGeometry args={[0.12]} />
          <meshPhysicalMaterial 
            color={color} 
            metalness={0.9} 
            roughness={0.1}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            envMapIntensity={2}
            emissive={color}
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>
      
      {/* Orbiting particles */}
      {Array.from({ length: 3 }, (_, i) => {
        const angle = (i / 3) * Math.PI * 2 + time * 3;
        const radius = 0.3;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius,
              0
            ]}
          >
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color={color} opacity={0.9} transparent />
          </mesh>
        );
      })}
      
      {/* Enhanced Label on hover */}
      {hovered && (
        <group position={[0, 0.8, 0]}>
          <mesh position={[0, 0, -0.1]}>
            <planeGeometry args={[1.5, 0.4]} />
            <meshBasicMaterial 
              color="#ffffff" 
              opacity={0.9} 
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

// Professional 3D Chart Container
export default function Charts3D({ projects }) {
  // Generate sample data based on projects
  const barData = projects.slice(0, 5).map((project, index) => ({
    label: project.title?.substring(0, 8) || `P${index + 1}`,
    value: Math.floor(Math.random() * 60) + 40,
    color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index]
  }));
  
  const lineData = projects.slice(0, 6).map((project, index) => ({
    label: project.title?.substring(0, 6) || `P${index + 1}`,
    value: Math.floor(Math.random() * 50) + 30,
    position: [(index - 2.5) * 1.5, (Math.random() * 2) - 1, 0]
  }));

  return (
    <div className="w-full h-80 relative">
      <Canvas camera={{ position: [0, 3, 12], fov: 60 }}>
        {/* Professional lighting setup */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#3b82f6" />
        <pointLight position={[10, -10, 5]} intensity={0.6} color="#10b981" />
        <spotLight position={[0, 10, 0]} intensity={0.7} angle={0.3} penumbra={1} />
        
        {/* Environment and effects */}
        <Environment preset="city" background={false} />
        <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={1} />
        
        {/* Enhanced base platform */}
        <mesh position={[0, -0.5, -2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 12]} />
          <meshPhysicalMaterial 
            color="#0f172a" 
            metalness={0.8} 
            roughness={0.2}
            envMapIntensity={2}
          />
        </mesh>
        
        {/* Glass platform */}
        <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[15, 10]} />
          <meshPhysicalMaterial 
            color="#1e293b" 
            metalness={0.1} 
            roughness={0.1}
            transmission={0.8}
            thickness={0.5}
            envMapIntensity={2}
          />
        </mesh>
        
        {/* Professional 3D Bar Chart */}
        <group position={[-4, 0, 0]}>
          {barData.map((data, index) => (
            <Bar3D
              key={index}
              value={data.value}
              color={data.color}
              position={[(index - 2) * 1.5, 0, 0]}
              label={data.label}
              height={3.5}
              index={index}
            />
          ))}
          
          {/* Enhanced Chart title */}
          <group position={[0, 4.5, 0]}>
            <mesh position={[0, 0, -0.1]}>
              <planeGeometry args={[3, 0.8]} />
              <meshBasicMaterial 
                color="#3b82f6" 
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
        
        {/* Professional 3D Line Chart */}
        <group position={[4, 0, 0]}>
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
              <planeGeometry args={[3, 0.8]} />
              <meshBasicMaterial 
                color="#10b981" 
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
        
        {/* Professional particle system */}
        <Sparkles 
          count={120} 
          scale={[18, 8, 12]} 
          size={2.5} 
          speed={0.6} 
          opacity={0.7} 
          color="#ffffff"
        />
        
        {/* Floating data particles */}
        {Array.from({ length: 25 }, (_, i) => (
          <Float key={i} speed={Math.random() * 2 + 0.5} rotationIntensity={0.5} floatIntensity={1}>
            <mesh
              position={[
                (Math.random() - 0.5) * 16,
                Math.random() * 5,
                (Math.random() - 0.5) * 10
              ]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
            >
              {[<octahedronGeometry args={[0.08]} />, <tetrahedronGeometry args={[0.06]} />, <icosahedronGeometry args={[0.05]} />][Math.floor(Math.random() * 3)]}
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
