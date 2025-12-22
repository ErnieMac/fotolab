import React, { useState } from 'react';
import { Download, FileImage, FileText, Image } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

type ExportFormat = 'png' | 'jpeg' | 'webp';

const FORMATS: { id: ExportFormat; name: string; icon: React.ReactNode; supportsQuality: boolean }[] = [
  { id: 'png', name: 'PNG', icon: <FileImage className="w-4 h-4" />, supportsQuality: false },
  { id: 'jpeg', name: 'JPEG', icon: <Image className="w-4 h-4" />, supportsQuality: true },
  { id: 'webp', name: 'WebP', icon: <FileText className="w-4 h-4" />, supportsQuality: true },
];

export const ExportModule: React.FC = () => {
  const { image } = useEditorStore();
  
  const [format, setFormat] = useState<ExportFormat>('png');
  const [quality, setQuality] = useState(90);
  const [filename, setFilename] = useState('');
  const [transparentBg, setTransparentBg] = useState(false);

  if (!image) return null;

  const currentFormat = FORMATS.find(f => f.id === format)!;
  const defaultFilename = image.name.replace(/\.[^/.]+$/, '');

  const handleExport = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background if not transparent
    if (!transparentBg && format === 'png') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw image
    const img = new window.Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, image.width, image.height);
      
      // Export
      const mimeType = `image/${format}`;
      const qualityValue = currentFormat.supportsQuality ? quality / 100 : undefined;
      
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Failed to export image');
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename || defaultFilename}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
        
        toast.success(`Exported as ${format.toUpperCase()}`);
      }, mimeType, qualityValue);
    };
    img.src = image.src;
  };

  const estimatedSize = () => {
    const pixels = image.width * image.height;
    let bytesPerPixel = format === 'png' ? 4 : 0.3;
    if (format !== 'png') {
      bytesPerPixel = 0.1 + (0.4 * (quality / 100));
    }
    const bytes = pixels * bytesPerPixel;
    if (bytes > 1024 * 1024) {
      return `~${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `~${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold">Export</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {image.width}×{image.height}px
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Format selection */}
        <div className="space-y-3">
          <Label className="text-xs text-muted-foreground">Format</Label>
          <div className="grid grid-cols-3 gap-2">
            {FORMATS.map((f) => (
              <Button
                key={f.id}
                variant={format === f.id ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setFormat(f.id)}
                className="flex items-center gap-2"
              >
                {f.icon}
                {f.name}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Quality slider */}
        {currentFormat.supportsQuality && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Quality</Label>
              <span className="text-xs font-medium">{quality}%</span>
            </div>
            <Slider
              value={[quality]}
              onValueChange={([v]) => setQuality(v)}
              min={10}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-[10px] text-muted-foreground">
              Estimated size: {estimatedSize()}
            </p>
          </div>
        )}

        {format === 'png' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Transparent Background</Label>
              <Switch
                checked={transparentBg}
                onCheckedChange={setTransparentBg}
              />
            </div>
          </div>
        )}

        <Separator />

        {/* Filename */}
        <div className="space-y-3">
          <Label className="text-xs text-muted-foreground">Filename</Label>
          <div className="flex items-center gap-2">
            <Input
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder={defaultFilename}
              className="bg-secondary border-border"
            />
            <span className="text-sm text-muted-foreground">.{format}</span>
          </div>
        </div>
      </div>

      {/* Export button */}
      <div className="p-4 border-t border-border">
        <Button 
          onClick={handleExport}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Image
        </Button>
      </div>
    </div>
  );
};
