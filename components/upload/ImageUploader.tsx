'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
}

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
}

export default function ImageUploader({
  onUpload,
  maxFiles = 10,
  maxSize = 5
}: ImageUploaderProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: ImageFile[] = [];
    const filesArray = Array.from(files);

    // Validate and process files
    filesArray.forEach((file) => {
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return;
      }

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`${file.name} is larger than ${maxSize}MB`);
        return;
      }

      // Check max files limit
      if (images.length + newImages.length >= maxFiles) {
        alert(`Maximum ${maxFiles} images allowed`);
        return;
      }

      const imageFile: ImageFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
      };

      newImages.push(imageFile);
    });

    if (newImages.length > 0) {
      setImages((prev) => [...prev, ...newImages]);

      // Simulate upload progress
      newImages.forEach((img) => {
        simulateUpload(img.id);
      });

      // Call parent callback
      onUpload(newImages.map(img => img.file));
    }
  }, [images.length, maxFiles, maxSize, onUpload]);

  const simulateUpload = (id: string) => {
    const interval = setInterval(() => {
      setImages((prev) =>
        prev.map((img) =>
          img.id === id && img.progress < 100
            ? { ...img, progress: Math.min(img.progress + 10, 100) }
            : img
        )
      );
    }, 200);

    setTimeout(() => clearInterval(interval), 2000);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
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
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
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
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isDragging ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-5xl mb-4">📸</div>
          <p className="text-lg font-semibold mb-2">
            {isDragging ? 'Drop your images here' : 'Upload Property Images'}
          </p>
          <p className="text-sm text-neutral-400">
            Drag & drop or click to browse
          </p>
          <p className="text-xs text-neutral-500 mt-2">
            Max {maxFiles} images • Up to {maxSize}MB each • JPG, PNG, WebP
          </p>
        </motion.div>
      </motion.div>

      {/* Image Preview Grid */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {images.map((img, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-900">
                  <img
                    src={img.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Upload Progress */}
                  {img.progress < 100 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-16 h-16 relative">
                        <svg className="w-full h-full -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-neutral-700"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 28}`}
                            strokeDashoffset={`${
                              2 * Math.PI * 28 * (1 - img.progress / 100)
                            }`}
                            className="text-white transition-all duration-300"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                          {img.progress}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(img.id);
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {/* Primary Badge */}
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-white text-black px-2 py-1 rounded text-xs font-semibold">
                      Primary
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info */}
      {images.length > 0 && (
        <div className="flex items-center justify-between text-sm text-neutral-400">
          <span>{images.length} / {maxFiles} images uploaded</span>
          <button
            onClick={() => {
              images.forEach((img) => URL.revokeObjectURL(img.preview));
              setImages([]);
            }}
            className="text-red-400 hover:text-red-300"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
