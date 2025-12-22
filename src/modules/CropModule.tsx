import React from 'react';
import { RatioIcon, RotateCcw, Check, X } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const ASPECT_RATIOS = [
  { name: 'Free', value: null },
  { name: '1:1', value: 1 },
  { name: '4:3', value: 4/3 },
  { name: '16:9', value: 16/9 },
  { name: '3:2', value: 3/2 },
  { name: '2:3', value: 2/3 },
  { name: '9:16', value: 9/16 },
];

export const CropModule: React.FC = () => {
  const {
    image,
    cropData,
    setCropData,
    applyCrop,
    setActiveTool,
    setActivePanel,
  } = useEditorStore();

  if (!image) return null;

  const currentCrop = cropData || {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
    aspectRatio: null,
  };

  const handleAspectRatioChange = (ratio: number | null) => {
    if (!ratio) {
      setCropData({ ...currentCrop, aspectRatio: null });
      return;
    }
    
    const newHeight = Math.round(currentCrop.width / ratio);
    setCropData({
      ...currentCrop,
      height: Math.min(newHeight, image.height),
      aspectRatio: ratio,
    });
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    const newCrop = { ...currentCrop, [dimension]: value };
    
    if (currentCrop.aspectRatio) {
      if (dimension === 'width') {
        newCrop.height = Math.round(value / currentCrop.aspectRatio);
      } else {
        newCrop.width = Math.round(value * currentCrop.aspectRatio);
      }
    }
    
    setCropData(newCrop);
  };

  const handleReset = () => {
    setCropData({
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
      aspectRatio: null,
    });
  };

  const handleApply = () => {
    applyCrop();
  };

  const handleCancel = () => {
    setCropData(null);
    setActiveTool('select');
    setActivePanel(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold">Crop & Scale</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Select area to crop
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Aspect Ratio */}
        <div className="space-y-3">
          <Label className="text-xs text-muted-foreground flex items-center gap-2">
            <RatioIcon className="w-3 h-3" />
            Aspect Ratio
          </Label>
          <div className="grid grid-cols-4 gap-2">
            {ASPECT_RATIOS.map((ratio) => (
              <Button
                key={ratio.name}
                variant={currentCrop.aspectRatio === ratio.value ? 'default' : 'secondary'}
                size="sm"
                onClick={() => handleAspectRatioChange(ratio.value)}
                className="text-xs"
              >
                {ratio.name}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Crop dimensions */}
        <div className="space-y-4">
          <Label className="text-xs text-muted-foreground">Crop Size</Label>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Width</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={currentCrop.width}
                  onChange={(e) => handleDimensionChange('width', Number(e.target.value))}
                  max={image.width}
                  min={1}
                  className="pr-8 bg-secondary border-border"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  px
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Height</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={currentCrop.height}
                  onChange={(e) => handleDimensionChange('height', Number(e.target.value))}
                  max={image.height}
                  min={1}
                  className="pr-8 bg-secondary border-border"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  px
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">X Position</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={currentCrop.x}
                  onChange={(e) => setCropData({ ...currentCrop, x: Number(e.target.value) })}
                  max={image.width - currentCrop.width}
                  min={0}
                  className="pr-8 bg-secondary border-border"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  px
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Y Position</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={currentCrop.y}
                  onChange={(e) => setCropData({ ...currentCrop, y: Number(e.target.value) })}
                  max={image.height - currentCrop.height}
                  min={0}
                  className="pr-8 bg-secondary border-border"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  px
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="w-full text-muted-foreground"
          >
            <RotateCcw className="w-3 h-3 mr-2" />
            Reset crop area
          </Button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-4 border-t border-border space-y-2">
        <Button 
          onClick={handleApply}
          className="w-full"
        >
          <Check className="w-4 h-4 mr-2" />
          Apply Crop
        </Button>
        <Button 
          variant="ghost"
          onClick={handleCancel}
          className="w-full text-muted-foreground"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};
