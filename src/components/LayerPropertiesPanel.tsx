import React from 'react';
import { useLayerStore, ImageLayer, ShapeLayer, TextLayer } from '@/store/layerStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TransformControls: React.FC = () => {
  const { getSelectedLayer, updateLayerTransform, selectedLayerId } = useLayerStore();
  const layer = getSelectedLayer();

  if (!layer) return null;

  const { transform } = layer;

  const handleChange = (key: keyof typeof transform, value: number) => {
    updateLayerTransform(selectedLayerId!, { [key]: value });
  };

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Transform</h4>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">X</Label>
          <Input
            type="number"
            value={Math.round(transform.x)}
            onChange={(e) => handleChange('x', Number(e.target.value))}
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Y</Label>
          <Input
            type="number"
            value={Math.round(transform.y)}
            onChange={(e) => handleChange('y', Number(e.target.value))}
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Width</Label>
          <Input
            type="number"
            value={Math.round(transform.width)}
            onChange={(e) => handleChange('width', Number(e.target.value))}
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Height</Label>
          <Input
            type="number"
            value={Math.round(transform.height)}
            onChange={(e) => handleChange('height', Number(e.target.value))}
            className="h-8 text-xs"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Rotation</Label>
        <div className="flex items-center gap-2">
          <Slider
            value={[transform.rotation]}
            onValueChange={([v]) => handleChange('rotation', v)}
            min={-180}
            max={180}
            step={1}
            className="flex-1"
          />
          <span className="text-xs w-12 text-right">{transform.rotation}°</span>
        </div>
      </div>
    </div>
  );
};

const ImageLayerControls: React.FC<{ layer: ImageLayer }> = ({ layer }) => {
  const { updateLayer } = useLayerStore();

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Image</h4>
      <div className="space-y-1">
        <Label className="text-xs">Opacity</Label>
        <div className="flex items-center gap-2">
          <Slider
            value={[layer.opacity * 100]}
            onValueChange={([v]) => updateLayer(layer.id, { opacity: v / 100 })}
            min={0}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs w-12 text-right">{Math.round(layer.opacity * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

const ShapeLayerControls: React.FC<{ layer: ShapeLayer }> = ({ layer }) => {
  const { updateLayer } = useLayerStore();

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Shape</h4>
      
      <div className="space-y-1">
        <Label className="text-xs">Fill Color</Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={layer.fill}
            onChange={(e) => updateLayer(layer.id, { fill: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer border border-border"
          />
          <Input
            value={layer.fill}
            onChange={(e) => updateLayer(layer.id, { fill: e.target.value })}
            className="h-8 text-xs flex-1"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Stroke Color</Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={layer.stroke}
            onChange={(e) => updateLayer(layer.id, { stroke: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer border border-border"
          />
          <Input
            value={layer.stroke}
            onChange={(e) => updateLayer(layer.id, { stroke: e.target.value })}
            className="h-8 text-xs flex-1"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Stroke Width</Label>
        <div className="flex items-center gap-2">
          <Slider
            value={[layer.strokeWidth]}
            onValueChange={([v]) => updateLayer(layer.id, { strokeWidth: v })}
            min={0}
            max={20}
            step={1}
            className="flex-1"
          />
          <span className="text-xs w-12 text-right">{layer.strokeWidth}px</span>
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Opacity</Label>
        <div className="flex items-center gap-2">
          <Slider
            value={[layer.opacity * 100]}
            onValueChange={([v]) => updateLayer(layer.id, { opacity: v / 100 })}
            min={0}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs w-12 text-right">{Math.round(layer.opacity * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

const TextLayerControls: React.FC<{ layer: TextLayer }> = ({ layer }) => {
  const { updateLayer } = useLayerStore();

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Text</h4>
      
      <div className="space-y-1">
        <Label className="text-xs">Content</Label>
        <Input
          value={layer.text}
          onChange={(e) => updateLayer(layer.id, { text: e.target.value })}
          className="h-8 text-xs"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Font Family</Label>
        <Select
          value={layer.fontFamily}
          onValueChange={(v) => updateLayer(layer.id, { fontFamily: v })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Geist">Geist</SelectItem>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Size</Label>
          <Input
            type="number"
            value={layer.fontSize}
            onChange={(e) => updateLayer(layer.id, { fontSize: Number(e.target.value) })}
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Weight</Label>
          <Select
            value={String(layer.fontWeight)}
            onValueChange={(v) => updateLayer(layer.id, { fontWeight: Number(v) })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="400">Regular</SelectItem>
              <SelectItem value="500">Medium</SelectItem>
              <SelectItem value="600">Semibold</SelectItem>
              <SelectItem value="700">Bold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Color</Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={layer.color}
            onChange={(e) => updateLayer(layer.id, { color: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer border border-border"
          />
          <Input
            value={layer.color}
            onChange={(e) => updateLayer(layer.id, { color: e.target.value })}
            className="h-8 text-xs flex-1"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Align</Label>
        <Select
          value={layer.align}
          onValueChange={(v: 'left' | 'center' | 'right') => updateLayer(layer.id, { align: v })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Opacity</Label>
        <div className="flex items-center gap-2">
          <Slider
            value={[layer.opacity * 100]}
            onValueChange={([v]) => updateLayer(layer.id, { opacity: v / 100 })}
            min={0}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs w-12 text-right">{Math.round(layer.opacity * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export const LayerPropertiesPanel: React.FC = () => {
  const { getSelectedLayer, updateLayer, selectedLayerId } = useLayerStore();
  const layer = getSelectedLayer();

  if (!layer) {
    return (
      <div className="p-4 text-center text-muted-foreground text-xs">
        Select a layer to edit its properties
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      {/* Layer name */}
      <div className="space-y-1">
        <Label className="text-xs">Layer Name</Label>
        <Input
          value={layer.name}
          onChange={(e) => updateLayer(layer.id, { name: e.target.value })}
          className="h-8 text-xs"
        />
      </div>

      <Separator />

      <TransformControls />

      <Separator />

      {layer.type === 'image' && <ImageLayerControls layer={layer} />}
      {layer.type === 'shape' && <ShapeLayerControls layer={layer} />}
      {layer.type === 'text' && <TextLayerControls layer={layer} />}
    </div>
  );
};
