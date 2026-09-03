"use client";
import { useEffect, useRef, useState } from 'react';
import * as Comlink from 'comlink';

export function useImageProcessor() {
  const workerRef = useRef(null);
  const processorRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize the Web Worker
    const worker = new Worker(
      new URL('../workers/imageProcessor.worker.js', import.meta.url),
      { type: 'module' } // Important for modern workers using imports
    );
    workerRef.current = worker;
    
    // Wrap it with Comlink to create a proxy API
    processorRef.current = Comlink.wrap(worker);
    setIsReady(true);

    // Cleanup worker on unmount
    return () => {
      worker.terminate();
    };
  }, []);

  const processImage = async (data) => {
    if (!processorRef.current) throw new Error("Worker not initialized");
    
    try {
      // Calls the function natively as if it were a local async function
      return await processorRef.current.processHeavyImage(data);
    } catch (error) {
      console.error("Worker processing failed:", error);
      throw error;
    }
  };

  return { 
    isReady, 
    processImage, 
    // Expose the raw processor for other functions like extractFeatures
    processor: processorRef.current 
  };
}
