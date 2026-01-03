import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { ConceptPreview } from '../../types/state';

interface ConceptPreviewSceneProps {
  preview: ConceptPreview;
  size?: { width: number; height: number };
}

function FloatingParticles({ color, count = 50 }: { color: string; count?: number }) {
  const mesh = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
      const positions = mesh.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
      }
      mesh.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={color} transparent opacity={0.6} />
    </points>
  );
}

function EnvironmentElement({ type, color, position, scale = 1 }: { 
  type: string; 
  color: string; 
  position: [number, number, number]; 
  scale?: number 
}) {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05;
    }
  });
  
  const geometry = useMemo(() => {
    switch (type) {
      case 'ground':
        return <planeGeometry args={[scale, scale]} />;
      case 'pillar':
      case 'pillars':
        return <cylinderGeometry args={[0.3 * scale, 0.3 * scale, 3 * scale, 8]} />;
      case 'platform':
      case 'benches':
        return <boxGeometry args={[2 * scale, 0.3 * scale, 1 * scale]} />;
      case 'rails':
        return <boxGeometry args={[8 * scale, 0.1 * scale, 0.1 * scale]} />;
      case 'walls':
      case 'storefronts':
        return <boxGeometry args={[3 * scale, 2 * scale, 0.2 * scale]} />;
      case 'fountain':
        return <cylinderGeometry args={[1.5 * scale, 2 * scale, 0.5 * scale, 16]} />;
      case 'creeping vines':
      case 'organic growths':
        return <torusKnotGeometry args={[0.3 * scale, 0.1 * scale, 64, 8]} />;
      default:
        return <boxGeometry args={[scale, scale, scale]} />;
    }
  }, [type, scale]);
  
  const rotation: [number, number, number] = type === 'ground' ? [-Math.PI / 2, 0, 0] : [0, 0, 0];
  
  return (
    <mesh ref={mesh} position={position} rotation={rotation}>
      {geometry}
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
    </mesh>
  );
}

function Scene({ preview }: { preview: ConceptPreview }) {
  const config = preview.sceneConfig;
  
  if (!config) {
    return (
      <>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.5} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#6366f1" />
        </mesh>
      </>
    );
  }
  
  return (
    <>
      <color attach="background" args={[config.backgroundColor]} />
      <fog attach="fog" args={[config.fogColor || config.backgroundColor, 5, 25]} />
      
      <ambientLight intensity={0.2} color={config.ambientLight} />
      <pointLight position={[0, 5, 0]} intensity={0.4} color={config.ambientLight} />
      <directionalLight position={[5, 10, 5]} intensity={0.3} color="#ffffff" />
      
      {config.elements.map((el, index) => {
        if (el.type === 'ambientParticles') {
          return <FloatingParticles key={index} color={el.color} count={80} />;
        }
        if (el.type === 'fog') {
          return null;
        }
        return (
          <EnvironmentElement
            key={index}
            type={el.type}
            color={el.color}
            position={el.position}
            scale={el.scale}
          />
        );
      })}
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate 
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

export const ConceptPreviewScene: React.FC<ConceptPreviewSceneProps> = ({ 
  preview, 
  size = { width: 300, height: 200 } 
}) => {
  return (
    <div style={{ width: size.width, height: size.height, borderRadius: 8, overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        <Scene preview={preview} />
      </Canvas>
    </div>
  );
};

export default ConceptPreviewScene;
