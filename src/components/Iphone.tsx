import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// 1. Component to load and render the model
const Model = () => {
  // Update this path to match where you placed the files in your public folder
  const { scene } = useGLTF('/models/appl_e_iph_one_16/scene.gltf');
  
  return (
    <primitive 
      object={scene} 
      scale={1} 
      position={[0, 0, 0]} 
      // Optional: Smooth out the rotation or initial positioning here
      rotation={[0, -Math.PI / 4, 0]} 
    />
  );
};

// Preload the model for better performance
useGLTF.preload('/models/appl_e_iph_one_16/scene.gltf');

// 2. Main Viewer Component
export const IPhoneViewer: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#f0f0f0' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        
        {/* Lighting setup to make the materials (especially metallic/roughness) look good */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* Environment map provides realistic reflections for the phone's glass and metal */}
        <Environment preset="city" />
        
        <Suspense fallback={<div>hello</div>} >
          <Model />
          {/* Adds a nice soft shadow under the phone */}
          <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={10} blur={2} far={4} />
        </Suspense>

        {/* Allows the user to rotate, zoom, and pan the model */}
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};
