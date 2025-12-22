import React from 'react';
import { useEditorStore } from '@/store/editorStore';

export const StatusBar: React.FC = () => {
  const { image, zoom, activeTool } = useEditorStore();

  if (!image) return null;

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="flex items-center justify-between h-7 px-4 bg-toolbar border-t border-border text-[11px] text-muted-foreground">
      <div className="flex items-center gap-4">
        <span>{image.width} × {image.height}px</span>
        <span className="text-border">|</span>
        <span>{image.format}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="capitalize">{activeTool}</span>
        <span className="text-border">|</span>
        <span>{zoomPercent}%</span>
      </div>
    </div>
  );
};
