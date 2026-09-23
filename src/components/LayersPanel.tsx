import React from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Image,
  Square,
  Type,
  GripVertical,
} from 'lucide-react';
import { useLayerStore, Layer } from '@/store/layerStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface LayerItemProps {
  layer: Layer;
  index: number;
}

const LayerIcon: React.FC<{ type: Layer['type'] }> = ({ type }) => {
  switch (type) {
    case 'image':
      return <Image className="w-4 h-4" />;
    case 'shape':
      return <Square className="w-4 h-4" />;
    case 'text':
      return <Type className="w-4 h-4" />;
  }
};

const LayerItem: React.FC<LayerItemProps> = ({ layer, index }) => {
  const {
    selectedLayerId,
    selectLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    removeLayer,
    duplicateLayer,
    moveLayerUp,
    moveLayerDown,
    layers,
  } = useLayerStore();

  const isSelected = selectedLayerId === layer.id;
  const isFirst = index === 0;
  const isLast = index === layers.length - 1;

  return (
    <div
      className={cn(
        'group flex items-center gap-2 px-2 py-2 rounded-sm cursor-pointer transition-all duration-150',
        isSelected
          ? 'bg-primary/20 border border-primary/40'
          : 'hover:bg-surface-hover border border-transparent',
        !layer.visible && 'opacity-50'
      )}
      onClick={() => selectLayer(layer.id)}
    >
      {/* Drag handle */}
      <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />

      {/* Layer type icon */}
      <div className="flex-shrink-0 w-6 h-6 rounded bg-secondary flex items-center justify-center">
        <LayerIcon type={layer.type} />
      </div>

      {/* Layer name */}
      <span className="flex-1 text-xs truncate">{layer.name}</span>

      {/* Quick actions */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="w-5 h-5"
          onClick={(e) => {
            e.stopPropagation();
            toggleLayerVisibility(layer.id);
          }}
        >
          {layer.visible ? (
            <Eye className="w-3 h-3" />
          ) : (
            <EyeOff className="w-3 h-3" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-5 h-5"
          onClick={(e) => {
            e.stopPropagation();
            toggleLayerLock(layer.id);
          }}
        >
          {layer.locked ? (
            <Lock className="w-3 h-3" />
          ) : (
            <Unlock className="w-3 h-3" />
          )}
        </Button>
      </div>
    </div>
  );
};

export const LayersPanel: React.FC = () => {
  const {
    layers,
    selectedLayerId,
    removeLayer,
    duplicateLayer,
    moveLayerUp,
    moveLayerDown,
  } = useLayerStore();

  const selectedLayer = layers.find((l) => l.id === selectedLayerId);
  const selectedIndex = layers.findIndex((l) => l.id === selectedLayerId);

  return (
    <div className="flex flex-col h-full">
      {/* Layer actions toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7"
          disabled={!selectedLayerId || selectedIndex === 0}
          onClick={() => selectedLayerId && moveLayerUp(selectedLayerId)}
          title="Move layer up"
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7"
          disabled={!selectedLayerId || selectedIndex === layers.length - 1}
          onClick={() => selectedLayerId && moveLayerDown(selectedLayerId)}
          title="Move layer down"
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7"
          disabled={!selectedLayerId}
          onClick={() => selectedLayerId && duplicateLayer(selectedLayerId)}
          title="Duplicate layer"
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7 text-destructive hover:text-destructive"
          disabled={!selectedLayerId}
          onClick={() => selectedLayerId && removeLayer(selectedLayerId)}
          title="Delete layer"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Layers list */}
      <ScrollArea className="flex-1">
         <div className="p-2 space-y-1">
          {layers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-xs">
              No layers yet. Add an image, shape, or text to get started.
            </div>
          ) : (
            layers.map((layer, index) => (
              <LayerItem key={layer.id} layer={layer} index={index} />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
