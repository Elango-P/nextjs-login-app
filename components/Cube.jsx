'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';

function RotatingCube({ position = [0, 0, 0], color = 'hotpink', map = null }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color={color} 
        map={map}
        metalness={0.1}
        roughness={0.2}
      />
    </mesh>
  );
}

export default function CubeScene({ project }) {
  return (
    <div className="w-full h-48 md:h-64 relative">
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <RotatingCube 
          position={[0, 0, 0]}
          color={project?.color || '#6366f1'}
        />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
}
