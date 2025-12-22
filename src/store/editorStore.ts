import { create } from 'zustand';

export interface ImageData {
  src: string;
  name: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  format: string;
  size: number;
}

export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: number | null;
}

export interface HistoryEntry {
  id: string;
  action: string;
  timestamp: number;
  imageData?: Partial<ImageData>;
}

export type Tool = 'select' | 'crop' | 'resize' | 'pan';
export type Panel = 'resize' | 'crop' | 'export' | 'info' | null;

interface EditorState {
  // Image state
  image: ImageData | null;
  setImage: (image: ImageData | null) => void;
  
  // Canvas state
  zoom: number;
  setZoom: (zoom: number) => void;
  panOffset: { x: number; y: number };
  setPanOffset: (offset: { x: number; y: number }) => void;
  
  // Tool state
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  
  // Panel state
  activePanel: Panel;
  setActivePanel: (panel: Panel) => void;
  
  // Crop state
  cropData: CropData | null;
  setCropData: (crop: CropData | null) => void;
  applyCrop: () => void;
  
  // Resize state
  resizeWidth: number;
  resizeHeight: number;
  lockAspectRatio: boolean;
  dpi: number;
  setResizeWidth: (width: number) => void;
  setResizeHeight: (height: number) => void;
  setLockAspectRatio: (lock: boolean) => void;
  setDpi: (dpi: number) => void;
  applyResize: () => void;
  
  // History
  history: HistoryEntry[];
  historyIndex: number;
  addToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // UI state
  showGrid: boolean;
  showRulers: boolean;
  toggleGrid: () => void;
  toggleRulers: () => void;
  
  // Reset
  reset: () => void;
}

const initialState = {
  image: null,
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  activeTool: 'select' as Tool,
  activePanel: null as Panel,
  cropData: null,
  resizeWidth: 0,
  resizeHeight: 0,
  lockAspectRatio: true,
  dpi: 72,
  history: [] as HistoryEntry[],
  historyIndex: -1,
  showGrid: false,
  showRulers: true,
};

export const useEditorStore = create<EditorState>((set, get) => ({
  ...initialState,
  
  setImage: (image) => {
    set({ 
      image,
      resizeWidth: image?.width || 0,
      resizeHeight: image?.height || 0,
      cropData: null,
      zoom: 1,
      panOffset: { x: 0, y: 0 },
    });
    if (image) {
      get().addToHistory({ action: 'Image loaded', imageData: image });
    }
  },
  
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(10, zoom)) }),
  setPanOffset: (panOffset) => set({ panOffset }),
  
  setActiveTool: (activeTool) => set({ activeTool }),
  setActivePanel: (activePanel) => set({ activePanel }),
  
  setCropData: (cropData) => set({ cropData }),
  applyCrop: () => {
    const { image, cropData } = get();
    if (!image || !cropData) return;
    
    set({
      image: {
        ...image,
        width: cropData.width,
        height: cropData.height,
      },
      resizeWidth: cropData.width,
      resizeHeight: cropData.height,
      cropData: null,
      activeTool: 'select',
    });
    get().addToHistory({ action: 'Crop applied' });
  },
  
  setResizeWidth: (width) => {
    const { lockAspectRatio, image, resizeHeight } = get();
    if (lockAspectRatio && image) {
      const aspectRatio = image.originalWidth / image.originalHeight;
      set({ resizeWidth: width, resizeHeight: Math.round(width / aspectRatio) });
    } else {
      set({ resizeWidth: width });
    }
  },
  
  setResizeHeight: (height) => {
    const { lockAspectRatio, image, resizeWidth } = get();
    if (lockAspectRatio && image) {
      const aspectRatio = image.originalWidth / image.originalHeight;
      set({ resizeHeight: height, resizeWidth: Math.round(height * aspectRatio) });
    } else {
      set({ resizeHeight: height });
    }
  },
  
  setLockAspectRatio: (lockAspectRatio) => set({ lockAspectRatio }),
  setDpi: (dpi) => set({ dpi }),
  
  applyResize: () => {
    const { image, resizeWidth, resizeHeight } = get();
    if (!image) return;
    
    set({
      image: {
        ...image,
        width: resizeWidth,
        height: resizeHeight,
      },
    });
    get().addToHistory({ action: `Resized to ${resizeWidth}×${resizeHeight}` });
  },
  
  addToHistory: (entry) => {
    const { history, historyIndex } = get();
    const newEntry: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    const newHistory = [...history.slice(0, historyIndex + 1), newEntry];
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },
  
  undo: () => {
    const { historyIndex } = get();
    if (historyIndex > 0) {
      set({ historyIndex: historyIndex - 1 });
    }
  },
  
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      set({ historyIndex: historyIndex + 1 });
    }
  },
  
  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
  
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleRulers: () => set((state) => ({ showRulers: !state.showRulers })),
  
  reset: () => set(initialState),
}));
