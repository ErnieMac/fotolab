import React from 'react';
import { FileImage, Ruler, Palette, HardDrive } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { Separator } from '@/components/ui/separator';

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const InfoModule: React.FC = () => {
  const { image, dpi } = useEditorStore();

  if (!image) return null;

  const printWidth = (image.width / dpi).toFixed(2);
  const printHeight = (image.height / dpi).toFixed(2);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold">Image Info</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* File info */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-secondary">
            <FileImage className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{image.name}</p>
            <p className="text-xs text-muted-foreground">{image.format}</p>
          </div>
        </div>

        <Separator />

        {/* Dimensions */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Ruler className="w-3 h-3" />
            Dimensions
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Current</p>
              <p className="text-sm font-medium">{image.width} × {image.height}px</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Original</p>
              <p className="text-sm font-medium">{image.originalWidth} × {image.originalHeight}px</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Resolution */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Palette className="w-3 h-3" />
            Print Size @ {dpi} DPI
          </div>
          <p className="text-sm font-medium">{printWidth}" × {printHeight}"</p>
          <p className="text-xs text-muted-foreground">
            {(parseFloat(printWidth) * 2.54).toFixed(1)}cm × {(parseFloat(printHeight) * 2.54).toFixed(1)}cm
          </p>
        </div>

        <Separator />

        {/* File size */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <HardDrive className="w-3 h-3" />
            File Size
          </div>
          <p className="text-sm font-medium">{formatBytes(image.size)}</p>
        </div>

        {/* Megapixels */}
        <div className="p-3 rounded-lg bg-secondary">
          <p className="text-xs text-muted-foreground">Megapixels</p>
          <p className="text-lg font-semibold text-primary">
            {((image.width * image.height) / 1000000).toFixed(1)} MP
          </p>
        </div>
      </div>
    </div>
  );
};
