import React from 'react';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/StatusBar';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { ToolbarModule } from '@/modules/ToolbarModule';
import { CanvasModule } from '@/modules/CanvasModule';
import { UploadModule } from '@/modules/UploadModule';
import { useEditorStore } from '@/store/editorStore';

export const EditorLayout: React.FC = () => {
  const image = useEditorStore((state) => state.image);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        {image && (
          <div className="flex items-start p-3">
            <ToolbarModule />
          </div>
        )}

        {/* Canvas area */}
        <div className="flex-1 overflow-hidden">
          {image ? (
            <CanvasModule />
          ) : (
            <UploadModule />
          )}
        </div>

        {/* Properties panel */}
        {image && <PropertiesPanel />}
      </div>

      {/* Status bar */}
      <StatusBar />
    </div>
  );
};
