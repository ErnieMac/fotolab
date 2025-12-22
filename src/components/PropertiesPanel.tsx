import React from 'react';
import { 
  Maximize2, 
  Crop, 
  Download, 
  Info,
  Layers,
} from 'lucide-react';
import { useEditorStore, Panel } from '@/store/editorStore';
import { useLayerStore } from '@/store/layerStore';
import { Button } from '@/components/ui/button';
import { ResizeModule } from '@/modules/ResizeModule';
import { CropModule } from '@/modules/CropModule';
import { ExportModule } from '@/modules/ExportModule';
import { InfoModule } from '@/modules/InfoModule';
import { LayersPanel } from '@/components/LayersPanel';
import { LayerPropertiesPanel } from '@/components/LayerPropertiesPanel';
import { AddLayerToolbar } from '@/components/AddLayerToolbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const { layers } = useLayerStore();

  const hasContent = image || layers.length > 0;

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
    <div className="flex flex-col h-full w-80 bg-panel border-l border-panel-border">
      {/* Layers section - always visible */}
      <div className="flex-1 flex flex-col min-h-0 border-b border-border">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium">Layers</span>
        </div>
        <AddLayerToolbar />
        <div className="flex-1 min-h-0">
          <Tabs defaultValue="layers" className="h-full flex flex-col">
            <TabsList className="mx-2 mt-2 grid grid-cols-2 h-8">
              <TabsTrigger value="layers" className="text-xs h-7">Layers</TabsTrigger>
              <TabsTrigger value="properties" className="text-xs h-7">Properties</TabsTrigger>
            </TabsList>
            <TabsContent value="layers" className="flex-1 mt-0 overflow-hidden">
              <LayersPanel />
            </TabsContent>
            <TabsContent value="properties" className="flex-1 mt-0 overflow-hidden">
              <ScrollArea className="h-full">
                <LayerPropertiesPanel />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Tools panel tabs */}
      {hasContent && (
        <>
          <div className="flex items-center gap-1 p-2 border-b border-border overflow-x-auto">
            <PanelTab panel="resize" icon={<Maximize2 className="w-3.5 h-3.5" />} label="Resize" />
            <PanelTab panel="crop" icon={<Crop className="w-3.5 h-3.5" />} label="Crop" />
            <PanelTab panel="export" icon={<Download className="w-3.5 h-3.5" />} label="Export" />
            <PanelTab panel="info" icon={<Info className="w-3.5 h-3.5" />} label="Info" />
          </div>

          {/* Panel content */}
          <div className="h-64 overflow-hidden">
            <ScrollArea className="h-full">
              {renderPanelContent()}
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
};
