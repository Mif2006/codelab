import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Preload the model for better performance
useGLTF.preload("/planet/scene.gltf");

const PlanetModel = ({ scrollProgress }: { scrollProgress: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load the model from the public directory
  const { scene } = useGLTF("/models/ringed_gas_giant_planet/scene.gltf");

  useFrame((state) => {
    if (groupRef.current) {
      // Apply your original floating and scroll-based rotation logic
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.15 + scrollProgress * Math.PI;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2 + scrollProgress * Math.PI * 0.5;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Note: Sketchfab models vary wildly in scale. 
        If the planet is too huge or too tiny, adjust this scale value. 
        You can also adjust the initial rotation if the rings are angled weirdly.
      */}
      <primitive object={scene} scale={0.3} position={[0, 0, 0]} />
    </group>
  );
};

const Scene3D = ({ scrollProgress = 0 }: { scrollProgress?: number }) => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} style={{ pointerEvents: "auto" }}>
        <ambientLight intensity={0.4} />
        {/* Changed main light to white to show planet colors properly */}
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
        {/* Kept your golden light for a nice cinematic rim light */}
        <pointLight position={[-5, -3, 3]} intensity={0.8} color="#8b7430" />
        
        <PlanetModel scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
};

export default Scene3D;