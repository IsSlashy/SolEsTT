'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Model3DFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
}

interface Model3DUploaderProps {
  onUpload: (file: File) => void;
  maxSize?: number; // in MB
}

export default function Model3DUploader({
  onUpload,
  maxSize = 50
}: Model3DUploaderProps) {
  const [model, setModel] = useState<Model3DFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = [
    '.glb', '.gltf', // Recommended formats
    '.obj', '.fbx',  // Alternative formats
    '.dae', '.stl',  // Other 3D formats
  ];

  const handleFile = (file: File | null) => {
    if (!file) return;

    // Check file extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!supportedFormats.includes(extension)) {
      alert(`Unsupported format. Please upload: ${supportedFormats.join(', ')}`);
      return;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File is larger than ${maxSize}MB`);
      return;
    }

    const modelFile: Model3DFile = {
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: extension,
      progress: 0,
    };

    setModel(modelFile);
    simulateUpload(modelFile.id);
    onUpload(file);
  };

  const simulateUpload = (id: string) => {
    const interval = setInterval(() => {
      setModel((prev) => {
        if (!prev || prev.id !== id) return prev;
        if (prev.progress >= 100) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, progress: Math.min(prev.progress + 5, 100) };
      });
    }, 100);
  };

  const removeModel = () => {
    setModel(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {!model ? (
        /* Upload Zone */
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-200
            ${isDragging
              ? 'border-white bg-white/5'
              : 'border-neutral-700 hover:border-neutral-600 hover:bg-neutral-900/50'
            }
          `}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={supportedFormats.join(',')}
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
            className="hidden"
          />

          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isDragging ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-5xl mb-4">🏗️</div>
            <p className="text-lg font-semibold mb-2">
              {isDragging ? 'Drop your 3D model here' : 'Upload 3D Model'}
            </p>
            <p className="text-sm text-neutral-400 mb-4">
              Drone scan, photogrammetry, or CAD model
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 rounded-lg border border-neutral-800">
              <span className="text-xs text-neutral-400">Supported:</span>
              <div className="flex gap-1">
                {['GLB', 'GLTF', 'OBJ', 'FBX'].map((format) => (
                  <span
                    key={format}
                    className="px-2 py-0.5 bg-white/10 rounded text-xs font-mono"
                  >
                    {format}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-xs text-neutral-500 mt-4">
              Max {maxSize}MB • Optimized models recommended
            </p>
          </motion.div>
        </motion.div>
      ) : (
        /* Model Preview */
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="modern-card p-6"
          >
            <div className="flex items-start gap-4">
              {/* 3D Icon */}
              <div className="flex-shrink-0 w-16 h-16 bg-neutral-900 rounded-lg flex items-center justify-center text-3xl">
                🎨
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{model.name}</h4>
                    <p className="text-sm text-neutral-400">
                      {formatFileSize(model.size)} • {model.type.toUpperCase()}
                    </p>
                  </div>

                  <button
                    onClick={removeModel}
                    className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="relative w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-white"
                    initial={{ width: '0%' }}
                    animate={{ width: `${model.progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-neutral-400">
                    {model.progress < 100 ? 'Uploading...' : 'Upload complete'}
                  </span>
                  <span className="font-semibold">{model.progress}%</span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {model.progress === 100 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-neutral-800 space-y-2"
              >
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Model ready for 3D viewer
                </div>
                <div className="text-xs text-neutral-500">
                  💡 Tip: GLB format provides best performance and compatibility
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Info Box */}
      <div className="modern-card p-4 space-y-2">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <span className="text-lg">🚁</span>
          Drone Scan Instructions
        </h4>
        <ul className="text-xs text-neutral-400 space-y-1 ml-6 list-disc">
          <li>Use photogrammetry software (RealityCapture, Metashape)</li>
          <li>Export as GLB or GLTF for best compatibility</li>
          <li>Optimize mesh to reduce file size (&lt; 10MB recommended)</li>
          <li>Include textures in the model file</li>
        </ul>
      </div>
    </div>
  );
}
