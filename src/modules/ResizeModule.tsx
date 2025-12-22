import React from 'react';
import { Link2, Link2Off, RotateCcw } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const PRESETS = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Facebook Cover', width: 820, height: 312 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'Twitter Header', width: 1500, height: 500 },
  { name: 'HD', width: 1920, height: 1080 },
  { name: '4K', width: 3840, height: 2160 },
  { name: 'A4 Print (300dpi)', width: 2480, height: 3508 },
];

const DPI_OPTIONS = [72, 144, 300, 600];

export const ResizeModule: React.FC = () => {
  const {
    image,
    resizeWidth,
    resizeHeight,
    lockAspectRatio,
    dpi,
    setResizeWidth,
    setResizeHeight,
    setLockAspectRatio,
    setDpi,
    applyResize,
  } = useEditorStore();

  if (!image) return null;

  const handlePresetClick = (width: number, height: number) => {
    setResizeWidth(width);
    if (!lockAspectRatio) {
      setResizeHeight(height);
    }
  };

  const handleReset = () => {
    setResizeWidth(image.originalWidth);
    setResizeHeight(image.originalHeight);
  };

  const handleApply = () => {
    applyResize();
    toast.success(`Resized to ${resizeWidth}×${resizeHeight}px`);
  };

  const percentWidth = Math.round((resizeWidth / image.originalWidth) * 100);
  const percentHeight = Math.round((resizeHeight / image.originalHeight) * 100);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold">Resize & Dimensions</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Original: {image.originalWidth}×{image.originalHeight}px
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Dimensions */}
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-2">
              <Label className="text-xs text-muted-foreground">Width</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={resizeWidth}
                  onChange={(e) => setResizeWidth(Number(e.target.value))}
                  className="pr-10 bg-secondary border-border"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  px
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">{percentWidth}%</p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLockAspectRatio(!lockAspectRatio)}
              className={`mb-6 ${lockAspectRatio ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {lockAspectRatio ? <Link2 className="w-4 h-4" /> : <Link2Off className="w-4 h-4" />}
            </Button>
            
            <div className="flex-1 space-y-2">
              <Label className="text-xs text-muted-foreground">Height</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={resizeHeight}
                  onChange={(e) => setResizeHeight(Number(e.target.value))}
                  className="pr-10 bg-secondary border-border"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  px
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">{percentHeight}%</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="w-full text-muted-foreground"
          >
            <RotateCcw className="w-3 h-3 mr-2" />
            Reset to original
          </Button>
        </div>

        <Separator />

        {/* DPI */}
        <div className="space-y-3">
          <Label className="text-xs text-muted-foreground">Resolution (DPI)</Label>
          <div className="grid grid-cols-4 gap-2">
            {DPI_OPTIONS.map((option) => (
              <Button
                key={option}
                variant={dpi === option ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setDpi(option)}
                className="text-xs"
              >
                {option}
              </Button>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground">
            Print size: {(resizeWidth / dpi).toFixed(2)}" × {(resizeHeight / dpi).toFixed(2)}"
          </p>
        </div>

        <Separator />

        {/* Presets */}
        <div className="space-y-3">
          <Label className="text-xs text-muted-foreground">Presets</Label>
          <div className="grid gap-2">
            {PRESETS.map((preset) => (
              <Button
                key={preset.name}
                variant="ghost"
                size="sm"
                onClick={() => handlePresetClick(preset.width, preset.height)}
                className="justify-between text-xs h-8 px-3"
              >
                <span>{preset.name}</span>
                <span className="text-muted-foreground">
                  {preset.width}×{preset.height}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Apply button */}
      <div className="p-4 border-t border-border">
        <Button 
          onClick={handleApply}
          className="w-full"
          disabled={resizeWidth === image.width && resizeHeight === image.height}
        >
          Apply Resize
        </Button>
      </div>
    </div>
  );
};
