import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useLayerStore, Layer, ImageLayer, ShapeLayer, TextLayer } from '@/store/layerStore';
import { useEditorStore } from '@/store/editorStore';

interface LayerRendererProps {
  layer: Layer;
  isSelected: boolean;
  onSelect: () => void;
  onTransformStart: (e: React.MouseEvent, handle?: string) => void;
}

const ImageLayerRenderer: React.FC<{ layer: ImageLayer }> = ({ layer }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  
  return (
    <img
      ref={imgRef}
      src={layer.src}
      alt={layer.name}
      style={{
        width: layer.transform.width,
        height: layer.transform.height,
        opacity: layer.opacity,
        pointerEvents: 'none',
      }}
      draggable={false}
    />
  );
};

const ShapeLayerRenderer: React.FC<{ layer: ShapeLayer }> = ({ layer }) => {
  const { transform, shapeType, fill, stroke, strokeWidth, opacity } = layer;

  if (shapeType === 'rectangle') {
    return (
      <div
        style={{
          width: transform.width,
          height: transform.height,
          backgroundColor: fill,
          border: strokeWidth > 0 ? `${strokeWidth}px solid ${stroke}` : 'none',
          opacity,
          pointerEvents: 'none',
        }}
      />
    );
  }

  if (shapeType === 'ellipse') {
    return (
      <div
        style={{
          width: transform.width,
          height: transform.height,
          backgroundColor: fill,
          border: strokeWidth > 0 ? `${strokeWidth}px solid ${stroke}` : 'none',
          borderRadius: '50%',
          opacity,
          pointerEvents: 'none',
        }}
      />
    );
  }

  if (shapeType === 'line') {
    return (
      <div
        style={{
          width: transform.width,
          height: Math.max(strokeWidth || 2, 2),
          backgroundColor: stroke || fill,
          opacity,
          pointerEvents: 'none',
        }}
      />
    );
  }

  return null;
};

const TextLayerRenderer: React.FC<{ layer: TextLayer }> = ({ layer }) => {
  const { transform, text, fontFamily, fontSize, fontWeight, color, align, opacity } = layer;

  return (
    <div
      style={{
        width: transform.width,
        minHeight: transform.height,
        fontFamily,
        fontSize,
        fontWeight,
        color,
        textAlign: align,
        opacity,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        pointerEvents: 'none',
        lineHeight: 1.2,
      }}
    >
      {text}
    </div>
  );
};

const SelectionBox: React.FC<{
  layer: Layer;
  onTransformStart: (e: React.MouseEvent, handle?: string) => void;
}> = ({ layer, onTransformStart }) => {
  const { transform } = layer;
  const handleSize = 8;

  const handles = [
    { id: 'nw', style: { top: -handleSize / 2, left: -handleSize / 2, cursor: 'nw-resize' } },
    { id: 'n', style: { top: -handleSize / 2, left: '50%', marginLeft: -handleSize / 2, cursor: 'n-resize' } },
    { id: 'ne', style: { top: -handleSize / 2, right: -handleSize / 2, cursor: 'ne-resize' } },
    { id: 'w', style: { top: '50%', marginTop: -handleSize / 2, left: -handleSize / 2, cursor: 'w-resize' } },
    { id: 'e', style: { top: '50%', marginTop: -handleSize / 2, right: -handleSize / 2, cursor: 'e-resize' } },
    { id: 'sw', style: { bottom: -handleSize / 2, left: -handleSize / 2, cursor: 'sw-resize' } },
    { id: 's', style: { bottom: -handleSize / 2, left: '50%', marginLeft: -handleSize / 2, cursor: 's-resize' } },
    { id: 'se', style: { bottom: -handleSize / 2, right: -handleSize / 2, cursor: 'se-resize' } },
  ];

  return (
    <>
      <div
        className="absolute inset-0 border-2 border-primary pointer-events-none"
        style={{ borderColor: 'hsl(190, 100%, 50%)' }}
      />
      {handles.map((handle) => (
        <div
          key={handle.id}
          className="absolute bg-white border-2 border-primary z-10"
          style={{
            width: handleSize,
            height: handleSize,
            borderColor: 'hsl(190, 100%, 50%)',
            ...handle.style,
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            onTransformStart(e, handle.id);
          }}
        />
      ))}
    </>
  );
};

const LayerElement: React.FC<LayerRendererProps> = ({
  layer,
  isSelected,
  onSelect,
  onTransformStart,
}) => {
  if (!layer.visible) return null;

  const { transform } = layer;

  return (
    <div
      className="absolute"
      style={{
        left: transform.x,
        top: transform.y,
        transform: `rotate(${transform.rotation}deg)`,
        transformOrigin: 'top left',
        cursor: layer.locked ? 'not-allowed' : 'move',
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        if (!layer.locked) {
          onSelect();
          onTransformStart(e);
        }
      }}
    >
      {layer.type === 'image' && <ImageLayerRenderer layer={layer} />}
      {layer.type === 'shape' && <ShapeLayerRenderer layer={layer} />}
      {layer.type === 'text' && <TextLayerRenderer layer={layer} />}
      
      {isSelected && !layer.locked && (
        <SelectionBox layer={layer} onTransformStart={onTransformStart} />
      )}
    </div>
  );
};

export const LayerCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { layers, selectedLayerId, selectLayer, updateLayerTransform, canvasWidth, canvasHeight } = useLayerStore();
  const { zoom, setZoom, panOffset, setPanOffset, showGrid, activeTool } = useEditorStore();

  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [originalTransform, setOriginalTransform] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(zoom * delta);
  }, [zoom, setZoom]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (activeTool === 'pan' || e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    } else if (e.target === e.currentTarget || (e.target as HTMLElement).closest('[data-canvas-bg]')) {
      selectLayer(null);
    }
  }, [activeTool, selectLayer]);

  const handleTransformStart = useCallback((layerId: string, e: React.MouseEvent, handle?: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    setIsDragging(true);
    setDragHandle(handle || null);
    setDragStart({ x: e.clientX, y: e.clientY });
    setOriginalTransform({
      x: layer.transform.x,
      y: layer.transform.y,
      width: layer.transform.width,
      height: layer.transform.height,
    });
  }, [layers]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPanOffset({ x: panOffset.x + deltaX, y: panOffset.y + deltaY });
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (!isDragging || !selectedLayerId || !originalTransform) return;

    const deltaX = (e.clientX - dragStart.x) / zoom;
    const deltaY = (e.clientY - dragStart.y) / zoom;

    if (!dragHandle) {
      // Move layer
      updateLayerTransform(selectedLayerId, {
        x: originalTransform.x + deltaX,
        y: originalTransform.y + deltaY,
      });
    } else {
      // Resize layer
      let newX = originalTransform.x;
      let newY = originalTransform.y;
      let newWidth = originalTransform.width;
      let newHeight = originalTransform.height;

      if (dragHandle.includes('w')) {
        newX = originalTransform.x + deltaX;
        newWidth = originalTransform.width - deltaX;
      }
      if (dragHandle.includes('e')) {
        newWidth = originalTransform.width + deltaX;
      }
      if (dragHandle.includes('n')) {
        newY = originalTransform.y + deltaY;
        newHeight = originalTransform.height - deltaY;
      }
      if (dragHandle.includes('s')) {
        newHeight = originalTransform.height + deltaY;
      }

      // Ensure minimum size
      if (newWidth > 10 && newHeight > 10) {
        updateLayerTransform(selectedLayerId, {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        });
      }
    }
  }, [isPanning, lastPanPoint, isDragging, selectedLayerId, originalTransform, dragHandle, dragStart, zoom, setPanOffset, panOffset, updateLayerTransform]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragHandle(null);
    setOriginalTransform(null);
    setIsPanning(false);
  }, []);

  // Render layers in reverse order (bottom to top)
  const reversedLayers = [...layers].reverse();

  if (layers.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${showGrid ? 'canvas-grid' : 'bg-canvas'}`}
      onWheel={handleWheel}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isPanning ? 'grabbing' : activeTool === 'pan' ? 'grab' : 'default' }}
    >
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Canvas background */}
        <div
          data-canvas-bg
          className="relative bg-white"
          style={{
            width: canvasWidth,
            height: canvasHeight,
            boxShadow: '0 8px 32px -8px rgba(0,0,0,0.5), 0 16px 64px -16px rgba(0,0,0,0.3)',
          }}
        >
          {/* Transparency checker pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            }}
          />
          
          {/* Layers */}
          {reversedLayers.map((layer) => (
            <LayerElement
              key={layer.id}
              layer={layer}
              isSelected={selectedLayerId === layer.id}
              onSelect={() => selectLayer(layer.id)}
              onTransformStart={(e, handle) => handleTransformStart(layer.id, e, handle)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
