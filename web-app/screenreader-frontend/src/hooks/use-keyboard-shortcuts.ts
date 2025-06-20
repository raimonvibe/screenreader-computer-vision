import { useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface KeyboardShortcuts {
  onCaptureScreen?: () => void;
  onUploadImage?: () => void;
  onToggleTesseract?: () => void;
  onToggleEasyOCR?: () => void;
  onClearResults?: () => void;
  onToggleRegionMode?: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts, enabled: boolean = true) {
  const { toast } = useToast();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 's':
          event.preventDefault();
          shortcuts.onCaptureScreen?.();
          toast({
            title: "Screen Capture",
            description: "Capturing screen...",
          });
          break;
        case 'u':
          event.preventDefault();
          shortcuts.onUploadImage?.();
          break;
        case 'r':
          if (event.shiftKey) {
            event.preventDefault();
            shortcuts.onToggleRegionMode?.();
            toast({
              title: "Region Mode",
              description: "Toggled region capture mode",
            });
          } else {
            event.preventDefault();
            shortcuts.onClearResults?.();
            toast({
              title: "Results Cleared",
              description: "OCR results have been cleared",
            });
          }
          break;
        case '1':
          event.preventDefault();
          shortcuts.onToggleTesseract?.();
          toast({
            title: "Tesseract OCR",
            description: "Toggled Tesseract engine",
          });
          break;
        case '2':
          event.preventDefault();
          shortcuts.onToggleEasyOCR?.();
          toast({
            title: "EasyOCR",
            description: "Toggled EasyOCR engine",
          });
          break;
      }
    }

    if (event.key === 'F1') {
      event.preventDefault();
      toast({
        title: "Keyboard Shortcuts",
        description: "Ctrl+S: Capture Screen, Ctrl+U: Upload, Ctrl+R: Clear Results, Ctrl+Shift+R: Toggle Region Mode, Ctrl+1: Toggle Tesseract, Ctrl+2: Toggle EasyOCR",
      });
    }
  }, [shortcuts, enabled, toast]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);

  return {
    showShortcutsHelp: () => {
      toast({
        title: "Keyboard Shortcuts",
        description: "Press F1 to see all available shortcuts",
      });
    }
  };
}
