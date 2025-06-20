import React, { useState, useEffect } from 'react';
import { Settings, Save, RotateCcw, Download, Upload, Keyboard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AppSettings } from '@/types';
import { loadAppData, updateSettings, exportData, importData } from '@/lib/storage';

const languages = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish' },
  { code: 'fra', name: 'French' },
  { code: 'deu', name: 'German' },
  { code: 'ita', name: 'Italian' },
  { code: 'por', name: 'Portuguese' },
  { code: 'rus', name: 'Russian' },
  { code: 'jpn', name: 'Japanese' },
  { code: 'chi_sim', name: 'Chinese (Simplified)' },
  { code: 'chi_tra', name: 'Chinese (Traditional)' },
  { code: 'kor', name: 'Korean' },
  { code: 'ara', name: 'Arabic' },
  { code: 'hin', name: 'Hindi' },
];

const keyboardShortcuts = [
  { key: 'Ctrl+S', action: 'Capture Screen' },
  { key: 'Ctrl+U', action: 'Upload Image' },
  { key: 'Ctrl+R', action: 'Clear Results' },
  { key: 'Ctrl+Shift+R', action: 'Toggle Region Mode' },
  { key: 'Ctrl+1', action: 'Toggle Tesseract' },
  { key: 'Ctrl+2', action: 'Toggle EasyOCR' },
  { key: 'F1', action: 'Show Shortcuts Help' },
];

export function EnhancedSettings() {
  const [settings, setSettings] = useState<AppSettings>({
    maxHistoryItems: 100,
    autoSave: true,
    defaultEngine: 'both',
    keyboardShortcuts: true,
    language: 'eng',
    preprocessing: {
      contrast: 1.0,
      brightness: 1.0,
      noiseReduction: false,
    },
  });
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const data = loadAppData();
    setSettings(data.settings);
  }, []);

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handlePreprocessingChange = (key: keyof AppSettings['preprocessing'], value: any) => {
    setSettings(prev => ({
      ...prev,
      preprocessing: { ...prev.preprocessing, [key]: value }
    }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    updateSettings(settings);
    setHasChanges(false);
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const resetSettings = () => {
    const defaultSettings: AppSettings = {
      maxHistoryItems: 100,
      autoSave: true,
      defaultEngine: 'both',
      keyboardShortcuts: true,
      language: 'eng',
      preprocessing: {
        contrast: 1.0,
        brightness: 1.0,
        noiseReduction: false,
      },
    };
    setSettings(defaultSettings);
    setHasChanges(true);
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults.",
    });
  };

  const exportSettings = () => {
    const dataStr = exportData();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `screenreader-cv-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully.",
    });
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (importData(content)) {
          const data = loadAppData();
          setSettings(data.settings);
          setHasChanges(false);
          toast({
            title: "Data Imported",
            description: "Your data has been imported successfully.",
          });
        } else {
          toast({
            title: "Import Failed",
            description: "Failed to import data. Please check the file format.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Import Error",
          description: "An error occurred while importing the file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 dark:text-white">
            <Settings className="h-5 w-5" />
            <span>Enhanced Settings</span>
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Configure OCR engines, preprocessing, and application preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Button
              onClick={saveSettings}
              disabled={!hasChanges}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
            <Button
              onClick={resetSettings}
              variant="outline"
              className="flex items-center space-x-2 dark:border-gray-600 dark:text-gray-300"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset to Defaults</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">OCR Configuration</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Configure OCR engines and language settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default-engine" className="dark:text-gray-300">Default Engine</Label>
            <Select
              value={settings.defaultEngine}
              onValueChange={(value) => handleSettingChange('defaultEngine', value as 'tesseract' | 'easyocr' | 'both')}
            >
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectItem value="tesseract">Tesseract Only</SelectItem>
                <SelectItem value="easyocr">EasyOCR Only</SelectItem>
                <SelectItem value="both">Both Engines</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language" className="dark:text-gray-300">OCR Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => handleSettingChange('language', value)}
            >
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Image Preprocessing</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Adjust image enhancement settings for better OCR accuracy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="dark:text-gray-300">
              Contrast: {settings.preprocessing.contrast.toFixed(1)}
            </Label>
            <Slider
              value={[settings.preprocessing.contrast]}
              onValueChange={([value]) => handlePreprocessingChange('contrast', value)}
              min={0.5}
              max={2.0}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="dark:text-gray-300">
              Brightness: {settings.preprocessing.brightness.toFixed(1)}
            </Label>
            <Slider
              value={[settings.preprocessing.brightness]}
              onValueChange={([value]) => handlePreprocessingChange('brightness', value)}
              min={0.5}
              max={2.0}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="noise-reduction"
              checked={settings.preprocessing.noiseReduction}
              onCheckedChange={(checked) => handlePreprocessingChange('noiseReduction', checked)}
            />
            <Label htmlFor="noise-reduction" className="dark:text-gray-300">
              Enable noise reduction
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 dark:text-white">
            <Keyboard className="h-5 w-5" />
            <span>Keyboard Shortcuts</span>
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Configure keyboard shortcuts and view available hotkeys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="keyboard-shortcuts"
              checked={settings.keyboardShortcuts}
              onCheckedChange={(checked) => handleSettingChange('keyboardShortcuts', checked)}
            />
            <Label htmlFor="keyboard-shortcuts" className="dark:text-gray-300">
              Enable keyboard shortcuts
            </Label>
          </div>

          <Separator className="dark:border-gray-600" />

          <div className="space-y-2">
            <Label className="text-sm font-medium dark:text-gray-300">Available Shortcuts</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {keyboardShortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm dark:text-gray-300">{shortcut.action}</span>
                  <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                    {shortcut.key}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Application Settings</CardTitle>
          <CardDescription className="dark:text-gray-400">
            General application preferences and data management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="max-history" className="dark:text-gray-300">
              Maximum History Items: {settings.maxHistoryItems}
            </Label>
            <Slider
              value={[settings.maxHistoryItems]}
              onValueChange={([value]) => handleSettingChange('maxHistoryItems', value)}
              min={10}
              max={500}
              step={10}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto-save"
              checked={settings.autoSave}
              onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
            />
            <Label htmlFor="auto-save" className="dark:text-gray-300">
              Automatically save OCR results to history
            </Label>
          </div>

          <Separator className="dark:border-gray-600" />

          <div className="space-y-2">
            <Label className="text-sm font-medium dark:text-gray-300">Data Management</Label>
            <div className="flex items-center space-x-2">
              <Button
                onClick={exportSettings}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 dark:border-gray-600 dark:text-gray-300"
              >
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
              <div>
                <input
                  id="import-file"
                  type="file"
                  accept=".json"
                  onChange={importSettings}
                  className="hidden"
                />
                <Button
                  onClick={() => document.getElementById('import-file')?.click()}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 dark:border-gray-600 dark:text-gray-300"
                >
                  <Upload className="h-4 w-4" />
                  <span>Import Data</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
