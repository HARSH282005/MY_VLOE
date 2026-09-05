import { create } from 'zustand';

export interface CanvasItem {
  id: string;
  type: 'image' | 'text';
  src?: string;
  text?: string;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  isDeveloping?: boolean;
}

interface ScrapbookState {
  items: CanvasItem[];
  mascotState: 'idle' | 'happy' | 'uploading';
  setMascotState: (state: 'idle' | 'happy' | 'uploading') => void;
  addItem: (item: Omit<CanvasItem, 'id'>) => void;
  updateItem: (id: string, attrs: Partial<CanvasItem>) => void;
  removeItem: (id: string) => void;
}

export const useScrapbookStore = create<ScrapbookState>((set) => ({
  items: [],
  mascotState: 'idle',
  setMascotState: (state) => set({ mascotState: state }),
  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        { ...item, id: Math.random().toString(36).substr(2, 9) },
      ],
    })),
  updateItem: (id, attrs) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...attrs } : item
      ),
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));
