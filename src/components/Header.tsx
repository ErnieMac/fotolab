import React from 'react';
import { 
  Image, 
  Settings,
  ChevronDown,
  Moon,
  Sun,
  Aperture,
  FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/store/editorStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header: React.FC = () => {
  const { image, reset } = useEditorStore();
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  const handleNewProject = () => {
    reset();
  };

  return (
    <header className="flex items-center justify-between h-12 px-3 bg-toolbar border-b border-border shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-5 min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Aperture className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-heading text-sm font-semibold">FotoLab</span>
        </div>

        {image && (
          <>
            <span className="h-4 w-px bg-border" />
            <span className="text-xs text-muted-foreground truncate max-w-[260px]">
              {image.name}
            </span>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleNewProject}
          className="h-8 gap-2 text-xs border-border bg-secondary/40"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          New project
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="w-8 h-8 text-muted-foreground hover:text-foreground"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <Settings className="w-4 h-4" />
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleNewProject}>
              <Image className="w-4 h-4 mr-2" />
              New project
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="text-muted-foreground">
              <span className="text-xs">FotoLab 1.0</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
