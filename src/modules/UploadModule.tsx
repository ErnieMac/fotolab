import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center h-full w-full p-8">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative flex flex-col items-center justify-center
          w-full max-w-xl aspect-video
          rounded-xl border-2 border-dashed
          transition-all duration-300 ease-out
          ${isDragging 
            ? 'border-primary bg-primary/10 scale-[1.02]' 
            : 'border-border bg-card hover:border-muted-foreground hover:bg-surface-elevated'
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
          flex items-center justify-center w-16 h-16 rounded-2xl mb-6
          transition-all duration-300
          ${isDragging ? 'bg-primary text-primary-foreground scale-110' : 'bg-secondary text-muted-foreground'}
        `}>
          {isDragging ? (
            <ImageIcon className="w-8 h-8" />
          ) : (
            <Upload className="w-8 h-8" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          {isDragging ? 'Drop your image here' : 'Upload an image'}
        </h3>
        
        <p className="text-sm text-muted-foreground text-center mb-4">
          Drag and drop or click to browse
        </p>
        
        <div className="flex flex-wrap gap-2 justify-center">
          {['JPG', 'PNG', 'WEBP', 'SVG'].map((format) => (
            <span
              key={format}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-secondary text-secondary-foreground"
            >
              {format}
            </span>
          ))}
        </div>
      </div>
      
      <p className="mt-6 text-xs text-muted-foreground">
        Maximum file size: 50MB
      </p>
    </div>
  );
};
