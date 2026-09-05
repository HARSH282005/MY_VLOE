"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrapbookStore } from '../store/useScrapbookStore';

export default function Uploader() {
  const [isDragging, setIsDragging] = useState(false);
  const addItem = useScrapbookStore((state) => state.addItem);
  const setMascotState = useScrapbookStore((state) => state.setMascotState);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = async (file: File) => {
    setIsProcessing(true);
    setMascotState('uploading');
    
    try {
      const url = URL.createObjectURL(file);
      
      // Simulate heavy Web Worker processing for the polaroid development effect
      await new Promise(r => setTimeout(r, 2000));
      
      addItem({
        type: 'image',
        src: url,
        x: typeof window !== 'undefined' ? window.innerWidth / 2 - 150 : 200,
        y: typeof window !== 'undefined' ? window.innerHeight / 2 - 150 : 200,
        scaleX: 1,
        scaleY: 1,
        rotation: (Math.random() - 0.5) * 30, // Random initial polaroid rotation
      });
      
      setMascotState('happy');
      setTimeout(() => setMascotState('idle'), 3000);
      
    } catch (e) {
      console.error(e);
      setMascotState('idle');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  }, [setMascotState, addItem]);

  return (
    <>
      <div 
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <label className={`
          px-8 py-4 rounded-full cursor-pointer backdrop-blur-xl transition-all duration-300
          border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center gap-3 
          font-bold text-sm tracking-widest uppercase
          ${isDragging 
            ? 'border-blue-400 bg-blue-500/20 text-blue-100 scale-110 shadow-blue-500/20' 
            : 'bg-black/40 text-white/90 hover:bg-black/60 hover:scale-105'
          }
        `}>
          <span>{isProcessing ? 'Developing...' : 'Drop or Click to Upload'}</span>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleUpload(e.target.files[0]);
              }
            }}
          />
        </label>
      </div>

      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 3 }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)', transition: { duration: 0.8 } }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
          >
            {/* Polaroid Frame */}
            <div className="w-72 h-80 bg-[#f9f9f9] p-4 pb-20 shadow-2xl rounded-sm transform flex flex-col items-center justify-center relative border border-black/5">
               {/* Developing Photo Area */}
               <div className="w-full h-full bg-[#2a2a2a] overflow-hidden relative shadow-inner">
                 <motion.div 
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 2, delay: 0.2 }}
                    className="absolute inset-0 bg-[#111]"
                 />
                 {/* Chemical development scanner effect */}
                 <motion.div 
                    initial={{ top: '-100%' }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 h-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent blur-md"
                 />
               </div>
               <p className="absolute bottom-6 font-['Caveat',cursive] text-2xl text-gray-800 opacity-60">Wait for it...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
