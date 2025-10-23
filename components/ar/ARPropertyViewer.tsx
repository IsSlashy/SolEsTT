'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ARPropertyViewerProps {
  propertyName: string;
  modelUrl?: string;
}

export default function ARPropertyViewer({ propertyName, modelUrl }: ARPropertyViewerProps) {
  const [isARSupported, setIsARSupported] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    // Check if AR is supported (WebXR or model-viewer AR)
    if ('xr' in navigator) {
      (navigator as any).xr?.isSessionSupported('immersive-ar').then((supported: boolean) => {
        setIsARSupported(supported);
      });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="modern-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">AR Experience</h3>
          <p className="text-neutral-400 text-xs">View property in augmented reality</p>
        </div>
        <div className="text-3xl">🏗️</div>
      </div>

      {isARSupported ? (
        <div className="space-y-4">
          {/* AR Viewer placeholder - In production, use @google/model-viewer */}
          <div className="relative w-full h-64 bg-neutral-900 rounded-lg flex items-center justify-center overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl"
            >
              🏠
            </motion.div>

            {/* Scan effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent"
              animate={{
                y: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {showInstructions && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
              >
                <div className="text-center space-y-4">
                  <p className="text-sm text-neutral-300">📱 Point your camera at a flat surface</p>
                  <button
                    onClick={() => setShowInstructions(false)}
                    className="modern-button text-sm"
                  >
                    Start AR Experience
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="modern-card p-3 text-center">
              <p className="text-neutral-500">Scale</p>
              <p className="font-semibold">1:100</p>
            </div>
            <div className="modern-card p-3 text-center">
              <p className="text-neutral-500">Height</p>
              <p className="font-semibold">45m</p>
            </div>
            <div className="modern-card p-3 text-center">
              <p className="text-neutral-500">Floors</p>
              <p className="font-semibold">12</p>
            </div>
          </div>

          <button className="modern-button w-full">
            📸 Take AR Screenshot
          </button>
        </div>
      ) : (
        <div className="text-center py-8 space-y-4">
          <div className="text-5xl">📱</div>
          <div>
            <p className="font-semibold mb-2">AR Not Available</p>
            <p className="text-neutral-400 text-sm">
              Open this page on a mobile device with AR capabilities
            </p>
          </div>
          <button className="modern-button-secondary">
            View 3D Model Instead
          </button>
        </div>
      )}

      <div className="mt-4 p-3 bg-neutral-900 rounded-lg border border-neutral-800">
        <p className="text-xs text-neutral-400">
          💡 AR features include: Property placement, Real-time measurements, Interactive tours
        </p>
      </div>
    </motion.div>
  );
}
