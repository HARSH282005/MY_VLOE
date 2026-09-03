import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the Scrapbook Editor. 
// Assuming this editor contains heavy Image Processing models and canvas manipulations.
const ScrapbookEditorLazy = dynamic(
  () => import('../../components/Editor/ScrapbookEditor'),
  { 
    ssr: false, 
    loading: () => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading Editor (and background Web Workers)...
      </div>
    )
  }
);

export default function EditorPage() {
  return (
    <main>
      {/* We mock the ScrapbookEditor component structure here since it was not provided,
          but the dynamic routing wraps it to enforce code-splitting. */}
      <ScrapbookEditorLazy />
    </main>
  );
}
