import React from 'react';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/StatusBar';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { ToolbarModule } from '@/modules/ToolbarModule';
import { CanvasModule } from '@/modules/CanvasModule';
import { LayerCanvas } from '@/modules/LayerCanvasModule';
import { UploadModule } from '@/modules/UploadModule';
import { useEditorStore } from '@/store/editorStore';
import { useLayerStore } from '@/store/layerStore';

export const EditorLayout: React.FC = () => {
  const image = useEditorStore((state) => state.image);
  const layers = useLayerStore((state) => state.layers);

  const hasContent = image || layers.length > 0;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Toolbar */}
        <ToolbarModule />

        {/* Canvas area */}
        <div className="flex-1 min-w-0 overflow-hidden border-x border-border">
          {layers.length > 0 ? (
            <LayerCanvas />
          ) : image ? (
            <CanvasModule />
          ) : (
            <UploadModule />
          )}
        </div>

        {/* Properties panel - always show for layer management */}
        <PropertiesPanel />
      </div>

      {/* Status bar */}
      <StatusBar />
    </div>
  );
};
