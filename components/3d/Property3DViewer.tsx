'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, useGLTF } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function UploadedModel({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl);

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <primitive object={scene} scale={1.5} />
    </Float>
  );
}

function Building() {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        {/* Base building */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 3, 2]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Windows */}
        {Array.from({ length: 5 }).map((_, floor) => (
          <group key={floor}>
            {Array.from({ length: 3 }).map((_, col) => (
              <mesh
                key={`${floor}-${col}`}
                position={[-0.6 + col * 0.6, -1.2 + floor * 0.6, 1.01]}
              >
                <boxGeometry args={[0.3, 0.4, 0.02]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#ffffff"
                  emissiveIntensity={0.5}
                />
              </mesh>
            ))}
          </group>
        ))}

        {/* Roof */}
        <mesh position={[0, 1.6, 0]} castShadow>
          <boxGeometry args={[2.2, 0.2, 2.2]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Ground platform */}
        <mesh position={[0, -1.6, 0]} receiveShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
          <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#262626" wireframe />
    </mesh>
  );
}

interface Property3DViewerProps {
  propertyName?: string;
  modelUrl?: string; // URL to uploaded 3D model file
  modelFile?: File; // Uploaded 3D model file
}

export default function Property3DViewer({ propertyName, modelUrl, modelFile }: Property3DViewerProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  // Create object URL from uploaded file
  useEffect(() => {
    if (modelFile) {
      const url = URL.createObjectURL(modelFile);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [modelFile]);

  const finalModelUrl = objectUrl || modelUrl;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[400px] rounded-xl overflow-hidden border border-neutral-800 relative"
    >
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[5, 3, 5]} />
        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          minDistance={4}
          maxDistance={10}
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ffffff" />

        <Suspense fallback={<LoadingFallback />}>
          {finalModelUrl ? (
            <UploadedModel modelUrl={finalModelUrl} />
          ) : (
            <Building />
          )}
          <Environment preset="city" />
        </Suspense>

        {/* Grid floor */}
        <gridHelper args={[10, 10, '#262626', '#1a1a1a']} position={[0, -1.65, 0]} />
      </Canvas>

      {propertyName && (
        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-neutral-800">
          <p className="text-sm text-neutral-400">
            {finalModelUrl ? '3D Model (Uploaded)' : '3D View (Demo)'}
          </p>
          <p className="font-semibold">{propertyName}</p>
        </div>
      )}

      {/* Loading indicator for uploaded models */}
      {finalModelUrl && (
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-neutral-800 text-xs text-neutral-400">
          Custom 3D Model
        </div>
      )}
    </motion.div>
  );
}
