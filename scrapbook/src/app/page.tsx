import dynamic from 'next/dynamic';
import BookScene from '@/components/BookScene';
import Uploader from '@/components/Uploader';
import Mascot from '@/components/Mascot';

// Konva relies on window and canvas, so it must be disabled for SSR
const CanvasWorkspace = dynamic(() => import('@/components/CanvasWorkspace'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-10 flex items-center justify-center text-white/50">Loading Workspace...</div>
});

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-neutral-900 selection:bg-blue-500/30">
      {/* 3D Background Book Scene */}
      <BookScene />
      
      {/* 2D Interactive Canvas Layer */}
      <CanvasWorkspace />
      
      {/* UI Overlay Layer */}
      <Uploader />
      <Mascot />
    </main>
  );
}
