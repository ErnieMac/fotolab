import React, { useRef } from 'react';
import { Image, Square, Circle, Type, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLayerStore } from '@/store/layerStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export const AddLayerToolbar: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addLayer, createImageLayer, createShapeLayer, createTextLayer, setCanvasSize, canvasWidth, canvasHeight } = useLayerStore();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload JPG, PNG, WEBP, or SVG.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const layer = createImageLayer(
          event.target?.result as string,
          img.width,
          img.height,
          file.name
        );
        
        // If this is the first layer, set canvas size to image size
        if (canvasWidth === 1920 && canvasHeight === 1080) {
          setCanvasSize(img.width, img.height);
        }
        
        addLayer(layer);
        toast.success('Image layer added');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddShape = (shapeType: 'rectangle' | 'ellipse' | 'line') => {
    const layer = createShapeLayer(shapeType);
    addLayer(layer);
    toast.success(`${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} added`);
  };

  const handleAddText = () => {
    const layer = createTextLayer('Double-click to edit');
    addLayer(layer);
    toast.success('Text layer added');
  };

  return (
    <div className="flex items-center gap-1 p-2 border-b border-border">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        onChange={handleImageUpload}
        className="hidden"
      />
      
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-2"
        onClick={() => fileInputRef.current?.click()}
      >
        <Image className="w-4 h-4" />
        <span className="text-xs">Image</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-2">
            <Square className="w-4 h-4" />
            <span className="text-xs">Shape</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-popover">
          <DropdownMenuItem onClick={() => handleAddShape('rectangle')}>
            <Square className="w-4 h-4 mr-2" />
            Rectangle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddShape('ellipse')}>
            <Circle className="w-4 h-4 mr-2" />
            Ellipse
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddShape('line')}>
            <Minus className="w-4 h-4 mr-2" />
            Line
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-2"
        onClick={handleAddText}
      >
        <Type className="w-4 h-4" />
        <span className="text-xs">Text</span>
      </Button>
    </div>
  );
};
