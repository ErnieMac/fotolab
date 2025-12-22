import React from 'react';
import { 
  MousePointer2, 
  Crop, 
  Move, 
  Maximize2, 
  Undo2, 
  Redo2,
  Grid3X3,
  Ruler,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { useEditorStore, Tool } from '@/store/editorStore';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ToolButtonProps {
  tool?: Tool;
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({ 
  tool, 
  icon, 
  label, 
  shortcut, 
  isActive, 
  onClick,
  disabled 
}) => {
  const { activeTool, setActiveTool, setActivePanel } = useEditorStore();
  const active = isActive !== undefined ? isActive : (tool && activeTool === tool);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (tool) {
      setActiveTool(tool);
      if (tool === 'resize') {
        setActivePanel('resize');
      } else if (tool === 'crop') {
        setActivePanel('crop');
      }
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClick}
          disabled={disabled}
          className={`
            w-9 h-9 rounded-lg transition-all duration-150
            ${active 
              ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-2">
        <span>{label}</span>
        {shortcut && (
          <kbd className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-muted text-muted-foreground">
            {shortcut}
          </kbd>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

export const ToolbarModule: React.FC = () => {
  const { 
    image,
    zoom,
    setZoom,
    showGrid, 
    showRulers, 
    toggleGrid, 
    toggleRulers,
    canUndo,
    canRedo,
    undo,
    redo,
    setActivePanel,
    activeTool,
    setActiveTool,
  } = useEditorStore();

  const hasImage = !!image;

  return (
    <div className="flex flex-col items-center py-3 px-1.5 bg-toolbar rounded-xl panel-shadow">
      {/* Main tools */}
      <div className="flex flex-col gap-1">
        <ToolButton
          tool="select"
          icon={<MousePointer2 className="w-4 h-4" />}
          label="Select"
          shortcut="V"
          disabled={!hasImage}
        />
        <ToolButton
          tool="pan"
          icon={<Move className="w-4 h-4" />}
          label="Pan"
          shortcut="H"
          disabled={!hasImage}
        />
        <ToolButton
          tool="crop"
          icon={<Crop className="w-4 h-4" />}
          label="Crop"
          shortcut="C"
          disabled={!hasImage}
          onClick={() => {
            setActiveTool('crop');
            setActivePanel('crop');
          }}
        />
        <ToolButton
          tool="resize"
          icon={<Maximize2 className="w-4 h-4" />}
          label="Resize"
          shortcut="R"
          disabled={!hasImage}
          onClick={() => {
            setActiveTool('resize');
            setActivePanel('resize');
          }}
        />
      </div>

      <Separator className="my-3 w-6 bg-border" />

      {/* Zoom controls */}
      <div className="flex flex-col gap-1">
        <ToolButton
          icon={<ZoomIn className="w-4 h-4" />}
          label="Zoom In"
          shortcut="+"
          disabled={!hasImage}
          onClick={() => setZoom(zoom * 1.25)}
        />
        <ToolButton
          icon={<ZoomOut className="w-4 h-4" />}
          label="Zoom Out"
          shortcut="-"
          disabled={!hasImage}
          onClick={() => setZoom(zoom * 0.8)}
        />
        <ToolButton
          icon={<RotateCcw className="w-4 h-4" />}
          label="Reset Zoom"
          shortcut="0"
          disabled={!hasImage}
          onClick={() => setZoom(1)}
        />
      </div>

      <Separator className="my-3 w-6 bg-border" />

      {/* View options */}
      <div className="flex flex-col gap-1">
        <ToolButton
          icon={<Grid3X3 className="w-4 h-4" />}
          label="Toggle Grid"
          shortcut="G"
          isActive={showGrid}
          onClick={toggleGrid}
          disabled={!hasImage}
        />
        <ToolButton
          icon={<Ruler className="w-4 h-4" />}
          label="Toggle Rulers"
          shortcut="'"
          isActive={showRulers}
          onClick={toggleRulers}
          disabled={!hasImage}
        />
      </div>

      <Separator className="my-3 w-6 bg-border" />

      {/* History */}
      <div className="flex flex-col gap-1">
        <ToolButton
          icon={<Undo2 className="w-4 h-4" />}
          label="Undo"
          shortcut="⌘Z"
          disabled={!canUndo()}
          onClick={undo}
        />
        <ToolButton
          icon={<Redo2 className="w-4 h-4" />}
          label="Redo"
          shortcut="⌘⇧Z"
          disabled={!canRedo()}
          onClick={redo}
        />
      </div>
    </div>
  );
};
