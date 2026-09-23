import React from 'react';
import { useEditorStore } from '@/store/editorStore';
import { Button } from '@/components/ui/button';
import { Minus, Plus, RotateCcw, Undo2, Redo2 } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const { image, zoom, setZoom, activeTool, undo, redo, canUndo, canRedo } = useEditorStore();

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="flex items-center justify-between h-11 px-3 bg-toolbar border-t border-border text-[11px] text-muted-foreground shrink-0">
      <div className="flex items-center gap-4">
        <span>{image ? `${image.width} × ${image.height}px` : 'No document open'}</span>
        {image && <><span className="text-border">|</span><span>{image.format}</span></>}
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center border-r border-border pr-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={!canUndo()} onClick={undo} title="Undo"><Undo2 className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={!canRedo()} onClick={redo} title="Redo"><Redo2 className="h-3.5 w-3.5" /></Button>
        </div>
        <span className="w-12 text-center capitalize">{activeTool}</span>
        <div className="flex h-7 items-center rounded-sm border border-border bg-background">
          <Button variant="ghost" size="icon" className="h-6 w-7 rounded-sm" disabled={!image} onClick={() => setZoom(zoom / 1.2)} title="Zoom out"><Minus className="h-3 w-3" /></Button>
          <span className="w-11 text-center text-foreground">{zoomPercent}%</span>
          <Button variant="ghost" size="icon" className="h-6 w-7 rounded-sm" disabled={!image} onClick={() => setZoom(zoom * 1.2)} title="Zoom in"><Plus className="h-3 w-3" /></Button>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={!image} onClick={() => setZoom(1)} title="Reset zoom"><RotateCcw className="h-3.5 w-3.5" /></Button>
      </div>
    </div>
  );
};
