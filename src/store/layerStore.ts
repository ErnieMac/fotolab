import { create } from 'zustand';

export type LayerType = 'image' | 'shape' | 'text';
export type ShapeType = 'rectangle' | 'ellipse' | 'line';

export interface Transform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

export interface BaseLayer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  opacity: number;
  transform: Transform;
}

export interface ImageLayer extends BaseLayer {
  type: 'image';
  src: string;
  originalWidth: number;
  originalHeight: number;
}

export interface ShapeLayer extends BaseLayer {
  type: 'shape';
  shapeType: ShapeType;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  align: 'left' | 'center' | 'right';
}

export type Layer = ImageLayer | ShapeLayer | TextLayer;

interface LayerState {
  layers: Layer[];
  selectedLayerId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  
  // Canvas actions
  setCanvasSize: (width: number, height: number) => void;
  
  // Layer selection
  selectLayer: (id: string | null) => void;
  getSelectedLayer: () => Layer | null;
  
  // Layer CRUD
  addLayer: (layer: Layer) => void;
  removeLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  
  // Layer ordering
  moveLayerUp: (id: string) => void;
  moveLayerDown: (id: string) => void;
  moveLayerToTop: (id: string) => void;
  moveLayerToBottom: (id: string) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  
  // Layer visibility/lock
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  
  // Transform
  updateLayerTransform: (id: string, transform: Partial<Transform>) => void;
  
  // Utility
  createImageLayer: (src: string, width: number, height: number, name?: string) => ImageLayer;
  createShapeLayer: (shapeType: ShapeType, name?: string) => ShapeLayer;
  createTextLayer: (text: string, name?: string) => TextLayer;
  
  // Reset
  clearLayers: () => void;
}

const generateId = () => crypto.randomUUID();

export const useLayerStore = create<LayerState>((set, get) => ({
  layers: [],
  selectedLayerId: null,
  canvasWidth: 1920,
  canvasHeight: 1080,
  
  setCanvasSize: (width, height) => set({ canvasWidth: width, canvasHeight: height }),
  
  selectLayer: (id) => set({ selectedLayerId: id }),
  
  getSelectedLayer: () => {
    const { layers, selectedLayerId } = get();
    return layers.find(l => l.id === selectedLayerId) || null;
  },
  
  addLayer: (layer) => set((state) => ({
    layers: [layer, ...state.layers],
    selectedLayerId: layer.id,
  })),
  
  removeLayer: (id) => set((state) => ({
    layers: state.layers.filter(l => l.id !== id),
    selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId,
  })),
  
  duplicateLayer: (id) => {
    const { layers } = get();
    const layer = layers.find(l => l.id === id);
    if (!layer) return;
    
    const newLayer: Layer = {
      ...layer,
      id: generateId(),
      name: `${layer.name} copy`,
      transform: {
        ...layer.transform,
        x: layer.transform.x + 20,
        y: layer.transform.y + 20,
      },
    };
    
    set((state) => ({
      layers: [newLayer, ...state.layers],
      selectedLayerId: newLayer.id,
    }));
  },
  
  updateLayer: (id, updates) => set((state) => ({
    layers: state.layers.map(l => 
      l.id === id ? { ...l, ...updates } as Layer : l
    ),
  })),
  
  moveLayerUp: (id) => set((state) => {
    const index = state.layers.findIndex(l => l.id === id);
    if (index <= 0) return state;
    const newLayers = [...state.layers];
    [newLayers[index - 1], newLayers[index]] = [newLayers[index], newLayers[index - 1]];
    return { layers: newLayers };
  }),
  
  moveLayerDown: (id) => set((state) => {
    const index = state.layers.findIndex(l => l.id === id);
    if (index === -1 || index >= state.layers.length - 1) return state;
    const newLayers = [...state.layers];
    [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
    return { layers: newLayers };
  }),
  
  moveLayerToTop: (id) => set((state) => {
    const layer = state.layers.find(l => l.id === id);
    if (!layer) return state;
    return { layers: [layer, ...state.layers.filter(l => l.id !== id)] };
  }),
  
  moveLayerToBottom: (id) => set((state) => {
    const layer = state.layers.find(l => l.id === id);
    if (!layer) return state;
    return { layers: [...state.layers.filter(l => l.id !== id), layer] };
  }),
  
  reorderLayers: (fromIndex, toIndex) => set((state) => {
    const newLayers = [...state.layers];
    const [removed] = newLayers.splice(fromIndex, 1);
    newLayers.splice(toIndex, 0, removed);
    return { layers: newLayers };
  }),
  
  toggleLayerVisibility: (id) => set((state) => ({
    layers: state.layers.map(l => 
      l.id === id ? { ...l, visible: !l.visible } : l
    ),
  })),
  
  toggleLayerLock: (id) => set((state) => ({
    layers: state.layers.map(l => 
      l.id === id ? { ...l, locked: !l.locked } : l
    ),
  })),
  
  updateLayerTransform: (id, transform) => set((state) => ({
    layers: state.layers.map(l => 
      l.id === id ? { ...l, transform: { ...l.transform, ...transform } } : l
    ),
  })),
  
  createImageLayer: (src, width, height, name = 'Image Layer') => ({
    id: generateId(),
    name,
    type: 'image' as const,
    visible: true,
    locked: false,
    opacity: 1,
    src,
    originalWidth: width,
    originalHeight: height,
    transform: {
      x: 0,
      y: 0,
      width,
      height,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    },
  }),
  
  createShapeLayer: (shapeType, name) => ({
    id: generateId(),
    name: name || `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)}`,
    type: 'shape' as const,
    visible: true,
    locked: false,
    opacity: 1,
    shapeType,
    fill: '#00bcd4',
    stroke: '#ffffff',
    strokeWidth: 0,
    transform: {
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    },
  }),
  
  createTextLayer: (text, name = 'Text Layer') => ({
    id: generateId(),
    name,
    type: 'text' as const,
    visible: true,
    locked: false,
    opacity: 1,
    text,
    fontFamily: 'Geist',
    fontSize: 48,
    fontWeight: 500,
    color: '#ffffff',
    align: 'left' as const,
    transform: {
      x: 100,
      y: 100,
      width: 300,
      height: 60,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    },
  }),
  
  clearLayers: () => set({ layers: [], selectedLayerId: null }),
}));
