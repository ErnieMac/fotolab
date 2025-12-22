import React from 'react';
import { 
  Maximize2, 
  Crop, 
  Download, 
  Info,
  X
} from 'lucide-react';
import { useEditorStore, Panel } from '@/store/editorStore';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ResizeModule } from '@/modules/ResizeModule';
import { CropModule } from '@/modules/CropModule';
import { ExportModule } from '@/modules/ExportModule';
import { InfoModule } from '@/modules/InfoModule';

interface PanelTabProps {
  panel: Panel;
  icon: React.ReactNode;
  label: string;
}

const PanelTab: React.FC<PanelTabProps> = ({ panel, icon, label }) => {
  const { activePanel, setActivePanel } = useEditorStore();
  const isActive = activePanel === panel;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setActivePanel(isActive ? null : panel)}
      className={`
        flex items-center gap-2 h-8 px-3 rounded-md transition-all
        ${isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
        }
      `}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
};

export const PropertiesPanel: React.FC = () => {
  const { image, activePanel, setActivePanel } = useEditorStore();

  if (!image) return null;

  const renderPanelContent = () => {
    switch (activePanel) {
      case 'resize':
        return <ResizeModule />;
      case 'crop':
        return <CropModule />;
      case 'export':
        return <ExportModule />;
      case 'info':
        return <InfoModule />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
              <Info className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Select a tool or panel to get started
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full w-72 bg-panel border-l border-panel-border">
      {/* Panel tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-border overflow-x-auto">
        <PanelTab panel="resize" icon={<Maximize2 className="w-3.5 h-3.5" />} label="Resize" />
        <PanelTab panel="crop" icon={<Crop className="w-3.5 h-3.5" />} label="Crop" />
        <PanelTab panel="export" icon={<Download className="w-3.5 h-3.5" />} label="Export" />
        <PanelTab panel="info" icon={<Info className="w-3.5 h-3.5" />} label="Info" />
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-hidden">
        {renderPanelContent()}
      </div>
    </div>
  );
};
