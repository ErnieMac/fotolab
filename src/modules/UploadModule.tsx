import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon, Clipboard } from 'lucide-react';
import { useEditorStore, ImageData } from '@/store/editorStore';
import { toast } from 'sonner';

const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const UploadModule: React.FC = () => {
  const setImage = useEditorStore((state) => state.setImage);
  const [isDragging, setIsDragging] = React.useState(false);

  const processFile = useCallback(async (file: File) => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      toast.error('Unsupported format. Please use JPG, PNG, WEBP, or SVG.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File too large. Maximum size is 50MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const imageData: ImageData = {
          src: e.target?.result as string,
          name: file.name,
          width: img.width,
          height: img.height,
          originalWidth: img.width,
          originalHeight: img.height,
          format: file.type.split('/')[1].toUpperCase(),
          size: file.size,
        };
        setImage(imageData);
        toast.success(`Loaded ${file.name}`);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [setImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full p-8 bg-canvas">
      <div className="mb-8 text-center animate-fade-in">
        <p className="mb-2 font-heading text-xs font-medium uppercase text-primary">Local photo editor</p>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Start with an image</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">Your work stays in this browser. Open a file to crop, resize, compose, and export.</p>
      </div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative flex flex-col items-center justify-center
          w-full max-w-lg aspect-[16/9]
          rounded-md border border-dashed
          transition-all duration-150 ease-out
          ${isDragging 
            ? 'border-primary bg-primary/10 scale-[1.02]' 
            : 'border-border bg-card hover:border-primary/60 hover:bg-surface-elevated'
          }
        `}
      >
        <input
          type="file"
          accept={ACCEPTED_FORMATS.join(',')}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className={`
          flex items-center justify-center w-12 h-12 rounded-md mb-5
          transition-all duration-150
          ${isDragging ? 'bg-primary text-primary-foreground scale-110' : 'bg-secondary text-muted-foreground'}
        `}>
          {isDragging ? (
            <ImageIcon className="w-6 h-6" />
          ) : (
            <Upload className="w-6 h-6" />
          )}
        </div>
        
        <h3 className="font-heading text-base font-semibold mb-2">
          {isDragging ? 'Drop to open' : 'Open an image'}
        </h3>
        
        <p className="text-sm text-muted-foreground text-center mb-4">
          Drag and drop, or click to browse
        </p>
        
        <div className="flex flex-wrap gap-2 justify-center">
          {['JPG', 'PNG', 'WEBP', 'SVG'].map((format) => (
            <span
              key={format}
              className="px-2 py-0.5 text-[10px] font-medium rounded-sm bg-secondary text-secondary-foreground"
            >
              {format}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
        <Clipboard className="h-3.5 w-3.5" />
        <span>Paste from clipboard · Maximum 50MB</span>
      </div>
    </div>
  );
};
